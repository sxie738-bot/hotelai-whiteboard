// 相机特效：保留原相机画质，仅提供「亮度」与「瘦脸」调整 + 自拍镜像 + 等比裁剪。
// 瘦脸采用中心收缩（pinch warp），无需人脸关键点模型，零额外网络依赖。

class CameraFX {
  constructor(canvas) {
    this.canvas = canvas;
    const opts = { preserveDrawingBuffer: true, premultipliedAlpha: false, alpha: false };
    this.gl = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
    if (!this.gl) throw new Error('当前浏览器不支持 WebGL');
    this.video = null;
    this._initGL();
  }

  _initGL() {
    const gl = this.gl;
    const vsSrc = `
      attribute vec2 a_pos;
      attribute vec2 a_uv;
      varying vec2 v_uv;
      void main() {
        v_uv = a_uv;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }`;
    const fsSrc = `
      precision mediump float;
      varying vec2 v_uv;
      uniform sampler2D u_tex;
      uniform float u_bright;
      uniform float u_slim;
      uniform float u_mirror;
      uniform float u_texAspect;
      uniform float u_viewAspect;

      vec2 coverUV(vec2 uv) {
        vec2 scale = vec2(1.0);
        if (u_viewAspect > u_texAspect) scale.y = u_texAspect / u_viewAspect;
        else scale.x = u_viewAspect / u_texAspect;
        return (uv - 0.5) * scale + 0.5;
      }

      void main() {
        vec2 uv = coverUV(v_uv);
        if (u_mirror > 0.5) uv.x = 1.0 - uv.x;

        // 瘦脸：以画面中心为轴，向中心收缩（椭圆衰减，只作用于中部人像区域）
        vec2 c = uv - 0.5;
        float r = length(c / vec2(0.58, 0.72));
        float amt = u_slim * 0.16 * smoothstep(1.05, 0.1, r);
        uv -= c * amt;

        vec3 col = texture2D(u_tex, uv).rgb;

        // 亮度：轻度 gamma 提升中间调，避免死白
        col = pow(max(col, 0.0), vec3(1.0 - u_bright * 0.35)) * (1.0 + u_bright * 0.45);

        gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
      }`;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    this.prog = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 0, 0,  1, -1, 1, 0,  -1, 1, 0, 1,  1, 1, 1, 1
    ]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    const aUv = gl.getAttribLocation(prog, 'a_uv');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 16, 8);

    this.u = {
      tex: gl.getUniformLocation(prog, 'u_tex'),
      bright: gl.getUniformLocation(prog, 'u_bright'),
      slim: gl.getUniformLocation(prog, 'u_slim'),
      mirror: gl.getUniformLocation(prog, 'u_mirror'),
      texAspect: gl.getUniformLocation(prog, 'u_texAspect'),
      viewAspect: gl.getUniformLocation(prog, 'u_viewAspect'),
    };

    this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.uniform1i(this.u.tex, 0);
  }

  setSource(videoEl) { this.video = videoEl; }

  setSize(w, h) {
    w = Math.max(2, Math.round(w));
    h = Math.max(2, Math.round(h));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w; this.canvas.height = h;
    }
    this.gl.viewport(0, 0, w, h);
  }

  render(params) {
    const gl = this.gl, v = this.video;
    if (!v || v.readyState < 2 || !v.videoWidth) return;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, v);
    } catch (e) { return; }

    gl.uniform1f(this.u.bright, params.bright ?? 0.0);
    gl.uniform1f(this.u.slim, params.slim ?? 0.0);
    gl.uniform1f(this.u.mirror, params.mirror ? 1 : 0);
    gl.uniform1f(this.u.texAspect, v.videoWidth / v.videoHeight);
    gl.uniform1f(this.u.viewAspect, this.canvas.width / this.canvas.height);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

window.CameraFX = CameraFX;

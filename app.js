(function () {
  'use strict';

  // ---------- 图标（统一线性 SVG，高级感） ----------
  const ICONS = {
    pen: '<path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/><path d="M15 5l3 3"/>',
    highlighter: '<path d="M9 11l-6 6v3h3l6-6"/><path d="M21 4l-4 4-3-3 4-4a1.4 1.4 0 0 1 2 0l1 1a1.4 1.4 0 0 1 0 2z"/>',
    eraser: '<path d="M7 21h13"/><path d="M10.5 4.5 20 14a2 2 0 0 1 0 3l-7 7a2 2 0 0 1-3 0l-7-7a2 2 0 0 1 0-3Z"/>',
    shape: '<rect x="4" y="4" width="16" height="16" rx="2"/>',
    sticker: '<path d="M12 3l2.4 5.3 5.6.6-4.2 3.9 1.2 5.6L12 16.9 6.9 19l1.2-5.6L3.9 8.9l5.6-.6z"/>',
    text: '<path d="M5 6V4h14v2"/><path d="M12 4v16"/><path d="M9 20h6"/>',
    bg: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    size: '<path d="M4 7h11"/><path d="M4 12h7"/><path d="M4 17h14"/>',
    undo: '<path d="M9 7 4 12l5 5"/><path d="M4 12h11a5 5 0 0 1 0 10h-1"/>',
    redo: '<path d="M15 7l5 5-5 5"/><path d="M20 12H9a5 5 0 0 0 0 10h1"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
    pause: '<rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/>',
    play: '<path d="M7 5l12 7-12 7z"/>',
    's-rect': '<rect x="4" y="6" width="16" height="12" rx="1"/>',
    's-circle': '<circle cx="12" cy="12" r="8"/>',
    's-line': '<path d="M5 19 19 5"/>',
    's-arrow': '<path d="M5 19 19 5"/><path d="M11 5h8v8"/>',
    's-triangle': '<path d="M12 4l8 16H4z"/>',
    photo: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21h16z"/><circle cx="18" cy="6" r="1" fill="currentColor"/>',
    video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    template: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M7 10h10M7 17h10"/>',
  };
  const svgIcon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
  function injectIcons() {
    document.querySelectorAll('.ico').forEach((el) => { el.innerHTML = svgIcon(el.dataset.i); });
  }

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);
  const board = $('board');
  const bctx = board.getContext('2d');
  const camBubble = $('camBubble');
  const camGL = $('camGL');
  const camResize = $('camResize');
  const recBtn = $('btnRecord');
  const recTimer = $('recTimer');
  const countdown = $('countdown');
  const preview = $('preview');
  const prevVideo = $('prevVideo');
  const previewHint = $('previewHint');
  const startOverlay = $('startOverlay');
  const brandBar = $('brandBar');
  const tele = $('tele');
  const cameraPanel = $('cameraPanel');
  const textInput = $('textInput');
  const bgGrid = $('bgGrid');
  const topbar = $('topbar');
  const toolbar = $('toolbar');

  // ---------- 状态 ----------
  const BGS = [
    { id: 'white',   name: '纯白',   color: '#ffffff', type: 'none' },
    { id: 'grid',    name: '方格',   color: '#ffffff', type: 'grid', line: '#e5e7eb' },
    { id: 'dots',    name: '点阵',   color: '#ffffff', type: 'dots', line: '#cbd5e1' },
    { id: 'lines',   name: '横线',   color: '#ffffff', type: 'lines', line: '#cbd5e1' },
    { id: 'paper',   name: '米黄',   color: '#fdf6e3', type: 'lines', line: '#e7d9b8' },
    { id: 'black',   name: '黑网格', color: '#0f172a', type: 'grid', line: '#334155' },
    { id: 'brand',   name: '专属蓝', color: '#eff6ff', type: 'grid', line: '#bfdbfe' },
    { id: 'brandgrad', name: '蓝渐变', color: '#dbeafe', grad: ['#dbeafe', '#ffffff'], type: 'none' },
    { id: 'pink',    name: '樱粉',   color: '#fdf2f8', type: 'grid', line: '#fbcfe8' },
    { id: 'mint',    name: '薄荷',   color: '#ecfdf5', type: 'grid', line: '#a7f3d0' },
    { id: 'orange',  name: '香橙',   color: '#fff7ed', type: 'grid', line: '#fed7aa' },
    { id: 'gray',    name: '浅灰',   color: '#f1f5f9', type: 'grid', line: '#cbd5e1' },
  ];

  const state = {
    cameraOn: false, camReady: false,
    recording: false, paused: false,
    items: [], redo: [],
    tool: 'pen', color: '#111827',
    sizeIdx: 1, sizes: [0.6, 1, 1.7, 2.6],
    pendingShape: 'rect', pendingSticker: '⭐', pendingTemplate: null,
    bg: BGS[0],
    zoom: 1, panX: 0, panY: 0,
    tempTextPos: null,
    screenTextPos: null,
    editingItem: null,
    selected: null,
    cam: { bright: 0.12, slim: 0, mirror: true },
    restoring: false,
    started: false,
  };

  const video = document.createElement('video');
  video.muted = true; video.playsInline = true; video.autoplay = true;
  video.setAttribute('playsinline', ''); video.setAttribute('webkit-playsinline', '');
  // 关键：把摄像头原始 video 真正“绘制”在气泡里（位于 WebGL 画布下层）。
  // iOS 对未参与渲染(脱离文档/1px/opacity:0)的 video 会在 ~10s 后停止推帧 → 录制画面卡死；
  // 让它实际铺满气泡被绘制（即使被上层 WebGL 盖住），iOS 才会持续送帧。
  video.id = 'camVideo';
  video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;';
  camBubble.insertBefore(video, camGL);
  // 摄像头意外暂停/停滞时自动恢复播放，兜底防止录制中途卡死
  ['stalled', 'suspend', 'pause'].forEach((ev) => {
    video.addEventListener(ev, () => { if (state.cameraOn) video.play().catch(() => {}); });
  });
  let micStream = null, fx = null;
  let recordCanvas, rctx, recorder = null, recChunks = [], recBlob = null, recUrl = null;
  let recStart = 0, timerInt = null, recordInt = null, camKeepInt = null, recVideoTrack = null;
  let cur = null, dragItem = null;
  let tapInfo = { time: 0, item: null, sx: 0, sy: 0 };
  let pointers = {}, pinch = null;

  // ---------- 画板 ----------
  function setupBoard() {
    const w = window.innerWidth, h = window.innerHeight;
    const scale = w <= 720 ? 720 / w : Math.min(1, 1080 / w);
    board.width = Math.round(w * scale);
    board.height = Math.round(h * scale);
    Object.assign(board.style, {
      width: '100%', height: '100%', left: '0px', top: '0px', right: 'auto', bottom: 'auto',
    });
    bctx.lineCap = 'round'; bctx.lineJoin = 'round';
    redrawAll();
  }

  function toCanvas(e) {
    const r = board.getBoundingClientRect();
    const sx = (e.clientX - r.left) * (board.width / r.width);
    const sy = (e.clientY - r.top) * (board.height / r.height);
    return {
      x: (sx - state.panX) / state.zoom,
      y: (sy - state.panY) / state.zoom,
    };
  }

  const strokeWidth = () => board.width * (state.tool === 'highlighter' ? 0.02 : state.tool === 'eraser' ? 0.03 : 0.0055) * state.sizes[state.sizeIdx];
  const shapeWidth = () => board.width * 0.006 * state.sizes[state.sizeIdx];
  const stickerSize = () => board.width * 0.09;
  const textSize = () => board.width * 0.045 * (0.7 + state.sizeIdx * 0.2);

  // ---------- 背景（绘制进画布像素 → 自动被录制） ----------
  function drawBg() {
    const g = state.bg, W = board.width, H = board.height;
    // 背景底色必须填充整个画布（与缩放/平移无关），否则透明边缘会在录制时叠加成拖影
    bctx.save();
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.globalCompositeOperation = 'source-over';
    bctx.globalAlpha = 1;
    if (g.grad) {
      const grd = bctx.createLinearGradient(0, 0, W, H);
      grd.addColorStop(0, g.grad[0]); grd.addColorStop(1, g.grad[1]);
      bctx.fillStyle = grd; bctx.fillRect(0, 0, W, H);
    } else {
      bctx.fillStyle = g.color; bctx.fillRect(0, 0, W, H);
    }
    bctx.restore();
    const line = g.line || '#e5e7eb';
    if (g.type === 'grid') {
      const s = W / 22;
      bctx.strokeStyle = line; bctx.lineWidth = Math.max(1, W / 700);
      bctx.beginPath();
      for (let x = 0; x <= W; x += s) { bctx.moveTo(x, 0); bctx.lineTo(x, H); }
      for (let y = 0; y <= H; y += s) { bctx.moveTo(0, y); bctx.lineTo(W, y); }
      bctx.stroke();
    } else if (g.type === 'dots') {
      const s = W / 22;
      bctx.fillStyle = line;
      for (let x = s / 2; x < W; x += s)
        for (let y = s / 2; y < H; y += s) { bctx.beginPath(); bctx.arc(x, y, Math.max(1.5, W / 520), 0, 7); bctx.fill(); }
    } else if (g.type === 'lines') {
      const s = W / 30;
      bctx.strokeStyle = line; bctx.lineWidth = Math.max(1, W / 700);
      bctx.beginPath();
      for (let y = s; y <= H; y += s) { bctx.moveTo(0, y); bctx.lineTo(W, y); }
      bctx.stroke();
    }

    // 品牌条由 redrawAll 在 reset transform 后单独调用，不受缩放影响
  }

  // 顶部品牌条：蓝白渐变 + 左侧「H HOTELAI」+ 右侧胶囊「酒店 AI 谢瑷曈」
  function drawBrandBar(W, H) {
    const offsetY = Math.round(H * 0.03); // 顶部留白 3%
    const barH = Math.max(48, Math.round(H * 0.075));
    // 1) 蓝白渐变背景
    const grd = bctx.createLinearGradient(0, offsetY, W, offsetY);
    grd.addColorStop(0.00, '#1e3a8a');
    grd.addColorStop(0.60, '#2563eb');
    grd.addColorStop(1.00, '#3b82f6');
    bctx.fillStyle = grd;
    bctx.fillRect(0, offsetY, W, barH);

    // 2) 左侧：H 方块 + HOTELAI 文字
    const sideMargin = Math.max(12, Math.round(barH * 0.47));
    const markSize = Math.round(barH * 0.50);
    const markX = Math.round(sideMargin * 0.75);
    const markY = offsetY + (barH - markSize) / 2;
    // H 方块（半透明白底）
    bctx.fillStyle = 'rgba(255,255,255,0.16)';
    roundRectF(bctx, markX, markY, markSize, markSize, Math.round(markSize * 0.23));
    bctx.fill();
    bctx.strokeStyle = 'rgba(255,255,255,0.50)';
    bctx.lineWidth = Math.max(1, W / 800);
    roundRectF(bctx, markX, markY, markSize, markSize, Math.round(markSize * 0.23));
    bctx.stroke();
    // H 字
    bctx.fillStyle = '#ffffff';
    bctx.font = `900 ${Math.round(markSize * 0.60)}px -apple-system, "PingFang SC", "Segoe UI", sans-serif`;
    bctx.textAlign = 'center';
    bctx.textBaseline = 'middle';
    bctx.fillText('H', markX + markSize / 2, markY + markSize / 2 + markSize * 0.02);

    // HOTELAI 文字
    const textX = markX + markSize + Math.round(markSize * 0.28);
    const fontSize = Math.max(13, Math.round(barH * 0.28));
    bctx.font = `800 ${fontSize}px -apple-system, "PingFang SC", "Segoe UI", sans-serif`;
    bctx.textAlign = 'left';
    bctx.textBaseline = 'middle';
    bctx.fillStyle = '#ffffff';
    bctx.shadowColor = 'rgba(0,0,0,0.22)';
    bctx.shadowBlur = Math.max(1.5, Math.round(W / 280));
    bctx.shadowOffsetY = 1;
    bctx.fillText('HOTELAI', textX, offsetY + barH / 2);
    bctx.shadowColor = 'transparent';
    bctx.shadowBlur = 0;
    bctx.shadowOffsetY = 0;

    // 3) 右侧：胶囊「酒店 AI 谢瑷曈」
    const pillText = '酒店 AI 谢瑷曈';
    const pillFontSize = Math.max(11, Math.round(barH * 0.25));
    bctx.font = `600 ${pillFontSize}px -apple-system, "PingFang SC", "Segoe UI", sans-serif`;
    const pillTextW = bctx.measureText(pillText).width;
    const pillPadX = Math.max(10, Math.round(pillFontSize * 0.80));
    const pillH = Math.round(pillFontSize * 1.80);
    const pillW = pillTextW + pillPadX * 2;
    const pillX = W - sideMargin - pillW;
    const pillY = offsetY + (barH - pillH) / 2;
    // 胶囊描边
    bctx.strokeStyle = 'rgba(255,255,255,0.50)';
    bctx.lineWidth = Math.max(0.8, W / 800);
    roundRectF(bctx, pillX, pillY, pillW, pillH, pillH / 2);
    bctx.stroke();
    // 胶囊半透明白底
    bctx.fillStyle = 'rgba(255,255,255,0.10)';
    roundRectF(bctx, pillX, pillY, pillW, pillH, pillH / 2);
    bctx.fill();
    // 胶囊文字
    bctx.fillStyle = '#ffffff';
    bctx.textAlign = 'center';
    bctx.textBaseline = 'middle';
    bctx.fillText(pillText, pillX + pillW / 2, pillY + pillH / 2 + pillFontSize * 0.03);
  }

  function roundRectF(ctx, x, y, w, h, r) {
    const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  // ---------- 图形 / 文字绘制 ----------
  function applyStroke(s) {
    bctx.globalCompositeOperation = 'source-over';
    if (s.mode === 'erase') {
      bctx.globalAlpha = 1; bctx.strokeStyle = state.bg.color; bctx.lineWidth = s.width;
    } else {
      bctx.globalAlpha = s.tool === 'highlighter' ? 0.32 : 1;
      bctx.strokeStyle = s.color; bctx.lineWidth = s.width;
    }
  }

  function drawShape(it) {
    bctx.globalCompositeOperation = 'source-over';
    bctx.globalAlpha = 1;
    bctx.strokeStyle = it.color; bctx.lineWidth = it.width;
    bctx.lineCap = 'round'; bctx.lineJoin = 'round';
    const { x0, y0, x1, y1 } = it;
    if (it.shape === 'rect') {
      bctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    } else if (it.shape === 'line') {
      bctx.beginPath(); bctx.moveTo(x0, y0); bctx.lineTo(x1, y1); bctx.stroke();
    } else if (it.shape === 'circle') {
      bctx.beginPath();
      bctx.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2, 0, 0, Math.PI * 2);
      bctx.stroke();
    } else if (it.shape === 'triangle') {
      bctx.beginPath();
      bctx.moveTo((x0 + x1) / 2, y0); bctx.lineTo(x1, y1); bctx.lineTo(x0, y1); bctx.closePath();
      bctx.stroke();
    } else if (it.shape === 'arrow') {
      bctx.beginPath(); bctx.moveTo(x0, y0); bctx.lineTo(x1, y1); bctx.stroke();
      const ang = Math.atan2(y1 - y0, x1 - x0);
      const head = Math.min(board.width * 0.03, Math.hypot(x1 - x0, y1 - y0) * 0.3);
      bctx.beginPath();
      bctx.moveTo(x1, y1);
      bctx.lineTo(x1 - head * Math.cos(ang - Math.PI / 6), y1 - head * Math.sin(ang - Math.PI / 6));
      bctx.moveTo(x1, y1);
      bctx.lineTo(x1 - head * Math.cos(ang + Math.PI / 6), y1 - head * Math.sin(ang + Math.PI / 6));
      bctx.stroke();
    }
  }

  function drawText(it) {
    bctx.globalCompositeOperation = 'source-over';
    bctx.globalAlpha = 1;
    bctx.fillStyle = it.color;
    bctx.font = 'bold ' + it.size + 'px sans-serif';
    bctx.textAlign = 'center'; bctx.textBaseline = 'middle';
    bctx.fillText(it.text, it.x, it.y);
  }

  // 贴纸渲染：emoji / 芯片 / IP 形象
  function drawSticker(it) {
    bctx.globalCompositeOperation = 'source-over';
    bctx.globalAlpha = 1;
    if (it.img && it.img.complete) {
      // IP 形象（保持比例）
      bctx.drawImage(it.img, it.x - it.w / 2, it.y - it.h / 2, it.w, it.h);
    } else if (it.bg && it.text) {
      // 价格芯片（圆角矩形 + 文字）
      const r = it.h * 0.18;
      bctx.fillStyle = it.bg;
      roundRectF(bctx, it.x - it.w / 2, it.y - it.h / 2, it.w, it.h, r);
      bctx.fill();
      bctx.fillStyle = it.fg || '#fff';
      bctx.font = `700 ${it.fontSize || 32}px -apple-system, "PingFang SC", "Segoe UI", sans-serif`;
      bctx.textAlign = 'center';
      bctx.textBaseline = 'middle';
      bctx.fillText(it.text, it.x, it.y);
    } else if (it.emoji) {
      // emoji
      bctx.font = `900 ${it.h}px sans-serif`;
      bctx.textAlign = 'center';
      bctx.textBaseline = 'middle';
      bctx.fillText(it.text, it.x, it.y);
    }
  }

  function handlePos(it) {
    if (it.kind === 'text') {
      const w = bctx.measureText(it.text).width, h = it.size;
      return { x: it.x + w / 2, y: it.y + h / 2 };
    }
    if (it.kind === 'shape') return { x: it.x1, y: it.y1 };
    if (it.kind === 'image' || it.kind === 'video') return { x: it.x + it.w / 2, y: it.y + it.h / 2 };
    if (it.kind === 'sticker') return { x: it.x + it.w / 2, y: it.y + it.h / 2 };
    if (it.kind === 'group') return { x: it.x + it.w / 2, y: it.y + it.h / 2 };
    return null;
  }

  function drawSelection() {
    const it = state.selected;
    if (!it) return;
    let x0, y0, x1, y1;
    if (it.kind === 'text') {
      const w = bctx.measureText(it.text).width, h = it.size;
      x0 = it.x - w / 2; y0 = it.y - h / 2; x1 = it.x + w / 2; y1 = it.y + h / 2;
    } else if (it.kind === 'shape') {
      x0 = Math.min(it.x0, it.x1); y0 = Math.min(it.y0, it.y1);
      x1 = Math.max(it.x0, it.x1); y1 = Math.max(it.y0, it.y1);
    } else if (it.kind === 'sticker') {
      x0 = it.x - it.w / 2; y0 = it.y - it.h / 2; x1 = it.x + it.w / 2; y1 = it.y + it.h / 2;
    } else if (it.kind === 'image' || it.kind === 'video') {
      x0 = it.x - it.w / 2; y0 = it.y - it.h / 2; x1 = it.x + it.w / 2; y1 = it.y + it.h / 2;
    } else if (it.kind === 'group') {
      x0 = it.x - it.w / 2; y0 = it.y - it.h / 2; x1 = it.x + it.w / 2; y1 = it.y + it.h / 2;
    } else return;
    bctx.save();
    bctx.globalCompositeOperation = 'source-over'; bctx.globalAlpha = 1;
    bctx.strokeStyle = '#2563eb'; bctx.lineWidth = Math.max(2, board.width / 400);
    bctx.setLineDash([board.width / 120, board.width / 120]);
    bctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    bctx.setLineDash([]);
    const hp = handlePos(it);
    const hs = board.width * 0.022;
    bctx.fillStyle = '#2563eb';
    bctx.fillRect(hp.x - hs / 2, hp.y - hs / 2, hs, hs);
    bctx.restore();
  }

  function redrawAll() {
    bctx.setTransform(state.zoom, 0, 0, state.zoom, state.panX, state.panY);
    drawBg();
    for (const it of state.items) {
      if (it.kind === 'stroke') {
        if (it.points.length < 1) continue;
        applyStroke(it);
        bctx.beginPath();
        bctx.moveTo(it.points[0].x, it.points[0].y);
        for (let i = 1; i < it.points.length; i++) bctx.lineTo(it.points[i].x, it.points[i].y);
        if (it.points.length === 1) bctx.lineTo(it.points[0].x + 0.1, it.points[0].y + 0.1);
        bctx.stroke();
      } else if (it.kind === 'shape') { drawShape(it); }
      else if (it.kind === 'sticker') { drawSticker(it); }
      else if (it.kind === 'text') { drawText(it); }
      else if (it.kind === 'image' && it.img && it.loaded) {
        bctx.globalAlpha = 1;
        bctx.drawImage(it.img, it.x - it.w / 2, it.y - it.h / 2, it.w, it.h);
      }
      else if (it.kind === 'video' && it.video && it.video.readyState >= 2) {
        bctx.globalAlpha = 1;
        bctx.drawImage(it.video, it.x - it.w / 2, it.y - it.h / 2, it.w, it.h);
      }
      else if (it.kind === 'group') {
        for (const c of it.children) {
          if (c.kind === 'stroke') {
            if (c.points.length < 1) continue;
            applyStroke(c);
            bctx.beginPath();
            bctx.moveTo(c.points[0].x, c.points[0].y);
            for (let i = 1; i < c.points.length; i++) bctx.lineTo(c.points[i].x, c.points[i].y);
            bctx.stroke();
          } else if (c.kind === 'shape') { drawShape(c); }
          else if (c.kind === 'sticker') { drawSticker(c); }
          else if (c.kind === 'text') { drawText(c); }
        }
      }
    }
    drawSelection();
    bctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    // 品牌条固定在顶部，不受缩放/平移影响
    drawBrandBar(board.width, board.height);
    if (!state.restoring && state.started && board.width) scheduleSave();
  }

  // ---------- 自动保存 / 恢复（localStorage，下次打开自动还原画板） ----------
  const STORAGE_KEY = 'hotelai_wb_v1';
  let saveTimer = null;

  function serializeItem(it) {
    if (it.kind === 'image') {
      return { kind: 'image', src: it.src || (it.img && it.img.src) || '', x: it.x, y: it.y, w: it.w, h: it.h };
    }
    if (it.kind === 'sticker') {
      const o = { kind: 'sticker', x: it.x, y: it.y, w: it.w, h: it.h };
      if (it.img) o.src = it.src || (it.img && it.img.src) || '';
      if (it.text != null) o.text = it.text;
      if (it.emoji) o.emoji = true;
      if (it.bg) o.bg = it.bg;
      if (it.fg) o.fg = it.fg;
      if (it.fontSize) o.fontSize = it.fontSize;
      return o;
    }
    if (it.kind === 'group') {
      return { kind: 'group', x: it.x, y: it.y, w: it.w, h: it.h, children: it.children.filter(c => c.kind !== 'video').map(serializeItem) };
    }
    return { ...it }; // stroke / shape / text 均为纯数据
  }
  function serializeItems(arr) { return arr.filter(it => it.kind !== 'video').map(serializeItem); }

  function restoreItem(d, sx, sy) {
    const X = (v) => v * sx, Y = (v) => v * sy;
    if (!d) return null;
    if (d.kind === 'image') {
      const it = { kind: 'image', x: X(d.x), y: Y(d.y), w: X(d.w), h: Y(d.h), loaded: false };
      if (d.src) {
        it.src = d.src;
        const img = new Image();
        img.onload = () => { it.img = img; it.loaded = true; if (!state.restoring) redrawAll(); };
        img.onerror = () => {};
        img.src = d.src;
        it.img = img;
      }
      return it;
    }
    if (d.kind === 'sticker') {
      const it = { kind: 'sticker', x: X(d.x), y: Y(d.y), w: X(d.w), h: Y(d.h) };
      if (d.src) {
        it.src = d.src;
        const img = new Image();
        img.onload = () => { it.img = img; if (!state.restoring) redrawAll(); };
        img.onerror = () => {};
        img.src = d.src;
        it.img = img;
      }
      if (d.text != null) it.text = d.text;
      if (d.emoji) it.emoji = true;
      if (d.bg) it.bg = d.bg;
      if (d.fg) it.fg = d.fg;
      if (d.fontSize) it.fontSize = Math.round(d.fontSize * sx);
      return it;
    }
    if (d.kind === 'group') {
      return { kind: 'group', x: X(d.x), y: Y(d.y), w: X(d.w), h: Y(d.h), children: (d.children || []).map(c => restoreItem(c, sx, sy)).filter(Boolean) };
    }
    if (d.kind === 'stroke') {
      return { kind: 'stroke', tool: d.tool, color: d.color, width: X(d.width), mode: d.mode, points: (d.points || []).map(p => ({ x: X(p.x), y: Y(p.y) })) };
    }
    if (d.kind === 'shape') {
      return { kind: 'shape', shape: d.shape, color: d.color, width: X(d.width), x0: X(d.x0), y0: Y(d.y0), x1: X(d.x1), y1: Y(d.y1) };
    }
    if (d.kind === 'text') {
      return { kind: 'text', text: d.text, x: X(d.x), y: Y(d.y), size: X(d.size), color: d.color };
    }
    return null;
  }

  function restoreBoard() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.items)) return;
      const sx = data.bw ? board.width / data.bw : 1;
      const sy = data.bh ? board.height / data.bh : 1;
      state.items = data.items.map(d => restoreItem(d, sx, sy)).filter(Boolean);
      state.redo = [];
      if (data.bgId) state.bg = BGS.find(b => b.id === data.bgId) || BGS[0];
      if (typeof data.zoom === 'number') state.zoom = data.zoom;
      if (typeof data.panX === 'number') state.panX = data.panX * sx;
      if (typeof data.panY === 'number') state.panY = data.panY * sy;
      redrawAll();
      if (state.items.length) showToast('已恢复上次的画板内容');
    } catch (e) { console.warn('restore failed:', e); }
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(doSave, 500);
  }
  function doSave(stripImages) {
    try {
      if (!state.started || !board.width) return;
      let items = serializeItems(state.items);
      if (stripImages) items = items.filter(it => it.kind !== 'image');
      const data = { v: 1, bw: board.width, bh: board.height, bgId: state.bg && state.bg.id, zoom: state.zoom, panX: state.panX, panY: state.panY, items };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      if (!stripImages && e && (e.name === 'QuotaExceededError' || e.code === 22)) {
        try { doSave(true); } catch (_) {} // 容量超限：退一步，丢弃照片类数据再存
      } else {
        console.warn('save failed:', e);
      }
    }
  }
  window.addEventListener('beforeunload', () => doSave());

  function showToast(msg) {
    try {
      const t = document.createElement('div');
      t.textContent = msg;
      t.style.cssText = 'position:fixed;left:50%;top:14%;transform:translateX(-50%);background:rgba(15,23,42,.82);color:#fff;font:500 14px -apple-system,"PingFang SC",sans-serif;padding:9px 16px;border-radius:999px;z-index:9999;pointer-events:none;box-shadow:0 6px 20px rgba(0,0,0,.25);max-width:80vw;text-align:center';
      document.body.appendChild(t);
      setTimeout(() => { t.style.transition = 'opacity .4s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 420); }, 2200);
    } catch (_) {}
  }

  function pushItem(it) { state.items.push(it); state.redo = []; redrawAll(); return it; }

  function hitTest(p) {
    for (let i = state.items.length - 1; i >= 0; i--) {
      const it = state.items[i];
      if (it.kind === 'group') {
        if (Math.abs(p.x - it.x) <= it.w / 2 + 6 && Math.abs(p.y - it.y) <= it.h / 2 + 6) return it;
      } else if (it.kind === 'sticker') {
        if (Math.abs(p.x - it.x) <= it.w / 2 + 8 && Math.abs(p.y - it.y) <= it.h / 2 + 8) return it;
      } else if (it.kind === 'shape') {
        const minX = Math.min(it.x0, it.x1) - 14, maxX = Math.max(it.x0, it.x1) + 14;
        const minY = Math.min(it.y0, it.y1) - 14, maxY = Math.max(it.y0, it.y1) + 14;
        if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) return it;
      } else if (it.kind === 'text') {
        const w = bctx.measureText(it.text).width, h = it.size;
        if (Math.abs(p.x - it.x) <= w / 2 + h * 0.3 && Math.abs(p.y - it.y) <= h) return it;
      } else if (it.kind === 'image' || it.kind === 'video') {
        if (Math.abs(p.x - it.x) <= it.w / 2 + 10 && Math.abs(p.y - it.y) <= it.h / 2 + 10) return it;
      }
    }
    return null;
  }

  // ---------- 指针交互（直接选中 / 挪动 / 缩放，无需独立移动工具）+ 双指缩放 ----------
  board.addEventListener('pointerdown', (e) => {
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    const ids = Object.keys(pointers);
    if (ids.length >= 2) {
      // 双指缩放
      const a = pointers[ids[ids.length-2]], b = pointers[ids[ids.length-1]];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      pinch = {
        d, zoom: state.zoom, panX: state.panX, panY: state.panY,
        cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2,
      };
      cur = null; dragItem = null;
      return;
    }
    if (pinch) return; // 还在双指状态中

    const p = toCanvas(e);
    closePopovers();
    if (state.selected) {
      const hp = handlePos(state.selected);
      if (hp && Math.hypot(p.x - hp.x, p.y - hp.y) <= Math.max(24, board.width * 0.035)) {
        dragItem = { item: state.selected, mode: 'resize', lastX: p.x, lastY: p.y };
        board.setPointerCapture(e.pointerId);
        return;
      }
    }
    const hit = hitTest(p);
    if (hit) {
      state.selected = hit;
      dragItem = { item: hit, mode: 'move', lastX: p.x, lastY: p.y };
      tapInfo.sx = e.clientX; tapInfo.sy = e.clientY; tapInfo.item = hit; tapInfo.time = Date.now();
      board.setPointerCapture(e.pointerId);
      redrawAll();
      return;
    }
    state.selected = null;
    if (state.tool === 'shape') {
      cur = { kind: 'shape', shape: state.pendingShape, color: state.color, width: shapeWidth(), x0: p.x, y0: p.y, x1: p.x, y1: p.y };
      board.setPointerCapture(e.pointerId);
      return;
    }
    if (state.tool === 'sticker' && state.pendingSticker) {
      const ps = state.pendingSticker;
      const item = { kind: 'sticker', x: p.x, y: p.y, w: ps.w || 60, h: ps.h || 60 };
      if (ps.type === 'image') {
        // 使用预加载的 IP 形象
        item.img = avatarImg;
        item.src = ps.src; // 持久化用，重开后可按路径重建
        item.w = ps.w; item.h = ps.h;
      } else if (ps.type === 'chip') {
        item.text = ps.text; item.bg = ps.bg; item.fg = ps.fg; item.fontSize = ps.fontSize;
      } else {
        // emoji
        item.text = ps.text; item.emoji = true; item.w = 60; item.h = 60;
      }
      const it = pushItem(item);
      state.selected = it;
      return;
    }
    if (state.pendingTemplate) {
      placeTemplate(state.pendingTemplate, p);
      return;
    }
    if (state.tool === 'text') {
      // 如果已有输入框在编辑中，不重复打开
      if (!textInput.classList.contains('hidden')) { confirmText(); return; }
      state.tempTextPos = p;
      state.screenTextPos = { x: e.clientX, y: e.clientY };
      openTextModal();
      return;
    }
    const width = strokeWidth();
    cur = {
      kind: 'stroke', tool: state.tool,
      color: state.color, width, mode: state.tool === 'eraser' ? 'erase' : 'draw', points: [p],
    };
    applyStroke(cur);
    bctx.beginPath(); bctx.moveTo(p.x, p.y); bctx.lineTo(p.x + 0.1, p.y + 0.1); bctx.stroke();
    board.setPointerCapture(e.pointerId);
  });

  board.addEventListener('pointermove', (e) => {
    // 更新手指位置
    if (pointers[e.pointerId]) { pointers[e.pointerId].x = e.clientX; pointers[e.pointerId].y = e.clientY; }
    // 双指缩放
    if (pinch) {
      const ids = Object.keys(pointers);
      if (ids.length < 2) return;
      const a = pointers[ids[0]], b = pointers[ids[1]];
      const nd = Math.hypot(a.x - b.x, a.y - b.y);
      if (nd < 8) return;
      const scale = nd / pinch.d;
      state.zoom = Math.max(0.2, Math.min(5, pinch.zoom * scale));
      const fx = pinch.cx / scale;
      state.panX = fx - scale * (fx - pinch.panX) + (a.x + b.x) / 2 - pinch.cx;
      state.panY = pinch.cy - scale * (pinch.cy - pinch.panY) + (a.y + b.y) / 2 - pinch.cy;
      redrawAll();
      return;
    }
    if (!cur && !dragItem) return;
    const p = toCanvas(e);
    if (dragItem) {
      const it = dragItem.item;
      if (dragItem.mode === 'resize') {
        if (it.kind === 'text') {
          it.size = Math.max(board.width * 0.02, Math.min(board.width * 0.22, p.y - (it.y - it.size / 2)));
        } else if (it.kind === 'shape') {
          it.x1 = p.x; it.y1 = p.y;
        } else if (it.kind === 'image' || it.kind === 'video') {
          it.w = Math.max(20, (p.x - it.x) * 2);
          it.h = Math.max(20, (p.y - it.y) * 2);
        } else if (it.kind === 'sticker') {
          it.w = Math.max(20, (p.x - it.x) * 2);
          it.h = Math.max(20, (p.y - it.y) * 2);
        } else if (it.kind === 'group') {
          // 整体缩放：按比例同步所有子元素
          const sx = Math.max(0.2, (p.x - (it.x - it.w / 2)) / it.w);
          const sy = Math.max(0.2, (p.y - (it.y - it.h / 2)) / it.h);
          const s = Math.max(sx, sy);
          const nw = it.w * s, nh = it.h * s;
          for (const c of it.children) {
            if (c.kind === 'shape') {
              c.x0 = it.x + (c.x0 - it.x) * s; c.y0 = it.y + (c.y0 - it.y) * s;
              c.x1 = it.x + (c.x1 - it.x) * s; c.y1 = it.y + (c.y1 - it.y) * s;
              c.width *= s;
            } else if (c.kind === 'text' || c.kind === 'sticker') {
              c.x = it.x + (c.x - it.x) * s; c.y = it.y + (c.y - it.y) * s;
              if (c.size) c.size *= s;
              if (c.w) c.w *= s; if (c.h) c.h *= s;
              if (c.fontSize) c.fontSize *= s;
            }
          }
          it.w = nw; it.h = nh;
        }
        redrawAll();
        return;
      }
      const dx = p.x - dragItem.lastX, dy = p.y - dragItem.lastY;
      if (it.kind === 'sticker') { it.x += dx; it.y += dy; }
      else if (it.kind === 'shape') { it.x0 += dx; it.y0 += dy; it.x1 += dx; it.y1 += dy; }
      else if (it.kind === 'text' || it.kind === 'image' || it.kind === 'video') { it.x += dx; it.y += dy; }
      else if (it.kind === 'group') {
        it.x += dx; it.y += dy;
        for (const c of it.children) {
          if (c.kind === 'shape') { c.x0 += dx; c.y0 += dy; c.x1 += dx; c.y1 += dy; }
          else if (c.kind === 'text' || c.kind === 'sticker') { c.x += dx; c.y += dy; }
        }
      }
      dragItem.lastX = p.x; dragItem.lastY = p.y;
      redrawAll();
      return;
    }
    if (cur.kind === 'stroke') {
      const last = cur.points[cur.points.length - 1];
      applyStroke(cur);
      bctx.beginPath(); bctx.moveTo(last.x, last.y); bctx.lineTo(p.x, p.y); bctx.stroke();
      cur.points.push(p);
    } else if (cur.kind === 'shape') {
      cur.x1 = p.x; cur.y1 = p.y; redrawAll();
    }
  });

  function endPointer(e) {
    delete pointers[e.pointerId];
    if (Object.keys(pointers).length < 2) pinch = null;
    if (cur) { const it = cur; cur = null; state.selected = pushItem(it); }
    if (dragItem && dragItem.mode === 'move') {
      const dist = Math.hypot(e.clientX - tapInfo.sx, e.clientY - tapInfo.sy);
      if (dist < 8) {
        const now = Date.now();
        if (tapInfo.item === dragItem.item && now - tapInfo.time < 320) {
          if (dragItem.item.kind === 'text') openEdit(dragItem.item);
          tapInfo.item = null; tapInfo.time = 0;
        } else {
          tapInfo.item = dragItem.item; tapInfo.time = now;
        }
      }
    }
    dragItem = null; redrawAll();
  }
  board.addEventListener('pointerup', endPointer);
  board.addEventListener('pointercancel', endPointer);

  // ---------- 工具栏 ----------
  document.querySelectorAll('.tool[data-tool]').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.tool').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      state.tool = b.dataset.tool;
      state.selected = null; redrawAll();
      if (state.tool === 'shape') openPopover('shapePanel');
      else if (state.tool === 'sticker') openPopover('stickerPanel');
      else closePopovers();
    });
  });
  $('colorPick').addEventListener('input', (e) => { state.color = e.target.value; });
  $('btnUndo').addEventListener('click', () => { if (state.items.length) { state.redo.push(state.items.pop()); state.selected = null; redrawAll(); } });
  $('btnRedo').addEventListener('click', () => { if (state.redo.length) { state.items.push(state.redo.pop()); state.selected = null; redrawAll(); } });
  $('btnClear').addEventListener('click', () => { if (state.items.length) { state.redo.push(...state.items); state.items = []; state.selected = null; redrawAll(); } });

  // 相册按钮 → 弹层选 照片/视频/拍照
  $('btnPhoto').addEventListener('click', () => {
    const open = !$('photoPanel').classList.contains('hidden');
    open ? closePopovers() : openPopover('photoPanel');
  });
  let _importMode = 'image'; // 临时记录 photo/video 模式
  document.querySelectorAll('#photoPanel .photo-opt').forEach((b) => {
    b.addEventListener('click', () => {
      const mode = b.dataset.mode;
      closePopovers();
      if (mode === 'camera') $('fileCamera').click();
      else {
        _importMode = mode; // 'photo' or 'video'
        $('fileImport').click();
      }
    });
  });
  $('fileImport').addEventListener('change', (e) => handleFileImport(e, _importMode));
  $('fileCamera').addEventListener('change', (e) => handleFileImport(e, 'image'));

  // 模板按钮
  $('btnTemplate').addEventListener('click', () => {
    const open = !$('templatePanel').classList.contains('hidden');
    open ? closePopovers() : openPopover('templatePanel');
  });

  // ---------- 弹层 ----------
  const POP = ['sizePanel', 'shapePanel', 'stickerPanel', 'bgPanel', 'templatePanel', 'photoPanel'];
  function closePopovers() { POP.forEach((id) => $(id).classList.add('hidden')); }
  function openPopover(id) { closePopovers(); $(id).classList.remove('hidden'); }

  $('btnSize').addEventListener('click', () => {
    const open = !$('sizePanel').classList.contains('hidden');
    open ? closePopovers() : openPopover('sizePanel');
  });
  document.querySelectorAll('#sizePanel .size-dots button').forEach((b) => {
    b.addEventListener('click', () => {
      state.sizeIdx = +b.dataset.size;
      document.querySelectorAll('#sizePanel .size-dots button').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
    });
  });
  document.querySelectorAll('#shapePanel .shape-grid button').forEach((b) => {
    b.addEventListener('click', () => {
      state.pendingShape = b.dataset.shape;
      state.tool = 'shape';
      document.querySelectorAll('.tool').forEach((x) => x.classList.remove('active'));
      $('btnShape').classList.add('active');
      closePopovers();
    });
  });
  // ---------- 贴纸 ----------
  // 业务贴纸：IP 形象 + 价格/品牌芯片
  const BUSINESS_STICKERS = [
    { type: 'image', src: 'avatar.jpg', label: '谢瑷瞳' },
    { type: 'chip', text: '29.9 体验课', bg: '#2563eb', fg: '#ffffff', fontSize: 32 },
    { type: 'chip', text: '299 录播课', bg: '#0d9488', fg: '#ffffff', fontSize: 32 },
    { type: 'chip', text: '2097 1V1', bg: '#7c3aed', fg: '#ffffff', fontSize: 32 },
    { type: 'chip', text: 'HOTELAI', bg: '#0ea5e9', fg: '#ffffff', fontSize: 32 },
  ];
  const EMOJI_STICKERS = ['✅','❌','❓','❗','💡','🔥','⭐','❤️','👍','👏','🎯','📌','➡️','⬅️','⬆️','⬇️','💰','📈','📉','🚀','💬','🔔','⚡','📝','✏️','🧠','🤔','😊','⚠️','✔️'];
  // 预加载 IP 形象
  const avatarImg = new Image();
  avatarImg.src = 'avatar.jpg';

  // 业务贴纸按钮（独立一排）
  const bizRow = document.createElement('div');
  bizRow.className = 'biz-row';
  BUSINESS_STICKERS.forEach((bs) => {
    const btn = document.createElement('button');
    btn.className = 'biz-btn';
    if (bs.type === 'image') {
      const img = document.createElement('img');
      img.src = bs.src;
      btn.appendChild(img);
    } else {
      btn.textContent = bs.text;
      btn.style.background = bs.bg;
      btn.style.color = bs.fg;
    }
    btn.title = bs.label || bs.text;
    btn.addEventListener('click', () => {
      state.pendingSticker = { ...bs, w: bs.type === 'image' ? 240 : 200, h: bs.type === 'image' ? 320 : 56 };
      state.pendingTemplate = null; // 清掉模板，避免冲突
      state.tool = 'sticker';
      document.querySelectorAll('.tool').forEach((x) => x.classList.remove('active'));
      $('btnSticker').classList.add('active');
      closePopovers();
    });
    bizRow.appendChild(btn);
  });
  $('stickerGrid').appendChild(bizRow);

  // Emoji 贴纸按钮
  EMOJI_STICKERS.forEach((s) => {
    const btn = document.createElement('button');
    btn.textContent = s;
    btn.addEventListener('click', () => {
      state.pendingSticker = { type: 'emoji', text: s, w: 60, h: 60 };
      state.pendingTemplate = null; // 清掉模板，避免冲突
      state.tool = 'sticker';
      document.querySelectorAll('.tool').forEach((x) => x.classList.remove('active'));
      $('btnSticker').classList.add('active');
      closePopovers();
    });
    $('stickerGrid').appendChild(btn);
  });

  // ---------- 文件导入（图片/视频） ----------
  async function handleFileImport(e, mode) {
    const files = Array.from(e.target.files);
    e.target.value = '';
    for (const file of files) {
      // 通过 MIME 或扩展名判断类型（iOS 某些视频 type 为空）
      const name = (file.name || '').toLowerCase();
      const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm|3gp|m4v)$/.test(name);
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|heic|heif|bmp)$/.test(name);
      if (mode === 'video' && !isVideo) continue;
      if (mode === 'image' && !isImage) continue;
      if (!isImage && !isVideo) continue;
      try {
        if (isImage) {
          // image code unchanged
          // 读取为 dataURL 以便持久化（重开后可重建）
          const dataUrl = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
          const img = new Image();
          const url = URL.createObjectURL(file);
          img.src = url;
          await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });
          const maxDim = board.width * 0.35;
          let w = img.naturalWidth, h = img.naturalHeight;
          if (w > maxDim || h > maxDim) { const s = maxDim / Math.max(w, h); w *= s; h *= s; }
          pushItem({ kind: 'image', img, src: dataUrl, loaded: true, x: board.width / 2 + Math.random() * 100, y: board.height * 0.3, w, h });
        } else {
          const vid = document.createElement('video');
          vid.src = URL.createObjectURL(file);
          vid.muted = true; vid.loop = true; vid.playsInline = true;
          vid.setAttribute('playsinline', '');
          vid.preload = 'metadata';
          await new Promise((resolve) => {
            vid.onloadedmetadata = resolve;
            vid.onerror = resolve;
            setTimeout(() => resolve(), 3000);
          });
          vid.currentTime = 0;
          vid.play().catch(() => {});
          const maxDim = board.width * 0.35;
          let w = vid.videoWidth || 320, h = vid.videoHeight || 320;
          if (w > maxDim || h > maxDim) { const s = maxDim / Math.max(w, h); w *= s; h *= s; }
          pushItem({ kind: 'video', video: vid, x: board.width / 2 + Math.random() * 50, y: board.height * 0.3, w, h });
        }
      } catch (err) { console.error('import failed:', err); }
    }
  }

  // ---------- 模板 ----------
  const TEMPLATES = [
    { id: 'pyramid', name: '金字塔', icon: '🔺', desc: '层级递进' },
    { id: 'quadrant', name: '四象限', icon: '➕', desc: '2×2矩阵' },
    { id: 'pdca', name: 'PDCA', icon: '🔄', desc: '戴明环' },
    { id: 'swot', name: 'SWOT', icon: '📊', desc: '优势劣势机会威胁' },
    { id: 'reading', name: '读书笔记', icon: '📖', desc: '书名·要点·感悟' },
    { id: 'timeline', name: '时间轴', icon: '📅', desc: '里程碑节点' },
    { id: 'flowchart', name: '流程图', icon: '🔀', desc: '开始→判断→结束' },
  ];

  function placeTemplate(tid, p) {
    const w = board.width * 0.55;
    const items = [];
    if (tid === 'pyramid') {
      const levels = 5, cx = p.x, top = p.y - w * 0.5, h = w * 0.7;
      for (let i = 0; i < levels; i++) {
        const frac = 0.45 + (i / (levels - 1)) * 0.55;
        const y = top + (h / levels) * (i + 0.5);
        items.push({ kind: 'shape', shape: 'rect', color: state.color, width: Math.max(2, board.width / 400), x0: cx - w * frac / 2, y0: y - h / levels / 2 + 4, x1: cx + w * frac / 2, y1: y + h / levels / 2 - 4 });
      }
    } else if (tid === 'quadrant') {
      const cx = p.x, cy = p.y;
      items.push({ kind: 'shape', shape: 'line', color: state.color, width: Math.max(2, board.width / 400), x0: cx - w / 2, y0: cy, x1: cx + w / 2, y1: cy });
      items.push({ kind: 'shape', shape: 'line', color: state.color, width: Math.max(2, board.width / 400), x0: cx, y0: cy - w / 2, x1: cx, y1: cy + w / 2 });
    } else if (tid === 'pdca') {
      const cx = p.x, cy = p.y, r = w * 0.4;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
        const ax = cx + Math.cos(a) * r * 0.5, ay = cy + Math.sin(a) * r * 0.5;
        items.push({ kind: 'text', text: ['Plan','Do','Check','Act'][i], x: ax, y: ay, size: Math.round(r * 0.22), color: state.color });
      }
      items.push({ kind: 'shape', shape: 'circle', color: state.color, width: Math.max(2, board.width / 400), x0: cx - r, y0: cy - r, x1: cx + r, y1: cy + r });
    } else if (tid === 'swot') {
      const cx = p.x, cy = p.y, hw = w / 2;
      items.push({ kind: 'shape', shape: 'line', color: '#2563eb', width: Math.max(2, board.width / 400), x0: cx - hw, y0: cy, x1: cx + hw, y1: cy });
      items.push({ kind: 'shape', shape: 'line', color: '#2563eb', width: Math.max(2, board.width / 400), x0: cx, y0: cy - hw * 0.6, x1: cx, y1: cy + hw * 0.6 });
      const fs = Math.round(board.width * 0.025);
      items.push({ kind: 'text', text: 'S 优势', x: cx - hw / 2, y: cy - hw * 0.3, size: fs, color: '#2563eb' });
      items.push({ kind: 'text', text: 'W 劣势', x: cx + hw / 2, y: cy - hw * 0.3, size: fs, color: '#dc2626' });
      items.push({ kind: 'text', text: 'O 机会', x: cx - hw / 2, y: cy + hw * 0.3, size: fs, color: '#16a34a' });
      items.push({ kind: 'text', text: 'T 威胁', x: cx + hw / 2, y: cy + hw * 0.3, size: fs, color: '#ca8a04' });
    } else if (tid === 'reading') {
      const cx = p.x, top = p.y - w * 0.6, fs = Math.round(board.width * 0.025);
      items.push({ kind: 'shape', shape: 'line', color: state.color, width: Math.max(2, board.width / 400), x0: cx - w / 2, y0: top + fs * 3, x1: cx + w / 2, y1: top + fs * 3 });
      items.push({ kind: 'text', text: '📖 书目：', x: cx - w / 2 + fs, y: top + fs, size: fs, color: state.color });
      items.push({ kind: 'text', text: '💡 要点：', x: cx - w / 2 + fs, y: top + fs * 5, size: fs, color: state.color });
      items.push({ kind: 'text', text: '✍️ 感悟：', x: cx - w / 2 + fs, y: top + fs * 9, size: fs, color: state.color });
    } else if (tid === 'timeline') {
      const cx = p.x, top = p.y - w * 0.15;
      items.push({ kind: 'shape', shape: 'line', color: state.color, width: Math.max(2, board.width / 300), x0: cx - w / 2, y0: top, x1: cx + w / 2, y1: top });
      const nodes = 5;
      for (let i = 0; i < nodes; i++) {
        const x = cx - w / 2 + (w / (nodes - 1)) * i;
        items.push({ kind: 'shape', shape: 'circle', color: state.color, width: Math.max(2, board.width / 400), x0: x - 6, y0: top - 6, x1: x + 6, y1: top + 6 });
        items.push({ kind: 'text', text: '节点' + (i + 1), x: x, y: top + 24, size: Math.round(board.width * 0.02), color: state.color });
      }
    } else if (tid === 'flowchart') {
      const cx = p.x, top = p.y - w * 0.5, gap = w * 0.22, fs = Math.round(board.width * 0.022);
      const nodes = [
        { x: cx, y: top, text: '开始', shape: 'rect' },
        { x: cx, y: top + gap, text: '步骤 1', shape: 'rect' },
        { x: cx, y: top + gap * 2, text: '判断?', shape: 'rect' },
        { x: cx, y: top + gap * 3, text: '结束', shape: 'rect' },
      ];
      nodes.forEach(n => {
        const hw2 = n.text.length * fs * 0.4, hh = fs * 1.3;
        items.push({ kind: 'shape', shape: 'rect', color: state.color, width: Math.max(2, board.width / 400), x0: n.x - hw2, y0: n.y - hh, x1: n.x + hw2, y1: n.y + hh });
        items.push({ kind: 'text', text: n.text, x: n.x, y: n.y, size: fs, color: state.color });
        if (n.y < top + gap * 3) {
          items.push({ kind: 'shape', shape: 'arrow', color: '#64748b', width: Math.max(2, board.width / 500), x0: n.x, y0: n.y + hh, x1: n.x, y1: n.y + gap - hh });
        }
      });
    }
    // 计算模板包围盒
    if (items.length === 0) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const it of items) {
      if (it.kind === 'shape') {
        minX = Math.min(minX, it.x0, it.x1); maxX = Math.max(maxX, it.x0, it.x1);
        minY = Math.min(minY, it.y0, it.y1); maxY = Math.max(maxY, it.y0, it.y1);
      } else if (it.kind === 'text') {
        const tw = bctx.measureText(it.text).width, th = it.size;
        minX = Math.min(minX, it.x - tw/2); maxX = Math.max(maxX, it.x + tw/2);
        minY = Math.min(minY, it.y - th/2); maxY = Math.max(maxY, it.y + th/2);
      } else if (it.kind === 'sticker') {
        minX = Math.min(minX, it.x - it.w/2); maxX = Math.max(maxX, it.x + it.w/2);
        minY = Math.min(minY, it.y - it.h/2); maxY = Math.max(maxY, it.y + it.h/2);
      }
    }
    const group = {
      kind: 'group',
      x: (minX + maxX) / 2, y: (minY + maxY) / 2,
      w: maxX - minX, h: maxY - minY,
      children: items,
    };
    state.selected = pushItem(group);
    state.pendingTemplate = null;
  }

  // 模板网格
  TEMPLATES.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'template-btn';
    btn.innerHTML = `<span class="t-ico">${t.icon}</span><span class="t-label">${t.name}</span><span class="t-desc">${t.desc}</span>`;
    btn.addEventListener('click', () => {
      state.pendingTemplate = t.id;
      state.pendingSticker = null;
      state.tool = 'pen';
      document.querySelectorAll('.tool').forEach(x => x.classList.remove('active'));
      document.querySelector('.tool[data-tool="pen"]').classList.add('active');
      document.querySelectorAll('.template-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      closePopovers();
    });
    $('templateGrid').appendChild(btn);
  });

  // 背景
  $('btnBg').addEventListener('click', () => {
    const open = !$('bgPanel').classList.contains('hidden');
    open ? closePopovers() : openPopover('bgPanel');
  });
  BGS.forEach((bg) => {
    const b = document.createElement('button');
    b.className = 'bg-sw'; b.textContent = bg.name;
    if (bg.grad) b.style.background = `linear-gradient(135deg, ${bg.grad[0]}, ${bg.grad[1]})`;
    else b.style.background = bg.color;
    if (bg.type === 'grid') b.dataset.grid = '1';
    if (bg.type === 'dots') b.dataset.dots = '1';
    if (bg.color === '#0f172a') b.style.color = '#fff';
    b.addEventListener('click', () => {
      state.bg = bg;
      if (bg.color === '#0f172a' && state.color === '#111827') state.color = '#ffffff';
      else if (bg.color !== '#0f172a' && state.color === '#ffffff') state.color = '#111827';
      $('colorPick').value = state.color;
      document.querySelectorAll('.bg-sw').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      redrawAll(); closePopovers();
    });
    bgGrid.appendChild(b);
  });

  // 文字输入（画布内透明编辑）
  function openTextModal() {
    state.editingItem = null;
    textInput.value = '';
    if (state.screenTextPos) {
      textInput.style.left = Math.max(4, state.screenTextPos.x - 60) + 'px';
      textInput.style.top = Math.max(4, state.screenTextPos.y - 22) + 'px';
    }
    textInput.classList.remove('hidden');
    setTimeout(() => textInput.focus(), 40);
  }
  function openEdit(item) {
    state.editingItem = item;
    textInput.value = item.text;
    // canvas 坐标 → 屏幕坐标
    const br = board.getBoundingClientRect();
    const fx = br.width / board.width, fy = br.height / board.height;
    const sx = br.left + item.x * fx, sy = br.top + item.y * fy;
    textInput.style.left = Math.max(4, sx - 60) + 'px';
    textInput.style.top = Math.max(4, sy - 22) + 'px';
    textInput.classList.remove('hidden');
    setTimeout(() => { textInput.focus(); textInput.select(); }, 40);
  }
  function confirmText() {
    const t = textInput.value.trim();
    if (t) {
      if (state.editingItem) {
        state.editingItem.text = t; state.editingItem = null;
      } else if (state.tempTextPos) {
        const it = pushItem({ kind: 'text', text: t, x: state.tempTextPos.x, y: state.tempTextPos.y, size: textSize(), color: state.color });
        state.selected = it;
      }
    }
    state.tempTextPos = null;
    state.screenTextPos = null;
    state.editingItem = null;
    textInput.classList.add('hidden');
    textInput.blur();
  }
  function cancelText() {
    state.tempTextPos = null;
    state.screenTextPos = null;
    state.editingItem = null;
    textInput.classList.add('hidden');
    textInput.blur();
  }
  textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); confirmText(); }
    if (e.key === 'Escape') { e.preventDefault(); cancelText(); }
  });
  textInput.addEventListener('blur', () => {
    // blur 时自动确认（用户点别处）
    setTimeout(() => {
      if (!textInput.classList.contains('hidden')) confirmText();
    }, 100);
  });

  // ---------- 摄像头 ----------
  async function startCamera() {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
        audio: true,
      });
    } catch (err) {
      try { micStream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
      catch (e2) { micStream = null; }
      state.cameraOn = false;
      camBubble.classList.add('hidden');
      return;
    }
    video.srcObject = micStream;
    await video.play().catch(() => {});
    try {
      fx = new CameraFX(camGL);
      fx.setSource(video);
      // WebGL 上下文丢失自动恢复，避免录制中途摄像头卡死
      camGL.addEventListener('webglcontextlost', (e) => { e.preventDefault(); fx = null; }, false);
      camGL.addEventListener('webglcontextrestored', () => {
        try { fx = new CameraFX(camGL); fx.setSource(video); resizeCam(); }
        catch (e) { fx = null; state.camReady = false; }
      }, false);
    } catch (e) {
      console.error('CameraFX init failed:', e);
      state.cameraOn = false; state.camReady = false;
      camBubble.classList.add('hidden');
      return;
    }
    state.cameraOn = true; state.camReady = true;
    camBubble.classList.remove('hidden');
    resizeCam();
  }

  function resizeCam() {
    if (!state.cameraOn) return;
    const r = camBubble.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    fx.setSize(r.width * dpr, r.height * dpr);
  }

  // ---------- 气泡拖拽 / 缩放 ----------
  let drag = null;
  camBubble.addEventListener('pointerdown', (e) => {
    if (e.target === camResize) return;
    drag = { mode: 'move', sx: e.clientX, sy: e.clientY, left: camBubble.offsetLeft, top: camBubble.offsetTop };
    camBubble.setPointerCapture(e.pointerId);
  });
  camBubble.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    const maxX = window.innerWidth - camBubble.offsetWidth;
    const maxY = window.innerHeight - camBubble.offsetHeight;
    camBubble.style.left = Math.max(0, Math.min(maxX, drag.left + dx)) + 'px';
    camBubble.style.top = Math.max(0, Math.min(maxY, drag.top + dy)) + 'px';
    camBubble.style.right = 'auto'; camBubble.style.bottom = 'auto';
  });
  camBubble.addEventListener('pointerup', () => { drag = null; resizeCam(); });

  // ---------- 顶部栏拖拽 ----------
  let topDrag = null;
  topbar.addEventListener('pointerdown', (e) => {
    // 不拦截按钮点击（让按钮的 click 事件正常触发）
    if (e.target.classList.contains('chip')) return;
    const rect = topbar.getBoundingClientRect();
    topDrag = { sx: e.clientX, sy: e.clientY, left: rect.left, top: rect.top };
    // 从居中定位切换到绝对 left 定位
    topbar.style.transform = 'none';
    topbar.style.left = rect.left + 'px';
    topbar.style.top = rect.top + 'px';
    topbar.style.right = 'auto';
    topbar.style.bottom = 'auto';
    e.preventDefault();
  });
  window.addEventListener('pointermove', (e) => {
    if (!topDrag) return;
    const dx = e.clientX - topDrag.sx, dy = e.clientY - topDrag.sy;
    const maxX = Math.max(0, window.innerWidth - topbar.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - topbar.offsetHeight);
    topbar.style.left = Math.max(0, Math.min(maxX, topDrag.left + dx)) + 'px';
    topbar.style.top = Math.max(0, Math.min(maxY, topDrag.top + dy)) + 'px';
  });
  window.addEventListener('pointerup', () => { topDrag = null; });
  window.addEventListener('pointercancel', () => { topDrag = null; });

  camResize.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    drag = { mode: 'resize', sx: e.clientX, sy: e.clientY, w: camBubble.offsetWidth, h: camBubble.offsetHeight };
    camResize.setPointerCapture(e.pointerId);
  });
  camResize.addEventListener('pointermove', (e) => {
    if (!drag || drag.mode !== 'resize') return;
    const dw = e.clientX - drag.sx;
    let nw = Math.max(90, Math.min(window.innerWidth * 0.7, drag.w + dw));
    camBubble.style.width = nw + 'px';
    camBubble.style.height = (nw * 4 / 3) + 'px';
  });
  camResize.addEventListener('pointerup', () => { drag = null; resizeCam(); });

  function setBubblePos(pos) {
    const w = camBubble.offsetWidth, h = camBubble.offsetHeight, m = 12;
    const top = (window.innerWidth <= 720 ? 76 : 76);
    const map = {
      tl: [m, top], tr: [window.innerWidth - w - m, top],
      bl: [m, window.innerHeight - h - 86], br: [window.innerWidth - w - m, window.innerHeight - h - 86],
    };
    const [x, y] = map[pos] || map.tl;
    camBubble.style.left = x + 'px'; camBubble.style.top = y + 'px';
    camBubble.style.right = 'auto'; camBubble.style.bottom = 'auto';
    resizeCam();
  }

  // ---------- 顶部栏 ----------
  $('btnCam').addEventListener('click', () => {
    state.cameraOn = !state.cameraOn;
    $('btnCam').classList.toggle('active', state.cameraOn);
    camBubble.classList.toggle('hidden', !state.cameraOn);
    if (state.cameraOn) resizeCam();
  });
  $('btnTele').addEventListener('click', () => {
    const hidden = tele.classList.toggle('hidden');
    $('btnTele').classList.toggle('active', !hidden);
  });
  $('btnCamera').addEventListener('click', () => { cameraPanel.classList.toggle('hidden'); });

  // 相机调整
  $('camBright').addEventListener('input', (e) => state.cam.bright = +e.target.value);
  $('camSlim').addEventListener('input', (e) => state.cam.slim = +e.target.value);
  $('camMirror').addEventListener('change', (e) => state.cam.mirror = e.target.checked);
  cameraPanel.querySelectorAll('.pos-btns button').forEach((b) => b.addEventListener('click', () => setBubblePos(b.dataset.pos)));

  // ---------- 录制 ----------
  function bubbleRectRecord() {
    const cb = camBubble.getBoundingClientRect();
    const br = board.getBoundingClientRect();
    // 映射：屏幕坐标 → 录制画布(1080×1920)坐标
    const sx = recordCanvas.width / br.width;
    const sy = recordCanvas.height / br.height;
    return { x: (cb.left - br.left) * sx, y: (cb.top - br.top) * sy, w: cb.width * sx, h: cb.height * sy };
  }
  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function composite() {
    // 从画布顶部裁切 9:16 区域 → 品牌条必在框内，视频号/抖音完美适配
    const bw = board.width, bh = board.height;
    const cropW = Math.min(bw, Math.round(bh * 9 / 16));
    const cropH = Math.round(cropW * 16 / 9);
    const ox = Math.round((bw - cropW) / 2);
    const oy = 0; // 从顶部裁，品牌条完整保留
    // 先清空录制画布，避免上一帧内容叠加成拖影/重影
    rctx.clearRect(0, 0, recordCanvas.width, recordCanvas.height);
    rctx.imageSmoothingEnabled = true;
    rctx.imageSmoothingQuality = 'high';
    rctx.drawImage(board, ox, oy, cropW, cropH, 0, 0, recordCanvas.width, recordCanvas.height);
    if (state.cameraOn && state.camReady) {
      const r = bubbleRectRecord();
      // 每次合成都用实时视频渲染一帧，避免依赖 rAF 循环（移动端 rAF 易被节流导致卡死）
      let camOk = false;
      if (fx) {
        try { fx.render({ bright: state.cam.bright, slim: state.cam.slim, mirror: state.cam.mirror }); camOk = true; }
        catch (e) { fx = null; } // WebGL 上下文丢失时丢弃滤镜
      }
      rctx.save();
      roundRectPath(rctx, r.x, r.y, r.w, r.h, r.w * 0.08);
      rctx.clip();
      if (camOk) {
        rctx.drawImage(camGL, r.x, r.y, r.w, r.h);
      } else if (video && video.readyState >= 2 && video.videoWidth) {
        // 滤镜失效时直接画原始视频，保证录制画面仍有实时摄像头、绝不卡死
        drawVideoCover(rctx, video, r.x, r.y, r.w, r.h, state.cam.mirror);
      }
      rctx.restore();
      rctx.lineWidth = Math.max(2, r.w * 0.02);
      rctx.strokeStyle = '#ffffff';
      roundRectPath(rctx, r.x, r.y, r.w, r.h, r.w * 0.08);
      rctx.stroke();
    }
  }
  // 将 video 元素按 cover 方式裁切绘制到矩形（带可选镜像），用于滤镜失效时的兜底
  function drawVideoCover(ctx, vid, x, y, w, h, mirror) {
    const vw = vid.videoWidth, vh = vid.videoHeight;
    if (!vw || !vh) return;
    const scale = Math.max(w / vw, h / vh);
    const dw = vw * scale, dh = vh * scale;
    const dx = x + (w - dw) / 2, dy = y + (h - dh) / 2;
    ctx.save();
    if (mirror) { ctx.translate(x + w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + w / 2), 0); }
    try { ctx.drawImage(vid, dx, dy, dw, dh); } catch (e) {}
    ctx.restore();
  }
  function pickMime() {
    const types = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    if (!window.MediaRecorder) return '';
    return types.find((t) => MediaRecorder.isTypeSupported(t)) || '';
  }
  function startRecording() {
    if (!window.MediaRecorder || !recordCanvas.captureStream) {
      alert('当前浏览器不支持网页录屏。请用 Android Chrome，或 iOS 17+ 的 Safari 打开。');
      return;
    }
    state.selected = null; // 清除选中框，避免入镜
    // 关键修复：优先用「手动帧」captureStream(0)，每帧由 requestFrame() 主动推送，
    // 彻底避免 iOS 上 canvas 采集轨约十几秒后自动停推帧（表现为“声音在、画面冻”）。
    let stream;
    recVideoTrack = null;
    try {
      stream = recordCanvas.captureStream(0);
      const vt = stream.getVideoTracks && stream.getVideoTracks()[0];
      if (vt && typeof vt.requestFrame === 'function') {
        recVideoTrack = vt; // 手动帧模式
      } else {
        stream = recordCanvas.captureStream(30); // 不支持手动帧则退回自动 30fps
      }
    } catch (e) {
      try { stream = recordCanvas.captureStream(30); } catch (e2) { alert('当前浏览器不支持网页录屏。'); return; }
    }
    if (micStream) { const at = micStream.getAudioTracks(); if (at.length) stream.addTrack(at[0]); }
    const mime = pickMime();
    try {
      recorder = mime ? new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 2500000 })
                      : new MediaRecorder(stream, { videoBitsPerSecond: 2500000 });
    } catch (e) { alert('无法创建录制器：' + e.message); return; }
    recChunks = [];
    recorder.ondataavailable = (e) => { if (e.data && e.data.size) recChunks.push(e.data); };
    recorder.onstop = finishRecording;
    // timeslice=1000：每秒切一块落盘，避免整段缓存在内存里导致移动端约十几秒后编码停滞
    recorder.start(1000);
    state.recording = true; state.paused = false;
    recStart = Date.now();
    recTimer.classList.remove('hidden');
    recBtn.classList.add('recording');
    $('btnPause').classList.remove('hidden');
    $('btnPause').innerHTML = '<span class="ico" data-i="pause"></span>'; injectIcons();
    startTimer();
    // 独立录制合成定时器（33ms ≈ 30fps），不依赖 rAF，保证帧率稳定+音画同步
    clearInterval(recordInt);
    recordInt = setInterval(() => {
      if (state.paused) return;
      composite();
      // 主动推送这一帧到录制轨（手动帧模式下必需，否则无帧输出）
      if (recVideoTrack && recVideoTrack.requestFrame) { try { recVideoTrack.requestFrame(); } catch (e) {} }
    }, 33);
    // 摄像头保活：录制期间每 2s 确保 video 仍在播放，防止 iOS 中途停推帧导致画面卡死
    clearInterval(camKeepInt);
    camKeepInt = setInterval(() => { if (state.cameraOn && video.paused) video.play().catch(() => {}); }, 2000);
  }
  function startTimer() {
    clearInterval(timerInt);
    timerInt = setInterval(() => {
      if (state.paused) return;
      const s = Math.floor((Date.now() - recStart) / 1000);
      recTimer.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    }, 250);
  }
  function finishRecording() {
    clearInterval(timerInt);
    clearInterval(recordInt);
    clearInterval(camKeepInt);
    recTimer.classList.add('hidden');
    recBtn.classList.remove('recording');
    $('btnPause').classList.add('hidden');
    state.recording = false;
    recBlob = new Blob(recChunks, { type: recorder.mimeType || 'video/webm' });
    recUrl = URL.createObjectURL(recBlob);
    prevVideo.src = recUrl;
    preview.classList.remove('hidden');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const ext = (recorder.mimeType || '').includes('mp4') ? 'mp4' : 'webm';
    previewHint.textContent = isIOS
      ? 'iOS 无法直接下载：点击视频播放后，长按视频选择「存储到文件 / 存储视频」，即可保存到相册。'
      : '点击「保存到相册」下载视频（.' + ext + '）。';
  }
  function doCountdown(then) {
    let n = 3;
    countdown.classList.remove('hidden'); countdown.textContent = n;
    const iv = setInterval(() => {
      n--;
      if (n <= 0) { clearInterval(iv); countdown.classList.add('hidden'); then(); }
      else countdown.textContent = n;
    }, 700);
  }
  recBtn.addEventListener('click', () => {
    if (state.recording) { if (recorder && recorder.state !== 'inactive') recorder.stop(); }
    else doCountdown(startRecording);
  });
  $('btnPause').addEventListener('click', () => {
    if (!recorder) return;
    if (state.paused) { recorder.resume(); state.paused = false; $('btnPause').innerHTML = '<span class="ico" data-i="pause"></span>'; injectIcons(); }
    else { recorder.pause(); state.paused = true; $('btnPause').innerHTML = '<span class="ico" data-i="play"></span>'; injectIcons(); }
  });

  // ---------- 预览 / 下载 ----------
  $('btnDownload').addEventListener('click', () => {
    if (!recBlob) return;
    const ext = (recorder && recorder.mimeType || '').includes('mp4') ? 'mp4' : 'webm';
    const a = document.createElement('a');
    a.href = recUrl; a.download = 'whiteboard-' + Date.now() + '.' + ext;
    document.body.appendChild(a); a.click(); a.remove();
  });
  $('btnReRecord').addEventListener('click', () => { preview.classList.add('hidden'); prevVideo.src = ''; });
  $('btnClosePreview').addEventListener('click', () => { preview.classList.add('hidden'); prevVideo.src = ''; });

  // ---------- 渲染循环 ----------
  function loop() {
    try {
      if (state.cameraOn && state.camReady && fx) {
        fx.render({ bright: state.cam.bright, slim: state.cam.slim, mirror: state.cam.mirror });
      }
    } catch (e) { fx = null; } // 异常不致命，避免渲染循环中断
    // 有视频项时持续重绘以更新帧
    if (state.items.some(it => it.kind === 'video')) redrawAll();
    requestAnimationFrame(loop);
  }

  // ---------- 启动 ----------
  async function init() {
    state.restoring = true;
    state.started = true;
    try {
      injectIcons();
      setupBoard();
      restoreBoard();
    recordCanvas = document.createElement('canvas');
    recordCanvas.width = 720; recordCanvas.height = 1280; // 9:16，720p 竖屏：手机社媒足够清晰，编码压力小得多、避免长录停滞
    // 挂到 DOM（隐藏但参与渲染），提升 iOS 上 canvas captureStream 的稳定性
    recordCanvas.style.cssText = 'position:fixed;left:0;bottom:0;width:9px;height:16px;opacity:0.01;pointer-events:none;z-index:-1;';
    document.body.appendChild(recordCanvas);
      rctx = recordCanvas.getContext('2d');
      // 先隐藏遮罩。品牌条已绘制进画布像素，不显示 DOM brandBar（避免双层）
      startOverlay.classList.add('hidden');
      brandBar.classList.add('hidden');
      setBubblePos('tl'); // 摄像头默认左上
    } catch (e) {
      console.error('init UI error:', e);
      startOverlay.classList.add('hidden');
      brandBar.classList.add('hidden');
    }
    state.restoring = false; // 恢复完成，此后才允许自动保存
    // 摄像头单独处理，失败不影响画板使用
    try {
      await startCamera();
    } catch (e) {
      console.error('camera error:', e);
      state.cameraOn = false;
      camBubble.classList.add('hidden');
    }
    // 渲染循环始终启动
    requestAnimationFrame(loop);
  }

  $('btnStart').addEventListener('click', init);
  window.addEventListener('resize', () => { if (state.cameraOn) resizeCam(); });
})();

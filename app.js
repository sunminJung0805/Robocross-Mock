// ====== ダミーデータ（マーケットプレイス用） ======
const apps = [
  { id: "app1", name: "Kawasaki Software", vendor: "Kawasaki", desc: "Kawasakiソフトマーケットプレイス", icon: "assets/app1.png", badge: "公式", link: "kawasaki.html"},
  { id: "app2", name: "Nav2Grid", vendor: "Navigation", desc: "倉庫向けナビゲーションプラグイン", icon: "assets/app2.png", badge: "人気" },
  { id: "app3", name: "Workspace Sync", vendor: "Workspace", desc: "作業スペースの設定を自動同期", icon: "assets/app2.png", badge: "新着" },
  { id: "app4", name: "Telemetry Sense", vendor: "Insight", desc: "運用データの可視化と異常検知", icon: "assets/app2.png" },
  { id: "app5", name: "Vision Studio", vendor: "Vision", desc: "カメラ×AIの検査テンプレート", icon: "assets/app2.png" },
  { id: "app6", name: "SysDiag Core", vendor: "System", desc: "システム診断とログ収集を一元化", icon: "assets/app2.png" },
  { id: "app7", name: "Package Builder", vendor: "DevTools", desc: "配布パッケージの作成を自動化", icon: "assets/app2.png" },
  { id: "app8", name: "Routing Assist", vendor: "Optimizer", desc: "ルート計画の最適化エンジン", icon: "assets/app2.png" },
];

// ====== 共通要素 ======
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

// ====== マーケットプレイス（存在するページだけ実行） ======
const grid = document.getElementById("appGrid");
const searchInput = document.getElementById("searchInput");

function createCard(a) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <div class="card__icon" aria-hidden="true">
      <img src="${a.icon}" alt="${a.name} のアイコン">
    </div>
    <div class="card__body">
      <h3 class="card__title">${a.name}${a.badge ? `<span class="card__badge">${a.badge}</span>` : ""}</h3>
      <p class="card__meta">${a.vendor} ・ ${a.desc}</p>
    </div>`;
  el.addEventListener("click", () => alert(`${a.name} を開きます（デモ）`));
  return el;
}
function render(list) {
  if (!grid) return;
  grid.innerHTML = "";
  const frag = document.createDocumentFragment();
  list.forEach(a => frag.appendChild(createCard(a)));
  grid.appendChild(frag);
}
render(apps);

searchInput?.addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = apps.filter(a => [a.name, a.vendor, a.desc].join(" ").toLowerCase().includes(q));
  render(filtered);
});

// ====== テーマ切替（全ページ共通） ======
const THEME_KEY = "mp-theme";
function applyTheme(v) { (v === "dark" ? root.classList.add("dark") : root.classList.remove("dark")); }
function systemTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
applyTheme(localStorage.getItem(THEME_KEY) || systemTheme());
themeToggle?.addEventListener("click", () => {
  const now = root.classList.contains("dark") ? "light" : "dark";
  applyTheme(now);
  localStorage.setItem(THEME_KEY, now);
});

// ====== サイドバー折りたたみ（全ページ共通） ======
sidebarToggle?.addEventListener("click", () => {
  sidebar?.classList.toggle("sidebar--collapsed");
});

/* ===== ダッシュボード：号機情報とトレンドグラフ ===== */

// ---- 号機情報（必要ならAPI値に置き換え） ----
(function fillUnitInfo() {
  const tbody = document.getElementById('unitTbody');
  if (!tbody) return; // 他ページでは無視
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>BX100039</td>
    <td>BX100N</td>
    <td>2021/11/1</td>
    <td>2021/11/21</td>
  `;
  tbody.appendChild(row);
})();

// ---- 簡易トレンドグラフ（Canvas） ----
(function drawTrend() {
  const cvs = document.getElementById('trendChart');
  if (!cvs) return;

  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  ctx.clearRect(0, 0, W, H);

  // 軸余白
  const pad = { l: 48, r: 16, t: 20, b: 36 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;

  // ダミーデータ（実績：揺らぎある値）
  const points = [12, 14, 13, 16, 15, 18, 17, 20, 22, 19, 23, 24, 26, 25, 28, 27];
  const n = points.length;

  // スケール
  const minY = 10, maxY = 30;
  const x = i => pad.l + (plotW * i) / (n - 1);
  const y = v => pad.t + plotH * (1 - (v - minY) / (maxY - minY));

  // 背景グリッド
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  for (let i = 0; i <= 6; i++) {
    const gy = pad.t + (plotH * i) / 6;
    ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(W - pad.r, gy); ctx.stroke();
  }
  ctx.setLineDash([]);

  // 軸
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1.2;
  // X軸
  ctx.beginPath(); ctx.moveTo(pad.l, H - pad.b); ctx.lineTo(W - pad.r, H - pad.b); ctx.stroke();
  // Y軸
  ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, H - pad.b); ctx.stroke();

  // 目盛ラベル
  ctx.fillStyle = '#6b7280'; // muted
  ctx.font = '12px system-ui, sans-serif';
  for (let i = 0; i <= 5; i++) {
    const val = minY + ((maxY - minY) * i) / 5;
    const yy = y(val);
    ctx.fillText(val.toFixed(0), 8, yy + 4);
  }

  // 実績 線（緑）
  ctx.strokeStyle = '#10b981'; // emerald-500
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((v, i) => (i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v))));
  ctx.stroke();

  // トレンド線（橙）：単純回帰（ここは両端を結ぶ簡易版）
  const trendStart = points[0], trendEnd = points[n - 1];
  ctx.strokeStyle = '#f59e0b'; // amber-500
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x(0), y(trendStart));
  ctx.lineTo(x(n - 1), y(trendEnd));
  ctx.stroke();

  // 特記事項の赤ポイント（終盤に1点）
  const markIndex = n - 2;
  ctx.fillStyle = '#ef4444'; // red-500
  ctx.beginPath();
  ctx.arc(x(markIndex), y(points[markIndex]), 6, 0, Math.PI * 2);
  ctx.fill();

  // 凡例（簡易）
  ctx.fillStyle = '#111827';
  ctx.font = '12px system-ui, sans-serif';
  // （キャンバス外にテキストは出しているのでここでは省略可）
})();

function createCard(a) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <div class="card__icon" aria-hidden="true">
      ${a.icon ? `<img src="${a.icon}" alt="${a.name} のアイコン">` : ""}
    </div>
    <div class="card__body">
      <h3 class="card__title">${a.name}${a.badge ? `<span class="card__badge">${a.badge}</span>` : ""}</h3>
      <p class="card__meta">${a.vendor} ・ ${a.desc}</p>
    </div>
  `;
  // ★リンクがあれば遷移、なければ従来のアラート
  el.addEventListener("click", () => {
    if (a.link) { location.href = a.link; }
    else { alert(`${a.name} を開きます（デモ）`); }
  });
  el.style.cursor = "pointer";
  return el;
}

/* ===== カワサキ：商品グリッド描画 ===== */
(function kawasakiCatalog() {
  const grid = document.getElementById('kawasakiGrid');
  if (!grid) return; // 他ページでは実行しない

  // ダミー商品（必要に応じて増やしてください）
  let items = [
    { id: 'arct-basic-50', name: '多軸盤制御', dept: 'アーク溶接', code: '423318', license: 'Node Locked (0)', note: 'ライセンスは有効期限内ではありません。', icon: 'assets/arct.png' },
    { id: 'arct-basic-51', name: 'ハンドリング協調', dept: 'アーク溶接', code: '694152', license: 'Node Locked (0)', note: 'ライセンスは有効期限内ではありません。', icon: 'assets/arct.png' },
    { id: 'arct-adv-50',  name: 'マルチコントローラ', dept: 'アーク溶接', code: '423318', license: 'Node Locked (0)', note: 'ライセンスは有効期限内ではありません。', icon: 'assets/arct.png' },
    { id: 'arct-adv-51',  name: '通信協調', dept: 'アーク溶接', code: '694152', license: 'Node Locked (0)', note: '—', icon: 'assets/arct.png' },
    // もう少しダミーを重複で増やして見栄えを揃える
    { id: 'arct-basic-52', name: 'ポジショナー', dept: 'アーク溶接', code: '734512', license: 'Node Locked (0)', note: '—', icon: 'assets/arct.png' },
    { id: 'arct-adv-52',   name: '溶接条件設定', dept: 'アーク溶接', code: '734513', license: 'Node Locked (0)', note: '—', icon: 'assets/arct.png' },
    { id: 'arct-basic-53', name: 'CAMティーチング', dept: 'アーク溶接', code: '812345', license: 'Node Locked (0)', note: '—', icon: 'assets/arct.png' },
    { id: 'arct-adv-53',   name: '外部軸追加', dept: 'ハンドリング', code: '812346', license: 'Node Locked (0)', note: '—', icon: 'assets/arct.png' },
    { id: 'arct-basic-54', name: 'ソフトPLC', dept: 'ハンドリング', code: '912340', license: 'Node Locked (0)', note: '—', icon: 'assets/arct.png' },
    { id: 'arct-adv-54',   name: 'C＃プログラミング', dept: 'ハンドリング', code: '912341', license: 'Node Locked (0)', note: '—', icon: 'assets/arct.png' },
    { id: 'arct-basic-55', name: 'pythonプログラミング', dept: 'ハンドリング', code: '992200', license: 'Node Locked (0)', note: '—', icon: 'assets/arct.png' },
    { id: 'arct-adv-55',   name: 'AS言語変換', dept: 'ハンドリング', code: '992201', license: 'Node Locked (0)', note: '—', icon: 'assets/arct.png' }
  ];

  const itemTotalEl = document.getElementById('itemTotal');
  const itemRangeEl = document.getElementById('itemRange');
  itemTotalEl && (itemTotalEl.textContent = '84'); // ダミー総数

  function cardTemplate(p) {
    const el = document.createElement('article');
    el.className = 'catalog-card';
    el.innerHTML = `
      <div class="catalog-card__icon">
        <img src="${p.icon}" alt="${p.name} アイコン">
      </div>
      <h3 class="catalog-card__title">${p.name}</h3>
      <p class="catalog-card__meta">部門：${p.dept} &nbsp;|&nbsp; 配信番号：${p.code}</p>
      <p class="catalog-card__meta">${p.license}</p>
      ${p.note && p.note !== '—' ? `<p class="catalog-card__meta">${p.note}</p>` : ``}
    `;
    // クリック時の挙動（詳細ページに進む想定：今はダイアログ）
    el.addEventListener('click', () => alert(`${p.name} の詳細ページ（今はダミー）`));
    return el;
  }

  function render(list) {
    grid.innerHTML = '';
    const frag = document.createDocumentFragment();
    list.forEach(item => frag.appendChild(cardTemplate(item)));
    grid.appendChild(frag);
    // 件数表示（1–◯ / 84）
    itemRangeEl && (itemRangeEl.textContent = `1–${list.length}`);
  }
  render(items);

  // 並べ替え
  const sortSelect = document.getElementById('sortSelect');
  sortSelect?.addEventListener('change', (e) => {
    const v = e.target.value;
    let sorted = [...items];
    if (v === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    } else if (v === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name, 'ja'));
    } // Standard は元順
    render(sorted);
  });
})();
  
  // ===== ユーザーアイコン：ログアウト =====
document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.getElementById("userAvatar");
  const dropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!avatar || !dropdown || !logoutBtn) return;

  // アバタークリック → メニュー表示
  avatar.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });

  // ログアウト
  logoutBtn.addEventListener("click", () => {
    // セッション削除したい場合はここに追加
    // localStorage.removeItem("loginUser");

    window.location.href = "login.html";
  });

  // 画面のどこかをクリックしたら閉じる
  document.addEventListener("click", () => {
    dropdown.style.display = "none";
  });
});

``

``
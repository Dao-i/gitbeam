// ── GitBeam v3 — i18n + Categories ──

const DEEPSEEK = "https://api.deepseek.com/chat/completions";
const GT_URL = "https://translate.googleapis.com/translate_a/single";
const MYMEM_URL = "https://api.mymemory.translated.net/get";
const CACHE_KEY = "gitbeam_v3";
const FAVS_KEY = "gitbeam_favs_v3";
const SETTINGS_KEY = "gitbeam_settings";
const CACHE_TTL = 30 * 60 * 1000;

// ── i18n ──
const I18N = {
  "zh-CN": {
    tab_discover:"发现", tab_rankings:"排行榜", tab_favorites:"收藏", tab_settings:"设置",
    cat_all:"全部", cat_ai:"AI·Skill", cat_tool:"软件工具", cat_lib:"框架库", cat_docs:"知识文档", cat_devops:"开发运维",
    rank_daily:"日榜", rank_weekly:"周榜", rank_monthly:"月榜", rank_stars:"总星标", rank_rising:"上升最快",
    loading:"正在抓取 GitHub 热门项目...", empty_done:"这批看完了 ", refresh:"换一批",
    fav_empty:"还没有收藏项目", fav_hint:"在\"发现\"中右滑或点  收藏",
    detail_title:"项目详情", detail_desc_cn:"中文概述", detail_desc_en:"原文描述",
    detail_readme:"README 摘要", detail_deploy:"部署 / 安装", detail_open_gh:"在 GitHub 打开",
    set_color:"主题色", set_mode:"主题模式", mode_dark:"深色", mode_light:"浅色",
    set_size:"窗口大小", size_normal:"标准", size_compact:"紧凑",
    set_lang:"翻译目标语言", set_apikey:"AI 摘要 API Key (DeepSeek)",
    apikey_placeholder:"sk-... 留空则使用 Google 翻译做摘要",
    apikey_hint:"API Key 仅存本地，不会上传。用于 README 智能摘要，留空则降级为原文前几句。",
    set_data:"数据", clear_cache:"清除缓存 (下次启动重新抓取)", clear_favs:"清空收藏夹",
    set_about:"关于",
    translate_loading:"翻译中...", readme_loading:"加载 README 摘要...", readme_none:"暂无 README 摘要",
    rank_fail:"加载失败，请稍后重试", copied:"已复制!"
  },
  en: {
    tab_discover:"Discover", tab_rankings:"Rankings", tab_favorites:"Favorites", tab_settings:"Settings",
    cat_all:"All", cat_ai:"AI·Skill", cat_tool:"Tools", cat_lib:"Libraries", cat_docs:"Docs", cat_devops:"DevOps",
    rank_daily:"Daily", rank_weekly:"Weekly", rank_monthly:"Monthly", rank_stars:"Top Stars", rank_rising:"Rising",
    loading:"Fetching trending repos...", empty_done:"All caught up! ", refresh:"Refresh",
    fav_empty:"No favorites yet", fav_hint:'Swipe right or tap  in Discover',
    detail_title:"Project Details", detail_desc_cn:"Overview", detail_desc_en:"Description",
    detail_readme:"README Summary", detail_deploy:"Install / Deploy", detail_open_gh:"Open in GitHub",
    set_color:"Theme Color", set_mode:"Theme Mode", mode_dark:"Dark", mode_light:"Light",
    set_size:"Window Size", size_normal:"Normal", size_compact:"Compact",
    set_lang:"Translation Language", set_apikey:"AI Summary API Key (DeepSeek)",
    apikey_placeholder:"sk-... Leave empty to skip AI summary",
    apikey_hint:"Stored locally only. Used for README smart summaries. Leave blank to use excerpt instead.",
    set_data:"Data", clear_cache:"Clear cache", clear_favs:"Clear favorites",
    set_about:"About",
    translate_loading:"Translating...", readme_loading:"Loading README summary...", readme_none:"No README summary",
    rank_fail:"Failed to load, retry later", copied:"Copied!"
  },
  ja: {
    tab_discover:"発見", tab_rankings:"ランキング", tab_favorites:"お気に入り", tab_settings:"設定",
    cat_all:"すべて", cat_ai:"AI·Skill", cat_tool:"ツール", cat_lib:"ライブラリ", cat_docs:"ドキュメント", cat_devops:"DevOps",
    rank_daily:"日間", rank_weekly:"週間", rank_monthly:"月間", rank_stars:"スター数", rank_rising:"急上昇",
    loading:"GitHubの注目リポジトリを取得中...", empty_done:"すべて見ました ", refresh:"更新",
    fav_empty:"お気に入りはまだありません", fav_hint:"「発見」で右スワイプまたは をタップ",
    detail_title:"プロジェクト詳細", detail_desc_cn:"概要", detail_desc_en:"説明",
    detail_readme:"README 要約", detail_deploy:"インストール / デプロイ", detail_open_gh:"GitHubで開く",
    set_color:"テーマ色", set_mode:"テーマモード", mode_dark:"ダーク", mode_light:"ライト",
    set_size:"ウィンドウサイズ", size_normal:"標準", size_compact:"コンパクト",
    set_lang:"翻訳言語", set_apikey:"AI要約 APIキー (DeepSeek)",
    apikey_placeholder:"sk-... 空欄の場合はAI要約をスキップ",
    apikey_hint:"ローカルのみ保存。READMEのスマート要約に使用。空欄の場合は抜粋を表示。",
    set_data:"データ", clear_cache:"キャッシュをクリア", clear_favs:"お気に入りをクリア",
    set_about:"について",
    translate_loading:"翻訳中...", readme_loading:"README要約を読み込み中...", readme_none:"README要約なし",
    rank_fail:"読み込み失敗", copied:"コピーしました!"
  }
};

function t(key) {
  const lang = settings.uiLang || "zh-CN";
  return (I18N[lang] && I18N[lang][key]) || (I18N["zh-CN"][key]) || key;
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const text = t(key);
    if (text) el.textContent = text;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const text = t(key);
    if (text) el.placeholder = text;
  });
}

// ── Category Classification (local keyword matching) ──
const CAT_RULES = {
  ai: ["ai","agent","llm","mcp","claude","gpt","rag","neural","model","chatbot","skill","prompt","deepseek","openai","langchain","autogpt","copilot","cursor","codex"],
  tool: ["tool","cli","desktop","app","electron","tauri","gui","terminal","manager","launcher","converter","generator","scraper","downloader","uploader"],
  lib: ["library","framework","sdk","api","package","module","plugin","npm","react","vue","svelte","component","hook","middleware","router"],
  docs: ["awesome","tutorial","docs","guide","book","course","cheatsheet","interview","list","roadmap","handbook","wiki","cookbook","examples"],
  devops: ["docker","kubernetes","cicd","terraform","devops","monitoring","deploy","ci","cd","ansible","helm","grafana","prometheus","nginx","proxy"],
};

function classifyRepo(repo) {
  const text = [
    repo.name || "",
    repo.description || "",
    (repo.topics || []).join(" "),
    repo.language || "",
  ].join(" ").toLowerCase();

  const scores = {};
  for (const [cat, keywords] of Object.entries(CAT_RULES)) {
    scores[cat] = keywords.filter((kw) => text.includes(kw)).length;
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : "tool"; // default to tool
}

let projects = [], currentIndex = 0;
let rankings = {};
let currentRank = "daily";
let currentCatDiscover = "all";
let currentCatRankings = "all";
let favorites = JSON.parse(localStorage.getItem(FAVS_KEY) || "[]");
let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");

// ── Default API key (pre-filled for user) ──
if (!settings.apiKey) {
  settings.apiKey = "";
  saveSettings();
}
function getApiKey() { return settings.apiKey || ""; }

// applySettings() and applyI18n() called inside DOMContentLoaded

// ── DOM refs ──
const $card = document.getElementById("card");
const $cardStack = document.getElementById("card-stack");
const $loading = document.getElementById("loading");
const $empty = document.getElementById("empty");
const $detail = document.getElementById("detail-overlay");
const $rankList = document.getElementById("rank-list");
const $rankLoading = document.getElementById("rank-loading");

document.addEventListener("DOMContentLoaded", () => {
  applySettings();
  applyI18n();

  // Main tabs
  document.querySelectorAll("#tabs .tab").forEach((t) =>
    t.addEventListener("click", () => switchTab(t.dataset.page))
  );
  // Category tabs — discover
  document.querySelectorAll("#cat-tabs-discover .cat-tab").forEach((t) =>
    t.addEventListener("click", () => switchCat("discover", t.dataset.cat))
  );
  // Category tabs — rankings
  document.querySelectorAll("#cat-tabs-rankings .cat-tab").forEach((t) =>
    t.addEventListener("click", () => switchCat("rankings", t.dataset.cat))
  );
  // Rank sub-tabs
  document.querySelectorAll(".rank-tab").forEach((t) =>
    t.addEventListener("click", () => switchRank(t.dataset.rank))
  );
  // Mini toggle
  const $mainContent = document.getElementById("main-content");
  const $miniBar = document.getElementById("mini-bar");
  document.getElementById("mini-toggle").addEventListener("click", () => {
    if (window.gitbeam?.toggleMini) window.gitbeam.toggleMini();
  });

  // Listen for mini mode changes from main process
  if (window.gitbeam?.onMiniChanged) {
    window.gitbeam.onMiniChanged((mini) => {
      $miniBar.classList.toggle("hidden", !mini);
      $mainContent.style.display = mini ? "none" : "";
      document.getElementById("mini-badge").textContent = projects.length ? `${currentIndex + 1}/${projects.length}` : "";
    });
  }

  // Mini bar buttons
  document.getElementById("mini-expand").addEventListener("click", () => {
    if (window.gitbeam?.toggleMini) window.gitbeam.toggleMini();
  });
  document.getElementById("mini-next").addEventListener("click", () => nextCard("skip"));

  // Minimize & close
  document.getElementById("min-btn").addEventListener("click", () => {
    if (window.gitbeam?.minimize) window.gitbeam.minimize();
  });
  document.getElementById("close-btn").addEventListener("click", () => window.close());
  // Detail
  document.getElementById("detail-back").addEventListener("click", closeDetail);
  document.getElementById("detail-open-gh").addEventListener("click", openInGitHub);
  document.getElementById("detail-open-bottom").addEventListener("click", openInGitHub);
  document.getElementById("refresh-discover").addEventListener("click", refreshDiscover);
  setupCardButtons();
  setupSettings();
  document.addEventListener("keydown", handleKeyboard);

  loadDiscover();

  // Auto-refresh every 30 min
  setInterval(() => {
    const activePage = document.querySelector(".page.active")?.id;
    if (activePage === "page-discover") refreshDiscover();
    if (activePage === "page-rankings" && rankings[currentRank]) loadRankings(currentRank);
  }, 30 * 60 * 1000);
});

// ── Tab Navigation ──
function switchTab(page) {
  document.querySelectorAll("#tabs .tab").forEach((t) => t.classList.toggle("active", t.dataset.page === page));
  document.querySelectorAll(".page").forEach((p) => p.classList.toggle("active", p.id === "page-" + page));
  $detail.classList.add("hidden");
  if (page === "discover") renderCard();
  if (page === "rankings" && !rankings[currentRank]) loadRankings(currentRank);
  if (page === "favorites") renderFavorites();
}

function switchCat(area, cat) {
  if (area === "discover") {
    currentCatDiscover = cat;
    document.querySelectorAll("#cat-tabs-discover .cat-tab").forEach((t) => t.classList.toggle("active", t.dataset.cat === cat));
    // Filter locally from cached full list
    const full = getCached("discover_all");
    if (cat === "all") {
      projects = full && full.length ? full : projects;
    } else if (full && full.length) {
      projects = full.filter((r) => classifyRepo(r) === cat);
    }
    currentIndex = 0;
    if (!projects.length) { showEmpty(); return; }
    showLoading(false);
    renderCard();
  } else {
    currentCatRankings = cat;
    document.querySelectorAll("#cat-tabs-rankings .cat-tab").forEach((t) => t.classList.toggle("active", t.dataset.cat === cat));
    // Filter rankings from cached full list
    if (cat === "all") {
      renderRankings(rankings[currentRank] || []);
    } else if (rankings[currentRank]) {
      const filtered = rankings[currentRank].filter((r) => classifyRepo(r) === cat);
      renderRankings(filtered.length ? filtered : []);
    }
  }
}

// ── Discover ──
async function loadDiscover() {
  showLoading(true);
  const cached = getCached("discover_all");
  if (cached && cached.length > 0) {
    projects = currentCatDiscover === "all" ? cached : cached.filter((r) => classifyRepo(r) === currentCatDiscover);
    currentIndex = 0; showLoading(false);
    if (projects.length) renderCard(); else showEmpty();
    translateBatch(cached.filter((r) => !r.description_cn).slice(0, 10));
    return;
  }
  await refreshDiscover();
}

async function refreshDiscover() {
  showLoading(true); $empty.classList.add("hidden");
  try {
    // Always fetch full list — classify locally for categories
    const full = await fetchTrending("weekly", "all");
    setCached("discover_all", full);
    projects = currentCatDiscover === "all" ? full : full.filter((r) => classifyRepo(r) === currentCatDiscover);
    currentIndex = 0; showLoading(false);
    if (projects.length) renderCard(); else showEmpty();
    translateBatch(full.slice(0, 15));
    detectDeployBatch(full.slice(0, 15));
  } catch(e) { console.error("Fetch error:", e); showLoading(false); showEmpty(e.message); }
}

function getCached(key) {
  try {
    const raw = localStorage.getItem(CACHE_KEY + "_" + key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch { return null; }
}

function setCached(catKey, data) {
  localStorage.setItem(CACHE_KEY + "_" + catKey, JSON.stringify({ ts: Date.now(), data }));
}

// ── Fetch ──
async function fetchTrending(period, page = 1) {
  const date = new Date();
  let dateQuery = "";
  if (period === "daily") { date.setDate(date.getDate() - 1); dateQuery = `created:>${date.toISOString().split("T")[0]}`; }
  else if (period === "weekly") { date.setDate(date.getDate() - 7); dateQuery = `created:>${date.toISOString().split("T")[0]}`; }
  else if (period === "monthly") { date.setDate(date.getDate() - 30); dateQuery = `created:>${date.toISOString().split("T")[0]}`; }
  else if (period === "rising") { date.setDate(date.getDate() - 7); dateQuery = `pushed:>${date.toISOString().split("T")[0]}`; }

  // Always fetch without category filter — classify locally instead
  let parts = [dateQuery].filter(Boolean);
  if (period !== "stars") parts.push("stars:>5");
  else parts.push("stars:>1000");

  const query = parts.join(" ");
  const sortParam = period === "rising" ? "updated" : "stars";
  const encodedQ = encodeURIComponent(query).replace(/%20/g, "+");

  const resp = await fetch(
    `https://api.github.com/search/repositories?q=${encodedQ}&sort=${sortParam}&order=desc&per_page=100&page=${page}`,
    { headers: { Accept: "application/vnd.github.v3+json" } }
  );
  if (!resp.ok) throw new Error("API: " + resp.status);
  const json = await resp.json();
  return (json.items || []).map(mapRepo);
}

function mapRepo(r) {
  return {
    id: r.id, name: r.name, full_name: r.full_name,
    owner: r.owner.login, avatar: r.owner.avatar_url,
    description: r.description || "", description_cn: "", readme_cn: "",
    stars: r.stargazers_count, forks: r.forks_count,
    language: r.language, topics: r.topics || [],
    url: r.html_url, clone_url: r.clone_url, deploy: [],
  };
}

// ── Rankings ──
let rankPage = 1;
async function loadRankings(type) {
  currentRank = type;
  rankPage = 1;
  $rankList.innerHTML = ""; $rankLoading.classList.remove("hidden");

  const cacheKey = `rank_${type}`;
  const cached = getCached(cacheKey);
  if (cached) {
    rankings[type] = cached;
    const filtered = currentCatRankings === "all" ? cached : cached.filter((r) => classifyRepo(r) === currentCatRankings);
    renderRankings(filtered.length ? filtered : [], true);
    $rankLoading.classList.add("hidden"); return;
  }

  try {
    const repos = await fetchTrending(type);
    rankings[type] = repos;
    setCached(cacheKey, repos);
    translateBatch(repos.slice(0, 15));
    const filtered = currentCatRankings === "all" ? repos : repos.filter((r) => classifyRepo(r) === currentCatRankings);
    renderRankings(filtered.length ? filtered : [], true);
  } catch(err) {
    console.error("Rankings error:", err);
    $rankList.innerHTML = `<p style="color:var(--red);padding:20px">${t("rank_fail")}: ${err.message || err}</p>`;
  }
  $rankLoading.classList.add("hidden");
}

async function loadMoreRankings() {
  rankPage++;
  $rankLoading.classList.remove("hidden");
  try {
    const repos = await fetchTrending(currentRank, rankPage);
    if (!repos.length) { $rankLoading.innerHTML = "— 已加载全部 —"; return; }
    rankings[currentRank] = rankings[currentRank].concat(repos);
    const all = rankings[currentRank];
    const filtered = currentCatRankings === "all" ? all : all.filter((r) => classifyRepo(r) === currentCatRankings);
    translateBatch(repos);
    renderRankings(filtered, false);
  } catch(err) {
    $rankLoading.innerHTML = `<p style="color:var(--red)">加载失败</p>`;
  }
  $rankLoading.classList.add("hidden");
}

function switchRank(type) {
  document.querySelectorAll(".rank-tab").forEach((t) => t.classList.toggle("active", t.dataset.rank === type));
  loadRankings(type);
}

let displayedRankings = [];

function renderRankings(repos, showMore = false) {
  displayedRankings = repos;
  const moreBtn = showMore ? `<div id="rank-more" class="rank-more-btn">加载更多 ▼</div>` : "";
  $rankList.innerHTML = repos.map((r, i) => `
    <div class="rank-item" data-rid="${r.id}">
      <span class="rank-index ${i < 3 ? "top3" : ""}">${i + 1}</span>
      <div class="rank-info">
        <div class="rank-repo">${r.name}</div>
        <div class="rank-owner">${r.owner}</div>
        <div class="rank-desc-cn">${r.description_cn || r.description || ""}</div>
      </div>
      <div class="rank-stars"><strong>${formatNum(r.stars)}</strong> ★</div>
    </div>`).join("") + moreBtn;

  if (showMore) {
    document.getElementById("rank-more")?.addEventListener("click", loadMoreRankings);
  }

  // Use event delegation to avoid stale/multiple listeners
  $rankList.onclick = (e) => {
    if (e.target.id === "rank-more" || e.target.closest("#rank-more")) return;
    const item = e.target.closest(".rank-item");
    if (!item) return;
    const rid = parseInt(item.dataset.rid);
    const repo = displayedRankings.find((r) => r.id === rid);
    if (!repo) return;
    projects = [repo]; currentIndex = 0; openDetail();
  };
}

// ── Favorites ──
function renderFavorites() {
  favorites = JSON.parse(localStorage.getItem(FAVS_KEY) || "[]");
  const $favList = document.getElementById("fav-list");
  const $favEmpty = document.getElementById("fav-empty");
  applyI18n(); // refresh i18n

  if (favorites.length === 0) {
    $favList.innerHTML = ""; $favEmpty.style.display = "flex"; return;
  }
  $favEmpty.style.display = "none";
  $favList.innerHTML = favorites.map((r, i) => `
    <div class="rank-item" data-fav="${i}">
      <span class="rank-index top3">${i + 1}</span>
      <div class="rank-info">
        <div class="rank-repo">${r.name}</div>
        <div class="rank-owner">${r.owner}</div>
        <div class="rank-desc-cn">${r.description_cn || r.description || ""}</div>
      </div>
      <div class="rank-stars"><strong>${formatNum(r.stars)}</strong> ★</div>
    </div>`).join("");

  $favList.querySelectorAll(".rank-item").forEach((el) => {
    el.addEventListener("click", () => {
      projects = favorites; currentIndex = parseInt(el.dataset.fav);
      switchTab("discover"); setTimeout(() => openDetail(), 300);
    });
  });
}

// ── Card Render ──
function renderCard() {
  if (!projects.length || currentIndex >= projects.length) { showEmpty(); return; }
  const p = projects[currentIndex];
  document.getElementById("mini-badge").textContent = `${currentIndex + 1}/${projects.length}`;
  $cardStack.style.display = "flex"; $empty.classList.add("hidden"); $loading.classList.add("hidden");

  gsap.set($card, { x: 0, y: 0, opacity: 0, scale: 0.9, rotation: 0 });
  $card.querySelector(".card-owner").textContent = p.owner + " /";
  $card.querySelector(".card-name").textContent = p.name;
  $card.querySelector(".card-desc").textContent = p.description || "";
  $card.querySelector(".card-desc-cn").textContent = p.description_cn || t("translate_loading");
  $card.querySelector(".stars").innerHTML = formatNum(p.stars) + " ☆";
  $card.querySelector(".forks").innerHTML = formatNum(p.forks) + " ⑂";

  const tagsEl = $card.querySelector(".card-tags"); tagsEl.innerHTML = "";
  if (p.language) tagsEl.appendChild(makeTag(p.language));
  p.topics.slice(0, 3).forEach((t) => tagsEl.appendChild(makeTag(t)));

  const deployEl = $card.querySelector(".card-deploy"); deployEl.innerHTML = "";
  p.deploy.forEach((d) => { const b = document.createElement("span"); b.className = "deploy-badge"; b.textContent = d; deployEl.appendChild(b); });

  gsap.to($card, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.4)" });
}

function makeTag(text) { const el = document.createElement("span"); el.className = "tag"; el.textContent = text; return el; }

// ── Card Actions ──
function setupCardButtons() {
  $card.querySelector(".skip").addEventListener("click", () => nextCard("skip"));
  $card.querySelector(".save").addEventListener("click", () => saveCard());
  $card.querySelector(".open").addEventListener("click", () => openDetail());
  $card.addEventListener("click", (e) => { if (!e.target.closest("button")) openDetail(); });
}

function handleKeyboard(e) {
  if ($detail.classList.contains("hidden")) {
    if (e.key === "ArrowLeft") nextCard("skip");
    if (e.key === "ArrowRight") saveCard();
    if (e.key === "Enter") openDetail();
  }
  if (e.key === "Escape") closeDetail();
}

function nextCard(dir) {
  gsap.to($card, { x: dir === "skip" ? -200 : 200, opacity: 0, rotate: dir === "skip" ? -15 : 15, duration: 0.25, ease: "power2.in", onComplete: () => { currentIndex++; renderCard(); } });
}

function saveCard() {
  const p = projects[currentIndex];
  if (!favorites.find((f) => f.id === p.id)) { favorites.unshift({ ...p, savedAt: Date.now() }); localStorage.setItem(FAVS_KEY, JSON.stringify(favorites)); }
  gsap.to($card, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 });
  nextCard("save");
}

// ── Detail ──
function openDetail() {
  const p = projects[currentIndex]; if (!p) return;
  gsap.killTweensOf($detail);
  $detail.classList.remove("hidden");
  $detail.style.opacity = "1";
  gsap.from($detail, { opacity: 0, duration: 0.2 });

  document.getElementById("detail-avatar").src = p.avatar;
  document.getElementById("detail-owner").textContent = p.owner;
  document.getElementById("detail-name").textContent = p.name;
  document.getElementById("detail-stars").textContent = "★ " + formatNum(p.stars);
  document.getElementById("detail-forks").textContent = "⑂ " + formatNum(p.forks);
  document.getElementById("detail-lang").textContent = p.language || "";
  document.getElementById("detail-desc-cn").textContent = p.description_cn || t("translate_loading");
  document.getElementById("detail-desc-en").textContent = p.description || "";

  const topicsEl = document.getElementById("detail-topics"); topicsEl.innerHTML = "";
  if (p.language) topicsEl.appendChild(makeTag(p.language));
  p.topics.slice(0, 5).forEach((t) => topicsEl.appendChild(makeTag(t)));

  const deployEl = document.getElementById("detail-deploy"); deployEl.innerHTML = "";
  if (p.deploy.length > 0) {
    p.deploy.forEach((d) => {
      const div = document.createElement("div"); div.className = "deploy-cmd"; div.textContent = d;
      div.addEventListener("click", () => {
        navigator.clipboard.writeText(d).then(() => {
          const orig = div.textContent; div.textContent = t("copied") + " " + d;
          div.style.background = "rgba(46,204,113,0.25)";
          setTimeout(() => { div.style.background = ""; div.textContent = orig; }, 1500);
        });
      });
      deployEl.appendChild(div);
    });
  }

  // Download section
  const dlEl = document.getElementById("detail-downloads");
  if (dlEl) {
    dlEl.innerHTML = `
      <div class="deploy-cmd" onclick="navigator.clipboard.writeText('git clone ${p.clone_url}');this.style.background='rgba(46,204,113,0.25)';setTimeout(()=>this.style.background='',1500)">git clone ${p.clone_url}</div>
      <div class="deploy-cmd" onclick="window.open('${p.url}/archive/refs/heads/main.zip','_blank')">Download ZIP (main)</div>
      <div class="deploy-cmd" style="opacity:0.5" id="detail-releases">检测 Release 中...</div>`;
    // Fetch latest release
    fetch(`https://api.github.com/repos/${p.full_name}/releases?per_page=3`, {headers:{Accept:"application/vnd.github.v3+json"}})
      .then(r => r.json()).then(releases => {
        if (Array.isArray(releases) && releases.length) {
          const el = document.getElementById("detail-releases");
          if (el) {
            el.style.opacity = "1";
            el.innerHTML = releases.slice(0,3).map(r => {
              const asset = r.assets?.[0];
              return asset ? `<a href="${asset.browser_download_url}" target="_blank" style="color:var(--green);text-decoration:none"> ${r.tag_name}: ${asset.name} (${(asset.size/1024/1024).toFixed(1)}MB)</a>` : `<span> ${r.tag_name} (无附件)</span>`;
            }).join("<br>") || "暂无 Release";
          }
        } else {
          const el = document.getElementById("detail-releases");
          if (el) el.textContent = "暂无 Release";
        }
      }).catch(() => {
        const el = document.getElementById("detail-releases");
        if (el) el.textContent = "暂无 Release";
      });
  }

  const readmeEl = document.getElementById("detail-readme");
  readmeEl.innerHTML = `<div class="spinner-sm"></div><span>${t("readme_loading")}</span>`;
  applyI18n(); // refresh detail labels
  fetchReadmeSummary(p).then((s) => {
    readmeEl.innerHTML = s ? `<p>${s}</p>` : `<p style="opacity:0.5">${t("readme_none")}</p>`;
  });
}

function closeDetail() {
  gsap.killTweensOf($detail);
  $detail.style.opacity = "1";
  gsap.to($detail, { opacity: 0, duration: 0.15, onComplete: () => $detail.classList.add("hidden") });
}
function openInGitHub() { const p = projects[currentIndex]; if (p) window.open(p.url, "_blank"); }

// ── README Summary ──
async function fetchReadmeSummary(repo) {
  if (repo.readme_cn) return repo.readme_cn;
  try {
    const resp = await fetch(`https://api.github.com/repos/${repo.full_name}/readme`, { headers: { Accept: "application/vnd.github.v3+json" } });
    if (!resp.ok) return "";
    const content = decodeBase64((await resp.json()).content);
    const excerpt = content.slice(0, 3000).replace(/#{1,6}\s?/g, "").replace(/```[\s\S]*?```/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/!\[[^\]]*\]\([^)]+\)/g, "").trim();
    if (!excerpt) return "";

    const apiKey = getApiKey();
    if (apiKey) {
      const targetLang = settings.targetLang || "zh-CN";
      const langNames = { "zh-CN":"中文","zh-TW":"中文",ja:"日本語",ko:"한국어",fr:"Français",de:"Deutsch",es:"Español",pt:"Português",ru:"Русский",ar:"العربية",hi:"हिन्दी",en:"English" };
      const summary = await callDeepSeek(
        `你是技术文档摘要助手。用3-5句简洁流畅的${langNames[targetLang] || "中文"}概括：这个项目是什么、解决什么问题、怎么用。保留技术名词。`,
        excerpt.slice(0, 2000), 0.4, 600, apiKey
      );
      repo.readme_cn = summary;
      setCached("discover_" + currentCatDiscover, projects);
      return summary;
    } else {
      const fallback = excerpt.slice(0, 200);
      repo.readme_cn = fallback;
      setCached("discover_" + currentCatDiscover, projects);
      return fallback;
    }
  } catch { return ""; }
}

// ── Translation ──
async function translateBatch(repos) {
  const toTranslate = repos.filter((r) => !r.description_cn && r.description);
  if (toTranslate.length === 0) return;
  const targetLang = settings.targetLang || "zh-CN";

  for (const repo of toTranslate) {
    try {
      const text = repo.description.slice(0, 500);
      let result = await googleTranslate(text, "en", targetLang);
      if (!result) result = await mymemoryTranslate(text, "en", targetLang);
      if (result) { repo.description_cn = result; setCached("discover_" + currentCatDiscover, projects); }
    } catch {}
  }

  if (document.querySelector("#page-discover").classList.contains("active") && projects[currentIndex]?.description_cn) renderCard();
  if (document.querySelector("#page-rankings").classList.contains("active") && rankings[currentRank]) renderRankings(rankings[currentRank]);
}

async function googleTranslate(text, from, to) {
  try {
    const resp = await fetch(`${GT_URL}?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await resp.json();
    return (data[0] || []).map((s) => s[0] || "").join("") || null;
  } catch { return null; }
}

async function mymemoryTranslate(text, from, to) {
  try {
    const resp = await fetch(`${MYMEM_URL}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
    const data = await resp.json();
    return data.responseData?.translatedText || null;
  } catch { return null; }
}

// ── Deploy Detection ──
async function detectDeployBatch(repos) {
  for (const repo of repos) {
    try {
      const resp = await fetch(`https://api.github.com/repos/${repo.full_name}/readme`, { headers: { Accept: "application/vnd.github.v3+json" } });
      if (!resp.ok) continue;
      const content = decodeBase64((await resp.json()).content);
      const methods = [];
      if (/npm\s+(install|i|run|start|test)/im.test(content)) methods.push("npm install");
      if (/pip\s+install/im.test(content)) methods.push("pip install");
      if (/docker\s+(run|compose|build)/im.test(content)) methods.push("docker compose up");
      if (/pnpm\s+(install|add)/im.test(content)) methods.push("pnpm install");
      if (/yarn\s+(install|add|dev)/im.test(content)) methods.push("yarn install");
      if (/cargo\s+(install|build|run)/im.test(content)) methods.push("cargo build");
      if (/go\s+(get|install|build|run)/im.test(content)) methods.push("go install");
      if (/gradlew|gradle/i.test(content)) methods.push("./gradlew build");
      if (methods.length === 0) {
        const lang = repo.language || "";
        if (lang === "Python") methods.push("pip install -r requirements.txt");
        else if (lang === "JavaScript" || lang === "TypeScript") methods.push("npm install");
        else if (lang === "Go") methods.push("go install");
        else if (lang === "Rust") methods.push("cargo build");
        else methods.push("git clone " + repo.clone_url);
      }
      repo.deploy = [...new Set(methods)].slice(0, 4);
    } catch { repo.deploy = ["git clone " + repo.clone_url]; }
  }
  setCached("discover_" + currentCatDiscover, projects);
  if (document.querySelector("#page-discover").classList.contains("active")) renderCard();
}

// ── DeepSeek ──
async function callDeepSeek(system, user, temp, maxTokens, apiKey) {
  const resp = await fetch(DEEPSEEK, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey || getApiKey()}` },
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: system }, { role: "user", content: user }], temperature: temp, max_tokens: maxTokens }),
  });
  const data = await resp.json();
  return data.choices?.[0]?.message?.content || "";
}

// ── Settings ──
function setupSettings() {
  document.querySelectorAll(".color-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      document.querySelectorAll(".color-dot").forEach((d) => d.classList.remove("active")); dot.classList.add("active");
      setAccentColor(dot.dataset.color); settings.accent = dot.dataset.color; saveSettings();
    });
  });
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach((b) => b.classList.remove("active")); btn.classList.add("active");
      document.documentElement.classList.toggle("light", btn.dataset.mode === "light");
      settings.mode = btn.dataset.mode; saveSettings();
    });
  });
  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("active")); btn.classList.add("active");
      document.documentElement.classList.toggle("compact", btn.dataset.size === "compact");
      settings.size = btn.dataset.size; saveSettings();
    });
  });

  // Language select
  const langSelect = document.getElementById("lang-select");
  langSelect.addEventListener("change", () => {
    settings.targetLang = langSelect.value;
    // Also set UI language if available
    if (I18N[langSelect.value]) { settings.uiLang = langSelect.value; }
    else if (langSelect.value === "zh-CN" || langSelect.value === "zh-TW") { settings.uiLang = "zh-CN"; }
    else { settings.uiLang = "en"; }
    saveSettings();
    applyI18n();
    // Re-translate
    projects.forEach((r) => { r.description_cn = ""; r.readme_cn = ""; });
    Object.values(rankings).forEach((list) => list.forEach((r) => { r.description_cn = ""; r.readme_cn = ""; }));
    translateBatch(projects.filter((r) => r.description).slice(0, 10));
  });

  // API Key
  const apiKeyInput = document.getElementById("apikey-input");
  if (settings.apiKey) apiKeyInput.value = settings.apiKey;
  apiKeyInput.addEventListener("input", () => { settings.apiKey = apiKeyInput.value.trim(); saveSettings(); });
  document.getElementById("apikey-toggle").addEventListener("click", () => {
    apiKeyInput.type = apiKeyInput.type === "password" ? "text" : "password";
  });

  document.getElementById("clear-cache-btn").addEventListener("click", () => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_KEY));
    keys.forEach((k) => localStorage.removeItem(k));
    projects = []; rankings = {}; alert(t("clear_cache") + " OK");
  });
  document.getElementById("clear-favs-btn").addEventListener("click", () => {
    if (confirm(t("clear_favs") + "?")) { favorites = []; localStorage.setItem(FAVS_KEY, "[]"); renderFavorites(); }
  });
}

function setAccentColor(hex) {
  const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
  document.documentElement.style.setProperty("--accent", "#" + hex);
  document.documentElement.style.setProperty("--accent-rgb", `${r},${g},${b}`);
  document.documentElement.style.setProperty("--accent-dim", `#${darken(hex)}`);
}
function darken(hex) {
  return [0,2,4].map((i) => Math.max(0, parseInt(hex.slice(i, i + 2), 16) - 40).toString(16).padStart(2, "0")).join("");
}

function applySettings() {
  if (settings.accent) { setAccentColor(settings.accent); const d = document.querySelector(`.color-dot[data-color="${settings.accent}"]`); if (d) { document.querySelectorAll(".color-dot").forEach((x) => x.classList.remove("active")); d.classList.add("active"); } }
  if (settings.mode === "light") { document.documentElement.classList.add("light"); const b = document.querySelector('.mode-btn[data-mode="light"]'); if (b) { document.querySelectorAll(".mode-btn").forEach((x) => x.classList.remove("active")); b.classList.add("active"); } }
  if (settings.size === "compact") { document.documentElement.classList.add("compact"); const b = document.querySelector('.size-btn[data-size="compact"]'); if (b) { document.querySelectorAll(".size-btn").forEach((x) => x.classList.remove("active")); b.classList.add("active"); } }
  if (settings.targetLang) { const s = document.getElementById("lang-select"); if (s) s.value = settings.targetLang; }
  if (settings.apiKey) { const i = document.getElementById("apikey-input"); if (i) i.value = settings.apiKey; }
  if (settings.uiLang) applyI18n();
}
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }

// ── Helpers ──
function showLoading(show) { $loading.classList.toggle("hidden", !show); $cardStack.style.display = show ? "none" : "flex"; $empty.classList.add("hidden"); }
function showEmpty(errMsg) {
  $cardStack.style.display = "none"; $loading.classList.add("hidden"); $empty.classList.remove("hidden");
  if (errMsg) {
    $empty.innerHTML = `<p style="color:var(--red)">${t("rank_fail")}: ${errMsg}</p><button id="refresh-discover-err" class="primary-btn">${t("refresh")}</button>`;
    document.getElementById("refresh-discover-err").addEventListener("click", refreshDiscover);
  }
  applyI18n();
}
function formatNum(n) { return n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n); }
function decodeBase64(str) { try { const b = atob(str); const bytes = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) bytes[i] = b.charCodeAt(i); return new TextDecoder("utf-8").decode(bytes); } catch { return ""; } }

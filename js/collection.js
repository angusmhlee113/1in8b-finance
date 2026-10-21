// ---------- My lives: what you've collected across every life, saved in this browser ----------

const COLL_KEY = "myLives";
const freshColl = () => ({ lives: 0, countries: {}, endings: {}, types: {}, best: null, bestBeat: null, comeback: null, swans: {}, flexes: 0, dodged: 0, aiPaid: 0, eras: {}, leek: { lives: 0, times: 0, best: 0 } });

function loadColl() {
  try { return { ...freshColl(), ...JSON.parse(localStorage.getItem(COLL_KEY) || "{}") }; } catch { return freshColl(); }
}
function saveColl(c) {
  try { localStorage.setItem(COLL_KEY, JSON.stringify(c)); } catch {}
}

const countryOf = iso => COUNTRIES.find(c => c[5] === iso);
// "the United States" reads as a sentence fragment on its own tile
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const ENDINGS = () => [
  ...TIERS.map(([, emoji, title, , id, hint]) => ({ id, emoji, title, hint })),
  { id: "sec", emoji: "⚖️", title: L("SEC'd", "被證監會盯上"), hint: L("Get caught by the SEC", "被證監會抓到") },
  { id: "burnout", emoji: "🧘", title: L("Burnt Out", "燃燒殆盡"), hint: L("Run your sanity down to zero", "讓理智跌到零") },
];

// era names that don't depend on the current life, for the collection page
const ERA_LABELS = {
  ai: L("🤖 The AI boom", "🤖 AI 熱潮"), homeboom: L("🚀 Your country's boom", "🚀 家鄉大繁榮"),
  crypto: L("₿ The crypto supercycle", "₿ 加密貨幣超級週期"), green: L("⚡ The green energy rush", "⚡ 綠色能源熱潮"),
  property: L("🏠 The property boom", "🏠 樓市熱潮"), biotech: L("💊 The miracle drug", "💊 神奇藥物"),
};

const SWAN_NAMES = {
  pandemic: L("A global pandemic", "全球大流行"), bankrun: L("Your bank collapsed", "銀行倒閉"),
  homecrisis: L("Crisis back home", "家鄉危機"), rogue: L("A rogue trader", "流氓交易員"),
  inheritance: L("A surprise inheritance", "意外遺產"), hundredx: L("Your forgotten 100x", "遺忘的百倍股"),
  flashcrash: L("The flash crash", "閃崩"),
};

// adds the life that just ended, and returns what it unlocked for the first time
function recordLife(e) {
  const c = loadColl();
  const news = [];
  const { id, emoji, title } = endingInfo(e);
  c.lives++;
  if (!c.countries[s.c.iso]) news.push(L(`First life born in ${s.c.flag} ${s.c.name.en}`, `首次出生於 ${s.c.flag} ${s.c.name.zh}`));
  c.countries[s.c.iso] = (c.countries[s.c.iso] || 0) + 1;
  if (!c.endings[id]) news.push(cat(L("New ending: ", "新結局："), `${emoji} `, title));
  c.endings[id] = (c.endings[id] || 0) + 1;
  if (s.type) {
    const t = typeOf();
    if (c.types[s.type] === undefined) news.push(cat(L("First life as ", "首次以此類型完成："), `${t.emoji} `, t.name));
    c.types[s.type] = Math.max(c.types[s.type] ?? -Infinity, s.cash);
  }
  if (!c.best || s.cash > c.best.cash) {
    if (c.best) news.push(L(`New best net worth: ${fmt(s.cash)}`, `新最高身家：${fmt(s.cash)}`));
    c.best = { cash: s.cash, name: playerName, iso: s.c.iso, age: s.age, ending: id };
  }
  if (!c.bestBeat || e.compare.beat > c.bestBeat.beat) c.bestBeat = { beat: e.compare.beat, iso: s.c.iso, tier: s.tier };
  // born into one of the two poorest family types and still made a million
  if (s.tier <= 1 && s.cash >= 1e6 && (!c.comeback || s.cash > c.comeback.cash)) {
    if (!c.comeback) news.push(L("Rags to riches: born poor, finished a millionaire", "白手興家：出身貧窮，最終成為百萬富翁"));
    c.comeback = { cash: s.cash, iso: s.c.iso, tier: s.tier };
  }
  for (const w of s.flags.swans || []) {
    if (!c.swans[w]) news.push(cat(L("Survived a black swan: ", "經歷黑天鵝："), SWAN_NAMES[w]));
    c.swans[w] = (c.swans[w] || 0) + 1;
  }
  if (s.flags.flexed) c.flexes++;
  if (s.flags.dodged) c.dodged++;
  if (s.flags.aiPaid) c.aiPaid++;
  const leeks = (s.flags.leeks || []).length;
  if (leeks) {
    const tier = leekTier(leeks);
    if (!c.leek.best || tier.min > leekTier(c.leek.best).min) news.push(cat(`${tier.emoji} `, L("Unlocked: ", "解鎖："), tier.title));
    c.leek = { lives: c.leek.lives + 1, times: c.leek.times + leeks, best: Math.max(c.leek.best, leeks) };
  }
  for (const id of Object.keys(s.flags.erasSeen || {})) {
    const won = !!(s.flags.erasWon || {})[id];
    const prev = c.eras[id] || { seen: 0, won: 0 };
    if (won && !prev.won) news.push(cat(L("Rode a boom: ", "乘上熱潮："), ERA_LABELS[id]));
    c.eras[id] = { seen: prev.seen + 1, won: prev.won + (won ? 1 : 0) };
  }
  saveColl(c);
  return news;
}

function drawCollection() {
  clearInterval(ui.timer);
  const c = loadColl();
  const endings = ENDINGS();
  const nCountries = Object.keys(c.countries).length;
  const nEndings = endings.filter(x => c.endings[x.id]).length;
  const stat = (label, value) => `<div class="cstat"><b>${value}</b><span>${tr(label)}</span></div>`;
  const where = iso => { const k = countryOf(iso); return k ? `${k[1]} ${tr(k[0])}` : ""; };

  const flags = COUNTRIES.slice().sort((a, b) => b[2] - a[2]).map(([name, flag, pop, , , iso]) => {
    const n = c.countries[iso] || 0;
    const share = pop * 1e6 / WORLD_POP * 100;
    return `<div class="ctile ${n ? "on" : "off"}">
      <span class="cflag">${flag}</span>
      <b>${capitalize(tr(name))}</b>
      <small>${n ? tr(L(`×${n}`, `×${n}`)) + " · " : ""}${share.toFixed(share < 1 ? 2 : 1)}%</small>
    </div>`;
  }).join("");

  const endingTiles = endings.map(x => {
    const n = c.endings[x.id] || 0;
    return `<div class="ctile ending ${n ? "on" : "off"}">
      <span class="cflag">${n ? x.emoji : "🔒"}</span>
      <b>${n ? tr(x.title) : "???"}</b>
      <small>${n ? tr(L(`×${n}`, `×${n}`)) : tr(x.hint)}</small>
    </div>`;
  }).join("");

  const typeTiles = Object.entries(TYPES).map(([key, t]) => {
    const best = c.types[key];
    return `<div class="ctile ${best !== undefined ? "on" : "off"}">
      <span class="cflag">${t.emoji}</span>
      <b>${tr(t.name)} · ${tr(t.title)}</b>
      <small>${best !== undefined ? tr(L(`Best: ${fmt(best)}`, `最佳：${fmt(best)}`)) : tr(L("Not played yet", "尚未玩過"))}</small>
    </div>`;
  }).join("");

  const row = (label, value) => `<div class="frow"><span>${tr(label)}</span><span><b>${value}</b></span></div>`;
  const none = tr(L("Not yet", "暫時沒有"));
  const records = [
    row(L("Best net worth", "最高身家"), c.best ? `${fmt(c.best.cash)} <small>${esc(c.best.name)} · ${where(c.best.iso)}</small>` : none),
    row(L("Best against lives born like you", "勝過起點相同人生的最佳紀錄"), c.bestBeat ? `${Math.round(c.bestBeat.beat * 100)}% <small>${where(c.bestBeat.iso)} · ${tr(FAMILY[c.bestBeat.tier].name)}</small>` : none),
    row(L("Rags to riches", "白手興家"), c.comeback ? `${fmt(c.comeback.cash)} <small>${where(c.comeback.iso)} · ${tr(FAMILY[c.comeback.tier].name)}</small>` : none),
    row(L("Gain screenshots posted", "發佈過的盈利截圖"), c.flexes ? tr(L(`${c.flexes} (dodged the curse ${c.dodged})`, `${c.flexes} 次（避過詛咒 ${c.dodged} 次）`)) : none),
    row(L("AI startup equity that paid off", "成功套現的 AI 初創股權"), c.aiPaid || none),
    row(L("🥬 Times harvested as a leek", "🥬 作為韭菜被收割次數"), c.leek.times
      ? tr(L(`${c.leek.times} in ${c.leek.lives} lives · best rank: ${leekTier(c.leek.best).emoji} ${leekTier(c.leek.best).title.en}`, `${c.leek.lives} 段人生中 ${c.leek.times} 次 · 最高級別：${leekTier(c.leek.best).emoji} ${leekTier(c.leek.best).title.zh}`))
      : none),
  ].join("");

  const swans = Object.entries(SWAN_NAMES).map(([id, name]) => {
    const n = c.swans[id] || 0;
    return `<span class="chip ${n ? "unlock" : ""}">${n ? "⚫" : "🔒"} ${n ? tr(name) : "???"}${n > 1 ? ` ×${n}` : ""}</span>`;
  }).join("");

  app.className = "start wide";
  app.innerHTML = `
    <div class="start-top"><button class="back-btn" data-act="back">${tr(L("← Back", "← 返回"))}</button>${langHTML()}</div>
    <section class="card coll">
      <div class="eyebrow">${tr(L("Saved in this browser", "儲存在此瀏覽器"))}</div>
      <h1>${tr(L("My lives", "我的人生"))}</h1>
      <div class="cstats">
        ${stat(L("Lives lived", "已活過的人生"), c.lives)}
        ${stat(L("Countries born in", "出生過的國家"), `${nCountries}/${COUNTRIES.length}`)}
        ${stat(L("Endings found", "已解鎖結局"), `${nEndings}/${endings.length}`)}
        ${stat(L("Best net worth", "最高身家"), c.best ? fmt(c.best.cash) : "—")}
      </div>

      <h3 class="end-h">${tr(L("Where you've been born", "你出生過的地方"))}</h3>
      <p class="muted small">${tr(L("Births follow real populations, so the percentage is your chance of being born there. Small countries are rare finds.", "出生地按真實人口比例決定，百分比就是你在那裡出生的機會。小國家是稀有的發現。"))}</p>
      <div class="cgrid">${flags}</div>

      <h3 class="end-h">${tr(L("Endings", "結局"))}</h3>
      <div class="cgrid">${endingTiles}</div>

      <h3 class="end-h">${tr(L("Personality types", "性格類型"))}</h3>
      <div class="cgrid">${typeTiles}</div>

      <h3 class="end-h">${tr(L("Records", "紀錄"))}</h3>
      <div class="records">${records}</div>

      <h3 class="end-h">${tr(L(`Black swans survived (${Object.keys(c.swans).length}/${Object.keys(SWAN_NAMES).length})`, `經歷過的黑天鵝（${Object.keys(c.swans).length}/${Object.keys(SWAN_NAMES).length}）`))}</h3>
      <div class="chips">${swans}</div>

      <h3 class="end-h">${tr(L("Big opportunities", "重大機遇"))}</h3>
      <p class="muted small">${tr(L("Booms you've lived through, and how many times you were in when they paid off.", "你經歷過的熱潮，以及在熱潮成功時你有參與的次數。"))}</p>
      <div class="cgrid">${Object.entries(ERA_LABELS).map(([id, name]) => {
        const e = c.eras[id];
        return `<div class="ctile ${e ? "on" : "off"}"><b>${e ? tr(name) : "🔒 ???"}</b><small>${e ? tr(L(`Lived through ×${e.seen} · rode it ×${e.won}`, `經歷 ×${e.seen} · 乘上 ×${e.won}`)) : tr(L("Not seen yet", "尚未遇到"))}</small></div>`;
      }).join("")}</div>

      <button class="primary" data-act="back">${tr(L("Live another life →", "再活一次 →"))}</button>
      <button class="secondary danger" data-act="reset-coll">${tr(ui.confirmReset ? L("Click again to erase everything", "再按一次以清除全部紀錄") : L("Erase my collection", "清除我的收藏"))}</button>
    </section>`;
  redraw = drawCollection;
  window.scrollTo(0, 0);
}

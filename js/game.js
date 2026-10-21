// ---------- life ----------

const BIRTH_YEAR = new Date().getFullYear();

function makeFamily(tier, g) {
  const jobs = PARENT_JOBS[tier];
  return {
    mother: { age: rint(19, 36), job: tier >= 1 && tier <= 3 && Math.random() < 0.3 ? HOMEMAKER : pick(jobs) },
    // old money means Dad really is a managing director
    father: { age: rint(21, 40), job: tier === 5 ? PARENT_JOBS[5][0] : pick(jobs) },
    siblings: [rint(1, 4), rint(0, 3), rint(0, 2), rint(0, 2), rint(0, 2)][g],
  };
}

function birth() {
  const [name, flag, pop, g, hub, iso] = COUNTRIES[weightedIdx(COUNTRIES.map(c => c[2]))];
  const t = g / 4;
  const poor = [55, 30, 11, 3, 0.9, 0.1], rich = [8, 25, 35, 20, 10, 2];
  const tier = weightedIdx(poor.map((v, i) => v + (rich[i] - v) * t));
  s = {
    age: 0, c: { name, flag, pop, g, hub, iso }, tier,
    cash: Math.round(FAMILY[tier].cash * (0.2 + 0.2 * g)),
    network: clamp(tier * 12 + hub * 8 + rint(0, 10)),
    hustle: clamp(30 + rint(0, 30) + (tier <= 1 ? 15 : 0)),
    sanity: clamp(70 + rint(0, 20)),
    income: 0, job: JOBS.kid, track: null, school: null, score: 0,
    heat: 0, city: null, flags: {}, log: [], used: new Set(),
    risk: 0, type: null, notes: [], ai: null,
    look: makeLook(iso), home: pick(HOMETOWNS[iso]), family: makeFamily(tier, g),
    peers: Array.from({ length: 4 }, makePeer), record: [], years: [],
  };
  // the AI boom arrives at a random point in your career and runs for 5-8 years
  let start = rint(23, 33);
  while (MILESTONE_AT[start]) start++;
  let end = start + rint(5, 8);
  while (MILESTONE_AT[end]) end++;
  s.ai = { start, end, exposure: 0 };
}

// each year: invested money compounds, debt accrues interest, and you save your net income
function advanceTo(age) {
  while (s.age < age) {
    const t = typeOf();
    const year = s.age + 1;
    if (s.cash > 0 && t) {
      // fat tails: most years follow the bell curve, but a few are violent crashes or melt-ups
      const roll = Math.random();
      if (s.age >= 18 && roll < 0.04) {
        const drop = Math.min(0.85, rnd(0.25, 0.45) * t.crash);
        s.cash *= 1 - drop;
        s.notes.push({ bad: true, text: L(`📉 Crash year at ${year}: out of nowhere, markets collapsed. Your portfolio fell ${pct(drop)}.`, `📉 ${year} 歲崩盤年：毫無預兆地，市場崩潰了。你的投資組合下跌 ${pct(drop)}。`) });
      } else if (s.age >= 18 && roll < 0.07) {
        const gain = rnd(0.3, 0.6) * t.swing;
        s.cash *= 1 + gain;
        s.notes.push({ bad: false, text: L(`📈 Melt-up year at ${year}: markets went vertical. Your portfolio rose ${pct(gain)}.`, `📈 ${year} 歲狂飆年：市場直線飆升。你的投資組合上升 ${pct(gain)}。`) });
      } else {
        s.cash *= 1 + Math.max(-0.5, t.ret + t.vol * gauss());
      }
      if (s.ai.exposure > 0 && s.age >= s.ai.start && s.age < s.ai.end) {
        const gain = s.ai.exposure * rnd(0.1, 0.4) * t.swing;
        s.cash *= 1 + gain;
        s.notes.push({ bad: false, text: L(`🤖 AI boom: your AI stocks pushed your portfolio up another ${pct(gain)} this year.`, `🤖 AI 熱潮：你的 AI 股令投資組合今年再升 ${pct(gain)}。`) });
      }
    } else if (s.cash > 0) {
      s.cash *= 1.05;
    } else {
      s.cash *= 1.04;
    }
    s.cash += s.income;
    if (s.track === "elite") s.sanity -= 3;
    s.age++;
  }
  fix();
}

function setType() {
  s.type = s.risk >= 2 ? "aggressive" : s.risk <= -2 ? "passive" : "balanced";
}

const record = entry => s.record.push({ age: s.age, ...entry });

// ---------- the clock ----------

const SPEEDS = [1, 2, 4, 8, 12, 16];
const YEAR_MS = 2200;
const ui = { speed: 1, paused: false, auto: false, modal: null, queue: [], aside: false, over: false, timer: null };

function startTimer() {
  clearInterval(ui.timer);
  ui.timer = setInterval(tick, YEAR_MS / ui.speed);
}

function tick() {
  if (ui.paused || ui.modal || ui.over) return;
  step();
  renderAll();
}

// lives one year: market moves, then whatever happens at this age
function step() {
  const age = s.age + 1;
  const start = s.cash;
  advanceTo(age);
  const year = s.years[age] = { start, crash: false, swan: false };
  for (const n of s.notes) {
    record({ text: n.text, tone: n.bad ? "bad" : "good" });
    if (n.bad) year.crash = true;
  }
  s.notes = [];
  if (age >= END_AGE) return finish("normal");
  if (s.sanity <= 0) return finish("burnout");

  if (age < TYPE_AGE) {
    const line = childhoodLine(age);
    if (line) record({ text: line });
    if (MILESTONE_AT[age]) present(MILESTONE_AT[age], "m" + age);
    return;
  }
  if (!s.type) {
    setType();
    const t = typeOf();
    record({ text: L(`Your temperament has settled: you're the ${t.name.en} type, ${t.title.en}.`, `你的性格已經定型：你是${t.name.zh}，${t.title.zh}。`), tone: "good" });
    if (!ui.auto) openModal({ kind: "type" });
  }
  const def = sceneFor(age);
  if (def.pre) {
    const end = def.pre();
    if (end) return finish(end);
  }
  const id = def.id || (MILESTONE_AT[age] === def ? "m" + age : def === AI_START ? "aiStart" : def === AI_END ? "aiEnd" : null);
  present(def, id);
}

function present(def, id) {
  const st = def.build();
  st.id = id;
  if (st.passive) {
    const r = resolve(st, { label: null, run: st.run });
    // the dramatic no-choice moments still stop the clock so you see them
    if ((st.swan || def === AI_END) && !ui.auto) openModal({ kind: "result", st, c: { label: null }, r });
    else if (s.sanity <= 0) finish("burnout");
    return;
  }
  if (ui.auto) {
    resolve(st, pick(st.choices.filter(c => !c.locked)));
    if (s.sanity <= 0) finish("burnout");
    return;
  }
  openModal({ kind: "decision", st });
}

// runs a choice (or a no-choice event), applies personality, and writes it to the life record
function resolve(st, c) {
  const before = { cash: s.cash, network: s.network, hustle: s.hustle, sanity: s.sanity, job: s.job };
  rolled = false;
  const text = c.run();
  const t = typeOf();
  const base = s.cash - before.cash;
  // personality scales the money won or lost on anything that involved a dice roll
  const extra = rolled && t && t.swing !== 1 ? Math.round(base * (t.swing - 1)) : 0;
  s.cash += extra;
  fix();
  if (c.label || st.swan) s.log.push({ age: s.age, title: st.title, choice: c.label || L("out of nowhere", "突如其來") });

  const chips = [];
  if (Math.abs(base) >= 1) chips.push({ text: `${base > 0 ? "+" : "-"}${fmt(Math.abs(base))}`, good: base > 0 });
  if (Math.abs(extra) >= 1) chips.push({ text: cat(`${t.emoji} `, t.name, `: ${extra > 0 ? "+" : "-"}${fmt(Math.abs(extra))}`), good: extra > 0 });
  for (const k of ["network", "hustle", "sanity"]) {
    const d = s[k] - before[k];
    if (d) chips.push(statChip(k, d));
  }
  if (s.job !== before.job) chips.push({ text: cat(UI.newRole, " ", s.job) });

  const gain = s.cash - before.cash;
  const tone = st.swan ? "swan" : gain < 0 || s.sanity - before.sanity <= -10 ? "bad" : gain > 0 ? "good" : "";
  if (st.swan && s.years[s.age]) s.years[s.age].swan = true;
  record({ title: st.title, choice: c.label, text, chips, tone });
  const bigWin = before.cash > 0 && gain >= BIG_WIN.min && gain / before.cash >= BIG_WIN.pct ? { gain, pct: gain / before.cash } : null;
  return { text, chips, bigWin };
}

function openModal(m) {
  if (ui.modal) ui.queue.push(m);
  else { ui.modal = m; ui.aside = false; }
}

function closeModal() {
  ui.modal = ui.queue.shift() || null;
  ui.aside = false;
  if (!ui.modal && !ui.over && s.sanity <= 0) finish("burnout");
  renderAll();
}

function choose(i) {
  const m = ui.modal;
  const c = m.st.choices[i];
  if (!c || c.locked) return;
  const r = resolve(m.st, c);
  ui.modal = { kind: "result", st: m.st, c, r };
  renderAll();
}

// skips ahead year by year until something needs you
function nextDecision() {
  ui.paused = false;
  for (let i = 0; i < 60 && !ui.modal && !ui.over; i++) step();
  renderAll();
}

function finish(kind) {
  if (ui.over) return;
  ui.over = true;
  clearInterval(ui.timer);
  let fine = 0;
  if (kind === "sec") {
    fine = Math.max(0, Math.round(s.cash * 0.9));
    s.cash -= fine;
  }
  ui.queue = [];
  ui.modal = { kind: "ending", e: { kind, fine } };
  ui.aside = false;
}

function startLife() {
  birth();
  Object.assign(ui, { paused: false, modal: null, queue: [], aside: false, over: false, seen: 0, shown: null });
  record({ text: L(`You were born in ${s.home.en}, ${s.c.name.en}.`, `你在${s.c.name.zh}${s.home.zh}出生。`) });
  buildShell();
  openModal({ kind: "birth" });
  renderAll();
  startTimer();
}

// ---------- the gain screenshot ----------

const gainPct = p => (p * 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";

function flexCaption(p) {
  if (p >= 1) return L("Generational wealth, loading…", "跨代財富，載入中……");
  if (p >= 0.5) return L("Sorry, can't talk. Counting money.", "抱歉，沒空聊，正在數錢。");
  if (p >= 0.25) return L("Just a normal Tuesday for me.", "對我來說只是個普通的星期二。");
  return L("Not too much, not too little. Just enough.", "不多不少，賺錢就好。");
}

// draws the screenshot card on a canvas so it can be saved as a real image
function drawGainCard(p) {
  const W = 360, H = 560, k = 2;
  const cv = document.createElement("canvas");
  cv.width = W * k; cv.height = H * k;
  const g = cv.getContext("2d");
  g.scale(k, k);
  const sans = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif`;

  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#ffffff");
  bg.addColorStop(1, "#e6f5ec");
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);

  // brokerage logo and name, top left
  g.fillStyle = "#0b7a4b";
  g.beginPath(); g.arc(34, 34, 14, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#ffffff"; g.font = `800 15px ${sans}`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(BROKER_NAME[0], 34, 35);
  g.fillStyle = "#17181c"; g.font = `750 17px ${sans}`; g.textAlign = "left";
  g.fillText(BROKER_NAME, 56, 35);

  g.textAlign = "center"; g.textBaseline = "alphabetic";
  g.fillStyle = "#6a6b74"; g.font = `500 15px ${sans}`;
  g.fillText(tr(L("Today's P&L", "今日盈虧")), W / 2, 100);
  g.fillStyle = "#0a9a58"; g.font = `800 ${p >= 10 ? 38 : 48}px ${sans}`;
  g.fillText("+" + gainPct(p), W / 2, 156);

  // mascot matches your personality type
  g.fillStyle = "rgba(11,122,75,0.08)";
  g.beginPath(); g.arc(W / 2, 290, 105, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#000000"; g.font = `140px ${sans}`; g.textBaseline = "middle";
  g.fillText({ aggressive: "🦈", passive: "🐢" }[s.type] || "🐂", W / 2, 296);

  g.textBaseline = "alphabetic"; g.fillStyle = "#6a6b74"; g.font = `500 15px ${sans}`;
  g.fillText(tr(flexCaption(p)), W / 2, 440);

  const now = new Date();
  const two = n => String(n).padStart(2, "0");
  g.textAlign = "left"; g.fillStyle = "#17181c"; g.font = `650 14px ${sans}`;
  g.fillText(`${s.c.flag} @${playerName}`, 24, H - 46);
  g.fillStyle = "#9a9ba6"; g.font = `500 12px ${sans}`;
  g.fillText(`${now.getFullYear()}/${two(now.getMonth() + 1)}/${two(now.getDate())} ${two(now.getHours())}:${two(now.getMinutes())}`, 24, H - 26);
  g.textAlign = "right"; g.fillText(tr(L("1 in 8 Billion", "80 億分之一")), W - 24, H - 26);
  return cv.toDataURL("image/png");
}

function postGains() {
  const { st, r } = ui.modal;
  const win = r.bigWin;
  const before = { cash: s.cash, network: s.network, sanity: s.sanity };
  // the screenshot curse: half the time, the market pulls back right after you post
  let text;
  if (Math.random() < 0.5) {
    const back = Math.round(win.gain * rnd(0.3, 0.8));
    s.cash -= back; s.sanity -= 6;
    text = L(`The screenshot curse strikes. Minutes after you post, the market pulls back and you give back ${fmt(back)} of your win. The comments are brutal.`,
      `截圖詛咒應驗了。你發帖幾分鐘後市場回調，你把 ${fmt(back)} 的利潤吐了回去。留言區非常殘酷。`);
  } else {
    s.network += 8; s.sanity += 3;
    text = L(`No curse this time. Your post gets 2,400 likes and a dozen DMs asking for "the ticker."`,
      "這次沒有詛咒。你的帖文獲得 2,400 個讚，還有十幾個私訊問你「買了哪隻股」。");
  }
  fix();
  const cursed = s.cash < before.cash;
  const title = L("Posted a gain screenshot", "發佈了盈利截圖");
  s.log.push({ age: s.age, title, choice: cursed ? L("got hit by the pullback", "遇上回調") : L("got away with it", "全身而退") });
  const chips = [];
  if (s.cash !== before.cash) chips.push({ text: `-${fmt(before.cash - s.cash)}`, good: false });
  for (const k of ["network", "sanity"]) {
    const d = s[k] - before[k];
    if (d) chips.push(statChip(k, d));
  }
  record({ title, text, chips, tone: cursed ? "bad" : "good" });
  ui.modal = { kind: "flex", st, win, text, chips };
  renderAll();
}

// ---------- ending ----------

function richerThan(w) {
  if (w < 0) return 0.03;
  if (w < WEALTH_PTS[0][0]) return 0.03 + (WEALTH_PTS[0][1] - 0.03) * w / WEALTH_PTS[0][0];
  const lw = Math.log10(w);
  for (let i = 1; i < WEALTH_PTS.length; i++) {
    const [w1, f1] = WEALTH_PTS[i - 1], [w2, f2] = WEALTH_PTS[i];
    if (w <= w2) {
      // interpolate the share of people richer than you on a log-log scale
      const t = (lw - Math.log10(w1)) / (Math.log10(w2) - Math.log10(w1));
      return 1 - Math.pow(10, Math.log10(1 - f1) + t * (Math.log10(1 - f2) - Math.log10(1 - f1)));
    }
  }
  return WEALTH_PTS[WEALTH_PTS.length - 1][1];
}

const TIERS = [
  [-Infinity, "🫠", L("You Are the Liquidity", "你就是流動性"), L("Negative net worth. Somewhere, a market maker thanks you for your service.", "負資產。某處有個莊家感謝你的貢獻。")],
  [0, "📄", L("Paper Hands", "紙手"), L("You did finance. Finance did you back.", "你玩金融，金融也玩了你。")],
  [1e5, "👔", L("Middle Management of Capitalism", "資本主義的中層管理"), L("A solid, respectable outcome that you will never describe as solid or respectable.", "一個穩陣、體面的結局，但你永遠不會這樣形容它。")],
  [1e6, "🦺", L("Comfortably Insufferable", "舒適地令人難受"), L("Millionaire. You own a Patagonia vest for every season, and a fifth for transitions.", "百萬富翁。你每季都有一件 Patagonia 背心，換季還有第五件。")],
  [1e7, "🛥️", L("Master of the Universe (Regional)", "宇宙主宰（地區版）"), L("You have a boat, a guy who drives the boat, and opinions on interest rates nobody asked for.", "你有一艘船、一個幫你開船的人，以及沒人問過的息率見解。")],
  [1e8, "🏝️", L("Vest Royalty", "背心皇族"), L("Nine figures. Your name is on a hospital wing you've never visited.", "九位數身家。你的名字刻在一座你從未踏足的醫院翼樓上。")],
  [1e9, "🚀", L("Billionaire", "億萬富翁"), L("You now post about free speech at 3am and are in talks to buy a sports team.", "你現在凌晨三點發帖談言論自由，還在洽購一支球隊。")],
];

function endingInfo(e) {
  if (e.kind === "sec") return {
    emoji: "⚖️", title: L("SEC'd", "被證監會盯上"),
    blurb: L(`The SEC found your texts. You pay ${fmt(e.fine)} in fines and disgorgement and spend 18 months at a minimum-security prison with surprisingly good tennis courts.`,
      `證監會找到了你的短訊。你支付了 ${fmt(e.fine)} 的罰款及追繳非法所得，並在一間最低保安級別、網球場出奇地好的監獄度過 18 個月。`),
  };
  if (e.kind === "burnout") return {
    emoji: "🧘", title: L(`Burnt Out at ${s.age}`, `${s.age} 歲燃燒殆盡`),
    blurb: L("You quit, move to Bali, and now teach breathwork to other ex-bankers. Your net worth stopped mattering to you. We calculated it anyway.",
      "你辭職搬到峇里，現在教其他前銀行家呼吸練習。身家對你已不再重要，但我們還是幫你算了。"),
  };
  const [, emoji, title, blurb] = TIERS.filter(t => s.cash >= t[0]).pop();
  return { emoji, title, blurb };
}

function shareText(e) {
  const { title } = endingInfo(e);
  const pctStr = richPct();
  const t = typeOf();
  const fam = FAMILY[s.tier].name;
  return tr(L(
    `${playerName}, "${title.en}": born in ${s.c.flag} ${s.c.name.en} (${fam.en.toLowerCase()}), ${t ? `played as ${t.emoji} ${t.name.en}, ` : ""}finished at age ${s.age} with ${fmt(s.cash)}, richer than ${pctStr}% of adults on Earth. #1in8billion`,
    `${playerName}「${title.zh}」：生於 ${s.c.flag} ${s.c.name.zh}（${fam.zh}），${t ? `${t.emoji} ${t.name.zh}，` : ""}${s.age} 歲時身家 ${fmt(s.cash)}，比地球上 ${pctStr}% 的成年人更富有。#80億分之一`));
}

function richPct() {
  const frac = richerThan(s.cash);
  const decimals = frac < 0.99 ? 0 : Math.min(6, Math.ceil(-Math.log10(1 - frac)) - 1);
  return (frac * 100).toFixed(decimals);
}

// ---------- rendering ----------

// the screen currently shown, redrawn as-is when the language changes
let redraw = null;

const chipsHTML = chips => chips.map(c => `<span class="chip ${c.good === undefined ? "" : c.good ? "good" : "bad"}">${tr(c.text)}</span>`).join("");
const statChip = (key, d) => ({ text: cat(`${d > 0 ? "+" : ""}${d} `, UI[key]), good: d > 0 });
const langHTML = () => `<div class="lang" role="group" aria-label="Language">
  <button type="button" data-lang="en" aria-pressed="${lang === "en"}">EN</button>
  <button type="button" data-lang="zh" aria-pressed="${lang === "zh"}">繁中</button></div>`;

function statBar(key, v) {
  return `<div class="stat"><span>${tr(UI[key])}</span><div class="track"><div class="fill ${key} ${key === "sanity" && v < 25 ? "low" : ""}" style="width:${v}%"></div></div><b>${v}</b></div>`;
}

function educationLabel() {
  if (s.age < 3) return L("Not in school yet", "未入學");
  if (s.age < 7) return L("Kindergarten", "幼稚園");
  if (s.age < 12) return L("Primary school", "小學");
  if (s.age < 18) return L("Secondary school", "中學");
  const still = s.age < 22;
  if (s.school === "target") return still ? L("Elite university", "頂尖大學") : L("Elite university degree", "頂尖大學學位");
  if (s.school === "nontarget") return still ? L("University", "大學") : L("University degree", "大學學位");
  return L("High school, then the internet", "中學畢業，然後自學上網");
}

// the machine-readable lines at the bottom of a passport
function mrz() {
  const ascii = playerName.normalize("NFD").replace(/[^A-Za-z ]/g, "").trim().toUpperCase();
  const parts = ascii ? ascii.split(/\s+/) : ["FINANCE", "BRO"];
  const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  const given = parts.length > 1 ? parts.slice(0, -1).join("<") : "";
  const pad = str => (str + "<".repeat(32)).slice(0, 32);
  const yy = String(BIRTH_YEAR).slice(2);
  return [pad(`I<${s.c.iso}${surname}<<${given}`), pad(`${yy}0101${s.type ? s.type[0].toUpperCase() : "X"}${s.c.iso}<${s.tier}${s.c.g}${s.c.hub}`)];
}

function buildShell() {
  app.className = "game";
  app.innerHTML = `
    <header class="gbar" id="gbar"></header>
    <div class="cols">
      <div class="col">
        <section class="panel idcard" id="idcard"></section>
        <section class="panel" id="status"></section>
      </div>
      <div class="col">
        <section class="panel scene"><canvas id="scene" aria-hidden="true"></canvas><div class="caption" id="caption"></div></section>
        <section class="panel" id="focus"></section>
        <section class="panel" id="record"></section>
      </div>
      <div class="col">
        <section class="panel" id="family"></section>
        <section class="panel" id="peers"></section>
        <section class="panel" id="map"></section>
      </div>
    </div>
    <div id="modal"></div>`;
  redraw = renderAll;
}

function renderAll() {
  if (!$("#gbar")) return;
  const year = BIRTH_YEAR + s.age;
  const t = typeOf();

  $("#gbar").innerHTML = `
    <div class="brand">${tr(L(`<b>1</b> in 8 Billion<small>Finance Bro</small>`, `<b>80</b> 億分之一<small>金融佬</small>`))}</div>
    <div class="agebox">
      <span class="agelbl">${tr(L("Age", "歲數"))}</span><span class="agenum">${s.age}</span>
      <div class="agesub"><span>${year} · ${nm()} · ${tr(s.job)}</span><div class="track"><div class="fill" style="width:${s.age / END_AGE * 100}%"></div></div></div>
    </div>
    <div class="controls">
      <button data-act="pause" ${ui.over ? "disabled" : ""}>${ui.paused ? tr(L("▶ Play", "▶ 播放")) : tr(L("❚❚ Pause", "❚❚ 暫停"))}</button>
      ${SPEEDS.map(v => `<button data-act="speed" data-v="${v}" aria-pressed="${ui.speed === v}">${v}×</button>`).join("")}
      <button data-act="next" ${ui.over ? "disabled" : ""}>${tr(L("Next decision »", "下一個決定 »"))}</button>
      <button data-act="auto" aria-pressed="${ui.auto}">${tr(L("Auto mode", "自動模式"))}</button>
      <button data-act="theme" aria-label="${tr(L("Switch light or dark", "切換深淺色"))}">${isDark() ? "☾" : "☀︎"}</button>
      ${langHTML()}
      <button data-act="exit">${tr(L("Exit", "離開"))}</button>
    </div>`;

  const [m1, m2] = mrz();
  const dots = Array.from({ length: 6 }, (_, i) => i <= s.tier ? "●" : "○").join("");
  const kv = (k, v) => `<dt>${tr(k)}</dt><dd>${tr(v)}</dd>`;
  $("#idcard").innerHTML = `
    <div class="id-head"><span>${tr(L("Identity record", "身份紀錄"))} · ${s.c.iso}</span><span>${BIRTH_YEAR}</span></div>
    <div class="id-body">
      <canvas id="avatar" aria-hidden="true"></canvas>
      <div>
        <h2 class="id-name">${nm()}</h2>
        <dl class="kv">
          ${kv(L("Born", "出生"), L(`${s.c.flag} ${s.c.name.en} · ${BIRTH_YEAR}`, `${s.c.flag} ${s.c.name.zh} · ${BIRTH_YEAR}`))}
          ${kv(L("Lives in", "居住"), s.city || L(`${s.home.en}, ${s.c.name.en}`, `${s.c.name.zh}${s.home.zh}`))}
          ${kv(L("Family", "家境"), `<span class="dots" title="${tr(FAMILY[s.tier].name)}">${dots}</span>`)}
          ${kv(L("Education", "學歷"), educationLabel())}
          ${kv(L("Work", "職業"), s.job)}
          ${t ? kv(L("Type", "類型"), cat(`${t.emoji} `, t.name)) : ""}
        </dl>
      </div>
    </div>
    <div class="mrz">${esc(m1)}<br>${esc(m2)}</div>`;
  drawAvatar($("#avatar"));

  $("#status").innerHTML = `
    <div class="phead"><h3>${tr(L("Status", "狀態"))}</h3><small>0–100</small></div>
    ${statBar("network", s.network)}${statBar("hustle", s.hustle)}${statBar("sanity", s.sanity)}
    <details><summary>${tr(L("What do these mean?", "這些是甚麼意思？"))}</summary>
      <p>${tr(L("<b>Network</b> is who you know. It opens doors to schools, jobs and deals.", "<b>人脈</b>是你認識的人，為你打開升學、工作和交易的大門。"))}</p>
      <p>${tr(L("<b>Hustle</b> is your drive. It helps you pass exams and win the big bets.", "<b>拼勁</b>是你的衝勁，幫你考試合格、贏下大注。"))}</p>
      <p>${tr(L("<b>Sanity</b> is your mental health. Hit zero and you burn out.", "<b>理智</b>是你的精神健康。跌到零就會燃燒殆盡。"))}</p>
    </details>
    <div class="money">
      <div><span>${tr(L("Net worth", "身家"))}</span><b class="${s.cash < 0 ? "neg" : ""}">${fmt(s.cash)}</b></div>
      <div><span>${tr(L("Saved per year", "每年儲蓄"))}</span><b>${s.income ? fmt(s.income) : "—"}</b></div>
      ${s.ai.exposure > 0 ? `<div><span>${tr(L("AI exposure", "AI 持倉"))}</span><b>${pct(s.ai.exposure)}</b></div>` : ""}
    </div>`;

  drawScene($("#scene"));
  $("#caption").textContent = tr(sceneCaption());

  const stage = lifeStage();
  // only entries added since the last draw slide in
  const fresh = s.record.length - (ui.seen || 0);
  ui.seen = s.record.length;
  $("#focus").innerHTML = `
    <div class="phead"><h3>${tr(L("This year", "今年"))}</h3>${inBoom() ? `<small class="boom">${tr(UI.aiBoom)}</small>` : ""}</div>
    <div class="muted">${tr(stage.title)} · ${tr(s.city || s.home)} · ${tr(s.c.name)}</div>
    <p>${tr(stage.text)}</p>`;

  $("#record").innerHTML = `
    <div class="phead"><h3>${tr(L("Life record", "人生紀錄"))}</h3><small>${tr(L("Newest first", "最新在前"))}</small></div>
    <ol class="log">${s.record.slice().reverse().map((r, i) => `<li class="${r.tone || ""}${i < fresh ? " new" : ""}">
      <span class="rage">${tr(UI.age(r.age))}</span>
      <div>${r.title ? `<div class="rtitle">${tr(r.title)}${r.choice ? ` · ${tr(r.choice)}` : ""}</div>` : ""}
        ${tr(r.text) ? `<div class="rtext">${tr(r.text)}</div>` : ""}
        ${r.chips && r.chips.length ? `<div class="chips">${chipsHTML(r.chips)}</div>` : ""}</div>
    </li>`).join("")}</ol>`;

  const f = s.family;
  const row = (k, v, sub) => `<div class="frow"><span>${tr(k)}</span><span><b>${tr(v)}</b>${sub ? `<small>${tr(sub)}</small>` : ""}</span></div>`;
  const yrs = n => L(`${n} years`, `${n} 歲`);
  $("#family").innerHTML = `
    <div class="phead"><h3>${tr(L("Family and life", "家庭與生活"))}</h3></div>
    ${row(L("Mother", "母親"), yrs(f.mother.age + s.age), f.mother.job)}
    ${row(L("Father", "父親"), yrs(f.father.age + s.age), f.father.job)}
    ${row(L("Siblings", "兄弟姊妹"), String(f.siblings))}
    ${s.age >= 22 ? row(L("Partner", "伴侶"), s.flags.married ? L("Married", "已婚") : s.flags.partner ? L("Dating", "拍拖中") : L("Single", "單身")) : ""}
    ${s.age >= 22 ? row(L("Kids", "子女"), s.flags.kid ? "1" : "0") : ""}
    ${s.age >= 22 ? row(L("Home", "住所"), s.flags.house ? L("Owns", "自置") : L("Rents", "租住")) : ""}`;

  $("#peers").innerHTML = `
    <div class="phead"><h3>${tr(L("Born in the same second", "同一秒出生的人"))}</h3><small>${tr(L("At this same age", "在同一歲數"))}</small></div>
    ${s.peers.map(p => `<div class="peer ${p.diesAt !== null && s.age > p.diesAt ? "gone" : ""}">
      <div><b>${esc(p.name)}</b><small>${p.flag} ${tr(p.country)} · ${tr(p.female ? L("F", "女") : L("M", "男"))}</small></div>
      <span>${tr(peerStatus(p, s.age))}</span></div>`).join("")}`;

  $("#map").innerHTML = `
    <div class="phead"><h3>${tr(L("Life map", "人生地圖"))}</h3><small>${tr(L("1 square = 1 year", "1 格 = 1 年"))}</small></div>
    <div class="lifemap">${Array.from({ length: END_AGE }, (_, a) => `<i class="${yearTone(a)}" title="${tr(UI.age(a))}"></i>`).join("")}</div>
    <div class="legend">
      <span><i class="great"></i>${tr(L("Great", "大好"))}</span><span><i class="good"></i>${tr(L("Good", "不錯"))}</span>
      <span><i class="bad"></i>${tr(L("Bad", "差"))}</span><span><i class="swan"></i>${tr(UI.swan)}</span>
    </div>`;

  renderModal();
}

// colors each year on the life map by how your money did
function yearTone(a) {
  if (a > s.age) return "future";
  const now = a === s.age ? " now" : "";
  const y = s.years[a];
  if (!y) return "plain" + now;
  if (y.swan) return "swan" + now;
  if (y.crash) return "bad" + now;
  const end = a === s.age ? s.cash : (s.years[a + 1] ? s.years[a + 1].start : s.cash);
  if (y.start > 0) {
    const r = end / y.start;
    return (r > 1.25 ? "great" : r > 1.02 ? "good" : r < 0.85 ? "bad" : "plain") + now;
  }
  return (end > y.start ? "good" : end < y.start ? "bad" : "plain") + now;
}

function modalHead(label) {
  return `<div class="mhead"><span class="mlabel">${tr(label)}</span>
    <span class="mwhen">${tr(UI.age(s.age))} · ${BIRTH_YEAR + s.age}</span>
    ${ui.modal.kind === "decision" ? `<button class="aside-btn" data-act="aside">${tr(L("Set aside ▾", "暫時擱置 ▾"))}</button>` : ""}</div>`;
}

const dataHTML = id => DATA[id] ? `<div class="data"><b>${tr(L("Data", "數據"))}</b> ${tr(DATA[id])}</div>` : "";

function renderModal() {
  const root = $("#modal");
  const m = ui.modal;
  if (!m) { root.innerHTML = ""; return; }
  if (ui.aside) {
    root.innerHTML = `<button class="pill" data-act="unaside">${tr(L("⏸ A decision is waiting · Open", "⏸ 有一個決定等待你 · 打開"))}</button>`;
    return;
  }
  let body = "";
  if (m.kind === "birth") {
    const share = s.c.pop * 1e6 / WORLD_POP * 100;
    const shareStr = share.toFixed(share < 1 ? 2 : 1);
    const { hub } = s.c;
    let flavor;
    if (hub >= 3 && s.tier >= 4) flavor = L("God mode. You were born on third base, and you'll tell people you hit a triple.", "天胡開局。你一出生就站在三壘，卻會告訴別人你打出了三壘安打。");
    else if (hub >= 3) flavor = L("You're born in a global finance capital. Wall Street (or its local equivalent) is a short commute away.", "你生於國際金融中心。華爾街（或本地版本）就在通勤距離之內。");
    else if (s.tier >= 4) flavor = L("Your family has money. Money has a way of finding more money.", "你家有錢。錢自有辦法找到更多的錢。");
    else if (hub === 0 && s.tier <= 1) flavor = L("This is one of the most common ways to be born. Wall Street has never heard of your town. Yet.", "這是最常見的出生方式之一。華爾街從未聽過你的家鄉。暫時而已。");
    else flavor = L("Not the easiest start, not the hardest either. Time to grind.", "不是最容易的開局，也不是最難的。是時候拼搏了。");
    body = `${modalHead(L("A new life", "新生命"))}
      <div class="mbody">
        <div class="bigflag">${s.c.flag}</div>
        <h2>${tr(L(`Welcome to the world, ${nm()}`, `歡迎來到這個世界，${nm()}`))}</h2>
        <p>${tr(L(`You were born in ${s.home.en}, ${s.c.name.en}. ${shareStr}% of humans live in ${s.c.name.en}.`, `你在${s.c.name.zh}${s.home.zh}出生。全人類有 ${shareStr}% 住在${s.c.name.zh}。`))}</p>
        <dl class="facts">
          <div class="fact"><dt>${tr(L("Family", "家庭"))}</dt><dd>${tr(FAMILY[s.tier].name)}</dd></div>
          <div class="fact"><dt>${tr(L("Family money", "家庭資產"))}</dt><dd>${fmt(s.cash)}</dd></div>
          <div class="fact"><dt>${tr(L("Finance hub?", "金融中心？"))}</dt><dd>${tr(HUB_LABEL[hub])}</dd></div>
        </dl>
        <p class="flavor">${tr(flavor)}</p>
        <p class="hint">${tr(L("Your life now plays out a year at a time. It pauses whenever you need to decide something. Use the speed buttons to go faster.", "你的人生會一年一年地展開，遇到需要你決定的事就會暫停。可以用速度按鈕加快。"))}</p>
        <button class="primary" data-act="close">${tr(L("Start life →", "開始人生 →"))}</button>
      </div>`;
  } else if (m.kind === "type") {
    const t = typeOf();
    const gamble = t.swing > 1 ? L(`Amplified ×${t.swing}`, `放大 ×${t.swing}`) : t.swing < 1 ? L(`Softened ×${t.swing}`, `減弱 ×${t.swing}`) : L("Normal", "正常");
    const crash = t.crash > 1 ? L("Worse", "更嚴重") : t.crash < 1 ? L("Milder", "較輕") : L("Normal", "正常");
    body = `${modalHead(L("Who you are", "你是誰"))}
      <div class="mbody">
        <div class="bigflag">${t.emoji}</div>
        <h2>${tr(L(`${nm()}, you're the ${t.name.en} type: ${t.title.en}`, `${nm()}，你是${t.name.zh}：${t.title.zh}`))}</h2>
        <p>${tr(t.desc)}</p>
        <dl class="facts">
          <div class="fact"><dt>${tr(L("Gamble outcomes", "賭博結果"))}</dt><dd>${tr(gamble)}</dd></div>
          <div class="fact"><dt>${tr(L("Yearly returns", "每年回報"))}</dt><dd>~${Math.round(t.ret * 100)}% ± ${Math.round(t.vol * 100)}%</dd></div>
          <div class="fact"><dt>${tr(L("Crash damage", "股災損傷"))}</dt><dd>${tr(crash)}</dd></div>
        </dl>
        <p class="flavor">${tr(L("Decided by the choices you made as a kid. Some events only happen to your type.", "由你童年的選擇決定。有些事件只會發生在你這種類型身上。"))}</p>
        <button class="primary" data-act="close">${tr(L("Go into finance →", "投身金融界 →"))}</button>
      </div>`;
  } else if (m.kind === "decision") {
    const st = m.st;
    body = `${modalHead(st.swan ? UI.swan : L("A big decision", "重大決定"))}
      <div class="mbody">
        <h2>${tr(st.title)}</h2>
        <p>${tr(st.text)}</p>
        ${dataHTML(st.id)}
        <div class="options">${st.choices.map((c, i) => `<button class="option" data-act="choose" data-i="${i}" ${c.locked ? "disabled" : ""}>
          <span class="onum">${i + 1}</span><span><span class="cl">${tr(c.label)}</span><span class="cs">${c.locked ? "🔒 " + tr(c.locked) : tr(c.sub)}</span></span>
        </button>`).join("")}</div>
        <button class="ghost" data-act="autoall">${tr(L("Leave decisions to auto from now on", "從現在起交由自動模式決定"))}</button>
      </div>`;
  } else if (m.kind === "result") {
    const { st, c, r } = m;
    body = `${modalHead(st.swan ? UI.swan : L("What happened", "結果"))}
      <div class="mbody">
        <h2>${tr(st.title)}</h2>
        ${c.label ? `<div class="picked">${tr(UI.chose)} <b>${tr(c.label)}</b></div>` : `<p>${tr(st.text)}</p>`}
        ${tr(r.text) ? `<p class="outcome">${tr(r.text)}</p>` : ""}
        ${r.chips.length ? `<div class="chips">${chipsHTML(r.chips)}</div>` : ""}
        ${c.label ? "" : dataHTML(st.id)}
        <button class="primary" data-act="close">${tr(s.sanity <= 0 ? UI.uhoh : UI.continue)}</button>
        ${r.bigWin ? `<button class="secondary" data-act="flex">${tr(L(`📸 Post a gain screenshot (+${gainPct(r.bigWin.pct)})`, `📸 發佈盈利截圖（+${gainPct(r.bigWin.pct)}）`))}</button>` : ""}
      </div>`;
  } else if (m.kind === "flex") {
    const img = drawGainCard(m.win.pct);
    body = `${modalHead(UI.flex)}
      <div class="mbody">
        <h2>${tr(L("You posted your gains", "你發佈了你的盈利"))}</h2>
        <img class="shot" src="${img}" alt="${tr(L(`Gain screenshot showing +${gainPct(m.win.pct)} today`, `顯示今日 +${gainPct(m.win.pct)} 的盈利截圖`))}">
        <p class="outcome">${tr(m.text)}</p>
        <div class="chips">${chipsHTML(m.chips)}</div>
        <button class="primary" data-act="close">${tr(s.sanity <= 0 ? UI.uhoh : UI.continue)}</button>
        <a class="secondary save" href="${img}" download="gain-screenshot.png">${tr(L("Save the screenshot", "儲存截圖"))}</a>
      </div>`;
  } else if (m.kind === "exit") {
    body = `${modalHead(L("Leave", "離開"))}
      <div class="mbody">
        <h2>${tr(L("Leave this life?", "要離開這段人生嗎？"))}</h2>
        <p>${tr(L("Your progress in this life will be lost.", "這段人生的進度將會消失。"))}</p>
        <button class="primary" data-act="quit">${tr(L("Yes, back to the start", "是，返回開始畫面"))}</button>
        <button class="secondary" data-act="stay">${tr(L("Keep living", "繼續生活"))}</button>
      </div>`;
  } else if (m.kind === "ending") {
    const { emoji, title, blurb } = endingInfo(m.e);
    const frac = richerThan(s.cash);
    const top = Math.round(1 / (1 - frac)).toLocaleString("en-US");
    const pctStr = richPct();
    const rankLine = frac >= 0.5
      ? L(`That puts you in roughly the <strong>top 1 in ${top}</strong>.`, `大約是<strong>每 ${top} 人之中最富有的一個</strong>。`)
      : L("Most adults on Earth have more than you. The finance bro dream doesn't always survive contact with reality.", "地球上大部分成年人都比你有錢。金融佬的夢想不一定敵得過現實。");
    const t = typeOf();
    body = `${modalHead(L("Game over", "遊戲結束"))}
      <div class="mbody">
        <div class="end-emoji">${emoji}</div>
        <h2 class="end-title">${tr(title)}</h2>
        <p>${tr(blurb)}</p>
        <div class="end-nw ${s.cash < 0 ? "neg" : ""}">${fmt(s.cash)}</div>
        <div class="muted small">${tr(L("Final net worth · last role: ", "最終身家 · 最後職位："))}${tr(s.job)}${t ? ` · ${t.emoji} ${tr(t.name)}` : ""}</div>
        <div class="rank">
          <div>${tr(L(`You're richer than <strong>${pctStr}%</strong> of adults on Earth.`, `你比地球上 <strong>${pctStr}%</strong> 的成年人更富有。`))}</div>
          <div class="muted small">${tr(rankLine)}</div>
        </div>
        <button class="primary" data-act="again">${tr(L(`Be born again as ${nm()} →`, `以 ${nm()} 的身份再投胎 →`))}</button>
        <button class="secondary" data-act="copy">${tr(L("Copy my result", "複製我的結果"))}</button>
        <button class="secondary" data-act="rename">${tr(L("Start over with a different name", "用另一個名字重新開始"))}</button>
        <p class="footnote">${tr(L("Your whole life is in the life record and life map behind this box. Birth odds are weighted by the population of 34 countries. Wealth percentiles are rough estimates based on published global wealth distributions. Not financial advice, obviously.",
          "你的整段人生都記錄在這個方框後面的人生紀錄和人生地圖裡。出生機率按 34 個國家的人口加權。財富百分位是根據已公佈的全球財富分佈所作的粗略估算。當然，這不構成任何投資建議。"))}</p>
      </div>`;
  }
  const enter = m !== ui.shown ? " enter" : "";
  ui.shown = m;
  root.innerHTML = `<div class="backdrop"><div class="modal${enter} ${m.kind}${m.st && m.st.swan ? " swan" : ""}" role="dialog" aria-modal="true">${body}</div></div>`;
}

// ---------- start screen ----------

let nameDraft = null;

function drawStart() {
  clearInterval(ui.timer);
  app.className = "start";
  app.innerHTML = `
    <div class="start-top">${langHTML()}</div>
    <section class="card">
      <div class="ticker" aria-hidden="true"><span>
        BRO <b class="up">▲ 4.2%</b> &nbsp;·&nbsp; VEST <b class="up">▲ 1.1%</b> &nbsp;·&nbsp; SLEEP <b class="down">▼ 38%</b> &nbsp;·&nbsp;
        EBITDA <b class="up">▲ 12%</b> &nbsp;·&nbsp; WLB <b class="down">▼ 99%</b> &nbsp;·&nbsp; COLDBREW <b class="up">▲ 7.7%</b> &nbsp;·&nbsp;
        HAMPTONS <b class="up">▲ 3.0%</b> &nbsp;·&nbsp; SANITY <b class="down">▼ 21%</b>
      </span></div>
      <div class="eyebrow">${tr(L("A game of birth, luck &amp; leverage", "一場關於出身、運氣與槓桿的遊戲"))}</div>
      <h1>${tr(L("1 in 8 Billion:<br><em>Finance Bro</em>", "80 億分之一：<br><em>金融佬</em>"))}</h1>
      <p>${tr(L("There are 8 billion people on Earth, and you don't get to pick which one you are.", "地球上有 80 億人，而你無法選擇自己成為哪一個。"))}</p>
      <p class="muted">${tr(L("You'll be born somewhere random, weighted by real populations, into a random family. Then you'll try to become a finance bro anyway. Every choice has real odds, and your starting point changes them.",
        "你會按真實人口比例，隨機出生在某個地方、某個家庭。然後你仍然要努力成為一個金融佬。每個選擇都有真實的機率，而你的起點會改變這些機率。"))}</p>
      <label class="name-field">
        <span>${tr(L("What's your name?", "你叫甚麼名字？"))}</span>
        <input id="name" maxlength="${NAME_MAX}" placeholder="${tr(L("e.g. Jordan", "例如：阿明"))}" autocomplete="off" value="${esc(nameDraft ?? playerName)}">
      </label>
      <button class="primary" id="go">${tr(L("Be born →", "投胎 →"))}</button>
    </section>`;
  redraw = drawStart;
  const input = $("#name");
  input.oninput = () => { nameDraft = input.value; };
  const start = () => {
    playerName = input.value.trim().slice(0, NAME_MAX) || tr(L("Anonymous Bro", "無名金融佬"));
    nameDraft = null;
    try { localStorage.setItem("playerName", playerName); } catch {}
    renderRoll();
  };
  $("#go").onclick = start;
  input.onkeydown = e => { if (e.key === "Enter") start(); };
}

function renderRoll() {
  clearInterval(ui.timer);
  app.className = "start";
  app.innerHTML = `<div class="start-top">${langHTML()}</div><section class="card"><div class="rolling" id="flag">🌍</div><div class="rolling-name" id="nm">${tr(L("Rolling the dice on your life…", "正在為你的人生擲骰……"))}</div></section>`;
  redraw = null;
  const flag = $("#flag"), label = $("#nm");
  let n = 0;
  const timer = setInterval(() => {
    const c = pick(COUNTRIES);
    flag.textContent = c[1];
    label.textContent = tr(c[0]);
    if (++n >= 18) { clearInterval(timer); startLife(); }
  }, 75);
}

// ---------- controls ----------

function isDark() {
  const set = document.documentElement.dataset.theme;
  return set ? set === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
}

function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem("theme", t); } catch {}
}
try { const saved = localStorage.getItem("theme"); if (saved) document.documentElement.dataset.theme = saved; } catch {}

function setLang(l) {
  lang = l;
  try { localStorage.setItem("lang", l); } catch {}
  document.documentElement.lang = l === "zh" ? "zh-Hant" : "en";
  document.title = tr(L("1 in 8 Billion: Finance Bro", "80 億分之一：金融佬"));
  if (redraw) redraw();
}

document.addEventListener("click", e => {
  const langBtn = e.target.closest("[data-lang]");
  if (langBtn) return setLang(langBtn.dataset.lang);
  const b = e.target.closest("[data-act]");
  if (!b || b.disabled) return;
  switch (b.dataset.act) {
    case "pause": ui.paused = !ui.paused; break;
    case "speed": ui.speed = +b.dataset.v; ui.paused = false; startTimer(); break;
    case "next": return nextDecision();
    case "auto":
      ui.auto = !ui.auto;
      if (!ui.auto || !ui.modal || ui.modal.kind !== "decision") break;
    // falls through: switching auto on also settles the decision on screen
    case "autoall":
      ui.auto = true;
      resolve(ui.modal.st, pick(ui.modal.st.choices.filter(c => !c.locked)));
      return closeModal();
    case "theme": setTheme(isDark() ? "light" : "dark"); break;
    case "exit":
      if (ui.modal && ui.modal.kind === "exit") return;
      ui.prev = ui.modal;
      ui.modal = { kind: "exit" };
      ui.aside = false;
      break;
    case "stay": ui.modal = ui.prev || null; break;
    case "quit": ui.over = true; return drawStart();
    case "choose": return choose(+b.dataset.i);
    case "close": return closeModal();
    case "aside": ui.aside = true; break;
    case "unaside": ui.aside = false; break;
    case "flex": return postGains();
    case "again": return startLife();
    case "rename": return drawStart();
    case "copy":
      navigator.clipboard.writeText(shareText(ui.modal.e))
        .then(() => { b.textContent = tr(L("Copied!", "已複製！")); })
        .catch(() => { b.textContent = tr(L("Couldn't copy, sorry", "複製失敗，抱歉")); });
      return;
  }
  renderAll();
});

document.addEventListener("keydown", e => {
  if (!s || !$("#gbar") || (e.target instanceof Element && e.target.closest("input, textarea"))) return;
  const m = ui.modal;
  if (m && !ui.aside && m.kind === "decision" && /^[1-9]$/.test(e.key)) return choose(+e.key - 1);
  if (m && !ui.aside && ["result", "birth", "type", "flex"].includes(m.kind) && e.key === "Enter") return closeModal();
  if (!m && e.key === " ") { e.preventDefault(); ui.paused = !ui.paused; renderAll(); }
});

setLang(lang);
drawStart();

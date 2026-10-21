const WORLD_POP = 8.1e9;

// [name, flag, population (millions), wealth tier 0-4, finance-hub tier 0-3, ISO code]
const COUNTRIES = [
  [L("India", "印度"), "🇮🇳", 1440, 1, 1, "IND"], [L("China", "中國"), "🇨🇳", 1410, 2, 2, "CHN"], [L("the United States", "美國"), "🇺🇸", 340, 4, 3, "USA"],
  [L("Indonesia", "印尼"), "🇮🇩", 280, 1, 0, "IDN"], [L("Pakistan", "巴基斯坦"), "🇵🇰", 245, 0, 0, "PAK"], [L("Nigeria", "尼日利亞"), "🇳🇬", 230, 0, 1, "NGA"],
  [L("Brazil", "巴西"), "🇧🇷", 212, 2, 1, "BRA"], [L("Bangladesh", "孟加拉"), "🇧🇩", 173, 0, 0, "BGD"], [L("Russia", "俄羅斯"), "🇷🇺", 144, 2, 1, "RUS"],
  [L("Ethiopia", "埃塞俄比亞"), "🇪🇹", 130, 0, 0, "ETH"], [L("Mexico", "墨西哥"), "🇲🇽", 130, 2, 1, "MEX"], [L("Japan", "日本"), "🇯🇵", 124, 3, 2, "JPN"],
  [L("the Philippines", "菲律賓"), "🇵🇭", 117, 1, 0, "PHL"], [L("Egypt", "埃及"), "🇪🇬", 116, 1, 0, "EGY"], [L("DR Congo", "剛果民主共和國"), "🇨🇩", 109, 0, 0, "COD"],
  [L("Vietnam", "越南"), "🇻🇳", 100, 1, 0, "VNM"], [L("Iran", "伊朗"), "🇮🇷", 91, 1, 0, "IRN"], [L("Turkey", "土耳其"), "🇹🇷", 87, 2, 1, "TUR"],
  [L("Germany", "德國"), "🇩🇪", 84, 4, 2, "DEU"], [L("Thailand", "泰國"), "🇹🇭", 72, 2, 0, "THA"], [L("the United Kingdom", "英國"), "🇬🇧", 69, 4, 3, "GBR"],
  [L("France", "法國"), "🇫🇷", 68, 4, 2, "FRA"], [L("South Africa", "南非"), "🇿🇦", 63, 2, 1, "ZAF"], [L("Italy", "意大利"), "🇮🇹", 59, 3, 1, "ITA"],
  [L("Kenya", "肯尼亞"), "🇰🇪", 56, 0, 1, "KEN"], [L("South Korea", "南韓"), "🇰🇷", 52, 3, 2, "KOR"], [L("Argentina", "阿根廷"), "🇦🇷", 46, 2, 1, "ARG"],
  [L("Canada", "加拿大"), "🇨🇦", 39, 4, 2, "CAN"], [L("Saudi Arabia", "沙特阿拉伯"), "🇸🇦", 34, 3, 1, "SAU"], [L("Australia", "澳洲"), "🇦🇺", 27, 4, 2, "AUS"],
  [L("the UAE", "阿聯酋"), "🇦🇪", 10, 4, 2, "ARE"], [L("Switzerland", "瑞士"), "🇨🇭", 9, 4, 3, "CHE"], [L("Hong Kong", "香港"), "🇭🇰", 7.5, 4, 3, "HKG"],
  [L("Singapore", "新加坡"), "🇸🇬", 6, 4, 3, "SGP"],
];

const FAMILY = [
  { name: L("Struggling to get by", "勉強餬口"), cash: 0 },
  { name: L("Working class", "工人階級"), cash: 800 },
  { name: L("Middle class", "中產家庭"), cash: 4000 },
  { name: L("Comfortable", "小康之家"), cash: 25000 },
  { name: L("Rich", "富裕家庭"), cash: 250000 },
  { name: L("Old money (Dad is a Managing Director)", "世家大族（爸爸是董事總經理）"), cash: 3000000 },
];

// swing scales the money won or lost on any gamble; ret/vol are yearly portfolio returns; crash scales the age-40 crash
const TYPES = {
  aggressive: {
    name: L("Aggressive", "進取型"), title: L("The Shark", "鯊魚"), emoji: "🦈", swing: 1.6, ret: 0.08, vol: 0.2, crash: 1.5,
    desc: L("You go big. Every gamble pays more when it hits and hurts more when it misses, and your portfolio swings hard every year.",
      "你出手就要大。每次賭博贏的時候賺更多，輸的時候也痛更多，你的投資組合每年都大上大落。"),
  },
  balanced: {
    name: L("Balanced", "平衡型"), title: L("The Strategist", "策略家"), emoji: "♟️", swing: 1, ret: 0.05, vol: 0.08, crash: 1,
    desc: L("You take calculated risks. Gambles play out at normal size, and your money grows at a steady market pace.",
      "你只冒計算過的風險。賭博的輸贏維持正常大小，你的錢按市場步伐穩定增長。"),
  },
  passive: {
    name: L("Passive", "保守型"), title: L("The Turtle", "烏龜"), emoji: "🐢", swing: 0.5, ret: 0.035, vol: 0.02, crash: 0.5,
    desc: L("Slow and steady. Gambles win less and lose less, and your money grows slowly but almost never shrinks.",
      "慢慢來，比較快。賭博贏得少也輸得少，你的錢增長得慢，但幾乎從不縮水。"),
  },
};
const typeOf = () => TYPES[s.type];

// placeholder brokerage shown on the gain screenshot
const BROKER_NAME = "BullBroker";
const BIG_WIN = { pct: 0.1, min: 5000 };

const HUB_LABEL = [
  L("Not even close", "完全不是"), L("Sort of", "勉強算是"),
  L("Yes, a regional one", "是，區域金融中心"), L("Yes, a global finance capital", "是，國際金融中心"),
];
// local salaries scale with the country's wealth tier; elite jobs assume you moved to a hub
const PAY_MULT = [0.12, 0.3, 0.55, 0.8, 1];

// [net worth, share of adults poorer than that], rough global wealth distribution
const WEALTH_PTS = [[100, 0.12], [1e3, 0.24], [1e4, 0.42], [1e5, 0.82], [1e6, 0.988], [1e7, 0.9992], [1e8, 0.99998], [1e9, 0.9999995], [1e11, 0.99999999]];

const JOBS = {
  kid: L("Kid", "小孩"),
  highSchool: L("High schooler", "中學生"),
  student: L("Student", "大學生"),
  bedroom: L("Bedroom trader", "睡房交易員"),
  ib: L("IB Analyst", "投行分析師"),
  trader: L("Trader", "交易員"),
  auditor: L("Auditor", "核數師"),
  banker: L("Personal Banker", "銀行客戶經理"),
  crypto: L("Crypto Startup", "加密貨幣初創"),
  finfluencer: L("Finfluencer", "財經網紅"),
  pe: L("PE Associate", "私募股權經理"),
  ibAssoc: L("IB Associate", "投行經理"),
  mbaVp: L("Post-MBA VP", "MBA 畢業副總裁"),
  angel: L("Angel Investor", "天使投資人"),
  bankPm: L("PM at a Bank", "銀行產品經理"),
  pm: L("Portfolio Manager", "投資組合經理"),
  mbaAssoc: L("Post-MBA Associate", "MBA 畢業投行經理"),
  cryptoGp: L("Crypto Fund GP", "加密基金合夥人"),
  compliance: L("Compliance Analyst", "合規分析師"),
  hf: L("Hedge Fund Founder", "對沖基金創辦人"),
  consultant: L(`"Consultant"`, "「顧問」"),
  aiExec: L("AI Startup Exec", "AI 初創高層"),
};

const CITIES = [L("New York", "紐約"), L("London", "倫敦"), L("Hong Kong", "香港"), L("Singapore", "新加坡")];

const $ = sel => document.querySelector(sel);
const app = $("#app");
let s = null;
const START_AGE = 2;
const TYPE_AGE = 15;
const END_AGE = 45;

const rnd = (a, b) => a + Math.random() * (b - a);
const rint = (a, b) => Math.floor(rnd(a, b + 1));
// set whenever a scene rolls the dice, so personality can scale the outcome
let rolled = false;
const chance = p => { rolled = true; return Math.random() < p; };
const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = v => Math.max(0, Math.min(100, Math.round(v)));
const esc = str => String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// the player's name, remembered between visits when the browser allows it
const NAME_MAX = 20;
let playerName = "";
try { playerName = localStorage.getItem("playerName") || ""; } catch {}
const nm = () => esc(playerName);
// your boss never quite remembers it
const wrongName = () => pick(["Kyle", "Chad", "Brad", "Tanner", "Greg"].filter(n => n !== playerName));

const pct = p => Math.round(Math.max(0, p) * 100) + "%";
const mult = () => PAY_MULT[s.c.g];
// how far a crypto or influencer hustle reaches from where you live: less local money and audience in poorer countries
const reach = () => Math.max(0.3, mult());
const inBoom = () => s.age > s.ai.start && s.age < s.ai.end;

function weightedIdx(ws) {
  let r = Math.random() * ws.reduce((a, b) => a + b, 0);
  for (let i = 0; i < ws.length; i++) { r -= ws[i]; if (r < 0) return i; }
  return ws.length - 1;
}

function fmt(n) {
  const sign = n < 0 ? "-" : "";
  n = Math.abs(n);
  let str;
  if (n >= 1e9) str = (n / 1e9).toFixed(n >= 1e10 ? 0 : 1) + "B";
  else if (n >= 1e6) str = (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + "M";
  else if (n >= 1e3) str = Math.round(n / 1e3) + "k";
  else str = Math.round(n) + "";
  return sign + "$" + str;
}

function fix() {
  s.network = clamp(s.network);
  s.hustle = clamp(s.hustle);
  s.sanity = clamp(s.sanity);
  s.cash = Math.round(s.cash);
  s.income = Math.round(s.income);
}

function setJob(job, track, income) {
  s.job = job;
  s.track = track;
  s.income = income;
}

function moveToHub() {
  if (s.c.hub >= 3 || s.city) return L("", "");
  s.city = pick(CITIES);
  return L(`You pack two suitcases and move to ${s.city.en}. `, `你收拾兩個行李箱，搬到${s.city.zh}。`);
}

// ---------- markets: what your money is in, interest rates, taxes, your home, your pension and your credit ----------

const ASSETS = ["cash", "bonds", "stocks", "spec"];
const ASSET_NAMES = {
  cash: L("Cash", "現金"), bonds: L("Bonds", "債券"), stocks: L("Index funds", "指數基金"), spec: L("Speculative bets", "投機炒賣"),
  pension: L("Pension", "退休金"), home: L("Home equity", "物業淨值"),
};
const ASSET_COLORS = { cash: "#9a9ba6", bonds: "#1f7a8c", stocks: "#0b7a4b", spec: "#d08a12", pension: "#6b5bd2", home: "#b5543c" };
// your temperament picks your starting mix; you can change it any time on the portfolio screen
const DEFAULT_ALLOC = {
  aggressive: { cash: 0.05, bonds: 0.05, stocks: 0.55, spec: 0.35 },
  balanced: { cash: 0.1, bonds: 0.35, stocks: 0.5, spec: 0.05 },
  passive: { cash: 0.3, bonds: 0.5, stocks: 0.2, spec: 0 },
};
const allocOf = () => s.alloc || DEFAULT_ALLOC[s.type] || DEFAULT_ALLOC.balanced;
// rough long-run averages, used for the "expected return" line on the portfolio screen
const EXPECTED = { cash: () => Math.max(0, (s.rate ?? 0.03) - 0.005) - localLoss(), bonds: () => (s.rate ?? 0.03) + 0.01 - localLoss(), stocks: () => 0.05, spec: () => 0.07 };
const RISK = { cash: 0, bonds: 0.05, stocks: 0.35, spec: 0.7 };
const expectedReturn = a => ASSETS.reduce((t, k) => t + a[k] * EXPECTED[k](), 0);
const badYear = a => ASSETS.reduce((t, k) => t + a[k] * RISK[k], 0);

// ---------- interest rates ----------

// the central bank chases inflation: rates rise when prices run hot and fall when they cool
function rateYear(year) {
  if (year < 18) return;
  if (s.rate == null) { s.rate = inflationBase() + 0.01; return; }
  const before = s.rate;
  s.rate = clampRate(s.rate + 0.5 * (s.inflation + 0.01 - s.rate) + 0.004 * gauss());
  const d = s.rate - before;
  if (Math.abs(d) >= 0.015) s.notes.push({ bad: d > 0, term: "rates", text: d > 0
    ? L(`🏦 Rate hike at ${year}: the central bank raises interest rates to ${pct1(s.rate)}. Debt and new mortgages get more expensive, and bond prices fall.`, `🏦 ${year} 歲加息：中央銀行把利率加到 ${pct1(s.rate)}。借貸和新按揭都變貴了，債券價格下跌。`)
    : L(`🏦 Rate cut at ${year}: the central bank cuts interest rates to ${pct1(s.rate)}. Borrowing is cheap again, and everyone suddenly wants to buy things.`, `🏦 ${year} 歲減息：中央銀行把利率減到 ${pct1(s.rate)}。借錢又變便宜了，人人突然都想買東西。`) });
  s.lastRateMove = d;
}
const clampRate = r => Math.max(0, Math.min(0.4, r));
const pct1 = p => `${(p * 100).toFixed(1)}%`;

// ---------- one year in the markets ----------

function marketYear(year) {
  const roll = Math.random();
  const crash = year >= 18 && roll < 0.04;
  const meltup = year >= 18 && !crash && roll < 0.07;
  const rate = s.rate ?? 0.03;
  // everything is counted in dollars: stocks are global, property rises with local prices
  const infl = s.inflation || 0.02;
  const m = {
    crash, meltup,
    stocks: crash ? -rnd(0.25, 0.45) : meltup ? rnd(0.25, 0.4) : 0.05 + 0.16 * gauss(),
    spec: Math.max(-0.85, crash ? -rnd(0.5, 0.75) : meltup ? rnd(0.6, 1.2) : 0.07 + 0.45 * gauss()),
    // bond prices fall when rates rise, and investors run to them in a crash
    bonds: rate + 0.01 - 5 * (s.lastRateMove || 0) + 0.03 * gauss() + (crash ? 0.04 : 0),
    cash: Math.max(0, rate - 0.005),
    home: crash ? -rnd(0.1, 0.25) : infl + 0.01 + 0.06 * gauss(),
  };
  s.market = m;
  return m;
}

// local cash and bonds pay local interest, but a weak currency loses value against the dollar;
// global stocks and bets are already in dollars
const localLoss = () => currencyDrag() + (s.city || s.flags.dollarized ? 0 : Math.max(0, (s.inflation || 0.02) - 0.025));
const portfolioReturn = m => Math.max(-0.85, ASSETS.reduce((t, k) => t + allocOf()[k] * m[k], 0) - (allocOf().cash + allocOf().bonds) * localLoss());

// ---------- taxes ----------

const CITY_TAX = { "New York": 0.26, London: 0.27, "Hong Kong": 0.15, Singapore: 0.15, Dubai: 0, Monaco: 0 };
const COUNTRY_TAX = [0.06, 0.1, 0.14, 0.18, 0.2];
const NO_CGT = new Set(["Hong Kong", "Singapore", "Dubai", "Monaco"]);
const cityName = () => s.city ? s.city.en : null;
const incomeTaxRate = () => cityName() in CITY_TAX ? CITY_TAX[cityName()] : COUNTRY_TAX[s.c.g];
const capGainsRate = () => s.flags.cayman || NO_CGT.has(cityName()) ? 0 : s.c.g >= 2 ? 0.15 : 0.1;

// ---------- your home ----------

const HOME_PRICE = 220000;
const homePrice = () => Math.round(HOME_PRICE * costScale() * (s.prices || 1));
const homeEquity = () => s.property ? Math.round(s.property.value - s.property.loan) : 0;
const creditAdj = () => Math.max(0, Math.min(0.1, (700 - (s.credit ?? 650)) / 2000));
const mortgageRate = () => (s.rate ?? 0.03) + 0.015 + creditAdj();
const annuity = (loan, r, n) => r ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n;
const MORTGAGE_YEARS = 25;

function homeBlocker() {
  if (s.property) return L("You already own a home", "你已經有物業");
  if (s.age < 22) return L("Too young for a mortgage", "太年輕，未能申請按揭");
  if ((s.credit ?? 0) < 620) return L(`Your credit score (${s.credit ?? "none"}) is too low for a mortgage`, `你的信貸評分（${s.credit ?? "無"}）太低，批不到按揭`);
  const need = Math.round(homePrice() * 0.23);
  if (s.cash < need) return L(`You need ${fmt(need)} for the deposit and fees`, `你需要 ${fmt(need)} 支付首期及雜費`);
  return null;
}

function buyHome() {
  const price = homePrice();
  const loan = Math.round(price * 0.8);
  const rate = mortgageRate();
  s.cash -= Math.round(price * 0.23);
  s.property = { value: price, loan, rate, payment: Math.round(annuity(loan, rate, MORTGAGE_YEARS)), boughtAt: s.age };
  return price;
}

function sellHome() {
  const got = Math.round(s.property.value * 0.95 - s.property.loan);
  s.cash += got;
  s.property = null;
  return got;
}

// the house goes up or down with the market, and the bank takes its payment
function homeYear(year, m) {
  const h = s.property;
  if (!h) return;
  const wasAbove = h.value >= h.loan;
  h.value *= 1 + m.home;
  if (h.loan > 0) {
    const interest = h.loan * h.rate;
    const pay = Math.min(h.payment, h.loan + interest);
    h.loan = Math.max(0, h.loan - (pay - interest));
    s.cash -= pay;
    if (h.loan === 0) s.notes.push({ bad: false, term: "mortgage", text: L(`🔑 At ${year}, you make the last mortgage payment. The house is finally, completely yours.`, `🔑 ${year} 歲，你供完最後一期按揭。房子終於完完全全屬於你。`) });
  }
  // upkeep, property tax and the roof that always needs fixing
  s.cash -= h.value * 0.01;
  if (wasAbove && h.value < h.loan) s.notes.push({ bad: true, term: "negequity", text: L(`🏚️ At ${year}, house prices fall so far that you owe the bank more than your home is worth.`, `🏚️ ${year} 歲，樓價跌到你欠銀行的錢比房子本身還多。`) });
}

// ---------- pension ----------

const PENSION_AGE = 60;
const PENSION_RATES = [0, 0.05, 0.1, 0.15];
const pensionRate = () => s.age >= PENSION_AGE || s.income <= 0 ? 0 : s.pensionRate ?? 0.05;

function pensionYear(year, m) {
  if (!s.pension) return;
  s.pension *= 1 + 0.6 * m.stocks + 0.4 * m.bonds;
  if (year === PENSION_AGE) {
    const p = Math.round(s.pension);
    s.cash += p;
    s.pension = 0;
    s.notes.push({ bad: false, term: "pension", text: L(`🏦 Your pension unlocks at ${year}: ${fmt(p)} lands in your account, tax-free. Past you was smarter than you remember.`, `🏦 ${year} 歲，你的退休金解鎖：${fmt(p)} 免稅存入你的戶口。以前的你比你記得的聰明。`) });
  }
}

function cashOutPension() {
  const got = Math.round(s.pension * 0.7);
  s.cash += got;
  s.pension = 0;
  return got;
}

// ---------- credit score ----------

function creditYear(year) {
  if (year < 18) return;
  if (s.credit == null) { s.credit = 650; return; }
  s.credit += s.cash < 0 ? -25 : s.income > 0 ? 10 : 2;
  s.credit = Math.max(300, Math.min(850, s.credit));
}
const creditLabel = c => c >= 750 ? L("Excellent", "極好") : c >= 680 ? L("Good", "良好") : c >= 620 ? L("Fair", "一般") : c >= 500 ? L("Poor", "差") : L("Very poor", "極差");

// ---------- your whole balance sheet ----------

const netWorth = () => Math.round(s.cash + (s.pension || 0) + homeEquity() - (s.friendDebt || 0));

// at the end of a life the house is sold and the pension is counted; the SEC can't touch a pension
function closeBooks(kind) {
  if (s.property) { s.cash += homeEquity(); s.property = null; }
  const fine = kind === "sec" ? secPenalty() : 0;
  s.cash += Math.round(s.pension || 0) - Math.round(s.friendDebt || 0);
  s.pension = 0;
  s.friendDebt = 0;
  return fine;
}

// the boring twin: every paycheck you saved goes straight into an index fund, and nothing else ever happens
function shadowYear(year, m, flow) {
  if (year < 18) return;
  if (s.shadow == null) s.shadow = Math.max(0, s.cash);
  s.shadow = Math.max(0, s.shadow * (1 + m.stocks) + flow);
}

// ---------- the money year, run once per year of life from 18 ----------

function moneyYear(year, m) {
  const t = typeOf();
  let crashed = false;
  if (s.cash > 0) {
    const before = s.cash;
    if (m.crash) {
      crashed = true;
      if (!marginCall(year)) {
        s.cash *= 1 + portfolioReturn(m);
        s.notes.push({ bad: true, text: L(`📉 Crash year at ${year}: out of nowhere, markets collapsed. Your portfolio fell ${pct(1 - s.cash / before)}.`, `📉 ${year} 歲崩盤年：毫無預兆地，市場崩潰了。你的投資組合下跌 ${pct(1 - s.cash / before)}。`) });
      }
    } else {
      s.cash *= 1 + portfolioReturn(m);
      if (m.meltup) s.notes.push({ bad: false, text: L(`📈 ${jg("Melt-up", "meltup")} year at ${year}: markets went vertical. Your portfolio rose ${pct(s.cash / before - 1)}.`, `📈 ${year} 歲${jg("狂飆年", "meltup")}：市場直線飆升。你的投資組合上升 ${pct(s.cash / before - 1)}。`) });
    }
    s.market.portfolio = s.cash / before - 1;
    if (s.ai.exposure > 0 && s.age >= s.ai.start && s.age < s.ai.end) {
      const gain = s.ai.exposure * rnd(0.1, 0.4) * t.swing;
      s.cash *= 1 + gain;
      s.notes.push({ bad: false, text: L(`🤖 AI boom: your AI stocks pushed your portfolio up another ${pct(gain)} this year.`, `🤖 AI 熱潮：你的 AI 股令投資組合今年再升 ${pct(gain)}。`) });
    }
    for (const era of s.eras) {
      if (era.exposure <= 0 || s.age < era.start || s.age >= era.end) continue;
      const def = eraDef(era.id);
      const g = Math.max(-0.6, era.exposure * rnd(def.gain[0], def.gain[1]) * t.swing);
      s.cash *= 1 + g;
      s.notes.push({
        bad: g < 0,
        text: cat(`${def.emoji} `, def.name(), g >= 0
          ? L(`: your ${def.asset.en} pushed your portfolio up ${pct(g)} this year.`, `：你的${def.asset.zh}令投資組合今年上升 ${pct(g)}。`)
          : L(`: your ${def.asset.en} dragged your portfolio down ${pct(-g)} this year.`, `：你的${def.asset.zh}令投資組合今年下跌 ${pct(-g)}。`)),
      });
    }
    // tax on this year's gains
    const gain = s.cash - before;
    s.taxPaid = gain > 0 ? gain * capGainsRate() : 0;
    s.cash -= s.taxPaid;
  } else {
    s.market.portfolio = 0;
    s.taxPaid = 0;
    s.cash *= 1 + debtRate();
  }
  return crashed;
}

// pay comes in, tax and the pension come off the top, and life costs what it costs
function payYear(year, m) {
  const contrib = s.income * pensionRate();
  const tax = (s.income - contrib) * incomeTaxRate();
  const flow = s.income - contrib - tax - yearlySpend();
  s.pension = (s.pension || 0) + contrib;
  s.taxPaid += tax;
  s.cash += flow;
  shadowYear(year, m, flow + contrib);
}

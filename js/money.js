// ---------- money going out: living costs, debt, layoffs, margin calls and the SEC ----------

// what a life costs where you live; finance hubs are expensive wherever you came from
const costScale = () => s.city ? 1 : Math.max(0.15, mult());
// the share of every raise you end up spending, and the share of your wealth that goes on lifestyle each year
const CREEP = { aggressive: 0.5, balanced: 0.4, passive: 0.3 };
const WEALTH_BURN = { aggressive: 0.05, balanced: 0.045, passive: 0.035 };
const WEALTH_BURN_FROM = 3e5;
const RICH_PAY = 60000;
const BONUS_CREEP = 0.5;
// debt before 26 is mostly student loans, which are cheap; after that it costs the central bank rate plus a margin, more with bad credit
const debtRate = () => s.age < 26 ? 0.03 : (s.rate ?? 0.03) + 0.02 + creditAdj();

// yearly spending for an adult; students and kids are covered by family, loans and instant noodles
function yearlySpend() {
  if (s.age < 22) return 0;
  const base = 6500 * costScale() * s.prices;
  // with no pay, or in debt, you cut back to the basics, but the house, the kids and the boat still cost what they cost;
  // with no pay and no savings, family and the state keep you fed
  if (s.income <= 0) return Math.round((s.cash > 0 ? base * 0.6 : 0) + s.upkeep);
  if (s.cash < 0) return Math.round(Math.min(base, s.income * 0.6) + s.upkeep);
  const creep = CREEP[s.type] ?? 0.5;
  let spend = base + creep * Math.max(0, s.income - base);
  // big earners spend like big earners: the bonus goes on the second home, the club fees and the "investment" watches
  spend += BONUS_CREEP * Math.max(0, s.income - RICH_PAY * costScale());
  if (s.cash > WEALTH_BURN_FROM) spend += (WEALTH_BURN[s.type] ?? 0.025) * (s.cash - WEALTH_BURN_FROM);
  if (s.flags.married) spend += 4000 * costScale() * s.prices;
  // owners pay a mortgage instead of rent
  if (s.property) spend -= base * 0.4;
  return Math.round(Math.max(0, spend + s.upkeep));
}

// prices rise every year from 18; poorer and high-inflation countries rise faster until you move or switch to dollars
const INFLATION = [0.05, 0.04, 0.03, 0.025, 0.02];
const inflationBase = () => s.city || s.flags.dollarized ? 0.025 : INFLATION[s.c.g] + (HIGH_INFLATION.has(s.c.iso) ? 0.05 : 0);
// employers raise pay for inflation, but never quite all of it
const PAY_CATCHUP = 0.85;

function inflationYear(year) {
  if (year < 18) return;
  let rate = Math.max(-0.01, inflationBase() + 0.008 * gauss());
  if (Math.random() < 0.04) {
    rate += rnd(0.05, 0.12);
    s.notes.push({ bad: true, term: "inflation", text: L(`🔥 Inflation spike at ${year}: prices jump ${(rate * 100).toFixed(1)}% this year. Rent, groceries and your morning coffee all cost more, and your pay doesn't keep up.`, `🔥 ${year} 歲通脹急升：今年物價上漲 ${(rate * 100).toFixed(1)}%。租金、餸菜和你早上的咖啡都貴了，人工卻追不上。`) });
  }
  s.inflation = rate;
  s.prices *= 1 + rate;
  s.upkeep *= 1 + rate;
  if (s.income > 0) s.income *= 1 + rate * PAY_CATCHUP;
}

// aggressive players run on margin, so some crashes take more than the whole portfolio
function marginCall(year) {
  if (s.type !== "aggressive" || s.cash <= 0 || Math.random() > 0.2) return false;
  const owed = Math.round(s.cash * rnd(0.05, 0.4));
  s.cash = -owed;
  s.notes.push({ bad: true, term: "margin", text: L(`💥 Margin call at ${year}: you were leveraged, the crash wiped out everything, and you still owe your broker ${fmt(owed)}.`, `💥 ${year} 歲追保證金：你用了槓桿，崩盤把一切蒸發，你還欠經紀 ${fmt(owed)}。`) });
  return true;
}

const canBeLaidOff = () => s.income > 0 && !s.layoff && s.age >= 23 && s.age < 62 && s.job !== JOBS.retired && s.job !== JOBS.familyOffice;

// called once a year: maybe you lose your job, and maybe you find another one
function careerYear(year, crashed) {
  if (s.flags.kidBorn && year - s.flags.kidBorn === 22 && s.flags.kidUpkeep) {
    s.upkeep = Math.max(0, s.upkeep - s.flags.kidUpkeep);
    s.flags.kidUpkeep = 0;
    s.notes.push({ bad: false, text: L(`🎓 At ${year}, your kid finishes school and gets a job. Your monthly costs drop overnight.`, `🎓 ${year} 歲，孩子畢業並找到工作。你每月的開支一夜之間減少。`) });
  }
  if (s.layoff) {
    if (!s.layoff.sabbatical) s.sanity -= 2;
    if (year < s.layoff.back) return;
    const { job, track, pay, rank, sabbatical } = s.layoff;
    s.layoff = null;
    // a sabbatical ends with your old job waiting for you
    if (sabbatical) {
      setJob(job, track, pay);
      s.rank = rank || 0;
      refreshJob();
      s.notes.push({ bad: false, text: L(`🌴 Back from your sabbatical at ${year}, rested and slightly tanned. Your inbox has 4,000 unread emails. You delete them all.`, `🌴 ${year} 歲放完長假回來，精神飽滿，曬黑了一點。郵箱有 4,000 封未讀電郵，你全部刪掉。`) });
      return;
    }
    if (year >= 58 && Math.random() < 0.5) {
      setJob(JOBS.retired, "retired", 0);
      s.notes.push({ bad: true, text: L(`🪑 At ${year}, nobody calls back. You were not ready to retire, but it seems you have.`, `🪑 ${year} 歲，沒有人回覆你。你還未準備好退休，但看來你已經退休了。`) });
    } else if (Math.random() < 0.65) {
      const back = Math.round(pay * rnd(0.6, 1));
      setJob(job, track, back);
      s.rank = rank || 0;
      refreshJob();
      s.notes.push({ bad: false, text: L(`💼 Back at work at ${year}, at ${fmt(back)} a year. You don't mention the gap on your LinkedIn.`, `💼 ${year} 歲重返職場，年薪 ${fmt(back)}。你沒有在 LinkedIn 上提那段空白。`) });
    } else {
      const back = Math.round(pay * rnd(0.2, 0.45));
      setJob(JOBS.consultant, "normie", back);
      s.notes.push({ bad: true, text: L(`🥀 Career setback at ${year}: the only work you can find pays ${fmt(back)} a year. Your business card now says "Consultant".`, `🥀 ${year} 歲事業倒退：你只找到年薪 ${fmt(back)} 的工作。你的卡片現在印著「顧問」。`) });
    }
    return;
  }
  if (!canBeLaidOff()) return;
  const odds = 0.005 + (s.track === "degen" ? 0.015 : 0) + (crashed ? 0.08 : 0) + (s.age >= 50 ? 0.006 : 0);
  if (Math.random() > odds) return;
  s.layoff = { job: s.baseJob || s.job, track: s.track, pay: s.income, rank: s.rank, back: year + rint(1, 2) };
  s.job = JOBS.between;
  s.income = 0;
  s.sanity -= 6;
  s.credit = Math.max(300, (s.credit ?? 650) - 20);
  s.notes.push({ bad: true, term: "layoff", text: crashed
    ? L(`📦 Laid off at ${year}: the crash took your job with it. Security walks you out with a cardboard box.`, `📦 ${year} 歲被裁：崩盤連你的工作一起帶走。保安陪你拿著紙箱離開。`)
    : L(`📦 Laid off at ${year}: a 15-minute call with HR and your laptop stops working mid-sentence.`, `📦 ${year} 歲被裁：跟 HR 開了 15 分鐘會，你的電腦在你說話途中被停用。`) });
}

// when the debt can never be paid back, the court wipes it, along with the house, the boat and your credit score
function bankruptcy(year) {
  if (s.age < 26 || s.cash >= -Math.max(20 * s.income, 150000 * costScale())) return;
  // the bank takes the house first
  if (s.property) {
    const got = Math.round(s.property.value * 0.85 - s.property.loan);
    s.cash += got;
    s.property = null;
    s.credit = Math.max(300, (s.credit ?? 650) - 100);
    s.notes.push({ bad: true, term: "foreclosure", text: L(`🏚️ Foreclosed at ${year}: you can't keep up with the debt, so the bank takes your home and sells it cheap.`, `🏚️ ${year} 歲被銀行收樓：你無力還債，銀行收回你的房子並平價出售。`) });
    if (s.cash >= -Math.max(20 * s.income, 150000 * costScale())) return;
  }
  if (s.flags.bankruptAt && year - s.flags.bankruptAt < 10) return;
  const owed = -s.cash;
  s.flags.bankruptAt = year;
  s.cash = 0;
  s.upkeep = 0;
  s.flags.kidUpkeep = 0;
  s.sanity -= 12;
  s.network -= 10;
  s.credit = 450;
  s.notes.push({ bad: true, term: "bankruptcy", text: L(`⚖️ Bankrupt at ${year}: a judge wipes out ${fmt(owed)} of debt, along with your house, your stuff and your credit score. You start again from zero.`, `⚖️ ${year} 歲破產：法官一筆勾銷你 ${fmt(owed)} 的債務，連同你的房子、你的東西和你的信貸評分。你由零開始。`) });
}

// the SEC takes everything you have, and your lawyers bill you for the privilege
function secPenalty() {
  const seized = Math.max(0, s.cash);
  const legal = Math.round(Math.max(seized * rnd(0.1, 0.3), 150000 * costScale()));
  s.cash = Math.min(s.cash, 0) - legal;
  return { seized, legal };
}

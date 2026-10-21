// ---------- career: titles, promotions, demotions, job changes and side hustles ----------

Object.assign(JOBS, {
  corporate: L("Corporate Finance Manager", "企業財務經理"),
  fintech: L("Fintech Startup", "金融科技初創"),
});

// the titles you climb through on each track; the first rung is just your job
const LADDER = {
  elite: [null, L("Senior", "高級"), L("Vice President", "副總裁"), L("Director", "董事"), L("Managing Director", "董事總經理")],
  normie: [null, L("Senior", "高級"), L("Manager", "經理"), L("Director", "總監"), L("Head of Department", "部門主管")],
  degen: [null, L("Lead", "主管"), L("Principal", "首席"), L("Partner", "合夥人"), L("Chief Everything Officer", "首席萬事官")],
};
// jobs you own or run yourself don't come with a boss to promote you
const NO_LADDER = new Set(["founder", "hf", "angel", "retired", "familyOffice", "consultantSelf", "finfluencer", "cryptoGp", "between", "teacher", "kid", "highSchool", "student", "bedroom"]);
const jobKey = job => Object.keys(JOBS).find(k => JOBS[k] === job);
const ladder = () => LADDER[s.track] || null;
const onLadder = () => !!ladder() && !!s.baseJob && !NO_LADDER.has(jobKey(s.baseJob)) && s.income > 0 && !s.layoff;
const topRank = () => (ladder() || [null]).length - 1;
const rankName = r => (ladder() || [])[r ?? s.rank];

function refreshJob() {
  const name = s.rank > 0 && ladder() ? rankName() : null;
  s.job = name ? cat(name, " · ", s.baseJob) : s.baseJob;
}

function promote(to = s.rank + 1, raise = rnd(1.15, 1.3)) {
  s.rank = Math.min(topRank(), to);
  s.promos.push(s.age);
  s.income *= raise;
  refreshJob();
}

function demote(cut = rnd(0.7, 0.85)) {
  if (s.rank > 0) s.rank--;
  s.income *= cut;
  refreshJob();
}

// promotions and demotions that happen without a scene, a few times a career
function rankYear(year) {
  if (!onLadder() || year < 24) return;
  const up = 0.02 + s.hustle / 2000 + s.network / 4000;
  const down = 0.01 + (s.sanity < 30 ? 0.04 : 0) + (s.hustle < 30 ? 0.03 : 0) + (year >= 55 ? 0.015 : 0);
  const r = Math.random();
  if (r < up && s.rank < topRank()) {
    const before = s.income;
    promote();
    s.promos[s.promos.length - 1] = year;
    s.notes.push({ bad: false, text: cat(L(`🎖️ Promoted at ${year}: you're now `, `🎖️ ${year} 歲升職：你現在是`), s.job, L(`. Pay goes from ${fmt(before)} to ${fmt(s.income)}.`, `。年薪由 ${fmt(before)} 升至 ${fmt(s.income)}。`)) });
  } else if (r > 1 - down) {
    const before = s.income;
    demote();
    s.notes.push({ bad: true, text: cat(L(`🔻 Demoted at ${year}: a reorg moves you down to `, `🔻 ${year} 歲被降職：重組後你被調低至`), s.job, L(`. Pay drops from ${fmt(before)} to ${fmt(s.income)}.`, `。年薪由 ${fmt(before)} 跌至 ${fmt(s.income)}。`)) });
  }
}

// ---------- side hustles ----------

const SIDES = {
  tutor: { emoji: "📚", name: L("Exam tutoring", "考試補習"), sub: L("Steady, small, tiring", "穩定、細水長流、很累"), pay: () => 5000 * costScale(), toll: 1, fail: 0.02, grow: 1.02 },
  newsletter: { emoji: "📰", name: L("A finance newsletter", "財經通訊"), sub: L("Slow start, could go big", "起步慢，可能爆紅"), pay: () => 1500 * reach(), toll: 1, fail: 0.08, grow: 1.35, cap: () => 120000 * reach() },
  freelance: { emoji: "📊", name: L("Freelance financial models", "兼職做財務模型"), sub: L("Good money, against your contract", "收入不錯，但違反合約"), pay: () => 18000 * costScale(), toll: 2, fail: 0.03, grow: 1.03, caught: 0.07 },
  rental: { emoji: "🏠", name: L("Rent out your spare room", "出租空房"), sub: L("Needs a home you own", "需要自置物業"), pay: () => 8000 * costScale(), toll: 0, fail: 0.03, grow: 1.03, when: () => !!s.property },
  shop: { emoji: "📦", name: L("An online store", "網店"), sub: L("Costs money to start, most fail", "要先投錢，大多失敗"), setup: () => 6000 * costScale(), pay: () => 3000 * reach(), toll: 2, fail: 0.3, grow: 1.6, cap: () => 150000 * reach() },
  bot: { emoji: "🤖", name: L("A crypto trading bot", "加密貨幣交易機械人"), sub: L("Someone on Discord sold you the code", "Discord 上有人賣代碼給你"), setup: () => 2000 * reach(), pay: () => rnd(-8000, 14000) * reach(), toll: 1, fail: 0.15, grow: 1, crowd: true },
};
const MAX_SIDES = 2;
const sideIds = () => (s.sides || []).map(x => x.id);

function startSide(id) {
  const d = SIDES[id];
  const setup = d.setup ? Math.round(d.setup()) : 0;
  s.cash -= setup;
  (s.sides ||= []).push({ id, pay: d.pay(), since: s.age });
  return setup;
}

// side hustles pay out (or don't) once a year
function sideYear(year) {
  if (!s.sides || !s.sides.length) return;
  for (const side of s.sides.slice()) {
    const d = SIDES[side.id];
    const earned = Math.round(side.id === "bot" ? d.pay() : side.pay * rnd(0.6, 1.4));
    s.cash += earned;
    side.last = earned;
    s.sanity -= d.toll;
    side.pay = Math.min(side.pay * d.grow, d.cap ? d.cap() : Infinity);
    const drop = () => s.sides.splice(s.sides.indexOf(side), 1);
    if (d.caught && onLadder() && Math.random() < d.caught) {
      drop();
      demote();
      s.notes.push({ bad: true, text: cat(L(`🕵️ At ${year}, your boss finds your freelance models on a client's desk. You're demoted to `, `🕵️ ${year} 歲，老闆在客戶桌上發現你兼職做的財務模型。你被降職至`), s.job, L(", and the side hustle is over.", "，副業也到此為止。")) });
    } else if (Math.random() < d.fail) {
      drop();
      if (d.crowd) leekMoment(d.name, Math.max(0, -earned));
      s.notes.push({ bad: true, text: cat(`${d.emoji} `, L(`At ${year}, a side hustle fizzles out and you shut it down: `, `${year} 歲，副業無疾而終，你把它結束了：`), d.name, L(".", "。")) });
    } else if (side.id === "newsletter" && side.pay >= 50000 * reach() && !side.viral) {
      side.viral = true;
      s.network += 6;
      s.notes.push({ bad: false, text: L(`📰 At ${year}, your newsletter goes viral. Strangers quote you on finance Twitter, mostly correctly.`, `📰 ${year} 歲，你的財經通訊爆紅。陌生人在財經 Twitter 上引用你的話，大部分還引用對了。`) });
    }
  }
}

// ---------- the career moves screen ----------

const CAREER_GAP = 2;
const careerReady = () => s && !ui.over && s.age >= 22 && s.age < END_AGE - 1 && (!s.flags.careerAt || s.age - s.flags.careerAt >= CAREER_GAP);
const payNow = () => s.income || (s.layoff ? s.layoff.pay * 0.8 : 25000 * costScale());
const perYear = x => L(`${fmt(x)} a year`, `年薪 ${fmt(x)}`);

// each offer: who it's for, and what taking it does
const OFFERS = [
  {
    id: "rival", when: () => onLadder(),
    make() {
      const pay = Math.round(payNow() * rnd(1.1, 1.3));
      return { label: L("Same job at a rival firm", "到對手公司做同樣的工作"), sub: perYear(pay), run() { s.income = pay; s.network -= 3; s.sanity -= 2; return L("New logo, same spreadsheets, a bigger number at the bottom of your payslip.", "新商標，一樣的試算表，糧單底部的數字更大了。"); } };
    },
  },
  {
    id: "stepup", when: () => onLadder() && s.rank < topRank() && (s.hustle >= 40 || s.network >= 40),
    make() {
      const title = rankName(s.rank + 1);
      return { label: cat(L("Become ", "到一間較小的公司做"), title, L(" at a smaller firm", "")), sub: L("Bigger title, smaller logo", "職銜更大，公司更細"), run() { promote(s.rank + 1, rnd(1.05, 1.15)); s.network -= 4; return cat(L("Your new business card says ", "你的新卡片印著"), title, L(". Nobody at the barbecue has heard of the firm.", "。燒烤聚會上沒有人聽過這間公司。")); } };
    },
  },
  {
    id: "buyside", when: () => s.track === "elite" && s.network >= 45 && !["pm", "hf", "pe"].includes(jobKey(s.baseJob)),
    make() {
      const pay = Math.round(Math.max(payNow() * 1.35, 200000 * costScale()));
      return { label: L("Move to the buy side as a portfolio manager", "轉到買方做投資組合經理"), sub: perYear(pay), run() { setJob(JOBS.pm, "elite", pay); s.sanity -= 6; s.network += 6; return L("You now get pitched instead of pitching. The coffee is better and the stress is worse.", "現在是別人向你推銷，而不是你向別人推銷。咖啡更好，壓力更大。"); } };
    },
  },
  {
    id: "fintech", when: () => s.age <= 50 && s.income > 0 && !s.flags.equity,
    make() {
      const pay = Math.round(payNow() * 0.75);
      return { label: L("Join a fintech startup for equity", "加入金融科技初創，換取股權"), sub: cat(perYear(pay), L(" + stock options", " + 認股權")), run() { setJob(JOBS.fintech, "degen", pay); s.flags.equity = { at: s.age + rint(4, 8), pay }; s.sanity += 3; return L("You trade your bonus for options and a hoodie. The founder calls the office a \"campus.\"", "你用花紅換來認股權和一件連帽衫。創辦人把辦公室叫作「園區」。"); } };
    },
  },
  {
    id: "corporate", when: () => s.track !== "normie" || s.sanity < 50,
    make() {
      const pay = Math.round(payNow() * 0.85);
      return { label: L("Corporate finance at a big company", "到大公司做企業財務"), sub: cat(perYear(pay), L(", home by six", "，六點放工")), run() { setJob(JOBS.corporate, "normie", pay); s.sanity += 10; s.hustle -= 4; return L("You leave at 6pm on your first day and keep checking if you're in trouble.", "第一天你六點就下班了，然後一直擔心自己是否惹上麻煩。"); } };
    },
  },
  {
    id: "bank", when: () => s.track === "degen" || (s.layoff && !s.layoff.sabbatical),
    make() {
      const pay = Math.round(Math.max(25000 * mult(), payNow() * 0.7));
      return { label: L("Get a stable job at a bank", "到銀行找份穩定工作"), sub: perYear(pay), run() { setJob(JOBS.banker, "normie", pay); s.sanity += 6; return L("You have a pension, a lanyard and a manager called Gary. Your mother is relieved.", "你有退休金、一條職員證掛繩和一個叫 Gary 的經理。媽媽終於放心了。"); } };
    },
  },
  {
    id: "junior", when: () => !!s.layoff && !s.layoff.sabbatical,
    make() {
      const pay = Math.round(s.layoff.pay * 0.6);
      return { label: L("Take a junior role just to get back in", "接受初級職位，先重返行業"), sub: perYear(pay), run() { setJob(s.layoff.job, s.layoff.track, pay); return L("Your new boss is ten years younger than you. You say \"great question\" a lot.", "你的新上司比你年輕十歲。你經常說「好問題」。"); } };
    },
  },
  {
    id: "teach", when: () => s.age >= 38 && jobKey(s.baseJob) !== "teacher",
    make() {
      const pay = Math.round(40000 * Math.max(0.3, mult()));
      return { label: L("Teach finance at a university", "到大學教金融"), sub: perYear(pay), run() { setJob(JOBS.teacher, "normie", pay); s.sanity += 15; s.network += 3; return L("Your students think DCF is a rapper. You've never been happier at work.", "你的學生以為 DCF 是個饒舌歌手。你從未如此享受工作。"); } };
    },
  },
  {
    id: "unretire", when: () => jobKey(s.baseJob) === "retired" && s.age < 62,
    make() {
      const pay = Math.round(90000 * costScale());
      return { label: L("Come out of retirement as a consultant", "復出做顧問"), sub: perYear(pay), run() { setJob(JOBS.consultantSelf, "normie", pay); s.sanity -= 4; return L("Retirement lasted until you got bored, which took about six weeks.", "退休維持到你覺得悶為止，大約六個星期。"); } };
    },
  },
];

// a year off with no pay; your job is still there when you come back
const sabbatical = () => s.income > 0 && !s.layoff && s.age < 60 ? [{
  label: L("🌴 Take a one-year sabbatical", "🌴 放一年長假"), sub: cat(L("No pay for a year · ", "一年無薪 · "), L("+25 sanity", "+25 理智")),
  run() {
    s.layoff = { job: s.baseJob || s.job, track: s.track, pay: s.income, rank: s.rank, back: s.age + 1, sabbatical: true };
    s.job = JOBS.sabbatical;
    s.income = 0;
    s.sanity += 25;
    s.network -= 5;
    return L("You set an out-of-office reply that just says \"No.\" and spend a year sleeping, walking and remembering your hobbies.", "你設定了一個只寫著「不」的自動回覆，然後花一年睡覺、散步，重新記起自己的興趣。");
  },
}] : [];

function careerScene() {
  const offers = OFFERS.filter(o => o.when()).sort(() => Math.random() - 0.5).slice(0, 3).map(o => o.make());
  const sideOffers = sideIds().length >= MAX_SIDES ? [] : Object.entries(SIDES)
    .filter(([id, d]) => !sideIds().includes(id) && (!d.when || d.when()))
    .sort(() => Math.random() - 0.5).slice(0, 2)
    .map(([id, d]) => ({
      label: cat(`${d.emoji} `, L("Side hustle: ", "副業："), d.name), sub: d.setup ? cat(d.sub, " · ", UI.costs(d.setup())) : d.sub, crowd: d.crowd,
      run() { startSide(id); s.hustle += 3; return cat(L("New side hustle: ", "新副業："), d.name, L(". You work on it nights and weekends. Sleep becomes optional.", "。你晚上和週末都在做，睡眠變成可有可無。")); },
    }));
  const drop = sideIds().length ? [{
    label: L("Quit your side hustles", "放棄你的副業"), sub: L("Get your evenings back", "取回你的夜晚"),
    run() { s.sides = []; s.sanity += 6; return L("You close the laptop at 7pm and stare at the wall. It's nice, actually.", "你晚上七點合上電腦，望著牆壁發呆。其實感覺不錯。"); },
  }] : [];
  return {
    head: L("Career moves", "職業發展"),
    title: L("💼 What's next for your career?", "💼 你的事業下一步是甚麼？"),
    text: cat(L("You put out feelers. Current role: ", "你四處打聽機會。目前職位："), s.job, s.income ? cat(L(", ", "，"), perYear(s.income)) : "", L(". You can only do this every couple of years, so choose well.", "。每隔兩年才可以這樣做一次，好好選擇。")),
    choices: [...offers, ...sideOffers, ...drop, ...sabbatical(), { label: L("Stay where you are", "留在原位"), sub: L("Better the devil you know", "熟悉的魔鬼總好過陌生的"), run() { s.sanity += 2; return L("You decide the grass isn't greener. It's just differently fertilized.", "你認定別人的草地並不更綠，只是施了不同的肥。"); } }],
  };
}

function openCareer() {
  if (!careerReady() || ui.modal) return;
  s.flags.careerAt = s.age;
  const st = careerScene();
  st.id = "career";
  openModal({ kind: "decision", st });
  renderAll();
}

// startup options pay off, or don't, a few years after you join
function equityYear(year) {
  const eq = s.flags.equity;
  if (!eq || year < eq.at || eq.done) return;
  eq.done = true;
  if (Math.random() < 0.25) {
    const payout = Math.round(eq.pay * rnd(3, 15));
    s.cash += payout;
    s.notes.push({ bad: false, term: "options", text: L(`🚀 At ${year}, the fintech startup gets acquired. Your stock options are worth ${fmt(payout)}.`, `🚀 ${year} 歲，那間金融科技初創被收購。你的認股權值 ${fmt(payout)}。`) });
  } else {
    s.notes.push({ bad: true, term: "options", text: L(`🪦 At ${year}, the fintech startup shuts down. Your stock options are now a very expensive souvenir.`, `🪦 ${year} 歲，那間金融科技初創倒閉了。你的認股權變成一件非常昂貴的紀念品。`) });
  }
}

// ---------- career events ----------

EVENTS.push(
  ev("promoreview", [24, 60], () => onLadder(), () => {
    const odds = Math.min(0.8, 0.2 + s.hustle / 250 + s.network / 400);
    const next = s.rank < topRank() ? rankName(s.rank + 1) : null;
    return {
      title: L("📋 Performance review", "📋 工作表現評核"),
      text: cat(L("Your boss has blocked 30 minutes titled \"Quick chat about your year.\" You've rated yourself \"exceeds expectations\" in every box.", "老闆約了你 30 分鐘，標題是「簡單聊聊你這一年」。你在每一格都給自己評了「超出預期」。")),
      choices: [
        next ? {
          label: cat(L("Push for ", "爭取升任"), next), sub: UI.odds(odds), run() {
            s.sanity -= 5;
            if (chance(odds)) { promote(); s.used.delete("promoreview"); return cat(L("You make your case with a 14-slide deck. It works. You're now ", "你用 14 頁簡報說服了老闆，成功了。你現在是"), s.job, L(".", "。")); }
            if (Math.random() < 0.25) { demote(rnd(0.9, 0.95)); return L("You push too hard. Your boss writes \"lacks self-awareness\" in your review, and your bonus shrinks.", "你逼得太緊。老闆在評核上寫「缺乏自知之明」，你的花紅縮水了。"); }
            s.used.delete("promoreview");
            return L("\"Not this year, but you're on the radar.\" You've been on the radar for a while now.", "「今年不行，但我們有留意你。」你已經被留意了好一段時間。");
          },
        } : null,
        { label: L("Take the small raise and say thanks", "接受小幅加薪並道謝"), sub: L("Safe", "安全"), run() { s.income *= 1.05; s.used.delete("promoreview"); return L("A 5% raise. You thank your boss like it's a kidney.", "加薪 5%。你道謝的樣子好像對方捐了腎給你。"); } },
        {
          label: L("Tell your boss what you really think", "跟老闆說出真心話"), sub: L("High risk, high respect", "高風險，高尊重"), run() {
            if (chance(0.4)) { promote(); return cat(L("Your boss is stunned, then impressed. \"Finally, someone with a spine.\" You're now ", "老闆先是愣住，然後被打動了。「終於有個有骨氣的人。」你現在是"), s.job, L(".", "。")); }
            demote(); s.sanity -= 6; return cat(L("It does not go well. You're moved to ", "結果很糟。你被調到"), s.job, L(" and your desk is moved next to the printer.", "，座位也被搬到影印機旁邊。"));
          },
        },
      ].filter(Boolean),
    };
  }),
  ev("poach", [25, 58], () => s.income > 0 && !s.layoff, () => {
    const pay = Math.round(s.income * rnd(1.25, 1.6));
    return {
      title: L("📞 A headhunter calls", "📞 獵頭來電"),
      text: L("A headhunter calls from a withheld number and asks if you're \"open to opportunities.\" They have one that pays a lot more, at a firm with \"a strong culture.\"", "獵頭用隱藏號碼來電，問你是否「對新機會持開放態度」。他們有個薪酬高得多的職位，公司「文化很強」。"),
      choices: [
        { label: L("Take the job", "接受這份工"), sub: perYear(pay), run() {
          s.income = pay; s.network += 4;
          if (chance(0.35)) { s.sanity -= 14; return L("\"Strong culture\" meant 2am emails and a boss who throws staplers. The money is good, though.", "「文化很強」原來是指凌晨兩點的電郵和一個會擲釘書機的老闆。不過錢是真的多。"); }
          s.sanity -= 3; return L("It's actually a good place. You keep waiting for the catch.", "這地方其實不錯。你一直在等陷阱出現。");
        } },
        { label: L("Use the offer to get a raise", "拿這個 offer 去要求加薪"), sub: L("Bluff", "博一博"), run() {
          if (chance(0.55)) { s.income *= 1.2; return L("Your boss matches most of it. You never had any intention of leaving. They don't need to know that.", "老闆跟了大部分的價。你本來就沒打算走，他們不需要知道。"); }
          s.network -= 4; demote(rnd(0.9, 0.95)); return L("Your boss calls your bluff and starts giving your best clients to someone else.", "老闆看穿你在虛張聲勢，開始把你最好的客戶交給別人。");
        } },
        { label: L("Not interested", "沒興趣"), sub: L("Loyal", "忠心"), run() { s.used.delete("poach"); return L("You hang up. The headhunter adds you to a list called \"maybe next year.\"", "你掛了線。獵頭把你加進一個叫「或者明年」的名單。"); } },
      ],
    };
  }),
  ev("badquarter", [24, 60], () => onLadder() && s.track !== "normie", () => ({
    title: L("📉 Your desk had a terrible quarter", "📉 你的部門有一個糟透的季度"),
    text: L("Your book is down badly and someone has to answer for it. Your boss asks for \"a frank conversation\" on Friday at 5pm.", "你的倉位大跌，總要有人負責。老闆約你星期五下午五點「坦誠地談一談」。"),
    choices: [
      { label: L("Take the blame", "承擔責任"), sub: L("Honest", "誠實"), run() { demote(); s.network += 4; return cat(L("You own it. You keep your job but drop to ", "你承認錯誤。你保住了工作，但降到"), s.job, L(". People trust you more, which is worth something, eventually.", "。大家更信任你了，這遲早會有價值。")); } },
      { label: L("Blame the junior analyst", "怪罪初級分析員"), sub: L("Ruthless", "冷血"), run() { s.heat += 4; s.sanity -= 8; if (chance(0.6)) return L("The analyst is let go. You keep your title, and a small knot in your stomach that never quite goes away.", "那個分析員被解僱了。你保住了職銜，還有胃裡一個永遠解不開的結。"); demote(); s.network -= 10; return L("The analyst had the emails. Now everyone knows, and you're demoted anyway.", "那個分析員有電郵為證。現在人人都知道了，你還是被降職。"); } },
      { label: L("Quit before they can fire you", "趁未被炒先辭職"), sub: L("Jump", "跳船"), run() { const pay = s.income; s.layoff = { job: s.baseJob, track: s.track, pay, rank: s.rank, back: s.age + 1 }; s.job = JOBS.between; s.income = 0; s.sanity += 4; return L("You resign with dignity and a vague LinkedIn post about \"new chapters.\" Now you need a new chapter.", "你有尊嚴地辭職，還在 LinkedIn 發了一篇關於「新篇章」的含糊帖子。現在你需要一個新篇章。"); } },
    ],
  })),
);
Object.assign(EVENT_WEIGHT, { promoreview: () => 3, poach: () => 2 });

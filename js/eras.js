// ---------- big opportunities: market eras that open up during a life, besides the AI boom ----------
// each era starts with a choice of how much to bet, moves your stake every year it runs, and ends in a boom or a bust

const ERAS = [
  {
    id: "homeboom", emoji: "🚀",
    name: () => L(`The ${s.c.name.en} boom`, `${s.c.name.zh}大繁榮`),
    asset: L("local stocks", "本地股票"),
    // a frontier-market boom only happens to people born in emerging economies
    when: () => s.c.g <= 2, weight: () => 1.5,
    gain: [0.05, 0.35], bust: 0.5, bustDrop: 0.6, boomGain: 0.4,
    text: () => L(`Foreign money pours into ${s.c.name.en}. New roads, new malls, new millionaires. The local stock market doubles in a year.`,
      `外資湧入${s.c.name.zh}。新道路、新商場、新富翁。本地股市一年內翻了一倍。`),
    special: () => ({
      label: L("Start a business riding the boom", "開一盤生意乘勢而上"), sub: L("Build something real", "建立實業"),
      run(era) { era.exposure = 0.3; s.income += Math.round(30000 * reach()); s.hustle += 6; return L("You open a logistics company. Every new mall needs deliveries. Your phone never stops ringing.", "你開了一間物流公司。每個新商場都需要送貨，你的電話從未停過。"); },
    }),
    boomText: L("The boom keeps going. A new middle class is born, and your stake grows with it.", "繁榮持續。新的中產階級誕生了，你的持倉也跟著增長。"),
    bustText: L("Foreign investors pull out overnight. The currency falls and local stocks crash.", "外資一夜撤走。貨幣下跌，本地股市崩潰。"),
  },
  {
    id: "crypto", emoji: "₿",
    name: () => L("The crypto supercycle", "加密貨幣超級週期"),
    asset: L("crypto", "加密貨幣"),
    when: () => true, weight: () => CRYPTO_HEAVY.has(s.c.iso) || s.track === "degen" ? 2 : 1,
    gain: [-0.15, 0.7], bust: 0.6, bustDrop: 0.75, boomGain: 0.5,
    text: () => L("Bitcoin breaks its all-time high and big banks start buying it for their clients. Your group chat has opinions again.",
      "比特幣突破歷史高位，大型銀行開始替客戶買入。你的群組又再議論紛紛。"),
    special: () => s.track === "degen" ? {
      label: L("Launch a crypto fund", "成立加密貨幣基金"), sub: L("Ride it professionally", "以專業身份乘風而上"),
      run(era) { era.exposure = 0.6; s.income *= 1.4; s.heat += 10; s.network += 8; return L("Investors who missed the last cycle hand you their money. You promise them you've learned from the last one.", "錯過上一個週期的投資者把錢交給你。你向他們保證你從上一次學到了教訓。"); },
    } : null,
    boomText: L("It was a new era after all. Crypto becomes a normal part of finance, and your stake keeps climbing.", "原來真的是新紀元。加密貨幣成為金融的一部分，你的持倉繼續攀升。"),
    bustText: L("Crypto winter arrives. An exchange collapses, prices fall 75%, and everyone deletes their trading apps.", "加密寒冬來臨。一間交易所倒閉，價格下跌 75%，人人都刪除了交易 app。"),
  },
  {
    id: "green", emoji: "⚡",
    name: () => L("The green energy rush", "綠色能源熱潮"),
    asset: L("clean-energy stocks", "綠色能源股"),
    when: () => true, weight: () => 1,
    gain: [0.0, 0.35], bust: 0.45, bustDrop: 0.55, boomGain: 0.35,
    text: () => L("Governments pour trillions into clean energy. Electric-car and battery stocks are going vertical.",
      "各國政府向綠色能源投入數以萬億計的資金。電動車和電池股直線上升。"),
    special: () => ({
      label: L("Build a solar farm", "興建太陽能發電場"), sub: L("Steady income from the sun", "從太陽賺取穩定收入"),
      run(era) { era.exposure = 0.2; s.cash -= Math.round(Math.max(0, s.cash) * 0.15); s.income += Math.round(Math.max(20000, s.cash * 0.03)); return L("Your panels power 3,000 homes. The electricity company pays you every month, rain or shine.", "你的太陽能板為 3,000 戶供電。不論晴雨，電力公司每月都付錢給你。"); },
    }),
    boomText: L("Clean energy becomes the cheapest energy. Your stake keeps rising with it.", "綠色能源成為最便宜的能源，你的持倉跟著繼續上升。"),
    bustText: L("Subsidies get cut and factories overproduce. Clean-energy stocks halve.", "補貼被削減，工廠生產過剩。綠色能源股腰斬。"),
  },
  {
    id: "property", emoji: "🏠",
    name: () => L("The property boom", "樓市熱潮"),
    asset: L("property", "物業"),
    when: () => true, weight: () => s.c.g >= 3 ? 1.5 : 1,
    gain: [0.04, 0.2], bust: 0.5, bustDrop: 0.5, boomGain: 0.3,
    text: () => L("Interest rates hit record lows. House prices rise every month, and everyone at work is suddenly a landlord.",
      "利率跌至歷史低位，樓價每個月都在升，公司裡人人突然都成了業主。"),
    special: () => ({
      label: L("Buy three flats on mortgages", "按揭買三個單位"), sub: L("Leverage on bricks", "磚頭上的槓桿"),
      run(era) { era.exposure = 1.2; s.income += Math.round(10000 * sc()); s.sanity -= 6; return L("You own three flats and owe the bank a terrifying amount. The rent covers the mortgages. For now.", "你擁有三個單位，欠銀行一個驚人的數目。租金剛好夠供樓。暫時夠。"); },
    }),
    boomText: L("Prices keep rising. You start saying \"bricks and mortar\" a lot.", "樓價繼續上升。你開始經常把「磚頭最實在」掛在嘴邊。"),
    bustText: L("Interest rates jump and buyers vanish. House prices fall for the first time in a decade.", "利率急升，買家消失。樓價十年來首次下跌。"),
  },
  {
    id: "biotech", emoji: "💊",
    name: () => L("The miracle drug", "神奇藥物"),
    asset: L("pharma stocks", "藥廠股"),
    when: () => true, weight: () => 1,
    gain: [0.0, 0.3], bust: 0.4, bustDrop: 0.5, boomGain: 0.35,
    text: () => L("A new weight-loss drug becomes the best-selling medicine in the world. Its maker is suddenly one of the most valuable companies on Earth.",
      "一種新減肥藥成為全球最暢銷的藥物。它的藥廠突然成為地球上最值錢的公司之一。"),
    special: () => isCareer() ? {
      label: L("Move into healthcare investing", "轉投醫療保健投資"), sub: L("Follow the money", "跟著錢走"),
      run(era) { era.exposure = 0.3; s.income *= 1.2; s.network += 6; return L("You learn to say \"GLP-1\" with confidence. Your pay jumps 20%.", "你學會自信地說出「GLP-1」，人工跳升兩成。"); },
    } : null,
    boomText: L("The drug works for other diseases too. Pharma keeps booming, and so does your stake.", "這種藥對其他疾病也有效。藥廠股繼續大升，你的持倉也是。"),
    bustText: L("Cheaper copies flood the market and the patents start to run out. Pharma stocks slump.", "更便宜的仿製藥湧入市場，專利也開始到期。藥廠股大跌。"),
  },
];

const eraDef = id => ERAS.find(e => e.id === id);
const eraActive = id => s.eras.some(e => e.id === id && s.age > e.start && s.age < e.end);

// each life gets one or two eras besides the AI boom, at ages no other scene uses
function planEras(taken) {
  const eligible = ERAS.filter(e => e.when());
  const count = Math.random() < 0.4 ? 2 : 1;
  const eras = [];
  for (let i = 0; i < count && eligible.length; i++) {
    const def = eligible.splice(weightedIdx(eligible.map(e => e.weight())), 1)[0];
    let start = rint(20, 52);
    while (taken.has(start)) start++;
    let end = start + rint(4, 7);
    while (taken.has(end) || end === start) end++;
    if (end >= END_AGE) end = END_AGE;
    taken.add(start); taken.add(end);
    eras.push({ id: def.id, start, end, exposure: 0 });
  }
  return eras;
}

function eraStart(era) {
  const def = eraDef(era.id);
  const special = def.special();
  const bet = (exposure, text) => ({ ...text, run() { era.exposure = exposure; return text.out; } });
  return {
    id: `era-${era.id}:start`,
    build: () => {
      (s.flags.erasSeen ||= {})[era.id] = true;
      return {
        title: cat(`${def.emoji} `, def.name()),
        text: def.text(),
        choices: [
          bet(0.9, { label: cat(L("Go all in on ", "全押"), def.asset), sub: L("This changes everything", "這會改變一切"), out: L("You move most of your money in. Your portfolio will ride this wave, both ways.", "你把大部分錢投進去。你的投資組合會跟著這個浪潮上落，兩個方向都是。") }),
          bet(0.3, { label: L("Put a slice in, about 30%", "投入一部分，大約三成"), sub: L("Exposure without betting the house", "有參與但不押上身家"), out: L("You buy a sensible amount. You'll feel some of the upside and some of the pain.", "你買了合理的份量。你會感受到部分升幅，也會感受到部分痛楚。") }),
          bet(0, { label: L("It's a bubble. Stay out.", "這是泡沫，不參與"), sub: L("You've seen this movie", "這套戲你看過了"), out: L("You sit it out and watch other people get rich, or not.", "你袖手旁觀，看著別人發財，或者沒有。") }),
          ...(special ? [{ ...special, run: () => special.run(era) }] : []),
        ],
      };
    },
  };
}

function eraEnd(era) {
  const def = eraDef(era.id);
  return {
    id: `era-${era.id}:end`,
    build: () => ({
      title: cat(`${def.emoji} `, def.name(), L(": boom or bust?", "：繁榮還是爆煲？")), big: true,
      text: L("Every boom ends one way or another. This is the year everyone finds out how this one ends.", "每個熱潮總會以某種方式結束。今年就是大家知道結局的一年。"),
      passive: true,
      run() {
        const t = typeOf();
        const base = Math.max(0, s.cash);
        const exp = era.exposure;
        let out;
        if (Math.random() < def.bust) {
          const drop = Math.min(0.85, exp * def.bustDrop * t.crash);
          s.cash -= base * drop;
          if (drop > 0 && exp >= 0.9) leekMoment(cat(L("All in on ", "全押"), def.name()), base * drop);
          out = exp ? cat(def.bustText, L(` Your portfolio loses ${pct(drop)}.`, `你的投資組合損失 ${pct(drop)}。`))
            : cat(def.bustText, L(" You stayed out, so you lose nothing.", "你沒有參與，所以分毫無損。"));
        } else {
          const gain = exp * def.boomGain;
          s.cash += base * gain;
          if (exp) (s.flags.erasWon ||= {})[era.id] = true;
          out = exp ? cat(def.boomText, L(` Your portfolio rises another ${pct(gain)}.`, `你的投資組合再升 ${pct(gain)}。`))
            : cat(def.boomText, L(" You missed it entirely.", "你完全錯過了。"));
        }
        era.exposure = 0;
        return out;
      },
    }),
  };
}

// one special moment in the middle of each era
EVENTS.push(
  ev("era-homeboom", [18, 64], () => eraActive("homeboom"), () => ({
    title: L("A foreign fund needs a local partner", "外資基金需要本地合夥人"),
    text: L(`A big foreign fund wants to invest in ${s.c.name.en} but needs someone who knows the ground. They found you on LinkedIn.`,
      `一個大型外資基金想投資${s.c.name.zh}，但需要熟悉本地的人。他們在 LinkedIn 找到了你。`),
    choices: [
      { label: L("Become their local partner", "成為他們的本地合夥人"), sub: L("Big pay, big pressure", "高薪，高壓"), run() { s.income *= 1.4; s.network += 12; s.sanity -= 6; return L("You fly business class to meetings in New York and London to explain your own country to people who've never been.", "你坐商務客位飛到紐約和倫敦開會，向從未去過的人解釋你自己的國家。"); } },
      { label: L("Stay independent", "保持獨立"), sub: L("Your own boss", "自己做老闆"), run() { s.hustle += 5; return L("They find someone else. You keep your freedom and your weekends.", "他們找了別人。你保住了自由和週末。"); } },
    ],
  })),
  ev("era-crypto", [18, 64], () => eraActive("crypto"), () => ({
    title: L("Your barber asks about bitcoin", "理髮師問你比特幣"),
    text: L("Your barber, your dentist and your grandmother all asked you about bitcoin this week. An old saying goes: when the shoeshine boy gives stock tips, sell.",
      "這星期你的理髮師、牙醫和嫲嫲都問你比特幣的事。有句老話說：當擦鞋童也在給股票貼士時，就該賣了。"),
    choices: [
      { label: L("Sell half. This is the top.", "賣一半，這是頂部"), sub: L("Take money off the table", "先落袋"), locked: s.eras.find(e => e.id === "crypto").exposure > 0 ? null : L("Locked, you don't own any crypto", "未解鎖，你沒有持有加密貨幣"), run() { const era = s.eras.find(e => e.id === "crypto"); const g = Math.max(0, s.cash) * era.exposure * 0.15; s.cash += g; era.exposure /= 2; return L("You lock in some profit. Whether it was the top, only next year knows.", "你鎖定了部分利潤。是不是頂部，只有明年才知道。"); } },
      { label: L("Buy more. Everyone's coming in.", "買多些，大家都入場了"), sub: L("Momentum", "動能"), run() { const era = s.eras.find(e => e.id === "crypto"); era.exposure = Math.min(1.2, era.exposure + 0.4); return L("You buy more. Your barber gives you a free haircut out of respect.", "你買多了。理髮師出於尊敬給你免費剪頭髮。"); } },
      { label: L("Give your barber a speech about risk", "向理髮師講解風險"), sub: L("Public service", "公共服務"), run() { s.sanity += 3; return L("He nods politely and buys bitcoin anyway.", "他禮貌地點頭，然後照樣買了比特幣。"); } },
    ],
  })),
  ev("era-green", [18, 64], () => eraActive("green"), () => ({
    title: L("The lithium mine", "鋰礦"),
    text: L("A small company says it found a huge lithium deposit. Battery makers need lithium. Its shares are cheap, for now.", "一間小公司說發現了巨型鋰礦。電池廠需要鋰。它的股價暫時還很便宜。"),
    choices: [
      {
        crowd: true, label: L("Buy a big stake", "大手買入"), sub: L("Long shot", "冷門博奕"), run() {
          const b = Math.max(0, s.cash) * 0.1;
          if (chance(0.3)) { s.cash += b * 4; return L(`The deposit is real. The shares go up five times. +${fmt(b * 4)}.`, `礦藏是真的，股價升了五倍。+${fmt(b * 4)}。`); }
          s.cash -= b * 0.8; return L(`The "huge deposit" was mostly a press release. -${fmt(b * 0.8)}.`, `所謂「巨型礦藏」大部分只是一份新聞稿。-${fmt(b * 0.8)}。`);
        },
      },
      { label: L("Pass", "不買"), sub: L("Mining is a hole in the ground with a liar on top", "礦業就是一個洞加上一個騙子"), run() { s.sanity += 2; return L("You quote an old joke about mines and move on.", "你引用了一個關於礦業的老笑話，然後繼續生活。"); } },
    ],
  })),
  ev("era-property", [18, 64], () => eraActive("property"), () => ({
    title: L("Buying off-plan", "買樓花"),
    text: L("A developer is selling flats in a tower that hasn't been built yet. Prices go up 5% every time a batch sells out.", "一個發展商出售一幢尚未落成大廈的單位。每賣完一批，價錢就加 5%。"),
    choices: [
      {
        crowd: true, label: L("Buy two off-plan flats", "買兩個樓花單位"), sub: L("Flip them before they're built", "落成前轉手"), run() {
          const b = Math.round(Math.max(30000 * sc(), Math.max(0, s.cash) * 0.15));
          if (chance(0.55)) { s.cash += b * 0.8; return L(`You sell both before the tower is finished. +${fmt(b * 0.8)}. You never even saw them.`, `你在大廈落成前就賣掉了兩個單位。+${fmt(b * 0.8)}。你甚至從未見過它們。`); }
          s.cash -= b * 0.5; s.sanity -= 8; return L(`The developer goes bust halfway through. Your deposits are stuck in court. -${fmt(b * 0.5)}.`, `發展商在建到一半時倒閉，你的訂金被困在法庭程序中。-${fmt(b * 0.5)}。`);
        },
      },
      { label: L("Wait until it's built", "等落成再說"), sub: L("See it first", "眼見為實"), run() { s.sanity += 3; return L("You'll buy what you can see. Your colleagues call you old-fashioned.", "你只會買看得見的東西。同事說你很老派。"); } },
    ],
  })),
  ev("era-biotech", [18, 64], () => eraActive("biotech"), () => ({
    title: L("A tip from a doctor friend", "醫生朋友的貼士"),
    text: L("A friend running a clinical trial tells you, off the record, that the results for a new drug are \"incredible.\" They'll be announced next month.",
      "一位負責臨床試驗的朋友私下告訴你，一種新藥的結果「好得難以置信」，下個月才公佈。"),
    choices: [
      { label: L("Buy the drugmaker's shares now", "立即買入該藥廠股票"), sub: L("That's insider trading", "這是內幕交易"), run() { const g = Math.max(50000 * reach(), Math.max(0, s.cash) * 0.3); s.cash += g; s.heat += 40; return L(`The results come out and the shares jump 40%. You made ${fmt(g)}. Your friend's texts are still on your phone.`, `結果公佈，股價急升 40%。你賺了 ${fmt(g)}。朋友的短訊仍然在你的手機裡。`); } },
      { label: L("Tell your friend to stop talking", "叫朋友不要再說"), sub: L("Clean", "乾淨"), run() { s.sanity += 5; s.network -= 3; return L("Your friend is offended. Later, you see on the news that two other people who traded on it were charged.", "朋友不高興。後來你在新聞看到另外兩個靠這消息交易的人被起訴了。"); } },
    ],
  })),
);

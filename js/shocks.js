// ---------- the AI boom ----------

const AI_START = {
  build() {
    const career = isCareer();
    return {
      title: L("🤖 The AI boom begins", "🤖 AI 熱潮開始"),
      text: L(`A chatbot launch changes everything. Chip stocks triple in a year. Every company says "AI" on its earnings call. Is this the internet, or is it tulips?`,
        "一個聊天機械人的發布改變了一切。晶片股一年內升了三倍。每間公司的業績會都在講「AI」。這是互聯網革命，還是鬱金香狂熱？"),
      choices: [
        {
          label: L("Go all in on AI stocks", "全押 AI 股"), sub: L("This changes everything", "這會改變一切"),
          run() { s.ai.exposure = 0.9; s.hustle += 4; return L(`You sell everything else and buy chips, cloud and anything with "AI" in the name. Your portfolio will ride this wave, both ways.`, "你賣掉其他所有東西，買入晶片、雲端和任何名字有「AI」的股票。你的投資組合會跟著這個浪潮上落，兩個方向都是。"); },
        },
        {
          label: L("Put a slice in, about 30%", "投入一部分，大約三成"), sub: L("Exposure without betting the house", "有參與但不押上身家"),
          run() { s.ai.exposure = 0.3; return L("You buy a sensible amount. You'll feel some of the upside and some of the pain.", "你買了合理的份量。你會感受到部分升幅，也會感受到部分痛楚。"); },
        },
        {
          label: L("It's a bubble. Stay out.", "這是泡沫，不參與"), sub: L("You've seen this movie", "這套戲你看過了"),
          run() { s.ai.exposure = 0; s.sanity += 4; return L("You sit it out. Every dinner party will now include someone explaining what you're missing.", "你袖手旁觀。從此每個飯局都有人向你解釋你錯過了甚麼。"); },
        },
        {
          label: L("Pivot your career to AI deals", "轉型專做 AI 交易"), sub: L("Ride it professionally", "以專業身份乘風而上"),
          locked: career ? null : L("Locked, needs a career at a bank or company", "未解鎖，需要在銀行或公司任職"),
          run() { s.ai.exposure = 0.3; s.income *= 1.3; s.network += 8; return L(`You rebrand as "AI coverage." Your pay jumps 30%. Your title has three buzzwords in it.`, "你重新包裝成「AI 行業專家」。人工跳升三成，職銜裡有三個流行詞。"); },
        },
      ],
    };
  },
};

const AI_END = {
  build() {
    return {
      title: L("🤖 Bubble or new era?", "🤖 泡沫還是新紀元？"),
      text: L("After years of AI euphoria, the reckoning arrives. Everyone finds out whether the boom was real.",
        "經過多年的 AI 狂熱，清算的時刻終於來臨。所有人都會知道這個熱潮是不是真的。"),
      passive: true,
      run() {
        const t = typeOf();
        const exp = s.ai.exposure;
        const base = Math.max(0, s.cash);
        let out;
        if (Math.random() < 0.5) {
          const drop = Math.min(0.8, exp * 0.55 * t.crash);
          s.cash -= base * drop;
          out = exp
            ? L(`The bubble pops. AI stocks fall 70%. Your portfolio loses ${pct(drop)}.`, `泡沫爆破。AI 股下跌七成。你的投資組合損失 ${pct(drop)}。`)
            : L(`The bubble pops, and AI stocks fall 70%. You sat it out, so you lose nothing and say "I told you so" for a decade.`, "泡沫爆破，AI 股下跌七成。你沒有參與，所以分毫無損，之後十年都在說「我早就講過」。");
          if (s.flags.aiEquity) out = cat(out, L(" Your startup equity is now worth nothing.", "你的初創股權現在一文不值。"));
        } else {
          const gain = exp * 0.5;
          s.cash += base * gain;
          out = exp
            ? L(`It wasn't a bubble. AI keeps eating the world, and your portfolio rises another ${pct(gain)}.`, `這不是泡沫。AI 繼續吞噬世界，你的投資組合再升 ${pct(gain)}。`)
            : L("It wasn't a bubble. AI keeps eating the world. You missed it entirely. You'll be thinking about this one for a while.", "這不是泡沫。AI 繼續吞噬世界，而你完全錯過了。這件事你會想很久。");
          if (s.flags.aiEquity) {
            const g = Math.round(rnd(2e6, 4e7)); s.cash += g;
            out = cat(out, L(` Your AI startup goes public, and your equity is worth ${fmt(g)}.`, `你的 AI 初創上市了，你的股權價值 ${fmt(g)}。`));
          }
        }
        s.ai.exposure = 0;
        return out;
      },
    };
  },
};

EVENTS.push(
  ev("aijob", [22, 44], () => inBoom() && isCareer(), () => ({
    title: L("An AI startup wants you", "一間 AI 初創想請你"),
    text: L("Half your salary, plus equity in a company that has no revenue and a $4 billion valuation.",
      "人工減半，外加一間零收入但估值 $40 億公司的股權。"),
    choices: [
      {
        label: L("Take it", "接受"), sub: L("Lottery ticket with a salary", "有人工的彩票"),
        run() {
          s.income *= 0.5; s.flags.aiEquity = true; s.job = JOBS.aiExec; s.sanity -= 4;
          return L(`You join. The office has a nap pod and a CEO who says "AGI" in every meeting. Your equity pays off only if the boom survives.`, "你加入了。辦公室有午睡艙，CEO 每個會議都講「AGI」。你的股權只會在熱潮延續時才值錢。");
        },
      },
      { label: L("Decline", "拒絕"), sub: L("Keep the steady paycheck", "保住穩定的人工"), run() { return L("You stay put. You check the startup's valuation every week for the rest of your life.", "你留在原地。之後一生你每個星期都會查那間初創的估值。"); } },
    ],
  })),
  ev("chipstock", [22, 44], inBoom, () => ({
    title: L("Your neighbor's chip stock", "鄰居的晶片股"),
    text: L("He put his kid's college fund into an AI chip company. It's up 900%. He has bought a jet ski.",
      "他把孩子的大學基金全買了一間 AI 晶片公司。升了 900%。他買了一架水上電單車。"),
    choices: [
      { label: L("Buy in now", "現在買入"), sub: L("It can't keep going… can it?", "不會一直升的……吧？"), run() { s.ai.exposure = Math.min(1, s.ai.exposure + 0.3); return L("You buy near the top, probably. Your AI exposure goes up.", "你大概買在接近頂部。你的 AI 持倉增加了。"); } },
      {
        label: L("Take profits on your AI stocks", "AI 股獲利回吐"), sub: L("Lock it in", "鎖定利潤"),
        locked: s.ai.exposure > 0 ? null : L("Locked, you don't own any AI stocks", "未解鎖，你沒有持有任何 AI 股"),
        run() { s.ai.exposure = Math.max(0, s.ai.exposure - 0.3); s.sanity += 4; return L("You sell some. It feels responsible and slightly painful.", "你賣了一部分。感覺很負責任，也有點痛。"); },
      },
      { label: L("Ignore it", "不理它"), sub: L("Jet skis depreciate", "水上電單車會貶值"), run() { s.sanity += 2; return L("You remind yourself that a jet ski is not a retirement plan.", "你提醒自己，水上電單車不是退休計劃。"); } },
    ],
  })),
  ev("agents", [24, 44], () => inBoom() && isCareer(), () => ({
    title: L("The AI agents arrive", "AI 代理來了"),
    text: L(`Your firm rolls out AI agents that build models and write decks. Half the analyst class is "redeployed."`,
      "公司推出能建模和寫簡報的 AI 代理。一半分析師被「重新調配」。"),
    passive: true,
    run() {
      if (Math.random() < 0.3) { s.income *= 0.75; s.sanity -= 8; return L(`Your role gets "streamlined." You keep a job, but it pays a quarter less.`, "你的崗位被「精簡」。你保住了工作，但人工少了四分之一。"); }
      s.hustle += 4;
      return L("You survive by becoming the person who checks the AI's work. Mostly you fix its math.", "你靠做那個檢查 AI 工作的人倖存下來。大部分時間你在改它的數。");
    },
  })),
  ev("datacenter", [27, 44], () => inBoom() && s.cash > 500000, () => ({
    title: L("The data center deal", "數據中心項目"),
    text: L("A friend is raising money to build a data center. AI companies are begging for computing power.",
      "一個朋友正在集資興建數據中心。AI 公司都在求算力。"),
    choices: [
      {
        label: L("Invest $250k", "投資 $250k"), sub: L("Picks and shovels", "賣鏟子給淘金者"), run() {
          if (chance(0.6)) { s.income += 50000; return L("It's fully leased before it's even built. You now earn rent from robots.", "還未建成已經全部租出。你現在向機械人收租。"); }
          s.cash -= 250000 * 0.4;
          return L("The local power grid can't handle it. The project stalls and you lose 40%.", "本地電網應付不了。項目停滯，你損失四成。");
        },
      },
      { label: L("Pass", "不投"), sub: L("Concrete isn't your thing", "石屎不是你的專長"), run() { return L("You pass. Seven more data centers open in the next town over.", "你放棄了。隔離鎮再開了七個數據中心。"); } },
    ],
  })),
  ev("agi", [22, 44], inBoom, () => ({
    title: L("AGI at the dinner party", "飯局上的 AGI"),
    text: L("Someone at dinner says superintelligence is two years away. Someone else says it's already here and working at their company.",
      "飯局上有人說超級智能兩年內就會出現。另一個人說它已經來了，而且在他公司上班。"),
    passive: true,
    run() { s.hustle += 2; return L(`You nod knowingly and say "it's early innings." Nobody knows what that means, including you.`, "你心領神會地點頭，說「現在還是早期」。沒有人知道這是甚麼意思，包括你。"); },
  })),
);

// ---------- black swans: rare, unpredictable, no choice ----------

const SWAN_RATE = 0.03;
const swan = (id, when, title, text, run) => ({ id, when, build: () => ({ title: cat("⚫ ", title), text, passive: true, swan: true, run }) });

const SWANS = [
  swan("pandemic", null, L("A global pandemic", "全球大流行"),
    L("A new virus spreads around the world in weeks. Cities lock down. Markets have their fastest crash in history.",
      "一種新病毒在幾星期內蔓延全球。各地封城，股市出現史上最快的崩盤。"), () => {
      const base = Math.max(0, s.cash);
      s.sanity -= 10;
      if (s.type === "aggressive") {
        if (Math.random() < 0.5) { s.cash += base * 0.5; return L("You buy at the bottom with borrowed money. Markets roar back. Your portfolio rises 50%.", "你借錢在最低位買入。市場強勢反彈，你的投資組合升了五成。"); }
        s.cash -= base * 0.6;
        return L("You were leveraged when it hit. Margin calls force you to sell at the bottom. Your portfolio falls 60%.", "疫情爆發時你正在用槓桿。追收孖展迫你在最低位沽出，你的投資組合跌了六成。");
      }
      if (s.type === "passive") { s.cash -= base * 0.12; s.sanity += 8; return L("Your emergency fund carries you through. You lose 12% and spend lockdown baking bread.", "你的緊急備用金幫你渡過難關。你只蝕了 12%，封城期間在家焗麵包。"); }
      s.cash -= base * 0.25;
      return L(`You ride it out. You lose 25% and learn what "you're on mute" means.`, "你熬過去了。你蝕了 25%，也學會了「你忘了開咪」是甚麼意思。");
    }),
  swan("bankrun", () => s.cash > 50000, L("Your bank collapses overnight", "你的銀行一夜倒閉"),
    L("Rumors spread online at 9pm. By morning your bank is gone and regulators have taken over.",
      "晚上 9 點網上開始流傳謠言。到早上，你的銀行已經倒閉，由監管機構接管。"), () => {
      // careful people keep more cash in the bank, so they're hit harder
      const hit = s.type === "passive" ? 0.2 : s.type === "balanced" ? 0.1 : 0.04;
      s.cash -= Math.max(0, s.cash) * hit; s.sanity -= 6;
      return s.type === "passive"
        ? L(`Your carefully saved cash was sitting above the insured limit. You lose ${pct(hit)} of your net worth. Safe turned out not to be safe.`, `你辛苦儲下的現金超出了存款保障上限。你損失了 ${pct(hit)} 的身家。原來安全並不安全。`)
        : L(`Most of your money was invested, not sitting in the bank. You lose ${pct(hit)} of your net worth.`, `你大部分錢都在投資，沒有放在銀行。你損失了 ${pct(hit)} 的身家。`);
    }),
  // the home-country crisis needs the player's country, so it builds its text at run time
  {
    id: "homecrisis", when: () => s.c.hub < 3,
    build() {
      const poorer = s.c.g <= 2;
      const atHome = !s.city;
      const { en, zh } = s.c.name;
      return {
        title: poorer ? L(`⚫ Currency crisis in ${en}`, `⚫ ${zh}貨幣危機`) : L(`⚫ Banking crisis in ${en}`, `⚫ ${zh}銀行危機`),
        text: poorer
          ? L(`${en[0].toUpperCase() + en.slice(1)}'s currency loses half its value in a month. Banks limit withdrawals. Prices double.`, `${zh}的貨幣在一個月內貶值一半。銀行限制提款，物價翻倍。`)
          : L(`A housing collapse brings down ${en}'s biggest banks.`, `樓市崩潰拖垮了${zh}最大的幾間銀行。`),
        passive: true, swan: true,
        run() {
          const hit = atHome ? (poorer ? 0.45 : 0.25) : 0.08;
          s.cash -= Math.max(0, s.cash) * hit; s.sanity -= atHome ? 12 : 4;
          return atHome
            ? L(`You still live there, and so does your money. You lose ${pct(hit)} of your net worth.`, `你仍然住在那裡，你的錢也是。你損失了 ${pct(hit)} 的身家。`)
            : L(`You moved abroad years ago, so only your savings back home are hit. You lose ${pct(hit)} and send money to your family.`, `你多年前已移居海外，只有留在家鄉的積蓄受影響。你損失了 ${pct(hit)}，並匯錢給家人。`);
        },
      };
    },
  },
  swan("rogue", isCareer, L("A rogue trader blows up your firm", "一個流氓交易員炸毀了你的公司"),
    L("A trader nobody had heard of lost $8 billion on secret bets. Your firm is sold for $1 a share.",
      "一個沒有人聽過的交易員在秘密交易中輸掉 $80 億。你的公司以每股 $1 被賣掉。"), () => {
      s.cash -= Math.round(s.income * 0.5); s.income *= 0.6; s.network -= 10; s.sanity -= 8;
      return L("Your unvested bonus is gone. You land a new job, but it pays 40% less, and everyone asks if you knew him.", "你未歸屬的花紅沒了。你找到新工作，但人工少了四成，而且人人都問你認不認識他。");
    }),
  swan("inheritance", null, L("A letter from a lawyer", "律師的來信"),
    L("A great-aunt you never met has died. She was an early investor in a railroad and never spent a cent.",
      "一位你從未見過的姨婆過世了。她是一條鐵路的早期投資者，一分錢都沒花過。"), () => {
      const g = Math.round(rnd(2e5, 5e6) * Math.max(0.3, mult()));
      s.cash += g; s.sanity += 6;
      return L(`She left everything to you. ${fmt(g)}. You didn't even know you had a great-aunt.`, `她把一切留給了你。${fmt(g)}。你甚至不知道自己有一位姨婆。`);
    }),
  swan("hundredx", () => s.cash > 0, L("Your forgotten 100x", "你遺忘了的百倍股"),
    L("Years ago you put a tiny bet on an obscure company and forgot your password. It just got bought.",
      "多年前你小注買了一間冷門公司，然後忘了密碼。它剛剛被收購了。"), () => {
      const stake = Math.max(1000, s.cash * (s.type === "aggressive" ? 0.05 : s.type === "balanced" ? 0.02 : 0.005));
      s.cash += stake * 99;
      return s.type === "passive"
        ? L(`Your ${fmt(stake)} bet is now worth ${fmt(stake * 100)}. If only you'd bet more. You never bet more.`, `你 ${fmt(stake)} 的小注現在值 ${fmt(stake * 100)}。要是當初押多一點就好了。但你從來不會押多一點。`)
        : L(`Your ${fmt(stake)} bet is now worth ${fmt(stake * 100)}. You frame the trade confirmation.`, `你 ${fmt(stake)} 的小注現在值 ${fmt(stake * 100)}。你把成交單據裱了起來。`);
    }),
  swan("flashcrash", () => s.cash > 0, L("The 20-minute flash crash", "20 分鐘閃崩"),
    L("A glitch sends markets down 40% in 20 minutes before they snap back.", "一個系統故障令股市在 20 分鐘內暴跌四成，然後急速反彈。"), () => {
      const base = Math.max(0, s.cash);
      if (s.type === "aggressive") {
        if (Math.random() < 0.5) { s.cash -= base * 0.7; s.sanity -= 15; return L("You were on leverage. Your broker liquidated you at the bottom. By the time markets recover, 70% of your money is gone.", "你正在用槓桿。券商在最低位強制平倉。市場回升時，你七成的錢已經沒了。"); }
        s.cash += base * 0.8;
        return L("You hit buy at the exact bottom with everything you had. Twenty minutes later you're up 80%.", "你在最低點用盡全部身家按下買入。二十分鐘後你賺了八成。");
      }
      if (s.type === "passive") return L("You didn't even notice. You were at the farmers' market.", "你根本沒有察覺。你當時在逛農墟。");
      s.cash -= base * 0.05;
      return L("A stop-loss order sold some of your stocks at the bottom. You lose 5%.", "一張止蝕盤在最低位賣出了你部分股票。你蝕了 5%。");
    }),
];

function sceneFor(age) {
  if (MILESTONE_AT[age]) return MILESTONE_AT[age];
  if (age === s.ai.start) return AI_START;
  if (age === s.ai.end) return AI_END;
  if (age >= 18 && Math.random() < SWAN_RATE) {
    const swans = SWANS.filter(w => !s.used.has(w.id) && (!w.when || w.when()));
    if (swans.length) {
      const w = pick(swans);
      s.used.add(w.id);
      return w;
    }
  }
  const pool = EVENTS.filter(e => age >= e.ages[0] && age <= e.ages[1] && !s.used.has(e.id) && (!e.when || e.when()));
  if (!pool.length) return QUIET_YEAR;
  const e = pick(pool);
  s.used.add(e.id);
  return e;
}

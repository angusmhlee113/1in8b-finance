// spending scales with local prices unless you're on the global finance track
const sc = () => s.track === "elite" ? 1 : Math.max(0.15, mult());
const isCareer = () => s.track === "elite" || s.track === "normie";
const ev = (id, ages, when, build) => ({ id, ages, when, build });

// random scenes for the years between milestones; each can happen at most once per life
const EVENTS = [
  // ---- teen years ----
  ev("stockgame", [15, 17], null, () => ({
    title: L("The school stock-picking contest", "學校選股比賽"),
    text: L("Your economics class gets $10,000 in pretend money and one semester to beat the market.",
      "經濟科每人獲發 $10,000 虛擬資金，要在一個學期內跑贏大市。"),
    choices: [
      {
        label: L("Go all-in on the hottest meme stock", "全押最熱的迷因股"), sub: L("Coin flip", "擲毫"), run() {
          if (chance(0.5)) {
            s.network += 6; s.hustle += 3;
            return L(`You win by a mile. The local paper calls you "a young Warren Buffett." Warren Buffett would disagree.`, "你大勝。地區報紙稱你為「少年巴菲特」。巴菲特本人應該不同意。");
          }
          s.sanity -= 4;
          return L(`You lose 80% of the pretend money. Your teacher writes "see me" on your report.`, "你輸掉八成虛擬資金。老師在你的成績表上寫：「下課來見我」。");
        },
      },
      {
        label: L("Buy an index fund and wait", "買指數基金然後等"), sub: L("Technically correct", "理論上正確"),
        run() { s.hustle += 2; s.flags.value = true; return L("You finish 14th out of 28. In 30 years you'll have been right. Nobody will remember.", "你在 28 人中排第 14。30 年後你會被證明是對的，但沒有人會記得。"); },
      },
      {
        label: L("Find a loophole in the scoring spreadsheet", "找出計分表的漏洞"), sub: L("Early warning signs", "危險的早期徵兆"),
        run() { s.hustle += 6; s.heat += 5; return L("You win on a technicality. The teacher can't prove anything. A star is born.", "你憑技術性理由勝出。老師甚麼也證明不了。一顆新星誕生了。"); },
      },
    ],
  })),
  ev("summerjob", [15, 17], null, () => ({
    title: L("Your first summer job", "你的第一份暑期工"),
    text: L("Everyone says work experience builds character. You'd rather it built a portfolio.",
      "人人都說工作經驗能磨練品格。你寧願它能累積投資組合。"),
    choices: [
      {
        label: L("Flip burgers", "做快餐店"), sub: L("Honest money", "老老實實賺錢"),
        run() {
          const pay = Math.round(2500 * sc()); s.cash += pay; s.hustle += 5;
          return L(`You earn ${fmt(pay)} and a permanent grease smell. You put all of it in the stock market, obviously.`, `你賺了 ${fmt(pay)} 和一身洗不掉的油煙味。你當然把全部錢放進股市。`);
        },
      },
      {
        label: L("Unpaid internship at a family friend's office", "到世伯的公司做無薪實習"), sub: L("It's who you know", "重點是你認識誰"),
        locked: s.tier >= 3 ? null : L("Locked, your family doesn't know anyone with an office", "未解鎖，你家不認識任何有寫字樓的人"),
        run() { s.network += 10; return L(`You fetch coffee for a wealth manager. He calls you "champ." You add him on LinkedIn.`, "你幫一位財富經理買咖啡。他叫你「靚仔」。你在 LinkedIn 加了他。"); },
      },
      {
        label: L("Start a lawn-mowing LLC", "開一間剪草公司"), sub: L("Founder mode", "創辦人模式"),
        run() {
          const pay = Math.round(rnd(1000, 5000) * sc()); s.cash += pay; s.hustle += 8;
          return L(`You incorporate at 16 and earn ${fmt(pay)}. Your pitch deck has a slide called "Total Addressable Lawn."`, `你 16 歲就註冊公司，賺了 ${fmt(pay)}。你的簡報有一頁叫「潛在可剪草地總量」。`);
        },
      },
    ],
  })),
  ev("relatives", [15, 17], null, () => ({
    title: L(`"So, ${nm()}, what do you want to be?"`, `「${nm()}，你將來想做甚麼？」`),
    text: L("Your relatives corner you at a family dinner.", "家庭聚餐時，親戚們把你圍住了。"),
    choices: [
      { label: L(`"A doctor"`, "「醫生」"), sub: L("Buy yourself time", "先拖延時間"), run() { s.sanity += 5; return L("Everyone nods approvingly. You'll deal with this later.", "大家都滿意地點頭。這件事你遲些再算。"); } },
      {
        label: L(`"Investment banker, M&A coverage"`, "「投資銀行家，負責併購」"), sub: L("Commit to the bit", "堅持到底"),
        run() { s.network += 4; s.hustle += 3; return L("Your uncle asks what M&A is. You explain for 25 minutes. He regrets asking.", "舅舅問甚麼是併購。你解釋了 25 分鐘，他很後悔問了。"); },
      },
      {
        label: L(`"I'm going to be a crypto millionaire"`, "「我要做加密貨幣百萬富翁」"), sub: L("Bold", "大膽"),
        run() { s.sanity -= 3; s.hustle += 2; return L("Grandma prays for you. Out loud. At the table.", "嫲嫲為你祈禱，大聲地，在飯桌上。"); },
      },
    ],
  })),
  ev("compound", [15, 17], null, () => ({
    title: L("The eighth wonder of the world", "世界第八大奇蹟"),
    text: L("Your math teacher explains compound interest. For the first time in your life, you're paying attention in class.",
      "數學老師講解複利。這是你人生第一次在課堂上專心聽書。"),
    passive: true,
    run() {
      s.hustle += 4;
      return L("You make a spreadsheet showing what $100 a month becomes by age 65. You show it to your friends. You have fewer friends now.", "你做了一個試算表，計算每月 $100 到 65 歲會變成多少。你拿給朋友看，然後朋友少了。");
    },
  })),
  ev("activities", [15, 17], null, () => ({
    title: L("After-school activities", "課外活動"),
    text: L("College applications are coming. You need a personality, or at least something that looks like one on paper.",
      "快要申請大學了。你需要一點個性，或至少在紙上看起來有。"),
    choices: [
      {
        label: L("Lacrosse", "長曲棍球"), sub: L("The finance pipeline", "金融界的輸送帶"), run() {
          s.network += s.tier >= 3 ? 10 : 4; s.sanity += 3;
          return s.tier >= 3
            ? L("Half the team's dads work at the same bank. You start networking at practice.", "半隊人的爸爸都在同一間銀行工作。你在練習時已經開始建立人脈。")
            : L("The equipment costs more than your parents' car. You make it work.", "裝備比你爸媽的車還貴，但你想辦法撐住了。");
        },
      },
      { label: L("Debate team", "辯論隊"), sub: L("Learn to argue", "學習爭辯"), run() { s.hustle += 6; return L("You learn to argue any side of anything. Perfect training for writing equity research.", "你學會為任何立場辯護。這是寫股票研究報告的完美訓練。"); } },
      { label: L("Video games", "打機"), sub: L("Skill tree: none", "技能樹：無"), run() { s.sanity += 10; s.hustle -= 3; return L("You hit a top-100 ranking. It does not go on your résumé, though you try.", "你打上了全服頭 100 名。這不能寫進履歷，雖然你試過。"); } },
    ],
  })),
  ev("brokerage", [16, 17], null, () => ({
    title: L("Your first brokerage account", "你的第一個證券戶口"),
    text: L("With a parent's signature and your life savings, you're officially in the market.",
      "靠著爸媽的簽名和你畢生積蓄，你正式入市了。"),
    choices: [
      {
        crowd: true, label: L("Buy whatever Reddit is hyping", "Reddit 炒甚麼就買甚麼"), sub: L("The people's choice", "人民的選擇"), run() {
          if (chance(0.4)) {
            const g = Math.max(800, s.cash * 0.5); s.cash += g;
            return L(`To the moon! You make ${fmt(g)} and start saying "tendies" unironically.`, `衝上月球！你賺了 ${fmt(g)}，開始認真地說「炸雞塊」（tendies）。`);
          }
          const l = Math.max(400, s.cash * 0.3); s.cash -= l;
          return L(`The squeeze gets squoze. You lose ${fmt(l)}.`, `軋空被反軋。你蝕了 ${fmt(l)}。`);
        },
      },
      {
        label: L("Buy the S&P 500 and forget the password", "買標普 500，然後忘記密碼"), sub: L("Accidental genius", "意外的天才"),
        run() {
          // the money disappears from view and quietly compounds until you rediscover it, years later
          const amount = Math.max(100, Math.round(Math.max(0, s.cash) * 0.8));
          s.cash -= amount;
          s.locked = { amount, value: amount, foundAt: rint(28, 58) };
          return L(`You put ${fmt(amount)} into an S&P 500 fund. A week later you can't remember the password, or the email you used. You stop thinking about it.`,
            `你把 ${fmt(amount)} 放進標普 500 基金。一星期後你已經忘記了密碼，連用哪個電郵登記都忘了。你不再去想它。`);
        },
      },
      {
        label: L("Day trade between classes", "小息時即日鮮"), sub: L("Phone under the desk", "手機放在書桌下"),
        run() { s.sanity -= 6; s.hustle += 5; s.cash -= 300; return L("Your phone gets confiscated mid-trade. The trade goes badly without you.", "交易進行到一半手機被沒收。沒有你，那單交易輸得很慘。"); },
      },
    ],
  })),

  // ---- college years ----
  ev("invclub", [18, 21], () => s.school !== "none", () => ({
    title: L("The student investment club", "學生投資學會"),
    text: L("It manages $40,000 of the university's money and $4 million worth of its members' egos.",
      "學會管理大學 $40,000 的資金，以及價值 $400 萬的會員自尊心。"),
    choices: [
      {
        label: L("Pitch a stock at the weekly meeting", "在每週會議推介一隻股票"), sub: L("Show your work", "展示你的功力"),
        run() { s.hustle += 6; s.network += 5; return L("Your 60-slide pitch on a regional bank goes over well. The bank fails two years later. Nobody brings it up.", "你那份 60 頁的地區銀行推介反應很好。那間銀行兩年後倒閉，沒有人再提起。"); },
      },
      {
        label: L("Run for club president", "競選會長"), sub: L("Résumé gold", "履歷上的黃金"), run() {
          if (chance(0.5)) { s.network += 14; s.sanity -= 6; return L(`You win. "President" is now the biggest word on your résumé.`, "你當選了。「會長」成為你履歷上最大的兩個字。"); }
          s.sanity -= 8;
          return L("You lose to a guy whose dad runs a hedge fund. Classic.", "你輸給一個爸爸開對沖基金的人。經典。");
        },
      },
      { label: L("Just go for the free pizza", "只是去吃免費薄餅"), sub: L("Respect", "值得尊重"), run() { s.sanity += 6; return L("The pizza is great. You learn one thing about bond duration by accident.", "薄餅很好吃。你意外學會了一點債券存續期的知識。"); } },
    ],
  })),
  ev("springbreak", [18, 21], () => s.school !== "none", () => ({
    title: L("Spring break", "春假"),
    text: L("Your friends are going somewhere with beaches. Your recruiting group chat is going somewhere with spreadsheets.",
      "朋友們要去有沙灘的地方。你的求職群組要去有試算表的地方。"),
    choices: [
      {
        label: L("Cancún", "坎昆"), sub: L("You only live once", "人生只有一次"),
        run() { s.cash -= Math.round(2000 * sc()); s.sanity += 12; s.network += 3; return L("Beautiful week. You meet a banker and get his email on a napkin, which you lose.", "美好的一星期。你認識了一個銀行家，他把電郵寫在紙巾上，然後你弄丟了。"); },
      },
      {
        label: L("Memorize 400 technical interview questions", "背熟 400 條技術面試題"), sub: L(`"Walk me through a DCF"`, "「講解一下 DCF」"),
        run() { s.hustle += 10; s.sanity -= 6; return L("You can now walk anyone through a DCF in your sleep, and you do. Your roommate has requested a transfer.", "你現在連發夢都能講解 DCF，而你真的在夢裡講。室友已申請調房。"); },
      },
      {
        label: L("Fly to New York for coffee chats", "飛去紐約約人喝咖啡"), sub: L("Expensive networking", "昂貴的人脈投資"),
        run() { s.cash -= Math.round(1500 * sc()); s.network += 10; return L("Seven coffees, three of them with the same analyst. He remembers you. That counts.", "七杯咖啡，其中三杯跟同一個分析師喝。他記得你，這已經算數。"); },
      },
    ],
  })),
  ev("rush", [18, 20], () => s.school !== "none", () => ({
    title: L("Rush week", "迎新招募週"),
    text: L(`Two flyers on the noticeboard: a fraternity famous for its "alumni network," and the Finance Society, famous for its PowerPoint workshops.`,
      "壁報板上有兩張傳單：一個以「校友網絡」聞名的兄弟會，和一個以 PowerPoint 工作坊聞名的金融學會。"),
    choices: [
      {
        label: L("Join the frat", "加入兄弟會"), sub: L("Network now, liver later", "先顧人脈，肝臟遲些再算"),
        run() { s.network += 10; s.sanity += 4; s.hustle -= 4; return L(`Your pledge master works at a bank now. He says to call him "when the time comes."`, "帶你入會的師兄現在在銀行工作。他說「時機到了」就打給他。"); },
      },
      {
        label: L("Join the Finance Society", "加入金融學會"), sub: L("Strictly business", "公事公辦"),
        run() { s.network += 6; s.hustle += 5; return L("You learn every Excel keyboard shortcut. You never touch a mouse again.", "你學會了所有 Excel 快捷鍵，從此再沒碰過滑鼠。"); },
      },
      { label: L("Neither. Sleep.", "都不參加，去睡覺"), sub: L("Unheard of", "前所未聞"), run() { s.sanity += 10; return L("You are the only well-rested person on campus.", "你是全校唯一睡得飽的人。"); } },
    ],
  })),
  ev("loanletter", [19, 23], () => s.cash < 0, () => ({
    title: L("A letter from your loan servicer", "學債公司的來信"),
    text: L("Your student loans have accrued interest. The interest has also accrued interest.",
      "你的學債累積了利息，而利息也累積了利息。"),
    passive: true,
    run() { s.sanity -= 6; s.hustle += 4; return L("You frame the letter and hang it above your desk. Motivation.", "你把信裱起來掛在書桌上方。這就是動力。"); },
  })),
  ev("whale", [18, 23], () => s.track === "degen", () => ({
    title: L("A crypto whale slides into your DMs", "一條加密巨鯨私訊你"),
    text: L(`His profile picture is a cartoon ape. He's "looking for young talent" and has a "guaranteed 10x play."`,
      "他的頭像是一隻卡通猿猴。他在「尋找年輕人才」，手上有個「保證十倍的機會」。"),
    choices: [
      {
        crowd: true, label: L("Copy his trades", "跟他落單"), sub: L("He seems legit", "他看起來很正經"), run() {
          if (chance(0.35)) {
            const g = Math.max(20000 * reach(), s.cash); s.cash += g; s.network += 8;
            return L(`He was legit (this time). +${fmt(g)}.`, `他是真的（這一次）。+${fmt(g)}。`);
          }
          const l = Math.max(5000, s.cash * 0.5); s.cash -= l;
          return L(`He was a 14-year-old in Ohio. You're down ${fmt(l)}. Very convincing for a 14-year-old.`, `他原來是俄亥俄州一個 14 歲少年。你蝕了 ${fmt(l)}。以 14 歲來說他非常有說服力。`);
        },
      },
      { label: L("Block him", "封鎖他"), sub: L("Healthy skepticism", "健康的懷疑"), run() { s.sanity += 4; return L("You're the only person in your Discord who didn't lose money that week.", "那個星期，你是 Discord 裡唯一沒有蝕錢的人。"); } },
    ],
  })),
  ev("freeze", [19, 32], () => s.track === "degen", () => ({
    title: L(`"We are pausing withdrawals"`, "「我們暫停提款」"),
    text: L(`Rumors say a major crypto exchange is insolvent. Its CEO tweets "assets are fine."`,
      "有傳聞指一間大型加密貨幣交易所已經資不抵債。它的 CEO 發推說「資產沒問題」。"),
    choices: [
      {
        label: L("Pull everything out now", "立即全部提走"), sub: L("Not your keys, not your coins", "私鑰不在手，幣就不是你的"),
        run() { s.sanity -= 3; return L("You get out a day before withdrawals freeze. You feel like a genius for one day, then the whole market crashes anyway.", "你在凍結提款前一天成功撤走。你覺得自己是天才，維持了一天，然後整個市場照樣崩盤。"); },
      },
      {
        crowd: true, label: L("It's just FUD", "只是恐慌散播"), sub: L("Trust the CEO", "相信 CEO"), run() {
          if (chance(0.6)) {
            const l = Math.max(0, s.cash * 0.5); s.cash -= l; s.sanity -= 15;
            return L(`The assets were not fine. You lose ${fmt(l)} and gain a lifelong distrust of CEOs who wear shorts on stage.`, `資產有問題。你蝕了 ${fmt(l)}，從此不再信任穿短褲上台的 CEO。`);
          }
          return L("It actually was just FUD. You can't believe it either.", "原來真的只是謠言。連你自己都不敢相信。");
        },
      },
    ],
  })),
  ev("nft", [20, 34], () => s.track === "degen", () => ({
    title: L("Your NFT collection", "你的 NFT 系列"),
    text: L("You've drawn 10,000 slightly different cartoon frogs. The mint is tonight.",
      "你畫了一萬隻略有不同的卡通青蛙。今晚開售。"),
    choices: [
      {
        label: L("Launch it", "發售"), sub: L("Number go up?", "數字會升嗎？"), run() {
          if (chance(0.3)) {
            const g = Math.round(rnd(3e5, 4e6) * reach()); s.cash += g; s.heat += 10;
            return L(`Sold out in 4 minutes! ${fmt(g)}. A celebrity makes one her profile picture.`, `4 分鐘內售罄！${fmt(g)}。一位明星把其中一隻設為頭像。`);
          }
          s.cash -= 15000;
          return L("You sell 11. Nine were to your own alt accounts.", "你賣出了 11 隻，其中 9 隻是賣給自己的分身帳戶。");
        },
      },
      { label: L("Abandon the frogs", "放棄那些青蛙"), sub: L("Dignity", "尊嚴"), run() { s.sanity += 5; return L("The frogs live forever in a folder on your desktop.", "那些青蛙永遠活在你桌面的一個資料夾裡。"); } },
    ],
  })),

  // ---- working life ----
  ev("bonus", [23, 64], () => s.track === "elite", () => {
    const bonus = Math.round(s.income * rnd(0.2, 0.6));
    return {
      title: L("Bonus day", "派花紅日"),
      text: L(`Your number is ${fmt(bonus)}. Someone two desks over got more. You can tell by how he's walking.`,
        `你的數字是 ${fmt(bonus)}。隔兩張枱的人拿得比你多，看他走路的樣子就知道。`),
      choices: [
        {
          label: L("Rolex. Today.", "今天就買勞力士"), sub: L("You earned it", "你應得的"),
          run() { s.cash += bonus - 30000; s.network += 5; s.sanity += 4; return L("Your new watch tells the time exactly as well as your old one, but louder.", "新錶報時跟舊錶一樣準，只是更高調。"); },
        },
        {
          label: L("Invest every dollar", "每一分錢都拿去投資"), sub: L("Delayed gratification", "延遲滿足"),
          run() { s.cash += bonus; s.hustle += 3; return L("You put it all in index funds and feel nothing. That's the point.", "你全部放進指數基金，毫無感覺。這正是重點。"); },
        },
        {
          label: L("Complain that it's below market", "投訴花紅低於市價"), sub: L("Bold", "大膽"), run() {
            if (chance(0.35)) { s.cash += bonus * 1.3; s.network += 3; return L("They bump it 30%. The squeaky wheel gets the grease.", "他們加多了 30%。會吵的孩子有糖食。"); }
            s.cash += bonus; s.network -= 8;
            return L(`Your MD now thinks of you as "the one who complained." Forever.`, "你的 MD 從此記住你是「那個投訴的人」。永遠。");
          },
        },
      ],
    };
  }),
  ev("hamptonsMD", [24, 34], () => s.track === "elite", () => ({
    title: L("The MD's summer party", "MD 的夏日派對"),
    text: L(`Your managing director invited the team to his Hamptons house. Attendance is "optional."`,
      "你的董事總經理邀請團隊到他的 Hamptons 別墅。出席是「自願」的。"),
    choices: [
      {
        label: L("Go, and bring a nice bottle", "出席，並帶一支好酒"), sub: L("Face time", "露面時間"),
        run() {
          s.cash -= 800; s.network += 10;
          const wrong = wrongName();
          return L(`You talk to the MD for 4 minutes. He calls you "${wrong}." Still counts.`, `你跟 MD 談了 4 分鐘。他叫你「${wrong}」。這也算數。`);
        },
      },
      { label: L("Skip it", "不去"), sub: L("It's optional, right?", "是自願的，對吧？"), run() { s.network -= 6; s.sanity += 6; return L("It was not optional.", "那並不是自願的。"); } },
    ],
  })),
  ev("expense", [23, 40], () => s.track === "elite", () => ({
    title: L("The expense report", "報銷單"),
    text: L("You took three friends to a $2,400 dinner. One of them works at a company that could, theoretically, someday be a client.",
      "你請三個朋友吃了一頓 $2,400 的晚飯。其中一人的公司，理論上，將來可能成為客戶。"),
    choices: [
      {
        label: L(`Expense it as "client development"`, "以「客戶開發」名義報銷"), sub: L("Everyone does it", "人人都這樣做"), run() {
          s.heat += 8; s.network += 4;
          if (chance(0.2)) { s.network -= 15; return L(`Compliance flagged it. You have a "conversation" with HR. It's on your file now.`, "合規部標記了這筆帳。你被 HR 約見「傾下偈」，現在記錄在案。"); }
          return L("Approved. Your firm just paid for your birthday dinner.", "批准了。公司剛剛替你付了生日飯。");
        },
      },
      { label: L("Pay for it yourself", "自己付錢"), sub: L("Clean hands", "兩袖清風"), run() { s.cash -= 2400; s.sanity += 3; return L("You sleep well, which is rare.", "你睡得很好，這很罕見。"); } },
    ],
  })),
  ev("gulf", [27, 40], () => s.track === "elite", () => ({
    title: L("An offer from the Gulf", "來自中東的邀請"),
    text: L("A sovereign wealth fund wants you in Dubai. Tax-free, a driver, and a very large office with no windows.",
      "一個主權財富基金想請你去杜拜。免稅、有司機，還有一間很大但沒有窗的辦公室。"),
    choices: [
      {
        label: L("Take it", "接受"), sub: L("+50% take-home pay", "實收人工 +50%"),
        run() { s.income *= 1.5; s.sanity -= 4; s.city = L("Dubai", "杜拜"); return L("You move to Dubai and post sunset photos from rooftop pools. Your friends back home mute you.", "你搬到杜拜，在天台泳池拍日落照。家鄉的朋友把你靜音了。"); },
      },
      { label: L("Decline", "拒絕"), sub: L("Stay put", "留在原地"), run() { s.sanity += 4; return L("You stay. Three colleagues go. They all send you the same rooftop pool photo.", "你留下了。三個同事去了，他們都傳給你同一張天台泳池照片。"); } },
    ],
  })),
  ev("mdarrested", [24, 64], () => s.track === "elite", () => ({
    title: L("Your old boss is on the news", "你的前上司上了新聞"),
    text: L(`Your former MD was arrested for "irregularities." The photos show him in handcuffs and a Patagonia vest.`,
      "你的前 MD 因「違規行為」被捕。照片中他戴著手銬，穿著 Patagonia 背心。"),
    passive: true,
    run() { s.network -= 8; s.sanity -= 3; return L(`You remove him from LinkedIn and describe him as "someone I barely worked with."`, "你在 LinkedIn 刪除了他，並形容他是「一個我幾乎沒合作過的人」。"); },
  })),
  ev("headhunter", [23, 38], isCareer, () => ({
    title: L("A headhunter calls", "獵頭來電"),
    text: L(`"I have a really exciting opportunity that I can't tell you anything about."`,
      "「我有一個非常令人興奮的機會，但甚麼細節都不能透露。」"),
    choices: [
      {
        label: L("Take the new job", "接受新工作"), sub: L("+25% pay, new people to impress", "人工 +25%，要重新討好一班新人"),
        run() { s.income *= 1.25; s.network += 4; s.sanity -= 5; return L("Same job, different logo, bigger number. You start learning everyone's name again.", "同樣的工作，不同的商標，更大的數字。你又要重新記住所有人的名字。"); },
      },
      {
        label: L("Use the offer as leverage", "用這個 offer 討價還價"), sub: L("Play the game", "玩這個遊戲"), run() {
          if (chance(0.5)) { s.income *= 1.2; return L("Your boss matches it. You're a negotiation legend (in your own head).", "老闆跟價了。你是談判傳奇（在你自己腦海裡）。"); }
          s.network -= 10;
          return L(`Your boss says "Congratulations on the new role!" You hadn't actually decided to leave.`, "老闆說：「恭喜你找到新工作！」但你其實還沒決定要走。");
        },
      },
      { label: L("Stay loyal", "保持忠誠"), sub: L("Loyalty gets rewarded, right?", "忠誠會有回報的，對吧？"), run() { s.sanity += 4; return L("Your loyalty is noted in an HR system that gets replaced next year.", "你的忠誠被記錄在一個明年就會被換掉的 HR 系統裡。"); } },
    ],
  })),
  ev("layoffs", [23, 64], isCareer, () => ({
    title: L("Layoff season", "裁員季節"),
    text: L(`Calendar invites titled "Quick Sync" are going out, and HR is on all of them.`,
      "標題為「快速同步」的會議邀請陸續發出，每一個都有 HR 在內。"),
    passive: true,
    run() {
      if (chance(0.25)) {
        s.income *= 0.8; s.cash -= Math.round(s.income * 0.4); s.sanity -= 12;
        return L(`You got the invite. Four months of "funemployment," then a job at a smaller firm for less money.`, "你收到了邀請。經過四個月的「快樂失業」，你去了一間較小的公司，人工更低。");
      }
      s.sanity -= 6;
      return L("You survive. Your desk neighbor doesn't. You inherit his monitor and his workload.", "你倖存了，鄰座同事卻沒有。你繼承了他的螢幕和工作量。");
    },
  })),
  ev("golf", [26, 40], isCareer, () => ({
    title: L(`"Do you golf?"`, "「你打高爾夫嗎？」"),
    text: L("Every important conversation at your firm seems to happen on a golf course.",
      "公司裡每一個重要對話，好像都在高爾夫球場上發生。"),
    choices: [
      { label: L("Take lessons and join a club", "上堂並加入球會"), sub: L("Pay to play", "付錢入場"), run() { s.cash -= Math.round(25000 * sc()); s.network += 12; return L("You're terrible at it. That turns out not to matter at all.", "你打得很差，但原來完全不重要。"); } },
      {
        label: L("Pretend you golf", "扮識打"), sub: L("Fake it", "扮到你成功"), run() {
          if (chance(0.5)) { s.network += 5; return L(`You talk about your "short game" convincingly. Nobody checks.`, "你很有說服力地談論你的「短桿技術」。沒有人查證。"); }
          s.network -= 6;
          return L("Your MD invites you to play. You show up in bowling shoes.", "MD 邀請你去打球。你穿著保齡球鞋出現。");
        },
      },
      { label: L("No", "不打"), sub: L("Stand firm", "立場堅定"), run() { s.sanity += 3; return L("You hear later that three deals were decided on the 9th hole.", "你後來聽說有三單交易是在第九洞決定的。"); } },
    ],
  })),
  ev("cfoask", [25, 64], () => s.track === "normie", () => ({
    title: L("The CFO asks for a favor", "財務總監請你幫個忙"),
    text: L(`"We just need the quarter to look a little better. Move some revenue forward. Everyone does it."`,
      "「我們只需要這一季的數字好看一點。把一些收入提前入帳就好，人人都這樣做。」"),
    choices: [
      {
        label: L("Make the numbers work", "把數字做好看"), sub: L("Team player", "團隊精神"),
        run() { s.heat += 30; s.income += 20000 * sc(); return L("The quarter looks great. You get a raise and a feeling in your stomach that never goes away.", "這季數字很漂亮。你獲得加薪，還有一種永遠揮之不去的胃部不適。"); },
      },
      { label: L("Refuse", "拒絕"), sub: L("Integrity", "誠信"), run() { s.network -= 10; s.sanity += 5; return L("The CFO stops cc'ing you on things. Your career stalls. Your conscience is spotless.", "財務總監不再 cc 你。你的事業停滯了，但良心一塵不染。"); } },
      {
        label: L("Blow the whistle", "做吹哨者"), sub: L("Big risk, maybe big reward", "高風險，或許有高回報"), run() {
          s.sanity -= 10;
          if (chance(0.4)) {
            const r = Math.round(rnd(3e5, 3e6)); s.cash += r;
            return L(`Whistleblowers get a cut of the fines. You get ${fmt(r)}, and a reputation that makes you unhireable.`, `吹哨者可以分到部分罰款。你得到 ${fmt(r)}，以及一個令你無人敢請的名聲。`);
          }
          s.network -= 15;
          return L("The investigation goes nowhere. You're transferred to the Cleveland office.", "調查不了了之。你被調到克里夫蘭分行。");
        },
      },
    ],
  })),
  ev("review", [24, 64], () => s.track === "normie", () => {
    const p = Math.min(0.85, s.network / 150 + s.hustle / 200);
    return {
      title: L("Annual review", "年度考核"),
      text: L(`Your manager says you "meet expectations." You believe you exceed them.`,
        "你的經理說你「符合期望」。你認為自己超出期望。"),
      choices: [
        {
          label: L("Ask for a big raise", "要求大幅加薪"), sub: UI.odds(p), run() {
            if (chance(p)) { s.income *= 1.3; return L("Granted! You're making real money now, by some definitions.", "批准了！以某些定義來說，你現在賺的是真正的錢。"); }
            s.sanity -= 6;
            return L(`"Budgets are tight this year." Your manager's new car is parked outside.`, "「今年預算很緊。」經理的新車就泊在外面。");
          },
        },
        { label: L("Quietly update your LinkedIn", "悄悄更新 LinkedIn"), sub: L("Open to work", "開放工作機會"), run() { s.network += 5; return L("Recruiters notice. So does your manager.", "獵頭注意到了，你的經理也注意到了。"); } },
      ],
    };
  }),
  ev("ai", [30, 64], () => isCareer() && s.age > s.ai.start, () => ({
    title: L("AI is coming for your job", "AI 要搶你的飯碗"),
    text: L("Your firm announces an AI tool that does 80% of what your team does. There's a town hall about it.",
      "公司宣布推出一個 AI 工具，能做你團隊八成的工作。還為此開了全體大會。"),
    choices: [
      {
        label: L(`Become the "AI person" on your team`, "成為團隊裡的「AI 專家」"), sub: L("Get ahead of it", "搶先一步"),
        run() { s.hustle += 8; s.network += 6; return L(`You put "AI" in your job title. You keep your job. Several teams don't.`, "你在職銜加上「AI」。你保住了工作，好幾個團隊卻沒有。"); },
      },
      {
        label: L("Deny it", "否認現實"), sub: L("It can't do what I do", "它做不到我做的事"), run() {
          if (chance(0.35)) { s.income *= 0.7; s.sanity -= 10; return L(`It could, in fact, do what you do. You're "restructured" into a smaller role.`, "事實上它做得到。你被「重組」到一個較小的崗位。"); }
          return L("So far, it can't. You print the town hall slides and pin them up ironically.", "暫時它還做不到。你把大會簡報印出來，諷刺地貼在牆上。");
        },
      },
      {
        label: L(`Launch an "AI-powered" fund`, "推出「AI 驅動」基金"), sub: L("Ride the wave", "乘風破浪"), run() {
          if (chance(0.4)) { s.cash += Math.round(rnd(5e5, 5e6)); s.network += 10; return L(`Investors pour in. The "AI" is a spreadsheet with a logo. Returns are great anyway.`, "投資者蜂擁而至。所謂「AI」其實是一個加了商標的試算表。回報照樣很好。"); }
          s.cash -= 40000;
          return L("Nobody invests. The fund's landing page is still up, though.", "沒有人投資。不過基金的網頁還在。");
        },
      },
    ],
  })),
  ev("podcast", [22, 64], () => s.track === "degen", () => ({
    title: L("Podcast invite", "Podcast 邀請"),
    text: L(`A popular finance podcast wants you on to talk about "the future of money."`,
      "一個熱門財經 Podcast 邀請你上節目談「金錢的未來」。"),
    choices: [
      {
        label: L("Go on and shill your bags", "上節目推銷自己的持倉"), sub: L("Promote your holdings", "宣傳你的貨"),
        run() { s.network += 15; s.heat += 10; s.cash += Math.max(0, s.cash) * 0.2; return L("Your holdings pump 20% after the episode. Regulators also listen to podcasts.", "節目播出後你的持倉升了 20%。監管機構也會聽 Podcast。"); },
      },
      { label: L("Go on and be honest", "上節目並誠實分享"), sub: L("Radical", "激進"), run() { s.network += 6; s.sanity += 4; return L(`You say "I don't know" twice. The comments call you refreshing. Nobody watches it.`, "你說了兩次「我不知道」。留言說你很清新，但沒有人看。"); } },
    ],
  })),

  // ---- life happens ----
  ev("memefrenzy", [22, 38], null, () => ({
    title: L("A meme stock is up 1,000%", "一隻迷因股升了 1,000%"),
    text: L("A struggling video game retailer is suddenly worth more than some countries. Your cousin is a millionaire now.",
      "一間苦苦掙扎的遊戲零售商突然比某些國家還值錢。你的表哥現在是百萬富翁了。"),
    choices: [
      {
        label: L("Short it. This is insane.", "沽空它，這太瘋狂了"), sub: L("Fundamentals matter", "基本面很重要"), run() {
          const b = Math.max(0, s.cash) * 0.2;
          if (chance(0.4)) { s.cash += b; return L(`It collapses and you make ${fmt(b)}. Your cousin loses everything. Thanksgiving is awkward.`, `它崩盤了，你賺了 ${fmt(b)}。表哥輸光一切，家庭聚會變得很尷尬。`); }
          s.cash -= b * 1.5; s.sanity -= 10;
          return L(`It doubles again. You lose ${fmt(b * 1.5)}. Reddit makes memes about people like you.`, `它再翻一倍。你蝕了 ${fmt(b * 1.5)}。Reddit 專門為你這種人做梗圖。`);
        },
      },
      {
        crowd: true, label: L("Buy it. Apes together strong.", "買入！猿猴團結力量大"), sub: L("Momentum", "動能"), run() {
          const b = Math.max(0, s.cash) * 0.2;
          if (chance(0.3)) { s.cash += b * 2; return L(`It goes up again! +${fmt(b * 2)}. You get a tattoo of a rocket.`, `它又升了！+${fmt(b * 2)}。你紋了一枚火箭。`); }
          s.cash -= b * 0.7;
          return L(`You bought the top. -${fmt(b * 0.7)}. Diamond hands, empty pockets.`, `你買在最高位。-${fmt(b * 0.7)}。鑽石手，空口袋。`);
        },
      },
      { label: L("Stay out", "置身事外"), sub: L("Watch with popcorn", "拿著爆谷看戲"), run() { s.sanity += 3; return L("You watch the whole thing like a nature documentary.", "你像看大自然紀錄片一樣看完整件事。"); } },
    ],
  })),
  ev("friendstartup", [23, 38], () => s.cash > 30000, () => ({
    title: L("Your friend's startup needs money", "朋友的初創需要資金"),
    text: L(`"It's like Uber, but for dog walking, on the blockchain." He's raising a friends-and-family round.`,
      "「就像 Uber，但是遛狗，而且在區塊鏈上。」他正在進行親友輪融資。"),
    choices: [
      {
        label: L("Invest $25k", "投資 $25k"), sub: L("Support a friend", "支持朋友"), run() {
          s.cash -= 25000;
          if (chance(0.08)) { s.cash += 1500000; s.network += 10; return L(`It actually works?! Your $25k becomes $1.5M. You call yourself an "early-stage investor" from now on.`, "竟然成功了？！你的 $25k 變成 $150 萬。你從此自稱「早期投資者」。"); }
          return L(`The company "pivots" three times and dies. You get a nice hoodie out of it.`, "公司「轉型」了三次然後倒閉。你得到一件不錯的衛衣。");
        },
      },
      { label: L("Pass", "不投"), sub: L("Protect the friendship", "保護友誼"), run() { s.network -= 3; return L("He stops inviting you to things. The startup dies anyway.", "他不再約你出來。初創最終還是倒閉了。"); } },
    ],
  })),
  ev("dating", [23, 40], () => !s.flags.partner, () => ({
    title: L("Dating in finance", "金融人的約會"),
    text: L(`Your dating profile says "Finance. 6'1". Love to travel." Two of these are true.`,
      "你的交友檔案寫著：「金融業。6 呎 1。熱愛旅行。」其中兩項是真的。"),
    choices: [
      { label: L("Date someone else in finance", "跟同樣做金融的人約會"), sub: L("Power couple", "強強聯手"), run() { s.flags.partner = true; s.network += 6; s.sanity -= 3; return L("Your dates are booked in 30-minute blocks with a hard stop. It's romantic, in a way.", "你們的約會以 30 分鐘為單位，準時結束。某程度上也算浪漫。"); } },
      { label: L("Date a schoolteacher", "跟老師約會"), sub: L("Grounded", "腳踏實地"), run() { s.flags.partner = true; s.sanity += 10; return L("They think your job sounds made up. Honestly, fair.", "對方覺得你的工作聽起來像虛構的。說實話，很公道。"); } },
      { label: L("Married to the job", "嫁了給工作"), sub: L("Grind", "拼搏"), run() { s.hustle += 6; s.sanity -= 8; s.used.delete("dating"); return L("Your longest relationship is with your Bloomberg terminal.", "你最長久的關係是跟你的彭博終端機。"); } },
    ],
  })),
  ev("wedding", [26, 40], () => s.flags.partner && !s.flags.married, () => ({
    title: L("Wedding bells", "婚禮的鐘聲"),
    text: L(`You're getting married! Your partner's family wants a "small" wedding for 400 people.`,
      "你要結婚了！伴侶的家人想辦一個 400 人的「小型」婚禮。"),
    choices: [
      {
        label: L("The big Hamptons wedding", "在 Hamptons 大排場"), sub: UI.costs(150000 * sc()),
        run() {
          s.flags.married = true; s.cash -= 150000 * sc(); s.network += 12;
          const wrong = wrongName();
          return L(`Your MD gives a toast to "${wrong} and family." Your name is ${nm()}.`, `你的 MD 舉杯祝賀「${wrong}一家」。你的名字是 ${nm()}。`);
        },
      },
      { label: L("Courthouse and a nice dinner", "註冊加一頓好飯"), sub: L("Cheap and cheerful", "經濟又開心"), run() { s.flags.married = true; s.cash -= 2000; s.sanity += 8; return L("Best day of your life, and the only project you've ever brought in under budget.", "人生最美好的一天，也是你唯一一個沒有超支的項目。"); } },
      { label: L("Negotiate a prenup first", "先談婚前協議"), sub: L("Always hedge", "永遠要對沖"), run() { s.flags.married = true; s.flags.prenup = true; s.sanity -= 6; s.cash -= 20000; return L("You marked up the prenup in tracked changes. Your partner said yes anyway. True love.", "你用追蹤修訂批改婚前協議。伴侶還是答應了。這是真愛。"); } },
    ],
  })),
  ev("kids", [29, 41], () => s.flags.married && !s.flags.kid, () => ({
    title: L(`"Should we have kids?"`, "「我們要生小孩嗎？」"),
    text: L("Your partner asks over dinner. You instinctively start building a cost model in your head.",
      "伴侶在晚飯時問你。你本能地在腦中建立成本模型。"),
    choices: [
      { label: L("Yes", "要"), sub: L("The best long-term investment", "最好的長線投資"), run() { s.flags.kid = true; s.income -= 20000 * sc(); s.sanity += 6; s.hustle -= 4; return L("You're a parent! Sleep is now a theoretical concept, which, to be fair, it already was.", "你做父母了！睡眠現在是一個理論概念，不過公平地說，它本來就是。"); } },
      { label: L("Not yet", "遲些再說"), sub: L("Q3, maybe", "或者第三季"), run() { s.hustle += 3; s.used.delete("kids"); return L(`You agree to "revisit it next quarter." Your partner did not love that phrasing.`, "你們同意「下一季再檢討」。伴侶不太喜歡這個說法。"); } },
    ],
  })),
  ev("privschool", [33, 50], () => s.flags.kid, () => ({
    title: L("Kindergarten admissions", "幼稚園入學"),
    text: L(`The private school costs ${fmt(60000 * sc())} a year. For kindergarten. There's an interview. For a four-year-old.`,
      `私立學校每年 ${fmt(60000 * sc())}。是幼稚園。要面試，面試一個四歲小孩。`),
    choices: [
      { label: L("Private school", "私立學校"), sub: L("The pipeline starts early", "輸送帶要從小開始"), run() { s.income -= 60000 * sc(); s.network += 8; return L("Your kid's classmates' parents are all MDs. School pick-up is your new networking event.", "孩子同學的家長全是 MD。接放學成了你新的社交活動。"); } },
      { label: L("Public school", "公立學校"), sub: L("Character-building", "磨練性格"), run() { s.sanity += 4; return L("Your kid is thriving. Your colleagues act like you're raising them in the woods.", "孩子茁壯成長。同事卻當你在森林裡養孩子。"); } },
    ],
  })),
  ev("divorce", [32, 64], () => s.flags.married && !s.flags.prenup && s.sanity < 40, () => ({
    title: L(`"We need to talk"`, "「我們需要談談」"),
    text: L(`Your partner says you've been "emotionally unavailable since 2019." You were on a call when they said it.`,
      "伴侶說你「自 2019 年起就情感缺席」。對方說這句話時，你正在開電話會議。"),
    passive: true,
    run() {
      const l = Math.max(0, Math.round(s.cash / 2));
      s.cash -= l; s.flags.married = false; s.flags.partner = false; s.sanity -= 10;
      return L(`No prenup. Half your net worth, ${fmt(l)}, walks out the door. You finally understand hedging.`, `沒有婚前協議。你一半身家，即 ${fmt(l)}，就這樣走出了門口。你終於明白甚麼叫對沖。`);
    },
  })),
  ev("parents", [25, 64], () => s.tier <= 2, () => ({
    title: L("Your parents call", "爸媽來電"),
    text: L("The roof is leaking, and so is the car. They don't want to ask, but they're asking.",
      "屋頂漏水，車也漏油。他們不想開口，但還是開口了。"),
    choices: [
      {
        label: L("Send them money", "匯錢給他們"), sub: L("Family first", "家人優先"), run() {
          const g = Math.round(Math.min(Math.max(0, s.cash) * 0.2, 40000 * sc()) + 2000);
          s.cash -= g; s.sanity += 12;
          return L(`You send ${fmt(g)}. Your mom tells the whole neighborhood. You're a legend back home.`, `你匯了 ${fmt(g)}。媽媽告訴了整條街的街坊。你在家鄉成了傳奇。`);
        },
      },
      { label: L("Teach them to invest instead", "改為教他們投資"), sub: L("Give a man a fish…", "授人以魚不如授人以漁……"), run() { s.sanity -= 4; return L("You explain index funds for an hour. Your dad buys a timeshare.", "你講解了一小時指數基金。爸爸買了一個分時度假屋。"); } },
      { label: L(`"My money's all tied up right now"`, "「我的錢暫時全部套住了」"), sub: L("Technically true", "技術上是真的"), run() { s.sanity -= 15; return L("You wear your Rolex to the next family dinner. It's a mistake.", "你戴著勞力士出席下一次家庭飯局。這是個錯誤。"); } },
    ],
  })),
  ev("house", [27, 42], () => s.cash > 150000 && !s.flags.house, () => ({
    title: L("Rent or buy?", "租樓還是買樓？"),
    text: L(`Your landlord raised the rent again. Everyone says real estate "only goes up."`,
      "業主又加租了。人人都說樓價「只會升」。"),
    choices: [
      { label: L("Buy a home", "買樓自住"), sub: L("Put down roots", "落地生根"), run() { s.flags.house = true; s.income -= 8000 * sc(); s.sanity += 8; return L("You're a homeowner! Every weekend is now spent at the hardware store.", "你成為業主了！從此每個週末都在五金舖度過。"); } },
      {
        label: L("Buy rental properties", "買樓收租"), sub: L("Landlord era", "業主時代"), run() {
          s.flags.house = true;
          if (chance(0.6)) { s.income += 15000 * sc(); return L(`Passive income! You now say "cash flow" in casual conversation.`, "被動收入！你現在閒聊時也會說「現金流」。"); }
          s.cash -= 60000 * sc(); s.sanity -= 10;
          return L("Your tenant stopped paying and started a mushroom farm in the basement.", "你的租客不再交租，還在地庫開了一個蘑菇農場。");
        },
      },
      { label: L("Keep renting, invest the rest", "繼續租，剩下的錢拿去投資"), sub: L("The spreadsheet says so", "試算表是這樣說的"), run() { s.cash += Math.max(0, s.cash) * 0.05; return L(`Your spreadsheet says renting is optimal. Your parents say you're "throwing money away." You're both a bit right.`, "你的試算表說租樓最理想。爸媽說你在「把錢掉進海」。你們都有點道理。"); } },
    ],
  })),
  ev("tax", [24, 64], () => s.cash > 100000, () => ({
    title: L("Tax season", "報稅季節"),
    text: L(`Your accountant asks how "creative" you'd like to be this year.`, "你的會計師問你今年想有多「創意」。"),
    choices: [
      { label: L("Very creative", "非常有創意"), sub: L("Offshore entities", "離岸公司"), run() { s.heat += 20; s.cash += Math.round(s.cash * 0.05); return L("You now own a shell company in the Cayman Islands. You've never been to the Cayman Islands.", "你現在擁有一間開曼群島的空殼公司。你從未去過開曼群島。"); } },
      { label: L("Normal deductions", "正常扣稅"), sub: L("Boring is safe", "悶即是安全"), run() { return L("You pay your taxes like a regular person. The roads are nice.", "你像普通人一樣交稅。馬路很平坦。"); } },
      { label: L("Do it yourself with free software", "用免費軟件自己報"), sub: L("Save $500", "慳 $500"), run() { s.sanity -= 8; s.cash += 500; return L("You save $500 and lose a weekend. A letter from the tax office arrives six months later.", "你慳了 $500，失去了一個週末。六個月後稅局來信了。"); } },
    ],
  })),
  ev("burnwarn", [22, 64], () => s.sanity < 35, () => ({
    title: L("Warning signs", "警號"),
    text: L("You cried in the bathroom between two calls. Then you went back to the second call and crushed it.",
      "你在兩個電話會議之間躲在洗手間哭。然後你回去，把第二個會議處理得非常出色。"),
    choices: [
      { label: L("Take a real vacation", "放一個真正的假"), sub: L("No laptop", "不帶電腦"), run() { s.sanity += 22; s.network -= 4; return L("Two weeks in Portugal. You check your email only 40 times.", "在葡萄牙兩星期。你只查了 40 次電郵。"); } },
      { label: L("Push through", "咬緊牙關撐下去"), sub: L("Sleep when you're dead", "死了才睡"), run() { s.hustle += 6; s.sanity -= 10; return L("You feel fine. You feel fine. You feel fine.", "你覺得很好。你覺得很好。你覺得很好。"); } },
      { label: L("Start therapy", "開始心理治療"), sub: L("Finally", "終於"), run() { s.cash -= Math.round(8000 * sc()); s.sanity += 16; return L(`Your therapist says "that sounds really hard." Nobody has ever said that to you before.`, "治療師說：「聽起來真的很辛苦。」從來沒有人對你說過這句話。"); } },
    ],
  })),
  ev("health", [33, 64], null, () => ({
    title: L("Annual physical", "年度身體檢查"),
    text: L(`Your doctor looks at your bloodwork and says your cortisol "looks like a stock chart."`,
      "醫生看著你的驗血報告，說你的皮質醇「看起來像一張股票圖」。"),
    choices: [
      { label: L("Wellness retreat", "身心靈靜修營"), sub: L("Silence and kale", "沉默與羽衣甘藍"), run() { s.cash -= Math.round(20000 * sc()); s.sanity += 18; return L("Seven days of silence. You have your best investment idea on day four and can't write it down.", "七天不准說話。你在第四天想到人生最好的投資點子，卻不能寫下來。"); } },
      { label: L("Hire a longevity coach", "聘請長壽教練"), sub: L("Optimize", "優化"), run() { s.cash -= Math.round(10000 * sc()); s.hustle += 6; s.sanity += 6; return L("You take 41 supplements a day. You rattle when you walk.", "你每天吃 41 粒補充劑。走路時會沙沙作響。"); } },
      { label: L("Ignore it", "不理它"), sub: L("Doctors are conservative", "醫生都很保守"), run() { s.sanity -= 10; return L("You're fine. Probably.", "你沒事的。大概吧。"); } },
    ],
  })),
  ev("midlife", [38, 55], null, () => ({
    title: L("Midlife crisis", "中年危機"),
    text: L("You wake up and realize you've spent 20 years making rich people slightly richer.",
      "你一覺醒來，發現自己花了 20 年讓有錢人再有錢一點點。"),
    choices: [
      { label: L("Buy a Porsche", "買一架保時捷"), sub: L("Classic", "經典之選"), run() { s.cash -= Math.round(180000 * sc()); s.sanity += 10; return L("You drive it to work and park it next to three identical Porsches.", "你揸它返工，泊在三架一模一樣的保時捷旁邊。"); } },
      { label: L("Become a weekend DJ", "週末做 DJ"), sub: L("Reinvention", "重新做人"), run() { s.cash -= 8000; s.sanity += 12; s.network -= 4; return L("Your rooftop-bar set is mostly Calvin Harris. Your colleagues come out of pity.", "你在天台酒吧打碟，播的大多是 Calvin Harris。同事出於同情來捧場。"); } },
      { label: L("Write a book about leadership", "寫一本領導力書籍"), sub: L("Thought leadership", "思想領袖"), run() { s.network += 10; s.hustle += 4; return L(`"Grit, Grind, Gratitude" sells 400 copies, 380 of them bought by your firm.`, "《堅毅、拼搏、感恩》賣出 400 本，其中 380 本是你公司買的。"); } },
    ],
  })),
  ev("reunion", [30, 40], null, () => ({
    title: L("High school reunion", "中學同學會"),
    text: L("Fifteen years later. Everyone's asking what everyone else does.", "十五年後，大家都在問大家做甚麼工作。"),
    choices: [
      { label: L("Flex", "炫耀"), sub: L("Tell everyone your number", "告訴大家你的身家"), run() { s.network -= 4; s.sanity += 4; return L(`You mention your net worth three times. Someone says you've "really changed."`, "你提了三次自己的身家。有人說你「真的變了」。"); } },
      { label: L("Be humble", "保持謙虛"), sub: L(`"I work in finance"`, "「我做金融的」"), run() { s.sanity += 6; return L("Your old lab partner runs a bakery now. She seems happier than anyone you know.", "你以前的實驗室拍檔現在開麵包店。她看起來比你認識的任何人都快樂。"); } },
      { label: L("Pitch everyone on your investment ideas", "向每個人推銷你的投資點子"), sub: L("Always be closing", "永遠在成交"), run() { s.network += 6; s.sanity -= 3; return L("Two classmates give you money to manage. You're not invited to the next reunion.", "兩個同學把錢交給你管理。下次同學會沒有邀請你。"); } },
    ],
  })),
  ev("gala", [32, 64], () => s.cash > 2e6, () => ({
    title: L("The charity gala", "慈善晚宴"),
    text: L("$5,000 a plate. There's a silent auction for a weekend with a famous investor.",
      "每位 $5,000。有一個無聲拍賣，拍品是跟一位著名投資者共度週末。"),
    choices: [
      {
        label: L("Make a big donation", "大手捐款"), sub: L("Get your name on a plaque", "名字刻上牌匾"),
        run() { const d = Math.round(s.cash * 0.03); s.cash -= d; s.network += 15; s.sanity += 6; return L(`You donate ${fmt(d)}. There's a plaque. You visit it more often than you'd admit.`, `你捐了 ${fmt(d)}。有一塊牌匾，你去看它的次數比你願意承認的多。`); },
      },
      { label: L("Network hard, donate little", "拼命結識人，少少捐款"), sub: L("Efficient", "高效率"), run() { s.cash -= 5000; s.network += 8; return L("You leave with 14 business cards and a tote bag.", "你帶著 14 張卡片和一個環保袋離開。"); } },
    ],
  })),
  ev("angel", [30, 64], () => s.cash > 1e6, () => ({
    title: L("Angel investing", "天使投資"),
    text: L("Founders keep asking you for checks. You're starting to feel like a VC.", "創辦人不停找你開支票。你開始覺得自己是創投了。"),
    choices: [
      {
        label: L("Write ten $50k checks", "開十張 $50k 支票"), sub: L("Spray and pray", "亂槍打鳥"), run() {
          s.cash -= 500000;
          if (chance(0.2)) { const g = Math.round(rnd(3e6, 2e7)); s.cash += g; return L(`One of them becomes a unicorn! ${fmt(g)} back. You start appearing on podcasts.`, `其中一間成了獨角獸！回報 ${fmt(g)}。你開始上 Podcast。`); }
          s.cash += 150000;
          return L("Nine fail. One returns a bit of your money. Classic venture math.", "九間失敗，一間還回少許本金。典型的創投數學。");
        },
      },
      { label: L("Stick to public markets", "堅持投資上市公司"), sub: L("Liquidity is nice", "流動性很好"), run() { return L("You keep your money. You miss one unicorn. You'll hear about it forever.", "你保住了錢，錯過了一隻獨角獸。這件事你會聽一輩子。"); } },
    ],
  })),
  ev("twitterfight", [26, 64], null, () => ({
    title: L("A fight on social media", "社交媒體罵戰"),
    text: L("A famous hedge fund manager posts a take you think is wrong. Your thumbs are already moving.",
      "一位著名對沖基金經理發表了一個你認為錯誤的觀點。你的手指已經在動。"),
    choices: [
      {
        label: L("Quote it with a devastating chart", "附上一張致命圖表回應"), sub: L("Go viral", "爆紅"), run() {
          if (chance(0.5)) { s.network += 12; return L("It goes viral. He blocks you. You put it in your bio.", "帖文爆紅。他封鎖了你。你把這件事寫進簡介。"); }
          s.network -= 8; s.sanity -= 6;
          return L("Your chart had a typo. It goes viral, just not the way you wanted.", "你的圖表有錯字。帖文爆紅了，只是不是你想要的那種。");
        },
      },
      { label: L("Close the app", "關掉 app"), sub: L("Inner peace", "內心平靜"), run() { s.sanity += 6; return L("You touch grass instead. The grass has no opinions on interest rates.", "你去摸摸草地。草地對息率沒有任何意見。"); } },
    ],
  })),
  ev("intern", [28, 64], null, () => ({
    title: L("The new intern", "新來的實習生"),
    text: L("A Gen Z intern says he learned everything about finance from 30-second videos. He's up 300% this year.",
      "一個 Z 世代實習生說他的金融知識全部來自 30 秒短片。他今年賺了 300%。"),
    passive: true,
    run() { s.sanity -= 4; s.hustle += 3; return L("You spend the evening wondering whether you got into finance too early or too late. The answer is yes.", "你整晚在想自己入行是太早還是太遲。答案是：都是。"); },
  })),
  ev("phonedies", [22, 64], null, () => ({
    title: L("Your phone dies", "你的手機沒電了"),
    text: L("It happens during the biggest market move of the year, on a plane with no Wi-Fi.", "偏偏在今年最大的市場波動時，你在一班沒有 Wi-Fi 的飛機上。"),
    passive: true,
    run() {
      if (chance(0.5)) { s.cash += Math.max(0, s.cash) * 0.08; return L("You land and discover the market went your way. Being unreachable was your best trade of the year.", "落機後你發現市場走勢對你有利。聯絡不上你，是你今年最好的交易。"); }
      s.cash -= Math.max(0, s.cash) * 0.06; s.sanity -= 6;
      return L("You land to 214 missed messages and a smaller portfolio.", "落機後你看到 214 個未讀訊息，和一個縮水了的投資組合。");
    },
  })),

  // ---- personality ----
  ev("allin", [23, 64], () => s.type === "aggressive" && s.cash > 0, () => ({
    title: L("Your gut says: all in", "你的直覺說：全押"),
    text: L("You see a once-in-a-decade setup. Every instinct you've had since the bookshelf is screaming.",
      "你看到一個十年一遇的機會。自從爬書架那天起的每一個本能都在尖叫。"),
    choices: [
      {
        label: L("Bet everything", "押上一切"), sub: L("Fortune favors the bold", "幸運眷顧勇者"), run() {
          const b = Math.max(0, s.cash);
          if (chance(0.45)) { s.cash += b; return L(`It hits. You double your money, +${fmt(b)}. You'll tell this story for the rest of your life.`, `中了。你的錢翻倍，+${fmt(b)}。這個故事你會講一輩子。`); }
          s.cash -= b * 0.6; s.sanity -= 12;
          return L(`It misses. You lose ${fmt(b * 0.6)}. You'll never tell anyone this story.`, `落空了。你蝕了 ${fmt(b * 0.6)}。這個故事你永遠不會告訴任何人。`);
        },
      },
      {
        label: L("Bet a quarter of it", "押四分之一"), sub: L("Bold, but not insane", "大膽但不瘋狂"), run() {
          const b = Math.max(0, s.cash) * 0.25;
          if (chance(0.45)) { s.cash += b; return L(`It hits. +${fmt(b)}. You wish you'd bet more.`, `中了。+${fmt(b)}。你後悔沒有押多一點。`); }
          s.cash -= b * 0.6;
          return L(`It misses. -${fmt(b * 0.6)}. You're relieved you didn't bet more.`, `落空了。-${fmt(b * 0.6)}。你慶幸沒有押更多。`);
        },
      },
      { label: L("Walk away", "轉身離開"), sub: L("Out of character", "不像你的作風"), run() { s.sanity -= 6; return L("You walk away. It goes up 300% without you. You were right, and that's worse.", "你走開了。它在沒有你的情況下升了 300%。你看對了，這更難受。"); } },
    ],
  })),
  ev("poker", [24, 64], () => s.type === "aggressive", () => ({
    title: L("Poker night with the big shots", "跟大人物的撲克之夜"),
    text: L("The buy-in is more than your first car. You're holding a seven and a two. Everyone is watching you.",
      "入場費比你第一架車還貴。你手上是一張 7 和一張 2。所有人都在看著你。"),
    choices: [
      {
        label: L("Go all-in on a bluff", "全押詐唬"), sub: L("Pure nerve", "純靠膽量"), run() {
          const pot = Math.round(50000 * sc());
          if (chance(0.45)) { s.cash += pot; s.network += 10; return L(`Everyone folds. You win ${fmt(pot)} and become a legend at the firm.`, `所有人都棄牌。你贏了 ${fmt(pot)}，成為公司的傳奇。`); }
          s.cash -= pot; s.network += 3;
          return L(`Called. You lose ${fmt(pot)}. Weirdly, they respect you more.`, `被跟注了。你輸了 ${fmt(pot)}。奇怪的是，他們反而更尊重你。`);
        },
      },
      { label: L("Fold and enjoy the cigars", "棄牌，享受雪茄"), sub: L("Save it for the market", "留力給市場"), run() { s.network += 4; return L("You fold, eat everyone's snacks, and quietly learn who bluffs.", "你棄牌，吃光大家的小食，默默記下誰在詐唬。"); } },
    ],
  })),
  ev("ultimatum", [25, 42], () => s.type === "aggressive" && isCareer(), () => ({
    title: L("The ultimatum", "最後通牒"),
    text: L("You know what you're worth. You're about to walk into your boss's office and say it.",
      "你知道自己值多少。你準備走進老闆的房間，直接說出來。"),
    choices: [
      {
        label: L(`"50% raise, or I walk"`, "「加薪五成，否則我走」"), sub: L("Maximum leverage", "最大槓桿"), run() {
          if (chance(0.4)) { s.income *= 1.5; return L("They pay it. You walk out feeling seven feet tall.", "他們答應了。你走出房間時覺得自己有七呎高。"); }
          s.income *= 0.7; s.sanity -= 10;
          return L("They hold the door open for you. Your next job pays less.", "他們替你打開了門。你下一份工作人工更低。");
        },
      },
      { label: L("Ask for 10% like a normal person", "像正常人一樣要求加一成"), sub: L("Unusual for you", "這不像你"), run() { s.income *= 1.1; return L("You get it. It feels small, but it's yours.", "你拿到了。感覺很少，但那是你的。"); } },
    ],
  })),
  ev("hysa", [20, 64], () => s.type === "passive", () => ({
    title: L("The high-yield savings account", "高息儲蓄戶口"),
    text: L("You move your emergency fund into a savings account paying 4.5%. It's the most excited you've been all year.",
      "你把緊急備用金轉到一個年息 4.5% 的戶口。這是你今年最興奮的一刻。"),
    passive: true,
    run() { s.cash += Math.max(0, s.cash) * 0.02; s.sanity += 5; return L("You make a spreadsheet to track the interest. It goes up a little every month. Bliss.", "你做了一個試算表追蹤利息。它每個月升一點點。幸福。"); },
  })),
  ev("fomo", [22, 40], () => s.type === "passive", () => ({
    title: L("Everyone's getting rich but you", "除了你，人人都發財了"),
    text: L("Your friends are making fortunes on the hot new thing. Your index fund made 7% this year.",
      "朋友們靠最新的熱潮發了大財。你的指數基金今年賺了 7%。"),
    choices: [
      { label: L("Stay the course", "堅守路線"), sub: L("Slow and steady", "慢慢來，比較快"), run() { s.sanity += 6; return L("The hot new thing crashes 70% the next year. You say nothing at brunch. You think it very loudly.", "那個熱潮第二年暴跌七成。早午餐時你一言不發，但心裡想得很大聲。"); } },
      {
        label: L("Dip a toe in, 5% of your money", "試試水溫，投入 5%"), sub: L("A small treat", "小小獎勵自己"), run() {
          const b = Math.max(0, s.cash) * 0.05;
          if (chance(0.5)) { s.cash += b; return L(`It doubles. +${fmt(b)}. You immediately sell and feel sick with excitement.`, `它翻倍了。+${fmt(b)}。你立即賣出，興奮得想吐。`); }
          s.cash -= b * 0.7;
          return L(`It drops 70%. -${fmt(b * 0.7)}. Lesson learned. Back to the index fund.`, `它跌了七成。-${fmt(b * 0.7)}。學到教訓，回到指數基金。`);
        },
      },
      {
        label: L("Go against your nature: all in", "違背本性：全押"), sub: L("Who even are you", "你到底是誰"), run() {
          const b = Math.max(0, s.cash) * 0.5; s.sanity -= 10;
          if (chance(0.4)) { s.cash += b * 2; return L(`It moons. +${fmt(b * 2)}. You can't sleep anyway.`, `一飛沖天。+${fmt(b * 2)}。但你還是睡不著。`); }
          s.cash -= b * 0.7;
          return L(`It crashes. -${fmt(b * 0.7)}. Your turtle instincts were right all along.`, `它崩盤了。-${fmt(b * 0.7)}。你的烏龜本能一直都是對的。`);
        },
      },
    ],
  })),
  ev("emergency", [25, 64], () => s.type === "passive", () => ({
    title: L("The worst week", "最慘的一星期"),
    text: L("Your car breaks down and your apartment floods in the same week.", "同一個星期，你的車壞了，家裡又水浸。"),
    passive: true,
    run() { s.sanity += 8; return L("Your six-month emergency fund covers all of it. You've never felt so smug about anything.", "你六個月的緊急備用金全部應付得到。你從未對任何事如此得意。"); },
  })),
  ev("rebalance", [25, 64], () => s.type === "balanced", () => ({
    title: L("Rebalancing day", "再平衡日"),
    text: L("Once a year, you trim your winners and top up your losers, exactly like the textbook says.",
      "每年一次，你減持贏家、增持輸家，完全照教科書做。"),
    passive: true,
    run() { s.cash += Math.max(0, s.cash) * 0.03; s.hustle += 2; return L("It's boring, disciplined and quietly profitable. That's your whole brand.", "沉悶、有紀律、默默賺錢。這就是你的個人品牌。"); },
  })),
  ev("hedge", [26, 39], () => s.type === "balanced" && s.cash > 0, () => ({
    title: L("Buy some insurance?", "買點保險？"),
    text: L("Markets have been calm for a long time. You know that's exactly when you should worry.",
      "市場已經平靜了很久。你知道這正是應該擔心的時候。"),
    choices: [
      { label: L("Buy a hedge against a crash", "買入對沖股災的保護"), sub: L("Costs 2% of your money", "花費你 2% 的錢"), run() { s.cash -= s.cash * 0.02; s.flags.hedged = true; return L("You buy protection you hope you'll never need. If a crash comes, it'll hurt half as much.", "你買了一份希望永遠用不上的保護。如果股災來臨，痛楚會減半。"); } },
      { label: L("Skip it", "不買"), sub: L("Save the money", "慳回這筆錢"), run() { return L("You save the 2%. Fingers crossed.", "你慳了 2%。祈求好運吧。"); } },
    ],
  })),

  // ---- shaped by where you were born and how rich you are ----
  ev("dollarize", [18, 40], () => HIGH_INFLATION.has(s.c.iso) && !s.city && !s.flags.dollarized && !s.flags.gold, () => ({
    title: L("Prices change every week", "物價每星期都在變"),
    text: L(`Inflation in ${s.c.name.en} is soaring again. At the market, prices are higher every time you go. Everyone is talking about protecting their savings.`,
      `${s.c.name.zh}的通脹又再飆升。每次去街市，價錢都比上次高。人人都在討論如何保住積蓄。`),
    choices: [
      { label: L("Move your savings into US dollars", "把積蓄換成美元"), sub: L("Stops your savings shrinking", "令積蓄不再縮水"), run() { s.flags.dollarized = true; s.sanity += 4; return L("Your savings now hold their value. Your uncle calls you unpatriotic, then asks how you did it.", "你的積蓄現在保值了。舅舅說你不愛國，然後問你是怎樣做到的。"); } },
      { label: L("Buy gold", "買黃金"), sub: L("Halves the damage", "損失減半"), run() { s.flags.gold = true; s.cash -= Math.max(0, s.cash) * 0.01; return L("You keep a small gold bar hidden in a shoebox, exactly like your grandmother did.", "你把一小塊金條藏在鞋盒裡，跟你嫲嫲當年一模一樣。"); } },
      { label: L("Keep it in the local bank", "繼續存在本地銀行"), sub: L("Trust the system", "相信制度"), run() { s.sanity += 2; return L("You trust the central bank. The central bank does not return the favor.", "你信任央行，央行卻沒有以同樣方式回報你。"); } },
    ],
  })),
  ev("remit", [23, 64], () => s.city && s.c.g <= 2 && isCareer(), () => ({
    title: L("Family back home", "家鄉的家人"),
    text: L(`You earn more in ${s.city.en} in a month than your parents did in a year back home. The family group chat has noticed.`,
      `你在${s.city.zh}一個月賺的錢，比爸媽在家鄉一年賺的還多。家族群組已經注意到了。`),
    choices: [
      { label: L("Send home a fifth of your pay every month", "每月把五分之一人工寄回家"), sub: L("Family first", "家人優先"), run() { s.income *= 0.8; s.sanity += 12; s.network += 3; return L("Your parents fix the roof and pay off their debts. Your mother frames your payslip.", "爸媽修好了屋頂，還清了債務。媽媽把你的糧單裱了起來。"); } },
      { label: L("Send whatever is left over", "有剩就寄"), sub: L("Middle ground", "折衷"), run() { s.income *= 0.93; s.sanity += 4; return L("Some months there's a lot left over. Some months there isn't. Your parents never complain.", "有些月份剩很多，有些月份沒有。爸媽從不抱怨。"); } },
      { label: L(`"Not right now"`, "「暫時不行」"), sub: L("Your money, your call", "你的錢，你決定"), run() { s.sanity -= 12; return L("Nobody says anything. That's worse.", "沒有人說甚麼。這更難受。"); } },
    ],
  })),
  ev("familyoffice", [25, 40], () => s.tier >= 4 && isCareer() && s.job !== JOBS.familyOffice, () => ({
    title: L("Dad wants you to run the family money", "爸爸想你打理家族財富"),
    text: L("Your father is stepping back. He wants you to take over the family office that manages the family's wealth.",
      "爸爸打算退下來，想你接手管理家族財富的家族辦公室。"),
    choices: [
      { label: L("Take over the family office", "接手家族辦公室"), sub: L("Keep it in the family", "肥水不流別人田"), run() { setJob(JOBS.familyOffice, "elite", Math.max(s.income, 250000)); s.network += 15; s.sanity += 5; return L("Family dinners are now quarterly reviews. Your cousin is suddenly very nice to you.", "家庭晚飯現在變成季度檢討。表哥突然對你非常好。"); } },
      { label: L("Stay in your own career", "繼續自己的事業"), sub: L("Make it on your own", "靠自己闖"), run() { s.network -= 5; s.hustle += 6; return L(`Your father starts introducing your cousin as "the successor." You tell yourself you don't mind.`, "爸爸開始介紹表哥為「接班人」。你告訴自己你不介意。"); } },
    ],
  })),
  ev("yacht", [30, 64], () => s.cash > 5e7, () => {
    const cost = Math.round(s.cash * 0.08);
    return {
      title: L("The superyacht", "超級遊艇"),
      text: L("A broker sends you a brochure for a 60-meter yacht. It has a helipad, a cinema and a crew of 18.", "一個經紀寄來一份 60 米遊艇的小冊子。它有直升機坪、私人影院和 18 名船員。"),
      choices: [
        { label: L("Buy it", "買下它"), sub: UI.costs(cost), run() { s.cash -= cost; s.income -= cost * 0.1; s.network += 20; s.sanity += 6; return L("It costs a tenth of its price every year to run. You use it eleven days a year. It's wonderful.", "每年的營運費是售價的十分之一，而你一年只用十一天。感覺非常美妙。"); } },
        { label: L("Buy it and rent it out", "買下並出租"), sub: L("Make it pay for itself", "讓它自負盈虧"), run() { s.cash -= cost; s.network += 10; if (chance(0.5)) { s.income += cost * 0.05; return L("Tech founders rent it all summer. It almost pays for itself.", "科技公司創辦人整個夏天都租用它。幾乎可以自負盈虧。"); } return L("A guest throws a party and the yacht needs a new interior. Insurance covers some of it.", "一位租客開派對，遊艇的內部需要重新裝修。保險只賠了一部分。"); } },
        { label: L("Buy a nice rowing boat instead", "改買一隻好看的划艇"), sub: L("Humble", "謙虛"), run() { s.sanity += 8; s.hustle += 3; return L("You row across the lake every Sunday. Your heart rate has never been better.", "你每個星期日都划艇橫越湖面。你的心跳從未如此健康。"); } },
      ],
    };
  }),
  ev("visalottery", [22, 32], () => s.c.hub <= 1 && !s.city && isCareer(), () => ({
    title: L("A work-visa lottery", "工作簽證抽籤"),
    text: L("A country with a big finance industry opens a lottery for skilled work visas. Thousands apply for every place.",
      "一個金融業發達的國家開放技術工作簽證抽籤，每個名額都有數以千計的人申請。"),
    choices: [
      {
        label: L("Enter and get ready to move", "參加，並準備搬家"), sub: L("About a 1 in 3 chance", "大約三分之一機會"), run() {
          if (Math.random() < 0.33) { const move = moveToHub(); s.income *= 1.6; s.network += 8; s.sanity -= 4; return cat(L("You won a visa! ", "你抽中了簽證！"), move, L("Your pay jumps 60%, and your savings stop losing value.", "你的人工跳升六成，積蓄也不再貶值。")); }
          s.sanity -= 5; return L("Not this year. You refresh the results page eleven times to be sure.", "今年落空了。你刷新了結果頁面十一次確認。");
        },
      },
      { label: L("Stay where your people are", "留在親友身邊"), sub: L("Home is home", "家始終是家"), run() { s.sanity += 6; s.network += 4; return L("You stay. Your network at home keeps growing.", "你留了下來。你在家鄉的人脈不斷擴大。"); } },
    ],
  })),
];

// countries where high inflation has recently eaten into people's savings
const HIGH_INFLATION = new Set(["ARG", "TUR", "NGA", "IRN", "EGY", "PAK", "ETH"]);

const QUIET_YEAR = {
  build: () => ({
    title: L("A quiet year", "平靜的一年"),
    text: L("You work. You save. Nothing dramatic happens, which in finance counts as a win.", "你工作，你儲錢。沒有甚麼大事發生，這在金融界已算是勝利。"),
    passive: true,
    run() { s.hustle += 2; return ""; },
  }),
};

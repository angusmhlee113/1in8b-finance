// ---------- a wider pool of random events across every stage of life ----------

const LUNAR_NEW_YEAR = new Set(["CHN", "HKG", "SGP", "VNM", "KOR"]);
const MUSLIM_MAJORITY = new Set(["PAK", "IDN", "BGD", "EGY", "SAU", "ARE", "TUR", "IRN"]);

EVENTS.push(
  // ---- teens ----
  ev("examleak", [15, 17], null, () => ({
    title: L("The leaked exam", "洩露的試卷"),
    text: L("Someone is selling next week's maths exam answers in the school group chat.", "有人在學校群組裡出售下星期數學考試的答案。"),
    choices: [
      { crowd: true, label: L("Buy the answers", "買答案"), sub: L("A shortcut", "捷徑"), run() { s.cash -= 50; s.heat += 5; if (chance(0.5)) { s.hustle -= 3; return L("They were real. You get full marks and learn nothing.", "答案是真的。你拿了滿分，甚麼也沒學到。"); } s.sanity -= 6; return L("They were fake. You fail, and you're out $50.", "答案是假的。你不合格，還蝕了 $50。"); } },
      { label: L("Study properly", "認真溫習"), sub: L("The long way", "走遠路"), run() { s.hustle += 6; return L("You get a B+. It's all yours.", "你拿了 B+，全靠自己。"); } },
      { label: L("Report it to a teacher", "向老師舉報"), sub: L("Snitch or hero", "告密者還是英雄"), run() { s.network -= 4; s.sanity += 3; return L("The exam is rewritten. Half the class hates you. The other half is quietly relieved.", "試卷重新出過。半班同學恨你，另一半暗自鬆了口氣。"); } },
    ],
  })),
  ev("schooltrip", [15, 17], null, () => ({
    title: L("The school trip abroad", "海外遊學團"),
    text: L(`The school is organizing a trip abroad. It costs ${fmt(1500 * sc())}. Most of your friends are going.`, `學校舉辦海外遊學團，費用 ${fmt(1500 * sc())}。大部分朋友都會去。`),
    choices: [
      { label: L("Go on the trip", "參加"), sub: L("See the world", "看看世界"), run() { s.cash -= Math.round(1500 * sc()); s.sanity += 8; s.network += 4; return L("You see a stock exchange for the first time. You stand on the trading floor balcony for an hour.", "你第一次看到證券交易所，在交易大堂的露台站了一個小時。"); } },
      { label: L("Work all week instead", "改為整個星期打工"), sub: L("Earn, don't spend", "賺錢而不是花錢"), run() { s.cash += Math.round(400 * sc()); s.hustle += 5; s.sanity -= 3; return L("Your friends post photos. You post a bank balance.", "朋友們發照片，你發銀行結餘。"); } },
    ],
  })),

  // ---- university ----
  ev("tutoring", [18, 21], () => s.school !== "none", () => ({
    title: L("A tutoring business", "補習生意"),
    text: L("Rich parents in your city pay a fortune for tutors who went to good universities.", "城中有錢的家長願意花大錢請名校出身的補習老師。"),
    choices: [
      { label: L("Start a tutoring business", "開補習生意"), sub: L("Hire your classmates", "請同學做導師"), run() { const g = Math.round(rnd(3000, 12000) * sc()); s.cash += g; s.hustle += 6; s.sanity -= 4; return L(`By graduation you have six tutors working for you and ${fmt(g)} saved.`, `畢業時你手下有六個導師，還儲了 ${fmt(g)}。`); } },
      { label: L("Tutor a few kids yourself", "自己教幾個學生"), sub: L("Steady pocket money", "穩定零用錢"), run() { s.cash += Math.round(2000 * sc()); s.network += 3; return L("One of the parents turns out to be a fund manager. He remembers you.", "其中一位家長原來是基金經理，他記住了你。"); } },
      { label: L("Focus on your own grades", "專注自己的成績"), sub: L("First things first", "先做好本份"), run() { s.hustle += 4; return L("Your grades go up. Your bank account doesn't.", "成績進步了，銀行戶口卻沒有。"); } },
    ],
  })),
  ev("creditcard", [18, 22], null, () => ({
    title: L("Your first credit card", "你的第一張信用卡"),
    text: L("A bank sets up a stall on campus. Free pizza and a credit card with a limit bigger than your annual income.", "一間銀行在校園擺攤，送免費薄餅，信用卡額度比你一年收入還高。"),
    choices: [
      { label: L("Take it and use it", "辦卡並使用"), sub: L("Live a little", "享受一下"), run() { s.cash -= Math.round(4000 * sc()); s.sanity += 5; return L("New phone, new clothes, 24% interest. You learn about compounding from the wrong side.", "新手機、新衣服、24% 利息。你從錯誤的一方學會了複利。"); } },
      { label: L("Take it, pay it off every month", "辦卡，每月還清"), sub: L("Build a credit score", "建立信貸紀錄"), run() { s.hustle += 3; s.network += 2; return L("You never pay a cent of interest. The bank makes nothing from you, which is exactly the point.", "你從未付過一分錢利息。銀行從你身上賺不到錢，這正是重點。"); } },
      { label: L("Just take the pizza", "只拿薄餅"), sub: L("Free lunch", "免費午餐"), run() { s.sanity += 2; return L("There is such a thing as a free lunch. It was pepperoni.", "原來世上真有免費午餐，是辣肉腸味的。"); } },
    ],
  })),
  ev("dropout", [19, 21], () => s.school !== "none", () => ({
    title: L("Drop out and build it", "退學創業"),
    text: L("Your roommate wants you to drop out and co-found his fintech startup. He's very convincing, and very sleep-deprived.", "你的室友想你退學與他合辦金融科技初創。他很有說服力，也非常睡眠不足。"),
    choices: [
      {
        label: L("Drop out and co-found it", "退學一起創業"), sub: L("About 1 in 10 make it", "大約十個有一個成功"), run() {
          s.school = "none"; s.track = "degen"; s.job = JOBS.founder;
          if (chance(0.1)) { const g = Math.round(rnd(2e6, 2e7)); s.cash += g; s.network += 20; return L(`It works. You sell the company at 25 for ${fmt(g)}. Your university asks you to give a talk.`, `成功了。你 25 歲就以 ${fmt(g)} 賣出公司。母校請你回去演講。`); }
          s.cash -= Math.round(5000 * sc()); s.sanity -= 10; return L("It runs out of money in a year. You have no degree, but you know how to write a pitch deck.", "公司一年後燒光資金。你沒有學位，但你懂得寫融資簡報。");
        },
      },
      { label: L("Stay in school, help part-time", "留校，兼職幫手"), sub: L("Hedge", "對沖"), run() { s.network += 5; s.hustle += 4; return L("You do both badly for a year, then pick school.", "你兩邊都做得不好，一年後選擇了學業。"); } },
      { label: L("Wish him luck", "祝他好運"), sub: L("Not your dream", "不是你的夢想"), run() { return L("He wishes you luck too. You both mean it.", "他也祝你好運，兩人都是真心的。"); } },
    ],
  })),

  // ---- early career ----
  ev("relocation", [23, 38], () => isCareer() && !s.city, () => {
    const city = pick(CITIES);
    return {
      title: cat(L("Two years in ", "外派"), city, L("?", "兩年？")),
      text: cat(L("Your firm wants to send you to ", "公司想派你到"), city, L(" for two years. Better pay, no friends, very small flat.", "兩年。人工更高，沒有朋友，單位很細。")),
      choices: [
        { label: L("Go", "去"), sub: L("+30% pay, savings stop shrinking", "人工加三成，積蓄不再貶值"), run() { s.city = city; s.income *= 1.3; s.network += 8; s.sanity -= 5; return L("You learn a new city, a new set of restaurants and how to be lonely in a crowd.", "你認識了一座新城市、一堆新餐廳，也學會了在人群中寂寞。"); } },
        { label: L("Stay home", "留下"), sub: L("Roots", "根"), run() { s.sanity += 5; return L("Someone else goes. They come back with a promotion and a new accent.", "別人去了。他回來時升了職，還帶著新口音。"); } },
      ],
    };
  }),
  ev("journalist", [24, 50], () => s.track === "elite", () => ({
    title: L("A journalist calls", "記者來電"),
    text: L("A financial journalist wants to know about a deal you're working on. \"Off the record, of course.\"", "一位財經記者想打聽你正在處理的一單交易。「當然是不記名的。」"),
    choices: [
      { label: L("Leak a little", "透露少許"), sub: L("Build a friendship", "建立交情"), run() { s.heat += 15; s.network += 6; return L("Your quote appears as \"a person familiar with the matter.\" Compliance starts asking questions.", "你的話以「知情人士」的身份見報。合規部開始問問題。"); } },
      { label: L("No comment", "無可奉告"), sub: L("Professional", "專業"), run() { s.sanity += 2; return L("The story runs anyway, with someone else's leak.", "報道照樣刊出，用的是別人的消息。"); } },
    ],
  })),
  ev("bettingpool", [23, 40], () => s.track === "elite", () => ({
    title: L("The trading floor World Cup pool", "交易大堂世界盃賭局"),
    text: L("The whole floor is betting on the World Cup. Your MD put $10,000 on his home country.", "整個交易大堂都在賭世界盃。你的 MD 押了 $10,000 在他的祖國。"),
    choices: [
      { label: L("Bet big against your MD's team", "大手押注 MD 支持隊伍的對手"), sub: L("Bold", "大膽"), run() { const b = 5000; if (chance(0.5)) { s.cash += b; s.network -= 4; return L(`You win ${fmt(b)}. Your MD congratulates you through clenched teeth.`, `你贏了 ${fmt(b)}。MD 咬牙切齒地恭喜你。`); } s.cash -= b; return L(`You lose ${fmt(b)}. Your MD is delighted.`, `你輸了 ${fmt(b)}。MD 非常開心。`); } },
      { label: L("Bet a little on the same team as your MD", "小注跟 MD 買同一隊"), sub: L("Politics", "政治"), run() { s.network += 6; return L("Win or lose, you suffer together. It's the best bonding you've had all year.", "無論輸贏，你們同甘共苦。這是你一年來最好的團隊建立。"); } },
      { label: L("Stay out of it", "不參與"), sub: L("Gambling is gambling", "賭博就是賭博"), run() { s.sanity += 2; return L("You are the only person on the floor not refreshing the scores.", "你是整個交易大堂唯一沒有刷新比分的人。"); } },
    ],
  })),
  ev("hardship", [23, 35], () => isCareer(), () => ({
    title: L("Double pay, middle of nowhere", "雙倍人工，荒山野嶺"),
    text: L("Your firm needs someone to spend six months at a mining project in a remote town. Double pay, nothing to spend it on.", "公司需要有人到偏遠小鎮的採礦項目駐守六個月。雙倍人工，而且根本沒地方花錢。"),
    choices: [
      { label: L("Volunteer", "自願前往"), sub: L("Save everything", "全部儲起"), run() { s.cash += Math.round(s.income * 0.6 + 20000 * sc()); s.sanity -= 8; s.network += 4; return L("You save half a year's pay and learn to play the guitar badly.", "你儲了半年人工，學會了彈一手爛結他。"); } },
      { label: L("Let someone else go", "讓別人去"), sub: L("City life", "城市生活"), run() { s.sanity += 3; return L("A colleague goes and comes back with a lot of money and very strong opinions about the internet speed.", "一位同事去了，回來時很有錢，還對網速有很強烈的意見。"); } },
    ],
  })),
  ev("cryptopayback", [22, 40], null, () => ({
    title: L("Paid back in bitcoin", "用比特幣還錢"),
    text: L(`A friend can't repay the ${fmt(2000 * sc())} he owes you in cash. He offers you bitcoin instead.`, `朋友無法用現金還你欠款 ${fmt(2000 * sc())}，提出改用比特幣還。`),
    choices: [
      {
        label: L("Accept the bitcoin and hold it", "接受比特幣並持有"), sub: L("Lottery ticket", "彩票"), run() {
          if (chance(0.45)) { const g = Math.round(2000 * sc() * rnd(3, 15)); s.cash += g; return L(`You forget about it for years. It's now worth ${fmt(g)}.`, `你忘記了它好幾年，現在值 ${fmt(g)}。`); }
          return L("It halves the week after. You count it as a lesson in friendship and volatility.", "一星期後它腰斬了。你把它當作友誼和波動性的一課。");
        },
      },
      { label: L("Insist on cash, eventually", "堅持要現金，遲些也可以"), sub: L("Patience", "耐心"), run() { s.cash += Math.round(2000 * sc()); s.network -= 2; return L("He pays you back eight months later, slightly annoyed.", "八個月後他還了錢，有點不高興。"); } },
      { label: L("Forget the debt", "一筆勾銷"), sub: L("Friendship first", "友誼第一"), run() { s.sanity += 6; s.network += 4; return L("He never forgets it. When he does well years later, he remembers who was kind.", "他一直記得。多年後他發達了，記得誰曾經善待他。"); } },
    ],
  })),
  ev("officeromance", [23, 38], () => isCareer() && !s.flags.partner, () => ({
    title: L("An office romance", "辦公室戀情"),
    text: L("You and a colleague from another team keep ending up at the same coffee machine at the same time. It's not a coincidence.", "你和另一個團隊的同事總是同一時間出現在咖啡機旁。這不是巧合。"),
    choices: [
      { label: L("Ask them out", "約對方出去"), sub: L("HR exists, but so does love", "HR 存在，愛情也存在"), run() { s.flags.partner = true; s.sanity += 10; s.network += 3; return L("You tell HR on the second date, as the policy requires. HR says \"congratulations\" in a very flat voice.", "第二次約會後你按規定通知了 HR。HR 用很平淡的語氣說「恭喜」。"); } },
      { label: L("Keep it professional", "保持專業"), sub: L("Safer", "較安全"), run() { s.sanity -= 2; return L("You switch to tea. It doesn't help.", "你改喝茶。沒有幫助。"); } },
    ],
  })),
  ev("jury", [25, 60], null, () => ({
    title: L("Jury duty", "陪審員傳召"),
    text: L("You're called for jury duty, right in the middle of the busiest month of your year.", "你被傳召做陪審員，偏偏是一年中最忙的月份。"),
    choices: [
      { label: L("Serve", "履行義務"), sub: L("Civic duty", "公民責任"), run() { s.sanity += 6; s.network -= 3; return L("Two weeks away from email. The case is about a stolen car. You find it oddly restful.", "兩星期不用看電郵。案件關於一架被偷的車。你覺得出奇地放鬆。"); } },
      { label: L("Try to get out of it", "設法推掉"), sub: L("Work comes first", "工作優先"), run() { s.hustle += 3; s.sanity -= 4; return L("Your excuse works. The busy month is busy. You feel slightly guilty.", "你的藉口奏效了。繁忙的月份照樣繁忙，你有點內疚。"); } },
    ],
  })),

  // ---- mid-life ----
  ev("lawsuit", [30, 60], () => isCareer() || s.cash > 5e5, () => ({
    title: L("You're being sued", "你被起訴了"),
    text: L("A former client says your advice cost them money. Their lawyer's letter is nine pages long.", "一位前客戶說你的建議令他蝕錢。他律師的信長達九頁。"),
    choices: [
      { label: L("Settle quietly", "低調和解"), sub: L("Make it go away", "讓事情過去"), run() { const c = Math.round(Math.max(20000 * sc(), Math.max(0, s.cash) * 0.04)); s.cash -= c; s.sanity -= 3; return L(`You pay ${fmt(c)} and sign a non-disclosure agreement. It never happened.`, `你支付了 ${fmt(c)} 並簽了保密協議。這件事從未發生過。`); } },
      {
        label: L("Fight it in court", "上法庭抗辯"), sub: L("You did nothing wrong", "你沒有做錯"), run() {
          s.sanity -= 10;
          if (chance(0.6)) { s.network += 5; return L("You win. Your lawyer's bill is enormous, but your name is clean.", "你勝訴了。律師費驚人，但你的名聲清白。"); }
          const c = Math.round(Math.max(60000 * sc(), Math.max(0, s.cash) * 0.1)); s.cash -= c; return L(`You lose. Damages and fees come to ${fmt(c)}.`, `你敗訴了。賠償和訟費合共 ${fmt(c)}。`);
        },
      },
    ],
  })),
  ev("identitytheft", [25, 64], () => s.cash > 20000, () => ({
    title: L("Your identity was stolen", "你的身份被盜用"),
    text: L("Someone used your details to open three credit cards and buy a jet ski.", "有人用你的資料開了三張信用卡，還買了一架水上電單車。"),
    passive: true,
    run() { const l = Math.round(3000 * sc()); s.cash -= l; s.sanity -= 8; return L(`It takes four months and ${fmt(l)} to sort out. You now use a password manager for everything.`, `花了四個月和 ${fmt(l)} 才處理好。你現在甚麼都用密碼管理器。`); },
  })),
  ev("officepool", [24, 64], null, () => ({
    title: L("The office lottery pool", "辦公室彩票合買"),
    text: L("Everyone in the office is chipping in $20 for the lottery. The jackpot is enormous.", "辦公室每人夾 $20 買彩票，頭獎金額巨大。"),
    choices: [
      { label: L("Chip in $20", "夾 $20"), sub: L("Just in case", "以防萬一"), run() { s.cash -= 20; if (Math.random() < 0.002) { const g = Math.round(rnd(2e5, 2e6)); s.cash += g; return L(`You win! Your share is ${fmt(g)}. Half the office quits the next day.`, `你們中了！你分得 ${fmt(g)}。翌日半個辦公室的人辭職。`); } return L("You don't win. Nobody wins. The office buys pizza with the leftover change.", "沒有中。沒有人中。剩下的零錢拿去買了薄餅。"); } },
      { label: L("Sit it out", "不參與"), sub: L("You know the odds", "你知道機率"), run() { s.sanity -= 1; return L("You know the odds. You still spend the week afraid they'll win without you.", "你知道機率，但整個星期仍擔心他們會在沒有你的情況下中獎。"); } },
    ],
  })),
  ev("art", [32, 64], () => s.cash > 1e6, () => {
    const cost = Math.round(s.cash * 0.05);
    return {
      title: L("A painting at the art fair", "藝術博覽會上的畫作"),
      text: L("A dealer at an art fair says a young painter is \"about to explode.\" Her biggest canvas is still for sale.", "藝術博覽會上的畫商說一位年輕畫家「即將爆紅」。她最大的一幅畫仍未售出。"),
      choices: [
        {
          crowd: true, label: L("Buy it as an investment", "作為投資買下"), sub: UI.costs(cost), run() {
            s.cash -= cost; s.network += 5;
            if (chance(0.2)) { s.cash += cost * 8; return L(`She gets a museum show. Your painting is now worth ${fmt(cost * 9)}. You'll never sell it.`, `她在博物館舉辦展覽。你的畫現在值 ${fmt(cost * 9)}，而你永遠不會賣。`); }
            return L("She stops painting and opens a bakery. The painting looks lovely in your hallway.", "她不再畫畫，開了一間麵包店。那幅畫掛在你的走廊上很好看。");
          },
        },
        { label: L("Buy a small print", "買一張小版畫"), sub: L("Love it, don't invest in it", "喜歡就好，不當投資"), run() { s.cash -= Math.round(800 * sc()); s.sanity += 4; return L("It makes you smile every morning. Best return on any art you'll ever buy.", "它每天早上都令你微笑。這是你買過回報最好的藝術品。"); } },
        { label: L("Just look", "只是欣賞"), sub: L("Free", "免費"), run() { return L("You walk around for three hours and buy a coffee.", "你逛了三小時，買了一杯咖啡。"); } },
      ],
    };
  }),
  ev("cosign", [28, 60], null, () => ({
    title: L("Co-sign my loan?", "幫我做擔保人？"),
    text: L("A cousin asks you to co-sign a business loan. If he can't pay, the bank comes to you.", "一位表親請你為他的商業貸款做擔保人。如果他還不起，銀行會找你。"),
    choices: [
      {
        label: L("Co-sign it", "做擔保人"), sub: L("Family helps family", "一家人幫一家人"), run() {
          s.sanity += 4;
          if (chance(0.6)) { s.network += 6; return L("His restaurant does well. He names a dish after you.", "他的餐廳生意很好，還以你的名字為一道菜命名。"); }
          const l = Math.round(50000 * sc()); s.cash -= l; s.sanity -= 10; return L(`The business fails. The bank sends you a bill for ${fmt(l)}. Family dinners get complicated.`, `生意失敗了。銀行寄來 ${fmt(l)} 的帳單。家庭聚會變得複雜。`);
        },
      },
      { label: L("Lend a smaller amount yourself", "自己借他少一點"), sub: L("Limit the damage", "控制損失"), run() { s.cash -= Math.round(8000 * sc()); s.network += 3; return L("You treat it as a gift in your head. That way, anything that comes back is a bonus.", "你在心裡把它當作禮物。這樣一來，能拿回來的都是額外收穫。"); } },
      { label: L("Say no", "拒絕"), sub: L("Never co-sign", "絕不擔保"), run() { s.sanity -= 4; s.network -= 4; return L("He finds another way. He doesn't invite you to the opening.", "他找到別的辦法，開幕時沒有邀請你。"); } },
    ],
  })),
  ev("omaha", [26, 64], () => s.flags.value || s.type === "balanced" || s.type === "passive", () => ({
    title: L("The trip to Omaha", "奧馬哈之旅"),
    text: L("Tickets to a famous investor's annual shareholder meeting. Tens of thousands of people come every year to listen to two old men talk for six hours.", "一張著名投資者股東大會的入場券。每年數以萬計的人前來，聽兩位老人家講六小時話。"),
    choices: [
      { label: L("Make the pilgrimage", "去朝聖"), sub: UI.costs(3000 * sc()), run() { s.cash -= Math.round(3000 * sc()); s.hustle += 6; s.sanity += 8; s.network += 4; return L("You eat at the same steakhouse as everyone else and leave with pages of notes about patience.", "你在跟所有人一樣的牛扒館吃飯，帶著幾頁關於耐性的筆記離開。"); } },
      { label: L("Watch the livestream", "看網上直播"), sub: L("Free", "免費"), run() { s.hustle += 3; return L("You watch it in your pajamas. The wisdom is the same.", "你穿著睡衣看直播，智慧還是一樣的。"); } },
    ],
  })),
  ev("taxaudit", [28, 64], () => s.heat > 10 || s.cash > 3e6, () => ({
    title: L("A letter from the tax office", "稅局來信"),
    text: L("You've been selected for a full tax audit. They want seven years of records.", "你被選中接受全面稅務審查，他們要七年的紀錄。"),
    choices: [
      { label: L("Hire the best tax lawyers", "聘請最好的稅務律師"), sub: UI.costs(40000 * sc()), run() { s.cash -= Math.round(40000 * sc()); s.heat = Math.max(0, s.heat - 10); return L("Your lawyers are terrifyingly calm. The audit closes with a small adjustment.", "你的律師冷靜得可怕。審查最後只作了小幅調整。"); } },
      {
        label: L("Handle it yourself", "自己處理"), sub: L("You have nothing to hide", "你沒有甚麼要隱瞞"), run() {
          s.sanity -= 10;
          if (s.heat > 20) { const p = Math.round(Math.max(0, s.cash) * 0.08); s.cash -= p; return L(`They find the Cayman company. Back taxes and penalties come to ${fmt(p)}.`, `他們找到了那間開曼群島公司。補稅加罰款合共 ${fmt(p)}。`); }
          return L("Four months of spreadsheets later, you owe nothing. You never want to see a receipt again.", "四個月的試算表之後，你一分錢也不用補。你不想再看到任何收據。");
        },
      },
    ],
  })),
  ev("disaster", [20, 64], null, () => ({
    title: cat(L("Disaster hits ", "災難襲擊"), s.home),
    text: cat(L("A flood tears through ", "一場洪水席捲"), s.home, L(". Your old school is damaged and families you grew up with have lost everything.", "。你的母校受損，與你一同長大的家庭失去了一切。")),
    choices: [
      { label: L("Donate generously", "慷慨捐款"), sub: L("Give back", "回饋"), run() { const d = Math.round(Math.max(1000 * sc(), Math.max(0, s.cash) * 0.03)); s.cash -= d; s.sanity += 12; s.network += 6; return L(`You give ${fmt(d)}. The rebuilt school library has a small plaque with your name on it.`, `你捐了 ${fmt(d)}。重建後的學校圖書館掛著一塊印有你名字的小牌匾。`); } },
      { label: L("Fly home and help rebuild", "飛回家鄉幫忙重建"), sub: L("Time, not money", "付出時間，不是金錢"), run() { s.sanity += 16; s.network += 4; s.hustle -= 2; return L("You spend two weeks carrying bricks. It's the most useful you've felt in years.", "你花了兩星期搬磚頭。這是你多年來最覺得自己有用的時刻。"); } },
      { label: L("Share the fundraiser online", "在網上分享籌款"), sub: L("Something", "總算做了點事"), run() { s.sanity -= 3; return L("Your post gets 40 likes. You feel like it should have been more.", "你的帖文有 40 個讚。你覺得應該可以做得更多。"); } },
    ],
  })),
  ev("council", [35, 64], () => s.network >= 45, () => ({
    title: L("Run for the local council?", "參選區議會？"),
    text: L("Neighbors ask you to run for the local council. \"We need someone who understands money.\"", "鄰居請你參選區議會。「我們需要一個懂錢的人。」"),
    choices: [
      {
        label: L("Run", "參選"), sub: L("Public service", "公共服務"), run() {
          s.sanity -= 6; s.cash -= Math.round(5000 * sc());
          if (chance(0.5)) { s.network += 18; s.sanity += 8; return L("You win by 212 votes. You spend your first meeting arguing about a parking lot.", "你以 212 票之差勝出。第一次會議你就在爭論一個停車場。"); }
          s.network += 5; return L("You lose, but your neighbors trust you more for trying.", "你落選了，但鄰居因為你肯參選而更信任你。");
        },
      },
      { label: L("Decline", "拒絕"), sub: L("Not for you", "不適合你"), run() { return L("You promise to vote for whoever does run. You actually do.", "你承諾會投票給參選的人，而你真的去投了。"); } },
    ],
  })),
  ev("hitpiece", [30, 64], () => s.track === "elite" || s.cash > 1e7, () => ({
    title: L("A hit piece", "抹黑文章"),
    text: L("A business magazine publishes a long article about you. It is not flattering, and some of it is not true.", "一本財經雜誌刊登了一篇關於你的長文。內容並不討好，部分更是失實。"),
    choices: [
      { label: L("Sue the magazine", "控告雜誌"), sub: L("Defend your name", "捍衛名聲"), run() { s.cash -= Math.round(60000 * sc()); s.sanity -= 6; if (chance(0.5)) { s.network += 6; return L("They print a correction on page 47. You frame it.", "他們在第 47 頁刊登更正。你把它裱了起來。"); } s.network -= 6; return L("The lawsuit makes the story bigger. Everyone who missed the article now reads it.", "訴訟令事件鬧得更大。原本沒看過文章的人現在都看了。"); } },
      { label: L("Ignore it", "不理會"), sub: L("It'll blow over", "會過去的"), run() { s.sanity -= 3; return L("It blows over in two weeks. Your mother still mentions it.", "兩星期後風波平息，你媽媽仍然會提起。"); } },
    ],
  })),
  ev("influencerkid", [42, 60], () => s.flags.kid, () => ({
    title: L("Your kid wants to be an influencer", "孩子想做網紅"),
    text: L("Your teenager announces they're skipping university to become a full-time content creator. They have 3,000 followers.", "你的少年孩子宣布不讀大學，要做全職內容創作者。他有 3,000 個追蹤者。"),
    choices: [
      { label: L("Back them for one year", "支持他一年"), sub: L("Let them try", "讓他嘗試"), run() { s.cash -= Math.round(15000 * sc()); s.sanity += 4; if (chance(0.15)) { s.network += 10; return L("They hit a million followers. You appear in a video and become briefly famous.", "他的追蹤者突破一百萬。你在一條片中出鏡，短暫地紅了起來。"); } return L("They learn video editing, marketing and humility. They apply to university the next year.", "他學會了剪片、市場推廣和謙卑，翌年報讀了大學。"); } },
      { label: L("Insist on university first", "堅持先讀大學"), sub: L("The safe path", "穩陣路線"), run() { s.sanity -= 6; return L("They go, unhappily. They post about it.", "他不情不願地去了，還發帖抱怨。"); } },
    ],
  })),

  // ---- traditions and places ----
  ev("lunarnewyear", [22, 64], () => LUNAR_NEW_YEAR.has(s.c.iso), () => ({
    title: L("Lunar New Year red envelopes", "農曆新年利是"),
    text: L("Lunar New Year again. Every child in the extended family expects a red envelope from the relative who works in finance.", "又到農曆新年。大家庭裡每個小朋友都期待做金融的親戚派利是。"),
    choices: [
      { label: L("Be generous", "派大利是"), sub: L("Face matters", "面子要緊"), run() { s.cash -= Math.round(3000 * sc()); s.network += 6; s.sanity += 6; return L("You're the favorite relative this year. The kids compare envelopes in the corner.", "你今年是最受歡迎的親戚。孩子們在角落裡比較利是。"); } },
      { label: L("Hand out index-fund certificates instead", "改派指數基金證書"), sub: L("Teach them young", "從小教起"), run() { s.cash -= Math.round(1500 * sc()); s.sanity += 2; return L("The kids are confused. In 30 years, one of them will thank you.", "孩子們一頭霧水。三十年後，其中一個會感謝你。"); } },
      { label: L("Keep it modest", "派細利是"), sub: L("Traditions, not competitions", "是傳統，不是比賽"), run() { s.cash -= Math.round(400 * sc()); return L("Your aunt notices. She notices everything.", "你姑媽留意到了。她甚麼都會留意到。"); } },
    ],
  })),
  ev("diwaligold", [22, 64], () => s.c.iso === "IND", () => ({
    title: L("Gold for Diwali", "排燈節買金"),
    text: L("It's Diwali, and the family wants to buy gold, as they do every year.", "排燈節到了，家人像每年一樣想買黃金。"),
    choices: [
      { label: L("Buy a good amount of gold", "買一定份量的黃金"), sub: L("Tradition and a hedge", "傳統兼對沖"), run() { const b = Math.round(Math.max(1000 * sc(), Math.max(0, s.cash) * 0.03)); s.cash -= b; s.flags.gold = true; s.sanity += 6; return L("Your mother is happy, and your savings now have a little protection against inflation.", "媽媽很開心，你的積蓄也多了點抗通脹的保護。"); } },
      { label: L("Buy a gold ETF instead", "改買黃金 ETF"), sub: L("Modern", "現代"), run() { s.flags.gold = true; s.network -= 2; return L("Your grandmother doesn't understand how gold can live inside a phone.", "嫲嫲不明白黃金怎麼能住在手機裡。"); } },
    ],
  })),
  ev("zakat", [22, 64], () => MUSLIM_MAJORITY.has(s.c.iso) && s.cash > 10000, () => ({
    title: L("Zakat", "天課"),
    text: L("As Ramadan ends, it's time to work out your zakat: giving 2.5% of your savings to people in need.", "齋戒月結束，是時候計算天課：把積蓄的 2.5% 捐給有需要的人。"),
    choices: [
      { label: L("Give the full 2.5%", "捐出全數 2.5%"), sub: L("Gladly", "樂意"), run() { const z = Math.round(Math.max(0, s.cash) * 0.025); s.cash -= z; s.sanity += 12; s.network += 4; return L(`You give ${fmt(z)}. It feels like the most important transaction of your year.`, `你捐出了 ${fmt(z)}。這感覺像是你一年中最重要的一筆交易。`); } },
      { label: L("Set up a fund to give every year", "成立每年捐獻的基金"), sub: L("Make it automatic", "自動化"), run() { const z = Math.round(Math.max(0, s.cash) * 0.025); s.cash -= z; s.income -= z * 0.1; s.sanity += 14; return L("Your giving is now automatic. A local school gets new books every year.", "你的捐獻現在自動進行。一間本地學校每年都有新書。"); } },
    ],
  })),

  // ---- personality ----
  ev("earningsyolo", [23, 55], () => s.type === "aggressive" && s.cash > 0, () => ({
    title: L("Earnings night", "業績公佈夜"),
    text: L("A big tech company reports earnings after the close. You have a feeling. You always have a feeling.", "一間大型科技公司收市後公佈業績。你有一種感覺。你總是有一種感覺。"),
    choices: [
      {
        label: L("Buy options on a big move", "買期權賭大波動"), sub: L("All or nothing", "全有或全無"), run() {
          const b = Math.max(0, s.cash) * 0.1;
          if (chance(0.35)) { s.cash += b * 3; return L(`The stock jumps 15% overnight. Your options are worth four times what you paid. +${fmt(b * 3)}.`, `股價一夜急升 15%，期權價值翻了四倍。+${fmt(b * 3)}。`); }
          s.cash -= b; return L(`The stock barely moves. Your options expire worthless. -${fmt(b)}.`, `股價幾乎沒動，期權到期變廢紙。-${fmt(b)}。`);
        },
      },
      { label: L("Watch from the sidelines", "在場邊看戲"), sub: L("Out of character", "不像你"), run() { s.sanity -= 3; return L("It moves 15%. You stare at the ceiling all night.", "股價波動了 15%。你整晚盯著天花板。"); } },
    ],
  })),
  ev("bondladder", [30, 64], () => s.type === "passive" && s.cash > 50000, () => ({
    title: L("The bond ladder", "債券階梯"),
    text: L("Interest rates are up. Government bonds pay a decent return for the first time in years.", "利率上升了。政府債券多年來首次提供像樣的回報。"),
    choices: [
      { label: L("Build a bond ladder", "建立債券階梯"), sub: L("Steady income, little risk", "穩定收入，風險低"), run() { s.income += Math.round(Math.max(0, s.cash) * 0.02); s.sanity += 8; return L("A bond matures every year. You've never felt calmer about money.", "每年都有一張債券到期。你對錢從未如此安心。"); } },
      { label: L("Stay in stocks", "留在股票"), sub: L("Long term", "長線"), run() { s.hustle += 2; return L("You stay the course. The bonds would have been fine too.", "你堅守路線。買債券其實也不錯。"); } },
    ],
  })),
  ev("sixtyforty", [30, 64], () => s.type === "balanced", () => ({
    title: L("The 60/40 debate", "60/40 之爭"),
    text: L("Everyone online says the classic mix of 60% stocks and 40% bonds is dead. They said that last year too.", "網上人人都說「六成股票、四成債券」的經典組合已死。去年他們也這樣說。"),
    choices: [
      { label: L("Stick with your mix", "堅持你的組合"), sub: L("Discipline", "紀律"), run() { s.cash += Math.max(0, s.cash) * rnd(0.02, 0.08); s.sanity += 4; return L("It does what it always does: fine. Boringly, reliably fine.", "它一如既往地表現：還好。沉悶而可靠地還好。"); } },
      { label: L("Try something new", "嘗試新策略"), sub: L("Adapt", "應變"), run() { const r = rnd(-0.1, 0.15); s.cash += Math.max(0, s.cash) * r; return r > 0 ? L("Your new strategy beats the old one this year. You're not sure it was skill.", "新策略今年跑贏舊策略。你不確定那是不是實力。") : L("Your new strategy lags. The old mix would have been fine.", "新策略跑輸了。舊組合其實沒問題。"); } },
    ],
  })),
);

DATA.officepool = L("The odds of winning the US Powerball jackpot with one ticket are about 1 in 292 million.", "以一張彩票贏得美國強力球頭獎的機率約為二億九千二百萬分之一。");
DATA.zakat = L("Zakat, one of the five pillars of Islam, is generally set at 2.5% of savings held for a year above a minimum threshold.", "天課是伊斯蘭教五功之一，一般為超過最低門檻並持有一年的積蓄的 2.5%。");
DATA.omaha = L("Berkshire Hathaway's annual meeting in Omaha regularly draws around 40,000 people.", "巴郡在奧馬哈舉行的股東大會，經常吸引約四萬人出席。");
DATA.creditcard = L("Credit card interest rates commonly run above 20% a year, so an unpaid balance can roughly double in under four years.", "信用卡年利率普遍超過 20%，因此未清還的結欠不用四年就可能翻一倍。");

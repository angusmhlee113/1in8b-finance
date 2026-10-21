// ---------- alternate versions of the milestones ----------
// each life draws one version per milestone; every version tests the same thing as the original

// the hedge fund option sits on every version of the big-bet milestone
function hedgeFundChoice(base) {
  const canFund = s.track === "elite" && s.network >= 55;
  const fundOdds = Math.min(0.8, 0.3 + s.hustle / 400 + s.network / 400);
  return {
    label: L("Launch your own hedge fund", "成立自己的對沖基金"), sub: UI.oddsNet(fundOdds, s.network / 400),
    locked: canFund ? null : L("Locked, needs an elite finance career and 55+ network", "未解鎖，需要精英金融事業及 55 以上人脈"),
    run() {
      if (chance(fundOdds)) {
        setJob(JOBS.hf, "elite", rnd(2e6, 8e6)); s.network += 15;
        return L("You raise $2B. Two-and-twenty on someone else's pension fund. You buy a sports-team minority stake.", "你籌得 $20 億。從別人的退休金抽「二八收費」。你買了一支球隊的少數股權。");
      }
      s.cash -= base * 0.2; s.sanity -= 15; setJob(JOBS.consultant, "elite", 50000);
      return L(`The fund closes after 18 months. You're "taking some time to reflect" (unemployed).`, "基金 18 個月後清盤。你正在「花點時間沉澱」（失業中）。");
    },
  };
}

// the three ways to ride out a crisis, with words that fit each crisis
function crisisChoices(base, dipWin, dipLose, panic, wait) {
  return [
    {
      label: L("Buy the dip. All of it.", "撈底，全部撈"), sub: L("Be greedy when others are fearful", "別人恐懼時我貪婪"), run() {
        if (chance(0.7)) { s.cash += base * 0.8; return dipWin; }
        s.cash -= base * 0.4; s.sanity -= 12;
        return dipLose;
      },
    },
    { label: L("Panic sell everything", "恐慌性全部沽出"), sub: L("Make the pain stop", "讓痛苦停止"), run() { s.cash -= base * 0.1; s.sanity -= 10; return panic; } },
    { label: L("Do nothing. Touch grass.", "甚麼也不做，出去走走"), sub: L("Delete the app", "刪除交易 app"), run() { s.cash += base * 0.5; s.sanity += 10; return wait; } },
  ];
}

const crisisText = (intro, introZh) => {
  const loss = s.flags.crashLoss;
  const hedged = s.flags.hedged;
  return loss
    ? L(`${intro} You're already down ${fmt(loss)}${hedged ? ", and your hedge cut that in half" : ""}.`, `${introZh}你已經蝕了 ${fmt(loss)}${hedged ? "，而你的對沖已幫你減少了一半損失" : ""}。`)
    : L(`${intro} Luckily you had nothing to lose.`, `${introZh}幸好你本來就沒甚麼可以蝕。`);
};

const MILESTONE_VARIANTS = {
  kid1: [
    () => ({
      title: L("The big slide", "大滑梯"),
      text: L("At the playground, the big slide is for older kids. You're very small, and very determined.", "遊樂場裡的大滑梯是給大孩子玩的。你很細小，但非常有決心。"),
      choices: [
        kid(L("Climb straight to the top of the big slide", "直接爬上大滑梯最高處"), 1,
          L("You make it up, slide down headfirst and land in the sand. You immediately go again.", "你成功爬上去，頭先腳後滑下來，一頭栽進沙池。然後你立即再玩一次。")),
        kid(L("Hold an older kid's hand and go together", "拖著大孩子的手一起滑"), 0,
          L("You find a seven-year-old willing to take you. Early proof that partnerships work.", "你找到一個願意帶你的七歲小孩。這是合作有效的早期證明。")),
        kid(L("Stay in the sandbox where it's safe", "留在安全的沙池"), -1,
          L("You build an excellent sandcastle. Nobody falls off a sandcastle.", "你砌了一座出色的沙堡。沒有人會從沙堡上跌下來。")),
      ],
    }),
    () => ({
      title: L("The cookie jar", "曲奇罐"),
      text: L("The cookie jar is on the kitchen counter. You're small. Dinner is in an hour.", "曲奇罐放在廚房枱面上。你很矮，而晚飯還有一個鐘才開始。"),
      choices: [
        kid(L("Drag a chair over and climb up", "拖張椅過去爬上去"), 1,
          L("You get three cookies and a scolding. Worth it, by your math.", "你拿到三塊曲奇，外加一頓罵。按你的計算，值得。")),
        kid(L("Convince your cousin to get them and split the haul", "說服表哥去拿，然後平分戰利品"), 0,
          L("Your cousin takes the risk and the blame. You take half. A natural fund manager.", "表哥承擔了風險和責罵，你拿走一半。天生的基金經理。")),
        kid(L("Wait for dessert after dinner", "等晚飯後的甜品"), -1,
          L("You get one cookie, officially, with no drama. Your parents brag about you to the neighbors.", "你名正言順地拿到一塊曲奇，毫無風波。爸媽向鄰居誇讚你。")),
      ],
    }),
  ],
  kid2: [
    () => ({
      title: L("Grandma's red envelope", "嫲嫲的利是"),
      text: L("Grandma offers you $10 now, or $20 if you wait until next New Year.", "嫲嫲說現在可以給你 $10，或者等到明年新年給你 $20。"),
      choices: [
        kid(L("Take the $10 and bet it on a playground game for $50", "拿 $10 去操場賭一場，贏了有 $50"), 1,
          () => chance(0.4) ? L("You win $50 at marbles. Grandma is horrified and slightly impressed.", "你玩波子贏了 $50。嫲嫲既震驚又有點佩服。")
            : L("You lose it all at marbles. You ask Grandma if the $20 offer still stands. It does not.", "你玩波子輸光了。你問嫲嫲 $20 的提議還算不算數。不算。")),
        kid(L("Wait a year for the $20", "等一年拿 $20"), 0,
          L("A 100% return in one year. You'll never see a deal that good again.", "一年回報率 100%。你這輩子再也不會遇到這麼好的交易。")),
        kid(L("Take the $10 now. Grandma might forget.", "現在拿 $10，嫲嫲可能會忘記"), -1,
          L("A sure thing is a sure thing. Grandma did not forget, but you still prefer having it now.", "到手的才是真的。嫲嫲沒有忘記，但你仍然寧願現在拿到。")),
      ],
    }),
    () => ({
      title: L("The piggy bank", "錢罌"),
      text: L("Your piggy bank is half full. A classmate is selling a mystery box for exactly what's inside it.", "你的錢罌已經半滿。一個同學正在賣一個神秘盒，價錢剛好是你錢罌裡的錢。"),
      choices: [
        kid(L("Smash it and buy the mystery box", "打破錢罌去買神秘盒"), 1,
          () => chance(0.5) ? L("The box has a rare toy worth twice what you paid. You are now a collector.", "盒裡有一件價值雙倍的稀有玩具。你從此成為收藏家。")
            : L("The box has a pencil and a sticker. You learn about information asymmetry.", "盒裡只有一支鉛筆和一張貼紙。你學會了甚麼叫資訊不對稱。")),
        kid(L("Wait until it's full, then decide", "等儲滿了再決定"), 0,
          L("By the time it's full, the mystery box craze is over. You buy a book instead.", "等到儲滿時，神秘盒熱潮已經過去。你改為買了一本書。")),
        kid(L("Never open it. It's safest in there.", "永遠不打開，放在裡面最安全"), -1,
          L("Your piggy bank becomes a family legend. Nobody has ever seen inside it.", "你的錢罌成了家族傳說。從來沒有人見過裡面有甚麼。")),
      ],
    }),
  ],
  kid3: [
    () => ({
      title: L("The school fun fair", "學校攤位遊戲日"),
      text: L("Every class runs a stall at the fun fair. You're in charge of yours.", "攤位遊戲日每班都要開一個攤位，而你負責你們班的。"),
      choices: [
        kid(L("Run a lucky dip with your own savings as the prizes", "用自己的積蓄做獎品，開幸運抽獎"), 1,
          L("You make three times your money and give away your favorite toy. Volatility is part of the game.", "你賺了三倍，卻送走了最心愛的玩具。波動是遊戲的一部分。")),
        kid(L("Run a lemonade stand with a friend", "跟朋友合開檸檬水攤"), 0,
          L("Steady sales all day. You split the profit fairly and stay friends.", "一整天穩定銷售。你們公平分帳，仍然是朋友。")),
        kid(L("Volunteer at the book table", "到書攤幫忙"), -1,
          L("No profit, no risk, and you read four books while waiting for customers.", "沒有利潤，沒有風險，而你在等客人時看完了四本書。")),
      ],
    }),
    () => ({
      title: L("Sports day", "運動會"),
      text: L("You can enter as many races as you like, including the ones for older kids.", "你可以參加任何數量的比賽，包括高年級的組別。"),
      choices: [
        kid(L("Enter every race, including the older kids'", "報名所有比賽，連高年級組也參加"), 1,
          L("You come last in five races and win one nobody expected you to. You remember only the win.", "你五場比賽包尾，卻贏了一場沒人看好的。你只記得那場勝利。")),
        kid(L("Enter the one race you're best at", "只報你最擅長的一項"), 0,
          L("Second place. A solid, risk-adjusted result.", "第二名。一個穩健、經風險調整的成績。")),
        kid(L("Volunteer to hold the finish tape", "自願去拉終點線"), -1,
          L("Best view of the day, and nobody can lose to you.", "全日最好的位置，而且沒有人可以贏你。")),
      ],
    }),
  ],
  kid4: [
    () => ({
      title: L("A friend's business", "朋友的生意"),
      text: L("Your best friend is reselling phone cases at school and wants an investor.", "你最好的朋友在學校轉售手機殼，想找一個投資者。"),
      choices: [
        kid(L("Invest all your savings", "投資全部積蓄"), 1,
          () => chance(0.5) ? L("Phone cases are the hottest thing at school. You double your money.", "手機殼成為全校最熱門的東西。你的錢翻了一倍。")
            : L("The school bans phone cases. Nobody knows why. You lose everything.", "學校禁止手機殼，沒人知道原因。你輸光了。")),
        kid(L("Help sell for a commission", "幫手賣，收佣金"), 0,
          L("You earn a little on every case. No upside, no downside. Very investment-banker of you.", "每賣一個你都賺一點。沒有大升，也沒有大跌。很有投資銀行家的風格。")),
        kid(L("Politely decline", "禮貌地拒絕"), -1,
          L("Your friend is fine. Your savings are fine. Everyone is fine.", "朋友沒事，你的積蓄沒事，大家都沒事。")),
      ],
    }),
    () => ({
      title: L("The rare game item", "稀有遊戲道具"),
      text: L("You got an ultra-rare item in an online game. A stranger offers real money for it.", "你在網上遊戲裡得到一件超稀有道具。一個陌生人出真金白銀想買。"),
      choices: [
        kid(L("Sell it to the stranger for cash", "賣給陌生人換現金"), 1,
          () => chance(0.5) ? L("The money arrives. You've made your first online sale and you want more.", "錢到帳了。你完成了第一宗網上交易，而且想要更多。")
            : L("The stranger was a scammer. Item gone, no money. A cheap lesson, all things considered.", "那個陌生人是騙子。道具沒了，錢也沒有。不過整體來說，這是個便宜的教訓。")),
        kid(L("Trade it with friends for a few good items", "跟朋友換幾件好道具"), 0,
          L("A fair trade. Your friends think you're generous. You think you're diversified.", "一宗公平交易。朋友覺得你很慷慨，你覺得自己很分散投資。")),
        kid(L("Keep it forever", "永遠留著它"), -1,
          L("You still have it. You log in once a year just to look at it.", "你現在還留著它，每年登入一次只為看看它。")),
      ],
    }),
  ],
  discover: [
    () => {
      s.job = JOBS.highSchool;
      return {
        title: L("The finance influencer", "財經網紅"),
        text: L("An 18-year-old online says he made $1M trading options from his bedroom. You watch 300 of his videos in a week.",
          "網上有個 18 歲的少年說他在睡房炒期權賺了一百萬。你一星期內看了他 300 條片。"),
        choices: [
          {
            crowd: true, label: L("Copy his strategy with your savings", "用積蓄照抄他的策略"), sub: L("What could go wrong", "會出甚麼事呢"),
            run() {
              if (chance(0.4)) {
                const gain = Math.round(rnd(800, 4000) * (0.4 + 0.15 * s.c.g));
                s.cash += gain; s.hustle += 5;
                return L(`It works, somehow. +${fmt(gain)}. You start a spreadsheet called "Path to $1M".`, `竟然成功了。+${fmt(gain)}。你開了一個叫「百萬之路」的試算表。`);
              }
              s.cash -= 400; s.sanity -= 6;
              return L("Your options expire worthless. It turns out he was selling a course, not trading.", "你的期權到期變成廢紙。原來他是在賣課程，不是在交易。");
            },
          },
          {
            label: L("Read a real finance textbook instead", "改為讀一本正經的金融教科書"), sub: L("The long way round", "走遠路"),
            run() { s.hustle += 7; s.sanity -= 2; return L("Chapter 3 explains why most of his videos are nonsense. You feel smug and slightly cheated.", "第三章解釋了為何他大部分的片都是胡說八道。你既得意又覺得有點被騙。"); },
          },
          {
            label: L("Start your own finance channel", "開自己的財經頻道"), sub: L("Fake it till you make it", "扮到你成功"),
            run() { s.network += 8; s.sanity -= 3; return L("Your first video gets 41 views, 30 of them your mom. You're a creator now.", "你的第一條片有 41 個觀看，其中 30 個是你媽媽。你現在是創作者了。"); },
          },
        ],
      };
    },
  ],
  grind: [
    () => {
      if (s.track === "elite") return {
        title: L("The MD's nephew", "MD 的姪仔"),
        text: L("Your MD's nephew is your summer intern. He's charming, useless, and about to send a client the wrong numbers.",
          "你的暑期實習生是 MD 的姪仔。他很有魅力，毫無用處，而且正要把錯誤的數字發給客戶。"),
        choices: [
          { label: L("Quietly fix his work all summer", "整個夏天默默幫他執手尾"), sub: L("Political capital", "政治資本"), run() { s.network += 12; s.sanity -= 14; return L("The MD thanks his nephew for a great summer. Then he remembers you exist, which is something.", "MD 感謝姪仔度過了很棒的夏天，然後記起有你這個人，這也算有點收穫。"); } },
          {
            label: L("Let him fail and say nothing", "讓他出錯，甚麼也不說"), sub: L("Risky", "有風險"), run() {
              if (chance(0.5)) { s.sanity += 6; return L("The client catches it. The nephew gets reassigned to the family office. Nobody blames you.", "客戶發現了錯誤。姪仔被調到家族辦公室，沒人怪你。"); }
              s.network -= 14; return L("Somehow it's your fault. Of course it's your fault.", "不知為何變成你的錯。當然是你的錯。");
            },
          },
          { label: L("Tell the MD directly", "直接告訴 MD"), sub: L("Bold", "大膽"), run() { s.network -= 6; s.hustle += 6; return L("The MD says \"thanks for the feedback\" in a tone you will hear in your dreams.", "MD 用一種你會在夢中聽到的語氣說：「多謝你的意見。」"); } },
        ],
      };
      if (s.track === "normie") return {
        title: L("The hole in the books", "帳目上的漏洞"),
        text: L("Doing a routine audit, you find $2 million that doesn't add up. It's 6pm on a Friday.", "在一次例行審計中，你發現有 200 萬對不上數。現在是星期五下午六點。"),
        choices: [
          { label: L("Stay all weekend and find it", "整個週末留下來找出原因"), sub: L("Diligence", "盡責"), run() { s.hustle += 10; s.sanity -= 12; s.network += 6; return L("It was a typo in a spreadsheet from 2019. Your manager calls you \"thorough\" in your review.", "原來是 2019 年試算表裡的一個打錯字。經理在考核裡形容你「一絲不苟」。"); } },
          { label: L("Flag it and go home", "標記問題然後回家"), sub: L("Healthy boundaries", "健康的界線"), run() { s.sanity += 6; return L("Someone else finds the typo on Monday. Everyone is fine.", "星期一有別人找到了那個打錯字。大家都沒事。"); } },
          { label: L("Assume it's fine", "假設沒問題"), sub: L("Optimism", "樂觀"), run() { s.heat += 10; s.sanity += 3; return L("It was fine. Probably. You stop thinking about it, mostly.", "應該沒問題。大概吧。你大部分時候不再想這件事。"); } },
        ],
      };
      return {
        title: L("Your favorite influencer launches a coin", "你最喜歡的網紅發幣了"),
        text: L("The guy whose videos got you into crypto just launched his own token. His fans are all-in.", "那個令你入坑加密貨幣的網紅剛發行了自己的代幣。他的粉絲全部押上。"),
        choices: [
          {
            crowd: true, label: L("Buy in at launch", "開盤即買"), sub: L("Loyalty", "忠誠"), run() {
              if (chance(0.3)) { const g = Math.max(30000 * reach(), s.cash); s.cash += g; return L(`It moons for exactly one day. You sell at the top, by luck. +${fmt(g)}.`, `它只升了一天，你靠運氣賣在最高位。+${fmt(g)}。`); }
              const l = Math.max(10000, s.cash * 0.6); s.cash -= l; s.sanity -= 12;
              return L(`He sells his whole allocation in the first hour. -${fmt(l)}. He posts a video about "staying humble."`, `他在第一個小時就賣光自己的份額。-${fmt(l)}。然後他發了一條關於「保持謙卑」的片。`);
            },
          },
          {
            label: L("Short it", "沽空它"), sub: L("You know how this ends", "你知道結局"), run() {
              s.heat += 5;
              const b = Math.max(5000, s.cash * 0.3);
              if (chance(0.6)) { s.cash += b; return L(`You know how this ends, and you're right. +${fmt(b)}. His fans call you a "hater."`, `你知道結局，而且你是對的。+${fmt(b)}。他的粉絲罵你是「黑粉」。`); }
              s.cash -= b; return L(`His fans pump it for a week out of spite. -${fmt(b)}.`, `他的粉絲為了賭氣連續炒高一星期。-${fmt(b)}。`);
            },
          },
          { label: L("Unfollow him", "取消追蹤"), sub: L("Growth", "成長"), run() { s.sanity += 8; return L("You feel lighter. Your feed is now mostly cooking videos.", "你感覺輕鬆了。你的動態現在大部分是煮食片。"); } },
        ],
      };
    },
  ],
  ethics: [
    () => ({
      title: L("A favor from your boss", "老闆的一個請求"),
      text: L(`Your boss asks you to "fix the timestamp" on a trade ticket, so it looks like the trade happened before a big market move.`,
        "老闆叫你「修改一下時間」，把一張交易單的時間改到市場大波動之前。"),
      choices: [
        { label: L("Do it", "照做"), sub: L("Team player", "團隊精神"), run() { const g = Math.round(rnd(30000, 120000) * sc()); s.cash += g; s.heat += 40; return L(`Your boss approves a ${fmt(g)} "special bonus." Neither of you mentions why.`, `老闆批出了 ${fmt(g)} 的「特別花紅」。你們都沒有提及原因。`); } },
        { label: L("Refuse", "拒絕"), sub: L("Integrity", "誠信"), run() { s.network -= 10; s.sanity += 5; return L("Your boss finds someone else to do it. You are not invited to the team offsite.", "老闆找了別人去做。團隊外遊沒有邀請你。"); } },
        { label: L("Report it to compliance", "向合規部舉報"), sub: L("Paper trail", "留下紀錄"), run() { s.network -= 6; s.sanity += 8; return L("Your boss is quietly \"moved on\" two months later. Nobody says your name, but everybody knows.", "兩個月後，老闆被悄悄「安排離開」。沒有人提你的名字，但人人都知道。"); } },
      ],
    }),
    () => ({
      title: L("A consulting fee", "一筆顧問費"),
      text: L(`A client's representative offers you a "consulting fee" to make sure their bid wins. It would be paid to an offshore account.`,
        "一位客戶代表提出給你一筆「顧問費」，條件是確保他們的投標勝出。錢會匯入離岸戶口。"),
      choices: [
        { label: L("Take the money", "收錢"), sub: L("Nobody will know", "沒有人會知道"), run() { const g = Math.round(100000 * sc()); s.cash += g; s.heat += 45; return L(`${fmt(g)} lands in an account you can't mention to anyone. The bid wins.`, `${fmt(g)} 進了一個你不能向任何人提起的戶口。投標勝出了。`); } },
        { label: L("Say no and walk away", "拒絕並離開"), sub: L("Clean hands", "兩袖清風"), run() { s.sanity += 4; return L("They win the bid anyway, through someone else. Your hands stay clean.", "他們最終還是透過別人贏了投標。你的手仍然乾淨。"); } },
        { label: L("Report the offer", "舉報這個提議"), sub: L("Risky, but right", "有風險，但正確"), run() { s.network -= 8; s.sanity += 6; s.hustle += 4; return L("Legal opens an investigation. You get a short thank-you email and a long list of new enemies.", "法務部展開調查。你收到一封簡短的感謝電郵，以及一大串新敵人。"); } },
      ],
    }),
  ],
  lifestyle: [
    () => {
      const cost = Math.round(Math.max(20000, s.cash * 0.04));
      return {
        title: L("The watch waitlist", "名錶輪候名單"),
        text: L("You finally get the call: the rare watch you've been waitlisted for is available. Collectors say it only goes up in value.",
          "你終於接到電話：你輪候已久的稀有名錶到貨了。收藏家都說它只會升值。"),
        choices: [
          {
            label: L("Buy it. It's an investment.", "買，這是投資"), sub: UI.costs(cost), run() {
              s.cash -= cost; s.network += 8;
              if (chance(0.5)) { s.cash += cost * 1.6; return L("Watch prices spike. You could sell it for more. You never will.", "名錶價格急升，你可以賣更高價，但你永遠不會賣。"); }
              return L("Watch prices fall 30% the next year. You check its value more than your portfolio.", "第二年名錶價格下跌三成。你查它價值的次數比查投資組合還多。");
            },
          },
          { label: L("Put the money in an index fund", "把錢放進指數基金"), sub: L("Disciplined", "有紀律"), run() { s.hustle += 4; s.cash += cost * 0.1; return L("Your wrist is bare and your returns are fine. Your colleagues pity you.", "你的手腕空空如也，回報卻不錯。同事都可憐你。"); } },
          { label: L("Pass. You have a phone.", "不買，你有手機"), sub: L("Radical", "激進"), run() { s.sanity += 5; return L("Your phone tells the time, the weather and your portfolio. It does not impress anyone at dinner.", "你的手機能報時、看天氣、看投資組合，但在飯局上沒有任何人會被它打動。"); } },
        ],
      };
    },
    () => {
      const cost = Math.round(Math.max(60000 * sc(), s.cash * 0.08));
      return {
        title: L("The ski chalet", "滑雪小屋"),
        text: L("Three colleagues are splitting a ski chalet for the season. They need a fourth.", "三個同事合租一間滑雪小屋過冬，還差一個人。"),
        choices: [
          { label: L("Join the chalet", "加入"), sub: UI.costs(cost), run() { s.cash -= cost; s.network += 14; s.sanity += 6; return L("You learn to ski badly and network excellently. Two deals start in the hot tub.", "你學會了很差的滑雪技術和很出色的社交技巧。有兩單交易是在溫泉池裡開始的。"); } },
          { label: L("Go once, as a guest", "以客人身份去一次"), sub: L("Freeloader", "搭便車"), run() { s.cash -= Math.round(cost * 0.1); s.network += 5; return L("You bring good wine and stay one weekend. Nobody minds.", "你帶了好酒，住了一個週末。沒有人介意。"); } },
          { label: L("Spend winter at home", "在家過冬"), sub: L("Cozy", "溫暖"), run() { s.sanity += 8; return L("You read, sleep and save money. The chalet photos look cold anyway.", "你讀書、睡覺、儲錢。反正那些小屋照片看起來都很冷。"); } },
        ],
      };
    },
  ],
  bet: [
    () => {
      const base = Math.max(0, s.cash);
      return {
        title: L("Your friend's IPO", "朋友公司上市"),
        text: L("A college friend's company is going public. You can get shares at the IPO price before anyone else.", "一個大學朋友的公司即將上市。你可以比所有人更早以招股價買入股票。"),
        choices: [
          {
            label: L("Go all in", "全押"), sub: L("You know the founder", "你認識創辦人"), run() {
              if (chance(0.4)) { s.cash += base * 2; return L("The stock triples on day one. Your friend rings the opening bell. You ring your broker.", "股價首日升了三倍。朋友敲響開市鐘，你打電話給經紀。"); }
              s.cash -= base * 0.6; s.sanity -= 10;
              return L("The stock falls below its IPO price in a week and keeps falling. You and your friend stop talking about it.", "股價一星期內跌穿招股價，而且繼續下跌。你和朋友都不再提起這件事。");
            },
          },
          {
            label: L("Buy a modest amount", "買一點點"), sub: L("Support without risk", "支持但不冒險"), run() {
              if (chance(0.5)) { s.cash += base * 0.1; return L("It does well. You wish you'd bought more, then remember why you didn't.", "表現不錯。你後悔沒有多買，然後記起自己為何沒有。"); }
              s.cash -= base * 0.03; return L("It drifts down. A small loss, and an awkward text from your friend.", "股價慢慢下滑。一點小損失，加上朋友一個尷尬的短訊。");
            },
          },
          { label: L("Index funds. Boring is beautiful.", "指數基金，悶就是美"), sub: L("Steady", "穩定"), run() { s.cash += base * 0.25; s.sanity += 5; return L("You make 25%. Nobody wants to hear about it at parties.", "你賺了 25%。派對上沒有人想聽。"); } },
          hedgeFundChoice(base),
        ],
      };
    },
    () => {
      const base = Math.max(0, s.cash);
      return {
        title: L("The empty office towers", "空置的寫字樓"),
        text: L("Office towers downtown are selling at 70% off. Half of them are empty. A broker says this is \"the bottom.\"",
          "市中心的寫字樓以三折出售，有一半是空置的。經紀說這是「底部」。"),
        choices: [
          {
            label: L("Buy a whole building", "買下一整幢"), sub: L("Be greedy when others are fearful", "別人恐懼時我貪婪"), run() {
              if (chance(0.45)) { s.cash += base * 1.5; return L("Companies call everyone back to the office. Your building fills up and its value soars.", "公司紛紛要求員工返回辦公室。你的大廈住滿了，價值飆升。"); }
              s.cash -= base * 0.5; s.sanity -= 10;
              return L("It turns out the bottom had a basement. Your building is now a very expensive pigeon sanctuary.", "原來底部下面還有地庫。你的大廈現在是一個非常昂貴的白鴿保護區。");
            },
          },
          { label: L("Buy a real estate fund instead", "改買房地產基金"), sub: L("Spread the risk", "分散風險"), run() { const r = rnd(-0.1, 0.3); s.cash += base * r; return r > 0 ? L("The fund recovers nicely. Someone else deals with the pigeons.", "基金回升得不錯。白鴿的問題交給別人處理。") : L("The fund dips. At least you don't own a building full of pigeons.", "基金下跌。至少你沒有擁有一整幢住滿白鴿的大廈。"); } },
          { label: L("Index funds. Boring is beautiful.", "指數基金，悶就是美"), sub: L("Steady", "穩定"), run() { s.cash += base * 0.25; s.sanity += 5; return L("You make 25%. Nobody wants to hear about it at parties.", "你賺了 25%。派對上沒有人想聽。"); } },
          hedgeFundChoice(base),
        ],
      };
    },
  ],
  crisis: [
    () => {
      const base = Math.max(0, s.cash);
      return {
        title: L("Sovereign debt crisis", "主權債務危機"),
        text: crisisText(`A large government can't pay its debts. Bond markets panic, banks wobble and stocks fall ${pct(s.flags.crashDepth)}.`, `一個大國無力償還債務。債市恐慌，銀行搖搖欲墜，股市下跌 ${pct(s.flags.crashDepth)}。`),
        choices: crisisChoices(base,
          L("A bailout arrives. Markets rally hard. You buy a boat and name it Bailout.", "救助方案出台，市場大幅反彈。你買了一艘遊艇，命名為「救市號」。"),
          L("The bailout talks collapse twice. Your dip-buying looks very early.", "救助談判兩度破裂。你的撈底看起來太早了。"),
          L("You sell the day before the bailout is announced. Historically precise.", "你在救助方案公佈前一天沽出。精準得可以寫進歷史。"),
          L("You switch off the news for a year. By the time you look again, it's over.", "你關掉新聞一年。等你再看時，一切已經過去。")),
      };
    },
    () => {
      const base = Math.max(0, s.cash);
      return {
        title: L("The commercial real estate crash", "商業地產崩盤"),
        text: crisisText(`Empty offices finally break the banks that lent against them. Regional lenders fail and stocks fall ${pct(s.flags.crashDepth)}.`, `空置的寫字樓終於拖垮了借錢給它們的銀行。地區銀行倒閉，股市下跌 ${pct(s.flags.crashDepth)}。`),
        choices: crisisChoices(base,
          L("Markets recover in 18 months. You buy the office you used to work in. It's a gym now.", "市場在 18 個月內回升。你買下了以前上班的寫字樓，它現在是一間健身室。"),
          L("Another bank fails, then another. The dip keeps dipping.", "又一間銀行倒閉，然後再一間。底部不斷向下。"),
          L("You sell at the exact bottom. A pigeon watches you do it.", "你準確地在最低位沽出。一隻白鴿看著你這樣做。"),
          L("You garden for a year. Your portfolio recovers without you. It always did.", "你種了一年花。你的投資組合在沒有你的情況下回升了。它一直都會。")),
      };
    },
  ],
};

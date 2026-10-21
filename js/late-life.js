// ---------- life after 45: a second act, ageing parents, a second crisis, deciding when to stop, and what it was all for ----------

const parentsAlive = () => ["mother", "father"].filter(k => s.family[k].age + s.age < s.family[k].diesAt);
// what your parents leave behind depends on how much the family had
const inheritanceSize = () => Math.round([3000, 15000, 80000, 300000, 2500000, 3e7][s.tier] * Math.max(0.2, mult()));

const LATE_MILESTONES = [
  {
    key: "secondact", ages: [45, 49],
    build() {
      const startOdds = Math.min(0.85, 0.35 + s.network / 300 + s.hustle / 400);
      return {
        title: L("The second act", "人生下半場"),
        text: L("You're halfway through your working life. A friend who switched careers at 46 says it was the best thing she ever did.", "你的職業生涯已經過了一半。一位 46 歲轉行的朋友說，那是她做過最好的決定。"),
        choices: [
          { label: L("Teach finance at a university", "到大學教金融"), sub: L("Less money, more meaning", "錢少了，意義多了"), run() { setJob(JOBS.teacher, "normie", 40000 * Math.max(0.3, mult())); s.sanity += 20; s.network += 5; return L("Your students are 19 and think you're ancient. You've never enjoyed work more.", "你的學生 19 歲，覺得你很老。你從未如此享受工作。"); } },
          {
            label: L("Start your own firm", "開設自己的公司"), sub: UI.oddsNet(startOdds, s.network / 300), run() {
              if (chance(startOdds)) { setJob(JOBS.founder, s.track === "degen" ? "degen" : "elite", Math.max(s.income * 1.5, 120000 * sc())); s.network += 10; return L("Your old clients follow you. Your name is on the door, and it's a very nice door.", "舊客戶跟著你走。門上掛著你的名字，而且是一扇非常好看的門。"); }
              s.cash -= Math.max(0, s.cash) * 0.15; s.sanity -= 10;
              return L("You burn through savings for two years before going back to a salaried job. You don't regret trying.", "你燒了兩年積蓄，最後回去打工。你不後悔嘗試過。");
            },
          },
          { label: L("Stay and keep climbing", "留下繼續往上爬"), sub: L("Steady", "穩定"), run() { s.income *= 1.1; s.sanity -= 5; return L("You get a bigger office and a slightly bigger title. The view is nice.", "你換了一間更大的辦公室和一個稍大的職銜。景色不錯。"); } },
        ],
      };
    },
    variants: [
      () => {
        const fees = Math.round(200000 * sc());
        const who = s.flags.kid ? L("Your kid", "你的孩子") : L("Your nephew", "你的姪仔");
        return {
          title: L("The university offer", "大學錄取通知"),
          text: cat(who, L(` got into a top university. Tuition and living costs come to about ${fmt(fees)}.`, `獲頂尖大學錄取。學費和生活費合共約 ${fmt(fees)}。`)),
          choices: [
            { label: L("Pay for all of it", "全數支付"), sub: UI.costs(fees), run() { s.cash -= fees; s.sanity += 10; s.network += 4; return L("They graduate with no debt. You remember your own student loans and feel quietly proud.", "他畢業時零負債。你想起自己當年的學債，默默感到驕傲。"); } },
            { label: L("Pay half, they borrow half", "付一半，另一半由他借"), sub: L("Skin in the game", "要他也有付出"), run() { s.cash -= fees / 2; s.sanity += 4; return L("They work part-time and take their studies seriously. Probably because of the loan.", "他兼職打工，認真讀書。大概是因為那筆貸款。"); } },
            { label: L("They can take out loans like you did", "讓他像你當年一樣借錢"), sub: L("Character-building", "磨練性格"), run() { s.sanity -= 8; s.hustle += 3; return L("They manage. Thanksgiving is a little cooler for a few years.", "他應付得來，只是之後幾年的家庭聚會有點冷淡。"); } },
          ],
        };
      },
      () => {
        if (!isCareer()) return LATE_MILESTONES[0].build();
        const pkg = Math.round(Math.max(30000, s.income * 2));
        return {
          title: L("Your division is shut down", "你的部門被關閉"),
          text: L(`At 47, after years of loyal service, your whole division is closed in a "strategic realignment." HR offers you a ${fmt(pkg)} package.`,
            `在忠心服務多年之後，你 47 歲時整個部門因「策略調整」被關閉。HR 給你一個 ${fmt(pkg)} 的離職補償。`),
          choices: [
            { label: L("Take the package and retire early", "拿補償提早退休"), sub: L("Freedom", "自由"), run() { s.cash += pkg; setJob(JOBS.retired, "retired", 0); s.sanity += 22; return L("You stop working decades early. Your days are now long walks, long lunches and long naps.", "你提早幾十年退休。你的日子變成了長長的散步、長長的午餐和長長的午睡。"); } },
            { label: L("Find a new job", "找新工作"), sub: L("Start again at 47", "47 歲重新開始"), run() { s.cash += pkg; s.income *= 0.75; s.sanity -= 6; return L("It takes eight months and a lot of interviews with people half your age. The new job pays less.", "花了八個月，面試了很多比你年輕一半的人，新工作人工更低。"); } },
            { label: L("Go independent as a consultant", "成為獨立顧問"), sub: L("Be your own boss", "自己做老闆"), run() { s.cash += pkg; setJob(JOBS.consultantSelf, s.track, s.income * 0.9); s.hustle += 8; return L("Your old employer becomes your first client, at twice your old day rate.", "你的前僱主成了你的第一個客戶，日薪是以前的兩倍。"); } },
          ],
        };
      },
    ],
  },
  {
    key: "parents", ages: [50, 54],
    build() {
      if (!parentsAlive().length) return oldHouse();
      const care = Math.round(30000 * sc());
      const canShare = s.family.siblings > 0;
      return {
        title: L("Your parents need care", "父母需要照顧"),
        text: L("Your parents can't manage on their own any more. Someone has to decide what happens next, and everyone is looking at you.", "父母已經無法自理。總要有人決定接下來怎麼辦，而大家都看著你。"),
        choices: [
          { label: L("Move them in with you", "接他們同住"), sub: L("Family first", "家人優先"), run() { s.sanity -= 6; s.network -= 3; s.income -= 5000 * sc(); return L("Your home is louder and fuller. Your mother reorganizes your kitchen. It's harder and better than you expected.", "家裡更熱鬧更擠擁，媽媽重新整理了你的廚房。這比你預期的更辛苦，也更美好。"); } },
          { label: L("Pay for a good care home", "支付優質護老院"), sub: UI.costs(care * 5), run() { s.income -= care; s.sanity += 4; return L("The care home is excellent and expensive. You visit every Sunday.", "護老院很好，也很貴。你每個星期日都去探望。"); } },
          {
            label: L("Share the cost with your siblings", "與兄弟姊妹分擔費用"), sub: L("Split it fairly", "公平分擔"),
            locked: canShare ? null : L("Locked, you're an only child", "未解鎖，你是獨生子女"),
            run() { s.income -= care / 2; s.sanity -= 2; return L("There's a spreadsheet. There are arguments about the spreadsheet. It mostly works.", "大家做了一個試算表，然後為這個試算表爭吵。大致上行得通。"); },
          },
        ],
      };
    },
    variants: [
      () => {
        if (!parentsAlive().length) return oldHouse();
        return {
          title: L("The talk about the will", "關於遺囑的對話"),
          text: L("Over dinner, your parents say they want to talk about their will. Your siblings suddenly find their phones very interesting.", "晚飯時，父母說想談談遺囑。你的兄弟姊妹突然對手機很感興趣。"),
          choices: [
            { label: L("Ask them to split it equally", "請他們平均分配"), sub: L("Keep the peace", "保持和氣"), run() { s.sanity += 8; s.network += 3; return L("It's settled in ten minutes. Everyone relaxes and has dessert.", "十分鐘就談妥了。大家都鬆了一口氣，吃起甜品來。"); } },
            { label: L("Suggest they give most of it to charity", "建議他們把大部分捐給慈善"), sub: L("You're doing fine", "你過得不錯"), run() { s.sanity += 6; s.network -= 4; return L("Your parents are moved. Your siblings are not.", "父母很感動，兄弟姊妹卻不然。"); } },
            { label: L("Change the subject", "轉換話題"), sub: L("Too morbid", "太沉重了"), run() { s.sanity -= 6; return L("Nobody brings it up again. That will matter later.", "之後再也沒有人提起。這在將來會有影響。"); } },
          ],
        };
      },
      () => {
        if (!parentsAlive().length) return oldHouse();
        const trip = Math.round(20000 * sc());
        return {
          title: L("One last big trip", "最後一次遠行"),
          text: L("Your parents have always wanted to see the world. They're getting old, and they mention it at every dinner now.", "父母一直想周遊列國。他們年紀漸大，現在每頓飯都會提起。"),
          choices: [
            { label: L("Pay for it and go with them", "出錢並陪他們去"), sub: UI.costs(trip), run() { s.cash -= trip; s.sanity += 16; s.network -= 2; return L("Three weeks, four countries, one argument about a missed train. You'll treasure every photo.", "三星期、四個國家、一次因錯過火車而起的爭吵。每張照片你都會珍藏。"); } },
            { label: L("Pay for it, but send them alone", "出錢，但讓他們自己去"), sub: L("Too busy", "太忙"), run() { s.cash -= trip * 0.6; s.sanity += 4; return L("They send you 400 photos. You look at all of them, at your desk.", "他們傳來 400 張照片。你在辦公桌前一張張看完。"); } },
            { label: L(`"Maybe next year"`, "「明年吧」"), sub: L("There's always next year", "總會有明年"), run() { s.sanity -= 12; return L("Next year comes, and then the year after. You think about this a lot.", "明年到了，然後又一年。你經常想起這件事。"); } },
          ],
        };
      },
    ],
  },
  {
    key: "retireplan", ages: [55, 58],
    build() {
      if (s.job === JOBS.retired) return lateFreedom();
      return {
        title: L("When do you stop?", "何時停下來？"),
        text: L(`You have ${fmt(s.cash)}. A retirement calculator online says you could stop now, or in ten years, depending on how long you think you'll live.`,
          `你有 ${fmt(s.cash)}。網上的退休計算機說，你可以現在停，也可以十年後停，視乎你覺得自己會活多久。`),
        choices: [
          { label: L("Retire now", "現在退休"), sub: L("Life is short", "人生苦短"), run() { setJob(JOBS.retired, "retired", 0); s.sanity += 22; return L("On your last day, your team gives you a card signed by 40 people. You only recognize 12 names.", "最後一天，團隊送你一張有 40 人簽名的卡，你只認得其中 12 個名字。"); } },
          { label: L("Work until 65", "做到 65 歲"), sub: L("One more decade of compounding", "多十年複利"), run() { s.hustle += 5; s.sanity -= 4; return L("You decide every extra year at work is a year of compounding. Your spreadsheet agrees. Your back doesn't.", "你認為多做一年就多一年複利。你的試算表同意，你的腰不同意。"); } },
          { label: L("Go part-time", "轉做兼職"), sub: L("Half in, half out", "一半工作，一半生活"), run() { s.income *= 0.5; s.sanity += 12; return L("Three days a week. You learn to cook properly and start losing at golf to retired people.", "每星期三天。你學會好好煮飯，也開始在高爾夫球場輸給退休人士。"); } },
        ],
      };
    },
    variants: [
      () => {
        if (s.job === JOBS.retired) return lateFreedom();
        const pot = Math.round(Math.max(20000 * sc(), s.income * 8));
        return {
          title: L("The pension choice", "退休金選擇"),
          text: L(`Your pension pot is worth ${fmt(pot)}. You can take it all as cash now, or turn it into an income for life.`,
            `你的退休金戶口價值 ${fmt(pot)}。你可以現在一筆過提取，或轉為終身年金。`),
          choices: [
            { label: L("Take it all as cash", "一筆過提取"), sub: L("Control", "自己掌控"), run() { s.cash += pot * 0.8; return L("After tax, you get 80% in your account today. What you do with it is up to you.", "扣稅後，八成即日存入你的戶口。怎樣運用由你決定。"); } },
            { label: L("Turn it into a lifetime income", "轉為終身年金"), sub: L("Never run out", "永不用完"), run() { s.income += pot * 0.06; s.sanity += 8; return L("A check arrives every month for the rest of your life. It's the most boring and calming thing you own.", "餘生每個月都有一張支票寄來。這是你擁有過最沉悶、也最令人安心的東西。"); } },
            { label: L("Leave it invested", "繼續投資"), sub: L("Let it grow", "讓它繼續增長"), run() { s.cash += pot * rnd(0.6, 1.4); return L("You leave it in the market a few more years, then take it out. The timing is luck either way.", "你讓它在市場多放幾年才取出。時機好壞，都是運氣。"); } },
          ],
        };
      },
      () => {
        const ask = Math.round(Math.max(10000, Math.max(0, s.cash) * 0.3));
        return {
          title: L("A guaranteed return", "保證回報"),
          text: L("A charming fund manager at your golf club offers \"a guaranteed 2% a month, only for friends.\" Several people you know are already in, and they say the payments are like clockwork.",
            "高爾夫球會裡一位很有魅力的基金經理提出「每月保證 2% 回報，只限朋友」。你認識的幾個人已經加入，他們說每月準時收錢。"),
          choices: [
            { crowd: true, label: L("Invest a big chunk", "投入一大筆"), sub: UI.costs(ask), run() { s.cash -= ask; s.sanity -= 15; return L("The payments arrive for eight months. Then the website goes offline and the fund manager moves abroad. It was never invested in anything.", "首八個月準時收到錢。然後網站下線，基金經理移居海外。那筆錢從來沒有投資在任何東西上。"); } },
            { crowd: true, label: L("Invest a little to test it", "投入少少試水"), sub: UI.costs(ask * 0.1), run() { s.cash -= ask * 0.1; s.sanity -= 4; return L("Your test pays out perfectly, so a friend puts in his life savings. Then it collapses. You lose a little; he loses everything.", "你的試水完美回本，於是一位朋友投入了畢生積蓄。然後騙局爆煲。你蝕了少少，他輸掉了一切。"); } },
            { label: L("Report it to the regulator", "向監管機構舉報"), sub: L("Too good to be true", "好得不像真的"), run() { s.sanity += 8; s.network += 6; return L("No real investment pays 2% a month, guaranteed. The regulator shuts it down within a year, and your friends thank you, eventually.", "沒有真正的投資能每月保證 2% 回報。監管機構一年內就把它關閉，你的朋友最終也感謝你。"); } },
          ],
        };
      },
    ],
  },
];

// when both parents have passed away, the parents milestone becomes about the house they left
function oldHouse() {
  const value = inheritanceSize();
  return {
    title: L("Your parents' house", "父母的舊屋"),
    text: L(`Your parents have passed away. The house you grew up in in ${s.home.en} is yours now${s.family.siblings ? ", shared with your siblings" : ""}.`,
      `父母已經離世。你在${s.home.zh}長大的那間屋現在屬於你${s.family.siblings ? "，與兄弟姊妹共同擁有" : ""}。`),
    choices: [
      { label: L("Sell it", "賣掉"), sub: L("Move on", "向前看"), run() { const share = value / (1 + s.family.siblings); s.cash += share; s.sanity -= 4; return L(`Your share comes to ${fmt(share)}. Clearing out the attic takes longer than the sale.`, `你分得 ${fmt(share)}。清理閣樓比賣屋花的時間還長。`); } },
      { label: L("Keep it as a family home", "保留作家族老屋"), sub: L("Roots", "根"), run() { s.sanity += 10; s.network += 3; return L("Every holiday, the whole family comes back to the same kitchen.", "每逢假期，一家人都回到同一個廚房。"); } },
      { label: L("Rent it out", "出租"), sub: L("Steady income", "穩定收入"), run() { s.income += value * 0.04 / (1 + s.family.siblings); return L("A young family moves in. They send you a photo of their kid's height marks next to yours on the doorframe.", "一個年輕家庭搬了進來。他們傳來一張照片：門框上孩子的身高刻痕，就在你當年的旁邊。"); } },
    ],
  };
}

// people who already retired get a different kind of decision instead of "when do you stop?"
function lateFreedom() {
  return {
    title: L("All the time in the world", "時間多的是"),
    text: L("You've been retired for a while. Your calendar is empty, and you're starting to notice.", "你已經退休一段時間。行事曆空空如也，你開始察覺到了。"),
    choices: [
      { label: L("Volunteer at a financial-literacy charity", "到理財教育慈善機構做義工"), sub: L("Give back", "回饋社會"), run() { s.sanity += 15; s.network += 8; return L("You teach budgeting to teenagers. One of them reminds you of yourself at 15.", "你教青少年做預算。其中一個令你想起 15 歲時的自己。"); } },
      { label: L("Manage your own money full-time", "全職管理自己的錢"), sub: L("You can't help it", "你忍不住"), run() { s.hustle += 6; s.cash += Math.max(0, s.cash) * rnd(-0.05, 0.12); return L("You check the markets more now than when you worked. Your partner hides the laptop.", "你現在看市場比上班時還多。伴侶把手提電腦藏了起來。"); } },
      { label: L("Learn something completely new", "學一樣全新的東西"), sub: L("Never too late", "永遠不會太遲"), run() { s.sanity += 12; s.hustle += 3; return L("You take up pottery. Your first bowl is terrible. Your tenth is quite good.", "你開始學陶藝。第一個碗很糟糕，第十個已經相當不錯。"); } },
    ],
  };
}

// a second, rarer crisis late in life, using the same three crisis stories
const firstCrisis = MILESTONES.find(m => m.key === "crisis");
LATE_MILESTONES.splice(2, 0, { key: "crisis2", ages: [51, 57], chance: 0.5, pre: firstCrisis.pre, build: firstCrisis.build, variants: MILESTONE_VARIANTS.crisis });

// slot them in order after the first crisis, ahead of "what's it all for"
{
  let after = "crisis";
  for (const m of LATE_MILESTONES) {
    const { variants, ...milestone } = m;
    MILESTONES.splice(MILESTONES.findIndex(x => x.key === after) + 1, 0, milestone);
    MILESTONE_VARIANTS[m.key] = variants;
    after = m.key;
  }
}
["0", "1", "2"].forEach(v => { DATA[`crisis2:${v}`] = DATA[`crisis:${v}`]; });
DATA["retireplan:2"] = L("Bernie Madoff's investment fraud, uncovered in 2008, promised steady returns year after year. Investors' statements showed about $65 billion that didn't exist.",
  "2008 年揭發的麥道夫投資騙案，承諾年年穩定回報。投資者結單上顯示約 650 億美元，但這些錢根本不存在。");

// ---------- random events for the later years ----------

EVENTS.push(
  ev("grandkid", [52, 64], () => s.flags.kid, () => ({
    title: L("You're a grandparent", "你做祖父母了"),
    text: L("Your kid calls with news: you're going to be a grandparent. You immediately start thinking about compound interest over 60 years.", "孩子打來報喜：你要做祖父母了。你立即開始計算 60 年的複利。"),
    choices: [
      { label: L("Open an index fund for the baby", "為孫兒開一個指數基金戶口"), sub: L("The ultimate head start", "最強起步優勢"), run() { s.cash -= Math.round(10000 * sc()); s.sanity += 14; return L("By the time they're 65, it should be worth a fortune. You write them a letter explaining why.", "到他 65 歲時，這應該價值不菲。你寫了一封信向他解釋原因。"); } },
      { label: L("Spoil them rotten", "盡情寵愛"), sub: L("That's the job", "這就是你的工作"), run() { s.cash -= Math.round(5000 * sc()); s.sanity += 16; return L("Toys, trips and too much sugar. Your kid sighs. You don't care.", "玩具、旅行和太多糖果。孩子嘆氣，你不在乎。"); } },
      { label: L("Offer financial advice to the new parents", "向新手父母提供理財建議"), sub: L("Nobody asked", "沒人問你"), run() { s.sanity += 4; s.network -= 2; return L("You send a 14-page document. They reply with a thumbs-up emoji.", "你寄出一份 14 頁的文件，他們回覆了一個讚好表情符號。"); } },
    ],
  })),
  ev("emptynest", [47, 58], () => s.flags.kid, () => ({
    title: L("The empty nest", "空巢"),
    text: L("Your kid has moved out. The house is very quiet, and very big.", "孩子搬走了。家裡變得很安靜，也很大。"),
    choices: [
      { label: L("Downsize", "換細屋"), sub: L("Free up money", "釋放資金"), run() { const g = s.property ? Math.round(Math.max(0, homeEquity()) * 0.35) : Math.round(5000 * sc()); if (s.property) s.property.value -= g; s.cash += g; s.sanity += 4; return L(`You move somewhere smaller and free up ${fmt(g)}. You don't miss the stairs.`, `你搬到較小的地方，騰出了 ${fmt(g)}。你不會懷念那些樓梯。`); } },
      { label: L("Adopt a dog", "領養一隻狗"), sub: L("Fill the silence", "填補寂靜"), run() { s.sanity += 14; s.cash -= Math.round(3000 * sc()); return L("The dog follows you everywhere. You talk to it about the markets. It never disagrees.", "狗狗到哪裡都跟著你。你跟牠談論市場，牠從不反駁。"); } },
      { label: L("Throw yourself into work", "全情投入工作"), sub: L("Distraction", "轉移注意力"), run() { s.hustle += 8; s.sanity -= 6; return L("You start sending emails at 6am again. Your team notices.", "你又開始在早上六點發電郵。你的團隊察覺到了。"); } },
    ],
  })),
  ev("boardseat", [45, 62], () => (s.track === "elite" || s.job === JOBS.retired) && s.network >= 50, () => ({
    title: L("A seat on the board", "董事會席位"),
    text: L("A listed company invites you to join its board. Four meetings a year, a generous fee, and your name in the annual report.", "一間上市公司邀請你加入董事會。每年四次會議、豐厚袍金，名字還會印在年報上。"),
    choices: [
      { label: L("Accept", "接受"), sub: L("Prestige and a fee", "名望和袍金"), run() { s.income += Math.round(80000 * sc()); s.network += 10; s.heat += 3; return L("You read 300-page board packs on planes. Mostly.", "你在飛機上閱讀 300 頁的董事會文件。大部分時候。"); } },
      { label: L("Decline", "拒絕"), sub: L("Not worth the liability", "不值得承擔責任"), run() { s.sanity += 4; return L("Two years later that board is in the news for all the wrong reasons. You feel smart.", "兩年後那個董事會因負面新聞上了頭條。你覺得自己很聰明。"); } },
    ],
  })),
  ev("heartscare", [50, 64], null, () => ({
    title: L("Chest pains on the treadmill", "跑步機上的胸痛"),
    text: L("It turns out to be a warning, not a heart attack. The cardiologist is very clear about what happens if you ignore it.", "原來只是一個警告，不是心臟病發。心臟科醫生清楚說明了你若不理會的後果。"),
    choices: [
      { label: L("Change everything", "徹底改變生活"), sub: L("Diet, sleep, less stress", "飲食、睡眠、減壓"), run() { s.sanity += 16; s.hustle -= 4; return L("You eat vegetables now. You go to bed at ten. You feel ten years younger and slightly bored.", "你現在吃蔬菜、十點上床。你感覺年輕了十年，也有點悶。"); } },
      { label: L("Get the best private care money can buy", "用錢買最好的私家醫療"), sub: UI.costs(30000 * sc()), run() { s.cash -= Math.round(30000 * sc()); s.sanity += 8; return L("A specialist flies in. Your arteries are now the best-documented in the country.", "一位專科醫生專程飛來。你的動脈現在是全國紀錄最詳盡的。"); } },
      { label: L("Ignore it and keep going", "不理它，繼續工作"), sub: L("Risky", "危險"), run() { s.sanity -= 14; return L("You're fine. For now. Your partner has started checking on you at night.", "你暫時沒事。伴侶開始在夜裡查看你的情況。"); } },
    ],
  })),
  ev("ageism", [50, 62], isCareer, () => ({
    title: L("Replaced", "被取代"),
    text: L("Your firm hires a 28-year-old and an AI system. Together they cost less than you.", "公司請了一個 28 歲的年輕人和一套 AI 系統，兩者加起來比你便宜。"),
    passive: true,
    run() {
      if (Math.random() < 0.4) { s.income *= 0.6; s.sanity -= 10; return L("Your role is \"reshaped.\" Your pay drops 40%. Your title stays the same, which feels worse.", "你的崗位被「重塑」，人工減少四成。職銜不變，這感覺更差。"); }
      s.hustle += 4; return L("You survive by becoming the person who knows where everything is. The 28-year-old asks you for help daily.", "你靠做那個知道所有東西放在哪裡的人倖存下來。那個 28 歲的年輕人每天都向你求助。");
    },
  })),
  ev("comeback", [52, 64], () => s.job === JOBS.retired, () => ({
    title: L("Your old firm calls", "舊公司來電"),
    text: L("Your old firm wants you back as a senior adviser. Two days a week, very good money, and you'd get your old parking space.", "舊公司想請你回去做高級顧問。每星期兩天、報酬豐厚，還能拿回你以前的泊車位。"),
    choices: [
      { label: L("Come out of retirement", "復出"), sub: L("They need you", "他們需要你"), run() { setJob(JOBS.consultantSelf, "normie", Math.round(90000 * sc())); s.network += 8; s.sanity -= 4; return L("You're back. Everyone's younger, the coffee is worse, and you love it.", "你回來了。人人都更年輕，咖啡更難喝，而你很享受。"); } },
      { label: L("Stay retired", "繼續退休"), sub: L("You earned this", "這是你應得的"), run() { s.sanity += 8; return L("You hang up and go back to the garden. The tomatoes need you more.", "你掛了電話，回到花園。番茄比他們更需要你。"); } },
    ],
  })),
  ev("vineyard", [48, 64], () => s.cash > 5e6, () => {
    const cost = Math.round(s.cash * 0.1);
    return {
      title: L("A vineyard for sale", "葡萄園出售"),
      text: L("A small vineyard is for sale. You've always wanted one. Everyone who owns one says the same thing: it's the best way to turn a large fortune into a small one.",
        "一個小葡萄園出售，你一直都想要一個。每個擁有葡萄園的人都說同一句話：這是把大財富變成小財富的最佳方法。"),
      choices: [
        { label: L("Buy it", "買下"), sub: UI.costs(cost), run() { s.cash -= cost; s.sanity += 12; s.network += 6; if (chance(0.3)) { s.income += cost * 0.06; return L("Your second vintage wins a medal. The vineyard actually turns a profit. Nobody believes you.", "你第二年的酒得了獎，葡萄園竟然有盈利。沒人相信你。"); } return L("The wine is drinkable. The views are spectacular. The accounts are a disaster.", "酒還能喝，風景壯麗，帳目一塌糊塗。"); } },
        { label: L("Buy a case of their wine instead", "改為買一箱他們的酒"), sub: L("Sensible", "明智"), run() { s.sanity += 3; return L("You enjoy it with friends and keep your fortune the size it is.", "你和朋友一起享用，財富保持原狀。"); } },
      ],
    };
  }),
  ev("memoir", [55, 64], () => s.cash > 1e6 || s.track === "elite", () => ({
    title: L("Write your memoir", "寫回憶錄"),
    text: L("A publisher thinks your story would make a good book. You think so too.", "一間出版社認為你的故事可以寫成一本好書。你也這麼認為。"),
    choices: [
      {
        label: L("Write the honest version", "寫坦誠版本"), sub: L("Warts and all", "連缺點也寫"), run() {
          s.sanity += 8;
          if (chance(0.25)) { const g = Math.round(rnd(1e5, 1e6) * sc()); s.cash += g; s.network += 10; return L(`It becomes a bestseller. ${fmt(g)} in royalties and a lot of uncomfortable phone calls from old colleagues.`, `書成了暢銷書。${fmt(g)} 版稅，以及很多舊同事打來的尷尬電話。`); }
          return L("It sells modestly. A few young readers write to say it helped them. That's enough.", "銷量平平，但有幾個年輕讀者寫信說它幫到了他們。這已經足夠。");
        },
      },
      { label: L("Write the flattering version", "寫美化版本"), sub: L("Your legend", "你的傳奇"), run() { s.network += 4; return L("Reviewers call it \"a 300-page LinkedIn post.\" Your mother loves it.", "書評人稱它為「一篇 300 頁的 LinkedIn 帖文」。你媽媽很喜歡。"); } },
      { label: L("Decline", "拒絕"), sub: L("Some stories stay private", "有些故事應該保密"), run() { s.sanity += 2; return L("Some of your stories are better left untold, especially the ones involving the SEC.", "你的一些故事最好不要說出來，特別是那些涉及證監會的。"); } },
    ],
  })),
  ev("phonecall", [58, 64], null, () => ({
    title: L("A panicked phone call", "一通驚慌的電話"),
    text: L("A voice that sounds like your nephew says he's in trouble abroad and needs $5,000 wired right now. Please don't tell his parents.", "一個聽起來像你姪仔的聲音說他在外地出事，需要你立即匯款 $5,000，還求你不要告訴他父母。"),
    choices: [
      { crowd: true, label: L("Wire the money", "匯款"), sub: L("Family emergency", "家人有急事"), run() { s.cash -= 5000; s.sanity -= 10; return L("Your nephew calls the next day from his couch, completely fine. The voice was an AI clone.", "第二天姪仔在家中梳化上打給你，他完全沒事。那把聲音是 AI 複製的。"); } },
      { label: L("Hang up and call his parents", "掛線並致電他父母"), sub: L("Check first", "先核實"), run() { s.sanity += 4; return L("He's at home playing video games. You tell everyone in the family group chat about the scam.", "他在家打機。你在家族群組裡提醒大家這個騙局。"); } },
    ],
  })),
  ev("worldcruise", [58, 64], () => s.job === JOBS.retired && s.cash > 5e5, () => {
    const cost = Math.round(Math.max(40000 * sc(), s.cash * 0.03));
    return {
      title: L("Nine months at sea", "九個月的海上旅程"),
      text: L("A world cruise visits 60 countries over nine months. Half the passengers are retired bankers.", "一個環球郵輪之旅在九個月內遊覽 60 個國家，一半乘客是退休銀行家。"),
      choices: [
        { label: L("Book it", "預訂"), sub: UI.costs(cost), run() { s.cash -= cost; s.sanity += 18; s.network += 6; return L("You see the world, play a lot of bridge and close a deal between two other passengers. Old habits.", "你看遍世界，打了很多橋牌，還促成了另外兩位乘客之間的一單交易。老習慣難改。"); } },
        { label: L("Stay home", "留在家"), sub: L("Your own bed", "自己的床"), run() { s.sanity += 3; return L("You watch a documentary about the cruise ship. It looks crowded.", "你看了一套關於那艘郵輪的紀錄片，看起來很擠。"); } },
      ],
    };
  }),
  ev("reunion30", [47, 52], null, () => ({
    title: L("The 30-year reunion", "畢業三十年聚會"),
    text: L("Thirty years after school. Half your class are grandparents, one is in government, and the class clown runs a very successful company.", "畢業三十年。半班同學已做了祖父母，一個在政府工作，當年的班中小丑經營著一間非常成功的公司。"),
    passive: true,
    run() { s.sanity += 6; s.network += 4; return L("Nobody asks about your net worth. They ask if you're happy. You think about it on the drive home.", "沒有人問你的身家。他們問你快不快樂。你在回家路上一直想著這個問題。"); },
  })),
);

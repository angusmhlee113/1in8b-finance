// ---------- extra milestone types: the first university summer, a mid-career turning point, and what it's all for ----------

// crypto kids skip university, so their summer looks different whatever version is drawn
function degenSummer() {
  return {
    title: L("Your first bull run", "你的第一個牛市"),
    text: L("Everything you own is up 300% this summer. You've started explaining crypto to your dentist.", "這個夏天你持有的一切都升了 300%。你已經開始向牙醫解釋加密貨幣。"),
    choices: [
      { label: L("Take some profits", "先獲利一部分"), sub: L("Lock it in", "落袋為安"), run() { const g = Math.round(Math.max(3000, s.cash * 0.3) * reach()); s.cash += g; s.sanity += 4; return L(`You cash out ${fmt(g)}. Two weeks later the market halves. You feel like a genius, quietly.`, `你套現了 ${fmt(g)}。兩星期後市場腰斬。你默默覺得自己是天才。`); } },
      {
        label: L("Borrow to buy more", "借錢買更多"), sub: L("Leverage", "槓桿"), run() {
          if (chance(0.4)) { const g = Math.max(20000 * reach(), s.cash); s.cash += g; return L(`It keeps going. You double up. +${fmt(g)}.`, `繼續上升，你的錢翻了一倍。+${fmt(g)}。`); }
          const l = Math.max(8000, s.cash * 0.7); s.cash -= l; s.sanity -= 12;
          return L(`The run ends the week after you borrow. -${fmt(l)}. Your lender is very polite about it, at first.`, `你借錢後一星期牛市就完了。-${fmt(l)}。借錢給你的人起初還很客氣。`);
        },
      },
      { label: L("Hold everything", "全部持有"), sub: L("Diamond hands", "鑽石手"), run() { const r = rnd(0.5, 1.6); s.cash = s.cash > 0 ? s.cash * r : s.cash; return r > 1 ? L("You hold through the dip and come out ahead. You will never shut up about it.", "你熬過了回調，最終還有賺。你從此不會停止提起這件事。") : L("You hold all the way down. You're \"in it for the long term\" now.", "你一路持有到谷底。你現在是「長線投資者」了。"); } },
    ],
  };
}

// a title that fits the career you're in, for the mid-career promotion
// the big mid-career promotion skips you up the ladder when you have one, or just adds the title when you don't
const midRank = () => Math.min(topRank(), Math.max(s.rank + 1, s.track === "elite" ? 4 : 3));
const nextTitle = () => onLadder() ? rankName(midRank()) : s.track === "elite" ? L("Managing Director", "董事總經理") : s.track === "normie" ? L("Director", "總監") : L("Partner", "合夥人");
function takeTitle(title) {
  if (onLadder()) { s.rank = midRank(); refreshJob(); } else s.job = cat(title, " · ", s.job);
}

const EXTRA_MILESTONES = [
  {
    after: "college",
    milestone: {
      key: "summer", ages: [19, 19],
      build() {
        if (s.school === "none") return degenSummer();
        const canIntern = s.tier >= 3 || s.network >= 40;
        return {
          title: L("Your first university summer", "大學第一個暑假"),
          text: L("Three months off. Your classmates are split between internships, jobs and beaches.", "三個月假期。同學們有的去實習，有的去打工，有的去海灘。"),
          choices: [
            {
              label: L("An unpaid internship at a bank", "到銀行做無薪實習"), sub: L("Get the name on your CV", "履歷上有個名字"),
              locked: canIntern ? null : L("Locked, needs 40+ network or a family that knows people", "未解鎖，需要 40 以上人脈或認識人的家庭"),
              run() { s.network += 12; s.hustle += 4; s.cash -= Math.round(2000 * sc()); return L("You make 400 photocopies and one useful contact. The contact is worth it.", "你影印了 400 份文件，認識了一個有用的人。那個人值得。"); },
            },
            { label: L("A paid job at a call center", "到電話客服中心打工"), sub: L("Real money", "真金白銀"), run() { const pay = Math.round(3500 * sc()); s.cash += pay; s.hustle += 6; s.sanity -= 4; return L(`You earn ${fmt(pay)} and learn to stay calm while strangers shout at you. Excellent banking prep.`, `你賺了 ${fmt(pay)}，學會在陌生人對你大叫時保持冷靜。這是投行的絕佳預備。`); } },
            { label: L("Backpack around the world", "背囊環遊世界"), sub: L("You're only young once", "青春只有一次"), run() { s.cash -= Math.round(2500 * sc()); s.sanity += 14; s.network += 4; return L("You come back with a tan, a tattoo and three friends in three countries.", "你帶著一身古銅膚色、一個紋身，以及在三個國家的三個朋友回來。"); } },
          ],
        };
      },
    },
    variants: [
      () => {
        if (s.school === "none") return degenSummer();
        return {
          title: L("The case competition", "案例比賽"),
          text: L("A big bank is running a stock-pitch competition. The prize is cash and a guaranteed interview.", "一間大銀行舉辦股票推介比賽。獎品是現金和一個保證面試機會。"),
          choices: [
            {
              label: L("Enter with your three smartest friends", "跟三個最聰明的朋友組隊參加"), sub: L("Strong team", "強隊"), run() {
                s.hustle += 6;
                if (chance(0.35)) { const prize = Math.round(5000 * sc()); s.cash += prize; s.network += 14; return L(`You win! A ${fmt(prize)} share of the prize and a recruiter who knows your name.`, `你們贏了！你分得 ${fmt(prize)} 獎金，還有一個記得你名字的招聘官。`); }
                s.network += 5; return L("Second place. The judges loved your slides and your teammate's tie.", "第二名。評判很喜歡你們的簡報和你隊友的領呔。");
              },
            },
            {
              label: L("Carry a weaker team on your own", "獨力帶領一支較弱的隊伍"), sub: L("All the credit, all the work", "所有功勞，所有工作"), run() {
                s.sanity -= 10; s.hustle += 10;
                if (chance(0.2)) { s.network += 18; return L("Against all odds, you win. Everyone knows it was you.", "你們竟然贏了。人人都知道是你的功勞。"); }
                return L("You get knocked out in the first round, but the judges remember the kid who did everything.", "你們第一輪就出局，但評判記得那個包辦一切的學生。");
              },
            },
            { label: L("Skip it and sleep", "不參加，去睡覺"), sub: L("Rare", "罕見"), run() { s.sanity += 10; return L("You sleep nine hours a night for a month. You feel incredible and slightly behind.", "你連續一個月每晚睡九小時。你感覺好極了，只是有點落後。"); } },
          ],
        };
      },
      () => {
        if (s.school === "none") return degenSummer();
        return {
          title: L("The professor's offer", "教授的邀請"),
          text: L("Your economics professor offers you a summer job as a research assistant. It pays almost nothing.", "你的經濟學教授請你暑假做研究助理。人工幾乎是零。"),
          choices: [
            { label: L("Take it", "接受"), sub: L("Learn how markets really work", "了解市場真正如何運作"), run() { s.hustle += 10; s.network += 6; s.cash += Math.round(800 * sc()); return L("You clean 40 years of stock-market data and find a pattern nobody cares about. You care deeply.", "你整理了 40 年的股市數據，發現了一個沒有人關心的規律。你非常關心。"); } },
            {
              label: L("Join a friend's startup instead", "改為加入朋友的初創"), sub: L("Equity instead of pay", "以股權代替人工"), run() {
                s.hustle += 6;
                if (chance(0.15)) { const g = Math.round(40000 * sc()); s.cash += g; return L(`The startup gets bought by a bigger one. Your tiny stake is worth ${fmt(g)}.`, `初創被一間大公司收購了。你那一點點股份值 ${fmt(g)}。`); }
                return L("The startup becomes three people in a garage arguing about the logo. You learn a lot.", "初創最終變成三個人在車房裡爭論標誌設計。你學到很多。");
              },
            },
            { label: L("Work in the family business", "回家族生意幫手"), sub: L("Family first", "家人優先"), run() { s.cash += Math.round(1500 * sc()); s.sanity += 6; s.network += 3; return L("You learn more about cash flow in one summer than in a year of lectures.", "你一個暑假學到的現金流知識，比一年的課堂還多。"); } },
          ],
        };
      },
    ],
  },
  {
    after: "lifestyle",
    milestone: {
      key: "midcareer", ages: [32, 34],
      build() {
        const title = nextTitle();
        const odds = Math.min(0.85, 0.25 + s.network / 200 + s.hustle / 300);
        return {
          title: cat(L("Up for ", "爭取升任"), title),
          text: cat(L("This is the big one. There are three candidates for ", "這是最關鍵的一次。三個候選人爭奪"), title, L(", and one of them is you.", "，而你是其中之一。")),
          choices: [
            {
              label: L("Campaign for it hard", "全力爭取"), sub: UI.odds(odds), run() {
                s.sanity -= 12;
                if (chance(odds)) { s.income *= 1.5; s.network += 12; takeTitle(title); return cat(L("You got it. ", "你成功升任"), title, L(". Your parents tell everyone. Your hours somehow get longer.", "。爸媽告訴所有人。你的工時不知為何變得更長。")); }
                s.network -= 6; return L("Someone else gets it. They announce it in an email with three exclamation marks.", "別人得到了這個職位。公佈的電郵有三個感嘆號。");
              },
            },
            { label: L("Wait your turn", "耐心等待"), sub: L("Steady", "穩定"), run() { s.income *= 1.15; s.sanity += 4; return L("You don't get it this year, but you get a raise for being \"a great team player.\"", "你今年沒有升職，但因為是「出色的團隊成員」而獲得加薪。"); } },
            { label: L("Jump to a rival for the title", "跳槽到對手公司拿這個職銜"), sub: L("Faster, riskier", "更快，風險更高"), run() { s.income *= 1.3; s.network -= 5; takeTitle(title); return cat(L("A rival gives you the title straight away. You're ", "對手公司立即給你這個職銜。你現在是"), title, L(" now, just with fewer friends.", "了，只是朋友少了。")); } },
          ],
        };
      },
    },
    variants: [
      () => ({
        title: L("Poached", "被挖角"),
        text: L("A rival firm wants to hire your whole team at once, with you leading it. It's a big bet on you.", "一間對手公司想一次過挖走你整個團隊，由你帶領。這是押在你身上的一大注。"),
        choices: [
          {
            label: L("Lead the whole team over", "帶領整個團隊過檔"), sub: L("High stakes", "高風險"), run() {
              if (chance(0.55)) { s.income *= 1.6; s.network += 15; return L("The move works. Your team follows you and your pay jumps 60%. You're the boss now.", "過檔成功。團隊跟隨你，你的人工跳升六成。你現在是老闆了。"); }
              s.income *= 0.8; s.network -= 10; s.sanity -= 10;
              return L("Half the team backs out at the last minute. You arrive with two people and a lot to prove.", "一半隊員在最後一刻退出。你只帶著兩個人到任，還有很多需要證明。");
            },
          },
          { label: L("Go alone for a better deal", "獨自過檔換更好條件"), sub: L("Look after yourself", "照顧好自己"), run() { s.income *= 1.25; s.network -= 8; return L("You take the money. Your old team hears about it from LinkedIn.", "你拿了錢走人。舊團隊是從 LinkedIn 得知消息的。"); } },
          { label: L("Use it to get a counteroffer", "用來爭取挽留條件"), sub: L("Leverage", "談判籌碼"), run() { s.income *= 1.15; s.network += 4; return L("Your firm matches most of it. Nobody fully trusts you again, but you're richer.", "公司開出接近的條件挽留你。沒有人會再完全信任你，但你更有錢了。"); } },
        ],
      }),
      () => ({
        title: L("The wake-up call", "警鐘"),
        text: L("You collapse at your desk during a call. The doctors say it's not your heart. It's stress. This time.", "你在開電話會議時於辦公桌前暈倒。醫生說不是心臟問題，是壓力。這一次是。"),
        choices: [
          { label: L("Take a six-month sabbatical", "放六個月長假"), sub: L("Reset", "重新開始"), run() { s.cash -= Math.round(Math.max(0, s.income) * 0.5); s.sanity += 35; s.network -= 6; return L("You walk, sleep and cook. When you come back, you remember why you liked this job. Some of it.", "你散步、睡覺、煮飯。回來時，你記起了自己為何喜歡這份工作。至少一部分。"); } },
          { label: L("Move to a four-day week", "改為每星期工作四天"), sub: L("Less pay, more life", "少點錢，多點生活"), run() { s.income *= 0.8; s.sanity += 18; return L("Fridays are yours now. Your work is just as good, which annoys your boss.", "星期五現在屬於你了。你的工作質素一樣好，這反而令老闆很煩。"); } },
          { label: L("Back at your desk on Monday", "星期一照常返工"), sub: L("It was just stress", "只是壓力而已"), run() { s.hustle += 5; s.network += 4; s.sanity -= 12; return L("Your MD calls you \"a machine.\" You decide to take it as a compliment.", "你的 MD 叫你「機械人」。你決定把它當成稱讚。"); } },
        ],
      }),
    ],
  },
  {
    after: "crisis",
    milestone: {
      key: "legacy", ages: [59, 63],
      build() {
        if (s.cash < 2e5) return {
          title: L("What's it all for?", "這一切為了甚麼？"),
          text: L("You're nearly sixty. The fortune never quite came. You start thinking about what you can still leave behind.", "你快六十歲了，財富始終沒有真正到來。你開始思考自己還能留下甚麼。"),
          choices: [
            { label: L("Teach your family about money", "教家人理財"), sub: L("Break the cycle", "打破循環"), run() { s.sanity += 12; s.network += 4; return L("Your nephew opens his first index fund at 16. He'll have the head start you didn't.", "你的姪仔 16 歲就開了第一個指數基金戶口。他會有你沒有的起步優勢。"); } },
            { label: L("Start a side business", "開展副業"), sub: L("One more shot", "再搏一次"), run() { s.hustle += 8; if (chance(0.4)) { s.income += Math.round(20000 * sc()); return L("It works. Small, steady and yours.", "成功了。規模小、穩定，而且是你自己的。"); } s.cash -= Math.round(5000 * sc()); return L("It doesn't take off. You learn more from failing at 60 than you did at 22.", "生意沒有起色。60 歲失敗教會你的，比 22 歲時多。"); } },
            { label: L("Make peace with it", "與自己和解"), sub: L("Enough is enough", "知足"), run() { s.sanity += 18; return L("You stop checking the markets every hour. You're happier than most millionaires you've met.", "你不再每小時看一次股市。你比你見過的大多數百萬富翁都快樂。"); } },
          ],
        };
        const gift = Math.round(s.cash * 0.1);
        return {
          title: L("What's it all for?", "這一切為了甚麼？"),
          text: L(`You've built ${fmt(s.cash)}. Your accountant asks what you want it to do after you're gone.`, `你建立了 ${fmt(s.cash)} 的財富。會計師問你，希望這筆錢在你離開後做些甚麼。`),
          choices: [
            { label: L("Start a foundation", "成立基金會"), sub: UI.costs(gift), run() { s.cash -= gift; s.network += 15; s.sanity += 15; return L("Your foundation funds scholarships for kids from towns like the one you grew up in.", "你的基金會資助來自你成長那種小鎮的孩子讀書。"); } },
            { label: L("Set up a trust for your family", "為家人設立信託"), sub: L("Look after your own", "照顧自己人"), run() { s.cash -= Math.round(s.cash * 0.03); s.sanity += 8; return L("Your family is set for generations. You worry, a little, about what that does to them.", "你的家人幾代都不用愁。你有點擔心這會對他們有甚麼影響。"); } },
            { label: L("Keep compounding", "繼續複利滾存"), sub: L("Never stop", "永不停止"), run() { s.hustle += 6; s.cash += Math.round(s.cash * 0.04); return L("You decide the best legacy is a bigger number. Your accountant nods slowly.", "你認為最好的傳承就是一個更大的數字。會計師慢慢地點頭。"); } },
          ],
        };
      },
    },
    variants: [
      () => {
        if (s.cash >= 5e7) return {
          title: L("A sports team is for sale", "一支球隊待售"),
          text: L("A minority stake in a famous football club is for sale. It loses money every year. Everyone who owns one says it's the best thing they ever bought.",
            "一支著名足球會出售少數股權。球會每年都在蝕錢，但每個擁有球會的人都說這是他們買過最好的東西。"),
          choices: [
            { label: L("Buy the stake", "買下股權"), sub: UI.costs(s.cash * 0.15), run() { s.cash -= s.cash * 0.15; s.network += 20; s.sanity += 10; return L("You get a seat in the owner's box and opinions on every substitution.", "你在董事包廂有個座位，對每一次換人都有意見。"); } },
            { label: L("Buy the stadium's land instead", "改為買下球場的土地"), sub: L("Landlord to the landlords", "做業主的業主"), run() { if (chance(0.6)) { s.income += s.cash * 0.01; return L("The club pays you rent forever. Less glamorous, more profitable.", "球會永遠要向你交租。沒那麼風光，但更賺錢。"); } s.cash -= s.cash * 0.05; return L("The club moves to a new stadium. You now own a very large, empty field.", "球會搬到新球場，你現在擁有一大片空地。"); } },
            { label: L("Just buy season tickets", "只買季票"), sub: L("Normal fan", "普通球迷"), run() { s.sanity += 6; return L("Great seats, no board meetings. You still shout at the referee.", "好座位，不用開董事會。你仍然會對球證大叫。"); } },
          ],
        };
        return {
          title: L("Your kid's football team", "孩子的足球隊"),
          text: L("The local youth team needs a sponsor for new kits. The coach looks at you hopefully.", "本地少年足球隊需要贊助商購買新球衣。教練滿懷希望地看著你。"),
          choices: [
            { label: L("Sponsor the whole season", "贊助整個球季"), sub: UI.costs(4000 * sc()), run() { s.cash -= Math.round(4000 * sc()); s.network += 8; s.sanity += 10; return L("Your name is on every shirt. The team wins two games all season, and you go to every one.", "每件球衣都印著你的名字。球隊整季只贏了兩場，而你每場都到場。"); } },
            { label: L("Volunteer as assistant coach", "做義務助教"), sub: L("Time, not money", "付出時間，不是金錢"), run() { s.sanity += 14; s.hustle -= 2; return L("You teach eleven-year-olds to defend. It's harder than any deal you've ever closed.", "你教十一歲的小孩防守。這比你完成過的任何交易都難。"); } },
            { label: L("Politely decline", "禮貌地拒絕"), sub: L("Not your thing", "不是你那杯茶"), run() { s.sanity -= 2; return L("Another parent sponsors them. Their name is on every shirt.", "另一位家長贊助了，每件球衣都印著他的名字。"); } },
          ],
        };
      },
      () => ({
        title: L("Someone from your hometown", "來自家鄉的年輕人"),
        text: L(`A 22-year-old from ${s.home.en} writes to you. They want to break into finance, just like you did. They have no connections.`,
          `一個來自${s.home.zh}的 22 歲年輕人寫信給你。他想入行金融，就像當年的你一樣。他沒有任何人脈。`),
        choices: [
          { label: L("Hire them", "聘請他"), sub: L("Open the door", "為他打開大門"), run() { s.network += 10; s.sanity += 14; return L("They're brilliant, hungry and a little terrifying. They remind you of someone.", "他聰明、有衝勁，還有點令人害怕。他令你想起某個人。"); } },
          { label: L("Meet them for coffee", "約他喝咖啡"), sub: L("Advice is free", "建議是免費的"), run() { s.sanity += 6; s.network += 4; return L("You give them the advice you wish you'd had. They take notes like it's scripture.", "你給了他當年你希望得到的建議。他像抄經文一樣做筆記。"); } },
          { label: L("Don't reply", "不回覆"), sub: L("Too busy", "太忙"), run() { s.sanity -= 6; return L("You think about that email more than you expected to.", "你想起那封電郵的次數比你預期的多。"); } },
        ],
      }),
    ],
  },
];

// slot each new milestone in after the one it follows, so the schedule keeps its order
for (const extra of EXTRA_MILESTONES) {
  const i = MILESTONES.findIndex(m => m.key === extra.after);
  MILESTONES.splice(i + 1, 0, extra.milestone);
  MILESTONE_VARIANTS[extra.milestone.key] = extra.variants;
}

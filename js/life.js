// fixed scenes that happen at the same age in every life
const kid = (label, risk, result) => ({
  label, run() {
    s.risk += risk;
    if (risk > 0) s.hustle += 3; else if (risk < 0) s.sanity += 3; else s.network += 2;
    return typeof result === "function" ? result() : result;
  },
});

const MILESTONES = [
  // ---- childhood: each answer nudges you toward aggressive (+1) or passive (-1) ----
  {
    age: 2,
    build() {
      return {
        title: L("The toy on the top shelf", "最高層架上的玩具"),
        text: L("You're two. The best toy in the house is on the very top shelf, and nobody is watching.",
          "你兩歲。家裡最好玩的玩具放在書架最高那一層，而且沒有人在看著你。"),
        choices: [
          kid(L("Climb the bookshelf", "爬上書架"), 1,
            L("You make it to the top. The bookshelf doesn't survive. Neither does the toy. You regret nothing.",
              "你成功爬到頂。書架倒了，玩具也壞了。你毫不後悔。")),
          kid(L("Scream until an adult gets it for you", "大哭大叫，直到大人幫你拿"), 0,
            L("An adult hands it over within 30 seconds. Delegation. Leverage. You're a natural.",
              "不到 30 秒大人就把玩具遞給你。懂得分派工作、善用槓桿，你是天生的。")),
          kid(L("Play with the toys you already have", "玩手上已有的玩具"), -1,
            L(`You build a perfectly nice tower out of blocks. Your parents describe you as "easy."`,
              "你用積木砌了一座很不錯的塔。爸媽形容你「很好帶」。")),
        ],
      };
    },
  },
  {
    age: 6,
    build() {
      return {
        title: L("The marshmallow test", "棉花糖測試"),
        text: L("A researcher gives you one marshmallow. If you don't eat it for 15 minutes, you'll get two.",
          "研究員給你一粒棉花糖。只要你忍 15 分鐘不吃，就會得到兩粒。"),
        choices: [
          kid(L("Bet it on rock-paper-scissors for five", "用它跟研究員猜拳，贏了換五粒"), 1,
            L("You throw rock. The researcher throws paper. You leave with nothing and a lifelong love of the game.",
              "你出石頭，研究員出布。你兩手空空離開，卻從此愛上了賭。")),
          kid(L("Wait the 15 minutes for two", "乖乖等 15 分鐘換兩粒"), 0,
            L("The longest 15 minutes of your life. Two marshmallows. Delayed gratification unlocked.",
              "人生中最漫長的 15 分鐘。兩粒棉花糖到手，解鎖「延遲滿足」技能。")),
          kid(L("Eat it now. A sure thing is a sure thing.", "馬上吃掉，到手的才是真的"), -1,
            L("One marshmallow in hand beats two in theory. It's delicious. You feel no regret.",
              "手上一粒勝過理論上的兩粒。很好吃，你一點也不後悔。")),
        ],
      };
    },
  },
  {
    age: 10,
    build() {
      return {
        title: L("Playground card trading", "操場上的卡牌交易"),
        text: L("Everyone at school is trading collectible cards. Prices are set by vibes and whoever is loudest.",
          "全校都在交換收藏卡。價格全憑感覺，誰叫得最大聲誰說了算。"),
        choices: [
          kid(L("Trade your whole collection for one ultra-rare card", "用全部收藏換一張超稀有卡"), 1,
            L("Half the class calls you a genius and half calls you an idiot. The card's value swings daily. You love it.",
              "半班同學說你是天才，另一半說你是白痴。那張卡的價值每天都在大起大跌，你愛死了。")),
          kid(L("Make a few smart trades", "做幾單聰明的交易"), 0,
            L("You grow your collection slowly and fairly. Teachers ask you to settle trade disputes.",
              "你的收藏慢慢、公平地增長。老師甚至請你調解同學的交易糾紛。")),
          kid(L("Never trade. Keep everything in protective sleeves.", "絕不交易，全部套上保護套收好"), -1,
            L("Your collection is in mint condition. You have never actually played the game.",
              "你的收藏全新無損。你從來沒有真正玩過這個遊戲。")),
        ],
      };
    },
  },
  {
    age: 14,
    build() {
      return {
        title: L("Your first $200", "你的第一個 $200"),
        text: L("Birthday money plus a summer of chores. It's the most money you've ever had.",
          "生日利是加上一個暑假的家務錢。這是你人生中擁有過最多的錢。"),
        choices: [
          kid(L(`Put it all on a friend's "guaranteed" sports bet`, "全部押在朋友「穩贏」的球賽上"), 1, () => chance(0.5)
            ? L("It hits! $400. You are now unbearable and permanently hooked on the rush.", "贏了！$400。你從此變得很討厭，而且對這種刺激上癮了。")
            : L("It doesn't hit. $0. Somehow you're already planning the next one.", "輸了，$0。但你已經在計劃下一注。")),
          kid(L("Spend half, save half", "一半花掉，一半存起來"), 0,
            L("New sneakers and $100 in the bank. Very reasonable. Your parents are suspicious.",
              "一雙新波鞋，加上銀行裡的 $100。非常合理，合理到爸媽都起疑了。")),
          kid(L("Open a savings account", "開一個儲蓄戶口"), -1,
            L("It earns 0.5% a year. You check the balance every day anyway.",
              "年利率 0.5%。你還是每天都查一次結餘。")),
        ],
      };
    },
  },
  {
    age: 15,
    build() {
      s.job = JOBS.highSchool;
      const intro = s.c.hub >= 2
        ? L(`Your older cousin just started at a big bank and won't stop saying "deal flow" at dinner.`,
          "你的表哥剛進了一家大銀行，吃飯時不停把「deal flow」掛在嘴邊。")
        : L("A bootleg copy of The Wolf of Wall Street is going around your school. You watch it eleven times.",
          "學校裡流傳著一張《華爾街狼人》的翻版碟。你看了十一次。");
      return {
        title: L("You discover finance", "你發現了金融"),
        text: cat(intro, L(" You've found your calling.", "你找到了人生的使命。")),
        choices: [
          {
            label: L("Memorize every Wolf of Wall Street monologue", "背熟《華爾街狼人》每一段獨白"), sub: L("Hustle up, teachers concerned", "拼勁上升，老師擔心"),
            run() {
              s.hustle += 10; s.sanity -= 3;
              return L("You can now sell a pen to anyone. You tried it on your grandma. She bought two.", "你現在可以把一支筆賣給任何人。你試過賣給嫲嫲，她買了兩支。");
            },
          },
          {
            label: L("Read Warren Buffett's shareholder letters", "讀巴菲特的致股東信"), sub: L("The respectable choice", "最體面的選擇"),
            run() {
              s.hustle += 5; s.network += 3; s.flags.value = true;
              return L(`You start saying "margin of safety" at family dinners. Nobody asked.`, "你開始在家庭飯局上說「安全邊際」。沒有人問你。");
            },
          },
          {
            label: L("Start a sneaker-reselling empire", "建立炒波鞋帝國"), sub: L("Your first P&L", "你的第一份損益表"),
            run() {
              if (chance(0.6)) {
                const gain = Math.round(rnd(1500, 6000) * (0.4 + 0.15 * s.c.g));
                s.cash += gain; s.hustle += 6;
                return L(`You flipped 40 pairs of sneakers for a ${fmt(gain)} profit. Your margins would make a hedge fund blush.`,
                  `你炒賣了 40 對波鞋，賺了 ${fmt(gain)}。你的利潤率連對沖基金都會臉紅。`);
              }
              s.cash -= 500; s.sanity -= 5;
              return L("Turns out the deadstock was fake. All of it. Your first write-down.", "原來那批「全新」貨全是假貨。你人生第一次撇帳。");
            },
          },
        ],
      };
    },
  },
  {
    age: 18,
    build() {
      const p = 0.03 + s.tier * 0.07 + s.hustle / 400 + s.network / 400 + s.c.hub * 0.03;
      const local = Math.round(15000 * (0.3 + 0.175 * s.c.g));
      return {
        title: L("College applications", "申請大學"),
        text: L("In finance, where you went to school matters more than anything you learn there.",
          "在金融界，你讀哪間學校，比你在那裡學到甚麼重要得多。"),
        choices: [
          {
            label: L("Apply to a target school (Ivy / Oxbridge / LSE)", "申請目標名校（常春藤／牛劍／LSE）"), sub: UI.odds(p),
            run() {
              s.job = JOBS.student;
              if (chance(p)) {
                s.school = "target"; s.network += 20;
                if (s.tier >= 4) return L("You're in. The new library wing has your family's name on it, which is purely a coincidence.", "你被錄取了。新圖書館翼樓剛好以你的家族命名，純屬巧合。");
                const loan = Math.round(60000 * (0.3 + 0.175 * s.c.g));
                s.cash -= loan;
                return L(`You're in! You also took on ${fmt(loan)} in loans, but the alumni network is priceless (it costs money).`,
                  `你被錄取了！你同時背上了 ${fmt(loan)} 學債，但校友網絡無價（其實很貴）。`);
              }
              s.school = "nontarget"; s.network += 4; s.cash -= local; s.sanity -= 5;
              return L(`Rejected. You go to State U and tell everyone it was a "strategic choice."`, "被拒絕了。你去了本地大學，逢人就說這是「策略性選擇」。");
            },
          },
          {
            label: L("Study accounting at the local university", "在本地大學讀會計"), sub: L("Safe, solid, deeply unsexy", "安全、穩陣、毫無性感可言"),
            run() {
              s.school = "nontarget"; s.job = JOBS.student; s.network += 6; s.hustle += 4; s.cash -= local;
              return L("Debits on the left, credits on the right. You own a calculator that costs more than your laptop.", "借方在左，貸方在右。你的計數機比你的手提電腦還貴。");
            },
          },
          {
            label: L("Skip college. Trade crypto from your bedroom.", "不讀大學，在睡房炒幣"), sub: L("High risk, high vibes", "高風險，高感覺"),
            run() {
              s.school = "none"; s.track = "degen"; s.job = JOBS.bedroom;
              if (chance(0.45)) {
                const gain = Math.round(rnd(20000, 250000));
                s.cash += gain; s.network += 8;
                return L(`You bought a dog-themed coin at $0.0002. Up ${fmt(gain)}. You are now insufferable online.`,
                  `你在 $0.0002 買入了一隻狗狗幣。賺了 ${fmt(gain)}。你在網上變得令人難以忍受。`);
              }
              const loss = Math.max(2000, s.cash * 0.6);
              s.cash -= loss; s.sanity -= 10;
              return L(`Rug pulled. Down ${fmt(loss)}. "It's not a loss until you sell," you say, having been forced to sell.`,
                `被跑路了，蝕了 ${fmt(loss)}。「未賣出都不算蝕」，你說，然後被迫賣出。`);
            },
          },
        ],
      };
    },
  },
  {
    age: 20,
    build() {
      if (s.school === "none") {
        return {
          title: L("Your Discord has 4,000 members", "你的 Discord 有 4,000 名成員"),
          text: L(`Your mom wants to know what a "liquidity pool" is. You've been awake for 31 hours.`,
            "媽媽想知道甚麼是「流動性池」。你已經 31 小時沒睡了。"),
          choices: [
            {
              label: L("Launch your own token, $BRO", "發行自己的代幣 $BRO"), sub: L("Regulators love this one trick", "監管機構最愛這一招"),
              run() {
                s.heat += 25;
                if (chance(0.35)) {
                  const gain = Math.round(rnd(200000, 2000000));
                  s.cash += gain; s.network += 10;
                  return L(`$BRO pumps 4,000%. You "take some chips off the table" (all of the chips). +${fmt(gain)}.`,
                    `$BRO 暴漲 4,000%。你「先套現一部分」（其實是全部）。+${fmt(gain)}。`);
                }
                s.cash -= 10000; s.network -= 10;
                return L(`$BRO goes to zero in 40 minutes. Your Discord renames you "Exit Liquidity Guy."`,
                  "$BRO 在 40 分鐘內歸零。你的 Discord 把你改名為「接盤俠」。");
              },
            },
            {
              label: L("Become a finance influencer", "成為財經網紅"), sub: L("Rent a Lambo for the thumbnail", "租架林寶堅尼拍封面"),
              run() {
                s.network += 18; s.sanity -= 8; s.flags.influencer = true;
                return L(`You post "Day 1 of building generational wealth" in front of a rented Lambo. 40k followers.`,
                  "你在租來的林寶堅尼前發帖：「建立跨代財富第一天」。4 萬人追蹤。");
              },
            },
            {
              label: L("Fine. Go back to school.", "算了，回去讀書"), sub: L("Pivot to respectability", "轉型做正經人"),
              run() {
                s.school = "nontarget"; s.track = null; s.job = JOBS.student; s.cash -= 10000;
                return L(`You enroll at State U as a 20-year-old freshman who has "seen things."`, "你以 20 歲之齡入讀本地大學，是個「見過世面」的新生。");
              },
            },
          ],
        };
      }
      const base = (s.school === "target" ? 45 : 12) + s.c.hub * 7 + s.network / 5;
      return {
        title: L("Recruiting season", "招聘季節"),
        text: L(`Junior-year internships decide everything. Every finance bro you know is doing "coffee chats."`,
          "大三實習決定一切。你認識的每個金融佬都在約人「喝咖啡」。"),
        choices: [
          {
            label: L("50 coffee chats in 6 weeks", "6 星期內約 50 個人喝咖啡"), sub: L("Network up, sanity down", "人脈上升，理智下降"),
            run() {
              s.network += 12; s.sanity -= 15; s.score = base + 15 + s.hustle / 6;
              return L(`You've heard 50 people's "story." There is now cold brew where your blood used to be.`, "你聽了 50 個人的「心路歷程」。你的血管裡流的已經是冷萃咖啡。");
            },
          },
          {
            label: L("Call Dad's golf buddy", "打電話給爸爸的高爾夫球友"), sub: L("Depends heavily on Dad", "很視乎你爸爸是誰"),
            run() {
              if (s.tier >= 4) {
                s.score = base + 50; s.network += 8;
                return L(`An internship materializes. It's not nepotism, it's "relationship-driven origination."`, "實習機會從天而降。這不是裙帶關係，是「關係驅動型業務開發」。");
              }
              s.score = base; s.sanity -= 5;
              return L("Dad's golf buddy is Gary, who runs a hardware store. He offers you a summer job restocking hinges.",
                "爸爸的球友是開五金舖的 Gary。他請你暑假去補貨，排鉸鏈。");
            },
          },
          {
            label: L("Spray 400 applications on LinkedIn", "在 LinkedIn 亂投 400 份履歷"), sub: L("A numbers game", "數字遊戲"),
            run() {
              s.score = base + rnd(0, 30); s.sanity -= 6;
              return s.score > 60
                ? L("One of 400 actually called back. A genuine miracle.", "400 份之中竟然有一份回覆。真正的奇蹟。")
                : L("398 auto-rejections, 2 ghostings. The algorithm has spoken.", "398 封自動拒絕信，2 間已讀不回。演算法已經表態。");
            },
          },
        ],
      };
    },
  },
  {
    age: 22,
    build() {
      if (!s.score) s.score = (s.school === "target" ? 45 : s.school === "nontarget" ? 12 : 0) + s.c.hub * 7 + s.network / 5;
      const score = Math.round(s.score);
      const m = mult();
      const offers = [
        {
          need: 65, label: L("Investment Banking Analyst", "投資銀行分析師"), sub: L("$$$, 100-hour weeks", "$$$，每星期 100 小時"),
          run() {
            const move = moveToHub(); setJob(JOBS.ib, "elite", 70000); s.sanity -= 15; s.hustle += 5;
            return cat(move, L("Your new company phone now owns your soul. First bonus is in 12 months, if you survive.", "公司配的新手機從此擁有你的靈魂。第一份花紅在 12 個月後，如果你撐得到。"));
          },
        },
        {
          need: 50, label: L("Sales & Trading Analyst", "銷售及交易分析師"), sub: L("Yell at screens professionally", "專業對住螢幕大叫"),
          run() {
            const move = moveToHub(); setJob(JOBS.trader, "elite", 60000); s.sanity -= 8;
            return cat(move, L(`You yell "BUY" at a screen on day one. It feels incredible.`, "上班第一天你就對著螢幕大叫「買！」。感覺好得難以置信。"));
          },
        },
        {
          need: 25, label: L("Big 4 Auditor", "四大會計師行核數師"), sub: L("Stable, spreadsheet-shaped", "穩定，形狀像試算表"),
          run() {
            setJob(JOBS.auditor, "normie", 15000 * m); s.sanity -= 5;
            return L("You spend February counting inventory in a frozen warehouse. Character-building.", "你整個二月都在冰凍倉庫裡點存貨。很磨練意志。");
          },
        },
        {
          need: 0, label: L("Personal banker at a local branch", "本地分行的客戶經理"), sub: L("Sell credit cards, wear a lanyard", "推銷信用卡，掛著職員證"),
          run() {
            setJob(JOBS.banker, "normie", 8000 * m);
            return L("You sell credit cards to people who don't need them. Disturbingly, you're great at it.", "你向不需要信用卡的人推銷信用卡。可怕的是，你非常擅長。");
          },
        },
        {
          need: 0, label: L(`Crypto startup ("Goldman, but on-chain")`, "加密貨幣初創（「鏈上版高盛」）"), sub: L("Paid in tokens", "用代幣出糧"),
          run() {
            setJob(JOBS.crypto, "degen", 10000); s.heat += 5;
            return L("Your salary is mostly tokens. The tokens are mostly vibes.", "你的人工大部分是代幣，而代幣大部分是感覺。");
          },
        },
      ];
      if (s.flags.influencer) offers.push({
        need: 0, label: L("Full-time finfluencer", "全職財經網紅"), sub: L("Courses, affiliate links, a ring light", "網上課程、推廣連結、一盞環形燈"),
        run() {
          setJob(JOBS.finfluencer, "degen", rnd(10000, 90000)); s.network += 5;
          return L("You launch a $997 course on how to get rich by selling courses.", "你推出一個 $997 的課程，教人如何靠賣課程致富。");
        },
      });
      return {
        title: L("The job offers are in", "工作邀約來了"),
        text: L(`Your recruiting score is <b>${score}</b>. The best jobs are only open to the people the industry already likes.`,
          `你的招聘分數是 <b>${score}</b>。最好的工作只留給這個行業本來就喜歡的人。`),
        choices: offers.map(o => ({ ...o, locked: score < o.need ? L(`Locked, needs a recruiting score of ${o.need}`, `未解鎖，需要招聘分數 ${o.need}`) : null })),
      };
    },
  },
  {
    age: 24,
    build() {
      if (s.track === "elite") return {
        title: L("2:47am, Saturday", "星期六，凌晨 2:47"),
        text: L(`Your VP needs "a few quick turns" on a 90-page deck by 7am. It's your third weekend in a row.`,
          "你的 VP 要你在早上 7 點前把一份 90 頁的簡報「快快改幾版」。這已是你連續第三個週末。"),
        choices: [
          {
            label: L("Pull another all-nighter", "再通宵一晚"), sub: L("The banker's way", "投行人的方式"),
            run() {
              s.network += 8; s.hustle += 5; s.sanity -= 15;
              return L("The deck is perfect. The deal dies on Monday. Nobody ever opens it.", "簡報完美無瑕。交易在星期一告吹，沒有人打開過它。");
            },
          },
          {
            label: L("Fake food poisoning", "扮食物中毒"), sub: L("Risky", "有風險"), run() {
              if (chance(0.6)) {
                s.sanity += 8;
                return L(`Your VP replies "feel better!" and sends the deck to someone else. You sleep 14 hours.`, "VP 回覆「早日康復！」，然後把簡報交給別人。你睡了 14 小時。");
              }
              s.network -= 12; s.sanity -= 5;
              return L(`Your VP saw your Instagram story from the bar. Your next review mentions "commitment."`, "VP 看到你在酒吧發的 IG Story。你下次的考核提到「投入程度」。");
            },
          },
          {
            label: L("Have an AI build the deck", "叫 AI 幫你做簡報"), sub: L("Work smarter", "聰明地工作"), run() {
              if (chance(0.5)) {
                s.sanity += 10; s.hustle += 3;
                return L("Done in 20 minutes. You bill six hours and go to sleep.", "20 分鐘搞掂。你報了六小時工時，然後去睡覺。");
              }
              s.network -= 15;
              return L("The AI made up a $40B EBITDA figure. The client noticed. Your MD noticed. Everyone noticed.", "AI 憑空捏造了一個 $400 億的 EBITDA。客戶發現了，你的 MD 發現了，所有人都發現了。");
            },
          },
        ],
      };
      if (s.track === "normie") return {
        title: L("Busy season", "旺季"),
        text: L("You've been reconciling the books of a frozen-fish distributor for three weeks straight.",
          "你已經連續三個星期在對一間急凍魚批發商的數。"),
        choices: [
          {
            label: L("Grind for the promotion", "為升職拼命"), sub: L("Pay up a little", "人工加一點"),
            run() {
              s.hustle += 8; s.sanity -= 10; s.income += 5000 * mult();
              return L("Promoted to Senior! Your raise is 4%. Inflation was 5%.", "升了做 Senior！加薪 4%，通脹 5%。");
            },
          },
          {
            label: L("Start studying for the CFA at night", "晚上開始溫習 CFA"), sub: L("900 hours of self-improvement", "900 小時的自我提升"),
            run() {
              s.flags.cfa = true; s.sanity -= 12; s.hustle += 6;
              return L("Level 1: passed. Only two more levels and 600 hours to go. Your friends have stopped inviting you to things.", "第一級：合格。只剩兩級和 600 小時。朋友已經不再約你出去。");
            },
          },
          {
            label: L("Quiet quit", "安靜離職"), sub: L("Log off at 5pm sharp", "五點準時收工"),
            run() {
              s.sanity += 15; s.hustle -= 8;
              return L("Your sanity returns. Your career does not.", "你的理智回來了，你的事業卻沒有。");
            },
          },
        ],
      };
      return {
        title: L("The market is ripping", "市場瘋狂上漲"),
        text: L("Everyone in your group chat is a genius. Your barber is giving you trading tips.",
          "群組裡每個人都是天才。連你的理髮師都在給你貼士。"),
        choices: [
          {
            label: L("100x leverage on a coin you heard about 4 minutes ago", "用 100 倍槓桿買一隻 4 分鐘前才聽過的幣"), sub: L("YOLO", "搏一鋪"), run() {
              if (chance(0.3)) {
                const gain = Math.max(50000, s.cash * 1.5); s.cash += gain;
                return L(`Your liquidation price was a cent away. You made ${fmt(gain)} and learned nothing.`, `距離爆倉價只差一仙。你賺了 ${fmt(gain)}，甚麼也沒學到。`);
              }
              const loss = Math.max(20000, s.cash * 0.7); s.cash -= loss; s.sanity -= 15;
              return L(`Liquidated in the time it took to microwave a burrito. -${fmt(loss)}.`, `叮一個墨西哥卷的時間你就爆倉了。-${fmt(loss)}。`);
            },
          },
          {
            label: L("Diversify (into 14 other memecoins)", "分散投資（到另外 14 隻迷因幣）"), sub: L("Risk management", "風險管理"), run() {
              const r = rnd(0.5, 1.9); s.cash = s.cash > 0 ? s.cash * r : s.cash;
              return r > 1
                ? L(`Eleven went to zero but one did a 30x. You call this "portfolio construction."`, "十一隻歸零，但有一隻升了 30 倍。你稱之為「投資組合建構」。")
                : L("Diversification works: they all went down together.", "分散投資很有效：它們一起跌。");
            },
          },
          {
            label: L(`Finance a Lambo "for content"`, "分期買林寶堅尼「拍片用」"), sub: L("19% APR, but the engagement", "年利率 19%，但互動率很高"),
            run() {
              s.cash -= 180000; s.network += 15; s.sanity += 5;
              return L("The engagement is incredible. The monthly payment is also incredible.", "互動率高得驚人。每月供款也高得驚人。");
            },
          },
        ],
      };
    },
  },
  {
    age: 26,
    build() {
      if (s.track === "elite") {
        const pe = Math.min(0.85, 0.2 + s.network / 150 + (s.school === "target" ? 0.15 : 0));
        return {
          title: L("Exit opportunities", "跳槽機會"),
          text: L(`Two years in. Headhunters keep calling. Everyone says the analyst program is "a great launchpad" (for leaving).`,
            "入行兩年，獵頭不停打來。人人都說分析師計劃是「很好的跳板」（用來離開）。"),
          choices: [
            {
              label: L("Jump to private equity", "跳去私募股權"), sub: UI.odds(pe), run() {
                if (chance(pe)) {
                  setJob(JOBS.pe, "elite", 180000); s.sanity -= 5; s.network += 10;
                  return L(`You now "add value" to companies by firing 30% of their staff. Your parents are very proud.`, "你現在靠裁走公司三成員工來「創造價值」。爸媽非常驕傲。");
                }
                setJob(JOBS.ibAssoc, "elite", 120000); s.sanity -= 8;
                return L("Every PE fund ghosted you. You get promoted to Associate instead. Same hours, more emails.", "所有私募基金都已讀不回。你反而升了做 Associate。工時一樣，電郵更多。");
              },
            },
            {
              label: L("MBA at a top business school", "到頂尖商學院讀 MBA"), sub: L(`$250k for two years of "networking"`, "花 $250k 換兩年「建立人脈」"),
              run() {
                s.cash -= 250000; s.network += 25; s.sanity += 10; setJob(JOBS.mbaVp, "elite", 160000);
                return L("Two years of case competitions and open bars in matching vests. You come back as a VP.", "兩年的案例比賽和任飲派對，大家穿著同款背心。你回來時已是 VP。");
              },
            },
            {
              label: L("Quit to start a fintech startup", "辭職創辦金融科技公司"), sub: L("1 in 5 make it", "五個有一個成功"), run() {
                if (chance(0.2)) {
                  const exit = Math.round(rnd(2e6, 3e7)); s.cash += exit; setJob(JOBS.angel, "elite", 150000); s.network += 15;
                  return L(`A big bank acquires you for a ${fmt(exit)} payday. Your "world-changing" app is now a tab buried inside their app.`,
                    `一間大銀行以 ${fmt(exit)} 收購了你。你那個「改變世界」的 app 現在只是他們 app 裡一個不起眼的分頁。`);
                }
                s.cash -= 50000; s.sanity -= 10; setJob(JOBS.bankPm, "normie", 90000);
                return L("You ran out of runway in 18 months. The pitch deck was beautiful, though. You take a product job at a bank.", "18 個月後資金燒光。不過融資簡報真的很漂亮。你去了銀行做產品經理。");
              },
            },
          ],
        };
      }
      if (s.track === "normie") {
        const cfa = Math.min(0.85, (s.flags.cfa ? 0.45 : 0.25) + s.hustle / 300);
        return {
          title: L("Career crossroads", "事業十字路口"),
          text: L("Your college friends in banking post photos from Mykonos. You post a photo of a reconciled ledger.",
            "在投行工作的大學同學在 Mykonos 打卡。你上載了一張對好數的分類帳。"),
          choices: [
            {
              label: L("Grind out the full CFA", "咬緊牙關考完 CFA"), sub: UI.odds(cfa), run() {
                if (chance(cfa)) {
                  setJob(JOBS.pm, "normie", 40000 + 60000 * mult()); s.network += 10;
                  return L("You're a CFA charterholder now. It goes in your email signature. Forever.", "你現在是 CFA 持證人了。這會永遠留在你的電郵簽名裡。");
                }
                s.sanity -= 15;
                return L("Failed Level 3. Only about half of people pass it. You take it extremely personally.", "第三級肥佬。合格率只有大約一半，你卻非常耿耿於懷。");
              },
            },
            {
              label: L("MBA to break into banking", "讀 MBA 擠進投行"), sub: L("$250k ticket to the big leagues", "$250k 的大聯盟入場券"),
              run() {
                s.cash -= 250000; s.network += 25; const move = moveToHub(); setJob(JOBS.mbaAssoc, "elite", 110000);
                return cat(move, L("You swap your lanyard for a vest. You are finally one of them.", "你把職員證換成背心。你終於成為他們的一份子。"));
              },
            },
            {
              label: L("Become a LinkedIn thought leader", "成為 LinkedIn 思想領袖"), sub: L("Agree?", "同意嗎？"),
              run() {
                s.network += 20; s.sanity -= 5; s.income += 10000;
                return L(`Your post "What my dog taught me about B2B SaaS" gets 40k likes. Agree?`, "你的帖文《我的狗教會我的 B2B SaaS 道理》獲得 4 萬個讚。同意嗎？");
              },
            },
          ],
        };
      }
      return {
        title: L("Your crypto era, year five", "你的加密時代，第五年"),
        text: L(`You've survived three cycles and two exchange collapses. Your bio says "early."`,
          "你捱過了三個週期和兩次交易所倒閉。你的簡介寫著「早期參與者」。"),
        choices: [
          {
            label: L("Raise a fund from your followers", "向粉絲集資成立基金"), sub: L("What could go wrong", "會出甚麼事呢"),
            run() {
              s.heat += 20; setJob(JOBS.cryptoGp, "degen", rnd(50000, 600000)); s.network += 10;
              return L(`You raise $40M from people who call you "king" in the comments. The due diligence was a poll.`, "你從一班在留言區叫你「皇上」的人手上籌得 $4,000 萬。盡職審查是一個投票。");
            },
          },
          {
            label: L("Rebrand everything as AI", "把一切重新包裝成 AI"), sub: L("Narrative is everything", "故事就是一切"), run() {
              if (chance(0.4)) {
                const gain = Math.round(rnd(1e6, 1e7)); s.cash += gain;
                return L(`Your token is now an "AI agent." Number goes up. +${fmt(gain)}.`, `你的代幣現在是「AI 代理」了。數字上升。+${fmt(gain)}。`);
              }
              s.cash -= 30000;
              return L("Nobody believes your memecoin is AI. Not even the AI.", "沒有人相信你的迷因幣是 AI，連 AI 自己都不信。");
            },
          },
          {
            label: L("Get a real job", "找份正經工作"), sub: L("Sell out", "向現實低頭"),
            run() {
              setJob(JOBS.compliance, "normie", 30000 * mult()); s.sanity += 10; s.heat = Math.max(0, s.heat - 10);
              return L("Ironically, you're now in compliance. You know every trick in the book because you invented half of them.", "諷刺的是，你現在做合規。你懂得所有招數，因為有一半是你發明的。");
            },
          },
        ],
      };
    },
  },
  {
    age: 29,
    build() {
      return {
        title: L("A text from your college roommate", "大學室友的短訊"),
        text: L(`He's a lawyer at a big M&A firm now. <i>"big news on $ACME tmrw 👀 don't tell anyone"</i>`,
          "他現在是大型併購律師行的律師。<i>「$ACME 聽日有大消息 👀 唔好話俾人知」</i>"),
        choices: [
          {
            label: L("Load up on $ACME call options", "大手買入 $ACME 認購期權"), sub: L("Totally legal, probably", "應該完全合法吧"),
            run() {
              const gain = Math.max(80000, s.cash * 0.4); s.cash += gain; s.heat += 45;
              return L(`$ACME jumps 60% on merger news. You made ${fmt(gain)}. Your phone buzzes. It's just Uber Eats. This time.`,
                `$ACME 因合併消息急升 60%。你賺了 ${fmt(gain)}。電話震了一下，只是外賣到了。這一次是。`);
            },
          },
          {
            label: L("Report it to compliance", "向合規部舉報"), sub: L("The right thing", "做正確的事"),
            run() {
              s.network -= 8; s.sanity += 8;
              return L("Compliance thanks you with a branded water bottle. Your roommate unfollows you everywhere.", "合規部送你一個印有公司標誌的水樽以示感謝。你的室友在所有平台取消追蹤你。");
            },
          },
          {
            label: L("Leave him on read", "已讀不回"), sub: L("Not your problem", "不關你事"),
            run() {
              s.sanity += 2;
              return L("You watch $ACME jump 60% from the sidelines. You will think about this in the shower for years.", "你在場邊看著 $ACME 急升 60%。往後很多年你洗澡時都會想起這件事。");
            },
          },
        ],
      };
    },
  },
  {
    age: 32,
    build() {
      const cost = Math.round(Math.max(30000, s.cash * 0.05));
      return {
        title: L("Lifestyle creep", "生活水平通脹"),
        text: s.cash > 1e6
          ? L("You've made it. Sort of. Everyone at the gym seems to have made it more.", "你算是成功了。只是健身室裡每個人好像都比你更成功。")
          : L("Everyone at work seems richer than you. They probably aren't. They just have better vests.", "公司裡每個人好像都比你有錢。其實未必，他們只是背心比較好看。"),
        choices: [
          {
            label: L("Hamptons share, a Rolex, and the vest", "合租 Hamptons 別墅、買勞力士、買背心"), sub: UI.costs(cost),
            run() {
              s.cash -= cost; s.network += 15; s.sanity += 5;
              return L(`You spend ${fmt(cost)} to stand in a backyard with the same people from the office.`, `你花了 ${fmt(cost)}，在後花園跟辦公室裡同一班人站在一起。`);
            },
          },
          {
            label: L("5am club, cold plunges, an Ironman", "五點起床、冰水浴、鐵人三項"), sub: L("Optimize the human", "優化人體"),
            run() {
              s.hustle += 12; s.sanity += chance(0.5) ? 8 : -8;
              return L(`You talk about your VO2 max at dinner. Your date leaves to "take a call."`, "你在晚飯時大談你的最大攝氧量。你的約會對象說要「聽個電話」然後離開了。");
            },
          },
          {
            label: L("Go to therapy", "去看心理治療"), sub: L("$15k a year", "每年 $15k"),
            run() {
              s.cash -= 15000; s.sanity += 30;
              return L(`Your therapist asks, "What are you actually optimizing for?" You don't have a model for that.`, "治療師問你：「你究竟在優化甚麼？」你沒有為此建過模型。");
            },
          },
        ],
      };
    },
  },
  {
    age: 36,
    build() {
      const base = Math.max(0, s.cash);
      const canFund = s.track === "elite" && s.network >= 55;
      const fundOdds = Math.min(0.8, 0.3 + s.hustle / 400 + s.network / 400);
      return {
        title: L("The conviction trade", "信念交易"),
        text: s.cash > 0
          ? L(`You've got ${fmt(s.cash)} and a strong opinion about the market.`, `你手上有 ${fmt(s.cash)}，而且對市場有很強烈的看法。`)
          : L("You have negative money but positive conviction.", "你的錢是負數，但信心是正數。"),
        choices: [
          {
            label: L("Leveraged long on AI stocks", "用槓桿做多 AI 股"), sub: L("55/45 on your whole portfolio", "全副身家，五五波（55/45）"), run() {
              if (chance(0.55)) { s.cash += base * 1.5; return L(`The AI trade rips. You start every sentence with "as I predicted."`, "AI 交易大升。你每句話都以「正如我所料」開頭。"); }
              s.cash -= base * 0.6; s.sanity -= 10;
              return L("The AI bubble pops. Turns out revenue matters.", "AI 泡沫爆破。原來收入是重要的。");
            },
          },
          {
            label: L("Short the whole market. It's a bubble.", "沽空整個市場，這是泡沫"), sub: L("1 in 4 shot at glory", "四分一機會名留青史"), run() {
              if (chance(0.25)) { s.cash += base * 2.5; return L("The Big Short, starring you. Christian Bale was unavailable to play you in the movie.", "《沽注一擲》由你主演。基斯頓貝爾檔期太滿，演不了你。"); }
              s.cash -= base * 0.45; s.sanity -= 8;
              return L("The market can stay irrational longer than you can stay solvent.", "市場保持不理性的時間，可以比你保持不破產的時間更長。");
            },
          },
          {
            label: L("Index funds. Boring is beautiful.", "指數基金，悶就是美"), sub: L("Steady", "穩定"),
            run() {
              s.cash += base * 0.25; s.sanity += 5;
              return L("You make 25%. Nobody wants to hear about it at parties.", "你賺了 25%。派對上沒有人想聽。");
            },
          },
          {
            label: L("Launch your own hedge fund", "成立自己的對沖基金"), sub: UI.odds(fundOdds),
            locked: canFund ? null : L("Locked, needs an elite finance career and 55+ network", "未解鎖，需要精英金融事業及 55 以上人脈"),
            run() {
              if (chance(fundOdds)) {
                setJob(JOBS.hf, "elite", rnd(2e6, 8e6)); s.network += 15;
                return L("You raise $2B. Two-and-twenty on someone else's pension fund. You buy a sports-team minority stake.", "你籌得 $20 億。從別人的退休金抽「二八收費」。你買了一支球隊的少數股權。");
              }
              s.cash -= base * 0.2; s.sanity -= 15; setJob(JOBS.consultant, "elite", 50000);
              return L(`The fund closes after 18 months. You're "taking some time to reflect" (unemployed).`, "基金 18 個月後清盤。你正在「花點時間沉澱」（失業中）。");
            },
          },
        ],
      };
    },
  },
  {
    age: 40,
    pre() {
      if (s.heat > 0 && chance(Math.min(0.7, s.heat / 200))) return "sec";
      const drop = Math.min(0.7, 0.35 * typeOf().crash * (s.flags.hedged ? 0.5 : 1));
      if (s.cash > 0) { s.flags.crashLoss = Math.round(s.cash * drop); s.cash -= s.flags.crashLoss; }
      return null;
    },
    build() {
      const base = Math.max(0, s.cash);
      const loss = s.flags.crashLoss;
      const hedged = s.flags.hedged;
      return {
        title: L("Global recession", "全球經濟衰退"),
        text: loss
          ? L(`Markets fall 35%. TV anchors are yelling. You're already down ${fmt(loss)}${hedged ? ", and your hedge cut that in half" : ""}.`,
            `股市下跌 35%，電視主播在大叫。你已經蝕了 ${fmt(loss)}${hedged ? "，而你的對沖已幫你減少了一半損失" : ""}。`)
          : L("Markets fall 35%. TV anchors are yelling. Luckily you had nothing to lose.", "股市下跌 35%，電視主播在大叫。幸好你本來就沒甚麼可以蝕。"),
        choices: [
          {
            label: L("Buy the dip. All of it.", "撈底，全部撈"), sub: L("Be greedy when others are fearful", "別人恐懼時我貪婪"), run() {
              if (chance(0.7)) { s.cash += base * 0.8; return L("Markets recover in 18 months. You buy a boat and name it Buy The Dip.", "市場在 18 個月內回升。你買了一艘遊艇，命名為「撈底號」。"); }
              s.cash -= base * 0.4; s.sanity -= 12;
              return L("The dip had a dip. That dip also had a dip.", "底下還有底，那個底下面還有底。");
            },
          },
          {
            label: L("Panic sell everything", "恐慌性全部沽出"), sub: L("Make the pain stop", "讓痛苦停止"),
            run() {
              s.cash -= base * 0.1; s.sanity -= 10;
              return L("You sell at the exact bottom. Historically precise.", "你準確地在最低位沽出。精準得可以寫進歷史。");
            },
          },
          {
            label: L("Do nothing. Touch grass.", "甚麼也不做，出去走走"), sub: L("Delete the app", "刪除交易 app"),
            run() {
              s.cash += base * 0.5; s.sanity += 10;
              return L("You garden for a year. Your portfolio recovers without you. It always did.", "你種了一年花。你的投資組合在沒有你的情況下回升了。它一直都會。");
            },
          },
        ],
      };
    },
  },
];
const MILESTONE_AT = Object.fromEntries(MILESTONES.map(m => [m.age, m]));

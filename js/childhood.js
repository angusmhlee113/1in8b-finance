// ---------- childhood: more versions of the childhood milestones, and small decisions in the years between them ----------
// childhood choices nudge your temperament: +risk leans aggressive, -risk leans passive

MILESTONE_VARIANTS.kid1.push(
  () => ({
    title: L("The puppy next door", "隔籬的小狗"),
    text: L("The neighbor's big dog is wagging its tail at you through the fence. It's twice your size.", "隔籬的大狗隔著圍欄向你搖尾巴。牠比你大兩倍。"),
    choices: [
      kid(L("Squeeze through the fence to hug it", "鑽過圍欄去抱牠"), 1, L("The dog licks your whole face. You have no fear of anything, which worries everyone.", "狗狗舔遍你的臉。你天不怕地不怕，令所有人都很擔心。")),
      kid(L("Wave and wait for a grown-up", "揮手，等大人來"), 0, L("A grown-up introduces you properly. You and the dog become best friends.", "大人正式介紹你們認識。你和狗狗成了好朋友。")),
      kid(L("Hide behind your parent's legs", "躲在爸媽腳後"), -1, L("You watch from a safe distance for a whole year before you pat it.", "你在安全距離觀察了一整年，才敢摸牠。")),
    ],
  }),
  () => ({
    title: L("Bath time", "沖涼時間"),
    text: L("Your first time at the swimming pool. The water looks very big.", "第一次去游泳池，池水看起來好大。"),
    choices: [
      kid(L("Jump straight into the deep end", "直接跳進深水區"), 1, L("A lifeguard fishes you out. You ask to do it again.", "救生員把你撈起來。你要求再跳一次。")),
      kid(L("Splash in the shallow end", "在淺水區玩水"), 0, L("You learn to float by the end of the summer.", "暑假結束時你學會了浮起來。")),
      kid(L("Sit on the edge with your feet in", "坐在池邊泡腳"), -1, L("Your feet have a wonderful time.", "你的腳玩得很開心。")),
    ],
  }),
);

MILESTONE_VARIANTS.kid2.push(
  () => ({
    title: L("The claw machine", "夾公仔機"),
    text: L("There's a claw machine at the shopping mall. You have three coins. The giant bear is right at the front.", "商場裡有一部夾公仔機。你有三個硬幣，大熊就在最前面。"),
    choices: [
      kid(L("Use all three coins on the giant bear", "三個硬幣全部用來夾大熊"), 1, () => chance(0.2)
        ? L("You win the bear. You carry it everywhere for two years.", "你夾到了大熊，之後兩年到哪裡都抱著它。")
        : L("The claw drops it every time. You've learned that some games are rigged.", "每次爪都鬆開。你學會了有些遊戲是被操控的。")),
      kid(L("Try once, then buy an ice cream", "試一次，然後買雪糕"), 0, L("No bear, but the ice cream is guaranteed.", "沒有大熊，但雪糕是保證的。")),
      kid(L("Keep the coins", "保留硬幣"), -1, L("You still have three coins. You feel rich.", "你仍然有三個硬幣，覺得自己很富有。")),
    ],
  }),
  () => ({
    title: L("The bike without training wheels", "沒有輔助輪的單車"),
    text: L("Your parents take the training wheels off your bike.", "爸媽拆掉了你單車的輔助輪。"),
    choices: [
      kid(L("Ride straight down the big hill", "直衝下大斜坡"), 1, L("You crash spectacularly, get up and do it again. You have a scar you're very proud of.", "你摔得很壯觀，爬起來再衝一次。你很自豪身上的疤痕。")),
      kid(L("Practice in the park with a parent holding on", "在公園練習，爸媽扶著"), 0, L("They let go without telling you. You ride twenty meters before noticing.", "他們偷偷放手。你騎了二十米才發現。")),
      kid(L("Ask for the training wheels back", "要求裝回輔助輪"), -1, L("You keep them for another year. You never fall once.", "你多用了一年，從未跌倒。")),
    ],
  }),
);

MILESTONE_VARIANTS.kid3.push(
  () => ({
    title: L("Family Monopoly night", "家庭大富翁之夜"),
    text: L("Your family plays Monopoly every holiday. It always ends in an argument.", "你家每逢假期都玩大富翁，每次都以吵架收場。"),
    choices: [
      kid(L("Buy every property you land on", "見地就買"), 1, L("You go bankrupt in an hour, then win the next game by a mile.", "你一小時就破產了，下一局卻大勝。")),
      kid(L("Buy only the orange and red ones", "只買橙色和紅色的地"), 0, L("You read that they get landed on most. You win quietly.", "你看過資料說這些格最常有人停。你低調地贏了。")),
      kid(L("Keep your cash and avoid buying", "保留現金，盡量不買"), -1, L("You never go bankrupt. You also never win.", "你從未破產，也從未贏過。")),
    ],
  }),
  () => ({
    title: L("The class election", "班長選舉"),
    text: L("You're running for class captain. You need a campaign promise.", "你參選班長，需要一個競選承諾。"),
    choices: [
      kid(L("Promise free snacks every Friday", "承諾每個星期五有免費零食"), 1, L("You win by a landslide. You have no idea how to pay for the snacks.", "你壓倒性勝出，卻完全不知道零食錢從哪裡來。")),
      kid(L("Promise a class pet and a reading corner", "承諾養班寵物和設閱讀角"), 0, L("You win narrowly and actually deliver. The hamster is named after you.", "你險勝，而且真的兌現了。倉鼠以你的名字命名。")),
      kid(L("Help your friend run instead", "幫朋友參選"), -1, L("Your friend wins. You're happy being the one behind the scenes.", "朋友當選了。你很享受做幕後的那個人。")),
    ],
  }),
);

MILESTONE_VARIANTS.kid4.push(
  () => ({
    title: L("A share for your birthday", "生日收到一股股票"),
    text: L("A grandparent gives you a single share of a famous company for your birthday, framed, with a note: \"Own things.\"", "祖父母送你一股著名公司的股票作生日禮物，還裱了框，附上一句：「要擁有東西。」"),
    choices: [
      kid(L("Sell it and buy more of a hot stock", "賣掉它，換成更熱門的股票"), 1, () => chance(0.5)
        ? L("The hot stock doubles. You're hooked.", "熱門股翻了一倍。你上癮了。")
        : L("The hot stock halves. You learn what \"hot\" means.", "熱門股腰斬了。你學會了「熱門」的意思。")),
      kid(L("Keep it and add your birthday money", "保留它，再加上生日錢"), 0, L("You own three shares by the end of the year. You read the annual report. Twice.", "年底你已經擁有三股。你讀了年報，讀了兩次。")),
      kid(L("Keep it framed on the wall forever", "永遠裱在牆上"), -1, L("It hangs above your bed. It's still there.", "它掛在你的床頭，至今仍在。")),
    ],
  }),
  () => ({
    title: L("Loot boxes", "抽獎箱"),
    text: L("Your favorite game sells mystery loot boxes. One of them might have the legendary skin everyone wants.", "你最喜歡的遊戲出售神秘抽獎箱，其中一個可能有人人都想要的傳說級造型。"),
    choices: [
      kid(L("Spend all your savings on loot boxes", "用全部積蓄買抽獎箱"), 1, () => chance(0.1)
        ? L("Legendary skin on the 40th box. You are a god at school for a week.", "第 40 個箱開出傳說級造型。你在學校被奉為神明一星期。")
        : L("Forty boxes, forty duplicates. You've learned how casinos work.", "四十個箱，四十個重複。你學會了賭場是怎樣運作的。")),
      kid(L("Buy one, just to see", "買一個試試"), 0, L("A common hat. You feel the pull to buy another and walk away. Well done.", "一頂普通帽子。你感到想再買的衝動，然後走開了。做得好。")),
      kid(L("Never buy them", "從不買"), -1, L("Your character looks very plain. Your savings look very healthy.", "你的角色看起來很樸素，你的積蓄卻很健康。")),
    ],
  }),
);

// a small decision in a childhood year with no milestone
const kidEv = (id, ages, when, build) => ({ id, ages, when, build: () => ({ ...build(), small: true }) });
const nudge = r => { s.risk += r; };

// holiday money that adults give children, named for where you grew up
function holidayMoneyName() {
  if (LUNAR_NEW_YEAR.has(s.c.iso)) return L("Lunar New Year red envelopes", "新年利是");
  if (MUSLIM_MAJORITY.has(s.c.iso)) return L("Eid money from your relatives", "開齋節親戚給的錢");
  if (s.c.iso === "IND") return L("Diwali gifts from your relatives", "排燈節親戚給的禮金");
  return L("Birthday money from your relatives", "親戚給的生日錢");
}

const KID_EVENTS = [
  kidEv("holidaymoney", [5, 12], null, () => ({
    title: holidayMoneyName(),
    text: L("You've collected more cash this week than ever before. Your parents offer to \"keep it safe for you.\"", "你這星期收到的錢比以往任何時候都多。爸媽提出替你「好好保管」。"),
    choices: [
      { label: L("Hand it to your parents to keep safe", "交給爸媽保管"), sub: L("They'll save it for you", "他們會幫你儲起來"), run() { nudge(-0.5); s.sanity -= 2; return L("You never see it again. Years later you learn it paid for your school uniforms.", "你再也沒見過那筆錢。多年後你才知道它付了你的校服費。"); } },
      { label: L("Keep it and hide it under your mattress", "自己收起，藏在床褥下"), sub: L("Self-custody", "自行保管"), run() { s.cash += Math.round(150 * sc()); nudge(0); return L("It's all still there in a year. You count it every Sunday.", "一年後錢還在。你每個星期日都數一次。"); } },
      { label: L("Spend it all at the toy shop", "全部去玩具店花掉"), sub: L("Live now", "活在當下"), run() { nudge(0.5); s.sanity += 6; return L("Best afternoon of your life. You have nothing to show for it by summer.", "人生最開心的一個下午。到暑假時甚麼也沒剩下。"); } },
    ],
  })),
  kidEv("lemonade", [5, 9], null, () => ({
    title: L("Your first stall", "你的第一個攤檔"),
    text: L("It's a hot day and the park is full. You set up a stall selling drinks.", "天氣炎熱，公園人山人海。你擺了個賣飲品的攤檔。"),
    choices: [
      { label: L("Charge double, it's hot", "天熱，賣雙倍價錢"), sub: L("Supply and demand", "供求定律"), run() { nudge(0.5); s.cash += Math.round(40 * sc()); s.hustle += 4; return L("People pay it. A man in a suit tells you you'll go far. You don't know what he means yet.", "人們照付。一位穿西裝的男人說你前途無限。你還不明白他的意思。"); } },
      { label: L("Charge a fair price", "收合理價錢"), sub: L("Repeat customers", "回頭客"), run() { s.cash += Math.round(25 * sc()); s.network += 3; return L("You sell out and the same kids come back every weekend.", "你全部賣光，同一班小朋友每個週末都回來。"); } },
      { label: L("Give it away to your friends", "送給朋友"), sub: L("Generous", "慷慨"), run() { nudge(-0.5); s.network += 5; s.sanity += 3; return L("You're the most popular kid in the park. Your business model needs work.", "你是公園裡最受歡迎的小孩，只是你的商業模式需要改善。"); } },
    ],
  })),
  kidEv("toothfairy", [5, 7], null, () => ({
    title: L("The tooth fairy", "牙仙子"),
    text: L("Your first tooth falls out. You've heard the tooth fairy pays for teeth.", "你掉了第一顆牙。你聽說牙仙子會用錢換牙齒。"),
    choices: [
      { label: L("Leave a note asking for $5", "留紙條要求 $5"), sub: L("Negotiate", "談判"), run() { nudge(0.5); s.hustle += 4; return L("You get $2 and a note saying \"nice try.\" A partial win.", "你得到 $2 和一張寫著「不錯的嘗試」的紙條。部分勝利。"); } },
      { label: L("Put it under your pillow and hope", "放在枕頭下，靜心等待"), sub: L("Trust the system", "相信制度"), run() { s.sanity += 3; return L("A coin appears. Magic is real, and it's surprisingly cheap.", "一個硬幣出現了。魔法是真的，而且出奇地便宜。"); } },
      { label: L("Keep the tooth", "保留牙齒"), sub: L("It's yours", "是你的東西"), run() { nudge(-0.5); return L("You keep it in a box. You still have it.", "你把它放在盒子裡，至今仍在。"); } },
    ],
  })),
  kidEv("pocketmoney", [6, 11], () => s.tier >= 1, () => ({
    title: L("Pocket money", "零用錢"),
    text: L("You start getting a little pocket money every week.", "你開始每星期有一點零用錢。"),
    choices: [
      { label: L("Lend it to classmates with interest", "借給同學收利息"), sub: L("Banker in training", "實習銀行家"), run() { nudge(0.5); s.hustle += 5; s.network -= 3; s.cash += Math.round(60 * sc()); return L("You charge one sweet per week per dollar. A teacher shuts it down after a month.", "你每一元每星期收一粒糖做利息。一個月後被老師叫停。"); } },
      { label: L("Save it in a jar", "儲在玻璃瓶裡"), sub: L("Watch it grow", "看著它增長"), run() { nudge(-0.5); s.cash += Math.round(100 * sc()); return L("The jar fills up slowly. You learn that saving is boring, and that boring works.", "瓶子慢慢裝滿。你學會儲蓄是沉悶的，而沉悶是有效的。"); } },
      { label: L("Spend it every Friday", "每個星期五花光"), sub: L("Enjoy it", "享受它"), run() { s.sanity += 4; return L("Friday becomes the best day of the week.", "星期五成了一星期中最好的日子。"); } },
    ],
  })),
  kidEv("chores", [7, 12], null, () => ({
    title: L("Paid chores", "有薪家務"),
    text: L("Your parents offer to pay you for doing chores around the house.", "爸媽提出付錢請你做家務。"),
    choices: [
      { label: L("Negotiate a better rate", "談一個更好的價錢"), sub: L("Know your worth", "知道自己的價值"), run() { nudge(0.5); s.hustle += 5; s.cash += Math.round(80 * sc()); return L("You get a 50% raise by threatening to strike. Your parents are impressed and slightly worried.", "你以罷工威脅爭取到五成加薪。爸媽既佩服又有點擔心。"); } },
      {
        label: L("Pay your sibling to do them for a cut", "付錢給兄弟姊妹代做，自己抽佣"), sub: L("Middle management", "中層管理"),
        locked: s.family.siblings ? null : L("Locked, you're an only child", "未解鎖，你是獨生子女"),
        run() { nudge(0.5); s.network += 4; s.cash += Math.round(40 * sc()); return L("You keep 30% for \"management.\" Your sibling figures it out in a month.", "你以「管理費」名義抽三成。兄弟姊妹一個月後就識破了。"); },
      },
      { label: L("Just do the chores", "老老實實做家務"), sub: L("Honest work", "誠實勞動"), run() { s.hustle += 3; s.cash += Math.round(50 * sc()); return L("The house is clean and your jar is fuller.", "家裡乾淨了，你的錢瓶也更滿了。"); } },
    ],
  })),
  kidEv("mathcomp", [8, 12], null, () => ({
    title: L("The maths competition", "數學比賽"),
    text: L("Your teacher wants you to enter the national maths competition. Training is every Saturday morning.", "老師想你參加全國數學比賽，逢星期六早上訓練。"),
    choices: [
      { label: L("Enter and train hard", "參加並努力訓練"), sub: L("Saturdays gone", "沒有星期六了"), run() { s.hustle += 8; s.sanity -= 4; if (chance(0.3)) { s.network += 8; return L("You win a medal. It goes on every application you ever write.", "你拿了獎牌。它出現在你之後寫的每一份申請上。"); } return L("You don't place, but you get very fast at mental arithmetic.", "你沒有得獎，但心算變得非常快。"); } },
      { label: L("Enter for fun, no training", "參加玩玩，不訓練"), sub: L("Low stakes", "低風險"), run() { nudge(0.5); s.hustle += 2; return L("You come 40th. You enjoyed the free lunch.", "你排第 40。你很享受免費午餐。"); } },
      { label: L("Skip it, Saturdays are for cartoons", "不參加，星期六是看卡通的"), sub: L("Priorities", "優先次序"), run() { s.sanity += 6; return L("You watch a lot of cartoons. You regret nothing.", "你看了很多卡通，毫不後悔。"); } },
    ],
  })),
  kidEv("bully", [8, 13], null, () => ({
    title: L("The bully", "惡霸"),
    text: L("An older kid starts demanding your lunch money.", "一個高年級學生開始向你勒索午餐錢。"),
    choices: [
      { label: L("Stand up to them", "挺身反抗"), sub: L("Risky", "有風險"), run() { nudge(1); if (chance(0.5)) { s.network += 6; s.sanity += 4; return L("They back off. Word gets around. Nobody bothers you again.", "對方退縮了。消息傳開，再沒有人敢惹你。"); } s.sanity -= 8; return L("It doesn't go well. But they never ask you again, which is something.", "結果不太好，但他們之後再也沒有找你，這也算有收穫。"); } },
      { label: L("Tell a teacher", "告訴老師"), sub: L("Use the system", "利用制度"), run() { s.sanity += 2; s.network -= 2; return L("The teacher handles it. Some kids call you a snitch. You don't care.", "老師處理了。有些同學叫你告密者，你不在乎。"); } },
      { label: L("Pay them to leave you alone", "付錢叫他們不要煩你"), sub: L("Your first insurance premium", "你的第一筆保費"), run() { nudge(-0.5); s.cash -= Math.round(30 * sc()); return L("It works, for a price. You've invented insurance.", "要付出代價，但很有效。你發明了保險。"); } },
    ],
  })),
  kidEv("garagesale", [7, 11], () => s.c.g >= 2, () => ({
    title: L("The garage sale", "家居舊物拍賣"),
    text: L("Your family is selling old things in front of the house. You're in charge of the toy table.", "你家在屋前出售舊物，你負責玩具枱。"),
    choices: [
      { label: L("Haggle hard for every cent", "每一分錢都討價還價"), sub: L("Maximize revenue", "收入最大化"), run() { nudge(0.5); s.cash += Math.round(60 * sc()); s.hustle += 4; return L("You get $3 for a broken robot. A neighbor calls you \"a little shark.\"", "你把一個壞了的機械人賣到 $3。鄰居叫你「小鯊魚」。"); } },
      { label: L("Bundle everything and sell fast", "全部打包快速賣出"), sub: L("Clear inventory", "清貨"), run() { s.cash += Math.round(40 * sc()); return L("You're sold out by 10am and spend the rest of the day reading.", "早上十點就賣光了，你用剩下的時間看書。"); } },
      { label: L("Keep your favorite toys off the table", "把心愛玩具留下不賣"), sub: L("Some things aren't for sale", "有些東西是非賣品"), run() { nudge(-0.5); s.sanity += 4; return L("You save your favorite bear. It's worth more to you than any price.", "你保住了最心愛的熊。對你來說它比任何價錢都值錢。"); } },
    ],
  })),
  kidEv("hardship", [5, 12], () => s.tier <= 1, () => ({
    title: L("A hard year at home", "家裡艱難的一年"),
    text: L("One of your parents loses their job. There's less food on the table and a lot of quiet conversations.", "爸爸或媽媽失業了。飯桌上的食物少了，低聲的對話多了。"),
    choices: [
      { label: L("Give the family your savings jar", "把錢瓶交給家人"), sub: L("Everyone helps", "人人出力"), run() { s.cash = Math.min(s.cash, 0); s.sanity += 6; s.network += 3; return L("Your mother cries and hugs you. You'll remember it forever.", "媽媽哭著抱住你。你會永遠記得這一刻。"); } },
      { label: L("Start helping at a neighbor's shop", "到鄰居的店舖幫手"), sub: L("Earn your own way", "自食其力"), run() { s.hustle += 8; s.cash += Math.round(80 * sc()); s.sanity -= 4; return L("You're the youngest worker on the street. You learn to count change faster than the adults.", "你是整條街最年輕的工人，數零錢比大人還快。"); } },
      { label: L("Try not to ask for anything", "盡量甚麼都不要求"), sub: L("Make yourself small", "盡量不添麻煩"), run() { nudge(-0.5); s.sanity -= 6; return L("You learn to want less. It's a lesson that stays with you, for better and worse.", "你學會了少要求。這一課會伴隨你一生，有好有壞。"); } },
    ],
  })),
  kidEv("richkid", [7, 13], () => s.tier >= 4, () => ({
    title: L("The summer plan", "暑假計劃"),
    text: L("Your parents ask what you'd like to do this summer. Every option costs more than most people earn in a year.", "爸媽問你暑假想做甚麼。每個選項都比大多數人一年的收入還貴。"),
    choices: [
      { label: L("Summer camp in Switzerland", "瑞士夏令營"), sub: L("Meet other rich kids", "結識其他富家子弟"), run() { s.network += 10; s.sanity += 4; return L("Your bunkmate's father owns a bank. You'll hear from him again in 15 years.", "你室友的爸爸擁有一間銀行。15 年後你會再聽到他的消息。"); } },
      { label: L("Intern at Dad's office", "到爸爸的公司實習"), sub: L("Start early", "提早起步"), run() { nudge(0.5); s.hustle += 6; s.network += 6; return L("You're nine and you have a business card. The receptionist finds it hilarious.", "你九歲就有了卡片。接待處的姐姐覺得非常好笑。"); } },
      { label: L("Stay home with your friends", "留在家跟朋友玩"), sub: L("Normal summer", "普通的暑假"), run() { nudge(-0.5); s.sanity += 10; return L("You spend the summer riding bikes. It's the most normal you'll ever feel.", "你整個暑假都在踩單車。這是你人生中最平凡的時光。"); } },
    ],
  })),
  kidEv("siblingfight", [4, 10], () => s.family.siblings > 0, () => ({
    title: L("Your sibling broke your toy", "兄弟姊妹弄壞了你的玩具"),
    text: L("Your sibling broke your favorite toy and is pretending it was already like that.", "兄弟姊妹弄壞了你最心愛的玩具，還假裝它本來就是壞的。"),
    choices: [
      { label: L("Demand compensation", "要求賠償"), sub: L("Damages", "損害賠償"), run() { nudge(0.5); s.hustle += 3; return L("You negotiate two of their toys and a week of dessert. Your first settlement.", "你談到了兩件他的玩具和一星期的甜品。你的第一宗和解。"); } },
      { label: L("Forgive them", "原諒他"), sub: L("Family", "一家人"), run() { nudge(-0.5); s.sanity += 4; s.network += 2; return L("They feel terrible and give you their best toy anyway.", "他非常內疚，還是把最好的玩具送了給你。"); } },
      { label: L("Tell your parents", "告訴爸媽"), sub: L("Escalate", "上報"), run() { return L("Both of you lose dessert for a week. Justice is blind and harsh.", "你們兩個都被罰一星期沒有甜品。正義是盲目而嚴厲的。"); } },
    ],
  })),
  kidEv("moving", [6, 13], null, () => ({
    title: L("A new school", "轉校"),
    text: L("Your family moves across town. Tomorrow is your first day at a new school.", "你家搬到城市另一邊。明天是你在新學校的第一天。"),
    choices: [
      { label: L("Introduce yourself to everyone", "向每個人自我介紹"), sub: L("Bold", "大膽"), run() { nudge(0.5); s.network += 8; return L("By Friday you know the whole class and two of the teachers' cats.", "到星期五你已經認識全班同學，以及兩位老師的貓。"); } },
      { label: L("Make one good friend", "交一個好朋友"), sub: L("Quality over quantity", "質素勝於數量"), run() { s.sanity += 6; s.network += 3; return L("You sit next to a quiet kid who becomes your best friend for life.", "你坐在一個安靜的同學旁邊，他成了你一生的好朋友。"); } },
      { label: L("Keep your head down", "保持低調"), sub: L("Observe first", "先觀察"), run() { nudge(-0.5); s.hustle += 3; return L("You watch and learn for a term. Then you know exactly who to talk to.", "你觀察了一個學期，然後很清楚該跟誰說話。"); } },
    ],
  })),
  kidEv("firstphone", [11, 14], () => s.tier >= 1 || s.c.g >= 2, () => ({
    title: L("The phone everyone has", "人人都有的手機"),
    text: L("Everyone in your class has the newest phone. Yours is your cousin's old one with a cracked screen.", "全班同學都有最新款手機。你的是表哥的舊機，螢幕還裂了。"),
    choices: [
      { label: L("Beg your parents for the newest one", "求爸媽買最新款"), sub: L("Status", "身份象徵"), run() { nudge(0.5); s.network += 4; s.sanity += 3; return L("You get it after three weeks of campaigning. It's out of date in a year.", "經過三星期遊說你終於得到了。一年後它就過時了。"); } },
      { label: L("Save up and buy it yourself", "自己儲錢買"), sub: L("Earn it", "靠自己"), run() { s.hustle += 6; s.cash -= Math.round(100 * sc()); return L("It takes eight months of saving. You take very good care of it.", "儲了八個月才買到。你非常愛惜它。"); } },
      { label: L("Keep the cracked one", "繼續用裂屏手機"), sub: L("It works", "能用就好"), run() { nudge(-0.5); s.cash += Math.round(50 * sc()); return L("It works fine. You discover you don't care what people think, which is a superpower.", "它運作正常。你發現自己不在乎別人怎麼看，這是一種超能力。"); } },
    ],
  })),
  kidEv("marketstall", [7, 12], () => s.tier <= 2 && s.c.g <= 2, () => ({
    title: L("Helping at the market", "在街市幫手"),
    text: L("On weekends you help a relative sell vegetables at the local market.", "週末你在本地街市幫親戚賣菜。"),
    choices: [
      { label: L("Shout the loudest prices on the street", "叫賣聲全街最大"), sub: L("Salesmanship", "推銷術"), run() { nudge(0.5); s.hustle += 6; s.cash += Math.round(60 * sc()); return L("You sell out every Saturday. The other stallholders start paying you to shout for them.", "你每個星期六都賣光。其他檔主開始付錢請你替他們叫賣。"); } },
      { label: L("Keep the accounts in a notebook", "用筆記簿記帳"), sub: L("The numbers person", "管數的人"), run() { s.hustle += 5; s.network += 3; return L("You catch a supplier overcharging. Your aunt calls you \"the accountant.\"", "你發現供應商多收錢。姑媽叫你做「會計師」。"); } },
      { label: L("Help quietly at the back", "在後面默默幫忙"), sub: L("Steady", "穩定"), run() { nudge(-0.5); s.sanity += 3; return L("You wash vegetables and listen to the adults talk about money. You learn a lot.", "你洗菜，聽大人談論錢。你學到很多。"); } },
    ],
  })),
  kidEv("hobby", [6, 10], null, () => ({
    title: L("After-school lessons", "課外班"),
    text: L("Your parents want to sign you up for an after-school activity.", "爸媽想替你報一個課外活動。"),
    choices: [
      { label: L("Football", "足球"), sub: L("Team sport", "團隊運動"), run() { nudge(0.5); s.network += 6; s.sanity += 3; return L("You learn to win as a team and lose as a team. Mostly lose.", "你學會團隊勝利和團隊失敗。大多是失敗。"); } },
      { label: L("Piano", "鋼琴"), sub: L("Discipline", "紀律"), run() { s.hustle += 6; s.sanity -= 2; return L("Grade 5 by twelve. You can play exactly one song from memory.", "十二歲考到五級。你能背彈的曲子剛好只有一首。"); } },
      { label: L("Chess", "國際象棋"), sub: L("Think ahead", "想得長遠"), run() { nudge(-0.5); s.hustle += 5; return L("You learn to think three moves ahead. You'll use it in every negotiation.", "你學會預算三步棋，往後每次談判都用得上。"); } },
    ],
  })),
  kidEv("scamkid", [10, 14], null, () => ({
    title: L("Free game currency!", "免費遊戲幣！"),
    text: L("A message in your game says you can get free premium currency if you enter your parent's card details.", "遊戲裡有訊息說，只要輸入爸媽的信用卡資料，就可以免費獲得高級遊戲幣。"),
    choices: [
      { crowd: true, label: L("Enter the card details", "輸入信用卡資料"), sub: L("Free is free", "免費就是免費"), run() { nudge(0.5); s.cash -= Math.round(200 * sc()); s.sanity -= 8; return L("Your parent's card is charged for a lot of things in another country. You are grounded for a month.", "爸媽的信用卡在外國被刷了很多東西。你被禁足一個月。"); } },
      { label: L("Ask a parent first", "先問爸媽"), sub: L("Too good to be true", "好得不像真的"), run() { s.hustle += 3; s.sanity += 2; return L("Your parent explains what a scam is. It's the most useful lesson of your childhood.", "爸媽解釋了甚麼是騙局。這是你童年最有用的一課。"); } },
      { label: L("Report the message", "舉報訊息"), sub: L("Protect others", "保護其他人"), run() { nudge(-0.5); s.network += 2; return L("The account gets banned. You feel like a detective.", "那個帳號被封了。你覺得自己像個偵探。"); } },
    ],
  })),
];

// most childhood years without a milestone bring one small decision
const KID_EVENT_CHANCE = 0.55;

function kidScene(age) {
  if (age < 4 || Math.random() > KID_EVENT_CHANCE) return null;
  const pool = KID_EVENTS.filter(e => age >= e.ages[0] && age <= e.ages[1] && !s.used.has(e.id) && (!e.when || e.when()));
  if (!pool.length) return null;
  const e = pick(pool);
  s.used.add(e.id);
  return e;
}

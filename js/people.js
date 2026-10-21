// ---------- places and people ----------

// two possible hometowns per country
const HOMETOWNS = {
  IND: [L("Mumbai", "孟買"), L("Patna", "巴特那")], CHN: [L("Chongqing", "重慶"), L("Xi'an", "西安")],
  USA: [L("Columbus", "哥倫布"), L("Houston", "休斯頓")], IDN: [L("Surabaya", "泗水"), L("Jakarta", "雅加達")],
  PAK: [L("Lahore", "拉合爾"), L("Karachi", "卡拉奇")], NGA: [L("Lagos", "拉各斯"), L("Kano", "卡諾")],
  BRA: [L("São Paulo", "聖保羅"), L("Recife", "累西腓")], BGD: [L("Dhaka", "達卡"), L("Chittagong", "吉大港")],
  RUS: [L("Kazan", "喀山"), L("Novosibirsk", "新西伯利亞")], ETH: [L("Addis Ababa", "亞的斯亞貝巴"), L("Mekelle", "默克萊")],
  MEX: [L("Guadalajara", "瓜達拉哈拉"), L("Puebla", "普埃布拉")], JPN: [L("Osaka", "大阪"), L("Sapporo", "札幌")],
  PHL: [L("Quezon City", "奎松市"), L("Cebu", "宿霧")], EGY: [L("Cairo", "開羅"), L("Alexandria", "亞歷山大")],
  COD: [L("Kinshasa", "金沙薩"), L("Lubumbashi", "盧本巴希")], VNM: [L("Hanoi", "河內"), L("Da Nang", "峴港")],
  IRN: [L("Tehran", "德黑蘭"), L("Isfahan", "伊斯法罕")], TUR: [L("Istanbul", "伊斯坦堡"), L("Ankara", "安卡拉")],
  DEU: [L("Cologne", "科隆"), L("Leipzig", "萊比錫")], THA: [L("Bangkok", "曼谷"), L("Chiang Mai", "清邁")],
  GBR: [L("Manchester", "曼徹斯特"), L("Leeds", "列斯")], FRA: [L("Lyon", "里昂"), L("Lille", "里爾")],
  ZAF: [L("Johannesburg", "約翰內斯堡"), L("Durban", "德班")], ITA: [L("Milan", "米蘭"), L("Naples", "拿坡里")],
  KEN: [L("Nairobi", "內羅畢"), L("Mombasa", "蒙巴薩")], KOR: [L("Busan", "釜山"), L("Daegu", "大邱")],
  ARG: [L("Buenos Aires", "布宜諾斯艾利斯"), L("Córdoba", "哥多華")], CAN: [L("Toronto", "多倫多"), L("Calgary", "卡加利")],
  SAU: [L("Riyadh", "利雅得"), L("Jeddah", "吉達")], AUS: [L("Sydney", "悉尼"), L("Perth", "珀斯")],
  ARE: [L("Dubai", "杜拜"), L("Abu Dhabi", "阿布扎比")], CHE: [L("Zurich", "蘇黎世"), L("Geneva", "日內瓦")],
  HKG: [L("Sham Shui Po", "深水埗"), L("Tuen Mun", "屯門")], SGP: [L("Tampines", "淡濱尼"), L("Jurong", "裕廊")],
};

// [male first names, female first names, surnames]
const NAMES = {
  IND: [["Arjun", "Rohan", "Vikram", "Aditya"], ["Priya", "Ananya", "Kavya", "Meera"], ["Sharma", "Patel", "Singh", "Iyer", "Reddy"]],
  CHN: [["Wei", "Hao", "Jun", "Yichen"], ["Shihan", "Xinyi", "Mei", "Yutong"], ["Zhang", "Wang", "Li", "Liu", "Chen"]],
  USA: [["Jacob", "Ethan", "Marcus", "Tyler"], ["Emma", "Olivia", "Ava", "Madison"], ["Smith", "Johnson", "Garcia", "Brown", "Miller"]],
  IDN: [["Budi", "Agus", "Rizky", "Dimas"], ["Siti", "Putri", "Ayu", "Dewi"], ["Santoso", "Wijaya", "Hidayat", "Saputra"]],
  PAK: [["Ali", "Hamza", "Bilal", "Usman"], ["Ayesha", "Fatima", "Zainab", "Hira"], ["Khan", "Ahmed", "Malik", "Hussain"]],
  NGA: [["Chinedu", "Emeka", "Tunde", "Ibrahim"], ["Ngozi", "Amaka", "Funmilayo", "Aisha"], ["Okafor", "Adeyemi", "Bello", "Eze"]],
  BRA: [["João", "Pedro", "Lucas", "Gabriel"], ["Ana", "Beatriz", "Larissa", "Camila"], ["Silva", "Santos", "Oliveira", "Souza"]],
  BGD: [["Rahim", "Tanvir", "Arif", "Sakib"], ["Nusrat", "Farzana", "Tania", "Sumaiya"], ["Rahman", "Hossain", "Islam", "Akter"]],
  RUS: [["Dmitri", "Ivan", "Alexei", "Sergei"], ["Anastasia", "Olga", "Daria", "Natalia"], ["Ivanov", "Smirnov", "Petrov", "Volkov"]],
  ETH: [["Abebe", "Dawit", "Yonas", "Tesfaye"], ["Wubit", "Hirut", "Selam", "Meron"], ["Desta", "Bekele", "Tadesse", "Haile"]],
  MEX: [["José", "Diego", "Luis", "Carlos"], ["María", "Sofía", "Valeria", "Fernanda"], ["Hernández", "García", "Martínez", "López"]],
  JPN: [["Haruto", "Ren", "Sota", "Yuto"], ["Yui", "Sakura", "Hina", "Aoi"], ["Sato", "Suzuki", "Takahashi", "Tanaka"]],
  PHL: [["Jose", "Mark", "Paolo", "Miguel"], ["Maria", "Angelica", "Kristine", "Joy"], ["Santos", "Reyes", "Cruz", "Bautista"]],
  EGY: [["Mohamed", "Ahmed", "Omar", "Youssef"], ["Nour", "Mariam", "Salma", "Habiba"], ["Hassan", "Mahmoud", "Ibrahim", "Mostafa"]],
  COD: [["Jean", "Patrice", "Christian", "Joseph"], ["Grace", "Esther", "Merveille", "Josée"], ["Mbuyi", "Ilunga", "Kasongo", "Tshibangu"]],
  VNM: [["Minh", "Duc", "Anh", "Huy"], ["Linh", "Trang", "Mai", "Huong"], ["Nguyen", "Tran", "Le", "Pham"]],
  IRN: [["Amir", "Reza", "Mehdi", "Ali"], ["Zahra", "Maryam", "Sara", "Fatemeh"], ["Hosseini", "Ahmadi", "Mohammadi", "Rezaei"]],
  TUR: [["Mehmet", "Mustafa", "Emre", "Can"], ["Zeynep", "Elif", "Ayşe", "Fatma"], ["Yılmaz", "Kaya", "Demir", "Şahin"]],
  DEU: [["Lukas", "Jonas", "Felix", "Maximilian"], ["Mia", "Hannah", "Lena", "Sophie"], ["Müller", "Schmidt", "Schneider", "Fischer"]],
  THA: [["Somchai", "Anan", "Krit", "Niran"], ["Malee", "Ploy", "Siriporn", "Nok"], ["Saetang", "Wongsa", "Chaiyaporn", "Srisuk"]],
  GBR: [["Oliver", "Harry", "George", "Jack"], ["Amelia", "Isla", "Grace", "Charlotte"], ["Smith", "Jones", "Taylor", "Williams"]],
  FRA: [["Lucas", "Hugo", "Louis", "Gabriel"], ["Emma", "Léa", "Chloé", "Manon"], ["Martin", "Bernard", "Dubois", "Moreau"]],
  ZAF: [["Thabo", "Sipho", "Pieter", "Lwazi"], ["Naledi", "Thandi", "Lerato", "Anika"], ["Nkosi", "Dlamini", "van der Merwe", "Mokoena"]],
  ITA: [["Leonardo", "Francesco", "Lorenzo", "Matteo"], ["Sofia", "Giulia", "Aurora", "Chiara"], ["Rossi", "Russo", "Ferrari", "Esposito"]],
  KEN: [["Brian", "Kevin", "Otieno", "Kamau"], ["Wanjiru", "Akinyi", "Faith", "Mercy"], ["Mwangi", "Odhiambo", "Kariuki", "Wanjala"]],
  KOR: [["Minjun", "Seojun", "Jiho", "Hyunwoo"], ["Seoyeon", "Jiwoo", "Haeun", "Minji"], ["Kim", "Lee", "Park", "Choi"]],
  ARG: [["Santiago", "Mateo", "Tomás", "Facundo"], ["Martina", "Valentina", "Lucía", "Camila"], ["González", "Rodríguez", "Fernández", "Pérez"]],
  CAN: [["Liam", "Noah", "William", "Ethan"], ["Olivia", "Charlotte", "Emma", "Chloe"], ["Tremblay", "Smith", "Roy", "Martin"]],
  SAU: [["Abdullah", "Faisal", "Khalid", "Saud"], ["Noura", "Reem", "Lama", "Sara"], ["Al-Otaibi", "Al-Qahtani", "Al-Harbi", "Al-Shammari"]],
  AUS: [["Jack", "Noah", "Cooper", "Lachlan"], ["Charlotte", "Ruby", "Matilda", "Chloe"], ["Smith", "Jones", "Williams", "Brown"]],
  ARE: [["Mohammed", "Rashid", "Hamdan", "Saeed"], ["Fatima", "Mariam", "Shamma", "Hessa"], ["Al Mansoori", "Al Hashimi", "Al Nuaimi", "Al Ketbi"]],
  CHE: [["Noah", "Luca", "Elias", "Nico"], ["Mia", "Lena", "Elena", "Laura"], ["Müller", "Meier", "Keller", "Weber"]],
  HKG: [["Chun Kit", "Ka Ho", "Wing Hei", "Tsz Hin"], ["Wing Yan", "Hoi Ching", "Tsz Ching", "Ka Yan"], ["Chan", "Wong", "Lee", "Cheung"]],
  SGP: [["Wei Jie", "Darren", "Ryan", "Arjun"], ["Hui Min", "Rachel", "Siti", "Nicole"], ["Tan", "Lim", "Lee", "Ng"]],
};
// family name comes first in these places
const SURNAME_FIRST = new Set(["CHN", "JPN", "KOR", "VNM", "HKG"]);

function personName(iso, female) {
  const [m, f, sur] = NAMES[iso];
  const first = pick(female ? f : m);
  let last = pick(sur);
  if (iso === "RUS" && female) last += "a";
  return SURNAME_FIRST.has(iso) ? `${last} ${first}` : `${first} ${last}`;
}

// what your parents do, by family tier
const PARENT_JOBS = [
  [L("farmer", "農民"), L("day labourer", "散工"), L("street vendor", "小販")],
  [L("factory worker", "工廠工人"), L("driver", "司機"), L("cleaner", "清潔工"), L("construction worker", "建築工人")],
  [L("teacher", "教師"), L("nurse", "護士"), L("shop owner", "店主"), L("salesperson", "推銷員"), L("civil servant", "公務員")],
  [L("engineer", "工程師"), L("accountant", "會計師"), L("doctor", "醫生"), L("manager", "經理")],
  [L("lawyer", "律師"), L("surgeon", "外科醫生"), L("business owner", "企業東主")],
  [L("managing director", "董事總經理"), L("philanthropist", "慈善家"), L("art collector", "藝術收藏家")],
];
const HOMEMAKER = L("homemaker", "全職主婦");

// what the other babies born in the same second grow up to do, from poorer to richer paths
const PEER_JOBS = [
  L("farmer", "農民"), L("factory worker", "工廠工人"), L("market trader", "街市小販"), L("driver", "司機"),
  L("nurse", "護士"), L("teacher", "教師"), L("shop owner", "店主"), L("civil servant", "公務員"),
  L("software engineer", "軟件工程師"), L("doctor", "醫生"), L("lawyer", "律師"), L("banker", "銀行家"),
];

function makePeer() {
  const c = COUNTRIES[weightedIdx(COUNTRIES.map(x => x[2]))];
  const [name, flag, , g, , iso] = c;
  const female = Math.random() < 0.5;
  // richer countries open up the better-paid end of the list
  const lo = Math.max(0, g * 2 - 2), hi = Math.min(PEER_JOBS.length - 1, g * 2 + 5);
  const job = PEER_JOBS[rint(lo, hi)];
  const uni = Math.random() < [0.08, 0.2, 0.35, 0.5, 0.6][g];
  // rough chance of not reaching 65: early childhood in poorer countries, illness and accidents later on
  const dies = Math.random() < [0.24, 0.16, 0.12, 0.09, 0.08][g];
  const diesAt = dies ? (Math.random() < 0.4 ? rint(0, 4) : rint(5, 64)) : null;
  return { name: personName(iso, female), female, country: name, flag, job, uni, diesAt, marriesAt: Math.random() < 0.7 ? rint(22, 34) : null };
}

function peerStatus(p, age) {
  if (p.diesAt !== null && age > p.diesAt) return L(`died at ${p.diesAt}`, `${p.diesAt} 歲離世`);
  if (age < 6) return L("early childhood", "幼兒期");
  if (age < 12) return L("primary school", "小學");
  if (age < 18) return L("secondary school", "中學");
  if (age < 22 && p.uni) return L("university", "大學");
  const married = p.marriesAt !== null && age >= p.marriesAt;
  if (age >= 62) return married ? L("retired · married", "已退休 · 已婚") : L("retired", "已退休");
  return married ? cat(p.job, L(" · married", " · 已婚")) : p.job;
}

// small things that happen in the childhood years without a decision
function childhoodLine(age) {
  const rich = s.tier >= 2 || s.c.g >= 3;
  switch (age) {
    case 1: return L("You took your first steps. The whole family clapped.", "你踏出了人生第一步。全家都在拍手。");
    case 3: return rich ? L("You started kindergarten and cried for a week.", "你開始讀幼稚園，哭了一整個星期。")
      : L("You spent your days playing outside with the neighbors' kids.", "你每天都跟鄰居小孩在外面玩。");
    case 5: return L("You learned to count to 100. You immediately asked what comes after.", "你學會了數到 100，然後立即問 100 之後是甚麼。");
    case 7: return L("You started primary school.", "你開始讀小學。");
    case 9: return rich ? L("You got your first piggy bank. You never opened it. You just liked watching it fill up.", "你得到第一個錢罌。你從沒打開過，只是喜歡看著它慢慢變滿。")
      : L("You started helping with the family's work after school.", "你放學後開始幫忙家裡的工作。");
    case 12: return L("You started secondary school.", "你開始讀中學。");
    case 13: return rich ? L("You got your first phone. It immediately had a stock app on it.", "你有了第一部手機，第一個下載的就是股票 app。")
      : L("You shared a phone with your siblings. You mostly used it to check football scores.", "你跟兄弟姊妹共用一部手機，大多用來看球賽比分。");
    default: return null;
  }
}

// a short description of where you are in life, for the "This year" panel
function lifeStage() {
  const where = s.c.name;
  if (s.age < 6) return {
    title: L("Early childhood", "幼兒期"),
    text: L("Still small and being raised by your family. A few childhood moments will shape your temperament, which settles at 15. Feel free to speed through at 8×.",
      "你還很小，由家人照顧長大。童年的幾個時刻會塑造你的性格，並在 15 歲時定型。你可以用 8× 速度快轉。"),
  };
  if (s.age < 15) return {
    title: L("Childhood", "童年"),
    text: L("School, friends and family. Your answers to a few childhood moments decide whether you'll be an aggressive, balanced or passive investor.",
      "學校、朋友和家庭。你對童年幾個時刻的回答，會決定你將成為進取型、平衡型還是保守型的投資者。"),
  };
  if (s.age < 18) return {
    title: L("High school", "中學"),
    text: L("You've discovered finance. From now on, every year brings something new. Network opens doors, hustle gets you through them, and sanity keeps you from burning out.",
      "你發現了金融。從現在起，每一年都會發生新的事。人脈為你開門，拼勁讓你走進去，理智讓你不至於燃燒殆盡。"),
  };
  if (s.track === "degen") return {
    title: L("Crypto life", "加密貨幣人生"),
    text: L("No degree, no boss, no safety net. Big swings in both directions, and regulators are always watching.",
      "沒有學位、沒有老闆、沒有安全網。上落都很大，而且監管機構一直在盯著你。"),
  };
  if (s.age < 22 && s.school && s.school !== "none") return {
    title: L("University", "大學"),
    text: L("Classes matter less than recruiting. Your network and the school's name decide which job offers you'll see at 22.",
      "上課沒有求職重要。你的人脈和學校的名氣，決定你 22 歲時會收到哪些工作邀約。"),
  };
  if (s.job === JOBS.retired) return {
    title: L("Retired", "退休"),
    text: L("No more alarm clocks. Your money now has to last as long as you do, and the markets keep moving whether you watch or not.",
      "不再需要鬧鐘。你的錢現在要撐得跟你一樣久，而無論你看不看，市場都會繼續波動。"),
  };
  if (s.age >= 58) return {
    title: L("Retirement in sight", "退休在望"),
    text: L("The finish line is close. Every decision now is about how you want the last stretch, and the years after it, to look.",
      "終點線就在眼前。現在的每個決定，都關乎你希望最後一段路以及之後的日子是甚麼模樣。"),
  };
  if (s.age >= 45) return {
    title: L("Late career", "職涯後段"),
    text: L("You've seen a few cycles now. Parents get older, kids leave home, and the people you started with are starting to stop.",
      "你已經歷過幾個週期。父母老了，孩子離家，和你一起入行的人開始陸續退下。"),
  };
  if (s.track === "elite") return {
    title: L("High finance", "頂級金融圈"),
    text: L("Big money, long hours. Every year in elite finance costs you some sanity, so watch the bar.",
      "錢多，工時長。每在頂級金融圈多做一年，理智就會下降一些，請留意理智條。"),
  };
  if (s.track === "normie") return {
    title: L("A steady career", "穩定的事業"),
    text: L("Slower money, saner hours. Raises, exams and the occasional shady request from the boss.",
      "錢來得較慢，工時較正常。加薪、考試，偶爾還有老闆提出的可疑要求。"),
  };
  return { title: L("Adulthood", "成年"), text: cat(L("Living in ", "住在"), where, L(". Figuring it out as you go.", "，邊走邊摸索。")) };
}

// real-world context shown under some decisions
const DATA = {
  kid1: L("Temperament comes from what we're born with and what happens as we grow. Twin studies put about 40% of the differences in personality down to genes (Vukasović & Bratko 2015).",
    "性格來自先天和成長經歷。雙胞胎研究顯示，人格差異約有 40% 來自遺傳（Vukasović & Bratko 2015）。"),
  "kid2:0": L("In Walter Mischel's Stanford marshmallow studies, kids who waited longer did better later in life. A 2018 replication found the link much weaker once family background was taken into account (Watts, Duncan & Quan 2018).",
    "在 Walter Mischel 的史丹福棉花糖實驗中，等得較久的小孩日後表現較好。2018 年的重複研究發現，考慮家庭背景後，這種關聯弱得多（Watts、Duncan 與 Quan，2018）。"),
  compound: L("The rule of 72: divide 72 by the yearly return to get roughly how many years money takes to double. At 7% a year, that's about 10 years.",
    "72 法則：用 72 除以年回報率，大約就是資金翻倍所需的年數。年回報 7%，大約 10 年翻一倍。"),
  stockgame: L("Over 15 years, around 90% of actively managed US large-cap funds trail the S&P 500 (S&P Dow Jones Indices, SPIVA scorecards).",
    "以 15 年計，約九成主動管理的美國大型股基金跑輸標普 500 指數（標普道瓊斯指數 SPIVA 報告）。"),
  friendstartup: L("Research by Shikhar Ghosh at Harvard Business School found that about 75% of venture-backed startups never return their investors' money.",
    "哈佛商學院 Shikhar Ghosh 的研究發現，約 75% 獲創投支持的初創公司最終無法歸還投資者的本金。"),
  angel: L("Research by Shikhar Ghosh at Harvard Business School found that about 75% of venture-backed startups never return their investors' money.",
    "哈佛商學院 Shikhar Ghosh 的研究發現，約 75% 獲創投支持的初創公司最終無法歸還投資者的本金。"),
  "ethics:0": L("Trading on material non-public information is illegal in the US under the Securities Exchange Act of 1934, and the SEC brings insider trading cases every year.",
    "根據美國《1934 年證券交易法》，利用重大非公開資料進行交易屬違法，美國證監會每年都會提出內幕交易訴訟。"),
  cfoask: L("Under the Dodd-Frank Act (2010), SEC whistleblowers whose tips lead to sanctions over $1 million can receive 10–30% of the money collected.",
    "根據《多德-弗蘭克法案》（2010 年），若舉報導致超過 100 萬美元的制裁，美國證監會的吹哨者可獲所收款項的 10–30%。"),
  memefrenzy: L("In January 2021, GameStop shares rose more than 1,000% in about two weeks as retail traders piled in.",
    "2021 年 1 月，散戶蜂擁而入，GameStop 股價在約兩星期內升逾 1,000%。"),
  aiStart: L("Nvidia's market value passed $1 trillion in 2023 and $3 trillion in 2024 as demand for AI chips surged.",
    "隨著 AI 晶片需求急升，Nvidia 的市值在 2023 年突破 1 萬億美元，2024 年更突破 3 萬億美元。"),
  aiEnd: L("When the dot-com bubble burst, the Nasdaq fell about 78% from its March 2000 peak to its October 2002 low.",
    "科網泡沫爆破時，納斯達克指數由 2000 年 3 月的高位，跌至 2002 年 10 月的低位，跌幅約 78%。"),
  "crisis:0": L("In the 2008 financial crisis, the S&P 500 fell about 57% from its October 2007 peak to its March 2009 low.",
    "2008 年金融海嘯期間，標普 500 指數由 2007 年 10 月高位跌至 2009 年 3 月低位，跌幅約 57%。"),
  "ethics:1": L("In 2006 and 2007, backdated stock options led to investigations at more than 100 US companies, and several executives were criminally charged.",
    "2006 至 2007 年間，期權倒簽事件令超過 100 間美國公司受到調查，多名高層被刑事起訴。"),
  "ethics:2": L("The US Foreign Corrupt Practices Act (1977) makes it a crime to bribe foreign officials to win business, and companies have paid billions of dollars in penalties under it.",
    "美國《海外反腐敗法》（1977 年）規定賄賂外國官員以取得生意屬刑事罪行，企業因此支付的罰款高達數十億美元。"),
  "crisis:1": L("During the eurozone debt crisis, yields on Greece's 10-year government bonds rose above 30% in early 2012.",
    "歐債危機期間，希臘 10 年期國債孳息率在 2012 年初升至 30% 以上。"),
  "crisis:2": L("After the pandemic, US office vacancy rates climbed to record highs of nearly 20%, putting pressure on the banks that had lent against office buildings.",
    "疫情過後，美國寫字樓空置率升至接近 20% 的歷史高位，令借錢給寫字樓業主的銀行承受壓力。"),
  "midcareer:2": L("Since 2019, the World Health Organization has classified burn-out in its International Classification of Diseases (ICD-11) as an occupational phenomenon caused by chronic workplace stress.",
    "自 2019 年起，世界衞生組織在《國際疾病分類》（ICD-11）中把職業倦怠列為由長期工作壓力引起的職業現象。"),
  "legacy:0": L("The Giving Pledge, launched in 2010, asks the world's richest people to give away most of their wealth. More than 200 billionaires have signed it.",
    "2010 年發起的「捐贈誓言」邀請全球最富有的人捐出大部分財富，已有超過 200 位億萬富翁簽署。"),
  "era-homeboom": L("Between 2003 and 2007, emerging-market stocks (the MSCI Emerging Markets index) more than tripled, then fell by more than half in the 2008 crisis.",
    "2003 至 2007 年間，新興市場股票（MSCI 新興市場指數）升逾三倍，其後在 2008 年金融海嘯中跌去一半以上。"),
  "era-crypto": L("Bitcoin fell about 77% from its November 2021 peak to its late-2022 low, then went on to set new record highs.",
    "比特幣由 2021 年 11 月的高位下跌約 77% 至 2022 年底的低位，其後再創歷史新高。"),
  "era-green": L("Tesla's share price rose more than 700% in 2020 alone, making it the world's most valuable carmaker.",
    "Tesla 股價僅在 2020 年就上升超過 700%，成為全球市值最高的汽車製造商。"),
  "era-property": L("US home prices fell about 27% from their 2006 peak to their 2012 low, according to the S&P Case-Shiller national index.",
    "根據標普 Case-Shiller 全國指數，美國樓價由 2006 年高位下跌約 27% 至 2012 年低位。"),
  "era-biotech": L("Novo Nordisk, maker of the weight-loss drugs Ozempic and Wegovy, became Europe's most valuable company in 2023.",
    "生產減肥藥 Ozempic 和 Wegovy 的諾和諾德，在 2023 年成為歐洲市值最高的公司。"),
  password: L("Over the long run, the S&P 500 has returned roughly 10% a year on average including dividends, though some years it fell by a third or more.",
    "長遠而言，標普 500 指數連股息計算的平均年回報約為 10%，但有些年份會下跌三分之一或更多。"),
  pandemic: L("In early 2020, the S&P 500 fell about 34% in just over a month, the fastest drop of that size on record.",
    "2020 年初，標普 500 指數在一個多月內下跌約 34%，是有紀錄以來同等跌幅中最快的一次。"),
  bankrun: L("In March 2023, Silicon Valley Bank collapsed within about two days of a run by depositors. US deposits are insured by the FDIC up to $250,000 per depositor, per bank.",
    "2023 年 3 月，矽谷銀行在存戶擠提後約兩天內倒閉。美國存款由聯邦存款保險公司（FDIC）保障，每位存戶在每間銀行的上限為 25 萬美元。"),
  flashcrash: L("On 6 May 2010, the Dow Jones fell nearly 1,000 points within minutes before most of the loss was recovered: the original \"Flash Crash.\"",
    "2010 年 5 月 6 日，道瓊斯指數在幾分鐘內急跌近 1,000 點，隨後收復大部分失地，這就是最初的「閃崩」。"),
  rogue: L("In 1995, Nick Leeson's hidden trades lost about £827 million and brought down Barings, Britain's oldest merchant bank.",
    "1995 年，Nick Leeson 隱藏的交易虧損約 8.27 億英鎊，令英國歷史最悠久的商人銀行霸菱銀行倒閉。"),
  homecrisis: L("In the 1997 Asian financial crisis, the Thai baht lost about half its value against the US dollar within months.",
    "1997 年亞洲金融風暴期間，泰銖在數月內兌美元貶值約一半。"),
};

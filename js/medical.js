// ---------- health: bills that grow with age, optional insurance, and the incidents that come for everyone eventually ----------

// whether ordinary people get most hospital care paid for by the state where you live
const CITY_PUBLIC_HEALTH = { "New York": false, London: true, "Hong Kong": true, Singapore: true, Dubai: false, Monaco: true };
const publicHealth = () => cityName() in CITY_PUBLIC_HEALTH ? CITY_PUBLIC_HEALTH[cityName()] : s.c.g >= 3 && s.c.iso !== "USA";
// two kinds of cover: basic pays half a bill, premium pays almost all of it and includes yearly check-ups that catch problems early
const PLANS = {
  basic: { emoji: "🩹", name: L("Basic plan", "基本計劃"), share: 0.5, price: 700, sub: L("Pays half of any medical bill", "支付任何醫療賬單的一半") },
  premium: { emoji: "🏥", name: L("Premium plan", "高級計劃"), share: 0.1, price: 2500, sub: L("Pays 90% of bills, plus yearly check-ups that catch problems early", "支付九成賬單，另有每年體檢及早發現問題") },
};
const plan = () => PLANS[s.insurance] || null;
// you pay the smaller of what your plan leaves you, or what public healthcare leaves you
const billShare = () => Math.min(plan() ? plan().share : 1, publicHealth() ? 0.2 : 1);
const medBill = base => Math.round(base * costScale() * (s.prices || 1) * billShare());
const insurancePremium = (id = s.insurance) => PLANS[id] ? Math.round(PLANS[id].price * costScale() * (s.prices || 1) * (1 + Math.max(0, s.age - 30) * 0.03)) : 0;

// yearly health spending: the insurance premium, plus check-ups and pills that add up after 50
function healthCost() {
  if (s.age < 22) return 0;
  const aging = s.age > 50 ? 6500 * costScale() * (s.prices || 1) * (s.age - 50) * 0.012 * (publicHealth() ? 0.3 : 1) : 0;
  return Math.round(insurancePremium() + aging);
}

const billLine = b => cat(L(` The bill: ${fmt(b)}.`, ` 賬單：${fmt(b)}。`),
  plan() && plan().share <= (publicHealth() ? 0.2 : 1) ? cat(L(" Your ", " 其餘由你的"), plan().name, L(" paid the rest.", "支付。")) : publicHealth() ? L(" Public healthcare paid the rest.", " 其餘由公共醫療支付。") : "");

// a year away from work; your job waits for you, like a sabbatical
function medicalLeave() {
  if (s.income <= 0 || s.layoff) return;
  s.layoff = { job: s.baseJob || s.job, track: s.track, pay: s.income, rank: s.rank, back: s.age + 1, sabbatical: true, medical: true };
  s.job = JOBS.medleave;
  s.income = 0;
}

// each runs at most once per life; the odds rise with age, stress and a high-finance job
const MEDICAL = [
  { id: "med-back", from: 45, build: () => ({
    title: L("💥 Your back gives out", "💥 你的腰撐不住了"),
    text: L("Twenty years of hunching over a laptop catch up with you while you bend down to tie a shoe.", "二十年來對著電腦彎腰駝背，終於在你彎身綁鞋帶時一次過爆發。"),
    choices: [
      { label: L("A course of physiotherapy", "做一輪物理治療"), sub: UI.costs(medBill(3000)), run() { const b = medBill(3000); s.cash -= b; s.sanity += 3; return cat(L("Twelve sessions of being gently bullied by a physio. It works.", "被物理治療師溫柔地折磨了十二次。有效。"), billLine(b)); } },
      { label: L("Surgery", "做手術"), sub: UI.costs(medBill(25000)), run() { const b = medBill(25000); s.cash -= b; if (chance(0.8)) { s.sanity += 6; return cat(L("The surgery works. You can sit through a whole meeting without wincing.", "手術成功。你終於可以坐完整個會議而不皺眉。"), billLine(b)); } s.sanity -= 8; return cat(L("The surgery doesn't help much. You now own a very expensive standing desk.", "手術幫助不大。你現在擁有一張非常昂貴的升降桌。"), billLine(b)); } },
      { label: L("Painkillers, and keep working", "食止痛藥繼續做"), sub: L("Free, for now", "暫時免費"), run() { s.sanity -= 8; s.hustle -= 3; return L("You work through it. You also stop being able to sleep on your left side.", "你咬緊牙關繼續工作。你也再不能側左邊睡了。"); } },
    ],
  }) },
  { id: "med-heart", from: 50, build: () => ({
    title: L("🫀 Chest pains at your desk", "🫀 在辦公桌前胸口痛"),
    text: L("In the middle of a call, your chest goes tight and your left arm goes numb. A colleague calls an ambulance while you insist you're fine.", "通話途中，你胸口發緊，左手發麻。同事一邊叫救護車，你一邊堅持說自己沒事。"),
    choices: [
      { label: L("The best private hospital", "最好的私家醫院"), sub: UI.costs(medBill(80000)), run() { const b = medBill(80000); s.cash -= b; s.sanity -= 4; return cat(L("Two stents, a private room and a view of the river. You're home in five days.", "放了兩個支架，住私家房，望著河景。五日後你就出院了。"), billLine(b)); } },
      { label: L("The public hospital, and wait", "去公立醫院輪候"), sub: UI.costs(medBill(80000) * 0.25), run() { const b = Math.round(medBill(80000) * 0.25); s.cash -= b; s.sanity -= 12; return cat(L("Fourteen hours on a trolley in a corridor, then excellent care. You're fine, eventually.", "在走廊的病床上等了十四個鐘，之後得到很好的照顧。你最終沒事。"), billLine(b)); } },
      { label: L("Walk it off", "唔理佢"), sub: L("It's probably nothing", "大概沒甚麼"), run() {
        if (Math.random() < 0.5) { s.sanity -= 4; return L("It passes. You promise yourself you'll see a doctor, and don't.", "痛楚過去了。你答應自己會看醫生，結果沒有。"); }
        const b = medBill(100000); s.cash -= b; s.sanity -= 25; medicalLeave();
        return cat(L("Two weeks later it's a full heart attack. You survive, but you're off work for a year.", "兩星期後，你心臟病發。你活了下來，但要休養一年。"), billLine(b));
      } },
    ],
  }) },
  { id: "med-diabetes", from: 48, build: () => ({
    title: L("🩸 Type 2 diabetes", "🩸 第二型糖尿病"),
    text: L("Your blood test comes back with a lot of red numbers. Years of client dinners and vending-machine lunches have added up.", "驗血報告上一大堆紅字。多年的應酬晚飯和自動販賣機午餐終於累積起來了。"),
    choices: [
      { label: L("Overhaul your lifestyle", "徹底改變生活習慣"), sub: L("Walks, vegetables, no more 2am pizza", "散步、多菜、不再凌晨兩點吃薄餅"), run() { s.upkeep += 1500 * costScale(); s.sanity += 6; s.hustle -= 4; return L("You lose ten kilos and gain a deep, annoying interest in fibre.", "你減了十公斤，還對膳食纖維產生了濃厚而煩人的興趣。"); } },
      { label: L("Just take the medication", "只靠食藥"), sub: L("A bill every year", "每年都有藥費"), run() { const y = medBill(5000); s.upkeep += y; return L(`The pills work. They cost ${fmt(y)} a year, every year.`, `藥物有效，每年都要花 ${fmt(y)}。`); } },
      { label: L("Ignore it", "不理它"), sub: L("Doctors are dramatic", "醫生總是誇張"), run() {
        s.sanity -= 6;
        if (Math.random() < 0.4) { const b = medBill(40000); s.cash -= b; s.sanity -= 10; return cat(L("A year later you end up in hospital with complications.", "一年後你因併發症入院。"), billLine(b)); }
        return L("Nothing happens yet. Your doctor sends you increasingly passive-aggressive letters.", "暫時沒事。醫生寄給你的信越來越陰陽怪氣。");
      } },
    ],
  }) },
  { id: "med-scan", from: 52, build: () => ({
    title: L("🩻 A worrying scan", "🩻 一份令人擔心的掃描報告"),
    text: L("The doctor asks you to sit down before giving you the results. It's cancer, caught early. You'll need treatment, and a year off work.", "醫生先請你坐下才告訴你結果：是癌症，幸好發現得早。你需要治療，並休息一年。"),
    choices: [
      { label: L("Top private treatment", "頂級私家治療"), sub: UI.costs(medBill(180000)), run() { const b = medBill(180000); s.cash -= b; medicalLeave(); if (Math.random() < 0.85) { s.sanity -= 10; return cat(L("The best doctors money can buy. A year later, you're in remission.", "用錢買到最好的醫生。一年後，病情緩解。"), billLine(b)); } s.sanity -= 30; return cat(L("Even the best doctors can't make it easy. It's a brutal year, but you're still here.", "即使最好的醫生也無法令它變得輕鬆。那是殘酷的一年，但你仍然在這裡。"), billLine(b)); } },
      { label: L("Standard treatment", "標準治療"), sub: UI.costs(medBill(80000)), run() { const b = medBill(80000); s.cash -= b; medicalLeave(); if (Math.random() < 0.7) { s.sanity -= 18; return cat(L("It's slow and exhausting, but it works.", "過程漫長又累人，但有效。"), billLine(b)); } s.sanity -= 32; return cat(L("It takes two rounds of treatment instead of one. You get through it.", "治療要做兩輪而不是一輪。你熬過來了。"), billLine(b)); } },
      { label: L("An experimental trial abroad", "到海外參加實驗性療法"), sub: UI.costs(medBill(40000)), run() { const b = medBill(40000); s.cash -= b; medicalLeave(); if (Math.random() < 0.5) { s.sanity += 5; return cat(L("The trial works better than anyone expected. Your doctors write a paper about you.", "療效比所有人預期都好。你的醫生為你寫了一篇論文。"), billLine(b)); } s.sanity -= 28; return cat(L("The trial doesn't work, and you come home for standard treatment anyway.", "實驗療法無效，你最後還是回家接受標準治療。"), billLine(b)); } },
    ],
  }) },
  { id: "med-panic", from: 45, build: () => ({
    title: L("😰 A panic attack in a meeting", "😰 開會時恐慌症發作"),
    text: L("Halfway through a presentation, the room starts spinning and you can't breathe. You excuse yourself and sit on the bathroom floor for twenty minutes.", "簡報到一半，房間開始旋轉，你喘不過氣。你借故離開，在洗手間地上坐了二十分鐘。"),
    choices: [
      { label: L("See a therapist", "看心理治療師"), sub: UI.costs(medBill(4000)), run() { const b = medBill(4000); s.cash -= b; s.sanity += 12; return cat(L("It turns out you've been running on fear for twenty years. Knowing that helps.", "原來你二十年來都靠恐懼驅動。知道這點很有幫助。"), billLine(b)); } },
      { label: L("Take a month off", "放一個月假"), sub: L("Lose a month's pay", "損失一個月人工"), run() { s.cash -= Math.round(s.income / 12); s.sanity += 8; return L("A month of doing nothing. Your team survives without you, which is both a relief and an insult.", "一個月甚麼都不做。團隊沒有你也照樣運作，既令人安心又有點侮辱。"); } },
      { label: L("Push through", "硬撐下去"), sub: L("Nobody needs to know", "沒人需要知道"), run() { s.sanity -= 10; return L("You go back in and finish the deck. Nobody notices. That's almost worse.", "你回去完成簡報，沒有人察覺。這幾乎更糟。"); } },
    ],
  }) },
  { id: "med-knee", from: 45, build: () => ({
    title: L("🦵 A marathon injury", "🦵 跑馬拉松受傷"),
    text: L("Your midlife marathon ends at mile 19 with a loud pop from your knee.", "你的中年馬拉松在第 19 哩以膝蓋一聲巨響告終。"),
    choices: [
      { label: L("Knee surgery", "膝蓋手術"), sub: UI.costs(medBill(15000)), run() { const b = medBill(15000); s.cash -= b; s.sanity += 2; return cat(L("Six months later you're walking normally, and telling everyone about your surgery.", "六個月後你行得正常了，還跟所有人講你的手術。"), billLine(b)); } },
      { label: L("Rest and ice", "休息冰敷"), sub: L("Cheap and slow", "便宜但慢"), run() { s.hustle -= 5; s.sanity -= 3; return L("It mostly heals. You now predict rain with your knee.", "大致上好了。你現在可以用膝蓋預測下雨。"); } },
    ],
  }) },
];

// premium check-ups catch a quarter of problems before they become incidents
const medicalChance = age => (0.015 + (age - 45) * 0.004 + (s.sanity < 30 ? 0.03 : 0) + (s.track === "elite" ? 0.01 : 0)) * (s.insurance === "premium" ? 0.75 : 1);

// one visit from an insurance agent, some time in your thirties or forties
const insuranceChoices = () => [
  ...Object.entries(PLANS).map(([id, p]) => ({
    label: cat(`${p.emoji} `, p.name), sub: cat(p.sub, " · ", L(`${fmt(insurancePremium(id))} a year, rising with age`, `每年 ${fmt(insurancePremium(id))}，隨年齡上升`)),
    run() { s.insurance = id; return id === "premium" ? L("You sign up for the gold-plated plan. The agent shakes your hand for slightly too long.", "你簽了最高級的計劃。經紀跟你握手握得有點太久。") : L("You take the sensible plan. It won't cover everything, but it'll cover something.", "你選了實際的計劃。它不會全包，但總有保障。"); },
  })),
  { label: L("No thanks", "不用了"), sub: publicHealth() ? L("Public healthcare is enough", "公共醫療已經足夠") : L("You're young and healthy", "你年輕又健康"), run() { s.insurance = null; return L("You show the agent out. You've never been sick a day in your life, which is exactly what they all say.", "你送走了經紀。你一生都沒病過，而每個人都是這麼說的。"); } },
];

EVENTS.push(
  ev("insurance", [30, 48], () => !s.insurance && s.income > 0, () => ({
    title: L("🩺 An insurance agent calls", "🩺 保險經紀來電"),
    text: publicHealth()
      ? L("An agent says public healthcare is fine \"if you don't mind waiting.\" Private cover would pay most of your bills and skip the queues.", "經紀說公共醫療「如果你不介意輪候的話」也不錯。私人保險會支付大部分賬單，還可以不用排隊。")
      : L("An agent reminds you that a single hospital stay here can cost more than a car. You realise you have no cover at all.", "經紀提醒你，在這裡住一次醫院可能比買車還貴。你發現自己完全沒有保障。"),
    choices: insuranceChoices(),
  })),
);
EVENT_WEIGHT.insurance = () => 3;

function medicalScene(age) {
  if (age < 45 || Math.random() > medicalChance(age)) return null;
  const pool = MEDICAL.filter(m => age >= m.from && !s.used.has(m.id));
  if (!pool.length) return null;
  const m = pick(pool);
  s.used.add(m.id);
  return m;
}

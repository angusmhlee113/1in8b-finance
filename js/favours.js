// ---------- network: spend it on favours, let it bring you deals, and watch it fade if you never use it ----------

const FAVOURS = [
  { id: "referral", emoji: "🤝", name: L("Get a job referral", "請人轉介工作"), cost: 15,
    when: () => s.age >= 22 && s.age < END_AGE - 1,
    why: () => s.age < 22 ? L("Too young", "年紀太小") : null,
    run() { s.flags.careerAt = null; s.flags.referral = s.age; return L("An old colleague puts in a word for you. Your phone starts ringing.", "一位舊同事替你說了好話。你的電話開始響個不停。"); },
    after: () => openCareer() },
  { id: "tip", emoji: "💡", name: L("Tip from a friend at a fund", "基金界朋友的貼士"), cost: 10,
    when: () => s.cash > 1000,
    why: () => L("You need money to invest", "你需要有錢才可投資"),
    run() {
      const stake = Math.round(s.cash * 0.2);
      let text;
      if (Math.random() < 0.65) {
        const g = Math.round(stake * rnd(0.3, 1));
        s.cash += g;
        text = L(`You put ${fmt(stake)} where your friend said. It works: +${fmt(g)}.`, `你按朋友所說投入 ${fmt(stake)}。結果成功：賺 ${fmt(g)}。`);
      } else {
        const l = Math.round(stake * rnd(0.3, 0.8));
        s.cash -= l;
        text = L(`You put ${fmt(stake)} where your friend said. Your friend was wrong: -${fmt(l)}.`, `你按朋友所說投入 ${fmt(stake)}。朋友估錯了：蝕 ${fmt(l)}。`);
      }
      if (Math.random() < 0.2) { s.heat += 10; text = cat(text, L(" Later you realise the tip came from inside the company. That was insider trading.", " 後來你才發現貼士來自公司內部。那是內幕交易。")); }
      return text;
    } },
  { id: "mentor", emoji: "🧑‍🏫", name: L("Ask a mentor for advice", "向導師請教"), cost: 5,
    when: () => s.hustle < 100, why: () => L("Hustle is maxed", "拼勁已滿"),
    run() { s.hustle += 7; return L("Over one long lunch, your mentor tells you exactly what you're doing wrong. It stings. It helps.", "一頓長長的午餐，導師直接指出你做錯了甚麼。很刺耳，但很有用。"); } },
  { id: "friends", emoji: "🫂", name: L("Lean on your friends", "找朋友傾訴"), cost: 10,
    when: () => s.sanity < 100, why: () => L("Sanity is maxed", "理智已滿"),
    run() { s.sanity += 14; return L("Your friends drag you out for dinner and refuse to let you talk about work. You laugh until you cry.", "朋友硬拉你出去吃飯，不准你講工作。你笑到流眼淚。"); } },
  { id: "loan", emoji: "💸", name: L("Borrow from a rich friend", "向有錢朋友借錢"), cost: 20,
    when: () => s.cash < 0, why: () => L("Only when you're in debt", "只限負債時"),
    run() {
      const amount = Math.round(Math.min(-s.cash, 60000 * costScale() * (s.prices || 1)));
      s.cash += amount;
      s.friendDebt = (s.friendDebt || 0) + amount;
      return L(`A friend lends you ${fmt(amount)} with no interest, to be paid back over five years. Thanksgiving is a little awkward now.`, `一位朋友免息借你 ${fmt(amount)}，分五年還。之後的聚會有點尷尬。`);
    } },
  { id: "lawyer", emoji: "⚖️", name: L("Call your lawyer friend", "找律師朋友"), cost: 25,
    when: () => s.heat > 0, why: () => L("Nobody is investigating you", "沒有人在調查你"),
    run() { s.heat = Math.max(0, s.heat - 30); return L("Your lawyer friend cleans up your paperwork and tells you, firmly, to stop texting about trades.", "律師朋友替你整理好文件，並嚴肅地叫你別再用短訊討論交易。"); } },
  { id: "school", emoji: "🏫", name: L("Pull strings for your kid's school", "替孩子走後門入學"), cost: 15,
    when: () => (s.flags.kidUpkeep || 0) > 0, why: () => L("Only with a kid in school", "只限孩子在學"),
    run() {
      const cut = Math.round(s.flags.kidUpkeep * 0.4);
      s.flags.kidUpkeep -= cut;
      s.upkeep = Math.max(0, s.upkeep - cut);
      return L(`A board member you golf with finds your kid a scholarship. School costs drop by ${fmt(cut)} a year.`, `一位常跟你打高爾夫的校董替孩子找到獎學金。每年學費減少 ${fmt(cut)}。`);
    } },
];

function favourBlocker(f) {
  if ((s.favours || {})[f.id] === s.age) return L("Done this year", "今年已做");
  if (!f.when()) return f.why();
  if (s.network < f.cost) return L("Not enough network", "人脈不足");
  return null;
}

function favoursHTML() {
  if (s.age < 18 || ui.over) return "";
  return `<div class="phead"><h3>${tr(L("Call in a favour", "找人幫忙"))}</h3><small>${tr(L("costs network", "消耗人脈"))}</small></div>
    <p class="small muted shop-intro">${tr(L("Spend the people you know. Network you never use slowly fades.", "動用你認識的人。人脈不用的話會慢慢流失。"))}</p>
    <div class="shop">${FAVOURS.map(f => {
      const block = favourBlocker(f);
      return `<button class="shop-item" data-act="favour" data-v="${f.id}" ${block || ui.modal ? "disabled" : ""}>
        <span class="si-name">${f.emoji} ${tr(f.name)}</span>
        <span class="si-meta"><b class="network">-${f.cost} ${tr(UI.network)}</b>${block ? ` · ${tr(block)}` : ""}</span>
      </button>`;
    }).join("")}</div>`;
}

function callFavour(id) {
  const f = FAVOURS.find(x => x.id === id);
  if (!f || favourBlocker(f) || ui.modal || ui.over) return;
  const before = { cash: s.cash, network: s.network, hustle: s.hustle, sanity: s.sanity };
  s.network -= f.cost;
  const text = f.run();
  fix();
  (s.favours ||= {})[f.id] = s.age;
  s.flags.favourAt = s.age;
  const chips = [];
  const d = s.cash - before.cash;
  if (Math.abs(d) >= 1) chips.push({ text: `${d > 0 ? "+" : "-"}${fmt(Math.abs(d))}`, good: d > 0 });
  for (const k of ["network", "hustle", "sanity"]) if (s[k] !== before[k]) chips.push(statChip(k, s[k] - before[k]));
  record({ title: cat(`${f.emoji} `, f.name), text, chips, tone: d < 0 ? "bad" : "good" });
  if (f.after) return f.after();
  renderAll();
}

// a referral makes every offer on the next career screen better
const refBoost = () => s.flags.referral === s.age ? 1.15 : 1;

// ---------- network in the background ----------

// the more people you know, the more deals find you
const netBoost = () => 0.6 + s.network / 80;
for (const id of ["angel", "friendstartup", "gala", "golf", "boardseat", "poach", "headhunter", "familyoffice"]) {
  const base = EVENT_WEIGHT[id] || (() => 1);
  EVENT_WEIGHT[id] = () => base() * netBoost();
}

// once a year: network you don't use fades, a big one late in life earns board fees, and friends get paid back
function networkYear(year) {
  if (year < 22) return;
  if (s.network <= (s.netMark ?? s.network) && s.flags.favourAt !== year - 1) s.network -= 1;
  if (s.friendDebt > 0) {
    const pay = Math.min(s.friendDebt, Math.max(1000, s.friendDebt / 5));
    s.friendDebt -= pay;
    s.cash -= pay;
  }
  if (s.boardFee && s.network < 50) {
    s.boardFee = 0;
    s.notes.push({ bad: true, text: L(`🪑 At ${year}, the board quietly doesn't renew your seat. You weren't returning anyone's calls.`, `🪑 ${year} 歲，董事會靜靜地沒有續任你。你一直沒回別人的電話。`) });
  } else if (!s.boardFee && year >= 50 && s.network >= 70 && Math.random() < 0.1) {
    s.boardFee = Math.round((s.network - 50) * 1000 * costScale());
    s.notes.push({ bad: false, text: L(`🪑 At ${year}, a company asks you to join its board: ${fmt(s.boardFee)} a year for four meetings and a lot of nodding.`, `🪑 ${year} 歲，一間公司邀請你加入董事會：每年 ${fmt(s.boardFee)}，只需開四次會和不斷點頭。`) });
  }
  if (s.boardFee) s.cash += s.boardFee;
  s.netMark = s.network;
}

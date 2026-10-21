// ---------- spend money on yourself: trade cash for sanity, network or hustle, once a year each ----------

const SHOP = [
  { id: "therapy", emoji: "💬", name: L("Therapy sessions", "心理治療"), stat: "sanity", gain: 6, cost: 2000,
    text: L("You talk to someone who isn't trying to sell you anything. It helps more than you expected.", "你跟一個不是想賣東西給你的人傾偈。幫助比你預期的大。") },
  { id: "vacation", emoji: "🏝️", name: L("A real vacation, phone off", "真正的假期，關掉手機"), stat: "sanity", gain: 12, cost: 6000, side: { hustle: -2 },
    text: L("Two weeks somewhere with bad Wi-Fi. You come back tanned and forget your laptop password.", "在 Wi-Fi 很差的地方待了兩星期。你曬黑了回來，還忘了電腦密碼。") },
  { id: "retreat", emoji: "💆", name: L("Luxury wellness retreat", "豪華身心靜修營"), stat: "sanity", gain: 20, cost: 25000,
    text: L("Silent meditation, cold plunges and a $40 smoothie. You feel like a new person, a very rich one.", "靜修冥想、冰水浸浴，加一杯 $40 的果昔。你感覺脫胎換骨，而且是很有錢的那種。") },
  { id: "dinner", emoji: "🍷", name: L("Host a networking dinner", "舉辦交際晚宴"), stat: "network", gain: 6, cost: 3000,
    text: L("You seat people strategically and pick up the bill with a casual wave. Three of them follow up.", "你精心安排座位，再隨手一揮埋單。其中三個人之後主動聯絡你。") },
  { id: "club", emoji: "⛳", name: L("Private club membership", "私人會所會籍"), stat: "network", gain: 12, cost: 20000,
    text: L("You now know the right people, and the right people now know your handicap.", "你現在認識對的人，而對的人也知道你的高爾夫差點。") },
  { id: "course", emoji: "📚", name: L("Online course", "網上課程"), stat: "hustle", gain: 5, cost: 800,
    text: L("You actually finish it, which puts you ahead of 94% of people who sign up.", "你真的讀完了，這已經勝過 94% 報名的人。") },
  { id: "coach", emoji: "🎯", name: L("Executive coach", "行政人員教練"), stat: "hustle", gain: 10, cost: 12000,
    text: L("Your coach makes you write your goals on a whiteboard. Annoyingly, it works.", "教練要你把目標寫在白板上。煩人的是，真的有效。") },
];

// prices follow where you live and how much prices have risen since you were 18
const shopCost = item => Math.round(item.cost * costScale() * (s.prices || 1));

function shopBlocker(item) {
  if ((s.bought || {})[item.id] === s.age) return L("Done this year", "今年已做");
  if (s[item.stat] >= 100) return L("Already maxed", "已經滿分");
  if (s.cash < shopCost(item)) return L("Can't afford it", "負擔不起");
  return null;
}

function shopHTML() {
  if (s.age < 18 || ui.over) return "";
  return `<div class="phead"><h3>${tr(L("Treat yourself", "犒賞自己"))}</h3><small>${tr(L("once a year each", "每樣每年一次"))}</small></div>
    <p class="small muted shop-intro">${tr(L("Spend money to top up a bar. It comes straight out of your net worth.", "花錢補充狀態，費用直接從身家扣除。"))}</p>
    <div class="shop">${SHOP.map(item => {
      const block = shopBlocker(item);
      return `<button class="shop-item" data-act="buy" data-v="${item.id}" ${block || ui.modal ? "disabled" : ""}>
        <span class="si-name">${item.emoji} ${tr(item.name)}</span>
        <span class="si-meta"><b class="${item.stat}">+${item.gain} ${tr(UI[item.stat])}</b> · ${block ? tr(block) : `-${fmt(shopCost(item))}`}</span>
      </button>`;
    }).join("")}</div>`;
}

function buy(id) {
  const item = SHOP.find(x => x.id === id);
  if (!item || shopBlocker(item) || ui.modal || ui.over) return;
  const cost = shopCost(item);
  const before = { network: s.network, hustle: s.hustle, sanity: s.sanity };
  s.cash -= cost;
  s[item.stat] += item.gain;
  for (const [k, v] of Object.entries(item.side || {})) s[k] += v;
  fix();
  (s.bought ||= {})[item.id] = s.age;
  const chips = [{ text: `-${fmt(cost)}`, good: false }];
  for (const k of ["network", "hustle", "sanity"]) if (s[k] !== before[k]) chips.push(statChip(k, s[k] - before[k]));
  record({ title: cat(`${item.emoji} `, item.name), text: item.text, chips, tone: "good" });
  renderAll();
}

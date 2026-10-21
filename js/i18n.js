// ---------- language ----------

let lang = "en";
try { if (localStorage.getItem("lang") === "zh") lang = "zh"; } catch {}

// every piece of player-facing text is an { en, zh } pair, picked at draw time,
// so switching language can redraw the current screen without re-rolling anything
const L = (en, zh) => ({ en, zh });
const isPair = x => x !== null && typeof x === "object" && "en" in x;
const tr = x => isPair(x) ? x[lang] : (x ?? "");
// joins strings and pairs into one pair
const cat = (...parts) => L(parts.map(p => isPair(p) ? p.en : p).join(""), parts.map(p => isPair(p) ? p.zh : p).join(""));

const UI = {
  network: L("Network", "人脈"),
  hustle: L("Hustle", "拼勁"),
  sanity: L("Sanity", "理智"),
  age: n => L(`Age ${n}`, `${n} 歲`),
  continue: L("Continue →", "繼續 →"),
  uhoh: L("Uh oh →", "大事不妙 →"),
  chose: L("You chose:", "你選擇了："),
  noChange: L("No change", "沒有變化"),
  newRole: L("New role:", "新職位："),
  swan: L("Black swan", "黑天鵝"),
  aiBoom: L("🤖 AI boom", "🤖 AI 熱潮"),
  flex: L("Flex", "炫耀"),
  odds: p => L(`Your odds: ~${pct(p)}`, `你的機率：約 ${pct(p)}`),
  costs: x => L(`Costs about ${fmt(x)}`, `約需 ${fmt(x)}`),
};

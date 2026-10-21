// ---------- the portfolio screen, the net worth chart and the ticker tape ----------

const PRESETS = {
  safe: { emoji: "🐢", name: L("Safe", "穩陣"), mix: { cash: 0.3, bonds: 0.5, stocks: 0.2, spec: 0 } },
  sixty: { emoji: "♟️", name: L("60/40", "60/40"), mix: { cash: 0, bonds: 0.4, stocks: 0.6, spec: 0 } },
  index: { emoji: "📈", name: L("All index", "全買指數"), mix: { cash: 0, bonds: 0, stocks: 1, spec: 0 } },
  yolo: { emoji: "🦈", name: L("YOLO", "全押"), mix: { cash: 0, bonds: 0, stocks: 0.4, spec: 0.6 } },
};

// asset names that get an explainer when you hover them
const ASSET_TIP = { bonds: "bond", stocks: "index", spec: "spec", pension: "pension", home: "equity" };
const assetLabel = k => ASSET_TIP[k] ? tr(jgL(ASSET_NAMES[k], ASSET_TIP[k])) : tr(ASSET_NAMES[k]);

const toDraft = a => Object.fromEntries(ASSETS.map(k => [k, Math.round(a[k] * 100)]));
const fromDraft = d => {
  const total = ASSETS.reduce((t, k) => t + d[k], 0) || 1;
  return Object.fromEntries(ASSETS.map(k => [k, d[k] / total]));
};

function openPortfolio() {
  if (!s || ui.over || ui.modal || s.age < 18) return;
  openModal({ kind: "portfolio", draft: toDraft(allocOf()), pension: s.pensionRate ?? 0.05 });
  renderAll();
}

// a stacked bar of everything you own; debts show as a red bar instead
function breakdownHTML() {
  const parts = [];
  if (s.cash > 0) for (const k of ASSETS) if (allocOf()[k] > 0) parts.push([k, s.cash * allocOf()[k]]);
  if (s.pension > 0) parts.push(["pension", s.pension]);
  if (homeEquity() > 0) parts.push(["home", homeEquity()]);
  const total = parts.reduce((t, p) => t + p[1], 0);
  const debt = (s.cash < 0 ? -s.cash : 0) + (homeEquity() < 0 ? -homeEquity() : 0);
  return `<div class="stack">${total > 0 ? parts.map(([k, v]) => `<span style="flex:${v / total};background:${ASSET_COLORS[k]}" title="${tr(ASSET_NAMES[k])}"></span>`).join("") : `<span class="empty"></span>`}</div>
    <div class="legend">${parts.map(([k, v]) => `<span><i style="background:${ASSET_COLORS[k]}"></i>${assetLabel(k)} <b>${fmt(v)}</b></span>`).join("")}
      ${debt > 0 ? `<span class="neg"><i style="background:var(--bad)"></i>${tr(L("Debt", "負債"))} <b>-${fmt(debt)}</b></span>` : ""}</div>`;
}

const mixLine = a => L(`Expected about ${pct1(expectedReturn(a))} a year · in a bad year, about -${pct(badYear(a))}`, `預期每年約 ${pct1(expectedReturn(a))} · 差的年份約 -${pct(badYear(a))}`);

function portfolioHTML(m) {
  const a = fromDraft(m.draft);
  const h = s.property;
  const block = homeBlocker();
  const price = homePrice();
  const rate = mortgageRate();
  return `${modalHead(L("Your money", "你的財務"))}
    <div class="mbody pf">
      <h2>${tr(L("📊 Portfolio", "📊 投資組合"))}</h2>
      <div class="end-nw ${netWorth() < 0 ? "neg" : ""}">${fmt(netWorth())}</div>
      ${breakdownHTML()}
      <div class="pfrates">
        <span>${tr(jgL(L("Inflation", "通脹"), "inflation"))} <b>${pct1(s.inflation || 0)}</b></span>
        <span>${tr(jgL(L("Central bank rate", "央行利率"), "rate"))} <b>${pct1(s.rate ?? 0)}</b></span>
        <span>${tr(jgL(L("Your borrowing rate", "你的借貸利率"), "borrow"))} <b>${pct1(debtRate())}</b></span>
        <span>${tr(jgL(L("Credit score", "信貸評分"), "credit"))} <b>${s.credit ?? "—"}</b> ${s.credit ? `<small>${tr(creditLabel(s.credit))}</small>` : ""}</span>
        <span>${tr(jgL(L("Income tax", "入息稅"), "incometax"))} <b>${pct(incomeTaxRate())}</b></span>
        <span>${tr(jgL(L("Capital gains tax", "資產增值稅"), "cgt"))} <b>${pct(capGainsRate())}</b></span>
      </div>

      <h3 class="end-h">${tr(L("How your savings are invested", "你的積蓄怎樣投資"))}</h3>
      <div class="presets">${Object.entries(PRESETS).map(([id, p]) => `<button class="chip" data-act="pf-preset" data-v="${id}">${p.emoji} ${tr(p.name)}</button>`).join("")}</div>
      ${ASSETS.map(k => `<label class="slider"><span><i style="background:${ASSET_COLORS[k]}"></i>${assetLabel(k)}</span>
        <input type="range" min="0" max="100" step="5" value="${m.draft[k]}" data-asset="${k}" aria-label="${tr(ASSET_NAMES[k])}">
        <b id="pf-${k}">${Math.round(a[k] * 100)}%</b></label>`).join("")}
      <p class="small muted" id="pf-mix">${tr(mixLine(a))}</p>

      ${s.age < PENSION_AGE ? `<h3 class="end-h">${tr(jgL(L("Pension", "退休金"), "pension"))}</h3>
      <p class="small muted">${tr(L(`Paid from your salary before tax, invested ${jg("60/40", "sixtyforty")}, and locked until ${PENSION_AGE}. Balance: ${fmt(s.pension || 0)}.`, `在扣稅前從薪金撥出，以 ${jg("60/40", "sixtyforty")} 投資，鎖定至 ${PENSION_AGE} 歲。結餘：${fmt(s.pension || 0)}。`))}</p>
      <div class="presets">${PENSION_RATES.map(r => `<button class="chip ${m.pension === r ? "on" : ""}" data-act="pf-pension" data-v="${r}">${tr(r ? L(`${r * 100}% of pay`, `薪金 ${r * 100}%`) : L("Nothing", "不供"))}</button>`).join("")}</div>
      ${s.pension > 0 ? `<button class="ghost" data-act="pf-cashout">${tr(L(`Cash it out early (you get ${fmt(s.pension * 0.7)} after penalties)`, `提早提取（扣除罰款後得 ${fmt(s.pension * 0.7)}）`))}</button>` : ""}` : ""}

      <h3 class="end-h">${tr(L("Home", "住所"))}</h3>
      ${h ? `<p class="small">${tr(L(`Worth ${fmt(h.value)} · mortgage left ${fmt(h.loan)} at ${pct1(h.rate)} · you pay ${fmt(h.loan > 0 ? h.payment : 0)} a year`, `市值 ${fmt(h.value)} · 尚欠按揭 ${fmt(h.loan)}，利率 ${pct1(h.rate)} · 每年供款 ${fmt(h.loan > 0 ? h.payment : 0)}`))}</p>
        <button class="secondary" data-act="pf-sell">${tr(L(`Sell it (you'd get ${fmt(h.value * 0.95 - h.loan)} after fees)`, `賣出（扣除費用後得 ${fmt(h.value * 0.95 - h.loan)}）`))}</button>`
      : `<p class="small muted">${tr(L(`You rent. A home here costs about ${fmt(price)}: 20% deposit plus 3% fees, and a ${MORTGAGE_YEARS}-year ${jg("mortgage", "mortgage")} at ${pct1(rate)} costing ${fmt(annuity(price * 0.8, rate, MORTGAGE_YEARS))} a year. Owning saves you rent.`, `你在租樓。這裡一個單位約 ${fmt(price)}：兩成首期加 3% 雜費，${MORTGAGE_YEARS} 年${jg("按揭", "mortgage")}利率 ${pct1(rate)}，每年供 ${fmt(annuity(price * 0.8, rate, MORTGAGE_YEARS))}。買樓可以省租金。`))}</p>
        <button class="secondary" data-act="pf-buy" ${block ? "disabled" : ""}>${tr(block ? cat("🔒 ", block) : L("Buy a home", "買樓"))}</button>`}

      <button class="primary" data-act="pf-save">${tr(L("Save and close", "儲存並關閉"))}</button>
    </div>`;
}

// buying and selling happen straight away and show up in the life record
function portfolioAct(act, v) {
  const m = ui.modal;
  if (!m || m.kind !== "portfolio") return;
  if (act === "pf-preset") m.draft = toDraft(PRESETS[v].mix);
  else if (act === "pf-pension") m.pension = +v;
  else if (act === "pf-buy" && !homeBlocker()) {
    const price = buyHome();
    record({ title: L("🏠 You bought a home", "🏠 你買了樓"), text: L(`You buy a home for ${fmt(price)} with a ${MORTGAGE_YEARS}-year mortgage. You spend the first weekend assembling furniture and questioning everything.`, `你以 ${fmt(price)} 買了一個單位，做 ${MORTGAGE_YEARS} 年按揭。第一個週末你都在砌傢俬，同時懷疑人生。`), tone: "good", term: "mortgage" });
  } else if (act === "pf-sell" && s.property) {
    const got = sellHome();
    record({ title: L("🏠 You sold your home", "🏠 你賣了樓"), text: L(`After fees and paying off the mortgage, you walk away with ${fmt(got)}. Back to renting.`, `扣除費用並清還按揭後，你拿到 ${fmt(got)}。重新做租客。`), tone: got >= 0 ? "good" : "bad" });
  } else if (act === "pf-cashout" && s.pension > 0) {
    const got = cashOutPension();
    record({ title: L("🏦 You cashed out your pension early", "🏦 你提早提取了退休金"), text: L(`You get ${fmt(got)} after penalties and tax. Retired you will have words with present you.`, `扣除罰款和稅後你拿到 ${fmt(got)}。退休後的你會有話要跟現在的你說。`), tone: "bad", term: "pension" });
  } else if (act === "pf-save") {
    const before = allocOf();
    s.alloc = fromDraft(m.draft);
    s.pensionRate = m.pension;
    if (ASSETS.some(k => Math.abs(before[k] - s.alloc[k]) > 0.001)) record({ title: L("📊 You rebalanced your portfolio", "📊 你重新配置了投資組合"), text: cat(L("New mix: ", "新配置："), ASSETS.filter(k => s.alloc[k] > 0).map(k => `${tr(ASSET_NAMES[k])} ${Math.round(s.alloc[k] * 100)}%`).join(" · "), "."), term: "diversify" });
    return closeModal();
  }
  renderAll();
}

// sliders update their numbers live without redrawing the whole box
function portfolioInput(el) {
  const m = ui.modal;
  if (!m || m.kind !== "portfolio") return;
  m.draft[el.dataset.asset] = +el.value;
  const a = fromDraft(m.draft);
  for (const k of ASSETS) $(`#pf-${k}`).textContent = `${Math.round(a[k] * 100)}%`;
  $("#pf-mix").textContent = tr(mixLine(a));
}

// ---------- net worth chart ----------

// a signed log scale, so a life that goes from -$50k to $40M still reads well
const slog = v => Math.sign(v) * Math.log10(1 + Math.abs(v) / 1000);

function chartSVG(big) {
  const pts = (s.hist || []).filter(p => p.age >= 18);
  if (pts.length < 2) return "";
  const W = 320, H = big ? 110 : 90, pad = 4;
  const last = pts[pts.length - 1];
  const span = Math.max(1, last.age - 18);
  const ys = pts.map(p => slog(p.worth));
  const lo = Math.min(0, ...ys), hi = Math.max(0.1, ...ys);
  const x = age => pad + (age - 18) / span * (W - pad * 2);
  const y = v => pad + (hi - slog(v)) / (hi - lo) * (H - pad * 2);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${x(p.age).toFixed(1)},${y(p.worth).toFixed(1)}`).join("");
  const marks = pts.map(p => {
    const yr = s.years[p.age] || {};
    const promo = (s.promos || []).includes(p.age);
    const c = yr.swan ? "var(--ink)" : yr.crash ? "var(--bad)" : promo ? "var(--hus)" : null;
    return c ? `<circle cx="${x(p.age).toFixed(1)}" cy="${y(p.worth).toFixed(1)}" r="${big ? 3 : 2.4}" fill="${c}"><title>${tr(UI.age(p.age))}: ${fmt(p.worth)}</title></circle>` : "";
  }).join("");
  const worths = pts.map(p => p.worth);
  return `<figure class="chart">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${tr(L("Net worth by age", "按年齡劃分的身家"))}">
      <line x1="${pad}" x2="${W - pad}" y1="${y(0)}" y2="${y(0)}" stroke="var(--line)" stroke-dasharray="3 3"/>
      <path d="${line}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/>
      ${marks}
    </svg>
    <figcaption><span>${tr(UI.age(18))}</span><span>${tr(L(`Peak ${fmt(Math.max(...worths))} · low ${fmt(Math.min(...worths))}`, `最高 ${fmt(Math.max(...worths))} · 最低 ${fmt(Math.min(...worths))}`))}</span><span>${tr(UI.age(last.age))}</span></figcaption>
    <figcaption class="key"><span>${tr(L("🔴 crash · ⚫ black swan · 🟡 promotion", "🔴 崩盤 · ⚫ 黑天鵝 · 🟡 升職"))}</span></figcaption>
  </figure>`;
}

// ---------- ticker tape ----------

function tickerHTML() {
  const m = s.market;
  if (!m || s.age < 18) return `<div class="tape"><span>${tr(L("📟 Markets are open. You're too young to care.", "📟 市場開市了。你年紀太小，不關你事。"))}</span></div>`;
  const q = (name, v, tip) => `<span>${tip ? tr(jgL(name, tip)) : tr(name)} <b class="${v >= 0 ? "up" : "down"}">${v >= 0 ? "▲" : "▼"}${(Math.abs(v) * 100).toFixed(1)}%</b></span>`;
  const items = [
    q(L("STOCKS", "股市"), m.stocks, "stocks"), q(L("BONDS", "債券"), m.bonds, "bond"), q(L("SPEC", "投機"), m.spec, "spec"), q(L("HOMES", "樓價"), m.home, "homes"),
    `<span>${tr(jgL(L("CPI", "通脹"), "cpi"))} <b>${pct1(s.inflation || 0)}</b></span>`,
    `<span>${tr(jgL(L("RATE", "利率"), "rate"))} <b>${pct1(s.rate ?? 0)}</b></span>`,
    q(cat(L("YOU", "你"), ` (${nm()})`), m.portfolio || 0),
    `<span>${tr(jgL(L("NET WORTH", "身家"), "networth"))} <b>${fmt(netWorth())}</b></span>`,
  ].join("");
  return `<div class="tape"><div class="tape-run">${items}${items}</div></div>`;
}

// ---------- a tax event for the rich ----------

EVENTS.push(
  ev("taxhaven", [30, 62], () => s.cash > 1e6 && !NO_CGT.has(cityName()) && !s.flags.cayman, () => {
    const saved = Math.round(s.cash * 0.01 + s.income * incomeTaxRate());
    const where = s.cash > 2e7 ? L("Monaco", "摩納哥") : L("Dubai", "杜拜");
    return {
      title: L("✈️ Your accountant has an idea", "✈️ 你的會計師有個主意"),
      text: cat(L("\"Have you considered ", "「你有沒有考慮過"), where, L(`?\" Your accountant estimates you'd save about ${fmt(saved)} a year in tax by moving there.`, `？」會計師估計你搬過去每年可省約 ${fmt(saved)} 稅款。`)),
      choices: [
        { label: cat(L("Move to ", "搬到"), where), sub: L("No income or capital gains tax", "無入息稅、無資產增值稅"), run() { s.city = where; s.sanity -= 6; s.network -= 4; return cat(L("You now live in ", "你現在住在"), where, L(". Your tax bill is zero and so is your number of real friends here.", "。你的稅單是零，你在這裡的真朋友數目也是零。")); } },
        { label: L("Set up a Cayman Islands structure", "設立開曼群島架構"), sub: L("Stay home, hide the gains", "留在原地，把收益藏起來"), run() { s.flags.cayman = true; s.heat += 14; s.cash -= 50000; return L("Your investment gains now technically happen on a Caribbean island you have never visited. The SEC finds this interesting.", "你的投資收益現在技術上發生在一個你從未去過的加勒比海島。證監會覺得這很有趣。"); } },
        { label: L("Pay your taxes like everyone else", "像其他人一樣交稅"), sub: L("Civic duty", "公民責任"), run() { s.sanity += 6; s.network += 2; return L("You pay in full. Somewhere, a road gets fixed, and you decide that one is yours.", "你如數繳稅。某處有條路修好了，你決定那條是你的。"); } },
      ],
    };
  }),
);

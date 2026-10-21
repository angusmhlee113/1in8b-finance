// ---------- 韭菜: the retail investor who chases hype and keeps getting harvested ----------

const LEEK_TIERS = [
  { min: 1, emoji: "🌱", title: L("Baby Leek", "韭菜苗"), line: L("Your first harvest. Everyone remembers their first.", "第一次被收割。每個人都記得自己的第一次。") },
  { min: 3, emoji: "🥬", title: L("Certified Leek", "認證韭菜"), line: L("Bought high, sold low, came back for more.", "高買低賣，然後回來再買。") },
  { min: 5, emoji: "👑", title: L("Leek King", "韭菜王"), line: L("Harvested so often the market should pay you rent.", "被收割了這麼多次，市場應該付你租金。") },
];
const leekTier = n => LEEK_TIERS.filter(t => n >= t.min).pop();

const LEEK_EXPLAINED = L("韭菜 (\"leek\") is Chinese internet slang for retail investors who chase hype, get harvested by smarter players, then grow back and get harvested again.",
  "「韭菜」是網絡用語，指追逐熱潮、被精明玩家收割，然後重新長出來再被收割的散戶。");

// records a time you lost money by following hype, a crowd or a stranger
function leekMoment(what, loss) {
  (s.flags.leeks ||= []).push({ age: s.age, what, loss: Math.round(loss) });
}

// your avatar, with leek leaves sprouting from your head
function drawLeekAvatar(cv) {
  drawAvatar(cv);
  const g = cv.getContext("2d");
  const px = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  px(5, 0, 1, 3, "#3f9a4b"); px(7, 0, 1, 2, "#57b862"); px(8, 0, 1, 3, "#3f9a4b"); px(10, 0, 1, 2, "#57b862");
  px(6, 1, 1, 2, "#7fd08a"); px(9, 1, 1, 2, "#7fd08a");
}

function drawLeekCard() {
  const leeks = s.flags.leeks;
  const tier = leekTier(leeks.length);
  const total = leeks.reduce((a, b) => a + b.loss, 0);
  const worst = leeks.slice().sort((a, b) => b.loss - a.loss).slice(0, 3);
  const W = 540, H = 720, k = 2;
  const cv = document.createElement("canvas");
  cv.width = W * k; cv.height = H * k;
  const g = cv.getContext("2d");
  g.scale(k, k);
  const sans = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif`;
  const serif = `Georgia, "Times New Roman", "Noto Serif TC", "PMingLiU", serif`;
  const mono = `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;

  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#f3fbe9");
  bg.addColorStop(1, "#d6efc6");
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  // a field of leeks along the bottom, waiting to be harvested
  for (let x = 6; x < W; x += 18) {
    g.fillStyle = "#4fae5c"; g.fillRect(x, H - 70, 4, 40);
    g.fillStyle = "#7fd08a"; g.fillRect(x + 5, H - 62, 3, 32);
    g.fillStyle = "#f6f2e4"; g.fillRect(x, H - 30, 8, 12);
  }

  g.textAlign = "center";
  g.fillStyle = "#2e6b36"; g.font = `700 14px ${mono}`;
  g.fillText(tr(L("CERTIFICATE OF HARVEST", "收割證書")), W / 2, 44);
  g.fillStyle = "#17181c"; g.font = `700 40px ${serif}`;
  g.fillText(`${tier.emoji} ${tr(tier.title)}`, W / 2, 96);
  g.fillStyle = "#4a5a4c"; g.font = `500 16px ${sans}`;
  g.fillText(tr(tier.line), W / 2, 126);

  const av = document.createElement("canvas");
  drawLeekAvatar(av);
  g.imageSmoothingEnabled = false;
  g.drawImage(av, W / 2 - 64, 148, 128, 128);
  g.strokeStyle = "#9cc98e"; g.lineWidth = 3; g.strokeRect(W / 2 - 64, 148, 128, 128);

  g.fillStyle = "#17181c"; g.font = `700 22px ${serif}`;
  g.fillText(playerName, W / 2, 310);
  g.fillStyle = "#4a5a4c"; g.font = `500 15px ${sans}`;
  g.fillText(`${s.c.flag} ${tr(s.c.name)}`, W / 2, 334);

  g.fillStyle = "#c23a2b"; g.font = `800 34px ${mono}`;
  g.fillText(tr(L(`Harvested ×${leeks.length}`, `被收割 ×${leeks.length}`)), W / 2, 384);
  g.fillStyle = "#17181c"; g.font = `600 16px ${sans}`;
  g.fillText(tr(L(`Lost to the crowd: ${fmt(total)}`, `跟風蝕掉：${fmt(total)}`)), W / 2, 412);

  g.textAlign = "left"; g.font = `500 14px ${sans}`;
  worst.forEach((m, i) => {
    const y = 452 + i * 28;
    g.fillStyle = "#6a6b74"; g.fillText(tr(UI.age(m.age)), 50, y);
    g.fillStyle = "#17181c";
    let what = tr(m.what);
    while (g.measureText(what).width > 300 && what.length > 4) what = what.slice(0, -2);
    if (what !== tr(m.what)) what += "…";
    g.fillText(what, 120, y);
    g.fillStyle = "#c23a2b"; g.textAlign = "right"; g.fillText(`-${fmt(m.loss)}`, W - 50, y); g.textAlign = "left";
  });

  g.textAlign = "center"; g.fillStyle = "#2e6b36"; g.font = `600 13px ${sans}`;
  g.fillText(gameURL().replace(/^https?:\/\//, "") || tr(L("1 in 8 Billion: Finance Bro", "80 億分之一：金融佬")), W / 2, H - 82);
  return cv.toDataURL("image/png");
}

// the leek section of the ending screen, shown only to lives that got harvested
function leekHTML() {
  const leeks = s.flags.leeks;
  if (!leeks || !leeks.length) return "";
  const tier = leekTier(leeks.length);
  const card = drawLeekCard();
  return `<h3 class="end-h">${tier.emoji} ${tr(L("Unlocked: ", "解鎖："))}${tr(tier.title)}</h3>
    <p class="small muted">${tr(LEEK_EXPLAINED)}</p>
    <img class="shot endshot" src="${card}" alt="${tr(L("Leek certificate", "韭菜證書"))}">
    <a class="secondary save" href="${card}" download="1in8billion-leek.png">${tr(L("🥬 Save leek certificate", "🥬 儲存韭菜證書"))}</a>`;
}

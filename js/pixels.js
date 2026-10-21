// ---------- pixel art: the avatar on your ID card and the scene of where you live ----------

const SKINS = ["#f3d2b5", "#e8b98f", "#cf9a6b", "#ab7448", "#83532f", "#5c3a22"];
const HAIRS = { black: "#1d1a19", brown: "#5a3a24", blond: "#d8b25a", red: "#9c4a22", grey: "#9a9a9a" };
// which skin tones and hair colors to draw from, by country
const LOOKS = {
  east: [[0, 1], ["black"]], south: [[2, 3, 4], ["black"]], africa: [[4, 5], ["black"]],
  europe: [[0, 1], ["brown", "blond", "black", "red"]], latin: [[1, 2, 3], ["black", "brown"]],
  mena: [[1, 2, 3], ["black", "brown"]], sea: [[1, 2, 3], ["black"]],
};
const REGION = {
  CHN: "east", JPN: "east", KOR: "east", HKG: "east", SGP: "east",
  IND: "south", PAK: "south", BGD: "south",
  NGA: "africa", ETH: "africa", COD: "africa", KEN: "africa", ZAF: "africa",
  USA: "europe", RUS: "europe", DEU: "europe", GBR: "europe", FRA: "europe", ITA: "europe", CAN: "europe", AUS: "europe", CHE: "europe",
  BRA: "latin", MEX: "latin", ARG: "latin",
  EGY: "mena", IRN: "mena", TUR: "mena", SAU: "mena", ARE: "mena",
  IDN: "sea", PHL: "sea", VNM: "sea", THA: "sea",
};
const BRIGHT = ["#e0533d", "#3d7be0", "#e0b33d", "#3dae6b", "#9b5de5", "#f28c28"];

function makeLook(iso) {
  const [skins, hairs] = LOOKS[REGION[iso]];
  return { skin: SKINS[pick(skins)], hair: HAIRS[pick(hairs)], kid: pick(BRIGHT), hoodie: pick(BRIGHT) };
}

// deterministic random numbers, so a scene doesn't reshuffle every time it's redrawn
function seeded(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const hashStr = str => [...str].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619), 2166136261);

function outfit() {
  if (s.age < 15) return { body: s.look.kid };
  if (s.age < 22 && s.track !== "degen") return { body: s.look.hoodie };
  if (s.track === "elite") return { body: "#1f2a44", shirt: "#f4f4f4", tie: "#b3262e" };
  if (s.track === "normie") return { body: "#6b7280", shirt: "#ececec" };
  return { body: "#18181b", stripe: "#f7931a" };
}

function drawAvatar(cv) {
  cv.width = 16; cv.height = 16;
  const g = cv.getContext("2d");
  const px = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const { skin, hair } = s.look;
  const o = outfit();
  px(0, 0, 16, 16, "#dde8e1");
  px(4, 2, 8, 3, hair); px(3, 3, 1, 5, hair); px(12, 3, 1, 5, hair);
  px(4, 5, 8, 6, skin); px(3, 7, 1, 2, skin); px(12, 7, 1, 2, skin);
  px(4, 4, 8, 1, hair);
  if (s.type === "aggressive" && s.age >= 22) { px(5, 7, 3, 1, "#111"); px(8, 7, 3, 1, "#111"); }
  else { px(6, 7, 1, 1, "#1d1a19"); px(9, 7, 1, 1, "#1d1a19"); }
  px(7, 9, 2, 1, "#8a4b3a");
  px(7, 11, 2, 1, skin);
  px(3, 12, 10, 4, o.body);
  if (o.shirt) px(6, 12, 4, 4, o.shirt);
  if (o.tie) px(7, 12, 2, 4, o.tie);
  if (o.stripe) px(3, 13, 10, 1, o.stripe);
}

// which backdrop fits this point in your life
function sceneSetting() {
  if (s.cash >= 1e7) return "beach";
  if (s.age >= 18 && s.age < 22 && s.school && s.school !== "none") return "campus";
  if (s.age >= 22 && s.track === "elite") return "finance";
  if (s.age >= 22 && (s.city || s.c.hub >= 2)) return "city";
  if (s.c.g <= 1 && s.c.hub <= 1) return "village";
  return s.c.g >= 3 && s.c.hub >= 2 ? "city" : "town";
}

function scenePeople() {
  const me = { skin: s.look.skin, hair: s.look.hair, shirt: outfit().body, kid: s.age < 12 };
  if (s.age < 18) {
    const parents = [
      { skin: s.look.skin, hair: s.look.hair, shirt: "#7a8a99" },
      { skin: s.look.skin, hair: s.look.hair, shirt: "#a8707a" },
    ];
    const sibs = Array.from({ length: Math.min(2, s.family.siblings) }, (_, i) => ({ skin: s.look.skin, hair: s.look.hair, shirt: BRIGHT[(i + 2) % BRIGHT.length], kid: true }));
    return [...parents, me, ...sibs];
  }
  if (s.age < 22) return [me, { skin: SKINS[1], hair: HAIRS.brown, shirt: "#3d7be0" }, { skin: SKINS[3], hair: HAIRS.black, shirt: "#e0b33d" }];
  const people = [me];
  if (s.flags.married) people.push({ skin: s.look.skin, hair: HAIRS.brown, shirt: "#a8707a" });
  if (s.flags.kid) people.push({ skin: s.look.skin, hair: s.look.hair, shirt: "#3dae6b", kid: true });
  return people;
}

function drawScene(cv) {
  const W = 240, H = 80;
  cv.width = W; cv.height = H;
  const g = cv.getContext("2d");
  const px = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const setting = sceneSetting();
  const rnd = seeded(hashStr(setting + s.c.flag + (s.city ? s.city.en : "")));
  const GROUND = 58;

  // sky and clouds
  px(0, 0, W, 30, "#9fd3e6");
  px(0, 30, W, GROUND - 30, "#c4e5ef");
  for (let i = 0; i < 4; i++) {
    const x = rnd() * 220, y = 3 + rnd() * 16;
    px(x, y + 2, 16, 4, "#ffffff"); px(x + 3, y, 9, 3, "#ffffff"); px(x + 11, y + 1, 6, 3, "#ffffff");
  }

  const windows = (x, y, w, h, frame, glass, lit) => {
    px(x, y, w, h, frame);
    for (let wy = y + 3; wy < y + h - 4; wy += 5)
      for (let wx = x + 3; wx < x + w - 3; wx += 5) px(wx, wy, 3, 3, rnd() < 0.2 ? lit : glass);
  };
  const tree = (x, y) => { px(x + 2, y + 5, 2, 5, "#6b4a2b"); px(x, y, 6, 6, "#3d8b4f"); px(x + 1, y - 2, 4, 3, "#4fa860"); };

  if (setting === "village") {
    for (let x = 0; x < W; x += 30) px(x, GROUND - 8 - rnd() * 8, 34, 20, "#8cc28a");
    for (let i = 0; i < 4; i++) {
      const x = 12 + i * 52 + rnd() * 10;
      px(x, GROUND - 12, 20, 12, "#d9c3a0");
      for (let r = 0; r < 6; r++) px(x - 2 + r, GROUND - 13 - r, 24 - r * 2, 1, "#a0522d");
      px(x + 8, GROUND - 7, 4, 7, "#6b4a2b");
      tree(x + 26, GROUND - 10);
    }
  } else if (setting === "beach") {
    px(0, 40, W, GROUND - 40, "#3a8fc2");
    for (let x = 0; x < W; x += 12) px(x + rnd() * 6, 44 + rnd() * 10, 5, 1, "#bfe3f5");
    px(150, GROUND - 26, 60, 26, "#f4efe6");
    px(146, GROUND - 28, 68, 3, "#c7b49a");
    for (let x = 156; x < 205; x += 12) px(x, GROUND - 20, 7, 8, "#7fc4e0");
    [130, 222].forEach(x => { px(x, GROUND - 22, 2, 22, "#8a6a43"); px(x - 6, GROUND - 24, 14, 3, "#3d8b4f"); px(x - 3, GROUND - 26, 8, 2, "#4fa860"); });
  } else if (setting === "campus") {
    px(0, GROUND - 10, W, 10, "#8cc28a");
    px(80, GROUND - 32, 80, 32, "#e6dccb");
    for (let r = 0; r < 10; r++) px(78 + r * 4, GROUND - 33 - r, 84 - r * 8, 1, "#c9b99d");
    for (let x = 86; x < 156; x += 10) px(x, GROUND - 26, 4, 26, "#f4efe6");
    px(114, GROUND - 14, 12, 14, "#6b4a2b");
    tree(30, GROUND - 14); tree(50, GROUND - 12); tree(180, GROUND - 14); tree(205, GROUND - 12);
  } else {
    // skylines: towns are low, cities are tall, the finance district is tallest
    const tall = setting === "finance" ? 52 : setting === "city" ? 42 : 22;
    for (let x = 0; x < W; x += 14 + rnd() * 6) {
      const h = 10 + rnd() * tall;
      px(x, GROUND - h, 12 + rnd() * 6, h, setting === "town" ? "#b9c6cf" : "#a3b4c2");
    }
    if (setting === "town") {
      windows(14, GROUND - 40, 46, 40, "#ece6da", "#7d93a6", "#f2d98b");
      px(32, GROUND - 8, 8, 8, "#a0522d");
      tree(70, GROUND - 12);
    } else {
      windows(12, GROUND - 54, 40, 54, setting === "finance" ? "#2d3b4e" : "#d8dde3", "#88a9c3", "#f2d98b");
      if (setting === "finance") {
        windows(190, GROUND - 50, 36, 50, "#2d3b4e", "#88a9c3", "#f2d98b");
        px(190, GROUND - 30, 36, 3, "#0f3d26");
        for (let x = 192; x < 224; x += 4) px(x, GROUND - 29, 2, 1, rnd() < 0.6 ? "#45d394" : "#ff6d5e");
      }
    }
    // railing along the pavement
    px(0, GROUND - 4, W, 1, "#7f8a93");
    for (let x = 0; x < W; x += 8) px(x, GROUND - 4, 1, 4, "#7f8a93");
  }

  // ground
  if (setting === "village") {
    px(0, GROUND, W, H - GROUND, "#b08d5c");
    for (let x = 0; x < W; x += 9) px(x + rnd() * 4, GROUND + 6 + rnd() * 14, 3, 1, "#8f6f45");
  } else if (setting === "beach" || setting === "campus") {
    px(0, GROUND, W, H - GROUND, setting === "beach" ? "#ead8a8" : "#9ccf93");
    if (setting === "campus") px(0, GROUND + 8, W, 8, "#d8cfbd");
  } else {
    px(0, GROUND, W, 5, "#cfc9bc");
    px(0, GROUND + 5, W, H - GROUND - 5, "#55585e");
    for (let x = 4; x < W; x += 20) px(x, GROUND + 13, 10, 1, "#e8e3d0");
  }

  // the people in your life, standing on the pavement
  const people = scenePeople();
  let x = setting === "town" ? 92 : 100;
  for (const p of people) {
    const h = p.kid ? 9 : 14;
    const top = GROUND - h + 1;
    const head = p.kid ? 3 : 4;
    px(x, top, head, head, p.skin);
    px(x, top - 1, head, 1, p.hair);
    px(x - (p.kid ? 0 : 1), top + head, head + (p.kid ? 0 : 2), h - head - 3, p.shirt);
    px(x, GROUND - 2, 1, 3, "#33302c"); px(x + head - 1, GROUND - 2, 1, 3, "#33302c");
    x += p.kid ? 8 : 10;
  }
}

// e.g. "Xi'an, China · an apartment · with your parents and 2 siblings"
function sceneCaption() {
  const setting = sceneSetting();
  const placeFull = s.city ? s.city : L(`${s.home.en}, ${s.c.name.en}`, `${s.c.name.zh}${s.home.zh}`);
  const homes = {
    village: L("a family house", "一間家族老屋"), town: L("an apartment", "一個住宅單位"), city: L("a city apartment", "一個市區單位"),
    campus: L("on campus", "在大學校園"), finance: L("a glass tower downtown", "市中心的玻璃大廈"), beach: L("a beach house", "一間海濱別墅"),
  };
  let who;
  if (s.age < 18) {
    const n = s.family.siblings;
    who = n ? L(`with your parents and ${n} sibling${n > 1 ? "s" : ""}`, `與父母和 ${n} 個兄弟姊妹同住`) : L("with your parents", "與父母同住");
  } else if (s.age < 22 && setting === "campus") who = L("with your roommates", "與室友同住");
  else if (s.flags.married) who = s.flags.kid ? L("with your partner and kid", "與伴侶和孩子同住") : L("with your partner", "與伴侶同住");
  else who = L("on your own", "獨居");
  return cat(placeFull, " · ", homes[setting], " · ", who);
}

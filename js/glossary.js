// ---------- finance terms: a plain explanation and an example, learned the moment it happens to you ----------

// each term: its real name, a plain explanation with no other jargon in it, and an everyday example
const GLOSSARY = {
  compound: [L("Compound interest", "複利"),
    L("Your money earns money, and then that extra money earns money too. The longer you wait, the faster it snowballs.", "你的錢會生錢，生出來的錢又會再生錢。放得越久，滾得越快。"),
    L("Put away $100 a month from age 20 and you could have about $250,000 by 65. Start at 40 and it's closer to $60,000.", "由 20 歲起每月儲 $100，到 65 歲可能有約 $250,000；40 歲才開始，就只有約 $60,000。")],
  index: [L("Index fund", "指數基金"),
    L("One purchase that buys you a small piece of hundreds of big companies at once, instead of trying to guess which single company will win.", "一次過買入幾百間大公司的一小部分，而不是去估邊一間公司會贏。"),
    L("Like buying a slice of the whole pizza instead of betting on one topping.", "好似買成個薄餅的一份，而不是只押注其中一種配料。")],
  bond: [L("Bond", "債券"),
    L("You lend money to a government or a big company, and they pay you back later with a little extra each year. Safer than shares, but it grows slower.", "你借錢給政府或大公司，他們之後還錢，每年再多俾少少利息。比股票安全，但增長較慢。"),
    L("Lend the government $1,000 for 10 years, and it pays you about $40 a year until it gives the $1,000 back.", "借 $1,000 給政府 10 年，每年收約 $40 利息，到期再拿回 $1,000。")],
  rates: [L("Interest rate", "利率"),
    L("The extra you pay when you borrow money, or earn when you save it. When prices rise too fast, the central bank pushes rates up to slow everyone's spending.", "借錢時要多付、存錢時可多賺的那部分。物價升得太快時，中央銀行會加息，令大家少啲消費。"),
    L("At 5%, a $10,000 loan costs you $500 a year. At 10%, it costs $1,000.", "利率 5%，借 $10,000 每年要付 $500；利率 10%，就要付 $1,000。")],
  inflation: [L("Inflation", "通脹"),
    L("Prices slowly going up, so the same money buys a bit less every year.", "物價慢慢上升，同樣的錢每年能買的東西少咗啲。"),
    L("A coffee that costs $3 today costs about $4 in 15 years at normal inflation.", "今日 $3 一杯的咖啡，在正常通脹下 15 年後大約要 $4。")],
  margin: [L("Margin call", "追收保證金"),
    L("When you invest with money borrowed from your broker and prices drop, the broker demands you pay some back right away. If you can't, they sell your investments for you, at the worst possible time.", "當你借經紀的錢投資而價格下跌，經紀會要求你即刻還部分錢。還唔到，他們就會在最差的時候幫你賣掉投資。"),
    L("You buy $10,000 of shares with $5,000 of your own money. They fall 40%, and suddenly your $5,000 is almost gone.", "你用自己 $5,000 加借來的錢買 $10,000 股票。股價跌四成，你的 $5,000 幾乎冇晒。")],
  bankruptcy: [L("Bankruptcy", "破產"),
    L("A court process for people who can never pay back what they owe. Most of the debt is cancelled, but you lose your stuff and banks won't trust you for years.", "給永遠還不起債的人的法庭程序。大部分債務一筆勾銷，但你會失去財產，銀行多年都不會信你。"),
    L("Like flipping the board in a game of Monopoly: the game is over, and nobody wants to play with you for a while.", "好似玩大富翁反枱：遊戲結束，但之後一段時間冇人想同你玩。")],
  credit: [L("Credit score", "信貸評分"),
    L("A number that tells banks how good you are at paying back loans. A high score gets you cheaper loans; a low one gets you expensive loans or a no.", "一個話俾銀行知你還錢有幾可靠的數字。分數高，借錢平；分數低，借錢貴或者借唔到。"),
    L("Paying your phone bill late a few times can cost you thousands more on a future home loan.", "幾次遲交電話費，將來買樓的貸款可能要多付幾千元。")],
  mortgage: [L("Mortgage", "按揭"),
    L("A big loan to buy a home, paid back a little every month for 20 to 30 years. If you stop paying, the bank can take the home.", "用來買樓的大筆貸款，每月還少少，還 20 至 30 年。停止供款的話，銀行可以收樓。"),
    L("You pay 20% of the price yourself, the bank lends the other 80%, and you pay it back with interest over 25 years.", "你自己付兩成樓價，銀行借你其餘八成，你用 25 年連利息還清。")],
  negequity: [L("Negative equity", "負資產"),
    L("When your home is worth less than what you still owe on it. Selling it wouldn't even pay off the loan.", "你層樓的價值低過你仲欠銀行的錢。就算賣咗佢，都還唔清貸款。"),
    L("You owe the bank $400,000, but prices fall and your home now sells for only $350,000.", "你欠銀行 $400,000，但樓價下跌，你層樓而家只值 $350,000。")],
  foreclosure: [L("Foreclosure", "銀主盤"),
    L("When the bank takes back your home because you stopped paying the loan, then sells it, often cheaply.", "因為你停止供樓，銀行收回你的房子再賣出，通常賣得好平。"),
    L("Miss enough payments and the bank changes the locks.", "斷供太多期，銀行就會換鎖。")],
  pension: [L("Pension", "退休金"),
    L("Money taken from your pay every month and saved for when you're old. You usually pay no tax on it, but you can't touch it until a set age.", "每月從你人工撥出、留待年老時用的錢。通常唔使交稅，但要到指定年齡才可以拿。"),
    L("Putting 10% of a $50,000 salary away every year from 25 can grow to over $500,000 by 60.", "由 25 歲起每年把 $50,000 人工的一成存入，到 60 歲可滾到超過 $500,000。")],
  cgt: [L("Capital gains tax", "資產增值稅"),
    L("Tax on the profit you make when an investment goes up in value. A few places, like Singapore, Hong Kong and Dubai, don't charge it.", "投資升值賺到的利潤要交的稅。新加坡、香港和杜拜等少數地方不收。"),
    L("You buy shares for $1,000 and sell for $1,500. The tax is on the $500 profit, not the whole $1,500.", "你用 $1,000 買股票，$1,500 賣出。要交稅的是賺到的 $500，而唔係成個 $1,500。")],
  haven: [L("Tax haven", "避稅天堂"),
    L("A country with very low or no taxes, where rich people move themselves or their money. Moving there is legal. Hiding money there and not telling your own country is not.", "稅率極低甚至冇稅的地方，富人會搬過去或把錢放過去。搬過去合法；把錢藏起來唔話俾自己國家知就違法。"),
    L("Moving to Dubai to pay no income tax is legal. A secret Cayman Islands account you never declare is not.", "搬去杜拜唔使交入息稅是合法的；開一個從不申報的開曼群島秘密戶口就不是。")],
  options: [L("Stock options", "認股權"),
    L("A promise from your company that you can buy its shares later at today's low price. If the company becomes valuable, that's worth a fortune. If it fails, it's worth nothing.", "公司承諾你日後可以用今日的低價買入公司股份。公司變得值錢，你就發達；公司失敗，就一文不值。"),
    L("You can buy shares at $1 each. Five years later they're worth $20, so each share makes you $19.", "你可以用每股 $1 買入。五年後股價變成 $20，每股就賺 $19。")],
  layoff: [L("Layoff", "裁員"),
    L("Losing your job because the company wants to save money, not because you did anything wrong.", "因為公司想慳錢而失去工作，而不是因為你做錯了甚麼。"),
    L("A bad year at the company, and a whole team is let go in one morning.", "公司一年業績差，成個團隊一個上午就被裁走。")],
  recession: [L("Recession", "經濟衰退"),
    L("When a country's whole economy shrinks for months: businesses earn less, people lose jobs, and share prices fall.", "整個國家的經濟收縮幾個月：生意賺少咗、人們失業、股價下跌。"),
    L("Restaurants get quieter, shops close and everyone you know is worried about their job.", "餐廳冷清了，店舖執笠，身邊人人都擔心份工。")],
  bubble: [L("Bubble", "泡沫"),
    L("When the price of something shoots up far beyond what it's really worth, just because everyone expects it to keep rising. Eventually it pops and the price crashes.", "某樣東西的價格升到遠超實際價值，只因為人人都以為會繼續升。最終泡沫爆破，價格暴跌。"),
    L("In 1637, people in Holland paid as much for a single tulip bulb as for a house. Then, almost overnight, nobody wanted them.", "1637 年，荷蘭人用一間屋的價錢買一個鬱金香球莖。然後幾乎一夜之間，冇人再想要。")],
  squeeze: [L("Short squeeze", "軋空"),
    L("Some traders bet that a share price will fall. If it rises instead, they're forced to buy the shares to stop their losses, and all that buying pushes the price up even more.", "有些交易員押注股價會跌。如果股價反而上升，他們被迫買入股票止蝕，大量買盤令股價升得更高。"),
    L("In 2021, a struggling video game shop's shares jumped from $20 to over $400 in a few weeks this way.", "2021 年，一間經營困難的遊戲店股價就是這樣在幾星期內由 $20 升到超過 $400。")],
  insider: [L("Insider trading", "內幕交易"),
    L("Buying or selling shares using secret company news that the public doesn't know yet. It's illegal, because everyone else is playing without that information.", "利用公眾還未知道的公司秘密消息買賣股票。這是違法的，因為其他人都冇呢啲資料。"),
    L("Your friend at a company tells you it's about to be bought, and you buy its shares the day before the news comes out.", "在某公司工作的朋友話你知公司即將被收購，你在消息公佈前一日買入它的股票。")],
  hedge: [L("Hedge fund", "對沖基金"),
    L("A private investment club for rich people, run by professionals who charge big fees and try to make money whether prices go up or down.", "專為富人而設的私人投資會，由專業人士管理，收費好貴，嘗試無論升定跌都賺錢。"),
    L("A typical fee: 2% of your money every year, plus 20% of any profit.", "常見收費：每年收你資金的 2%，再加任何利潤的 20%。")],
  diversify: [L("Diversification", "分散投資"),
    L("Spreading your money across lots of different things, so one bad choice can't wipe you out.", "把錢分散到很多不同地方，令一個錯誤決定不會令你輸晒。"),
    L("Don't put all your eggs in one basket.", "唔好將所有雞蛋放在同一個籃。")],
  sixtyforty: [L("60/40 portfolio", "60/40 投資組合"),
    L("A classic simple plan: 60% of your money in shares to grow, and 40% in bonds to stay steady, so bad years hurt less.", "一個經典的簡單配置：六成放股票求增長，四成放債券求穩定，令差的年份冇咁痛。"),
    L("In a year when shares drop 20%, a 60/40 mix might only drop about 10%.", "股市跌兩成的年份，60/40 組合可能只跌一成左右。")],
  dca: [L("Dollar-cost averaging", "平均成本法"),
    L("Putting the same amount in every month, whatever the price, instead of trying to guess the best moment. When prices are low, your money automatically buys more.", "不論價格高低，每月投入同樣金額，而不是嘗試估最佳時機。價格低時，你的錢自然買得多啲。"),
    L("$200 a month buys 2 shares when they cost $100, and 4 shares when they drop to $50.", "每月 $200，股價 $100 時買到 2 股，跌到 $50 時就買到 4 股。")],
  emergency: [L("Emergency fund", "應急錢"),
    L("A few months of living costs kept as plain cash, so a surprise bill or losing your job doesn't force you to borrow or sell investments at a bad time.", "以現金存放幾個月的生活費，令突如其來的賬單或失業不會逼你借錢或在差時機賣投資。"),
    L("Your car breaks down and the repair is $2,000. With an emergency fund, it's a bad day, not a crisis.", "架車壞了，修理要 $2,000。有應急錢的話，這只是倒霉的一天，而不是危機。")],
  devaluation: [L("Currency devaluation", "貨幣貶值"),
    L("When your country's money becomes worth less compared to other countries' money, so your savings buy less of anything from abroad.", "你國家的錢相對其他國家的錢變得不值錢，你的積蓄能買到的外國東西少咗。"),
    L("Your savings could buy a new iPhone last year. After the currency drops, they only buy half of one.", "去年你的積蓄夠買一部新 iPhone；貨幣貶值後，只夠買半部。")],
  bankrun: [L("Bank run", "擠提"),
    L("When lots of people rush to take their money out of a bank at the same time. Banks lend most deposits out, so they can't pay everyone at once, and that can make the bank collapse.", "很多人同一時間趕去銀行提款。銀行把大部分存款借了出去，無法即時全數支付，可能因此倒閉。"),
    L("A rumour spreads on social media, a queue forms outside, and the bank closes within days.", "社交媒體傳出謠言，銀行門外大排長龍，幾日內銀行就關門了。")],
  blackswan: [L("Black swan", "黑天鵝"),
    L("A rare event nobody saw coming that changes everything, which afterwards everyone says was obvious.", "一件沒有人預料到、卻改變一切的罕見事件。事後人人都說早就看得出。"),
    L("A virus that shuts down the whole world for two years.", "一種令全世界停擺兩年的病毒。")],
  crypto: [L("Cryptocurrency", "加密貨幣"),
    L("Digital money that no bank or government controls, bought and sold online. Its price can double or halve in a few weeks.", "沒有銀行或政府控制、在網上買賣的數碼貨幣。價格可以幾星期內翻倍或腰斬。"),
    L("Bitcoin went from under $1 in 2010 to over $60,000 in 2021, with several 70% crashes along the way.", "比特幣由 2010 年不足 $1 升到 2021 年超過 $60,000，途中經歷過幾次七成的暴跌。")],
  angel: [L("Angel investing", "天使投資"),
    L("Putting your own money into brand-new small companies, hoping one becomes huge. Most fail, so one big win has to make up for all the losses.", "把自己的錢投資在剛起步的小公司，希望其中一間變得巨大。大部分會失敗，要靠一次大勝彌補所有損失。"),
    L("You give $10,000 to ten startups each. Nine close down. The tenth becomes worth $5 million.", "你給十間初創各 $10,000。九間倒閉，第十間變成價值 $500 萬。")],
  ponzi: [L("Ponzi scheme", "龐氏騙局"),
    L("A scam that pays early investors with money from new investors, not from real profits. It looks amazing until new money stops coming in, then it collapses.", "用新投資者的錢支付舊投資者，而不是真正的利潤。看起來好得驚人，直到冇新錢進來就會倒塌。"),
    L("If someone promises steady high returns every single month, no matter what the markets do, be very suspicious.", "如果有人承諾無論市況如何，每個月都有穩定的高回報，就要非常小心。")],
  leverage: [L("Leverage", "槓桿"),
    L("Investing with borrowed money as well as your own. It makes your wins bigger, and your losses bigger too.", "用自己的錢加上借來的錢一起投資。它會放大你的盈利，也會放大你的虧損。"),
    L("With three times leverage, a 10% rise makes you 30%, and a 10% fall loses you 30%.", "用三倍槓桿，升一成你賺三成；跌一成你蝕三成。")],
  options2: [L("Options trading", "期權交易"),
    L("Paying a small amount for a bet that a share price will go up or down before a deadline. Get it right and you can multiply your money; get it wrong and you lose all of it.", "付少少錢押注股價會在某個期限前上升或下跌。估啱可以賺幾倍，估錯就全部輸晒。"),
    L("You pay $500 betting a share will rise this week. It rises: you might make $3,000. It doesn't: the $500 is gone.", "你付 $500 押注某股本星期會升。升了可能賺 $3,000；不升，$500 就冇晒。")],
  sec: [L("The SEC", "美國證券交易委員會"),
    L("The US government agency that polices the stock market, catches cheaters and can fine people or send them to prison.", "監管美國股市的政府機構，負責捉作弊的人，可以罰款甚至送人入獄。"),
    L("Like a referee for the stock market, with the power to hand out very expensive red cards.", "好似股市的球證，可以出非常昂貴的紅牌。")],
};

// which scene teaches which term; scenes not listed here fall back to their milestone key
const TERM_FOR = {
  compound: "compound", brokerage: "index", stockgame: "diversify", invclub: "dca", hysa: "emergency", emergency: "emergency",
  rebalance: "diversify", hedge: "hedge", sixtyforty: "sixtyforty", bondladder: "bond", omaha: "index", fomo: "bubble",
  memefrenzy: "squeeze", earningsyolo: "options2", allin: "leverage", whale: "crypto", freeze: "crypto", nft: "bubble",
  cfoask: "insider", ethics: "insider", bet: "hedge", crisis: "recession", crisis2: "recession", retireplan: "ponzi",
  angel: "angel", friendstartup: "angel", dollarize: "devaluation", house: "mortgage", tax: "haven", taxhaven: "haven", taxaudit: "cgt",
  layoffs: "layoff", aiStart: "bubble", aiEnd: "bubble", "era-crypto": "crypto", bankrun: "bankrun", pandemic: "blackswan",
  flashcrash: "blackswan", rogue: "leverage", hundredx: "compound", password: "index", creditcard: "credit", cosign: "credit",
  poach: "options", grind: "leverage", summer: "leverage",
};

const termFor = id => {
  if (!id) return null;
  return TERM_FOR[id] || TERM_FOR[String(id).split(":")[0]] || null;
};

// a small explainer box under a scene, which also adds the term to this life's glossary
function termHTML(key) {
  const g = GLOSSARY[key];
  if (!g) return "";
  (s.terms ||= new Set()).add(key);
  return `<div class="term"><b>📖 ${tr(g[0])}</b> · ${tr(g[1])}<div class="eg">${tr(L("For example: ", "例子："))}${tr(g[2])}</div></div>`;
}

// ---------- hover tips: the jargon stays on screen, and hovering, tapping or tabbing to it explains it ----------

// a glossary key, or a [title, explanation] pair for labels that aren't glossary terms
const TIPS = {
  bond: "bond", index: "index", inflation: "inflation", credit: "credit", mortgage: "mortgage", pension: "pension", cgt: "cgt", sixtyforty: "sixtyforty",
  spec: [L("Speculative bets", "投機炒賣"), L("Risky investments like crypto, meme stocks and tiny startups. They can multiply your money, or lose most of it in a year.", "高風險投資，例如加密貨幣、爆炒股和細小初創。可以令你的錢翻幾倍，也可以一年內輸掉大部分。")],
  equity: [L("Home equity", "物業淨值"), L("The part of your home you actually own: what it's worth, minus what you still owe the bank.", "你層樓真正屬於你的部分：樓價減去你仲欠銀行的錢。")],
  stocks: [L("Stocks", "股市"), L("Small pieces of companies. This shows how much the stock market went up or down this year.", "公司的一小部分擁有權。這裡顯示今年股市升跌了多少。")],
  homes: [L("Home prices", "樓價"), L("How much home prices went up or down this year.", "今年樓價升跌了多少。")],
  cpi: [L("CPI · Consumer Price Index", "CPI · 消費物價指數"), L("A measure of how fast everyday prices like food, rent and transport are rising. This is this year's inflation.", "量度食物、租金和交通等日常物價上升速度的指標，即是今年的通脹。")],
  rate: [L("Central bank rate", "央行利率"), L("The interest rate set by the country's central bank. Loan rates, mortgage rates and what your savings earn all follow it.", "由中央銀行訂立的利率。貸款利率、按揭利率和存款利息都跟著它走。")],
  borrow: [L("Your borrowing rate", "你的借貸利率"), L("The interest you pay on any debt you have: the central bank rate plus extra, and more again if your credit score is low.", "你欠債時要付的利息：央行利率加上額外部分，信貸評分低的話再高一些。")],
  incometax: [L("Income tax", "入息稅"), L("The share of your pay the government takes. It depends on where you live: nothing in Dubai, about a quarter in New York.", "政府從你人工中拿走的部分。視乎你住在哪裡：杜拜是零，紐約約四分之一。")],
  meltup: [L("Melt-up", "狂飆"), L("When markets shoot up very fast because everyone is scared of missing out, not because companies suddenly got better. It often ends in a crash.", "市場因為人人怕錯過而急速飆升，而不是因為公司突然變好。通常以崩盤收場。")],
  networth: [L("Net worth", "身家"), L("Everything you own, minus everything you owe.", "你擁有的一切，減去你欠的一切。")],
};

// wraps a label so it shows its tip; jgL does it for both languages at once
const jg = (text, key) => `<span class="jargon" tabindex="0" data-tip="${key}">${text}</span>`;
const jgL = (pair, key) => L(jg(pair.en, key), jg(pair.zh, key));

function tipContent(key) {
  const t = TIPS[key];
  if (!t) return "";
  const [title, def] = typeof t === "string" ? GLOSSARY[t] : t;
  return `<b>${tr(title)}</b>${tr(def)}`;
}

// one floating box, moved next to whichever label you point at
const tipBox = document.createElement("div");
tipBox.id = "tip";
tipBox.setAttribute("role", "tooltip");
tipBox.hidden = true;
document.body.appendChild(tipBox);
let tipFor = null;

function showTip(el) {
  const html = tipContent(el.dataset.tip);
  if (!html) return;
  tipFor = el;
  tipBox.innerHTML = html;
  tipBox.hidden = false;
  const r = el.getBoundingClientRect();
  const w = tipBox.offsetWidth, h = tipBox.offsetHeight;
  const left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2));
  const top = r.bottom + 8 + h > innerHeight ? r.top - h - 8 : r.bottom + 8;
  tipBox.style.left = `${left}px`;
  tipBox.style.top = `${Math.max(8, top)}px`;
}
function hideTip() {
  tipFor = null;
  tipBox.hidden = true;
}
// the dashboard redraws every year; keep the tip on the new copy of the label you're still pointing at
function refreshTip() {
  if (!tipFor || tipFor.isConnected) return;
  const again = document.querySelector(`.jargon[data-tip="${tipFor.dataset.tip}"]:hover`);
  if (again) showTip(again); else hideTip();
}

const jargonOf = e => e.target instanceof Element ? e.target.closest(".jargon") : null;
document.addEventListener("mouseover", e => { const j = jargonOf(e); if (j && j !== tipFor) showTip(j); else if (!j && tipFor) hideTip(); });
document.addEventListener("focusin", e => { const j = jargonOf(e); if (j) showTip(j); });
document.addEventListener("focusout", e => { if (jargonOf(e)) hideTip(); });
// taps on phones toggle the tip; tapping anywhere else closes it
document.addEventListener("click", e => { const j = jargonOf(e); if (j) { if (j === tipFor) hideTip(); else showTip(j); } else if (tipFor) hideTip(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && tipFor) hideTip(); });
addEventListener("scroll", () => tipFor && hideTip(), true);

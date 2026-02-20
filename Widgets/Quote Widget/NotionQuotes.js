// icon-color: crimson; icon-glyph: quote-left;

// const param = args.widgetParameter ? args.widgetParameter.trim().toLowerCase() : `${defaultCategory}`;
const param = args.widgetParameter ? args.widgetParameter.trim().toLowerCase() : defaultCategory;
// const param = args.widgetParameter ? args.widgetParameter.trim().toLowerCase() : "540";
const parts = param.split(",");
let category = defaultCategory;
let sizeParam = defaultSize;
let forcedIndex = null;

for (const p of parts) {
  const trimmed = p.trim();
  if (validCategories.includes(trimmed)) {
    category = trimmed;
  } else if (validSizes.includes(trimmed)) {
    sizeParam = trimmed;
  } else if (!isNaN(parseInt(trimmed))) {
    forcedIndex = parseInt(trimmed);
  }
}

// Determine widget size fallback
let widgetSize;
if (validSizes.includes(sizeParam)) {
  widgetSize = sizeParam;
} else if (config.widgetFamily === "medium") {
  widgetSize = "m";
} else if (config.widgetFamily === "large") {
  widgetSize = "l";
} else {
  widgetSize = "s";
}

// If category is invalid, just refresh and exit
if (!validCategories.includes(category)) {
  console.warn("⚠️ Invalid category. Refreshing...");
  Script.complete();
  return;
}

// === End: Param Handling ===
const fm = FileManager.iCloud();
const NOTION_API_TOKEN = "YOUR_NOTION_INTEGRATION_TOKEN"; // <-- Replace with your Notion integration token
const NOTION_DATABASE_ID = "YOUR_NOTION_DATABASE_ID";     // <-- Replace with your Notion database ID
const COLOR_PAIRS_PATH = fm.joinPath(fm.documentsDirectory(), ".source/dark_theme_color_pairs.json");

// Refresh interval config: "hourly" or "daily"
const REFRESH_INTERVAL = "hourly"; // Change to "daily" for quote of the day

// === Utilities ===
function getColor(hex) {
  if (!hex || typeof hex !== "string" || !hex.startsWith("#")) return null;
  try {
    return new Color(hex);
  } catch (_) {
    return null;
  }
}

function getColorPairFromJSON() {
  try {
    if (!fm.fileExists(COLOR_PAIRS_PATH)) return null;
    const raw = fm.readString(COLOR_PAIRS_PATH);
    const pairs = JSON.parse(raw);
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    return {
      backgroundColor: getColor(pair.background) || new Color("#000000"),
      fontColor: getColor(pair.font) || Color.white()
    };
  } catch (_) {
    return {
      backgroundColor: new Color("#000000"),
      fontColor: Color.white()
    };
  }
}

// If color pairs file does not exist, download it automatically
if (!fm.fileExists(COLOR_PAIRS_PATH)) {
  try {
    const url = "https://drive.google.com/uc?export=download&id=1rFBSz8bgHbRGbQoQXaZ7a_he9TUxEMU4";
    const req = new Request(url);
    const data = await req.loadString();
    // Ensure .source directory exists
    const sourceDir = fm.joinPath(fm.documentsDirectory(), ".source");
    if (!fm.fileExists(sourceDir)) fm.createDirectory(sourceDir);
    fm.writeString(COLOR_PAIRS_PATH, data);
    console.log("Downloaded color pairs file from Google Drive.");
  } catch (err) {
    console.error("Failed to download color pairs file:", err);
  }
}



// === Notion Property Map and Robust Fetch ===
const NOTION_PROPERTY_MAP = {
  quote: "Quote",
  author: "Author",
  category: "Category"
};

function getNotionProp(page, key) {
  // Always use the Notion page's title property for the quote, regardless of property name
  if (key === "quote") {
    // Find the first property of type 'title' in the page's properties
    for (const k in page.properties) {
      const prop = page.properties[k];
      if (prop && prop.type === "title" && Array.isArray(prop.title) && prop.title.length > 0) {
        return prop.title.map(t => t.plain_text).join("");
      }
    }
    return "";
  }
  const notionKey = NOTION_PROPERTY_MAP[key];
  const prop = page.properties[notionKey];
  if (!prop) return "";
  if (prop.type === "title" && Array.isArray(prop.title)) {
    return prop.title.map(t => t.plain_text).join("");
  }
  if (prop.type === "rich_text" && Array.isArray(prop.rich_text)) {
    return prop.rich_text.map(t => t.plain_text).join("");
  }
  if (prop.type === "select" && prop.select && prop.select.name) {
    return prop.select.name;
  }
  if (prop.type === "multi_select" && Array.isArray(prop.multi_select)) {
    return prop.multi_select.map(s => s.name).join(", ");
  }
  if (prop.type === "date" && prop.date && prop.date.start) {
    return prop.date.start;
  }
  return "";
}

function mapNotionPageToQuote(page) {
  return {
    quote: getNotionProp(page, "quote").trim(),
    author: getNotionProp(page, "author").trim(),
    category: getNotionProp(page, "category").trim()
  };
}


// Helper: Get data_source_id from database_id
async function getDataSourceId(databaseId, notionToken) {
  const url = `https://api.notion.com/v1/databases/${databaseId}`;
  const req = new Request(url);
  req.method = "GET";
  req.headers = {
    "Authorization": `Bearer ${notionToken}`,
    "Notion-Version": "2025-09-03"
  };
  const res = await req.loadJSON();
  return res.data_sources && res.data_sources.length ? res.data_sources[0].id : null;
}

// Fetch quotes from Notion data source (API v2025-09-03)
async function fetchQuotesFromNotion({ author, category }) {
  const dataSourceId = await getDataSourceId(NOTION_DATABASE_ID, NOTION_API_TOKEN);
  if (!dataSourceId) {
    console.error("No data_source_id found for database!");
    return [];
  }
  const url = `https://api.notion.com/v1/data_sources/${dataSourceId}/query`;
  const headers = {
    "Authorization": `Bearer ${NOTION_API_TOKEN}`,
    "Notion-Version": "2025-09-03",
    "Content-Type": "application/json"
  };
  const filters = [];
  if (author) filters.push({ property: NOTION_PROPERTY_MAP.author, select: { equals: author } });
  if (category && String(category).trim().length > 0) {
    filters.push({ property: NOTION_PROPERTY_MAP.category, select: { equals: category } });
  }
  const body = filters.length ? { filter: { and: filters } } : {};
  console.log("[Notion Query Body]", JSON.stringify(body));
  const req = new Request(url);
  req.method = "POST";
  req.headers = headers;
  req.body = JSON.stringify(body);
  try {
    const response = await req.loadJSON();
    console.log("[Notion raw response]", JSON.stringify(response, null, 2));
    if (!response.results) return [];
    const mapped = response.results.map(mapNotionPageToQuote);
    console.log("[Mapped Quotes]", JSON.stringify(mapped, null, 2));
    return mapped.filter(q => q.quote && q.author);
  } catch (err) {
    console.error("🔥 Error fetching from Notion:", err);
    return [];
  }
}

// Main quote fetcher (Notion)
async function getQuoteFromNotion({ forcedIndex = null, author = null, category = null }) {
  let allQuotes = await fetchQuotesFromNotion({ author, category });
  if (!allQuotes.length) {
    // Try again with no filters for debugging
    allQuotes = await fetchQuotesFromNotion({});
    if (!allQuotes.length) {
      return { quote: "No quotes found in Notion.", author: "" };
    }
    return { quote: "No quotes found for filter. Showing first available.", author: allQuotes[0].author };
  }
  let usable = allQuotes.filter(q => !isQuoteTooLong(q.quote, q.author, widgetSize));
  if (!usable.length) usable = allQuotes; // fallback to all if none fit
  let row;
  if (forcedIndex !== null && forcedIndex >= 0 && forcedIndex < allQuotes.length) {
    row = allQuotes[forcedIndex];
  } else {
    // Use daily/hourly index for repeatable randomness
    const idx = getRepeatableIndex(usable.length, widgetSize);
    row = usable[idx];
  }
  return {
    quote: row.quote,
    author: row.author
  };
}

// Utility to get repeatable index based on current day or hour
function getRepeatableIndex(length, sizeKey) {
  const now = new Date();
  let seed;
  if (REFRESH_INTERVAL === "hourly") {
    seed = now.getFullYear() * 1000000 + (now.getMonth() + 1) * 10000 + now.getDate() * 100 + now.getHours();
  } else {
    seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  }
  const sizeOffset = { s: 1, m: 2, l: 3 };
  return (seed + sizeOffset[sizeKey]) % length;
}



// Utility to get repeatable index based on current day
function getDailyIndex(length, sizeKey) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const sizeOffset = { s: 1, m: 2, l: 3 };
  return (seed + sizeOffset[sizeKey]) % length;
  //   return 1; // for testing
}

const sfs = 12;
const mfs = 14;
const lfs = 16;

function isQuoteTooLong(quote, author, sizeKey) {
  const totalText = `“${quote}”— ${author}`;
  const length = totalText.length;

  if (sizeKey === "s") {
    return length < 1 || length > 140;
  }

  if (sizeKey === "m") {
    return length <= 140 || length > 260;
  }

  if (sizeKey === "l") {
    return length <= 260; // anything above 260 is fine!
  }

  return false; // fallback safety
}


// === Font Loader ===
function loadCustomFont(fileName, size) {
  const fontPath = fm.joinPath(fm.documentsDirectory(), `.fonts/${fileName}`);
  if (fm.fileExists(fontPath)) {
    return new Font(fileName, size);
  } else {
    console.warn(`⚠️ Font not found: ${fileName}`);
    return Font.systemFont(size);
  }
}

// === Widget ===
async function createWidget() {
  const widget = new ListWidget();

  // Parse author filter from param (e.g. "author:Seneca")
  let authorFilter = null;
  for (const p of parts) {
    if (p.startsWith("author:")) authorFilter = p.replace("author:", "").trim();
  }

  // Fetch quote from Notion
  const quoteData = await getQuoteFromNotion({ forcedIndex, author: authorFilter, category });
  const fallback = getColorPairFromJSON();
  widget.backgroundColor = fallback.backgroundColor;
  const fontColor = fallback.fontColor;
  const fontSize = widgetSize === "s" ? sfs : widgetSize === "l" ? lfs : mfs;
  const quoteFont = Font.boldSystemFont(fontSize);
  const authorFont = Font.italicSystemFont(fontSize - 1);

  if (category === "cookiejar") {
    widget.addSpacer(0);
    const label = widget.addText("~ From Your Cookie Jar ~");
    label.font = Font.mediumSystemFont(8);
    label.textColor = fontColor;
    label.centerAlignText();
    widget.addSpacer();
  }

  const stack = widget.addStack();
  stack.layoutVertically();
  stack.addSpacer();
  const textStack = stack.addStack();
  textStack.layoutHorizontally();
  const quoteText = textStack.addText(`“${quoteData.quote}”`);
  quoteText.font = quoteFont;
  quoteText.textColor = fontColor;
  quoteText.leftAlignText();
  stack.addSpacer();
  if (quoteData.author) {
    const textStack = stack.addStack();
    textStack.layoutHorizontally();
    textStack.addSpacer();
    const authorText = textStack.addText(`— ${quoteData.author}`);
    authorText.font = authorFont;
    authorText.textColor = fontColor;
    authorText.rightAlignText();
  }

  // Set refresh interval
  if (REFRESH_INTERVAL === "hourly") {
    widget.refreshAfterDate = new Date(Date.now() + 3600000); // 1 hour
  } else {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    widget.refreshAfterDate = tomorrow;
  }

//   console.log("➡️ Param parts:", parts);
//   console.log("📂 Category:", category);
//   console.log("📏 Size:", sizeParam);
//   console.log("🔢 Forced index:", forcedIndex);
//   if (authorFilter) console.log("👤 Author filter:", authorFilter);
  return widget;
}


// === Debug: Fetch Notion API response and save to file ===
async function fetchAndSaveNotionRaw() {
  const url = `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`;
  const headers = {
    "Authorization": `Bearer ${NOTION_API_TOKEN}`,
    "Notion-Version": "2025-09-03",
    "Content-Type": "application/json"
  };
  const req = new Request(url);
  req.method = "POST";
  req.headers = headers;
  req.body = JSON.stringify({});
  try {
    const response = await req.loadString();
    const filePath = fm.joinPath(fm.documentsDirectory(), "notion_raw_response.json");
    fm.writeString(filePath, response);
    console.log("[Notion raw response saved to]", filePath);
  } catch (err) {
    console.error("🔥 Error fetching or saving Notion response:", err);
  }
}

// To debug, uncomment the next two lines and comment out the widget logic below:
// await fetchAndSaveNotionRaw();
// Script.complete();

// === Run Widget ===
const widget = await createWidget();
if (!config.runsInWidget) await widget.presentSmall();
// if (!config.runsInWidget) await widget.presentMedium();
// if (!config.runsInWidget) await widget.presentLarge();
else Script.setWidget(widget);
Script.complete();

// For users who want a sample Google Sheet for quotes, download here:
// https://drive.google.com/file/d/1rFBSz8bgHbRGbQoQXaZ7a_he9TUxEMU4/view?usp=sharing

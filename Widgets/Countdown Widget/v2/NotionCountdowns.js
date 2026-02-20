// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: clock;

// === WIDGET PARAM QUICK GUIDE ===
// Comma-separated, case-insensitive. Examples below.
//
// Modes:
// - since | mode=since | mode since
// - countdown | mode=countdown
//
// Lock Screen display override (for accessory widgets):
// - .topbar | .circular | .rect | .rectangular
//
// Since-unit override (for since mode):
// - .days | .weeks | .months | .years | .hours | .minutes
//   (also: wk/wks, mo, yr/yrs, hr/hrs, min/mins)
//
// Event selection:
// - number = 1-based index (e.g., 3 selects 3rd event)
// - text = name/alias match (case-insensitive)
//
// Other:
// - age = age display (small widget)
// - pg1/pg2/... = page for grid view
// - col = grid view (medium/large)
//
// Examples:
// - since,work anniversary
// - mode=since.circular.gym
// - since.weeks.habit
// - countdown,3
// - col,pg2
// - mode=since.rectangular.birthday
//
// Lock Screen examples (accessory widgets):
// - since.{wks/yrs/hrs/min/mo}.{circular/topbar/rect}.event_name 
// - topbar,5            (inline/top bar, 5th event)
// - since.rect.streak   (rectangular lock screen since + name match)

// === CONFIG ===

// === FILEMANAGER INIT (needed globally) ===
const fm = FileManager.iCloud();

// === NOTION CONFIG ===
const NOTION_TOKEN = "YOUR_NOTION_INTEGRATION_TOKEN"; // <-- Replace with your Notion integration token
const NOTION_DATABASE_ID = "YOUR_NOTION_DATABASE_ID";   // <-- Replace with your Notion database ID
const NOTION_PROPERTY_MAP = {
    name: "Title",
    date: "Event Date",
    eventType: "Event Type",
    icon: "Widget Emoji",
    color: "Widget Clr",
    widgetTextColor: "Widget TxtClr",
    aliases: "Aliases"
};


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

// Fetch events from Notion data source (API v2025-09-03)
async function fetchNotionEvents() {
    const dataSourceId = await getDataSourceId(NOTION_DATABASE_ID, NOTION_TOKEN);
    if (!dataSourceId) {
        console.error("No data_source_id found for database!");
        return [];
    }
    const url = `https://api.notion.com/v1/data_sources/${dataSourceId}/query`;
    const req = new Request(url);
    req.method = "POST";
    req.headers = {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2025-09-03",
        "Content-Type": "application/json"
    };
    req.body = JSON.stringify({});
    const res = await req.loadJSON();
    if (!res.results) return [];
    return res.results.map(page => mapNotionPageToEvent(page));
}

// Map a Notion page to the event row format
function mapNotionPageToEvent(page) {
    const props = page.properties || {};
    function getProp(key) {
        const notionKey = NOTION_PROPERTY_MAP[key];
        return props[notionKey];
    }
        // Title: always use the Notion page's title property (type: title, which is the page name)
        let name = "";
        // Find the first property of type 'title' in the page's properties
        let foundTitle = null;
        for (const key in page.properties) {
            const prop = page.properties[key];
            if (prop && prop.type === "title" && Array.isArray(prop.title) && prop.title.length > 0) {
                foundTitle = prop.title.map(t => t.plain_text).join("");
                break;
            }
        }
        if (foundTitle && foundTitle.trim().length > 0) {
            name = foundTitle;
        } else {
            // fallback to mapped property if present
            const titleProp = getProp("name");
            if (titleProp && titleProp.title && titleProp.title.length > 0) {
                name = titleProp.title.map(t => t.plain_text).join("");
            } else if (titleProp && titleProp.rich_text && titleProp.rich_text.length > 0) {
                name = titleProp.rich_text.map(t => t.plain_text).join("");
            }
        }
        // Fallback: use Notion page id if name is still empty
        if (!name || name.trim().length === 0) {
                name = page.id ? `Untitled (${page.id.slice(-6)})` : "Untitled";
        }
    // Date
    let date = "";
    const dateProp = getProp("date");
    if (dateProp && dateProp.date && dateProp.date.start) {
        date = dateProp.date.start;
    }
    // Icon
    let icon = "";
    const iconProp = getProp("icon");
    if (iconProp && iconProp.rich_text && iconProp.rich_text.length > 0) {
        icon = iconProp.rich_text.map(t => t.plain_text).join("");
    } else if (iconProp && iconProp.select && iconProp.select.name) {
        icon = iconProp.select.name;
    }
    // Color (support select, formula, or rich_text)
    let color = "";
    const colorProp = getProp("color");
    if (colorProp && colorProp.rich_text && colorProp.rich_text.length > 0) {
        color = colorProp.rich_text.map(t => t.plain_text).join("");
    } else if (colorProp && colorProp.select && colorProp.select.name) {
        color = colorProp.select.name;
    } else if (colorProp && colorProp.formula && colorProp.formula.string) {
        color = colorProp.formula.string;
    }
    // Widget Text Color (support select, formula, or rich_text)
    let widgetTextColor = "";
    const widgetTextColorProp = getProp("widgetTextColor");
    if (widgetTextColorProp && widgetTextColorProp.rich_text && widgetTextColorProp.rich_text.length > 0) {
        widgetTextColor = widgetTextColorProp.rich_text.map(t => t.plain_text).join("");
    } else if (widgetTextColorProp && widgetTextColorProp.select && widgetTextColorProp.select.name) {
        widgetTextColor = widgetTextColorProp.select.name;
    } else if (widgetTextColorProp && widgetTextColorProp.formula && widgetTextColorProp.formula.string) {
        widgetTextColor = widgetTextColorProp.formula.string;
    }
    // Aliases
    let aliases = "";
    const aliasesProp = getProp("aliases");
    if (aliasesProp && aliasesProp.rich_text && aliasesProp.rich_text.length > 0) {
        aliases = aliasesProp.rich_text.map(t => t.plain_text).join("");
    }
    // Event Type
    let eventType = "";
    const eventTypeProp = getProp("eventType");
    if (eventTypeProp && eventTypeProp.select && eventTypeProp.select.name) {
        eventType = eventTypeProp.select.name;
    }
    // Mode (derived from eventType or explicit property)
    let mode = null;
    if (eventType && eventType.toLowerCase().includes("since")) mode = "since";
    if (eventType && eventType.toLowerCase().includes("countdown")) mode = "countdown";
    // Compose normalized event row
    return {
        name,
        date,
        icon,
        color,
        widgetTextColor,
        aliases,
        eventType,
        mode
    };
}

const colorPalette = ["#CB2443", "#8e44ad", "#2980b9", "#F79F39", "#CEA834", "#7b9a50"];

const HARDCODED_FORCE_REFRESH = true;
// Notification/testing settings
// Hour (0-23) to schedule real notifications (week/day before). Default 9 AM local.
const HARDCODED_NOTIFY_HOUR = 9;
// TEST mode: set to true only for manual testing. Keep false for normal operation.
const HARDCODED_TEST_MODE = false;
// Prefer pulling data from the Apps Script web app (matches the URL you verified).
const USE_APPS_SCRIPT_WEBAPP = true;
// Set false to ignore args.widgetParameter and always use the hard-coded sheet.
const ALLOW_WIDGET_PARAM_OVERRIDES = false;


function renderTemplate(template, row) {
    if (!template) return '';
    const mapping = {
        icon: row.icon || '',
        name: row.name || '',
        date: row.date || '',
        formattedDate: (row.date ? formatDate(row.date) : ''),
        // suffix uses the same mapping as titles in the widget (falls back to empty)
        suffix: (typeof titleSuffixes !== 'undefined' && titleSuffixes[row.icon]) ? titleSuffixes[row.icon] : ''
    };
    return String(template).replace(/\{(\w+)\}/g, (_, key) => mapping.hasOwnProperty(key) ? mapping[key] : '');
}

function buildUrlWithParams(base, params = {}) {
    const query = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    if (!query) return base;
    return base + (base.includes('?') ? '&' : '?') + query;
}

function normalizeModeValue(raw) {
    if (!raw && raw !== 0) return null;
    const v = String(raw).trim().toLowerCase();
    if (!v) return null;
    if (v.includes("since") || v.includes("ended") || v.includes("past")) return "since";
    if (v.includes("count") || v.includes("upcoming")) return "countdown";
    return null;
}

function normalizeActiveValue(raw) {
    if (raw === undefined || raw === null) return null;
    if (typeof raw === "boolean") return raw;
    const v = String(raw).trim().toLowerCase();
    if (v === "true" || v === "yes" || v === "1" || v === "active") return true;
    if (v === "false" || v === "no" || v === "0" || v === "inactive") return false;
    return null;
}

function normalizeEventRow(row) {
    if (!row || typeof row !== 'object') return null;

    const pick = (...keys) => {
        for (const key of keys) {
            if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
                return row[key];
            }
        }
        return null;
    };

    const name = pick('name', 'Name', 'Event Name');
    const date = pick('date', 'Date', 'Event Date');
    if (!name || !date) return null;

    const icon = pick('icon', 'Icon', 'Widget Emoji', 'Emoji') || '📅';
    const colorRaw = pick('color', 'Color', 'Widget Clr', 'Widget Color');
    const eventType = pick('event type', 'Event Type', 'Type');
    const modeRaw = pick('mode', 'Mode', 'Countdown Mode', 'Event Mode', 'Since Mode');
    const activeRaw = pick('active?', 'Active?', 'Active', 'active');
    const aliasesRaw = pick('aliases', 'Aliases', 'Alias');
    const textColorRaw = pick('widget txtclr', 'Widget TxtClr', 'Widget Text Color', 'Text Color', 'TxtClr');
    const normalizedMode = normalizeModeValue(modeRaw || eventType);
    const normalizedActive = normalizeActiveValue(activeRaw);
    const color = colorRaw ? String(colorRaw).trim() : null;

    const normalized = {
        name: String(name).trim(),
        date: String(date).trim(),
        icon: String(icon).trim() || '📅',
        color: color && color.length ? color : null
    };

    if (eventType) normalized.eventType = String(eventType).trim();
    if (normalizedMode) normalized.mode = normalizedMode;
    if (normalizedActive !== null) normalized.active = normalizedActive;
    if (aliasesRaw) normalized.aliases = String(aliasesRaw).trim();
    if (textColorRaw) normalized.widgetTextColor = String(textColorRaw).trim();

    const passthroughKeys = ['notes', 'Notes', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (const key of passthroughKeys) {
        if (row[key] !== undefined) {
            const targetKey = key.length === 1 ? key : key.toLowerCase();
            normalized[targetKey] = row[key];
        }
    }

    return normalized;
}


// === Notion-Only Data Source ===
const events = await fetchNotionEvents();
// Debug: log event data to help diagnose missing title
if (config && config.runsInApp) {
    console.log("Loaded events:", JSON.stringify(events, null, 2));
}

// const events = await req.loadJSON();

const titleSuffixes = {
    "🎂": "'s Birthday",
    "🥂": "'s Anniversary",
    "🗓": "", // relationships
    "🔱": "",
    "✈️": "",
    "default": ""
};

const ageSuffixMap = {
    "🎂": ["turning ", ""],
    "🥂": ["", " yrs together"],
    "🔱": ["", " yrs observed"],
    "🗓": ["", " yrs together"],
    "default": [" ", " "]
};

const todaySuffixes = {
    "🎂": ["You are ", " 🥳"],
    "🥂": ["", " together 🥳"],
    "🗓": ["", " together 🥳"],
    "🔱": ["", " observed"],
    "default": ["", ""]
};


// === Load local files ===
// const fm = FileManager.iCloud();

// === Google Drive assets manifest (OPTIONAL) ===
// Provide direct-download URLs for files you upload to Google Drive. If you leave
// these empty, the script will try to use any locally-cached files in iCloud.
// Replace the example URLs with your own direct-download links (see instructions below).
const DRIVE_ASSETS = {
    "Roboto-Regular.ttf": "https://drive.google.com/uc?export=download&id=1yTBh2E9U1zaT1I3hARU8Fsje8NyvVfZT",
    // Updated public links provided by user:
    "repeat_icon.png": "https://drive.google.com/uc?export=download&id=13CmUtpS7uTsswn9DsVQ7v_zR42b8yg3C",
    "since_icon.png": "https://drive.google.com/uc?export=download&id=1RsHDs-bz7OFKzJE4FdrtGMScArxeaTE8",
    "since_icon_home.png": "https://drive.google.com/uc?export=download&id=178DbyFt0LyX4x1Abf2bn3EbrhO6INjue",
};
// Helper: ensure a file exists locally by downloading from Drive manifest if provided.
async function ensureLocalFile(subdir, fileName) {
    const dir = fm.joinPath(fm.documentsDirectory(), subdir);
    if (!fm.fileExists(dir)) fm.createDirectory(dir);
    const path = fm.joinPath(dir, fileName);

    if (fm.fileExists(path)) {
        return path;
    }

    const driveUrl = DRIVE_ASSETS[fileName];
    if (!driveUrl) {
        // No remote URL provided and file not in iCloud — caller should handle fallback.
        return null;
    }

    try {
        const req = new Request(driveUrl);
        // Try to load raw data and write to file (works for images/fonts/binaries)
        const data = await req.load();
        fm.write(path, data);
        return path;
    } catch (e) {
        // Download failed — return null so caller can fallback.
        return null;
    }
}

// === Load Custom Roboto Font (from Drive or iCloud fallback) ===
const fontFileName = "Roboto-Regular.ttf";
const localFontPath = await ensureLocalFile(".fonts", fontFileName) || fm.joinPath(fm.joinPath(fm.documentsDirectory(), ".fonts"), fontFileName);
// If we still don't have the font file locally, don't block — fallback to system fonts.
let roboto = null;
if (fm.fileExists(localFontPath)) {
    try {
        await fm.downloadFileFromiCloud(localFontPath);
    } catch (e) {
        // ignore download errors
    }
    roboto = (size) => new Font(localFontPath, size);
} else {
    // Fallback factory using system font
    roboto = (size) => Font.systemFont(size);
}

// === Load Repeat Icon (from Drive or iCloud fallback) ===
const repeatFileName = "repeat_icon.png";
const localRepeatPath = await ensureLocalFile(".source", repeatFileName) || fm.joinPath(fm.joinPath(fm.documentsDirectory(), ".source"), repeatFileName);
let repeatIcon = null;
if (fm.fileExists(localRepeatPath)) {
    try {
        await fm.downloadFileFromiCloud(localRepeatPath);
    } catch (e) {
        // ignore
    }
    try {
        repeatIcon = fm.readImage(localRepeatPath);
    } catch (e) {
        repeatIcon = null;
    }
} else {
    repeatIcon = null; // gracefully handle missing icon later
}

// === Load Lock Screen Repeat Icon (from iCloud .source) ===
const repeatLockscreenFileName = "repeat_lockscreen.png";
const localRepeatLockscreenPath = await ensureLocalFile(".source", repeatLockscreenFileName) || fm.joinPath(fm.joinPath(fm.documentsDirectory(), ".source"), repeatLockscreenFileName);
let repeatLockscreenIcon = null;
// repeatLockscreenIcon = fm.readImage(localRepeatLockscreenPath);

if (fm.fileExists(localRepeatLockscreenPath)) {
    try {
        await fm.downloadFileFromiCloud(localRepeatLockscreenPath);
    } catch (e) {
        // ignore
    }
    try {
        repeatLockscreenIcon = fm.readImage(localRepeatLockscreenPath);
    } catch (e) {
        repeatLockscreenIcon = null;
    }
}

// === Load Since Icon (from Drive or iCloud fallback) ===
const sinceFileName = "since_icon.png";
// const sinceFileName = "since_icon_48.png";
const localSincePath = await ensureLocalFile(".source", sinceFileName) || fm.joinPath(fm.joinPath(fm.documentsDirectory(), ".source"), sinceFileName);
let sinceIcon = null;

sinceIcon = fm.readImage(localSincePath);
// if (fm.fileExists(localSincePath)) {
//   try {
//     await fm.downloadFileFromiCloud(localSincePath);
//   } catch (e) {
//     // ignore
//   }
//   try {
//     sinceIcon = fm.readImage(localSincePath);
//   } catch (e) {
//     sinceIcon = null;
//   }
// } else {
//   sinceIcon = null; // gracefully handle missing icon later
// }
// if (!sinceIcon && DRIVE_ASSETS[sinceFileName]) {
//   try {
//     const req = new Request(DRIVE_ASSETS[sinceFileName]);
//     sinceIcon = await req.loadImage();
//   } catch (e) {
//     // ignore
//   }
// }

// === Load Home Screen Since Icon (from Drive or iCloud fallback) ===
const sinceHomeFileName = "since_icon_home.png";
const localSinceHomePath = await ensureLocalFile(".source", sinceHomeFileName) || fm.joinPath(fm.joinPath(fm.documentsDirectory(), ".source"), sinceHomeFileName);
let sinceHomeIcon = null;
if (fm.fileExists(localSinceHomePath)) {
    try {
        await fm.downloadFileFromiCloud(localSinceHomePath);
    } catch (e) {
        // ignore
    }
    try {
        sinceHomeIcon = fm.readImage(localSinceHomePath);
    } catch (e) {
        sinceHomeIcon = null;
    }
}

function getSinceHomeIconImage() {
    if (sinceHomeIcon) return sinceHomeIcon;
    if (sinceIcon) return sinceIcon;
    try {
        return SFSymbol.named("calendar").image;
    } catch (e) {
        return null;
    }
}

function normalizeHexColorLocal(value) {
    if (!value && value !== 0) return null;
    let s = String(value).trim();
    if (!s) return null;
    if (!s.startsWith("#") && /^[0-9a-fA-F]{6}$/.test(s)) s = `#${s}`;
    return s;
}

function lightenHexColor(hex, amount) {
    const normalized = normalizeHexColorLocal(hex);
    if (!normalized) return null;
    const r = parseInt(normalized.slice(1, 3), 16);
    const g = parseInt(normalized.slice(3, 5), 16);
    const b = parseInt(normalized.slice(5, 7), 16);
    const nr = Math.round(r + (255 - r) * amount);
    const ng = Math.round(g + (255 - g) * amount);
    const nb = Math.round(b + (255 - b) * amount);
    return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

function buildCircularBgImage(valueText, unitText, bgColor, textColor, size) {
    const width = size;
    const height = size;
    const context = new DrawContext();
    context.size = new Size(width, height);
    context.respectScreenScale = true;
    context.opaque = false;

    const rect = new Rect(0, 0, width, height);
    context.setFillColor(bgColor);
    context.fillEllipse(rect);

    context.setTextColor(textColor);
    context.setTextAlignedCenter();

    const measureTextWidth = (text) => {
        if (typeof context.measureText === "function") return context.measureText(text).width;
        if (typeof context.getTextSize === "function") return context.getTextSize(text).width;
        return text.length * 0.55;
    };
    const fitFontSize = (text, maxWidth, maxFont, minFont, fontBuilder) => {
        let size = maxFont;
        const safeText = String(text);
        while (size > minFont) {
            context.setFont(fontBuilder(size));
            const measured = measureTextWidth(safeText);
            if (measured <= maxWidth) break;
            size -= 1;
        }
        return size;
    };

    const rawValueLines = String(valueText).split("\n");
    const valueLines = rawValueLines.length > 2
        ? [rawValueLines[0], rawValueLines.slice(1).join(" ")]
        : rawValueLines;
    const hasUnit = String(unitText).trim().length > 0;
    const maxTextWidth = Math.round(width * 0.9);
    const baseValueFont = Math.max(12, Math.round(size * (valueLines.length > 1 ? 0.28 : 0.32)));
    const baseUnitFont = Math.max(8, Math.round(size * 0.16));
    const lineGap = Math.max(2, Math.round(size * 0.03));

    const valueFonts = valueLines.map((line, index) => {
        const target = Math.round(baseValueFont * (index === 0 ? 1 : 0.75));
        return fitFontSize(line, maxTextWidth, target, 9, Font.semiboldSystemFont);
    });
    const unitFont = hasUnit ? fitFontSize(unitText, maxTextWidth, baseUnitFont, 7, Font.systemFont) : 0;

    const valueBlockHeight = valueFonts.reduce((sum, font) => sum + font, 0) + Math.max(0, valueLines.length - 1) * lineGap;
    const unitBlockHeight = hasUnit ? unitFont : 0;
    const totalTextHeight = hasUnit ? valueBlockHeight + lineGap + unitBlockHeight : valueBlockHeight;
    let currentTop = Math.round((size - totalTextHeight) / 2);

    valueLines.forEach((line, index) => {
        const fontSize = valueFonts[index];
        context.setFont(Font.semiboldSystemFont(fontSize));
        context.drawTextInRect(String(line), new Rect(0, currentTop, width, Math.round(fontSize * 1.2)));
        currentTop += fontSize + lineGap;
    });

    if (hasUnit) {
        context.setFont(Font.systemFont(unitFont));
        context.drawTextInRect(String(unitText), new Rect(0, currentTop, width, Math.round(unitFont * 1.2)));
    }

    return context.getImage();
}

function buildRectBgImage(titleText, valueText, unitText, bgColor, textColor, size) {
    const width = size.width;
    const height = size.height;
    const context = new DrawContext();
    context.size = new Size(width, height);
    context.respectScreenScale = true;
    context.opaque = false;

    const rect = new Rect(0, 0, width, height);
    context.setFillColor(bgColor);
    const rounded = new Path();
    rounded.addRoundedRect(rect, 12, 12);
    context.addPath(rounded);
    context.fillPath();

    context.setTextColor(textColor);
    context.setTextAlignedLeft();

    const measureTextWidth = (text) => {
        if (typeof context.measureText === "function") return context.measureText(text).width;
        if (typeof context.getTextSize === "function") return context.getTextSize(text).width;
        return String(text).length * 0.55;
    };
    const fitFontSize = (text, maxWidth, maxFont, minFont, fontBuilder) => {
        let size = maxFont;
        const safeText = String(text);
        while (size > minFont) {
            context.setFont(fontBuilder(size));
            const measured = measureTextWidth(safeText);
            if (measured <= maxWidth) break;
            size -= 1;
        }
        return size;
    };

    const horizontalPadding = Math.max(8, Math.round(width * 0.08));
    const maxTextWidth = Math.max(20, width - horizontalPadding * 2);
    const baseTitleFont = Math.max(11, Math.round(height * 0.26));
    const baseValueFont = Math.max(10, Math.round(height * 0.22));
    const titleFont = fitFontSize(titleText, maxTextWidth, baseTitleFont, 9, Font.semiboldSystemFont);
    const valueFont = fitFontSize(`${valueText} ${unitText}`.trim(), maxTextWidth, baseValueFont, 8, Font.systemFont);
    const lineGap = Math.max(2, Math.round(height * 0.05));
    const totalTextHeight = titleFont + valueFont + lineGap;
    const titleTop = Math.round((height - totalTextHeight) / 2);
    const valueTop = titleTop + titleFont + lineGap;

    context.setFont(Font.semiboldSystemFont(titleFont));
    context.drawTextInRect(String(titleText), new Rect(horizontalPadding, titleTop, width - horizontalPadding * 2, Math.round(height * 0.34)));

    context.setFont(Font.systemFont(valueFont));
    context.drawTextInRect(`${valueText} ${unitText}`, new Rect(horizontalPadding, valueTop, width - horizontalPadding * 2, Math.round(height * 0.3)));

    return context.getImage();
}

// === Load Circular Background Image (from iCloud .source) ===
const circularBgFileName = "small-seasons-background.png";
const localCircularBgPath = await ensureLocalFile(".source", circularBgFileName) || fm.joinPath(fm.joinPath(fm.documentsDirectory(), ".source"), circularBgFileName);
let circularBgImage = null;
if (fm.fileExists(localCircularBgPath)) {
    try {
        await fm.downloadFileFromiCloud(localCircularBgPath);
    } catch (e) {
        // ignore
    }
    try {
        circularBgImage = fm.readImage(localCircularBgPath);
    } catch (e) {
        circularBgImage = null;
    }
}

function getCircularBgImage() {
    return circularBgImage;
}

// function getSinceIconImage() {
//   if (sinceIcon) return sinceIcon;
//   try {
//     return SFSymbol.named("calendar").image;
//   } catch (e) {
//     return null;
//   }
// }

// === Parameter Handling for Small Widget ===
const param = args.widgetParameter ? args.widgetParameter.trim().toLowerCase() : null;
// Find the most recent upcoming event (soonest event)
let selectedEvent = events.reduce((closest, event) => {
    const daysToEvent = daysUntil(event.date);
    const daysToClosest = daysUntil(closest.date);
    return daysToEvent < daysToClosest ? event : closest;
}, events[0]);
let showAgeMode = false; // default off
let page = 1; // default page
let sinceMode = false;
let selectionSpecified = false;
let sinceUnitOverride = null;
let lockDisplayType = null;
let modeExplicit = false;

function isSinceEvent(event) {
    // Ensure both 'since' and 'ended' events are included in since mode
    if (!event) return false;
    // Check both possible fields for robustness
    const type = event.eventType || event.type || "";
    return event.mode === "since" || type.toLowerCase() === "ended";
}

function daysSince(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = parseLocalDate(dateStr);
    if (!eventDate || isNaN(eventDate.getTime())) return -99999;
    eventDate.setHours(0, 0, 0, 0);
    return Math.round((today - eventDate) / (1000 * 60 * 60 * 24));
}

function formatDurationFromDays(days) {
    const absDays = Math.abs(days);
    if (absDays >= 1000) {
        let months = absDays / 30.44;
        let unit = "month";
        let value = months;
        if (months >= 12) {
            value = months / 12;
            unit = "year";
        }
        return { valueText: value.toFixed(2), unit };
    }
    return { valueText: String(absDays), unit: "day" };
}

function buildDurationLabel(days, mode) {
    const { valueText, unit } = formatDurationFromDays(days);
    const isSingular = Number(valueText) === 1;
    const unitLabel = isSingular ? unit : `${unit}s`;
    const suffix = mode === "since" ? "since" : "left";
    return { valueText, unitLabel, suffix, isSingular };
}

function buildSinceLabel(days, unitOverride) {
    const absDays = Math.abs(days);
    let unit = unitOverride;
    let value = absDays;

    if (unit) {
        if (unit === "minutes" || unit === "mins" || unit === "min") value = absDays * 24 * 60;
        else if (unit === "hours" || unit === "hrs" || unit === "hr") value = absDays * 24;
        else if (unit === "weeks" || unit === "wk" || unit === "wks") value = absDays / 7;
        else if (unit === "months" || unit === "mo" || unit === "m") value = absDays / 30.44;
        else if (unit === "years" || unit === "yrs" || unit === "yr" || unit === "y") value = absDays / 365.25;
    } else {
        const fallback = formatDurationFromDays(absDays);
        unit = fallback.unit;
        value = Number(fallback.valueText);
    }


    const valueText = unit === "days" ? String(Math.round(value)) : value.toFixed(2);
    const normalizedUnit =
        unit === "mins" || unit === "min" ? "minutes" :
            unit === "hrs" || unit === "hr" ? "hours" :
                unit === "yrs" || unit === "yr" ? "years" :
                    unit === "mo" || unit === "m" ? "months" :
                        unit === "wk" || unit === "wks" ? "weeks" :
                            unit;
    const decimalUnits = ["weeks", "months", "years"];
    let normalizedValueText = valueText;
    if (!decimalUnits.includes(normalizedUnit)) {
        normalizedValueText = String(Math.round(value));
    } else if (normalizedValueText.endsWith(".00")) {
        normalizedValueText = normalizedValueText.slice(0, -3);
    }
    const isSingular = Number(normalizedValueText) === 1;
    const singularUnit = normalizedUnit.replace(/s$/, "");
    const pluralUnit = normalizedUnit.endsWith("s") ? normalizedUnit : `${normalizedUnit}s`;
    const unitLabel = isSingular ? singularUnit : pluralUnit;
    return { valueText: normalizedValueText, unitLabel };
}

function getEventDisplayMode(event) {
    // Force ended events to always use since mode layout
    if (!event) return "countdown";
    const type = event.eventType || event.type || "";
    if (event.mode === "since" || type.toLowerCase() === "ended") return "since";
    return "countdown";
}

function getEventDisplayDays(event) {
    const displayMode = getEventDisplayMode(event);
    return displayMode === "since" ? daysSince(event.date) : daysUntil(event.date);
}

function getEventDisplayName(event, inSinceMode) {
    if (!inSinceMode && event && event.mode === "since" && event.aliases) return event.aliases;
    return event.name;
}

function matchesEventName(event, token) {
    if (!event || !token) return false;
    const t = token.toLowerCase();
    if (event.name && event.name.toLowerCase().includes(t)) return true;
    if (event.aliases && event.aliases.toLowerCase().includes(t)) return true;
    return false;
}

function parseModeAndDisplayToken(token) {
    const t = token.toLowerCase();
    let mode = null;
    let display = null;
    let unit = null;
    let name = null;

    if (t.startsWith("mode since")) mode = "since";
    if (t.startsWith("mode=since")) mode = "since";
    if (t.startsWith("since")) mode = "since";
    if (t.startsWith("mode countdown")) mode = "countdown";
    if (t.startsWith("mode=countdown")) mode = "countdown";
    if (t.startsWith("countdown")) mode = "countdown";

    const parts = t.split(".");
    if (parts.length > 1) {
        const nameParts = [];
        for (const part of parts.slice(1)) {
            if (part === "topbar" || part === "circular" || part === "rect" || part === "rectangular") display = part === "rect" ? "rectangular" : part;
            if (part === "days" || part === "weeks" || part === "wk" || part === "wks" || part === "months" || part === "mo" || part === "years" || part === "yr" || part === "yrs" || part === "hours" || part === "hrs" || part === "hr" || part === "minutes" || part === "min") unit = part;
            if (part !== "topbar" && part !== "circular" && part !== "rect" && part !== "rectangular" && part !== "days" && part !== "weeks" && part !== "wk" && part !== "wks" && part !== "months" && part !== "mo" && part !== "years" && part !== "yr" && part !== "yrs" && part !== "hours" && part !== "hrs" && part !== "hr" && part !== "minutes" && part !== "min") {
                nameParts.push(part);
            }
        }
        if (nameParts.length) name = nameParts.join(" ");
    }

    return { mode, display, unit, name };
}

let currentTextColor = Color.white();

function normalizeHexColor(value) {
    if (!value && value !== 0) return null;
    let s = String(value).trim();
    if (!s) return null;
    if (!s.startsWith("#") && /^[0-9a-fA-F]{6}$/.test(s)) s = `#${s}`;
    return s;
}

function getEventTextColor(event) {
    if (event && event.widgetTextColor) {
        const hex = normalizeHexColor(event.widgetTextColor);
        if (hex) {
            try { return new Color(hex); } catch (e) { /* ignore */ }
        }
    }
    return Color.white();
}

function setCurrentTextColor(color) {
    currentTextColor = color || Color.white();
}

if (param) {
    const parts = param.split(',').map(p => p.trim().toLowerCase());
    sinceMode = parts.some(p => {
        if (p === "since" || p === "mode=since" || p === "mode since") return true;
        if (p.startsWith("mode since.") || p.startsWith("mode=since.") || p.startsWith("since.")) return true;
        const parsed = parseModeAndDisplayToken(p);
        return parsed.mode === "since";
    });

    parts.forEach(p => {
        if (p.startsWith("pg")) {
            // Handle pagination (pg1, pg2, etc.)
            page = parseInt(p.slice(2)) || 1;
            return;
        }
        if (p === "age") {
            // Activate age display mode
            showAgeMode = true;
            return;
        }
        if (p === "since" || p === "mode=since" || p === "mode since") {
            modeExplicit = true;
            return;
        }
        const parsed = parseModeAndDisplayToken(p);
        if (parsed.mode) {
            sinceMode = parsed.mode === "since";
            modeExplicit = true;
            if (parsed.display) lockDisplayType = parsed.display;
            if (parsed.unit) sinceUnitOverride = parsed.unit;
            if (parsed.name) {
                selectionSpecified = true;
                if (sinceMode) {
                    const sinceEvents = events.filter(isSinceEvent).filter(e => daysSince(e.date) >= 0);
                    const match = sinceEvents.find(e => matchesEventName(e, parsed.name));
                    if (match) selectedEvent = match;
                } else {
                    const match = events.find(e => matchesEventName(e, parsed.name));
                    if (match) selectedEvent = match;
                }
            }
            return;
        }
        if (!parsed.mode && parsed.display) {
            lockDisplayType = parsed.display;
            if (parsed.name) {
                selectionSpecified = true;
                const match = events.find(e => matchesEventName(e, parsed.name));
                if (match) selectedEvent = match;
            }
            return;
        }
        if (p.startsWith("mode since.") || p.startsWith("mode=since.") || p.startsWith("since.")) {
            const unit = p.split(".").pop();
            if (unit) sinceUnitOverride = unit;
            modeExplicit = true;
            return;
        }

        if (!isNaN(p)) {
            // Select event by numeric index
            const index = parseInt(p) - 1;
            selectionSpecified = true;
            if (sinceMode) {
                const sinceEvents = events.filter(isSinceEvent).filter(e => daysSince(e.date) >= 0);
                if (index >= 0 && index < sinceEvents.length) selectedEvent = sinceEvents[index];
            } else if (index >= 0 && index < events.length) {
                selectedEvent = events[index];
            }
            return;
        }

        // Select event by matching name (case-insensitive)
        selectionSpecified = true;
        if (sinceMode) {
            const sinceEvents = events.filter(isSinceEvent).filter(e => daysSince(e.date) >= 0);
            const match = sinceEvents.find(e => matchesEventName(e, p));
            if (match) selectedEvent = match;
        } else {
            const match = events.find(e => matchesEventName(e, p));
            if (match) selectedEvent = match;
        }
    });
}

if (lockDisplayType && !modeExplicit) {
    sinceMode = false;
}

    if (sinceMode && selectionSpecified) {
        // Include 'ended' events in since mode selection
        const sinceFallback = events.filter(e => isSinceEvent(e)).filter(e => getEventDisplayDays(e) >= 0);
        if (!selectedEvent || !isSinceEvent(selectedEvent)) {
            if (sinceFallback.length) selectedEvent = sinceFallback[0];
        }
    }

// if (param && param !== "col") {
//   const parts = param.split(',').map(p => p.trim());
//   if (parts.includes("age")) showAgeMode = true;

//   const otherParam = parts.find(p => p !== "age");
//   if (otherParam) {
//     if (!isNaN(otherParam)) {
//       const index = parseInt(otherParam) - 1;
//       if (index >= 0 && index < events.length) {
//         selectedEvent = events[index];
//       }
//     } else {
//       const match = events.find(e => e.name.toLowerCase().includes(otherParam));
//       if (match) selectedEvent = match;
//     }
//   }
// }

// === Countdown Utils ===
function upcomingDateInCurrentYear(dateStr) {
    const today = new Date();
    // Use parseLocalDate to avoid UTC parsing issues ("YYYY-MM-DD" parses as UTC)
    const d = parseLocalDate(dateStr);
    if (!d || isNaN(d.getTime())) return null;
    let upcoming = new Date(today.getFullYear(), d.getMonth(), d.getDate());
    if (upcoming < today) {
        upcoming.setFullYear(today.getFullYear() + 1);
    }
    return upcoming;
}
// Sort events by days until occurrence so today's events appear first in lists/grids
events.sort((a, b) => daysUntil(a.date) - daysUntil(b.date));

function parseLocalDate(dateStr) {
    if (!dateStr && dateStr !== 0) return null;
    if (dateStr instanceof Date) {
        const dd = new Date(dateStr);
        return new Date(dd.getFullYear(), dd.getMonth(), dd.getDate());
    }

    const s = String(dateStr).trim();

    // YYYY-MM-DD (ISO) -> treat as local date (avoid UTC shift)
    const mIso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (mIso) {
        const y = Number(mIso[1]);
        const mo = Number(mIso[2]) - 1;
        const day = Number(mIso[3]);
        return new Date(y, mo, day);
    }

    // MM/DD/YYYY or M/D/YYYY
    const mUS = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mUS) {
        const mo = Number(mUS[1]) - 1;
        const day = Number(mUS[2]);
        const y = Number(mUS[3]);
        return new Date(y, mo, day);
    }

    // Fallback: parse with Date, then normalize to local Y/M/D
    const d = new Date(s);
    if (isNaN(d)) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysUntil(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let eventDate = parseLocalDate(dateStr);
    if (!eventDate || isNaN(eventDate.getTime())) {
        // If we can't parse the date, return a large number so it won't be chosen as next event
        return 99999;
    }

    eventDate.setFullYear(today.getFullYear());

    if (eventDate < today) {
        eventDate.setFullYear(today.getFullYear() + 1);
    }

    return Math.round((eventDate - today) / (1000 * 60 * 60 * 24));
}

function calculateAgeData(dateStr, today) {
    const birthDate = parseLocalDate(dateStr);
    const thisYearBday = new Date(birthDate);
    thisYearBday.setFullYear(today.getFullYear());
    thisYearBday.setHours(0, 0, 0, 0);

    let ageWhole = today.getFullYear() - birthDate.getFullYear();
    // If birthday hasn't occurred yet this year, subtract 1
    if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
        ageWhole -= 1;
    }
    // Calculate last and next birthday
    let lastBday = new Date(birthDate);
    lastBday.setFullYear(today.getFullYear());
    if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
        lastBday.setFullYear(today.getFullYear() - 1);
    }
    let nextBday = new Date(lastBday);
    nextBday.setFullYear(lastBday.getFullYear() + 1);
    const ageDecimal = ageWhole + (today - lastBday) / (nextBday - lastBday);

    return { birthDate, thisYearBday, ageDecimal };
}

function formatDate(dateStr) {
    const d = parseLocalDate(dateStr);
    const df = new DateFormatter();
    df.dateFormat = "EEE, MMM d, YYYY"; // e.g., Sat, Aug 23
    return df.string(d);
}

function formatCountdown(dateStr) {
    const days = daysUntil(dateStr);
    if (days < 0) return "Today!";
    if (days === 0) return "Today";
    const display = buildDurationLabel(days, "countdown");
    return `${display.valueText} ${display.unitLabel} ${display.suffix}`;
}

// === Helper Function to Create Text Elements ===
/**
 * Creates a styled label in a stack.
 * @param {WidgetStack} stack - The stack to add the text to.
 * @param {string} text - The label text.
 * @param {number} size - Font size.
 * @param {string} weight - One of: "bold", "heavy", "light", "medium", "semibold", "ultralight", "thin", "italic".
 * @param {Object} opts - Optional settings:
 *  - color: Color (default white)
 *  - alignment: "left" | "center" | "right" (default "left")
 *  - minScale: number (default 1.0)
 *  - lineLimit: number (default 1)
 */
function createStyledLabel(stack, text, size, weight = "regular", opts = {}) {
    const label = stack.addText(text);

    // Determine font weight
    switch (weight) {
        case "bold":
            label.font = Font.boldSystemFont(size);
            break;
        case "heavy":
            label.font = Font.heavySystemFont(size);
            break;
        case "light":
            label.font = Font.lightSystemFont(size);
            break;
        case "medium":
            label.font = Font.mediumSystemFont(size);
            break;
        case "semibold":
            label.font = Font.semiboldSystemFont(size);
            break;
        case "ultralight":
            label.font = Font.ultraLightSystemFont(size);
            break;
        case "thin":
            label.font = Font.thinSystemFont(size);
            break;
        case "italic":
            label.font = Font.italicSystemFont(size);
            break;
        default:
            label.font = Font.systemFont(size);
    }

    // Apply other styling
    label.textColor = opts.color || currentTextColor || Color.white();
    label.minimumScaleFactor = opts.minScale || 1.0;
    if (opts.lineLimit) {
        label.lineLimit = opts.lineLimit;
    }


    if (opts.alignment === "center") label.centerAlignText();
    else if (opts.alignment === "right") label.rightAlignText();
    else label.leftAlignText();

    return label;
}


// === Widget Setup ===
const widget = new ListWidget();
widget.backgroundColor = new Color("#1e1e1e");
// widget.setPadding(10, 10, 10, 10);
widget.setPadding(10, 10, 10, 10);

// === Layout Settings Based on Size ===
const size = config.widgetFamily;

// === Small Widget ===
const isAccessoryInline = config.widgetFamily === "accessoryInline";
const isAccessoryCircular = config.widgetFamily === "accessoryCircular";
const isAccessoryRectangular = config.widgetFamily === "accessoryRectangular";

if (!lockDisplayType) {
    if (isAccessoryInline) lockDisplayType = "topbar";
    else if (isAccessoryCircular) lockDisplayType = "circular";
    else if (isAccessoryRectangular) lockDisplayType = "rectangular";
}

if ((lockDisplayType === "topbar" && isAccessoryInline) || (lockDisplayType === "circular" && isAccessoryCircular) || (lockDisplayType === "rectangular" && isAccessoryRectangular)) {
    if (sinceMode && !selectionSpecified) {
        const sinceEvents = events
            .filter(isSinceEvent)
            .filter(e => getEventDisplayDays(e) >= 0)
            .sort((a, b) => getEventDisplayDays(b) - getEventDisplayDays(a));
        if (sinceEvents.length) selectedEvent = sinceEvents[0];
    } else if (!sinceMode && !selectionSpecified) {
        const upcomingEvents = events.filter(e => !isSinceEvent(e));
        if (upcomingEvents.length) {
            selectedEvent = upcomingEvents.reduce((closest, event) => {
                const daysToEvent = daysUntil(event.date);
                const daysToClosest = daysUntil(closest.date);
                return daysToEvent < daysToClosest ? event : closest;
            }, upcomingEvents[0]);
        }
    }

    if (!selectedEvent) {
        const fallback = sinceMode ? events.filter(isSinceEvent) : events;
        if (fallback.length) selectedEvent = fallback[0];
    }

    if (!selectedEvent) {
        const lockWidget = new ListWidget();
        lockWidget.backgroundColor = new Color("#000000", 0);
        if (lockDisplayType === "topbar" && lockWidget.addAccessoryInline) {
            lockWidget.addAccessoryInline().addText("No events");
        } else if (lockDisplayType === "circular" && lockWidget.addAccessoryCircular) {
            lockWidget.addAccessoryCircular().addText("No events");
        }
        Script.setWidget(lockWidget);
        Script.complete();
        return;
    }

    // rushi 1 
    const event = selectedEvent;
    // In since mode, treat both 'since' and 'ended' events as 'since' for display
    // Always treat ended events as 'since' for display
    let displayMode = sinceMode ? getEventDisplayMode(event) : "countdown";
    const type = event.eventType || event.type || "";
    if ((sinceMode && isSinceEvent(event)) || type.toLowerCase() === "ended") {
        displayMode = "since";
    }
    const days = displayMode === "since" ? daysSince(event.date) : daysUntil(event.date);
    const display = displayMode === "since" ? buildSinceLabel(days, sinceUnitOverride) : buildDurationLabel(days, displayMode);
    const unitText = displayMode === "since" ? `${display.unitLabel}` : `${display.unitLabel} ${display.suffix}`;
    // const eventTextColor = getEventTextColor(event);
    const eventTextColor = new Color("#FFFFFF");
    const displayName = getEventDisplayName(event, sinceMode);
    const titleSuffix = displayName === event.name ? (titleSuffixes[event.icon] || titleSuffixes["default"] || "") : "";
    const titleText = `${displayName}${titleSuffix}`;

    const lockWidget = new ListWidget();
    // lockWidget.backgroundColor = Color.clear();

    if (lockDisplayType === "topbar") {
        const isTodayCountdown = displayMode === "countdown" && days === 0;
        const topbarValueText = displayMode === "countdown"
            ? (isTodayCountdown ? "Today!" : `${days}d left`)
            : `${display.valueText} ${unitText}`;
        const topbarText = `${topbarValueText} - ${displayName}`;
        // const lockIcon = repeatLockscreenIcon || repeatIcon;
        const lockIcon = sinceIcon;
        if (!lockWidget.addAccessoryInline) {
            lockWidget.backgroundColor = Color.clear();
            if (lockIcon) {
                const img = lockWidget.addImage(lockIcon);
                img.imageSize = new Size(5, 5);
                img.tintColor = eventTextColor;
            }
            const text = lockWidget.addText(topbarText);
            text.textColor = eventTextColor;
            text.font = Font.systemFont(11);
            text.minimumScaleFactor = 0.5;
            text.lineLimit = 1;
            Script.setWidget(lockWidget);
            Script.complete();
            return;
        }
        const inline = lockWidget.addAccessoryInline();
        // if (lockIcon) {
        //     const img = inline.addImage(lockIcon);
        //     img.imageSize = new Size(5, 5);
        //     img.tintColor = eventTextColor;
        // }
        // const text = inline.addText(topbarText);
        // text.textColor = eventTextColor;
        // text.font = Font.systemFont(11);
        // text.minimumScaleFactor = 0.5;
        // text.lineLimit = 1;
    } else if (lockDisplayType === "circular") {
        // const baseBg = event.color || "#FFFFFF";
        const baseBg = "#000000";
        // const lighterBg = lightenHexColor(baseBg, 0.2) || baseBg;
        const circleBg = new Color(baseBg);
        const circleText = Color.white();
        const isTodayCountdown = displayMode === "countdown" && days === 0;
        const circleValueText = isTodayCountdown ? `${event.icon}\nToday!` : display.valueText;
        const circleUnitText = isTodayCountdown ? `` : unitText;

        if (!lockWidget.addAccessoryCircular) {
            const lockSize = lockWidget.size && lockWidget.size.width ? Math.min(lockWidget.size.width, lockWidget.size.height) : 58;
            const circleSize = Math.max(1, Math.round(lockSize));
            const circleImage = buildCircularBgImage(circleValueText, circleUnitText, circleBg, circleText, circleSize);
            lockWidget.setPadding(0, 0, 0, 0);
            const img = lockWidget.addImage(circleImage);
            img.imageSize = new Size(circleSize, circleSize);
            img.centerAlignImage();
            Script.setWidget(lockWidget);
            Script.complete();
            return;
        }

        const circular = lockWidget.addAccessoryCircular();
        // const stackSize = circular.size && circular.size.width ? Math.min(circular.size.width, circular.size.height) : 58;
        // const circleSize = Math.max(1, Math.round(stackSize));
        // const circleImage = buildCircularBgImage(circleValueText, circleUnitText, circleBg, circleText, circleSize);
        // circular.setPadding(0, 0, 0, 0);
        // circular.centerAlignContent();
        // const img = circular.addImage(circleImage);
        // img.imageSize = new Size(circleSize, circleSize);
        // img.centerAlignImage();
    } else {
        if (!lockWidget.addAccessoryRectangular) {
            // const baseBg = event.color || "#00000000";
            const baseBg = "#00000000"; // 00000000
            // const lighterBg = lightenHexColor(baseBg, 0.15) || baseBg;
            const rectBg = new Color(baseBg);
            const rectText = Color.white();
            const isTodayCountdown = displayMode === "countdown" && days === 0;
            const rectValueText = isTodayCountdown ? "Today!" : display.valueText;
            const rectUnitText = isTodayCountdown ? "" : unitText;

            // v1
            lockWidget.setPadding(0, 0, 0, 0);
            lockWidget.backgroundColor = Color.clear();
            const title = lockWidget.addText(String(titleText));
            title.textColor = rectText;
            title.font = Font.semiboldSystemFont(12);
            title.minimumScaleFactor = 0.6;
            title.lineLimit = 1;
            lockWidget.addSpacer(2);
            const valueLine = `${rectValueText}${rectUnitText ? " " + rectUnitText : ""}`;
            const value = lockWidget.addText(valueLine);
            value.textColor = rectText;
            value.font = Font.systemFont(10);
            value.minimumScaleFactor = 0.6;
            value.lineLimit = 1;

            // v2 
            // const rectSize = lockWidget.size ? lockWidget.size : new Size(155, 55);
            // const rectImage = buildRectBgImage(displayName, rectValueText, rectUnitText, rectBg, rectText, rectSize);
            // lockWidget.setPadding(0, 0, 0, 0);
            // lockWidget.addImage(rectImage);

            Script.setWidget(lockWidget);
            Script.complete();
            return;
        }

        // const rect = lockWidget.addAccessoryRectangular();
        // // const baseBg = event.color || "#2980b9";
        // const baseBg = "#000000";
        // // const lighterBg = lightenHexColor(baseBg, 0.15) || baseBg;
        // const rectBg = new Color(baseBg);
        // const rectText = Color.white();
        // const isTodayCountdown = displayMode === "countdown" && days === 0;
        // const rectValueText = isTodayCountdown ? "Today!" : display.valueText;
        // const rectUnitText = isTodayCountdown ? "" : unitText;
        // const rectSize = rect.size ? rect.size : new Size(155, 55);
        // const rectImage = buildRectBgImage(titleText, rectValueText, rectUnitText, rectBg, rectText, rectSize);
        // rect.setPadding(0, 0, 0, 0);
        // rect.centerAlignContent();
        // const img = rect.addImage(rectImage);
        // img.imageSize = new Size(rectSize.width, rectSize.height);
        // img.centerAlignImage();
    }

    Script.setWidget(lockWidget);
    Script.complete();
    return;
}

if (size === "small") {

    if (sinceMode && !selectionSpecified) {
        // In since mode, include all 'since' and 'ended' events, sorted from most to least days/time since
        const sinceEvents = events
            .filter(e => isSinceEvent(e))
            .sort((a, b) => getEventDisplayDays(b) - getEventDisplayDays(a));
        if (sinceEvents.length) selectedEvent = sinceEvents[0];
    }

    const event = selectedEvent;
    const displayMode = sinceMode ? getEventDisplayMode(event) : "countdown";
    const days = displayMode === "since" ? daysSince(event.date) : daysUntil(event.date);
    const eventTextColor = getEventTextColor(event);
    setCurrentTextColor(eventTextColor);

    const titleIconName = titleSuffixes[event.icon] || titleSuffixes["default"];
    const ageSuffixArr = ageSuffixMap[event.icon] || ageSuffixMap["default"];
    const suffixArr = todaySuffixes[event.icon] || todaySuffixes["default"];

    // FIXED date adjustment (fully timezone safe)
    const originalDate = parseLocalDate(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const displayDate = new Date(originalDate);
    displayDate.setFullYear(today.getFullYear());

    // if (displayDate < today) {
    //     // displayDate.setFullYear(today.getFullYear() + 1);
    //     displayDate.setFullYear(today.getFullYear());
    // }

    const formattedDate = formatDate(displayDate);

    // Override widget properties
    widget.setPadding(0, 0, 0, 0); // reset
    widget.backgroundColor = new Color(event.color || "#2980b9");

    // === Main vertical layout
    const mainWrap = widget.addStack();
    mainWrap.layoutHorizontally();

    const main = mainWrap.addStack();
    main.layoutVertically();
    main.setPadding(12, 15, 12, 15);

    // === Top title section
    const topRow = main.addStack();
    topRow.layoutHorizontally();
    topRow.centerAlignContent();

    const mainFontsize = 15;

    // icon/emoji
    createStyledLabel(topRow, event.icon, mainFontsize + 6, "bold");
    topRow.addSpacer(7);
    // title (always show fallback if missing)
    let displayName = getEventDisplayName(event, sinceMode);
    if (!displayName || displayName.trim().length === 0) displayName = "Untitled Event";
    const titleSuffix = displayName === event.name ? titleIconName : "";
    createStyledLabel(topRow, `${displayName}${titleSuffix}`, mainFontsize, "bold", { minScale: 0.5, lineLimit: 2 });

    // === Age section
    if (showAgeMode) {


        // makes everthing in bwtween "main.addSpacer();" align equally
        main.addSpacer();
        const middleRow = main.addStack();
        middleRow.layoutVertically();
        // middleRow.bottomAlignContent();
        // middleRow.spacing = 10;

        if (event.icon) {

            const { birthDate, thisYearBday, ageDecimal } = calculateAgeData(event.date, today);
            let ageDisplay;

            // line 1: days left
            const countdown = middleRow.addStack();
            countdown.layoutHorizontally();

            let fsOffset = 5;

            if (thisYearBday.getTime() === today.getTime()) {
                // if birthday than show nothing
                // this won't show days left label
            } else {
                const display = displayMode === "since" ? buildSinceLabel(days, sinceUnitOverride) : buildDurationLabel(days, displayMode);
                const numberOpts = displayMode === "since" ? { minScale: 0.6, lineLimit: 1 } : {};
                createStyledLabel(countdown, `${display.valueText}`, mainFontsize + fsOffset, "semibold", numberOpts);
                const unitText = displayMode === "since" ? `${display.unitLabel}` : `${display.unitLabel} ${display.suffix}`;
                createStyledLabel(countdown, ` ${unitText}`, mainFontsize + fsOffset - 1);
            }

            // line 2: turning age
            const turningAge = middleRow.addStack();
            turningAge.layoutHorizontally();

            let k = fsOffset;
            // Correct logic: show the age they will turn on their next birthday
            // If today is before this year's birthday, turning age = current age + 1
            // If today is on or after this year's birthday, turning age = current age + 1 (next birthday)
            // But current age is already handled by ageWhole in calculateAgeData
            let ageWhole = (today.getFullYear() - birthDate.getFullYear());
            if (
                today.getMonth() < birthDate.getMonth() ||
                (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
            ) {
                // before birthday this year
                // ageWhole is correct (has not incremented yet)
                ageDisplay = ageWhole;
            } else {
                // on or after birthday this year
                // ageWhole is correct (already incremented)
                ageDisplay = ageWhole+1;
            }
            // let turningAgeValue = ageWhole + 1;
            // ageDisplay = ageWhole;

            // ageWhole = ageWhole - 1;

            if (thisYearBday.getTime() === today.getTime()) {
                createStyledLabel(turningAge, suffixArr[0], mainFontsize + k - 1);
                createStyledLabel(turningAge, `${ageWhole}!!`, mainFontsize + k, "semibold");
                createStyledLabel(turningAge, suffixArr[1], mainFontsize + k - 1);
            } else {
                createStyledLabel(turningAge, ageSuffixArr[0], mainFontsize + k - 1);
                createStyledLabel(turningAge, `${ageDisplay}!`, mainFontsize + k, "semibold");
                createStyledLabel(turningAge, ageSuffixArr[1], mainFontsize + k - 1);
            }

        } else {
            // Non-emoji events: show age info if birthday is today, else show normal countdown
            const { birthDate, thisYearBday, ageDecimal } = calculateAgeData(event.date, today);
            if (thisYearBday.getTime() === today.getTime()) {
                // Show only the age line when birthday is today
                main.addSpacer();
                const turningAge = middleRow.addStack();
                turningAge.layoutHorizontally();

                const ageDisplay = (thisYearBday <= today) ? (parseFloat(ageDecimal) + 1).toFixed(0) : (ageDecimal).toFixed(0);

                // Use today's suffix mapping if available, otherwise default
                const suffixArr = todaySuffixes[event.icon] || todaySuffixes["default"];
                createStyledLabel(turningAge, suffixArr[0], mainFontsize + 4 - 1);
                createStyledLabel(turningAge, `${ageDisplay}!`, mainFontsize + 4, "semibold");
                createStyledLabel(turningAge, suffixArr[1], mainFontsize + 4 - 1);
            } else {
                const display = displayMode === "since" ? buildSinceLabel(days, sinceUnitOverride) : buildDurationLabel(days, displayMode);
                const unitText = displayMode === "since" ? `${display.unitLabel}` : `${display.unitLabel} ${display.suffix}`;
                main.addSpacer(0);
                const numberOpts = displayMode === "since" ? { minScale: 0.6, lineLimit: 1 } : {};
                createStyledLabel(middleRow, `${display.valueText}`, mainFontsize + 27, "light", numberOpts);
                createStyledLabel(middleRow, unitText, mainFontsize + 2, "light");
            }
        }

    } else {
        const { birthDate, thisYearBday, ageDecimal } = calculateAgeData(event.date, today);
        let ageDisplay;
        let k = 5; // font size offset
        // ageDisplay = (thisYearBday <= today) ? (parseFloat(ageDecimal) + 1).toFixed(0) : (ageDecimal).toFixed(0);
        ageDisplay = (thisYearBday <= today) ? (parseFloat(ageDecimal)).toFixed(0) : (ageDecimal).toFixed(0);


        if (thisYearBday.getTime() === today.getTime()) {
            main.addSpacer();
            const middleRow = main.addStack();
            middleRow.layoutVertically();
            const turningAge = middleRow.addStack();
            turningAge.layoutHorizontally();
            createStyledLabel(turningAge, suffixArr[0], mainFontsize + k - 1);
            createStyledLabel(turningAge, `${ageDisplay}!`, mainFontsize + k, "semibold");
            createStyledLabel(turningAge, suffixArr[1], mainFontsize + k - 1);
        } else {
            const display = displayMode === "since" ? buildSinceLabel(days, sinceUnitOverride) : buildDurationLabel(days, displayMode);
            const unitText = displayMode === "since" ? `${display.unitLabel}` : `${display.unitLabel} ${display.suffix}`;
            main.addSpacer(0); // Pushs the section up
            const middleRow = main.addStack();
            middleRow.layoutVertically();
            const numberOpts = displayMode === "since" ? { minScale: 0.6, lineLimit: 1 } : {};
            createStyledLabel(middleRow, `${display.valueText}`, mainFontsize + 27, "light", numberOpts);
            createStyledLabel(middleRow, unitText, mainFontsize + 2);
        }
    }
    main.addSpacer();

    // === Date section
    const bottomRow = main.addStack();
    bottomRow.layoutHorizontally();
    bottomRow.centerAlignContent();
    let repeatIconSize = 15;
    // let repeatIconSize = displayMode === "since" ? 15 : 15;

    // load image
    // Use since icon for both 'since' and 'ended' events
    const bottomIcon = displayMode === "since" ? getSinceHomeIconImage() : repeatIcon;
    if (bottomIcon) {
        const iconImg = bottomRow.addImage(bottomIcon);
        iconImg.imageSize = new Size(repeatIconSize, repeatIconSize);
        iconImg.tintColor = eventTextColor;
        // let btwspace = displayMode === "since" ? 3 : 6
        // bottomRow.addSpacer(btwspace); // space between icon and date text
        bottomRow.addSpacer(6); // space between icon and date text
    } else {
        bottomRow.addSpacer(repeatIconSize + 6);
    }
    // birth date
    if (displayMode === "since") {
        const startedDate = parseLocalDate(event.date);
        const df = new DateFormatter();
        df.dateFormat = "d MMM";
        let sinceLabel = "Started on";
                // const type = item.eventType || item.type || "";
                // if (type.toLowerCase() === "ended") {
                //     sinceLabel = "Ended on";
                // }
        createStyledLabel(bottomRow, `${sinceLabel} ${df.string(startedDate)}`, mainFontsize - 3);
    } else {
        createStyledLabel(bottomRow, `${formattedDate}`, mainFontsize - 3, { minScale: 0.6, lineLimit: 1 });
    }

    mainWrap.addSpacer();

    Script.setWidget(widget);
    Script.complete();
    return;

}

const gridConfig = {
    // large: { rows: 5, cols: 2, cellHeight: 65, cellWidth: 329 / 2, fontSize: { title: 13, text: 11 }, padding: 6, spacing: 8 },
    // medium: { rows: 2, cols: 2, cellHeight: 65, cellWidth: 329 / 2, fontSize: { title: 13, text: 11 }, padding: 6, spacing: 8 },
    large: { rows: 5, cols: 2, cellHeight: 65, cellWidth: 329 / 2, fontSize: { title: 13, text: 11 }, padding: 0, spacing: 8 },
    medium: { rows: 2, cols: 2, cellHeight: 65, cellWidth: 329 / 2, fontSize: { title: 13, text: 11 }, padding: 0, spacing: 8 },
    small: { rows: 1, cols: 1, cellHeight: 50, cellWidth: 0, fontSize: { title: 13, text: 11 }, padding: 4, spacing: 4 }
};

const configSize = gridConfig[size] || gridConfig["small"];
const useRandomPalette = size === "medium" || size === "large";
let lastPaletteIndex = -1;
function pickNonRepeatingPaletteColor() {
    if (!colorPalette || colorPalette.length === 0) return "#000000";
    if (colorPalette.length === 1) return colorPalette[0];
    let idx = Math.floor(Math.random() * colorPalette.length);
    if (idx === lastPaletteIndex) {
        idx = (idx + 1 + Math.floor(Math.random() * (colorPalette.length - 1))) % colorPalette.length;
    }
    lastPaletteIndex = idx;
    return colorPalette[idx];
}

if (param && param.includes("col")) {
    const { rows, cols, cellHeight, cellWidth, fontSize, padding, spacing } = configSize;

    // Pagination logic for Grid View
    const itemsPerPage = rows * cols;
    const startIdx = (page - 1) * itemsPerPage;
    // In since mode, show both 'since' and 'ended' events, sorted from most to least days/time since
    const sourceEvents = sinceMode
        ? events.filter(e => isSinceEvent(e)).sort((a, b) => getEventDisplayDays(b) - getEventDisplayDays(a))
        : events;
    const pagedEvents = sourceEvents.slice(startIdx, startIdx + itemsPerPage);

    // Pad with null if fewer items remain
    while (pagedEvents.length < itemsPerPage) pagedEvents.push(null);

    for (let r = 0; r < rows; r++) {
        const row = widget.addStack();
        row.layoutHorizontally();
        row.spacing = spacing;

        for (let c = 0; c < cols; c++) {
            const index = r * cols + c;
            const item = pagedEvents[index];

            const cell = row.addStack();
            cell.layoutVertically();
            // cell.layoutHorizontally();
            cell.size = new Size(cellWidth, cellHeight);
            cell.cornerRadius = 12;
            cell.setPadding(padding, padding, padding, padding);
            cell.centerAlignContent();

            if (item) {
                const displayMode = sinceMode ? getEventDisplayMode(item) : "countdown";
                const days = displayMode === "since" ? daysSince(item.date) : daysUntil(item.date);
                const formattedDate = formatDate(item.date);
                const paletteColor = useRandomPalette
                    ? pickNonRepeatingPaletteColor()
                    : (item.color || colorPalette[(startIdx + index) % colorPalette.length]);
                cell.backgroundColor = new Color(paletteColor);
                const eventTextColor = Color.white();
                setCurrentTextColor(eventTextColor);

                const rowStack = cell.addStack();
                // rowStack.layoutVertically();
                rowStack.layoutHorizontally();
                rowStack.centerAlignContent();
                // rowStack.spacing = 4;

                // Left Stack component
                // const leftStack = rowStack.addStack();
                // leftStack.layoutHorizontally();
                // leftStack.centerAlignContent();

                // createStyledLabel(leftStack, item.icon || "📅", fontSize.title + 7, "regular", { minScale: 0.8, lineLimit: 1 });
                // createStyledLabel(leftStack, item.icon || "📅", fontSize.title - 2, "regular", { minScale: 0.8, lineLimit: 1 });
                // topRow.addSpacer(2);
                // Name (truncate if necessary)
                // createStyledLabel(topRow, item.name, fontSize.title, "bold", { minScale: 0.8, lineLimit: 1 });

                // rowStack.addSpacer(3);

                const leftStack_text_wrapper = rowStack.addStack();
                leftStack_text_wrapper.layoutVertically();
                // setPadding(top, leading, bottom, trailing)
                leftStack_text_wrapper.setPadding(0, 5, 0, 0);

                const leftStack_text = leftStack_text_wrapper.addStack();
                // leftStack_text.layoutVertically();
                leftStack_text.layoutHorizontally();
                // leftStack.centerAlignContent();
                // leftStack_text.addSpacer(3);
                const displayName = getEventDisplayName(item, sinceMode);
                createStyledLabel(leftStack_text, `${item.icon || "📅"} ${displayName}`, fontSize.title - 1, "bold", { minScale: 0.8, lineLimit: 1 });
                // createStyledLabel(leftStack_text, `${formattedDate}`, fontSize.text - 2, { minScale: 0.8, lineLimit: 1 });

                leftStack_text_wrapper.addSpacer(5);

                // Bottom row: date and icon
                const dateRow = leftStack_text_wrapper.addStack();
                dateRow.layoutHorizontally();
                dateRow.centerAlignContent();

                const dateRowIcon = displayMode === "since" ? getSinceHomeIconImage() : repeatIcon;
                if (dateRowIcon) {
                    const iconImg = dateRow.addImage(dateRowIcon);
                    iconImg.imageSize = new Size(fontSize.text, fontSize.text);
                    iconImg.tintColor = eventTextColor;
                    dateRow.addSpacer(3);
                } else {
                    // If no repeat icon is available, give equivalent spacing so layout stays consistent
                    dateRow.addSpacer(fontSize.text - 1);
                }

                // dateRow.addSpacer(5);
                createStyledLabel(dateRow, `${formattedDate}`, fontSize.text - 2, { minScale: 0.8, lineLimit: 1 });


                // space in between
                rowStack.addSpacer();

                // Right Stack component
                // const RightStack = rowStack.addStack();
                // // RightStack.layoutVertically();
                // RightStack.layoutHorizontally();
                // RightStack.centerAlignContent();

                // if (days === 0) {
                //   createStyledLabel(RightStack, "Today!", fontSize.text, "medium", { lineLimit: 1 });
                // } else {
                //   createStyledLabel(RightStack, `${days}`, fontSize.text+4, "bold", { lineLimit: 1 });
                //   createStyledLabel(RightStack, "days left", fontSize.text, "regular", { lineLimit: 1 });
                // }

                const rightWrapperH = rowStack.addStack();
                rightWrapperH.layoutHorizontally();
                rightWrapperH.centerAlignContent();
                const sinceMaxLen = displayMode === "since"
                    ? Math.max(String(display.valueText).length, String(unitText).length)
                    : 0;
                const sinceWidth = displayMode === "since"
                    ? Math.max(50, Math.round(18 + sinceMaxLen * 6))
                    : 50;
                rightWrapperH.size = new Size(sinceWidth, cellHeight);
                rightWrapperH.backgroundColor = new Color("#000000", 108 / 255);

                const rightWrapper = rightWrapperH.addStack();
                rightWrapper.layoutVertically();
                rightWrapper.centerAlignContent();
                // rightWrapper.size = new Size(45, cellHeight);

                // "6C" hex alpha = 0x6C = 108 -> alpha = 108/255 ≈ 0.4235
                // let a = 15;
                // let b = 12;
                // // setPadding(top, leading, bottom, trailing)
                // rightWrapper.setPadding(a,b,a,b);

                const rightStack1 = rightWrapper.addStack();
                rightStack1.layoutHorizontally();
                rightStack1.centerAlignContent();

                // Right stack (days number + "days left")
                const rightPaddingMap = { 1: 14, 2: 8, 3: 4, default: 5 };
                // For ended events, always show as 'since' (days since ended)
                let display, unitText;
                if (displayMode === "since") {
                    display = buildSinceLabel(days, sinceUnitOverride);
                    unitText = `${display.unitLabel}`;
                } else {
                    display = buildDurationLabel(days, displayMode);
                    unitText = `${display.unitLabel} ${display.suffix}`;
                }
                const rightPad = rightPaddingMap[display.valueText.toString().length] || rightPaddingMap.default;
                rightStack1.setPadding(0, rightPad, 0, 0);

                if (days === 0 && displayMode === "countdown") {
                    createStyledLabel(rightStack1, `🎉`, fontSize.text + 5, "semibold", { alignment: "center" });
                } else {
                    createStyledLabel(rightStack1, `${display.valueText}`, fontSize.text + 5, "semibold", { alignment: "center", lineLimit: 1, minScale: 0.5 });

                    const rightStack2 = rightWrapper.addStack();
                    rightStack2.layoutHorizontally();
                    rightStack2.centerAlignContent();
                    rightWrapper.addSpacer(0);

                    createStyledLabel(rightStack2, unitText, fontSize.text - 2, { lineLimit: 1, alignment: "center" });
                }

                // ----------------------------------------------------
                // // Top row: emoji icon on left and name on right (like default list view)
                // const topRow = rowStack.addStack();
                // topRow.layoutHorizontally();
                // topRow.centerAlignContent();

                // // Emoji icon as a separate label (larger)
                // createStyledLabel(topRow, item.icon || "📅", fontSize.title + 4, "regular", { minScale: 0.8, lineLimit: 1 });
                // topRow.addSpacer(2);
                // // Name (truncate if necessary)
                // createStyledLabel(topRow, item.name, fontSize.title, "bold", { minScale: 0.8, lineLimit: 1 });

                // // Middle row: formatted date (short)
                // const dateRow = rowStack.addStack();
                // dateRow.layoutHorizontally();
                // dateRow.centerAlignContent();
                // createStyledLabel(dateRow, formattedDate, fontSize.text, { lineLimit: 1 });

                // // Bottom row: countdown (make it right-aligned within the cell)
                // const bottomRow = rowStack.addStack();
                // bottomRow.layoutHorizontally();
                // bottomRow.centerAlignContent();
                // bottomRow.addSpacer();
                // const cd = (days === 0) ? `🎉 ${formatCountdown(item.date)}` : `${days} days left`;
                // createStyledLabel(bottomRow, cd, fontSize.text, "medium", { lineLimit: 1 });
            } else {
                cell.backgroundColor = new Color("#00000000"); // transparent placeholder
            }
        }

        if (r < rows - 1) widget.addSpacer(spacing);
    }


} else {
    // === Defualt List View ===
    const mainPadding = 6;
    const iconSize = size === "large" ? 20 : 20;
    const nameFontSize = size === "large" ? 17 : 17;
    const dateFontSize = nameFontSize - 5;
    const colorBarHeight = size === "large" ? 38 : 38;
    const colorBarGap = size === "large" ? 8 : 8;
    const rightNumberSize = 20; // same for all
    let rightPaddingMap = { 1: 24, 2: 18, 3: 12, default: 5 };
    let rightsincePaddingMap = { 1: 24, 2: 18, 3: 12, default: 5 };
    const maxItems = size === "large" ? 7 : 3;
    widget.backgroundColor = new Color("#000000");

    // === Pagination Logic ===
    const itemsPerPage = size === "large" ? 7 : 3;
    const startIdx = (page - 1) * itemsPerPage;
    const sourceEvents = sinceMode ? events.filter(isSinceEvent).sort((a, b) => getEventDisplayDays(a) - getEventDisplayDays(b)) : events;
    const pagedEvents = sourceEvents.slice(startIdx, startIdx + itemsPerPage);

    // for (let i = 0; i < maxItems; i++) { // normal loop
    for (let i = 0; i < pagedEvents.length; i++) { // paged loop
        const event = pagedEvents[i];
        if (!event) continue; // skip empty slots
        const displayMode = sinceMode ? getEventDisplayMode(event) : "countdown";
        const daysNum = displayMode === "since" ? daysSince(event.date) : daysUntil(event.date);
        const isToday = daysNum === 0 && displayMode === "countdown";
        const display = displayMode === "since" ? buildSinceLabel(daysNum, sinceUnitOverride) : buildDurationLabel(daysNum, displayMode);
        const daysDisplay = isToday ? formatCountdown(event.date) : display.valueText;
        const unitText = displayMode === "since" ? `${display.unitLabel}` : `${display.unitLabel} ${display.suffix}`;
        const eventTextColor = Color.white();
        setCurrentTextColor(eventTextColor);

        const onedayleft = daysDisplay === "1" ? 19 : 24;
        rightPaddingMap = { 1: onedayleft, 2: 18, 3: 12, default: 5 };

        if (displayMode === "since") {
            rightsincePaddingMap = { default: 0 };
        } else {
            rightsincePaddingMap = { 1: 24, 2: 18, 3: 12, default: 5 };
        }




        const row = widget.addStack();
        row.layoutHorizontally();
        row.centerAlignContent();
        row.addSpacer(mainPadding);

        // Left color bar
        const colorBar = row.addStack();
        colorBar.size = new Size(4, colorBarHeight);
        const paletteColor = useRandomPalette
            ? pickNonRepeatingPaletteColor()
            : (event.color || colorPalette[i % colorPalette.length]);
        colorBar.backgroundColor = new Color(paletteColor);

        row.addSpacer(colorBarGap);

        // Left content stack
        const leftStack = row.addStack();
        leftStack.layoutVertically();

        // Top row: icon and name
        const topRow = leftStack.addStack();
        topRow.layoutHorizontally();
        topRow.centerAlignContent();

        createStyledLabel(topRow, event.icon, iconSize);
        topRow.addSpacer(4);

        const baseName = getEventDisplayName(event, sinceMode);
        const nameLabel = event.icon === "🎂" && baseName === event.name ? `${event.name}'s Birthday` : baseName;
        createStyledLabel(topRow, nameLabel, nameFontSize, { lineLimit: 1 });

        // Bottom row: date and icon
        const dateRow = leftStack.addStack();
        dateRow.layoutHorizontally();
        dateRow.centerAlignContent();

        const dateRowIcon = displayMode === "since" ? getSinceHomeIconImage() : repeatIcon;
        if (dateRowIcon) {
            const iconImg = dateRow.addImage(dateRowIcon);
            iconImg.imageSize = new Size(dateFontSize, dateFontSize);
            iconImg.tintColor = eventTextColor;
            dateRow.addSpacer(6);
        } else {
            // If no repeat icon is available, give equivalent spacing so layout stays consistent
            dateRow.addSpacer(dateFontSize + 6);
        }

        createStyledLabel(dateRow, formatDate(event.date), dateFontSize, { lineLimit: 1 });

        row.addSpacer(); // Push right stack to the right

        // Right stack (days number + "days left")
        const rightWrapper = row.addStack();
        rightWrapper.layoutVertically();
        rightWrapper.centerAlignContent();
        const sinceMaxLen = displayMode === "since"
            ? Math.max(String(daysDisplay).length, String(unitText).length)
            : 0;
        const sinceWidth = displayMode === "since"
            ? Math.max(48, Math.round(18 + sinceMaxLen * 6))
            : null;

        const rightStack1 = rightWrapper.addStack();
        rightStack1.layoutHorizontally();
        rightStack1.centerAlignContent();
        if (sinceWidth) {
            rightStack1.size = new Size(sinceWidth, 0);
        }

        const rightPad = rightPaddingMap[daysDisplay.toString().length] || rightPaddingMap.default;
        const sincePad = rightsincePaddingMap[daysDisplay.toString().length] || rightsincePaddingMap.default;
        const modPad =  displayMode === "since" ? sincePad : rightPad;
        rightStack1.setPadding(0, modPad, 0, 0);

        if (isToday) {
            createStyledLabel(rightStack1, `🎉 ${daysDisplay}`, rightNumberSize - 1, "semibold", { alignment: "center" });
        } else {
            createStyledLabel(rightStack1, `${daysDisplay}`, rightNumberSize, "semibold", { alignment: "center", lineLimit: 1, minScale: 0.5 });

            const rightStack2 = rightWrapper.addStack();
            rightStack2.layoutHorizontally();
            rightStack2.centerAlignContent();
            rightWrapper.addSpacer(0);
            if (sinceWidth) {
                rightStack2.size = new Size(sinceWidth, 0);
            }

            if (displayMode === "since") {
                rightStack2.setPadding(0, modPad, 0, 0);
            }

            createStyledLabel(rightStack2, unitText, rightNumberSize - 5, { alignment: "center" });
        }

        row.addSpacer(mainPadding);

        if (i < maxItems - 1) widget.addSpacer(4);
    }
}

// Refresh widget daily at 2 AM
function getNext2AM() {
    const now = new Date();
    const nextRefresh = new Date(now);
    nextRefresh.setHours(2, 0, 0, 0); // Set to 2:00 AM today
    if (now >= nextRefresh) {
        nextRefresh.setDate(nextRefresh.getDate() + 1); // if past 2 AM, schedule for next day
    }
    return nextRefresh;
}

// widget.refreshAfterDate = getNext2AM();

widget.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000); // refresh hourly
// For in-app runs (scrolling view)
if (config.runsInApp) {
    const table = new UITable();
    table.showSeparators = false;
    table.backgroundColor = new Color("#000000");

    for (const event of events) {
        const displayMode = getEventDisplayMode(event);
        const days = displayMode === "since" ? daysSince(event.date) : daysUntil(event.date);
        const eventTextColor = getEventTextColor(event);
        const row = new UITableRow();
        row.height = 80;
        row.backgroundColor = new Color("#1e1e1e");

        // Combine emoji and event details into a single left-aligned cell
        const baseName = getEventDisplayName(event, sinceMode);
        const leftName = event.icon === "🎂" && baseName === event.name ? `${event.name}'s Birthday` : baseName;
        const leftText = `${event.icon}  ${leftName}\n📅 ${formatDate(event.date)}`;
        const leftCell = row.addText(leftText);
        leftCell.titleFont = Font.semiboldSystemFont(16);
        leftCell.subtitleFont = Font.systemFont(13);
        leftCell.titleColor = eventTextColor;
        leftCell.subtitleColor = eventTextColor;
        leftCell.widthWeight = 0.7;
        leftCell.leftAligned();

        // Days left in a right-aligned cell (show friendly "Today" text when appropriate)
        const friendly = formatCountdown(event.date);
        const daysCell = row.addText(`${friendly}`);
        daysCell.titleFont = Font.semiboldSystemFont(16);
        daysCell.subtitleFont = Font.systemFont(13);
        daysCell.titleColor = eventTextColor;
        daysCell.subtitleColor = eventTextColor;
        daysCell.widthWeight = 0.3;
        daysCell.rightAligned();

        table.addRow(row);
    }

    await table.present();

    Script.complete();
} else {
    Script.setWidget(widget);
    Script.complete();
}

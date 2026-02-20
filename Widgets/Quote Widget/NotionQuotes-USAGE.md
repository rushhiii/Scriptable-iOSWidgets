# NotionQuotes Script Usage Guide

## Features

- Fetches quotes directly from your Notion database using the Notion API
- Supports multiple categories (tabs) and widget sizes
- Customizable widget parameters for category, size, and quote selection
- Uses color pairs from local JSON for styling
- Refreshes quotes hourly or daily


## Setup

1. Open `NotionQuotes.js` in Scriptable.
2. Replace `YOUR_NOTION_INTEGRATION_TOKEN` and `YOUR_NOTION_DATABASE_ID` with your own values.
3. (Optional) Add a `.source/dark_theme_color_pairs.json` file for custom color themes.


## Widget Parameters

- **Category**: Choose a category (e.g., `zen`, `kafka`, `gita`, etc.)
- **Size**: `s` (small), `m` (medium), `l` (large)
- **Index**: Show a specific quote by index (e.g., `3`)

**Example parameter:**
`zen,m,5` (shows the 5th quote from the zen category in medium size)


## How to Use

1. Add a Scriptable widget to your Home Screen.
2. Select the `NotionQuotes.js` script.
3. Set the widget parameter as desired.


## Troubleshooting

- Make sure your Notion integration is shared with your database.
- Double-check your token and database ID.
- If no quotes appear, verify your Notion property names match those in the script's `NOTION_PROPERTY_MAP`.



> ***For advanced configuration, see comments at the top of the script.***

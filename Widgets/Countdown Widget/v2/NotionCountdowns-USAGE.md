# Notion Countdown Widget Usage Guide

## Features

- **Direct Notion Integration**: Fetches events directly from your Notion database using the Notion API.
- **Multiple Widget Modes**: Supports countdown and since modes.
- **Lock Screen Widgets**: Compatible with iOS lock screen accessory widgets (inline, circular, rectangular).
- **Event Selection**: Show a specific event by name or index.
- **Grid View**: Display multiple events in a grid (medium/large widgets).
- **Custom Colors & Icons**: Use Notion properties for widget emoji and color.
- **Age Display**: Optionally show age for birthday events.

## How to Use

1. **Configure the Script**
   - Open `NotionCountdowns.js` in Scriptable.
   - Replace `YOUR_NOTION_INTEGRATION_TOKEN` and `YOUR_NOTION_DATABASE_ID` with your own values.

2. **Widget Parameter Options**
   - You can customize the widget by setting parameters (comma-separated, case-insensitive):
     - `mode=since` or `since` — Show time since an event
     - `mode=countdown` or `countdown` — Show countdown to an event
     - `topbar`, `circular`, `rect`, `rectangular` — Lock screen widget type
     - `days`, `weeks`, `months`, `years`, `hours`, `minutes` — Since unit override
     - Event selection: use a number (e.g., `3`) or event name (e.g., `Birthday`)
     - `age` — Show age (for birthdays)
     - `col` — Grid view (medium/large)
     - `pg1`, `pg2`, ... — Page for grid view

   **Examples:**
   - `since,work anniversary`
   - `mode=since.circular.gym`
   - `since.weeks.habit`
   - `countdown,3`
   - `col,pg2`
   - `mode=since.rectangular.birthday`
   - `topbar,5`

3. **Add the Widget**
   - Add a Scriptable widget to your Home Screen or Lock Screen.
   - Select the `NotionCountdowns.js` script.
   - Set the widget parameter as desired.

## Lock Screen Support

- **Inline/Top Bar**: Shows a single event in a compact format.
- **Circular**: Circular countdown or since display.
- **Rectangular**: More detailed event info.


## Troubleshooting

- Make sure your Notion integration is shared with your database.
- Double-check your token and database ID.
- If no events appear, verify your Notion property names match those in the script's `NOTION_PROPERTY_MAP`.


> **Placeholder for widget screenshots**

For more advanced configuration, see the comments at the top of the script.

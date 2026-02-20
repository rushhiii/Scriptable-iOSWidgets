# 🧭 Countdown Widget v2

![Scriptable](https://img.shields.io/badge/Scriptable-Compatible-purple)
![Widget Size](https://img.shields.io/badge/Supports-Small%2C%20Medium%2C%20Large-blue)
![Data Source](https://img.shields.io/badge/Data-Google%20Sheet%20Web%20App-brightgreen)
![Notion](https://img.shields.io/badge/Notion-Database-black)
![Sync](https://img.shields.io/badge/Sync-Addsync-lightgrey)
![Customization](https://img.shields.io/badge/Configurable-Color%20%2B%20Icon%20%2B%20Age%20%2B%20Pages-orange)
![Offline Support](https://img.shields.io/badge/Fallback-Offline%20Cache%20%2B%20Auto%20Sync-lightgrey)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)
![Last Updated](https://img.shields.io/badge/Updated-Feb%202026-yellow)


![countdown widget v2 Banner](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/countdown/countdown_v2_showcase.png)

### Birthdays & Events Tracker
A Scriptable widget powered by a Notion → Google Sheets → Google Calendar pipeline, with a lightweight JSON feed for the widget UI.



## Table of content

- [What you get](#what-you-get)
- [Who this is](#who-this-is)
- [Quick start](#quick-start)
- [Widget size behavior](#widget-size-behavior)
- [Data flow (overview)](#data-flow-overview)
- [Notion template & dashboard](#notion-template--dashboard)
- [Troubleshooting](#troubleshooting)
- [Want a Simpler Notion-Only Version?](#want-a-simpler-notion-only-version)


## What you get

- **Small widget**: next upcoming event with date + countdown
- **Medium widget**: top 3 upcoming events
- **Large widget**: top 6 upcoming events
- iOS notifications handled by Google Calendar and/or Notion Calendar
- Note: if you don’t want notifications from multiple apps, pick a single source. You can keep Google Calendar connected for syncing, but turn off its notifications in the Google Calendar settings to avoid duplicate alerts. If you prefer Notion Calendar or iOS Calendar alerts, leave those on and disable Google Calendar notifications.

## Who this is 

- **Developers**: want full automation and timezone-aware reminders
- **Non‑developers**: can edit Notion and let automation handle the rest


## Quick start

### 1) Prepare your data source

You need a Notion database synced into Google Sheets. Required columns in the sheet tab:

Don’t stress about building it from scratch — just duplicate the provided Notion template and you’re ready to go.

If you don’t already have a Google Sheet, create one (e.g., **Countdowns**) and add a tab named **Main**. You can use a different tab name, but the scripts expect `Main` unless you change the config.

- Event Name
- Event Date
- Widget Emoji
- Widget Clr

### 1.1) Sync Notion ↔ Google Sheets (Addsync)

Use the Addsync extension to connect Notion and Google Sheets.

After selecting your data source and destination, make sure you choose the correct options in Addsync (e.g., enable/disable sync back based on your preference).

**Mapping (fields to select)**
- Event Name
- Event Date
- Event Type
- Owner Timezone
- All Day?
- Exact Local Time
- Relative Reminders
- Notes 
- Active?
- Widget Emoji
- Widget Clr

**One‑way sync (Notion → Sheets)**
1. Create a new Addsync connection.
2. Choose your Notion database as the source.
3. Choose your Google Sheet tab as the destination.
4. Disable “Sync back” (or equivalent) so edits in Sheets don’t write to Notion.

**Two‑way sync (Notion ↔ Sheets)**
1. Create a new Addsync connection.
2. Choose the Notion database and Google Sheet tab.
3. Enable “Sync back” so changes in Sheets can update Notion.
4. Map fields so all required columns stay aligned.

Tip: Start with one‑way sync for stability, then enable two‑way once your schema is final.

### 2) Set up the Apps Script web app

1. Open your Google Sheet → Extensions → Apps Script.
2. Paste **Code.gs** (JSON feed) and the event sync scripts:
	- **event_sync.gs**
	- **build_events_only.gs**
	- **build_reminders_only.gs**
	- **cleanup_events.gs** (optional)
3. Deploy **Code.gs** as a Web App (Execute as: Me, Access: Anyone with the link).
4. Copy the Web App URL.

### 3) Configure the widget

In your Scriptable script:

- Set `SHEET_API_URL` to the Web App URL.
	- Get it from Apps Script → Deploy → Manage deployments → Web app URL.
- Keep `HARDCODED_SHEET` and `HARDCODED_SPREADSHEET_ID` as needed.
	- Spreadsheet ID: from the Sheets URL between `/d/` and `/edit`.
	- Sheet ID (gid): from the Sheets URL after `gid=`.

### 4) Add the widget on iOS

- Add a Scriptable widget to the Home Screen.
- Choose this script.
- Pick Small, Medium, or Large.


## Widget size behavior

- **Small**: 1 upcoming event
- **Medium**: 3 upcoming events
- **Large**: 6 upcoming events

The widget sorts by next upcoming date and shows countdowns.

## Data flow (overview)

Notion → Google Sheets → Apps Script → Google Calendar → Scriptable Widget

- Notion is the source of truth
- Sheets holds data synced from Notion
- Apps Script creates calendar events/reminders and serves JSON
- Scriptable reads JSON and renders the widget


## Notion template & dashboard

![Notion dashboard](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/countdown/notion-dashboard.png)

_Template Link—_ [Birthday & Event Tracker Dashboard [Template]](https://lavish-nasturtium-67d.notion.site/Birthday-Event-Tracker-Template-2fc92758f55a8050a0f4c0207b5eeda5?source=copy_link)


## Troubleshooting

- **Widget shows no data**: verify the Web App URL and that the sheet tab matches `HARDCODED_SHEET`.
- **Dates look wrong**: ensure the feed returns dates in `YYYY-MM-DD` and your Scriptable script parses them.
- **Colors missing**: check `Widget Clr` column values (hex like #2980b9).

## Want a Simpler Notion-Only Version?

If you **don’t want Google Calendar reminders or notification integration**, you can use a much simpler version of the script that connects **directly to the Notion API**. This version fetches your events straight from Notion, with no Google Sheets or Apps Script required.

- **No Google Calendar or Sheets needed**
- **Direct Notion API integration**
- **Faster setup for Notion users**

See the [Notion API Quickstart Guide](./NOTION_API_GUIDE.md) for:
- How to set up a free Notion developer integration/token
- How to get your Notion database ID (data source ID)
- How to use the Notion-only Scriptable script

_This is perfect if you only want to manage events in Notion and don’t need advanced notification/reminder features._
---
id: countdown-widget
# title: Countdown Widget
# sidebar_label: Countdown Widget
---
## Countdown Widget
![Scriptable](https://img.shields.io/badge/Scriptable-Compatible-purple)
![Widget Size](https://img.shields.io/badge/Supports-Small%2C%20Medium%2C%20Large-blue)
![Data Source](https://img.shields.io/badge/Data-Google%20Sheet%20Web%20App-brightgreen)
![Customization](https://img.shields.io/badge/Configurable-Color%20%2B%20Icon%20%2B%20Age%20%2B%20Pages-orange)
![Offline Support](https://img.shields.io/badge/Fallback-Offline%20Cache%20%2B%20Auto%20Sync-lightgrey)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)
![Last Updated](https://img.shields.io/badge/Updated-June%202025-yellow)

![countdown widget](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/countdown/countdow_showcase.png)

A lightweight and customizable countdown widget built using the [Scriptable app](https://scriptable.app), powered by Google Sheets. It helps you track upcoming events like birthdays, anniversaries, or deadlines—right from your iOS home screen.

> **Mention:** Minimal design widget
> https://jvscholz.com/blog/countdown.html
> if the links dosent work look in the [backup](https://github.com/rushhiii/Scriptable-IOSWidgets/tree/main/.assets/backups) foolder

## ✨ Features

* 🗓️ **Dynamic Countdown**: Displays days remaining to an event.
* 🎂 **Age Display**: Automatically shows age or anniversary years.
* 📅 **Google Sheets Integration**: Events loaded from your own sheet.
* 🎨 **Color Customization**: Assign vibrant colors and icons per event.
* ⚙️ **Flexible Layouts**: Adaptable to different widget sizes and views.

## 🚀 How It Works

The widget fetches events from a Google Sheets Web App link and automatically displays the nearest upcoming event(s). Depending on widget size and provided parameters, it can show:

* A **single event** (Small widget)
* A **grid of events** (use `col` parameter)
* A **list of upcoming events** (default for Medium and Large widgets)

## 🔧 Setup

### 1. Prepare Google Sheets

Create a sheet like this:

| name | date       | icon | color   |
| ---- | ---------- | ---- | ------- |
| Mom  | 2003-09-25 | 🎂   | #2980b9 |
| Dad  | 1975-07-01 | 🎂   | #F79F39 |

> Ensure dates are formatted as `YYYY-MM-DD`.

### 2. Turn Sheet into Web App

1. Go to **Extensions > Apps Script**.
2. Paste this code:

```js
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const events = [];
  for (let i = 1; i < data.length; i++) {
    const [name, date, icon = "🗓️", color = ""] = data[i];
    if (!name || !date) continue;
    let formattedDate = date instanceof Date
      ? Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd")
      : date;
    let event = { name, date: formattedDate, icon };
    if (color) event.color = color;
    events.push(event);
  }
  return ContentService.createTextOutput(JSON.stringify(events))
      .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Deploy > New Deployment**
4. Select type **Web app**
5. Set access to **Anyone**
6. Click **Deploy**, then copy the **Web App URL**

### 3. Link Scriptable Script

In your `countdown.js` file, update:

```js
const SHEET_API_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
```

Then save the script in Scriptable.

### 4. Load Repeat Icon

If you see a ❗ warning or square character instead of the **repeat icon**, it's likely because the required icon font isn't available. To fix this:

1. **Download the `repeat.png` icon** from the repository’s `assets` folder (or use your own).
2. Save it inside your `iCloud Drive > Scriptable > .assets` folder.
3. Ensure the file is named exactly: `repeat.png`
4. The widget will automatically load this icon when it detects a recurring event.

> 🔧 Tip: You can replace `repeat.png` with any custom icon (e.g., circular arrows) — just make sure it’s 60x60 px and in PNG format.


### 5. Add Widget

1. **Download** the [Scriptable app](https://apps.apple.com/in/app/scriptable/id1405459188) from the App Store.
2. **Option A – Upload Method**

   * **Download** the [`CountdownWidget.js`](./Countdown.js) script from this repository.
   * Move it into the `Scriptable` folder in your **iCloud Drive** (this folder is created automatically after installing the Scriptable app).
3. **Option B – Manual Method**

   * Open the Scriptable app.
   * Tap the **+** icon to create a new script.
   * **Copy and paste** the script content from this repo manually.
   * Name the script however you'd like (e.g., `Countdown Widget`).
4. Long-press anywhere on your iOS Home Screen to enter "jiggle mode", tap the **+** button on the top-left, and scroll to add a **Scriptable** widget.
5. Choose the desired **widget size** (Small/Medium/Large) and tap **\[+ Add Widget]**.
6. Long-press the newly added widget, tap **Edit Widget ⓘ**, and configure the **script and parameter values** as described [see below](#️-configure-parameters).

## ⚙️ Configure Parameters

Use the following options when editing the widget:

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Defaults</th>
      <th>Change to</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Script</td>
      <td>Choose</td>
      <td>Widget Name (e.g., Countdown Widget)</td>
    </tr>
    <tr>
      <td>While Interacting (optional)</td>
      <td>Open App</td>
      <td>Run Script</td>
    </tr>
    <tr>
      <td>Parameters</td>
      <td>Text</td>
      <td>
        <ul>
          <li>For e.g., <code>age</code>, <code>2</code>, <code>john,age</code>, <code>col</code></li>
          <li><a href="#note">Read below</a> for more instructions</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

> _Here's a Screenshot of widget's config panal_

![countdown_config_panal.png](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/countdown/countdown_config_panal.PNG)



<b>Widget Parameter Notes:</b>
<ul><li><b>col</b> parameter works <b>only for Medium and Large</b> widgets.<ul><li><b>Medium widget</b> shows top <b>4</b> events.</li><li><b>Large widget</b> shows top <b>10</b> events.</li></ul></li><li>If no <b>col</b> is used, widget defaults to <b>list view</b>:<ul><li><b>Medium:</b> top <b>3</b> events.</li><li><b>Large:</b> top <b>7</b> events.</li></ul></li></ul>
<b>In small widgets:</b>
<ul><li>Type any name from your Google Sheet (e.g., <code>mom</code>, <code>dad</code>) to show that person's event.</li><li>If the emoji is 🎂, it will automatically append <code>'s Birthday</code>.</li><li>If it's 🥂, it appends <code>'s Anniversary</code>.</li><li>It only supports these two emojis, but you can always add more to your liking by updating the <code>titleSuffixes</code> array.</li><li>You can also use numeric indexes (e.g., <code>1</code>, <code>2</code>) to select an upcoming event by position.</li><li>Default is the <b>most upcoming event</b>.</li><li>Using <code>age</code> shows the years passed since the event date — useful for birthdays or anniversaries. If today is the event date, countdown is hidden and only age is shown.</li></ul>
<b>Pagination (<code>pg</code>):</b>
<ul><li>Use <code>pg1</code>, <code>pg2</code>, <code>pg3</code>, etc., to display <b>multiple pages</b> of events.<ul><li>In <b>list view</b> (default):<ul><li><b>Medium widget</b>: each page displays <b>3 events</b>.</li><li><b>Large widget</b>: each page displays <b>7 events</b>.</li></ul></li><li>In <b>grid view</b> (<code>col</code>):<ul><li><b>Medium widget</b>: each page displays <b>4 events</b>.</li><li><b>Large widget</b>: each page displays <b>10 events</b>.</li></ul></li><li>Example:<ul><li><code>pg2</code>: shows the second page of events.</li><li><code>col,pg3</code>: shows the third page of events in grid view.</li></ul></li></ul></li></ul>
<b>Offline Fallback & Regular Sync:</b>
<ul><li>Events are automatically cached locally in the <code>.cache</code> folder.</li><li>Widget gracefully <b>falls back to cached data</b> when offline.</li><li>Data automatically updates daily at <b>2:00 AM</b>.</li></ul>

## 📷 Screenshots

> _Small Widgets_ 

| Default View | Age View |
|:--:|:--:|
| <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/countdown/countdown_s.PNG" width="160"/> | <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/countdown/countdown_age_s.PNG" width="160"/> |
| <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/countdown/countdown_bday_s.PNG" width="160"/> | <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/countdown/countdown_1_s.PNG" width="160"/> |

> _Medium Widgets_

| List View | Grid View |
|:--:|:--:|
| ![Countdown Medium List](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/countdown/countdown_m.PNG) | ![Countdown Medium Grid](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/countdown/countdown_col_m.PNG) |


> _Large Widgets_

| List View | Grid View |
|:--:|:--:|
| ![Countdown Large List](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/countdown/countdown_l.PNG) | ![Countdown Large Grid](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/countdown/countdown_col_l.png) |


## 🙌 Feedback

Have feature ideas or issues? DM me on [Instagram](https://www.instagram.com/the.tirth12) or email me at [rushiofficial1205@gmail.com](mailto:rushiofficial1205@gmail.com).

Widgets shouldn’t be limited to timers—I’d love to build tools that help you passively learn, reflect, or stay organized. If you have a unique concept in mind, I’d love to collaborate.

## 📜 License

This project is licensed under the **MIT License**.

Feel free to fork, build upon, and remix with attribution.

##

> **Enjoy using this widget ~ RP**
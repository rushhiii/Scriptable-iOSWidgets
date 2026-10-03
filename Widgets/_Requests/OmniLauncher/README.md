# OmniLauncher for Scriptable

OmniLauncher is a Scriptable utility for importing and running small local HTML applications and native Scriptable JavaScript projects from one menu.

## Limitations First

- Scriptable does not provide a dependable built-in ZIP extraction API. A downloaded ZIP must be extracted with the iOS Files app before the project can be configured.
- This is a launcher utility, not a Home Screen widget. Open it from Scriptable to manage and run projects.
- HTML projects run in a local WebView. Server-side code, Node.js APIs, browser extensions, and remote filesystem APIs are not available.
- Native JavaScript projects execute inside Scriptable and must be trusted. A project can access the Scriptable environment and files available to it.
- Project state is stored locally in iCloud under `OmniLauncher_Storage` and `OmniLauncher_Saves`; it is not a real-time multi-device database.
- WebView persistence is polled periodically. A change made immediately before closing a project may not be saved if the polling cycle has not completed.
- The launcher currently supports one configured entry file per project.
- GitHub downloads currently fetch the repository ZIP; updating an already extracted project requires replacing its files manually.

## Installation

1. Copy `OmniLauncher.js` into the Scriptable iCloud Scripts folder.
2. Open Scriptable.
3. Run `OmniLauncher.js`.
4. Allow access to Files or iCloud when iOS asks.

The launcher creates these folders automatically:

```text
OmniLauncher_Storage/
OmniLauncher_Saves/
```

Each project gets its own folder and configuration file:

```text
OmniLauncher_Storage/<project>/config.json
OmniLauncher_Saves/<project>/auto.json
```

## Import A Local Project

1. Run OmniLauncher.
2. Tap **Import local**.
3. Choose a project folder or file from the document picker.
4. Select the entry file when prompted.
5. Tap **Run** beside the project.

Supported entry files include common names such as:

```text
index.html
main.html
app.html
index.js
main.js
app.js
run.js
```

The entry-file picker also shows other `.html`, `.htm`, and `.js` files.

## Import A GitHub Project

1. Run OmniLauncher.
2. Tap **Download URL**.
3. Paste a GitHub repository URL, for example:

```text
https://github.com/example/project
```

4. Enter a project name.
5. OmniLauncher downloads the repository ZIP into that project folder.
6. Open the Files app and extract the ZIP into the project folder.
7. Reopen OmniLauncher.
8. Open **Settings**, choose **Choose entry file**, and select the project entry file.
9. Tap **Run**.

Direct `.zip` URLs are also accepted.

## Project Types

### HTML projects

HTML projects run in a local Scriptable WebView. OmniLauncher adds:

- Local `localStorage` persistence backed by `auto.json`
- Safe-area padding for notches and home indicators
- A basic iOS form-size fix for inputs, textareas, and selects
- Optional fullscreen or sheet presentation

A web app can use ordinary browser storage APIs:

```javascript
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");
```

Changes are written back to the project save file while the WebView is open.

### Native Scriptable JavaScript

Native projects run inside Scriptable. OmniLauncher provides a small project API:

```javascript
const settings = Omni.DB.read("auto.json");
settings.lastOpened = new Date().toISOString();
Omni.DB.write(settings, "auto.json");

console.log(Omni.projectDir);
```

Named slots are supported:

```javascript
Omni.DB.write({ completed: true }, "backup.json");
const backup = Omni.DB.read("backup.json");
```

## Settings

Each project has a settings menu with:

- Choose a different entry file
- Rename the display name
- Switch WebView fullscreen or sheet mode
- Delete the project and its saved data

Projects without a valid entry file are highlighted as needing setup.

## Storage And Privacy

Project files and saved data are stored in iCloud Drive through Scriptable. Imported projects are code, so only import projects you trust. The launcher does not upload local projects unless you explicitly use the download action.

## Troubleshooting

### No files appear during setup

Make sure the project was extracted and contains at least one `.html`, `.htm`, or `.js` file. Hidden folders and common build folders are ignored.

### The downloaded project cannot be configured

Extract the ZIP in the Files app first, then reopen OmniLauncher and choose the entry file from Settings.

### HTML state is not saved

Keep the WebView open for at least one polling cycle after changing data. The launcher checks for changes approximately every 1.5 seconds.

### A native project fails

Run the project directly in Scriptable first. Confirm it does not depend on Node.js modules or unavailable browser globals. Check the Scriptable console for the error.

### The app opens in the wrong presentation mode

Open the project Settings and toggle the WebView presentation mode between fullscreen and sheet.

## Files

- `OmniLauncher.js`: launcher implementation
- `OmniLauncher_GUIDE.md`: this guide
- `OmniLauncher_ISSUE_27_REPORT.md`: GitHub issue report

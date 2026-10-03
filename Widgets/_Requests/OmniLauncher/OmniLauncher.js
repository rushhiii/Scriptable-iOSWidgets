// Variables used by Scriptable.
// icon-color: blue; icon-glyph: rocket;
// OmniLauncher: import and run local HTML or Scriptable JavaScript projects.

const ROOT_NAME = "OmniLauncher_Storage";
const SAVES_NAME = "OmniLauncher_Saves";
const CONFIG_NAME = "config.json";
const ZIP_NAME = "source.zip";
const BLACKLIST = [".git", "node_modules", ".DS_Store", "__MACOSX", ".cache", "_omni_run.html"];
const ENTRY_NAMES = ["index.html", "main.html", "app.html", "start.html", "home.html", "index.js", "main.js", "app.js", "start.js", "run.js"];

const COLORS = {
  background: new Color("#f2f2f7"),
  panel: new Color("#ffffff"),
  text: new Color("#111111"),
  muted: new Color("#6e6e73"),
  accent: new Color("#007aff"),
  warning: new Color("#fff3cd")
};

class Store {
  constructor() {
    this.fm = FileManager.iCloud();
    this.documents = this.fm.documentsDirectory();
    this.root = this.fm.joinPath(this.documents, ROOT_NAME);
    this.saves = this.fm.joinPath(this.documents, SAVES_NAME);
  }

  boot() {
    if (!this.fm.fileExists(this.root)) this.fm.createDirectory(this.root, true);
    if (!this.fm.fileExists(this.saves)) this.fm.createDirectory(this.saves, true);
  }

  projectPath(name) {
    return this.fm.joinPath(this.root, name);
  }

  savePath(name) {
    return this.fm.joinPath(this.saves, name);
  }

  ensureProject(name) {
    const path = this.projectPath(name);
    if (!this.fm.fileExists(path)) this.fm.createDirectory(path, true);
    const saves = this.savePath(name);
    if (!this.fm.fileExists(saves)) this.fm.createDirectory(saves, true);
    return path;
  }

  projects() {
    return this.fm.listContents(this.root)
      .filter(name => this.fm.isDirectory(this.projectPath(name)))
      .sort((a, b) => a.localeCompare(b));
  }

  loadConfig(name) {
    const path = this.fm.joinPath(this.ensureProject(name), CONFIG_NAME);
    if (!this.fm.fileExists(path)) return {};
    try {
      return JSON.parse(this.fm.readString(path) || "{}");
    } catch (_) {
      return {};
    }
  }

  saveConfig(name, config) {
    const path = this.fm.joinPath(this.ensureProject(name), CONFIG_NAME);
    this.fm.writeString(path, JSON.stringify(config, null, 2));
  }

  saveData(name, data, slot = "auto.json") {
    const path = this.fm.joinPath(this.savePath(name), slot);
    this.fm.writeString(path, JSON.stringify(data));
  }

  loadData(name, slot = "auto.json") {
    const path = this.fm.joinPath(this.savePath(name), slot);
    if (!this.fm.fileExists(path)) return {};
    try {
      return JSON.parse(this.fm.readString(path) || "{}");
    } catch (_) {
      return {};
    }
  }

  removeProject(name) {
    const project = this.projectPath(name);
    const saves = this.savePath(name);
    if (this.fm.fileExists(project)) this.fm.remove(project);
    if (this.fm.fileExists(saves)) this.fm.remove(saves);
  }

  listFiles(path, base = path, output = []) {
    for (const name of this.fm.listContents(path)) {
      if (BLACKLIST.includes(name) || name.startsWith(".")) continue;
      const full = this.fm.joinPath(path, name);
      if (this.fm.isDirectory(full)) {
        this.listFiles(full, base, output);
      } else {
        output.push(full.substring(base.length + 1));
      }
    }
    return output;
  }

  copyTree(source, destination) {
    if (!this.fm.fileExists(destination)) this.fm.createDirectory(destination, true);
    for (const name of this.fm.listContents(source)) {
      if (BLACKLIST.includes(name) || name.startsWith(".")) continue;
      const from = this.fm.joinPath(source, name);
      const to = this.fm.joinPath(destination, name);
      if (this.fm.isDirectory(from)) {
        this.copyTree(from, to);
      } else {
        this.fm.copy(from, to);
      }
    }
  }
}

function projectNameFromPath(path) {
  const name = path.split("/").filter(Boolean).pop() || "project";
  return name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 40) || "project";
}

function resolveGitHubUrl(value) {
  const clean = value.trim().replace(/\/$/, "").replace(/\.git$/, "");
  if (/github\.com\//i.test(clean) && !/\/archive\//i.test(clean)) {
    return `${clean}/archive/refs/heads/main.zip`;
  }
  return clean;
}

async function promptText(title, placeholder, initial = "") {
  const alert = new Alert();
  alert.title = title;
  alert.addTextField(placeholder, initial);
  alert.addAction("Save");
  alert.addCancelAction("Cancel");
  if (await alert.present() < 0) return null;
  return alert.textFieldValue(0).trim();
}

async function chooseEntry(store, projectName) {
  const files = store.listFiles(store.projectPath(projectName))
    .filter(file => /\.(html?|js)$/i.test(file));
  files.sort((a, b) => {
    const aRank = ENTRY_NAMES.includes(a.toLowerCase()) ? 0 : 1;
    const bRank = ENTRY_NAMES.includes(b.toLowerCase()) ? 0 : 1;
    return aRank - bRank || a.localeCompare(b);
  });
  if (!files.length) return null;

  const alert = new Alert();
  alert.title = "Choose entry file";
  files.slice(0, 24).forEach(file => alert.addAction(file));
  alert.addCancelAction("Cancel");
  const index = await alert.present();
  return index < 0 ? null : files[index];
}

async function configureProject(store, projectName) {
  const entryPoint = await chooseEntry(store, projectName);
  if (!entryPoint) {
    await showMessage("No entry file", "No HTML or JavaScript files were found in this project.");
    return false;
  }
  const config = store.loadConfig(projectName);
  config.displayName = config.displayName || projectName;
  config.entryPoint = entryPoint;
  config.type = /\.html?$/i.test(entryPoint) ? "webApp" : "nativeJS";
  config.displayMode = config.displayMode || "fullscreen";
  config.autoFit = config.autoFit !== false;
  config.uiDaemon = config.uiDaemon !== false;
  config.omniUI = config.omniUI !== false;
  store.saveConfig(projectName, config);
  return true;
}

async function importLocal(store) {
  let selected;
  try {
    selected = await DocumentPicker.open();
  } catch (_) {
    return null;
  }
  if (!selected?.length) return null;

  const source = selected[0];
  const projectName = projectNameFromPath(source);
  const destination = store.ensureProject(projectName);
  try {
    if (store.fm.isDirectory(source)) {
      store.copyTree(source, destination);
    } else {
      store.fm.copy(source, store.fm.joinPath(destination, source.split("/").pop()));
    }
    await configureProject(store, projectName);
    return projectName;
  } catch (error) {
    await showMessage("Import failed", error.message);
    return null;
  }
}

async function importRemote(store) {
  const sourceUrl = await promptText("Download project", "GitHub URL or ZIP URL");
  if (!sourceUrl) return null;
  const name = await promptText("Project name", "Name", projectNameFromPath(sourceUrl));
  if (!name) return null;

  try {
    const request = new Request(resolveGitHubUrl(sourceUrl));
    request.timeoutInterval = 90;
    const data = await request.load();
    const destination = store.ensureProject(name);
    store.fm.write(store.fm.joinPath(destination, ZIP_NAME), data);
    await showMessage(
      "ZIP downloaded",
      "Scriptable cannot reliably extract ZIP files itself. Open Files, extract the ZIP into this project folder, then reopen OmniLauncher and configure the entry file."
    );
    return name;
  } catch (error) {
    await showMessage("Download failed", error.message);
    return null;
  }
}

function webInjection(savedData, config) {
  const data = JSON.stringify(savedData).replace(/<\//g, "<\\/");
  let injection = `<script>(function(){var d=${data};var dirty=false;var db={getItem:function(k){return Object.prototype.hasOwnProperty.call(d,k)?String(d[k]):null},setItem:function(k,v){d[k]=String(v);dirty=true},removeItem:function(k){delete d[k];dirty=true},clear:function(){d={};dirty=true}};Object.defineProperty(window,'localStorage',{value:db,configurable:true});window.__OMNI_SYNC=function(){var out=dirty?JSON.stringify(d):null;dirty=false;return out}})();</script>`;
  if (config.autoFit !== false) {
    injection += `<style>body{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);padding-left:env(safe-area-inset-left,0px);padding-right:env(safe-area-inset-right,0px)}</style>`;
  }
  if (config.uiDaemon !== false) {
    injection += `<style>input,textarea,select{font-size:16px!important}html,body{-webkit-overflow-scrolling:touch}</style>`;
  }
  return injection;
}

function injectIntoHead(html, content) {
  if (/<head[^>]*>/i.test(html)) return html.replace(/(<head[^>]*>)/i, `$1\n${content}`);
  return `<head>${content}</head>${html}`;
}

async function runWebProject(store, projectName, config) {
  const projectPath = store.projectPath(projectName);
  const entryPath = store.fm.joinPath(projectPath, config.entryPoint);
  const html = store.fm.readString(entryPath);
  const sandboxPath = store.fm.joinPath(projectPath, "_omni_run.html");
  store.fm.writeString(sandboxPath, injectIntoHead(html, webInjection(store.loadData(projectName), config)));

  const webView = new WebView();
  await webView.loadURL(`file://${sandboxPath}`);
  let running = true;
  const poll = async () => {
    while (running) {
      await new Promise(resolve => Timer.schedule(1500, false, resolve));
      if (!running) break;
      try {
        const raw = await webView.evaluateJavaScript("window.__OMNI_SYNC && window.__OMNI_SYNC()");
        if (raw) store.saveData(projectName, JSON.parse(raw));
      } catch (_) {
        running = false;
      }
    }
  };
  poll();
  await webView.present(config.displayMode !== "sheet");
  running = false;
}

async function runNativeProject(store, projectName, config) {
  const path = store.fm.joinPath(store.projectPath(projectName), config.entryPoint);
  const code = store.fm.readString(path);
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  globalThis.Omni = {
    DB: {
      read: slot => store.loadData(projectName, slot),
      write: (data, slot = "auto.json") => store.saveData(projectName, data, slot)
    },
    projectDir: store.projectPath(projectName)
  };
  await new AsyncFunction(code)();
}

async function runProject(store, projectName) {
  const config = store.loadConfig(projectName);
  if (!config.entryPoint) {
    await configureProject(store, projectName);
    return;
  }
  try {
    if (config.type === "webApp") await runWebProject(store, projectName, config);
    else await runNativeProject(store, projectName, config);
  } catch (error) {
    await showMessage("Project error", error.message);
  }
}

async function showMessage(title, message) {
  const alert = new Alert();
  alert.title = title;
  alert.message = message;
  alert.addAction("OK");
  await alert.present();
}

async function settingsMenu(store, projectName, refresh) {
  const config = store.loadConfig(projectName);
  const alert = new Alert();
  alert.title = config.displayName || projectName;
  alert.addAction("Choose entry file");
  alert.addAction("Rename display name");
  alert.addAction("Toggle WebView full screen");
  alert.addDestructiveAction("Delete project");
  alert.addCancelAction("Cancel");
  const choice = await alert.present();

  if (choice === 0) {
    await configureProject(store, projectName);
  } else if (choice === 1) {
    const name = await promptText("Display name", "Name", config.displayName || projectName);
    if (name) {
      config.displayName = name;
      store.saveConfig(projectName, config);
    }
  } else if (choice === 2) {
    config.displayMode = config.displayMode === "sheet" ? "fullscreen" : "sheet";
    store.saveConfig(projectName, config);
  } else if (choice === 3) {
    store.removeProject(projectName);
  }
  await refresh();
}

async function render(store, table) {
  table.removeAllRows();
  const header = new UITableRow();
  header.height = 60;
  header.backgroundColor = COLORS.background;
  const title = header.addText("OmniLauncher", "HTML and Scriptable project launcher");
  title.titleColor = COLORS.accent;
  title.titleFont = Font.boldSystemFont(22);
  title.subtitleColor = COLORS.muted;
  table.addRow(header);

  const projects = store.projects();
  for (const projectName of projects) {
    const config = store.loadConfig(projectName);
    const row = new UITableRow();
    row.height = 66;
    row.backgroundColor = config.entryPoint ? COLORS.panel : COLORS.warning;
    const info = row.addText(config.displayName || projectName, config.entryPoint || "Needs setup");
    info.widthWeight = 60;
    info.titleColor = COLORS.text;
    info.subtitleColor = COLORS.muted;

    const run = row.addButton("Run");
    run.widthWeight = 18;
    run.onTap = async () => runProject(store, projectName);

    const settings = row.addButton("Settings");
    settings.widthWeight = 22;
    settings.onTap = async () => settingsMenu(store, projectName, () => render(store, table));
    table.addRow(row);
  }

  const actions = new UITableRow();
  actions.height = 58;
  const local = actions.addButton("Import local");
  local.onTap = async () => { await importLocal(store); await render(store, table); };
  const remote = actions.addButton("Download URL");
  remote.onTap = async () => { await importRemote(store); await render(store, table); };
  table.addRow(actions);

  const footer = new UITableRow();
  footer.height = 28;
  const status = footer.addText(`${projects.length} project${projects.length === 1 ? "" : "s"}`);
  status.titleColor = COLORS.muted;
  status.centerAligned();
  table.addRow(footer);
}

async function main() {
  const store = new Store();
  store.boot();
  const table = new UITable();
  table.showSeparators = true;
  await render(store, table);
  await table.present(true);
}

main();

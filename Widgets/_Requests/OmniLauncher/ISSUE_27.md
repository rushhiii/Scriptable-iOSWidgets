# OmniLauncher Implementation Report

## Related Issue

GitHub issue: **Feature: html support #27**

Proposal: add support for viewing local HTML files in Scriptable without a server, based on the OmniLauncher prototype.

## Summary

The proposal is valuable because Scriptable can act as a lightweight local runtime for HTML applications. The implementation in `OmniLauncher.js` turns that idea into a project manager rather than only a one-off HTML viewer.

The launcher can manage multiple projects, choose an entry file, run local HTML in a WebView, and run native Scriptable JavaScript projects from the same interface.

## What Was Implemented

### Project management

- Creates a dedicated `OmniLauncher_Storage` directory.
- Creates a separate project directory for each imported project.
- Stores per-project configuration in `config.json`.
- Displays configured and unconfigured projects in a `UITable` interface.
- Supports renaming and deleting projects.

### Import workflow

- Imports local files or folders through `DocumentPicker`.
- Downloads GitHub repositories and direct ZIP URLs.
- Resolves ordinary GitHub repository URLs to the `main` branch archive URL.
- Lets the user choose an HTML or JavaScript entry file after import.

### HTML runtime

- Runs local HTML files directly in Scriptable `WebView` without a server.
- Supports fullscreen and sheet presentation.
- Injects safe-area padding for modern iPhone layouts.
- Applies an iOS-friendly form control font size.
- Provides a persistent `localStorage` bridge backed by the project save file.
- Polls the WebView for changed storage and saves it to iCloud.

### Native Scriptable runtime

- Executes a selected JavaScript entry file inside Scriptable.
- Provides a small project storage API:

```javascript
Omni.DB.read("auto.json");
Omni.DB.write(data, "auto.json");
Omni.projectDir;
```

- Supports named save slots for project state.

## Improvements Over A Basic Prototype

The implementation adds a usable management layer around local HTML support:

- Multiple projects instead of one hard-coded path.
- Entry-file discovery instead of a fixed filename.
- Native Scriptable project support alongside HTML projects.
- Per-project configuration and persistent state.
- A visible setup state for projects that still need configuration.
- Import from local storage and GitHub/ZIP URLs.
- Fullscreen or sheet presentation choices.
- Safe-area and form-control handling for iOS WebView behavior.
- A documented storage contract for projects.

## Current Limitations

These are intentional constraints of the current Scriptable implementation:

1. Scriptable does not expose a dependable ZIP extraction API, so downloaded archives must be extracted with the Files app.
2. The runtime is local and has no Node.js, server process, or backend support.
3. HTML persistence is polled approximately every 1.5 seconds; a change immediately before closing may not be captured.
4. One entry file is configured per project.
5. Remote repository updates download a new archive but do not automatically replace an extracted project tree.
6. Native JavaScript runs with Scriptable privileges and should only be used with trusted projects.
7. This is an app-style Scriptable utility, not a widget rendered on the Home Screen.
8. The launcher does not yet provide a plugin/package system or dependency installation.

## Validation

The launcher was checked with:

```text
node --check OmniLauncher.js
```

The file parsed successfully and VS Code reported no diagnostics.

## Suggested Next Steps For The Repository

Before merging this as a repository feature, the project could decide between two scopes:

### Minimal HTML support

Add a small official Scriptable helper that opens one configured local HTML file in a WebView. This keeps the repository surface small and makes maintenance easier.

### Full OmniLauncher feature

Add the launcher as an optional utility with documentation, project storage conventions, import behavior, and security guidance. This gives users a complete workflow but introduces more code and a larger maintenance surface.

The current implementation is suitable as a prototype for the second option. The ZIP extraction limitation and native-code trust model should be documented prominently before release.
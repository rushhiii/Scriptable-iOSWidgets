# Contributing to Scriptable iOS Widgets

Thanks for taking the time to contribute.

This repository is focused on Scriptable widget scripts, widget docs, and supporting assets.

## Scope of this repository

- Primary scope: files under `Widgets/`, `.assets/`, and top-level docs like `README.md`.
- Secondary scope: docs-site updates are accepted only when they are directly related to widget documentation in this repository.

## Ways to contribute

- Fix a bug in an existing widget.
- Improve widget reliability, readability, or performance.
- Add a new widget.
- Improve docs, examples, screenshots, and setup steps.

## Before you open an issue or PR

- Check existing open issues and pull requests first.
- Reproduce the bug on the latest script version.
- Collect enough detail so others can reproduce quickly.

## Widget contribution checklist

When adding or changing a widget, please include:

- Widget source in the correct folder under `Widgets/`.
- A clear widget README in the same folder.
- Parameter and setup instructions.
- Any API requirements and expected data format.
- No hardcoded private tokens or credentials.
- At least one screenshot or visual reference when UI changes.

## Coding guidelines

- Keep scripts compatible with the Scriptable app runtime.
- Prefer clear variable names and small functions.
- Handle missing network data and API failures gracefully.
- Keep user-facing text and parameter names consistent.
- Avoid unrelated refactors in the same PR.

## Pull request guidelines

- Use a descriptive title.
- Explain what changed and why.
- List impacted widget(s).
- Include testing notes:
  - Widget sizes tested (small/medium/large)
  - iOS version tested
  - Scriptable version tested (if known)
- Add before/after screenshots for UI changes.

## Commit guidance

Use clear, scoped commit messages, for example:

- `fix(weather): handle missing sunrise data`
- `feat(countdown): add optional timezone override`
- `docs(quote-widget): clarify parameter format`

## Questions

If you are unsure whether a change fits this repo, open an issue first with a short proposal.

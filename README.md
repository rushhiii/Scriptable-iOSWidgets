# Scriptable iOS Widgets

<p align="center">
  <img alt="Scriptable iOS Widgets banner" width="100%" src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/scriptable_mockup_wall_filled.png" />
</p>

<p align="center">
  <img alt="Scriptable App" src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/badges/scriptableBadge.svg" />
  <img alt="iOS" src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/badges/iOS-badge.svg" />
  <img alt="Small Widget" src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/badges/small-widget-badge.svg" />
  <img alt="Medium Widget" src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/badges/medium-widget-badge.svg" />
  <img alt="Large Widget" src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/badges/large-widget-badge.svg" />
</p>

<p align="center">
  <a href="https://scriptablehub.vercel.app/docs"><img alt="Docs Live" src="https://img.shields.io/badge/Docs-Live-1f9d55?style=for-the-badge&logo=readme" /></a>
  <a href="https://github.com/rushhiii/Scriptable-IOSWidgets/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/rushhiii/Scriptable-IOSWidgets?style=for-the-badge&logo=github" /></a>
  <a href="https://github.com/rushhiii/Scriptable-IOSWidgets/network/members"><img alt="GitHub Forks" src="https://img.shields.io/github/forks/rushhiii/Scriptable-IOSWidgets?style=for-the-badge&logo=github" /></a>
  <a href="https://github.com/rushhiii/Scriptable-IOSWidgets/issues"><img alt="GitHub Issues" src="https://img.shields.io/github/issues/rushhiii/Scriptable-IOSWidgets?style=for-the-badge&logo=github" /></a>
  <a href="https://github.com/rushhiii/Scriptable-IOSWidgets/pulls"><img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/rushhiii/Scriptable-IOSWidgets?style=for-the-badge&logo=github" /></a>
</p>

<p align="center">
  <a href="https://github.com/rushhiii/Scriptable-IOSWidgets/commits/main"><img alt="Last Commit" src="https://img.shields.io/github/last-commit/rushhiii/Scriptable-IOSWidgets?style=for-the-badge&logo=git" /></a>
  <a href="https://github.com/rushhiii/Scriptable-IOSWidgets/graphs/commit-activity"><img alt="Commit Activity" src="https://img.shields.io/github/commit-activity/m/rushhiii/Scriptable-IOSWidgets?style=for-the-badge&logo=github" /></a>
  <a href="https://github.com/rushhiii/Scriptable-IOSWidgets/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/rushhiii/Scriptable-IOSWidgets?style=for-the-badge" /></a>
  <a href="https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/rushhiii/Scriptable-IOSWidgets?style=for-the-badge" /></a>
  <a href="https://github.com/rushhiii/Scriptable-IOSWidgets"><img alt="Repo Size" src="https://img.shields.io/github/repo-size/rushhiii/Scriptable-IOSWidgets?style=for-the-badge" /></a>
</p>

A curated collection of modern Scriptable widgets for iOS home screens.
The goal is simple: practical widgets that look good, stay fast, and are easy to customize.

- User-friendly setup for non-devs
- Deep customization for advanced users
- Full documentation site for installation, usage, and troubleshooting

## Why this repo?

- Covers daily utility use-cases: weather, AQI, countdowns, schedule, quotes, and dev stats.
- Includes both lightweight local modes and API-backed dynamic modes.
- Keeps widgets organized by folder, each with dedicated setup notes and screenshots.

## Live links

- Documentation: [scriptablehub.vercel.app/docs](https://scriptablehub.vercel.app/docs)
- Widgets docs index: [scriptablehub.vercel.app/docs/widgets](https://scriptablehub.vercel.app/docs/widgets)
- Changelog: [scriptablehub.vercel.app/docs/changelog](https://scriptablehub.vercel.app/docs/changelog)
- Shareable profile: [shareable.vercel.app/user/876239dd-7775-4992-af92-25528d41e8b9](https://shareable.vercel.app/user/876239dd-7775-4992-af92-25528d41e8b9)

## Widget lineup

| Widget | What it does | Sizes | Data source | Folder |
| --- | --- | --- | --- | --- |
| AQI + Temperature | Air quality + weather with adaptive themes | Small | OpenWeather | [Widgets/AQI Widget](./Widgets/AQI%20Widget) |
| Dynamic Weather | Current weather with gradient UI | Small, Medium, Large | OpenWeather | [Widgets/Weather Widget](./Widgets/Weather%20Widget) |
| Countdown | Event countdowns with pages/grid and offline cache | Small, Medium, Large | Google Sheets | [Widgets/Countdown Widget](./Widgets/Countdown%20Widget) |
| Countdown v2 | Notion to Sheets to Calendar automation pipeline | Small, Medium, Large | Notion + Google stack | [Widgets/Countdown Widget/v2](./Widgets/Countdown%20Widget/v2) |
| Birthday Life Progress | Age, days lived, and next-birthday ring | Small | Local parameter config | [Widgets/Birthday Widget](./Widgets/Birthday%20Widget) |
| Modular Time Progress | Day/week/month/year progress visualizations | Small, Medium, Large | Local time calculations | [Widgets/TimeProgress Widget](./Widgets/TimeProgress%20Widget) |
| Class Schedule Viewer | Daily/weekly class timeline with testing modes | Small, Medium, Large | Google Sheets CSV | [Widgets/Schedule Widget](./Widgets/Schedule%20Widget) |
| My Quotes | Category-based quote widget with style controls | Small, Medium, Large | Google Sheets or Notion | [Widgets/Quote Widget](./Widgets/Quote%20Widget) |
| GitHub Stats | Streaks, contributions, repo stats, heatmap themes | Small, Medium, Large | GitHub API | [Widgets/GitHubStats Widget](./Widgets/GitHubStats%20Widget) |
| Hindu Color Wear | Daily traditional color guidance and rationale | Small, Medium, Large | Local weekday logic | [Widgets/HinduClrWear Widget](./Widgets/HinduClrWear%20Widget) |
| Toyota | Toyota-focused widget currently in progress | TBD | TBD | [Widgets/Toyota Widget](./Widgets/Toyota%20Widget) |

## Quick start for users

1. Install [Scriptable](https://apps.apple.com/in/app/scriptable/id1405459188).
2. Pick a widget folder and copy its main JavaScript file into Scriptable.
3. Add a Scriptable widget on your home screen.
4. Set the script name in widget settings.
5. Set **When Interacting** to **Run Script** (recommended).
6. Add optional parameters from the widget README/docs page.

### Widget settings cheatsheet

| Setting | Value |
| --- | --- |
| Script | Selected widget script file |
| When Interacting | Run Script |
| Parameter | Optional per-widget config |

## Quick start for developers

The docs site is in [docs-site](./docs-site) and uses Next.js + Tailwind.

```bash
cd docs-site
npm install
npm run dev
npm run typecheck
npm run build
```

Local docs URL: [http://localhost:3000/docs](http://localhost:3000/docs)

## Project structure

- [Widgets](./Widgets): all widget scripts grouped by widget name
- [.assets](./.assets): screenshots, showcase images, and badge assets
- [docs-site](./docs-site): documentation website source
- [CONTRIBUTING.md](./CONTRIBUTING.md): contribution process
- [SECURITY.md](./SECURITY.md): vulnerability reporting guidance

## Contributing and governance

- Contributing guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](./SECURITY.md)

## Contact

- Instagram: [@the.tirth12](https://www.instagram.com/the.tirth12)
- Email: [rushiofficial1205@gmail.com](mailto:rushiofficial1205@gmail.com)

## License

MIT License. See [LICENSE](./LICENSE).

<p align="center">
  <a href="https://starchart.cc/rushhiii/Scriptable-IOSWidgets">
    <img alt="Stargazers over time" src="https://starchart.cc/rushhiii/Scriptable-IOSWidgets.svg" />
  </a>
</p>

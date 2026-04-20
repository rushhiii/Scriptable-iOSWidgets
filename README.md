# Scriptable
![Scriptable App](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/badges/scriptableBadge.svg) &nbsp; ![iOS](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/badges/iOS-badge.svg)

Welcome to my curated collection of **Scriptable** widgets and scripts, crafted to bring more power and personalization to your iOS home screen.

<!-- <img alt="Mockup wall" width="100%" align="center" src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/scriptable_mockup_wall.png" /> -->
<img alt="Mockup wall" width="100%" align="center" src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/scriptable_mockup_wall_filled.png" />


<br>

- Scriptable is an incredibly versatile IOS app that allows you to build custom widgets and automate tasks directly on your Apple devices.
- From interactive calendars to dynamic quotes and real-time weather updates, my collection showcases how Scriptable can transform your device into a dynamic dashboard.
- Explore, customize, and enjoy these widgets and scripts to make your iOS experience more fun and functional!

> Check out my Documentation site: [https://scriptablehub.vercel.app](https://scriptablehub.vercel.app/docs/home) <br>
> My [Shareable](https://shareable.vercel.app/user/876239dd-7775-4992-af92-25528d41e8b9) page. <br>


<br/>

## Table of Contents

<ul>
  <li><a href="#scriptable">Scriptable Overview</a></li>
  <li><a href="#-list-of-widgets">List of Widgets</a>
    <ul>
      <li><a href="#aqi-&-temp.-widget">AQI Widget</a></li>
      <li><a href="#dynamic-weather-widget">Weather Widget</a></li>
      <li><a href="#countdown">Countdown Widget</a></li>
      <li><a href="#birthday">Birthday Widget</a></li>
      <li><a href="#modular-time-progress">TimeProgress Widget</a></li>
      <li><a href="#class-schedule-viewer">Schedule Widget</a></li>
      <li><a href="#myquotes">Quote Widget</a></li>
      <li><a href="#github-stats-widget">GitHubStats Widget</a></li>
      <li><a href="#hinduclrwear">HinduClrWear Widget</a></li>
    </ul>
  </li>
  <li><a href="#-how-to-use-these-scriptable-widgets?">How to Use Scriptable Widgets?</a></li>
  <li><a href="#-contributing">Contributing</a></li>
  <li><a href="#-code-of-conduct">Code of Conduct</a></li>
  <li><a href="#-security">Security</a></li>
  <li><a href="#-feedback">Feedback</a></li>
  <li><a href="#-license">License</a></li>
</ul>

<br/>

## 📜 List of Widgets

### [AQI & Temp. Widget](./Widgets/AQI%20Widget)

<img width="60%" src="https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/.assets/aqi/openweatheraqi_showcase.png">

🌍 **The OpenWeather AQI + Temperature Widget** brings real-time air quality and weather data to your home screen with beautiful color-coded backgrounds. This dual-mode widget displays either Air Quality Index (AQI) information or temperature data, both sourced from OpenWeatherMap APIs.
Features automatic location detection, EPA-standard AQI color coding, temperature-based themes, and smart theming that adapts to your device's appearance. Supports parameter customization for switching between modes and forcing light/dark themes. Inspired by Jason Snell's PurpleAir widget.

### [Dynamic Weather Widget](./Widgets/Weather%20Widget)

<img width="60%" src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/weather/weather_showcase_s.png">

⛅ **The Dynamic Weather Widget** gives you real-time weather data in a stylish, minimal layout. It auto-detects your current location, fetches current conditions from OpenWeatherMap, and presents the info with dynamically sized text and gradient backgrounds. Whether you use it in small, medium, or large format — it adapts gracefully.
Customize temperature units, color gradients, and update intervals to fit your aesthetic and practical needs.

### [Countdown](./Widgets/Countdown%20Widget)

![countdown widget](https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/.assets/countdown/countdow_showcase.png?raw=true)

📆 **Track life's important moments—right from your home screen.**
The **Countdown Widget** helps you stay on top of upcoming events like birthdays, anniversaries, holidays, or personal milestones. It supports **multiple display modes** based on widget size (Small, Medium, Large) and can be fully customized using script parameters. You can show specific events, display color-coded grids, or even track multiple events in column layout. The widget fetches data from a local `.json` or a connected Google Sheet for dynamic updates.
> NEW VERSION UPDATE! [Countdown Widget v2](./Widgets/Countdown%20Widget/v2/)
> — timezone-aware events on your home screen.
> Notion-to-Scriptable sync, relative reminder handling, emoji/color columns, and a ready-to-use Google Calendar bridge.


### [Birthday](./Widgets/Birthday%20Widget)

<img width="60%" src="https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/.assets/birthday/birthday_showcase.png?raw=true">

🎉 **The Birthday Widget** gives you a beautiful, minimal way to reflect on your life.
It shows your **exact age** (to 2 decimal places), **total days lived**, and a **progress ring** indicating how close you are to your next birthday. Designed for the **Small widget size**, it offers a clean dark-gradient background and supports **parameter customization** to set your name and birthdate. You'll see your name (e.g., "Rushi's Life"), a countdown ring that updates daily, and age stats—all in one elegant glance.

### [Modular Time Progress](./Widgets/TimeProgress%20Widget)

![timeProgress Widget](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/timeprogress/timeprogress_showcase.png)

⏳ **The Modular Time Progress Widget** lets you visualize your life in motion— from the minutes in your day to the weeks in your year. This fully modular Scriptable widget supports multiple modes like day, week, month, year, and week number views. Each mode features a clean, minimalist design with gradient themes and dynamic progress animations.
Use parameters like `day`, `month`, or `weeknumring` to customize each instance — perfect for stacking small, medium, or large widgets for a complete time dashboard.

### [Class Schedule Viewer](./Widgets/Schedule%20Widget)

<img width="60%" src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/schedule/schedule_showcase_1.png">

📅 **The Class Schedule Widget** syncs your school or university timetable from a public Google Sheet and automatically displays today's classes. It adapts to the widget size: from showing only the current class to displaying a full weekly schedule with a beautiful gradient background per weekday.
This widget supports **small**, **medium**, and **large** views. You can also simulate different days or class times using widget parameters.

### [MyQuotes](./Widgets/Quote%20Widget)

<img width="60%" src="https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/.assets/quotes/quote_showcase_1.png?raw=true">

💬 **The Quote of the Day Widget** delivers a daily dose of inspiration, wisdom, or stoic reflection.
Based on the selected category (like *Zen*, *Gita*, *Aurelius*, or *Kafka*), it fetches quotes dynamically from a Google Sheet. The widget adapts its size and style to fit the quote length and device size, and refreshes every night at midnight. Font and background colors can be pulled from the sheet or randomized from a curated palette.
This widget supports **small**, **medium**, and **large** sizes. You can also pass an optional index to show a specific quote or change the category with a parameter.

### [GitHub Stats Widget](./Widgets/GitHubStats%20Widget)

![GitHubStats Widget](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/githubstats/githubstats_showcase.png)

📊 **Track your GitHub contributions, commits, stars, PRs, and more** — all from your iOS Home Screen. This dynamic widget leverages GitHub's GraphQL and REST APIs to show profile or repo-specific stats using multiple themes and widget sizes.
Supports Small, Medium, and Large layouts with parameter-based customization for themes and content. Keep your dev grind visible. Because contribution streaks matter.

### [HinduClrWear](./Widgets/HinduClrWear%20Widget)

<img width="80%" src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/hinduclrwear/hinduclrwear_showcase.png">

🧘‍♂️ **The Hindu Color Wear Widget** offers daily color suggestions based on traditional Hindu practices.
Each day of the week is mapped to a specific color, deity, and spiritual quality—helping you dress with intention and align your energy. The widget supports **all three sizes** (Small, Medium, Large) and changes layout accordingly: Small shows today's color, Medium displays a full week grid, and Large includes spiritual reasoning. No parameters needed—it auto-detects the day and works offline.

## 🌐 Other Mentionable Widgets

Looking to explore more creative widgets? Check out these amazing developers and their unique Scriptable projects:

<h3><a href="https://github.com/dharmikumbhani/scriptable">@dharmikumbhani</a></h3>
<ul>
  <li><strong>Notion Integrations</strong> – Widgets linked to your Notion tasks, notes, or pages.  
    🔗 <a href="https://github.com/dharmikumbhani/scriptable/tree/main/Notion%20Integrations">View</a>
  </li>
  <li><strong>Periodic Table (Elements)</strong> This widget randomly chooses one of 119 elements and displays useful information about it.
    🔗 <a href="https://github.com/dharmikumbhani/scriptable/tree/main/Periodic%20Table">View</a>
  </li>
  <li><strong>Random Number Fact</strong> This widget randomly chooses a number and gives a facton that number.
   🔗 <a href="https://github.com/dharmikumbhani/scriptable/tree/main/Random%20Number%20Fact">View</a>
  </li>
</ul>


<h3><a href="https://github.com/doersino/scriptable-widgets">@marcjulianschwarz</a></h3>
<ul>
  <li><strong>Small Seasons</strong> – Scriptable widget that displays the current sekki ("small season").  
    🔗 <a href="https://github.com/doersino/scriptable-widgets/tree/main/small-seasons">View</a>
  </li>
  <li><strong>Binary Date</strong> – Scriptable widget that displays the current date in binary.  
    🔗 <a href="https://github.com/doersino/scriptable-widgets/tree/main/binary-date">View</a>
  </li>
  <li><strong>location</strong> – Scriptable widget that shows your current location using satellite imagery from Google Maps.  
    🔗 <a href="https://github.com/doersino/scriptable-widgets/tree/main/location-location-location">View</a>
  </li>
  <li><strong>Aerialbot lite</strong> – Scriptable widget that shows a random location in the world.  
    🔗 <a href="https://github.com/doersino/scriptable-widgets/tree/main/aerialbot-lite">View</a>
  </li>
</ul>


<h3><a href="https://github.com/anviqs/">@anviqs</a></h3>
<ul>
  <li><strong>Habit Tracker</strong> – Track your daily progress across up to six habits directly from your Home Screen with a clean and minimal design.  
    🔗 <a href="https://github.com/anviqs/Scriptable-Habit-Tracker-Widget-iOS/tree/main?tab=readme-ov-file#habit-tracker-widget">View</a>
  </li>
</ul>

<h3><a href="https://github.com/lwitzani">@lwitzani</a></h3>
<ul>
  <li><strong>Days Until Birthday</strong> – up to 20 people of your contacts are shown simultaneously with their birthday and how many days are left.  
    🔗 <a href="https://github.com/lwitzani/daysUntilBirthday">View</a>
  </li>
</ul>

<h3><a href="https://github.com/bitKrakenCode">@bitKrakenCode</a></h3>
<ul>
  <li><strong>Word Clock</strong> – word clock widget inspired by QlockTwo.  
    🔗 <a href="https://github.com/bitKrakenCode/ScriptableWordClockWidget">View</a>
  </li>
</ul>


> 🧠 Inspiration doesn’t stop here. Browse GitHub with keyword `scriptable` and see how far people have taken this app. [List](https://github.com/dersvenhesse/awesome-scriptable)


<br/>

## 📖 How to Use These Scriptable Widgets?

1. **Install Scriptable**

     * Download the free **[Scriptable app](https://apps.apple.com/in/app/scriptable/id1405459188)** from the App Store on your iPhone or iPad.

2. **Set Up the Scriptable Folder**

     * Ensure a folder named `Scriptable` exists in your iCloud Drive:
     * Open the **Files app**
     * Navigate to **iCloud Drive**
     * If not already present, create a folder named `Scriptable` (case-sensitive)

3. **Download Widget Scripts**

     * From this repository:

       * Locate the `.js` file for the widget you want to use
       * Download and save it to the `Scriptable` folder in your iCloud Drive

4. **Add the Widget to Your Home Screen**

   1. Long-press on the home screen to enter **jiggle mode**
   2. Tap the **“+”** icon (top-left corner)
   3. Search for **Scriptable** and choose the desired **widget size** (Small / Medium / Large)
   4. Tap **Add Widget**

5. **Configure the Widget**

   * After adding the widget:

     * **Long-press** the widget → Tap **“Edit Widget”**
     * Adjust the following settings:

| Setting              | Default    | What to Change                                                   |
| -------------------- | ---------- | ---------------------------------------------------------------- |
| **Script**           | `Choose`   | Select your downloaded widget script                             |
| **When Interacting** | `Open App` | `Run Script` *(optional)*                                        |
| **Parameter**        | `Empty`    | Provide any specific config text for the widget (see docs below) |

6. **Widget-Specific Options**

     * Some widgets support extra customization (e.g., theme, filters, category, API keys, etc.).\
     Refer to the widget's own folder or the script's header comments to see what parameters are supported.

<br/>

## 🤝 Contributing

Contributions for this widgets-focused repository are welcome.

- Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.
- Keep PRs scoped to widgets, widget docs, or related repository maintenance.

## 🧭 Code of Conduct

Please review [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

## 🔒 Security

If you discover a vulnerability, follow [SECURITY.md](./SECURITY.md) and avoid posting sensitive details publicly.

## 🙌 Feedback

Have feature ideas or issues? DM me on [Instagram](https://www.instagram.com/the.tirth12) or email me at <rushiofficial1205@gmail.com>.

Widgets shouldn’t be limited to timers—I’d love to build tools that help you passively learn, reflect, or stay organized. If you have a unique concept in mind, I’d love to collaborate.

## 📜 License

This project is licensed under the **MIT License**.

Feel free to fork, build upon, and remix with attribution.
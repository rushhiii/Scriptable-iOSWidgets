// ...existing code...

import { FaGithub, FaCloudSun, FaCalendarAlt, FaTools, FaRocket, FaMobileAlt } from 'react-icons/fa';

<div style={{background:'#18191a', borderRadius:'18px', padding:'3rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'3rem', boxShadow:'0 4px 24px 0 rgba(0,0,0,0.12)'}}>
  <div style={{maxWidth:'540px'}}>
    <h1 style={{fontSize:'3.2rem', fontWeight:800, color:'#6c8cff', marginBottom:'0.5rem'}}>Scriptable iOS Widgets</h1>
    <h2 style={{fontSize:'2rem', fontWeight:700, color:'#fff', marginBottom:'1.2rem'}}>Beautiful Custom Widgets for iOS</h2>
    <p style={{fontSize:'1.18rem', color:'#bdbdbd', marginBottom:'2rem'}}>A curated collection of powerful widgets built with Scriptable – bringing more functionality and beauty to your home screen.</p>
    <div style={{display:'flex', gap:'1rem'}}>
      <a className="button" href="Widgets/weather-widget" style={{fontSize:'1.1rem', fontWeight:600}}>Explore Widgets</a>
      <a className="button" style={{background:'#23272f', color:'#fff', fontSize:'1.1rem', fontWeight:600}} href="https://github.com/rushhiii/Scriptable-IOSWidgets"><FaGithub style={{marginRight:'0.5rem'}}/> View on GitHub</a>
    </div>
  </div>
  <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/scriptable_mockup_wall_filled.png" alt="Scriptable - iOS Widgets" style={{borderRadius:'18px', width:'420px', boxShadow:'0 4px 24px 0 rgba(0,0,0,0.12)'}} />
</div>

<div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'2rem', marginTop:'2.5rem'}}>
  <div className="card" style={{background:'#23272f', color:'#fff', borderRadius:'18px', padding:'2rem', boxShadow:'0 2px 12px 0 rgba(0,0,0,0.10)'}}>
    <FaCloudSun size={32} color="#34c759" />
    <h3 style={{margin:'1rem 0 0.5rem 0', fontWeight:700}}>Environmental Data</h3>
    <p style={{color:'#bdbdbd'}}>Real-time weather updates and air quality monitoring with beautiful color-coded designs and smart theming.</p>
  </div>
  <div className="card" style={{background:'#23272f', color:'#fff', borderRadius:'18px', padding:'2rem', boxShadow:'0 2px 12px 0 rgba(0,0,0,0.10)'}}>
    <FaCalendarAlt size={32} color="#007aff" />
    <h3 style={{margin:'1rem 0 0.5rem 0', fontWeight:700}}>Time & Life Tracking</h3>
    <p style={{color:'#bdbdbd'}}>Track countdowns, birthdays, schedules, and time progress with customizable widgets and Google Sheets integration.</p>
  </div>
  <div className="card" style={{background:'#23272f', color:'#fff', borderRadius:'18px', padding:'2rem', boxShadow:'0 2px 12px 0 rgba(0,0,0,0.10)'}}>
    <FaTools size={32} color="#a259ff" />
    <h3 style={{margin:'1rem 0 0.5rem 0', fontWeight:700}}>Developer Tools</h3>
    <p style={{color:'#bdbdbd'}}>Display your GitHub contribution stats, repository information, and coding activity with beautiful graphs.</p>
  </div>
  <div className="card" style={{background:'#23272f', color:'#fff', borderRadius:'18px', padding:'2rem', boxShadow:'0 2px 12px 0 rgba(0,0,0,0.10)'}}>
    <FaRocket size={32} color="#ff5e3a" />
    <h3 style={{margin:'1rem 0 0.5rem 0', fontWeight:700}}>Easy to Use</h3>
    <p style={{color:'#bdbdbd'}}>Simple setup, clear documentation, and quick integration for all widgets.</p>
  </div>
  <div className="card" style={{background:'#23272f', color:'#fff', borderRadius:'18px', padding:'2rem', boxShadow:'0 2px 12px 0 rgba(0,0,0,0.10)'}}>
    <FaMobileAlt size={32} color="#339cff" />
    <h3 style={{margin:'1rem 0 0.5rem 0', fontWeight:700}}>iOS Native Experience</h3>
    <p style={{color:'#bdbdbd'}}>Widgets are designed to look and feel native on your iOS device, blending seamlessly with your home screen.</p>
  </div>
</div>

### [Countdown](./Widgets/Countdown%20Widget)

![Countdown Widget](https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/.assets/countdown/countdow_showcase.png?raw=true)

📆 **Track life's important moments—right from your home screen.**
The **Countdown Widget** helps you stay on top of upcoming events like birthdays, anniversaries, holidays, or personal milestones. It supports **multiple display modes** based on widget size (Small, Medium, Large) and can be fully customized using script parameters. You can show specific events, display color-coded grids, or even track multiple events in column layout. The widget fetches data from a local `.json` or a connected Google Sheet for dynamic updates.
> NEW VERSION UPDATE! [Countdown Widget v2](./Widgets/Countdown%20Widget/v2/) — timezone-aware events on your home screen.
> Notion-to-Scriptable sync, relative reminder handling, emoji/color columns, and a ready-to-use Google Calendar bridge.

### [Birthday](./Widgets/Birthday%20Widget)

![Birthday Widget](https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/.assets/birthday/birthday_showcase.png?raw=true)

🎉 **The Birthday Widget** gives you a beautiful, minimal way to reflect on your life.
It shows your **exact age** (to 2 decimal places), **total days lived**, and a **progress ring** indicating how close you are to your next birthday. Designed for the **Small widget size**, it offers a clean dark-gradient background and supports **parameter customization** to set your name and birthdate. You'll see your name (e.g., "Rushi's Life"), a countdown ring that updates daily, and age stats—all in one elegant glance.

### [Modular Time Progress](./Widgets/TimeProgress%20Widget)

![TimeProgress Widget](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/timeprogress/timeprogress_showcase.png)

⏳ **The Modular Time Progress Widget** lets you visualize your life in motion— from the minutes in your day to the weeks in your year. This fully modular Scriptable widget supports multiple modes like day, week, month, year, and week number views. Each mode features a clean, minimalist design with gradient themes and dynamic progress animations.
Use parameters like `day`, `month`, or `weeknumring` to customize each instance — perfect for stacking small, medium, or large widgets for a complete time dashboard.

### [Class Schedule Viewer](./Widgets/Schedule%20Widget)

![Schedule Widget](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/schedule/schedule_showcase_1.png)

📅 **The Class Schedule Widget** syncs your school or university timetable from a public Google Sheet and automatically displays today's classes. It adapts to the widget size: from showing only the current class to displaying a full weekly schedule with a beautiful gradient background per weekday.
This widget supports **small**, **medium**, and **large** views. You can also simulate different days or class times using widget parameters.

### [MyQuotes](./Widgets/Quote%20Widget)

![Quote Widget](https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/.assets/quotes/quote_showcase_1.png?raw=true)

💬 **The Quote of the Day Widget** delivers a daily dose of inspiration, wisdom, or stoic reflection.
Based on the selected category (like *Zen*, *Gita*, *Aurelius*, or *Kafka*), it fetches quotes dynamically from a Google Sheet. The widget adapts its size and style to fit the quote length and device size, and refreshes every night at midnight. Font and background colors can be pulled from the sheet or randomized from a curated palette.
This widget supports **small**, **medium**, and **large** sizes. You can also pass an optional index to show a specific quote or change the category with a parameter.

### [GitHub Stats Widget](./Widgets/GitHubStats%20Widget)

![GitHubStats Widget](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/githubstats/githubstats_showcase.png)

📊 **Track your GitHub contributions, commits, stars, PRs, and more** — all from your iOS Home Screen. This dynamic widget leverages GitHub's GraphQL and REST APIs to show profile or repo-specific stats using multiple themes and widget sizes.
Supports Small, Medium, and Large layouts with parameter-based customization for themes and content. Keep your dev grind visible. Because contribution streaks matter.

### [HinduClrWear](./Widgets/HinduClrWear%20Widget)

![HinduClrWear Widget](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/hinduclrwear/hinduclrwear_showcase.png)

🧘‍♂️ **The Hindu Color Wear Widget** offers daily color suggestions based on traditional Hindu practices.
Each day of the week is mapped to a specific color, deity, and spiritual quality—helping you dress with intention and align your energy. The widget supports **all three sizes** (Small, Medium, Large) and changes layout accordingly: Small shows today's color, Medium displays a full week grid, and Large includes spiritual reasoning. No parameters needed—it auto-detects the day and works offline.

---

## 🌐 Other Mentionable Widgets

Looking to explore more creative widgets? Check out these amazing developers and their unique Scriptable projects:

### [@dharmikumbhani](https://github.com/dharmikumbhani/scriptable)
- **Notion Integrations** – Widgets linked to your Notion tasks, notes, or pages. [View](https://github.com/dharmikumbhani/scriptable/tree/main/Notion%20Integrations)
- **Periodic Table (Elements)** This widget randomly chooses one of 119 elements and displays useful information about it. [View](https://github.com/dharmikumbhani/scriptable/tree/main/Periodic%20Table)
- **Random Number Fact** This widget randomly chooses a number and gives a facton that number. [View](https://github.com/dharmikumbhani/scriptable/tree/main/Random%20Number%20Fact)

### [@marcjulianschwarz](https://github.com/doersino/scriptable-widgets)
- **Small Seasons** – Scriptable widget that displays the current sekki ("small season"). [View](https://github.com/doersino/scriptable-widgets/tree/main/small-seasons)
- **Binary Date** – Scriptable widget that displays the current date in binary. [View](https://github.com/doersino/scriptable-widgets/tree/main/binary-date)
- **location** – Scriptable widget that shows your current location using satellite imagery from Google Maps. [View](https://github.com/doersino/scriptable-widgets/tree/main/location-location-location)
- **Aerialbot lite** – Scriptable widget that shows a random location in the world. [View](https://github.com/doersino/scriptable-widgets/tree/main/aerialbot-lite)

### [@anviqs](https://github.com/anviqs/)
- **Habit Tracker** – Track your daily progress across up to six habits directly from your Home Screen with a clean and minimal design. [View](https://github.com/anviqs/Scriptable-Habit-Tracker-Widget-iOS/tree/main?tab=readme-ov-file#habit-tracker-widget)

### [@lwitzani](https://github.com/lwitzani)
- **Days Until Birthday** – up to 20 people of your contacts are shown simultaneously with their birthday and how many days are left. [View](https://github.com/lwitzani/daysUntilBirthday)

### [@bitKrakenCode](https://github.com/bitKrakenCode)
- **Word Clock** – word clock widget inspired by QlockTwo. [View](https://github.com/bitKrakenCode/ScriptableWordClockWidget)

> 🧠 Inspiration doesn’t stop here. Browse GitHub with keyword `scriptable` and see how far people have taken this app. [List](https://github.com/dersvenhesse/awesome-scriptable)

---

## 📖 How to Use These Scriptable Widgets?

1. **Install Scriptable**
   - Download the free [Scriptable app](https://apps.apple.com/in/app/scriptable/id1405459188) from the App Store on your iPhone or iPad.

2. **Set Up the Scriptable Folder**
   - Ensure a folder named `Scriptable` exists in your iCloud Drive:
   - Open the **Files app**
   - Navigate to **iCloud Drive**
   - If not already present, create a folder named `Scriptable` (case-sensitive)

3. **Download Widget Scripts**
   - From this repository:
     - Locate the `.js` file for the widget you want to use
     - Download and save it to the `Scriptable` folder in your iCloud Drive

4. **Add the Widget to Your Home Screen**
   1. Long-press on the home screen to enter **jiggle mode**
   2. Tap the **“+”** icon (top-left corner)
   3. Search for **Scriptable** and choose the desired **widget size** (Small / Medium / Large)
   4. Tap **Add Widget**

5. **Configure the Widget**
   - After adding the widget:
     - **Long-press** the widget → Tap **“Edit Widget”**
     - Adjust the following settings:

| Setting              | Default    | What to Change                                                   |
| -------------------- | ---------- | ---------------------------------------------------------------- |
| **Script**           | `Choose`   | Select your downloaded widget script                             |
| **When Interacting** | `Open App` | `Run Script` *(optional)*                                        |
| **Parameter**        | `Empty`    | Provide any specific config text for the widget (see docs below) |

6. **Widget-Specific Options**
   - Some widgets support extra customization (e.g., theme, filters, category, API keys, etc.).
     Refer to the widget's own folder or the script's header comments to see what parameters are supported.

---

## 🙌 Feedback

Have feature ideas or issues? DM me on [Instagram](https://www.instagram.com/the.tirth12) or email me at [rushiofficial1205@gmail.com](mailto:rushiofficial1205@gmail.com).

Widgets shouldn’t be limited to timers—I’d love to build tools that help you passively learn, reflect, or stay organized. If you have a unique concept in mind, I’d love to collaborate.

---

## 📜 License

This project is licensed under the **MIT License**.

Feel free to fork, build upon, and remix with attribution.

---

Enjoy using this widget ~ RP

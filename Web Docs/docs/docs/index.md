---
id: home
# title: Home
# sidebar_label: Home
---

import { FaGithub, FaCloudSun, FaCalendarAlt, FaTools } from 'react-icons/fa';

import "../src/css/index-page.css";

<div id="custom-landing-hero">
  <div className="hero-content">
    <h1 className="hero-title">
      <span className="hero-title-gradient">Scriptable iOS Widgets </span><br/>
      <span className="hero-title-secondary">Beautiful Custom Widgets</span>
    </h1>
    <p className="hero-desc">A curated collection of powerful iOS widgets built with Scriptable – bringing more functionality and beauty to your home screen.</p>
    <div className="hero-buttons">
      <a className="button" href="Widgets/weather-widget">Explore Widgets</a>
      <a className="button" href="https://github.com/rushhiii/Scriptable-IOSWidgets" target="_blank"><FaGithub className="button-icon"/> View on GitHub</a>
    </div>
  </div>
  <div className="hero-image">
    <img id="custom-landing-hero-img" src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/scriptable_mockup_wall_filled.png" alt="Scriptable - iOS Widgets" />
  </div>
</div>

<div className="feature-grid">
  <div className="card">
    <FaCloudSun size={32} color="#34c759" />
    <h3 className="card-title">Environmental Data</h3>
    <p className="card-desc">Real-time weather updates and air quality monitoring with beautiful color-coded designs and smart theming.</p>
  </div>
  <div className="card">
    <FaCalendarAlt size={32} color="#007aff" />
    <h3 className="card-title">Time & Life Tracking</h3>
    <p className="card-desc">Track countdowns, birthdays, schedules, and time progress with customizable widgets and Google Sheets integration.</p>
  </div>
  <div className="card">
    <FaTools size={32} color="#a259ff" />
    <h3 className="card-title">Developer Tools</h3>
    <p className="card-desc">Display your GitHub contribution stats, repository information, and coding activity with beautiful graphs.</p>
  </div>
</div>

<div className="widget-collection-section">
  <h2 className="widget-collection-title">Widget Collection</h2>
  <div className="widget-collection-grid">
    {/* Widget Cards Format */}
    <div className="card">
      <div className="card-img-container">
        <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/weather_widget.png" alt="Weather Widget" className="card-img" />
      </div>
      <div className="card-content">
        <h3 className="card-title">Weather Widget</h3>
        <p className="card-desc">Beautiful, minimal weather display with real-time conditions, temperature, and location-based forecasts.</p>
        <ul className="card-accent card-feature-list">
          <li>🌡️ Temperature</li>
          <li>☁️ Conditions</li>
          <li>🎨 Minimal Design</li>
        </ul>
      </div>
    </div>

    <div className="card">
      <div className="card-img-container">
        <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/aqi_widget.png" alt="AQI Widget" className="card-img" />
      </div>
      <div className="card-content">
        <h3 className="card-title">AQI Widget</h3>
        <p className="card-desc">Monitor air quality and temperature with real-time data from OpenWeatherMap. Features dual-mode display and smart theming.</p>
        <ul className="card-accent card-feature-list">
          <li>🧪 AQI Data</li>
          <li>🌡️ Temperature</li>
          <li>🖌️ Smart Themes</li>
        </ul>
      </div>
    </div>

    <div className="card">
      <div className="card-img-container">
        <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/countdown_widget.png" alt="Countdown Widget" className="card-img" />
      </div>
      <div className="card-content">
        <h3 className="card-title">Countdown Widget</h3>
        <p className="card-desc">Track important events with Google Sheets integration. Perfect for birthdays, anniversaries, and deadlines.</p>
        <ul className="card-accent card-feature-list">
          <li>📅 Events</li>
          <li>🗂️ Google Sheets</li>
          <li>🎨 Custom Colors</li>
        </ul>
      </div>
    </div>

    <div className="card">
      <div className="card-img-container">
        <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/github_stats_widget.png" alt="GitHub Stats Widget" className="card-img" />
      </div>
      <div className="card-content">
        <h3 className="card-title">GitHub Stats Widget</h3>
        <p className="card-desc">Display your GitHub contribution stats, repository information, and coding activity with beautiful graphs and charts.</p>
        <ul className="card-accent card-feature-list">
          <li>📊 Contributions</li>
          <li>🗂️ Repo Info</li>
          <li>📈 Activity Graphs</li>
        </ul>
      </div>
    </div>

    <div className="card">
      <div className="card-img-container">
        <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/birthday_widget.png" alt="Birthday Widget" className="card-img" />
      </div>
      <div className="card-content">
        <h3 className="card-title">Birthday Widget</h3>
        <p className="card-desc">Keep track of birthdays and anniversaries with a beautiful, customizable widget. Includes age calculation and reminders.</p>
        <ul className="card-accent card-feature-list">
          <li>🎂 Age Calculation</li>
          <li>📅 Reminders</li>
          <li>🎨 Custom Design</li>
        </ul>
      </div>
    </div>

    <div className="card">
      <div className="card-img-container">
        <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/quote_widget.png" alt="Quote Widget" className="card-img" />
      </div>
      <div className="card-content">
        <h3 className="card-title">Quote Widget</h3>
        <p className="card-desc">Get daily inspiration with beautiful quote widgets. Supports light/dark themes and custom color pairs.</p>
        <ul className="card-accent card-feature-list">
          <li>💡 Daily Quotes</li>
          <li>🎨 Color Themes</li>
          <li>🖌️ Custom Pairs</li>
        </ul>
      </div>
    </div>

    <div className="card">
      <div className="card-img-container">
        <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/schedule_widget.png" alt="Schedule Widget" className="card-img" />
      </div>
      <div className="card-content">
        <h3 className="card-title">Schedule Widget</h3>
        <p className="card-desc">Organize your daily schedule and university timetable with a smart, minimal widget. Google Sheets integration supported.</p>
        <ul className="card-accent card-feature-list">
          <li>📅 Timetable</li>
          <li>🗂️ Google Sheets</li>
          <li>🎨 Minimal Design</li>
        </ul>
      </div>
    </div>

    <div className="card">
      <div className="card-img-container">
        <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/time_progress_widget.png" alt="Time Progress Widget" className="card-img" />
      </div>
      <div className="card-content">
        <h3 className="card-title">Time Progress Widget</h3>
        <p className="card-desc">Visualize your day, week, month, and year progress with beautiful, modular time progress bars.</p>
        <ul className="card-accent card-feature-list">
          <li>⏳ Progress Bars</li>
          <li>📅 Calendar Integration</li>
          <li>🎨 Modular Design</li>
        </ul>
      </div>
    </div>

    <div className="card">
      <div className="card-img-container">
        <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/toyota_widget.png" alt="Toyota Widget" className="card-img" />
      </div>
      <div className="card-content">
        <h3 className="card-title">Toyota Widget</h3>
        <p className="card-desc">Track your Toyota car stats, mileage, and maintenance reminders with a custom widget for car enthusiasts.</p>
        <ul className="card-accent card-feature-list">
          <li>🚗 Mileage</li>
          <li>🔧 Maintenance</li>
          <li>🎨 Custom Design</li>
        </ul>
      </div>
    </div>

    <div className="card">
      <div className="card-img-container">
        <img src="https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/hindu_calendar_widget.png" alt="Hindu Calendar Widget" className="card-img" />
      </div>
      <div className="card-content">
        <h3 className="card-title">Hindu Calendar Widget</h3>
        <p className="card-desc">Get daily Hindu calendar information, festivals, and auspicious timings with a beautiful widget.</p>
        <ul className="card-accent card-feature-list">
          <li>📅 Festivals</li>
          <li>🕉️ Auspicious Timings</li>
          <li>🎨 Custom Design</li>
        </ul>
      </div>
    </div>
  </div>
</div>
---
id: weather-widget
# title: Weather Widget
# sidebar_label: Weather Widget
---
# Weather Widget

![Scriptable](https://img.shields.io/badge/Scriptable-Compatible-purple)
![Widget Size](https://img.shields.io/badge/Supports-Small%2C%20Medium%2C%20Large-blue)
![API](https://img.shields.io/badge/API-OpenWeatherMap-orange)
![Location](https://img.shields.io/badge/Location-GPS%20Auto--Detect-green)
![Theme](https://img.shields.io/badge/Theme-Gradient%20Backgrounds-9cf)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)
![Last Updated](https://img.shields.io/badge/Updated-June%202025-yellow)

<!-- ![weather widget](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/weather/weather_showcase_s.png) -->

![Weather Widget Showcase](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/weather/weather_showcase_s.png)


A clean and elegant iOS weather widget built with [Scriptable](https://scriptable.app), fetching real-time data from the **OpenWeather API**. The widget adapts layout and font size based on weather conditions and city names for improved readability.

## ✨ Features

* 📍 **Auto Location Detection**: Fetches your current coordinates using iOS GPS.
* 🌤️ **Real-Time Forecast**: Displays current temperature and condition.
* 🏙️ **City Recognition**: Dynamically detects and displays the city name.
* 📐 **Responsive Typography**: Adjusts font size based on widget size, text length, and content.
* 🎨 **Gradient Backgrounds**: Custom gradients for stylish appearance.
* 🔁 **Auto Refresh**: Refreshes every 30 minutes to stay updated.

## ⚙️ Setup Instructions

### Step 1: Get Your Free OpenWeather API Key

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Create a **free account** or log in.
3. Visit the [API Keys](https://home.openweathermap.org/api_keys) page.
4. Click **Generate** to create a new key.
5. Copy the generated key.

### Step 2: Add Your API Key

In the script file, replace this line:

```js
const API_KEY = "YOUR_FREE_API_KEY";
```

With:

```js
const API_KEY = "your_actual_key_here";
```

### Step 3: Add the Script to Scriptable

1. Open the **Scriptable** app on your iPhone or iPad.
2. Tap the **+** button to create a new script.
3. Paste the entire code into the editor.
4. Save the file with a name like `Weather Widget`.

### Step 4: Add the Widget to Home Screen

1. Long-press the Home Screen to enter edit mode.
2. Tap the **+** button at the top.
3. Search for and select **Scriptable**.
4. Choose a widget size (Small, Medium, or Large).
5. Tap **Add Widget**.
6. Long-press the widget and tap **Edit Widget**.
7. Set the **Script** to your saved weather widget script.
8. Leave parameters blank (it auto-detects location).

## 🌈 Customization Options

You can tweak the following parts of the script to personalize the widget:

### Background Themes

Update this line to switch between preset themes:

```js
createGradientBackground(widget, testGradientClr);
```

Other options include:

* `blackBlueGradientClr`
* `lightDarkBlueGradientClr`

### Units

Choose between Celsius and Fahrenheit:

```js
const WEATHER_UNITS = "metric"; // or "imperial"
```

## 🧠 How It Works

* **Location** is retrieved using `Location.current()`.
* The **weather API** uses your coordinates to return:

  * `feels_like` temperature
  * weather `description`
  * `city` name
* The widget parses this and smartly adjusts the text layout.

  * E.g., long descriptions like "scattered intensity rain" will wrap.
  * City names like "New York" will only display "New" to keep layout clean.

## 🔄 Refresh Logic

The widget is set to automatically refresh every 30 minutes:

```js
widget.refreshAfterDate = new Date(Date.now() + 30 * 60 * 1000);
```

## 📸 Screenshots

| ![Weather Small 1](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/weather/weather_s_1.PNG) | ![Weather Small 2](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/weather/weather_s_2.png) |
|:--:|:--:|

> NOTE: The the values may differ bassed on your current location, the above are just some examples

## 🙌 Feedback & Credits

Have questions or want to request a feature?
DM me on [Instagram](https://www.instagram.com/the.tirth12) or email: [rushiofficial1205@gmail.com](mailto:rushiofficial1205@gmail.com)

This widget is a reflection of clean UI and practical design. If you'd like to expand it (e.g., 3-day forecasts, icon-based UI), feel free to fork it.


## 📜 License

This project is licensed under the **MIT License**. Feel free to remix, reuse, and modify with attribution.

> **Stay informed, stay stylish – RP**

---
id: aqi-widget
# title: AQI Widget
# sidebar_label: AQI Widget
---
# OpenWeather AQI + Temperature Widget

![Scriptable](https://img.shields.io/badge/Scriptable-Compatible-purple)
![Widget Size](https://img.shields.io/badge/Supports-Small%20Widget-blue)
![Data Source](https://img.shields.io/badge/Data-OpenWeatherMap-brightgreen)
![Customization](https://img.shields.io/badge/Configurable-AQI%20%2B%20Temperature%20%2B%20Themes-orange)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)
![Last Updated](https://img.shields.io/badge/Updated-July%202025-yellow)

![OpenWeatherAQI Showcase](https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/.assets/aqi/openweatheraqi_showcase.png?raw=true)

A powerful dual-mode widget for Scriptable that displays either **Air Quality Index (AQI)** or **Temperature** information with beautiful color-coded backgrounds. Built for iOS using the [Scriptable app](https://scriptable.app) and powered by OpenWeatherMap APIs.

> **Inspiration & Credits:** This widget was inspired by and adapted from [Jason Snell's PurpleAir AQI Scriptable Widget](https://github.com/jasonsnell/PurpleAir-AQI-Scriptable-Widget). Special thanks to Jason for the original concept and design patterns that made this enhanced version possible.

> **Note:** All example screenshots in this documentation are shown in **light mode**. If your phone is in dark mode, the widget background will appear pitch black by default. If you prefer the colorful backgrounds shown in the examples, add `light` to your widget parameter to force light theme colors.

## ✨ Features

### 🌡️ Temperature Mode
- Current temperature with large, easy-to-read display
- Daily high and low temperatures
- Temperature difference from "feels like" temperature
- Daily temperature range information
- City/location name display
- Temperature-based color themes (hot = red/orange, cold = blue)

### 🌍 Air Quality Mode (Default)
- Real-time Air Quality Index (AQI) for your location
- Color-coded AQI levels following US EPA standards
- PM2.5 and PM10 pollution measurements
- AQI category labels (Good, Moderate, Unhealthy, etc.)
- SF Symbol icons for different AQI levels
- Last updated timestamp

### 🎨 Smart Theming
- **Auto Theme**: Adapts to your device's light/dark mode
- **Light Theme**: Force colorful backgrounds (as shown in examples)
- **Dark Theme**: Force dark backgrounds with colored text
- Dynamic colors based on AQI levels or temperature ranges

## 🚀 How It Works

The widget uses two OpenWeatherMap APIs:
1. **Air Pollution API**: Fetches real-time air quality data including PM2.5, PM10, and calculates US AQI
2. **Weather API**: Retrieves current temperature, high/low, and location information

## 🔧 Setup

### 1. Get OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Create a free account
3. Navigate to the API Keys section
4. Generate a new API key (free tier includes 1,000 calls/day)

### 2. Install the Script

**Option A - Direct Download:**
1. Download [`OpenWeatherAQI.js`](https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/Widgets/AQI%20Widget/OpenWeatherAQI.js)
2. Save it to the `Scriptable` folder in your iCloud Drive

**Option B - Manual Copy:**
1. Open Scriptable app
2. Tap the **+** icon to create a new script
3. Copy and paste the entire script content
4. Save with a name like "OpenWeather AQI"

### 3. Configure API Key

1. Open the script in Scriptable
2. Find this line at the top:

   ```javascript
   const API_KEY = "YOUR_API_HERE"; // OpenWeatherMap API key
   ```

3. Replace `YOUR_API_HERE` with your actual API key:

   ```javascript
   const API_KEY = "abc123def456ghi789"; // Your actual API key
   ```

4. Save the script

### 4. Add Widget to Home Screen

1. Long-press your iOS Home Screen to enter edit mode
2. Tap the **+** icon in the top left
3. Search for and select **Scriptable**
4. Choose **Small** widget size (this widget is optimized for small widgets)
5. Place the widget on your home screen
6. Tap the widget to configure it:
   - **Script**: Select your "OpenWeather AQI" script
   - **When Interacting**: Choose "Run Script"
   - **Parameter**: Enter your desired parameter (see configuration options below)

### 5. Enable Location Access

1. When the widget runs for the first time, it will request location access
2. Choose "Allow While Using App" or "Allow Once"
3. For the widget to work on your home screen, you may need to grant "Always Allow" location access to Scriptable in Settings > Privacy & Security > Location Services

## ⚙️ Widget Parameters

Configure your widget by adding parameters in the widget settings. Multiple parameters can be combined with commas.

### Available Parameters

| Parameter      | Description                                 | Example        |
|---------------|---------------------------------------------|---------------|
| *(empty)*     | Default AQI mode with auto theme             | No parameter   |
| `temp`        | Switch to temperature mode                   | `temp`        |
| `light`       | Force light theme (colorful backgrounds)     | `light`       |
| `dark`        | Force dark theme (dark backgrounds)          | `dark`        |
| `temp,light`  | Temperature mode with light theme            | `temp,light`  |
| `temp,dark`   | Temperature mode with dark theme             | `temp,dark`   |

### Parameter Examples

- **Default AQI Mode**: Leave parameter field empty
- **AQI with Light Theme**: `light`
- **AQI with Dark Theme**: `dark`
- **Temperature Mode**: `temp`
- **Temperature with Light Theme**: `temp,light`
- **Temperature with Dark Theme**: `temp,dark`

## 📊 AQI Color Coding

The widget follows US EPA Air Quality Index standards:

| AQI Range | Level                        | Color         | Health Implications                |
|----------|------------------------------|--------------|------------------------------------|
| 0-50     | Good                         | 🟢 Green     | Air quality is satisfactory        |
| 51-100   | Moderate                     | 🟡 Yellow    | Acceptable for most people         |
| 101-150  | Unhealthy for Sensitive Groups| 🟠 Orange    | Sensitive individuals may experience problems |
| 151-200  | Unhealthy                    | 🔴 Red       | Everyone may experience problems   |
| 201-300  | Very Unhealthy               | 🟣 Purple    | Health alert for everyone          |
| 301+     | Hazardous                    | 🟤 Maroon    | Emergency conditions               |

## 🌡️ Temperature Color Coding

Temperature mode uses different color schemes based on temperature ranges:

| Temperature         | Color Scheme      | Description     |
|---------------------|------------------|-----------------|
| 35°C+ (95°F+)       | Red to Dark Red  | Very Hot        |
| 25-34°C (77-93°F)   | Orange           | Warm            |
| 15-24°C (59-76°F)   | Blue             | Comfortable     |
| Below 15°C (59°F)   | Light Blue       | Cool            |

## 🎨 Dark Mode vs Light Mode

**Important Theme Information:**

### Auto Theme (Default)
- Automatically adapts to your device's appearance setting
- **Light Mode**: Shows colorful backgrounds as seen in examples
- **Dark Mode**: Shows dark/black backgrounds with colored text

### Force Light Theme
- Add `light` parameter to always show colorful backgrounds
- Recommended if you prefer the colorful appearance regardless of your device theme
- Example: Set parameter to `light` or `temp,light`

### Force Dark Theme
- Add `dark` parameter to always show dark backgrounds
- Text and accents will be colored, background remains dark
- Example: Set parameter to `dark` or `temp,dark`

## 📷 Widget Examples

> **Note:** All screenshots below show the widget in **light mode** with colorful backgrounds. If your device is in dark mode and you want these colorful backgrounds, add `light` to your widget parameter.

### 🌍 Air Quality Index (AQI) Mode

| AQI Level           | Example                                                                 | Description                                 |
|---------------------|------------------------------------------------------------------------|---------------------------------------------|
| Hazardous (350 AQI) | ![Hazardous AQI](https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/.assets/aqi/openweatheraqi_s_1.png?raw=true) | Purple/Maroon background, shows severe air pollution |
| Moderate (51 AQI)   | ![Moderate AQI](https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/.assets/aqi/openweatheraqi_s_2.png?raw=true)   | Yellow background, acceptable air quality    |

**AQI Mode displays:**
- "AIR QUALITY" header
- AQI level name (Good, Moderate, Unhealthy, etc.)
- Numerical AQI value (large font)
- City name
- PM2.5 and PM10 values
- Last updated time
- SF Symbol icon indicating air quality level

### 🌡️ Temperature Mode

| Temperature Range   | Example                                                                 | Description                                 |
|---------------------|------------------------------------------------------------------------|---------------------------------------------|
| Cool Weather (23°C) | ![Cool Temperature](https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/.assets/aqi/openweatheraqi_s_3.png?raw=true) | Blue background for comfortable temperatures |

**Temperature Mode displays:**
- Large current temperature
- Daily high and low temperatures
- Temperature difference from "feels like"
- Daily temperature range
- City name

## 🔍 Widget Information Display

### AQI Mode Layout

```
┌─────────────────────┐
│ AIR QUALITY      🔶 │
│ Moderate            │
│                     │
│        51           │
│                     │
│ Woodbridge          │
│ PM2.5: 12.2│PM10: 12.5│
│ Updated 7:05 PM     │
└─────────────────────┘
```

### Temperature Mode Layout

```
┌─────────────────────┐
│                     │
│       23°           │
│                     │
│ High 23° Low 21°    │
│ 1° warmer than feels│
│ like                │
│ 2° range today      │
│                     │
│ Woodbridge          │
└─────────────────────┘
```

## 🛠️ Troubleshooting

### Common Issues

**1. Widget shows "Error" message:**
- Verify your API key is correct and active
- Check internet connection
- Ensure location services are enabled for Scriptable

**2. Location not detected:**
- Go to Settings > Privacy & Security > Location Services
- Find Scriptable and set to "While Using App" or "Always"
- Try running the script manually in Scriptable first

**3. Widget appears black (in dark mode):**
- This is normal behavior when your device is in dark mode
- Add `light` parameter to force colorful backgrounds
- Or add `dark` parameter for a consistent dark theme

**4. Data not updating:**
- Widgets automatically refresh based on iOS system scheduling
- Manually refresh by tapping the widget
- Check if you've exceeded API rate limits (1,000 calls/day on free tier)

**5. Wrong location displayed:**
- The widget uses your device's current location
- Ensure location services are enabled and working
- The script doesn't support manual location setting

### API Rate Limits
- Free OpenWeatherMap accounts allow 1,000 API calls per day
- Each widget refresh uses 2 API calls (1 for weather, 1 for AQI)
- This allows approximately 500 widget refreshes per day
- iOS typically refreshes widgets 10-20 times per day

## 📱 iOS Compatibility

- **Requires**: iOS 14+ (for widget support)
- **App**: Scriptable (free on App Store)
- **Widget Size**: Small (optimized for small widgets only)
- **Permissions**: Location access required

## 🔗 Data Sources

- **Air Quality Data**: [OpenWeatherMap Air Pollution API](https://openweathermap.org/api/air-pollution)
- **Weather Data**: [OpenWeatherMap Current Weather API](https://openweathermap.org/current)
- **AQI Calculation**: Follows US EPA Air Quality Index standards

## 🙌 Feedback & Support

Have questions, suggestions, or issues? Reach out:

- **Instagram**: [@the.tirth12](https://www.instagram.com/the.tirth12)
- **Email**: [rushiofficial1205@gmail.com](mailto:rushiofficial1205@gmail.com)
- **GitHub Issues**: Create an issue in this repository

## 📜 License

This project is licensed under the **MIT License**. Feel free to fork, modify, and share with attribution.

---


> **Enjoy monitoring your air quality and weather! 🌍🌡️**
>
> ~ RP

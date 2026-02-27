---
id: hindu-calendar-widget
title: Hindu Color Wear Widget
sidebar_label: Hindu Calendar Widget
---
## Hindu Calendar Widget
![Scriptable](https://img.shields.io/badge/Scriptable-Compatible-purple)
![Widget Size](https://img.shields.io/badge/Supports-Small%2C%20Medium%2C%20Large-blue)
![Theme](https://img.shields.io/badge/Theme-Hindu%20Color%20Calendar-orange)
![Color Logic](https://img.shields.io/badge/Based%20on-Day%20of%20Week-yellow)
![Offline](https://img.shields.io/badge/Works%20Offline-Yes-brightgreen)
![Last Updated](https://img.shields.io/badge/Updated-June%202025-yellow)

![Hindu Color Wear Widget Showcase](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/hinduclrwear/hinduclrwear_showcase.png)

This Scriptable widget recommends what color to wear each day based on Hindu tradition.
Each day is linked to a color, deity, and spiritual intention — designed to help you feel aligned, energized, and centered.

> Ancient tradition meets modern homescreen design.

## ✨ Features

- 🗓️ **Day-Aware**: Automatically detects today’s day of the week.
- 🎨 **Color Recommendation**: Shows the recommended Hindu color to wear.
- 🧘‍♂️ **Spiritual Reasoning**: Large widget explains symbolic meaning behind the color.
- 🖼️ **Dynamic Layouts**:
  - **Small:** Color + Day
  - **Medium:** Weekly color grid (Mon–Sun)
  - **Large:** Today’s reasoning in depth
- 🌈 **Auto-adjusting background gradients**
- 🕉️ Designed for mindfulness, clarity, and intention

## 🧠 Color Associations

| Day      | Color       | Associated With         |
|----------|-------------|--------------------------|
| Sunday   | Red         | Surya (Sun) – Vitality, Leadership |
| Monday   | White       | Shiva – Purity, Peace     |
| Tuesday  | Orange-Red  | Hanuman – Courage, Energy |
| Wednesday| Green       | Budh (Mercury) – Growth, Wisdom |
| Thursday | Yellow      | Guru (Jupiter) – Knowledge, Positivity |
| Friday   | Light Blue  | Durga/Shukra – Devotion, Love |
| Saturday | Black       | Shani (Saturn) – Protection, Discipline |

## ⚙️ Setup Instructions

### 1. Install Scriptable

Download the [Scriptable app](https://apps.apple.com/app/scriptable/id1405459188) from the App Store.

### 2. Add the Script

1. Create a new script called `HinduColorWidget`
2. Paste the full widget code into the editor
3. Save the script

### 3. Add the Widget

1. Long-press your Home Screen → tap **+**
2. Search for **Scriptable**
3. Add a widget of desired size (Small, Medium, Large)
4. Long-press the widget → tap **Edit Widget**
5. Set **Script** to `HinduColorWidget`
6. Leave the parameter blank — the script auto-detects today

## 📐 Widget Size Behavior

| Size   | Description                              |
|--------|------------------------------------------|
| Small  | Today’s color name and day (centered)    |
| Medium | Week grid: Days & Colors (highlight today) |
| Large  | Today’s color + full spiritual reasoning |

## 🎨 Visual Style

- Background: Dynamic dark gradient based on today’s color
- Text: White-tinted with soft contrast for readability
- Highlight: Today's entry is bolded and recolored

## 💡 Behind the Color Logic

Each day's color is defined by an array in the script like:

```js
{
  day: "Thursday",
  colorName: "Yellow",
  color: "#FFD700",
  reason: "Yellow signifies knowledge, learning, and positivity. Thursday, governed by Jupiter (Guru)..."
}
```
Feel free to customize this array for regional traditions or alternate meanings.

## 📸 Screenshots


| ![Large](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/hinduclrwear/hinduclrwear_l.png) | ![Medium](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/hinduclrwear/hinduclrwear_m.png) | ![Small](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/hinduclrwear/hinduclrwear_s.png) |
|:--:|:--:|:--:|


## 🙌 Feedback

Have questions or want to expand this into a daily quote + color combo?
DM me on [Instagram](https://www.instagram.com/the.tirth12) or email at [rushiofficial1205@gmail.com](mailto:rushiofficial1205@gmail.com).

Align with tradition. Dress with intention. Start your day grounded.

## 📜 License

MIT License.
Free to use, customize, and remix — just credit the source.

##
> **Stay colorful ~ RP**
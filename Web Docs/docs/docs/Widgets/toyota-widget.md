---
id: toyota-widget
# title: Toyota Widget
# sidebar_label: Toyota Widget
---
# Toyota Widget

![Scriptable](https://img.shields.io/badge/Scriptable-Compatible-purple)
![Widget Size](https://img.shields.io/badge/Supports-Medium%2C%20Large-blue)
![Type](https://img.shields.io/badge/Type-Vehicle%20Info-red)
![API](https://img.shields.io/badge/API-Toyota%20Connected-blue)

Connect with your Toyota vehicle and display important information like fuel level, maintenance reminders, and vehicle status right on your iOS home screen.

![Toyota Widget Preview](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/toyota/toyota_l.png)

## ✨ Features

- ⛽ **Fuel Level Monitoring**: Real-time fuel gauge display
- 🔧 **Maintenance Alerts**: Service reminders and maintenance notifications
- 📍 **Vehicle Location**: Last known parking location
- 🚗 **Vehicle Status**: Engine status, doors, and security information
- 📊 **Trip Statistics**: Recent driving data and fuel efficiency
- 🔐 **Remote Functions**: Lock/unlock and remote start capabilities*
- 📱 **Beautiful Interface**: Toyota-branded design with official styling

*Note: Remote functions depend on your vehicle's connected services plan*

## 🚀 Quick Setup

### 1. Prerequisites

Before setting up the widget, ensure you have:
- **Toyota Connected Services** account
- **Compatible Toyota vehicle** (2018+ models typically supported)
- **Active subscription** to Toyota's connected services
- **MyToyota app** installed and working on your phone

### 2. Get Your Credentials

1. **Open MyToyota app** and ensure it's working correctly
2. **Note your login credentials** (you'll need them for the widget)
3. **Verify vehicle connection** in the app
4. **Check service status** to ensure connectivity

### 3. Configure the Widget

```javascript
// Toyota account credentials
const TOYOTA_USERNAME = "your_toyota_email@example.com";
const TOYOTA_PASSWORD = "your_toyota_password";

// Optional: Vehicle identification
const VEHICLE_VIN = "your_vehicle_vin"; // Optional for multi-vehicle accounts
```

### 4. Install and Setup

1. Download [`MyToyota.js`](https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/Toyota%20Widget/MyToyota.js)
2. Create new script in Scriptable
3. Configure your Toyota credentials
4. Add widget to home screen
5. Test connectivity and data display

## 📸 Screenshots

### Large Widget
Comprehensive vehicle dashboard with all information.

| Large Widget - Full Dashboard |
|:--:|
| ![Toyota Large](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/toyota/toyota_l.png) |

### Medium Widget
Essential vehicle information in compact format.

| Medium Widget - Key Info |
|:--:|
| ![Toyota Medium](https://raw.githubusercontent.com/rushhiii/Scriptable-IOSWidgets/main/.assets/toyota/toyota_m.png) |

## 📊 Information Displayed

### Fuel & Range
- **Current Fuel Level**: Percentage and visual gauge
- **Estimated Range**: Miles/kilometers remaining
- **Fuel Efficiency**: Recent MPG/L per 100km data
- **Low Fuel Alerts**: Warning when fuel is low

### Vehicle Status
- **Engine Status**: Running, off, remote start active
- **Door Status**: All doors, trunk, hood status
- **Lock Status**: Vehicle security status
- **Window Status**: Open/closed window indicators

### Maintenance Information
- **Next Service Due**: Mileage or time until next service
- **Oil Life**: Remaining oil life percentage
- **Tire Pressure**: Individual tire pressure readings*
- **Maintenance Alerts**: Upcoming or overdue services

### Location & Security
- **Last Known Location**: Where your vehicle is parked
- **Security Status**: Alarm status and door locks
- **Remote Functions**: Available remote commands
- **Trip Summary**: Recent trip information

*Features vary by vehicle model and year*

## ⚙️ Widget Configuration

### Display Options

The widget can be customized to show different information:

```javascript
const DISPLAY_OPTIONS = {
  showFuelLevel: true,
  showMaintenance: true,
  showLocation: false,    // Privacy consideration
  showRemoteControls: true,
  compactMode: false      // For smaller widgets
};
```

### Update Frequency

```javascript
const UPDATE_SETTINGS = {
  refreshInterval: 30,    // minutes
  maxRetries: 3,
  timeoutDuration: 10000  // milliseconds
};
```

### Privacy Settings

```javascript
const PRIVACY_OPTIONS = {
  showExactLocation: false,  // Show general area only
  maskVIN: true,            // Hide partial VIN
  showPlateNumber: false    // Don't display license plate
};
```

## 🔧 Advanced Features

### Remote Vehicle Control

**Available Commands** (varies by vehicle):
- Lock/unlock doors
- Remote engine start
- Climate control activation
- Horn and lights
- Vehicle finder

### Smart Notifications

The widget can provide intelligent alerts:
- Low fuel warnings
- Maintenance reminders
- Unusual vehicle activity
- Service appointment reminders

### Multi-Vehicle Support

For users with multiple Toyota vehicles:

```javascript
const VEHICLES = [
  {
    name: "Camry",
    vin: "your_camry_vin",
    priority: 1
  },
  {
    name: "Prius",
    vin: "your_prius_vin", 
    priority: 2
  }
];
```

## 🔐 Security & Privacy

### Data Protection
- **Encrypted Storage**: Credentials stored securely
- **Local Processing**: Data processed on device when possible
- **Privacy Mode**: Option to hide sensitive information
- **Secure Communication**: Uses Toyota's official APIs

### Account Security
- **Strong Passwords**: Use secure Toyota account passwords
- **Two-Factor Authentication**: Enable 2FA on Toyota account
- **Regular Updates**: Keep credentials current
- **Access Monitoring**: Monitor account access regularly

## 📱 Supported Toyota Models

### Recent Models (2018+)
Most Toyota vehicles from 2018 onwards support connected services:

- **Camry** (2018+)
- **Corolla** (2020+)
- **RAV4** (2018+)
- **Highlander** (2020+)
- **Prius** (2017+)
- **Tacoma** (2018+)
- **Tundra** (2022+)
- **4Runner** (2020+)
- **Sienna** (2021+)
- **Venza** (2021+)

### Service Plans
Different features available based on your service plan:
- **Safety Connect**: Emergency assistance
- **Service Connect**: Maintenance alerts
- **Remote Connect**: Remote vehicle control
- **Destination Assist**: Navigation support

## 🚨 Troubleshooting

### Common Issues

**Widget shows "No Data":**
- Verify Toyota account credentials
- Check vehicle's connected services status
- Ensure vehicle has cellular connectivity
- Confirm active service subscription

**Authentication errors:**
- Update Toyota account password
- Check for account lockouts
- Verify two-factor authentication settings
- Test MyToyota app connectivity

**Outdated information:**
- Check vehicle's cellular signal
- Verify last vehicle communication time
- Restart vehicle's infotainment system
- Check for app updates

### Service Connectivity

**Vehicle Connection Issues:**
- Ensure vehicle is in area with cellular coverage
- Check that connected services subscription is active
- Verify vehicle's TCU (Telematics Control Unit) is functioning
- Contact Toyota customer service if persistent issues

## 💡 Usage Tips

### Best Practices
- **Regular Updates**: Check widget daily for maintenance alerts
- **Fuel Planning**: Use fuel level for trip planning
- **Security Monitoring**: Monitor vehicle status when parked
- **Maintenance Tracking**: Stay ahead of service needs

### Widget Placement Ideas
- **Home Screen**: Quick vehicle status check
- **Today View**: Swipe down for instant information
- **Car Play**: Display on vehicle dashboard
- **Lock Screen**: Essential info at a glance

### Integration Ideas
- **Calendar Events**: Link with service appointments
- **Location Reminders**: Set parking location reminders
- **Fuel Tracking**: Monitor fuel efficiency trends
- **Maintenance Logs**: Track service history

## 🔄 Future Features

### Potential Enhancements
- **Fuel Station Finder**: Locate nearby gas stations
- **Service Scheduler**: Book appointments through widget
- **Trip Planner**: Route planning with fuel stops
- **Eco Driving**: Tips for better fuel efficiency
- **Maintenance History**: Complete service records

### Integration Possibilities
- **Smart Home**: Garage door automation
- **Calendar Apps**: Service reminders
- **Weather Apps**: Climate control suggestions
- **Maps Apps**: Navigation to vehicle location

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/rushhiii/Scriptable-IOSWidgets/blob/main/LICENSE) file for details.

## 🤝 Contributing

Help improve the Toyota Widget:

1. [Share vehicle compatibility info](https://github.com/rushhiii/Scriptable-IOSWidgets/discussions)
2. [Report issues](https://github.com/rushhiii/Scriptable-IOSWidgets/issues)
3. [Suggest features](https://github.com/rushhiii/Scriptable-IOSWidgets/discussions)
4. Contribute support for other Toyota models

## ⚠️ Disclaimer

This widget is an unofficial third-party application. It is not affiliated with, endorsed by, or sponsored by Toyota Motor Corporation. Toyota, the Toyota logo, and related marks are trademarks of Toyota Motor Corporation.

Use this widget in accordance with Toyota's terms of service for connected vehicle services. The developer is not responsible for any issues related to your Toyota account or vehicle.

---

**Made with ❤️ by [rushhiii](https://github.com/rushhiii)** | **Drive connected, stay informed 🚗**

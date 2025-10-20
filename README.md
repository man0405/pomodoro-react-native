# 🍅 Pomodoro Timer App

The Pomodoro Timer app is built with Expo and React Native to help manage focused work and breaks effectively.

## 🎥 Demo Video

![Demo preview](assets/demo.gif)

Full video (click to play / download):

[Watch the demo video (MP4)](assets/demo.mp4)

## ✨ Key Features

### Minimum Requirements ✅

- **Basic timer**: Work (25') and Break (5') modes
- **Background operation**: Timer continues running when the app is in the background
- **Notifications**: Receive a notification when a session ends
- **History storage**: Automatically save session history to AsyncStorage

### Extended Features ✅

# 🍅 Pomodoro Timer App

The Pomodoro Timer app is built with Expo and React Native to help manage focused work and breaks effectively.

## ✨ Key Features

### Minimum Requirements ✅

- **Basic timer**: Work (25') and Break (5') modes
- **Background operation**: Timer continues running when the app is in the background
- **Notifications**: Receive a notification when a session ends
- **History storage**: Automatically save session history to AsyncStorage

### Extended Features ✅

- **Custom durations**: Adjust work, short break and long break lengths
- **Statistics chart**: View completed sessions and work time by day
- **Long break**: Take a long break after 4 work sessions
- **Presets**: Predefined settings (Classic, Extended, Quick)
- **Haptic feedback**: Vibration when a session completes
- **Keep awake**: Keep the screen on while the timer is running

## 🛠️ Technologies

- **Expo (React Native)**: App framework
- **TypeScript**: Type safety
- **NativeWind**: Tailwind-style utilities for React Native
- **react-native-chart-kit**: Charts for statistics
- **AsyncStorage**: Local data storage

### Packages / APIs

- `expo-notifications` - Push and local notifications
- `expo-keep-awake` - Keep the device awake
- `expo-haptics` - Haptic feedback
- `@react-native-async-storage/async-storage` - Local data storage
- `react-native-chart-kit` - Charts
- `react-native-svg` - SVG rendering for charts

## 🚀 Installation & Running

### System Requirements

- Node.js (v16+)
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go on a physical device)

### Setup

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd Pomodoro_React_Native
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npx expo start
   ```

4. Choose a platform
   - Press `i` to open the iOS Simulator
   - Press `a` to open the Android Emulator
   - Scan the QR code with Expo Go on a physical device

## 📱 How to Use

### Timer Screen

- **START**: Start a work or break session
- **PAUSE**: Pause the timer
- **RESET**: Reset the timer to the initial state
- **SKIP**: Move to the next session

### Statistics Screen

- View total completed sessions
- Track work and break durations
- Charts show data for the last 7 or 30 days
- See recent session history

### Settings Screen

- Customize work / short break / long break durations
- Adjust how many sessions until a long break
- Use presets:
  - **Classic Pomodoro**: 25 / 5 / 15 minutes
  - **Extended Focus**: 50 / 10 / 30 minutes
  - **Quick Sessions**: 15 / 3 / 10 minutes

## 🎯 Pomodoro Flow

1. **Work Session (25')**: Focused work
2. **Short Break (5')**: Short rest
3. Repeat 4 times
4. **Long Break (15')**: Longer rest

## 🔧 Project Structure

```
src/
├── components/          # UI Components
│   ├── TimerDisplay.tsx
│   ├── ControlButtons.tsx
│   └── SessionInfo.tsx
├── screens/            # App Screens
│   ├── TimerScreen.tsx
│   ├── HistoryScreen.tsx
│   └── SettingsScreen.tsx
├── utils/              # Utilities
│   ├── storage.ts      # AsyncStorage functions
│   ├── notifications.ts # Notification handling
│   ├── timer.ts        # Timer utilities
│   └── useTimer.ts     # Timer hook
└── types/              # TypeScript types
    └── index.ts
```

## 📊 Stored Data

The app stores local data including:

- **Settings**: Timer configuration
- **Sessions**: Completed session history
- **Daily Stats**: Daily statistics

## 🔔 Permissions

### iOS

- Notifications: Show alerts when a session completes

### Android

- `RECEIVE_BOOT_COMPLETED`: Restore notifications after reboot
- `WAKE_LOCK`: Keep CPU active while app is in background
- `VIBRATE`: Device vibration

## 🎨 UI / UX Features

- **Material-inspired design**: Clean, modern UI
- **Responsive**: Works across many devices
- **Dark/Light theme ready**: Easily extendable
- **Animations**: Smooth transitions and feedback
- **Accessibility**: Screen reader and accessibility support

## 🚀 Build & Deploy

### Development Build

```bash
npx expo run:ios
npx expo run:android
```

### Production Build

```bash
npx eas build --platform all
```

## 🙏 Acknowledgements

- [Pomodoro Technique®](https://francescocirillo.com/pages/pomodoro-technique) by Francesco Cirillo
- [Expo](https://expo.dev/) - Awesome React Native platform
- [React Native](https://reactnative.dev/) - Learn once, write anywhere

---

Made with ❤️ by Man Nguyen

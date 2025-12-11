# Flutter Clock App

A high-quality Clock application built with Flutter, ported from a React/Next.js codebase.

## Features
- **Analog Clock**: Smooth custom-painted clock face.
- **Alarm**: Persistent alarm manager with day scheduling.
- **Stopwatch**: Millisecond-precision timer with laps.
- **World Clock**: Track time in major cities.

## Setup Instructions

**Prerequisite:** You must have the [Flutter SDK](https://flutter.dev/docs/get-started/install) installed.

### 1. Initialize Platform Files
Since this project was generated without the Flutter CLI, you need to generate the platform-specific files (Android/iOS/Windows/etc.) by running:

```bash
flutter create .
```

### 2. Install Dependencies
Download the required packages listed in `pubspec.yaml`:

```bash
flutter pub get
```

### 3. Run the App
Launch the app on your connected device or emulator:

```bash
flutter run
```

## Structure
- `lib/main.dart`: Application entry point.
- `lib/providers/`: State management (Clock ticker, Alarm state).
- `lib/screens/`: UI screens for each feature.
- `lib/widgets/`: Reusable custom widgets (Analog Face).

# Clarus 📊

> Mobile application for personal financial planning with long-term projections, financial health analysis, and scenario comparison.

[![Expo](https://img.shields.io/badge/Expo-54.0-black?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)

## 📱 About the Project

**Clarus** is a mobile application developed with React Native and Expo that allows you to create personal financial reports, project asset growth over time, and analyze different investment scenarios.

### Key Features

- ✅ **100% Offline**: Works completely without internet connection
- 📈 **Financial Projections**: Automatic calculation of month-to-month asset growth
- 🎯 **Asset Goals**: Definition and tracking of financial goals
- 📊 **Financial Health Analysis**: Detailed metrics on income, expenses, and investments
- 📸 **Snapshots**: Capture "views" of the report for scenario comparison
- 🎨 **Modern Interface**: Carefully designed UI/UX with dark/light theme
- 💾 **Local Storage**: Data saved locally on the device

## 🚀 Features

### Financial Reports

- Create and edit custom reports
- Define monthly income and expenses
- Configure annual investment rate
- Set asset goals
- Highlight specific months for analysis

### Projections and Analysis

- **Month-to-Month Projection**: Detailed visualization of asset growth
- **Interactive Charts**: Graphical visualization of projections with goal line
- **Financial Health**: Analysis of:
  - Monthly Income vs. Expenses
  - Percentage of budget maintained
  - Investment return vs. costs
  - Forecast of when returns will cover all costs
  - Projection considering investments

### Snapshots and Comparisons

- Capture "views" of the report at specific moments
- Comparison between different snapshots
- Comparison of snapshot with current view
- Analysis of differences between scenarios

### Interface and UX

- **Tab Navigation**: Quick access to reports and settings
- **Custom Headers**: Consistent navigation across all screens
- **Reusable Components**: Standardized and consistent UI
- **Smooth Animations**: Transitions and visual feedback
- **Safe Area**: Respects device safe areas

## 🛠️ Technologies

### Core

- **[Expo](https://expo.dev)** (~54.0) - Framework and tools
- **[React Native](https://reactnative.dev)** (0.81.5) - Mobile framework
- **[TypeScript](https://www.typescriptlang.org)** (5.9) - Static typing
- **[Expo Router](https://docs.expo.dev/router/introduction/)** (6.0) - File-based routing

### State and Data

- **React Context API** - Global state management
- **AsyncStorage** - Local data persistence
- **Custom Hooks** - Reusable logic

### UI and Styling

- **React Native Reanimated** - Performant animations
- **React Native SVG** - Charts and visualizations
- **Expo Vector Icons** - Icons
- **Safe Area Context** - Safe area management

### Utilities

- **UUID** - Unique ID generation
- **DateTimePicker** - Date selection

## 📁 Project Structure

```
my-finances/
├── app/                    # Routes and screens (Expo Router)
│   ├── (tabs)/            # Tab navigation
│   └── report/            # Report screens
├── components/            # React components
│   ├── ui/                # Generic components
│   ├── reports/           # Report components
│   └── snapshots/          # Snapshot components
├── contexts/              # React Contexts
│   ├── ReportsContext.tsx # Report state
│   └── SettingsContext.tsx # Settings and flags
├── hooks/                 # Custom Hooks
├── services/              # Business logic
│   ├── calculations/      # Financial calculations
│   └── storage/           # Data persistence
├── models/                # TypeScript types
├── utils/                 # Utility functions
├── constants/            # Constants (colors, spacing, typography)
└── docs/                  # Documentation
    ├── ARCHITECTURE.md    # Detailed architecture
    └── next-steps/        # Future roadmap
```

For more details on the architecture, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 🏗️ Architecture

The project follows a layered architecture with clear separation of responsibilities:

```
UI Layer (app/, components/)
    ↓
Hooks / Contexts Layer (hooks/, contexts/)
    ↓
Services Layer (services/)
    ↓
Storage Layer (services/storage/)
```

### Principles

1. **Offline-first**: App works 100% offline
2. **Separation of Concerns**: UI, business logic, and persistence separated
3. **Unidirectional Dependencies**: UI → Hooks/Contexts → Services → Storage
4. **Strong Typing**: TypeScript throughout the codebase

### Golden Rules

- ❌ Never import services directly in UI components
- ❌ Contexts do not contain calculation logic
- ✅ Services are pure and testable
- ✅ UI does not know storage directly

## 🚦 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI (installed globally or via npx)
- Mobile device with Expo Go or emulator/simulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-finances
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - **Expo Go**: Scan the QR code with the Expo Go app
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal
   - **Web**: Press `w` in the terminal

### Available Scripts

```bash
npm start          # Start Expo server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run in browser
npm run lint       # Run linter
```

## 📚 Documentation

- **[Architecture](docs/ARCHITECTURE.md)**: Details about code structure and organization
- **[Roadmap](docs/README-ROADMAP-GERAL.md)**: Project evolution plan
- **[Services](services/README.md)**: Services documentation

## 🗺️ Roadmap

The project is organized into development phases:

- ✅ **Phase 0**: Consolidated Base (Completed)
- ✅ **Phase 1**: Architecture and Organization (Completed)
- ✅ **Phase 2**: Advanced Local Persistence (Planned)
- ✅ **Phase 3**: Internationalization PT/EN (Planned)
- 🔄 **Phase 4**: Publication Preparation (Planned)
- 🔄 **Phase 5**: Cloud Sync & Login (Planned)
- 🔄 **Phase 6**: Free vs Pro (Planned)
- 🔄 **Phase 7**: IAP Payments (Planned)
- 🔄 **Phase 8**: AdMob Ads (Planned)

For more details, see [docs/README-ROADMAP-GERAL.md](docs/README-ROADMAP-GERAL.md).

## 🎨 Design System

The project uses a consistent design system:

- **Colors**: Dark/light theme with palette defined in `constants/theme.ts`
- **Spacing**: Standardized spacing system in `constants/spacing.ts`
- **Typography**: Typographic hierarchy in `constants/typography.ts`
- **Components**: Library of reusable components in `components/ui/`

## 🔒 Privacy and Data

- **Local Storage**: All data is stored locally on the device
- **No Data Collection**: No data is sent to external servers
- **Offline-first**: Works completely without internet connection

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and for personal use.

## 👤 Author

**Jhonatan da Costa**

- GitHub: [@JhonatanSK](https://github.com/JhonatanSK)
- LinkedIn: [jhonatan-da-costa](https://www.linkedin.com/in/jhonatan-da-costa/)

---

**Note**: This project is under active development. Features may change and new features may be added.

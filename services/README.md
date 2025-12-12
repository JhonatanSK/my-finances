# Services Architecture

This directory contains all business logic and infrastructure services.

## Structure

```
services/
├── calculations/    # Financial calculations (projections, health)
├── storage/         # Data persistence abstraction
├── cloud/           # (Future) Cloud sync service
├── iap/             # (Future) In-app purchases
├── ads/             # (Future) Advertisements
└── index.ts         # Centralized exports
```

## Principles

1. **Pure Functions**: Services should be pure functions when possible
2. **No UI Dependencies**: Services never import from `app/` or `components/`
3. **Dependency Flow**: UI → Hooks/Contexts → Services → Storage
4. **Business Logic Isolation**: All calculation logic lives here

## Current Services

### calculations/
- `projections.ts`: Monthly projection generation
- `health.ts`: Financial health calculations

### storage/
- `StorageService.ts`: Abstract interface
- `LocalStorageService.ts`: AsyncStorage implementation

## Future Services

### cloud/ (Future)
- Cloud sync with Firebase/Backend
- User authentication
- Data backup/restore

### iap/ (Future)
- In-app purchase management
- Subscription handling
- Receipt validation

### ads/ (Future)
- Ad display logic
- Ad placement rules
- Revenue tracking

## Usage

Services are accessed through contexts and hooks, never directly from UI components.

```ts
// ✅ Correct: Through hook
const { getProjections } = useReports();

// ❌ Wrong: Direct import in component
import { generateProjections } from '@/services/calculations/projections';
```


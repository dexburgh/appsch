# Anaesthetic Billing Mobile App - Development Guide

## Overview

This guide provides comprehensive instructions for developing, testing, and deploying the Anaesthetic Billing Mobile App prototype. The app implements a theatre capture interface with offline-first architecture, real-time synchronization, QR code scanning, and voice input capabilities.

## Project Structure

```
anaesthetic-billing-mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx          # Authentication UI
│   │   └── CaseListScreen.tsx       # Case management UI
│   ├── components/
│   │   ├── CaseCaptureForm.tsx      # Case capture form with validation
│   │   └── QRScanner.tsx            # QR code scanner component
│   ├── services/
│   │   ├── syncService.ts           # Offline-first sync engine
│   │   └── voiceService.ts          # Voice input service
│   ├── storage/
│   │   └── offlineStorage.ts        # SQLite storage layer
│   ├── context/
│   │   ├── authStore.ts             # Zustand auth store
│   │   └── caseStore.ts             # Zustand case store
│   └── App.tsx                      # Root app with navigation
├── App.tsx                          # Entry point
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
└── README.md                        # User documentation
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React Native 19 + Expo | Cross-platform mobile app |
| **State Management** | Zustand | Lightweight state management |
| **Local Storage** | SQLite + AsyncStorage | Offline data persistence |
| **Navigation** | React Navigation | App routing and navigation |
| **UI Components** | React Native Paper, Ionicons | UI components and icons |
| **API Communication** | Axios | HTTP requests to backend |
| **Camera** | Expo Camera | QR code scanning |
| **Speech** | Expo Speech | Voice output |
| **Date/Time** | @react-native-community/datetimepicker | Date and time pickers |
| **Picker** | @react-native-picker/picker | Dropdown selector |

## Core Features

### 1. Offline-First Architecture

**Implementation**: `src/storage/offlineStorage.ts`

The app stores all data locally in SQLite, allowing full functionality without internet:

```typescript
// Save case locally
const newCase = await OfflineStorage.saveCase({
  patientId: 'patient_123',
  caseDate: '2026-04-20',
  procedureCode: 'ICD-10-CODE',
  // ... other fields
});

// Cases are stored with status tracking
// status: 'draft' | 'submitted' | 'synced'
```

**Database Schema**:
- **cases**: Stores procedure cases with full details
- **patients**: Stores patient information
- **sync_queue**: Tracks pending operations for sync
- **Indexes**: On status, date, and sync status for performance

### 2. Real-Time Sync Engine

**Implementation**: `src/services/syncService.ts`

Intelligent synchronization of offline data:

```typescript
// Automatic sync every 5 minutes
setInterval(() => SyncService.sync(), 5 * 60 * 1000);

// Manual sync trigger
await SyncService.sync();

// Monitor sync status
SyncService.addSyncListener((status) => {
  console.log(`Syncing: ${status.isSyncing}`);
  console.log(`Items pending: ${status.itemsToSync}`);
});
```

**Sync Process**:
1. Retrieve all unsynced items from queue
2. Process each item sequentially
3. Send to appropriate API endpoint
4. Mark as synced on success
5. Retry failed items automatically

### 3. Case Capture Form

**Implementation**: `src/components/CaseCaptureForm.tsx`

Comprehensive form for capturing case details:

```typescript
<CaseCaptureForm
  patientId="patient_123"
  onSuccess={(caseId) => navigation.goBack()}
  onCancel={() => navigation.goBack()}
/>
```

**Fields Captured**:
- Case date and time
- Facility and surgeon information
- Procedure code and description
- Anaesthetic start and end times
- Patient demographics (age, BMI, physical status)
- Complications and notes

**Validation**:
- Required fields checked before submission
- Date/time pickers for accurate entry
- Numeric validation for age and BMI
- Dropdown selection for physical status

### 4. QR Code Scanner

**Implementation**: `src/components/QRScanner.tsx`

Patient verification through QR code scanning:

```typescript
<QRScanner
  onScanSuccess={(data) => {
    // Process scanned QR code data
    console.log('Scanned:', data);
  }}
  onCancel={() => navigation.goBack()}
/>
```

**Features**:
- Real-time QR code detection
- Visual scanner frame overlay
- Automatic processing on successful scan
- Rescan capability
- Permission handling

### 5. Authentication

**Implementation**: `src/context/authStore.ts`

Secure user authentication with JWT tokens:

```typescript
const { login, register, logout, user, token } = useAuthStore();

// Login
await login('user@example.com', 'password');

// Register
await register('user@example.com', 'password', 'John', 'Doe');

// Logout
await logout();
```

**Features**:
- JWT token storage in AsyncStorage
- Automatic token restoration on app launch
- Secure password handling
- User profile management

### 6. State Management

**Case Store** (`src/context/caseStore.ts`):
```typescript
const { cases, currentCase, loading, createCase, updateCurrentCase } = useCaseStore();

// Create new case
const newCase = await createCase(caseData);

// Update current case
await updateCurrentCase({ status: 'submitted' });

// Load cases with filters
await loadCases({ status: 'draft', dateFrom: '2026-04-01' });
```

**Auth Store** (`src/context/authStore.ts`):
```typescript
const { user, token, login, logout, loading } = useAuthStore();
```

## Development Workflow

### Setup

1. **Install dependencies**
   ```bash
   cd /home/ubuntu/anaesthetic-billing-mobile
   npm install
   ```

2. **Configure environment**
   ```bash
   # Create .env file
   EXPO_PUBLIC_API_URL=http://localhost:3001/api/v1
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Run on emulator/device**
   ```bash
   # iOS Simulator
   npm run ios
   
   # Android Emulator
   npm run android
   
   # Web (for testing)
   npm run web
   ```

### Development Best Practices

1. **Component Structure**
   - Keep components focused and reusable
   - Use TypeScript for type safety
   - Extract complex logic into services

2. **State Management**
   - Use Zustand for global state
   - Keep local state in components
   - Avoid prop drilling

3. **Error Handling**
   - Try-catch blocks for async operations
   - User-friendly error messages
   - Console logging for debugging

4. **Performance**
   - Memoize expensive components
   - Use lazy loading for screens
   - Optimize database queries with indexes

5. **Testing**
   - Test offline functionality
   - Test sync with network interruptions
   - Verify data persistence

## API Integration

### Authentication Endpoints

```typescript
// Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password"
}
Response: { "token": "jwt_token", "user": {...} }

// Register
POST /auth/register
{
  "email": "user@example.com",
  "password": "password",
  "firstName": "John",
  "lastName": "Doe",
  "role": "practitioner"
}
Response: { "token": "jwt_token", "user": {...} }
```

### Case Endpoints

```typescript
// Create case
POST /cases
Headers: { "Authorization": "Bearer token" }
Body: { ...caseData }

// Get cases
GET /cases
Headers: { "Authorization": "Bearer token" }

// Update case
PUT /cases/:id
Headers: { "Authorization": "Bearer token" }
Body: { ...updates }

// Delete case
DELETE /cases/:id
Headers: { "Authorization": "Bearer token" }
```

## Database Schema

### Cases Table
```sql
CREATE TABLE cases (
  id TEXT PRIMARY KEY,
  patientId TEXT NOT NULL,
  caseDate TEXT NOT NULL,
  caseTime TEXT,
  facilityName TEXT,
  surgeonName TEXT,
  procedureCode TEXT,
  procedureDescription TEXT,
  anaestheticStartTime TEXT,
  anaestheticEndTime TEXT,
  patientAge INTEGER,
  patientBmi REAL,
  physicalStatus TEXT,
  complications TEXT,
  notes TEXT,
  status TEXT DEFAULT 'draft',
  createdAt TEXT,
  updatedAt TEXT,
  synced INTEGER DEFAULT 0,
  serverId TEXT
);
```

### Sync Queue Table
```sql
CREATE TABLE sync_queue (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  entityType TEXT NOT NULL,
  entityId TEXT NOT NULL,
  data TEXT NOT NULL,
  timestamp TEXT,
  synced INTEGER DEFAULT 0
);
```

## Troubleshooting

### Common Issues

**App won't start**
```bash
# Clear cache and reinstall
npm start -- --clear
rm -rf node_modules
npm install
```

**Sync not working**
- Verify API URL in .env
- Check network connectivity
- Verify auth token validity
- Check backend server status

**QR Scanner not working**
- Grant camera permissions
- Ensure adequate lighting
- Test with high-quality QR code

**Data not persisting**
- Verify SQLite database creation
- Check AsyncStorage permissions
- Review console logs

### Debug Mode

Enable detailed logging:
```typescript
// In App.tsx
if (__DEV__) {
  console.log('Debug mode enabled');
  // Add debug UI components
}
```

## Performance Optimization

1. **Database Optimization**
   - Use indexes on frequently queried fields
   - Batch operations when possible
   - Clean up old sync queue items

2. **Memory Management**
   - Unsubscribe from listeners on unmount
   - Clear large data structures
   - Use React.memo for expensive components

3. **Network Optimization**
   - Batch sync operations
   - Compress data before transmission
   - Implement exponential backoff for retries

## Security Considerations

1. **Authentication**
   - Store JWT tokens securely
   - Refresh tokens before expiration
   - Clear tokens on logout

2. **Data Protection**
   - Encrypt sensitive data in AsyncStorage
   - Use HTTPS for all API calls
   - Validate input on client and server

3. **Permissions**
   - Request camera permission for QR scanner
   - Request microphone permission for voice
   - Handle permission denials gracefully

## Deployment

### Build for iOS
```bash
eas build --platform ios
```

### Build for Android
```bash
eas build --platform android
```

### Release Configuration
```json
{
  "expo": {
    "name": "Anaesthetic Billing",
    "slug": "anaesthetic-billing",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png"
    },
    "plugins": [
      ["expo-camera"],
      ["expo-speech"],
      ["expo-sqlite"]
    ]
  }
}
```

## Future Enhancements

- [ ] Offline maps integration
- [ ] Photo capture for documentation
- [ ] Voice-to-text for notes
- [ ] Biometric authentication
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Push notifications
- [ ] Case templates
- [ ] Medical scheme integration

## Resources

- [React Native Documentation](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Navigation](https://reactnavigation.org)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

## Support

For questions or issues:
- Review the README.md for user documentation
- Check the troubleshooting section above
- Review console logs for error messages
- Contact the development team

---

**Last Updated**: April 20, 2026
**Version**: 1.0.0

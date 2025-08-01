# Task Manager Mobile App

A React Native mobile application for the Task Manager project, built with Expo and TypeScript.

## 🚀 Features

- **User Authentication**: Login with email and password
- **Project Management**: View and select projects
- **Task Management**: View tasks with priorities and due dates
- **Real-time Updates**: Pull-to-refresh functionality
- **Beautiful UI**: Modern design with smooth animations
- **Cross-platform**: Works on iOS and Android

## 📱 Screenshots

- **Login Screen**: Clean authentication interface
- **Dashboard**: Project selector and task overview
- **Task List**: View tasks with priority badges
- **Statistics**: Quick stats overview

## 🛠 Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe development
- **React Navigation**: Navigation between screens
- **Axios**: HTTP client for API calls
- **Expo Router**: File-based routing

## 📋 Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd task-manager-mobile
npm install
```

### 2. Start the Backend

Make sure the backend server is running:

```bash
cd ../backend
npm run dev
```

### 3. Start the Mobile App

```bash
cd task-manager-mobile
npm start
```

### 4. Run on Device/Simulator

- **iOS**: Press `i` in the terminal or scan QR code with Expo Go app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` in the terminal

## 📁 Project Structure

```
task-manager-mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx      # Authentication screen
│   │   └── DashboardScreen.tsx  # Main dashboard
│   └── services/
│       └── api.ts              # API service functions
├── App.tsx                     # Main app component
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🔧 Configuration

### API Configuration

The mobile app connects to the backend API. Update the base URL in `src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change for production
});
```

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

## 📱 Features in Detail

### Authentication
- Email and password login
- Error handling and validation
- Automatic navigation to dashboard

### Dashboard
- Project selector with horizontal scroll
- Task overview with priority badges
- Quick statistics
- Pull-to-refresh functionality

### Task Management
- View tasks with descriptions
- Priority levels (Low, Medium, High, Urgent)
- Due date display
- Completion status

### UI/UX
- Modern, clean design
- Smooth animations
- Responsive layout
- Loading states
- Error handling

## 🔮 Future Enhancements

- [ ] **Task Creation**: Add new tasks from mobile
- [ ] **Task Editing**: Edit task details
- [ ] **Push Notifications**: Due date reminders
- [ ] **Offline Support**: Work without internet
- [ ] **Dark Mode**: Theme support
- [ ] **Biometric Auth**: Fingerprint/Face ID
- [ ] **Widgets**: Home screen widgets

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npm start -- --clear
   ```

2. **iOS Simulator not working**:
   ```bash
   xcrun simctl boot "iPhone 15"
   ```

3. **Android Emulator issues**:
   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

4. **API connection issues**:
   - Check if backend is running on port 5000
   - Verify network connectivity
   - Check firewall settings

### Development Tips

- Use Expo Go app for quick testing
- Enable hot reload for faster development
- Use React Native Debugger for debugging
- Test on both iOS and Android regularly

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ using React Native and Expo**

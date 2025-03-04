# G-Security Project Knowledge Transfer Document

1. Project Overview
   Project Name: G-Security
   Description: Facility to security to register fines for violations and can able to approve passes etc.
   Frontend: React Native
   Navigation: React Navigation
   State Management : Redux
   Backend: Nodejs
   Database: Sql server

2. Folder Structure
   /GSecurityFrontend
   │── /android # Android-specific files
   │── /assets # Static assets (images, fonts, etc.)
   │── /constants # API URLs and configuration files
   │── /hooks # Reusable search functions
   │── /screens # Screen components
   │ │── /auth # Authentication-related screens
   │ │ │── /login # Login screen
   │ │ │── /splash # Splash screen
   │── /pages # UI components used across multiple screens
   │ │── /SearchCards # Cards displayed on HomeScreen
   │ │ │── gatepassCard.js # Gate pass card component
   │ │ │── skeletonCard.js # Skeleton loading card
   │ │ │── violationCard.js # Violation card component
   │ │ │── visitorsCard.js # Visitor card component
   │── /Tabs # Main tab navigation screens
   │ │── Camera.js # QR Code scanner screen
   │ │── Home.js # Main home screen with icons and functionalities
   │ │── Profile.js # Security profile tab
   │ │── Violations.js # Violations tab
   │── /utils # Utility functions and helper components
   │ │── AddGatePass.js # Gate pass form component
   │ │── ViolationsTabs.js # Violation-related tabs
   │── /Vms # Visitor and Violation management system
   │ │── AddViolations.js # Form to add violations
   │ │── AddVisitor.js # Visitor entry form
   │ │── CCTV.js # CCTV monitoring module
   │ │── Communication.js # Broadcast messages and chat system
   │ │── Main.js # Home Tabs component (includes QR Code tab, profile tab, etc.)
   │ │── MainNavigator.js # Routing and navigation between pages
   │── /store # Redux state management
   │ │── /slices # Redux slices for state management
   │ │ │── authSlice.js # Authentication state
   │ │ │── gatepassSlice.js # Gate pass state
   │ │ │── homeSlice.js # Home state
   │ │ │── loggerSlice.js # Logger state
   │ │ │── profileSlice.js # Profile state
   │ │ │── violationSlice.js # Violation state
   │ │── store.js # Central Redux store configuration
   │── navigationRef.js # Navigation reference for global access
   │── app.json # App configuration file
   │── eas.json # Expo Application Services configuration
   │── index.js # Main entry point for React Native
   │── package.json # Project dependencies and scripts

3. Project Setup & Installation
   => npm install
   => npx expo start
   => if development build is there press a directly to open on android
   => if no dev build there then press s to switch to expo go and press a to open android
   => in mobile install expo go from playstore and scan the qr code given in teriminal

# Build

npx expo prebuild
development build - eas build -platform android --profile development
productions build - eas build -p android --profile production

# expo dev credentials

username / email : jtamada@gitam.edu
password : Jeevan@76610

4. Deployment

login to Linux server using putty or winscp and paste the local code into linux server
npm install
npm run dev or pm2 start app.js

5. Common Issues

=> if Backend sever is not started app will show blank screens and infinte loading etc
=> please check backend before starting frontend app
=> check api urls
=> if google-services.json not found errors came then delete the android folder and rebuild the app
=> paste the google-services.json file in android/app/google-services.json - paste in this path

6. Packages used (please install this all packages before starting project to avoid errors use Development build only expo go wont suppport some native modules)
   "dependencies": {
   "@expo-google-fonts/poppins": "^0.2.3",
   "@expo/vector-icons": "14.0.3",
   "@react-aria/utils": "^3.25.3",
   "@react-native-async-storage/async-storage": "^1.23.1",
   "@react-native-camera-roll/camera-roll": "^7.9.0",
   "@react-native-community/cli-tools": "^15.1.2" ,
   "@react-navigation/bottom-tabs": "^6.6.1",
   "@react-navigation/native": "^6.1.18",
   "@react-navigation/native-stack": "^6.11.0",
   "@reduxjs/toolkit": "^2.5.0",
   "expo": "~52.0.20",
   "expo-calendar": "~14.0.5",
   "expo-constants": "~17.0.5",
   "expo-dev-client": "~5.0.7",
   "expo-device": "~7.0.2",
   "expo-file-system": "~18.0.6",
   "expo-image-picker": "~16.0.3",
   "expo-linking": "~7.0.3",
   "expo-media-library": "~17.0.4",
   "expo-notifications": "~0.29.13",
   "expo-status-bar": "~2.0.0",
   "jwt-decode": "^4.0.0",
   "moment": "^2.30.1",
   "native-base": "^3.4.28",
   "react": "^18.3.1",
   "react-dom": "^18.3.1",
   "react-native": "0.76.6",
   "react-native-safe-area-context": "^4.12.0",
   "react-native-screens": "~4.4.0",
   "react-native-svg": "^15.8.0",
   "react-native-vector-icons": "^10.2.0",
   "react-native-vision-camera": "^4.6.3",
   "react-redux": "^9.2.0",
   "redux-persist": "^6.0.0"
   },
   "devDependencies": {
   "@babel/core": "^7.20.0"
   },
   "private": true,
   "expo": {
   "doctor": {
   "reactNativeDirectoryCheck": {
   "exclude": [
   "@expo-google-fonts/poppins",
   "@react-aria/utils",
   "@react-native-community/masked-view"
   ]
   }
   }
   }

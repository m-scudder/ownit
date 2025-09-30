export default {
  expo: {
    name: "ownit",
    slug: "ownit",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "ownit.now",
      googleServicesFile: "./GoogleService-Info.plist",
      buildNumber: "1"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "ownit.now",
      googleServicesFile: "./google-services.json",
      versionCode: 1
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-font",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "./plugins/withModuleHeaders"
    ],
    extra: {
      // You can add environment-specific configs here
      firebase: {
        apiKey: "AIzaSyA1hDi2QhlUzj-cKfbqTIaxhRHb8ThcB5k",
        authDomain: "ownit-prod.firebaseapp.com",
        projectId: "ownit-prod",
        storageBucket: "ownit-prod.firebasestorage.app",
        messagingSenderId: "8785305095",
        appId: "1:8785305095:ios:7ff17e4f1325859fa814a2"
      }
    }
  }
};

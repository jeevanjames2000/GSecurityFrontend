import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider } from "native-base";
import store, { persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import Login from "./screens/auth/Login";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { CustomTheme } from "./screens/customTheme";
import Main from "./screens/pages/Main";
import SplashScreen from "./screens/auth/Splash";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef, navigate } from "./navigationRef";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
async function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}
async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError("Permission not granted for push notifications!");
      return;
    }
    const projectId = "9adc7d3d-e156-495f-90af-86304d7a50b9";
    if (!projectId) {
      handleRegistrationError("Project ID not found");
      return;
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;
      await AsyncStorage.setItem("pushToken", pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError(
      "Must use a physical device for push notifications"
    );
  }
}
const Stack = createNativeStackNavigator();
export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  console.log("expoPushToken: ", expoPushToken);
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    async function setupPushNotifications() {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
      }
    }

    setupPushNotifications();
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const screen = response.notification.request.content.data?.screen;
        const params = response.notification.request.content.data?.params || {};
        if (screen) {
          navigate(screen, params);
        }
      });
    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer ref={navigationRef}>
          <NativeBaseProvider theme={CustomTheme}>
            <StatusBar style="auto" />
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: "#007367" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            >
              <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Main"
                component={Main}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NativeBaseProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

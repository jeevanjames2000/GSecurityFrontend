import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../auth/Login";
import Home from "./Tabs/Home";
import AddVisitor from "./Vms/AddVisitor";
import AddViolations from "./Vms/AddViolations";
import CCTV from "./CCTV";
import QrCamera from "./Tabs/Camera";
import AddGatepass from "./utils/AddGatepass";
import ViolationsTabs from "./utils/ViolationsTabs";

import Communication from "./Communication";
const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#673AB7",
        },
        headerTintColor: "#fff",
        tabBarHideOnKeyboard: true,
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CCTV"
        component={CCTV}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddViolations"
        component={AddViolations}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Camera"
        component={QrCamera}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddVisitor"
        component={AddVisitor}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ViolationTabs"
        component={ViolationsTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Create Pass"
        component={AddGatepass}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Communication"
        component={Communication}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

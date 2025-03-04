import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, BackHandler, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Profile from "./Tabs/Profile";
import MainNavigator from "./MainNavigator";
import { Image } from "native-base";
import QrCamera from "./Tabs/Camera";
import Constants from "../../constants/Constants";
const Tab = createBottomTabNavigator();
export default function Main({ route }) {
  const navigation = useNavigation();
  const icons = {
    MainNavigator: {
      uri: `${Constants.GSecurity_NGROK_API_URL}/auth/getImage/home.png`,
    },
    QR: {
      uri: `${Constants.GSecurity_NGROK_API_URL}/auth/getImage/qr-code1.png`,
    },
    Profile: {
      uri: `${Constants.GSecurity_NGROK_API_URL}/auth/getImage/user1.png`,
    },
  };

  return (
    <Tab.Navigator
      initialRouteName="MainNavigator"
      screenOptions={({ route }) => ({
        tabBarLabel: "",
        tabBarIcon: ({ focused, color }) => {
          const label =
            route.name === "MainNavigator"
              ? "Home"
              : route.name === "Profile"
              ? "Profile"
              : "QR";
          const iconSource = icons[route.name];
          return (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 15,
                width: "100%",
              }}
            >
              <Image
                source={iconSource}
                alt={`${label} Icon`}
                resizeMode="contain"
                style={{
                  alignItems: "center",
                  width: route.name === "QR" ? 50 : 30,
                  height: route.name === "QR" ? 50 : 30,
                  tintColor: focused ? "green" : "gray",
                  padding: route.name === "QR" ? 10 : 0,
                }}
              />
              {route.name !== "QR" && (
                <Text
                  style={{
                    color,
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {label}
                </Text>
              )}
            </View>
          );
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#007367",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          backgroundColor: "#fff",
          justifyContent: "center",
          paddingTop: 15,
          alignItems: "center",
        },
      })}
    >
      <Tab.Screen
        name="MainNavigator"
        component={MainNavigator}
        options={{
          headerTitle: "",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="QR"
        component={QrCamera}
        options={{
          headerStyle: {
            backgroundColor: "#007367",
          },
          headerTitle: () => null,
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          tabBarLabel: "",
          headerShown: true,
          headerLeft: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#007367",
                width: "100%",
                height: "auto",
                marginLeft: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={{ marginLeft: 5, alignItems: "center" }}
              >
                <Ionicons name="arrow-back" size={30} color={"#fff"} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerStyle: {
            backgroundColor: "#007367",
          },
          headerTitle: "Profile",
          headerTintColor: "#fff",
          headerTitleAlign: "center",

          headerTitleStyle: {
            fontSize: 30,
          },
        }}
      />
      {}
    </Tab.Navigator>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { View, Image, Spinner, useToast, Box, Text } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "../../constants/Constants";
export default function SplashScreen({ navigation, route }) {
  const [expired, setExpired] = useState(false);
  const toast = useToast();

  const checkSession = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setTimeout(() => {
          navigation.replace("Login");
        }, 1000);
        return;
      }
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(new Date().getTime() / 1000);
      const isExpired = currentTime > decoded.exp;
      setExpired(isExpired);
      if (isExpired) {
        await AsyncStorage.removeItem("token");
        toast.show({
          render: () => (
            <Box
              bg="red.300"
              px="6"
              py="2"
              rounded="md"
              shadow={2}
              position={"absolute"}
              right={3}
            >
              <Text>Session expired, Please log in again.</Text>
            </Box>
          ),
          placement: "top-right",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          navigation.replace("Login", {
            message: "Session expired, please log in again.",
          });
        }, 1000);
      } else {
        setTimeout(() => {
          navigation.replace("Main", { decoded });
        }, 1000);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  }, [navigation]);
  useEffect(() => {
    checkSession();
  }, [checkSession]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Image
        source={{
          uri: `${Constants.GSecurity_NGROK_API_URL}/auth/getImage/gitam-logo-circle.png`,
        }}
        alt="Gitam-Logo"
        style={{
          width: "100%",
          height: "90%",
          backgroundColor: "transparent",
        }}
        resizeMode="contain"
      />
      <Spinner size="lg" color="green" />
    </View>
  );
}

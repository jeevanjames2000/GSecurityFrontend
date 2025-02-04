import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Box, HStack, Image, Pressable, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
export default function Profile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { profile, image } = useSelector((state) => state.profile);
  const [storedProfile, setStoredProfile] = useState(null);
  const [storedImage, setStoredImage] = useState(null);

  useEffect(() => {
    const loadProfileFromStorage = async () => {
      const storedUser = await AsyncStorage.getItem("authUser");
      const storedImage = await AsyncStorage.getItem("profileImage");

      if (!profile && storedUser) {
        setStoredProfile(JSON.parse(storedUser));
      }
      if (storedImage) {
        setStoredImage(storedImage);
      }
    };
    loadProfileFromStorage();
  }, [profile]);

  const userProfile = profile || storedProfile;
  const profileImage = image || storedImage;

  const studentInfo = userProfile?.stdprofile?.[0]
    ? {
        Name: userProfile.stdprofile[0].name || "N/A",
        Role: userProfile.role || "N/A",
        Department: userProfile.stdprofile[0].branch_code || "N/A",
        Email: userProfile.stdprofile[0].emailid || "N/A",
        Phone: userProfile.stdprofile[0].mobile || "N/A",
        Campus: userProfile.stdprofile[0].campus || "N/A",
      }
    : null;

  const studKeys = studentInfo ? Object.keys(studentInfo) : [];
  const studValues = studentInfo ? Object.values(studentInfo) : [];

  const handleLogout = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Splash" }],
    });
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("authUser");
    await AsyncStorage.removeItem("profileImage");
    dispatch(clearProfile());
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <VStack
          justifyContent={"space-between"}
          alignItems={"center"}
          paddingBottom={10}
          flex={1}
          position={"fixed"}
          top={10}
        >
          <Image
            source={{ uri: storedImage }}
            alt="Alternate Text"
            size="2xl"
            borderColor={"#007367"}
            borderWidth={4}
            borderRadius={"xl"}
            borderStyle={"solid"}
          />
          <VStack space={1} alignItems="flex-start">
            {[0, 1, 2, 3, 4, 5].map((each) => (
              <Box
                key={each}
                flexDirection="row"
                alignItems="flex-start"
                flexWrap="wrap"
                width="100%"
              >
                <Text
                  fontSize="lg"
                  width="40%"
                  paddingLeft={6}
                  fontWeight="bold"
                >
                  {studKeys[each]}:
                </Text>
                <Text
                  fontSize="lg"
                  width="60%"
                  color={
                    studKeys[each] === "Role"
                      ? "#007367"
                      : studKeys[each] === "Name"
                      ? "#000000"
                      : "#706F6F"
                  }
                  paddingLeft={2}
                  flexShrink={1}
                >
                  {studValues[each]}
                </Text>
              </Box>
            ))}
          </VStack>
          <Pressable
            bg="#007367"
            my={10}
            borderRadius="md"
            width="100%"
            p={3}
            alignItems="center"
            onPress={handleLogout}
          >
            <HStack alignItems="center" justifyContent="center" space={2}>
              <Text
                textAlign="center"
                fontSize={20}
                fontWeight={600}
                color="#fff"
              >
                Logout
              </Text>
              <Ionicons name="log-out-outline" size={20} color="white" />
            </HStack>
          </Pressable>
        </VStack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  head_1: {
    color: "#000",
    fontWeight: 700,
    fontSize: 20,
  },
  head_2: {
    color: "#000",
    fontWeight: 700,
    fontSize: 22,
    marginBottom: 8,
  },
});

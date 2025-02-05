import React, { useEffect, useState } from "react";
import { Box, Text, Image, HStack, VStack, Badge, View } from "native-base";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { fetchLeaves } from "../../../store/slices/homeSlice";
export default function ViolationsCard() {
  const dispatch = useDispatch();
  const { cardData, image, noProfile, profile, leaves } = useSelector(
    (state) => state.home
  );
  console.log("profile: ", profile.token);
  // useEffect(() => {
  //   if (
  //     profile?.role === "student" &&
  //     profile?.stdprofile[0]?.hostler === "Y"
  //   ) {
  //     dispatch(fetchLeaves(profile?.stdprofile[0]?.regdno, profile.token));
  //   }
  // }, [profile, dispatch]);
  const navigation = useNavigation();
  const handleShowViolations = () => {
    navigation.navigate("AddViolations");
  };
  if (noProfile || profile == null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: "http://172.17.58.151:9000/auth/getImage/Group 11.png",
          }}
          alt="No Results icon"
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      </View>
    );
  }
  const CustomButton = ({
    onPress,
    iconName,
    text,
    bgColor,
    textColor,
    borderColor,
  }) => (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: bgColor,
        borderWidth: borderColor ? 0.5 : 0,
        borderColor: borderColor,
        borderRadius: 20,
        paddingVertical: 10,
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
        flex: 1,
        flexDirection: "row",
        elevation: 3,
      }}
      _pressed={{ opacity: 0.8 }}
    >
      <MaterialIcons name={iconName} size={20} color={textColor} />
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: textColor,
          textAlign: "center",
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
  const ViolationsStack = ({
    cardData,
    handleShowViolations,
    handleAddViolation,
  }) => (
    <Box bg="#F5F5F5" borderRadius="xl" padding="4" marginTop="4">
      <Text fontSize="lg" fontWeight="bold" color="#007367" marginBottom="4">
        Violations ({cardData?.length || 0})
      </Text>
      <HStack justifyContent="space-between" space={4}>
        <CustomButton
          text="Add"
          bgColor="#007367"
          textColor="#fff"
          onPress={() => navigation.navigate("AddViolations")}
        />
      </HStack>
    </Box>
  );
  const LeavesPermissionsStack = ({ handleCheckIn, handleCheckOut }) => (
    <Box bg="#F5F5F5" borderRadius="xl" padding="4" marginTop="4">
      <Text fontSize="lg" fontWeight="bold" color="#007367" marginBottom="4">
        Leaves & Permissions ({leaves?.length || 0})
      </Text>
      <HStack justifyContent="space-between" space={4}>
        <CustomButton
          text="Check In"
          bgColor="#fff"
          textColor="#37474F"
          borderColor="#37474F"
        />
        <CustomButton text="Check Out" bgColor="#007367" textColor="#fff" />
      </HStack>
    </Box>
  );
  return (
    <Box padding="6" shadow="9" bg="#fff" borderRadius="xl">
      <HStack space="lg">
        <Image
          source={{ uri: image }}
          alt="Profile Image"
          size="lg"
          borderRadius="xl"
        />
        <VStack space="2" flex={1}>
          <Text
            color="#007367"
            fontWeight="bold"
            fontSize="lg"
            flexWrap="wrap"
            flex={1}
          >
            {profile?.stdprofile?.[0]?.name || "Name not available"}
          </Text>
          <Text fontWeight="semibold" fontSize="md">
            {profile?.role || "Role not available"}
          </Text>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            space={2}
            flexWrap="wrap"
          >
            <Text fontWeight="semibold" fontSize="md">
              {profile?.stdprofile?.[0]?.regdno || "Not available"}
            </Text>
            <Badge
              colorScheme={
                profile?.stdprofile?.[0]?.status === "A" ? "success" : "error"
              }
              _text={{ fontSize: "md" }}
              borderRadius={5}
            >
              {profile?.stdprofile?.[0]?.status === "A" ? "Active" : "Inactive"}
            </Badge>
          </HStack>
        </VStack>
      </HStack>
      <VStack space={1.5} marginTop="6">
        {[
          { key: "Batch", value: profile?.stdprofile?.[0]?.batch },
          { key: "Department", value: profile?.stdprofile?.[0]?.branch_code },
          { key: "Campus", value: profile?.stdprofile?.[0]?.campus },
          { key: "Email", value: profile?.stdprofile?.[0]?.emailid },
          { key: "Mobile", value: profile?.stdprofile?.[0]?.mobile },
        ].map((item, index) => (
          <Box
            key={index}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize="md" fontWeight={"bold"}>
              {item.key}
            </Text>
            <Text
              fontSize="md"
              color={
                item.key === "Role"
                  ? "#007367"
                  : item.key === "Name"
                  ? "#000000"
                  : "#706F6F"
              }
              paddingLeft={4}
            >
              {item?.value || "Not available"}
            </Text>
          </Box>
        ))}
      </VStack>
      {}
      <ViolationsStack
        cardData={cardData}
        handleShowViolations={handleShowViolations}
      />
      {(profile?.role === "student" &&
        profile?.stdprofile[0]?.hostler === "Y") ||
        ("" && <LeavesPermissionsStack />)}
    </Box>
  );
}

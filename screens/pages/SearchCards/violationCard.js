import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  HStack,
  VStack,
  Badge,
  useToast,
  View,
} from "native-base";
import { Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
export default function ViolationsCard() {
  const toast = useToast();
  const { cardData, image, noProfile, profile } = useSelector(
    (state) => state.home
  );
  const { profile: SecurityProfile } = useSelector((state) => state.profile);
  const [leaves, setLeaves] = useState(null);
  const fetchLeavePermissions = async () => {
    try {
      const url = `https://studentmobileapi.gitam.edu/Gsecurity_permissionstatus?regdno=${profile.stdprofile[0].regdno}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${profile.token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch leave permissions.");
      }
      const data = await response.json();
      setLeaves(data);
    } catch (error) {}
  };
  if (!profile || !cardData) {
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
  useEffect(() => {
    if (
      profile?.stdprofile[0]?.hostler === "Y" &&
      profile?.role === "student"
    ) {
      fetchLeavePermissions();
    }
  }, [profile?.stdprofile[0], profile?.token]);
  const navigation = useNavigation();
  const handleShowViolations = () => {
    navigation.navigate("AddViolations");
  };
  const postCheckInOut = async (status, data) => {
    const API_URL = "https://studentmobileapi.gitam.edu/PostCheckinout";
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permissions: [
            {
              ...data,
              status: status,
            },
          ],
        }),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleLeavePermissions = (type) => {
    Alert.alert(
      "Confirmation",
      `Are you sure you want to ${
        type === "checkin" ? "Check In" : "Check Out"
      }?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            const checkInData = {
              regdno: profile?.stdprofile[0]?.regdno,
              genarated_by: SecurityProfile?.userName || "security",
            };
            const checkOutData = {
              regdno: profile?.stdprofile[0]?.regdno,
              name: profile?.stdprofile[0]?.name,
              hostelacno: profile?.stdprofile[0]?.hosteL_ACNO,
              gender: profile?.stdprofile[0]?.gender,
              parent_mobile: profile?.stdprofile[0]?.parent_mobile,
              campus: profile?.stdprofile[0]?.campus,
              genarated_by: SecurityProfile?.userName || "security",
            };

            const response = await postCheckInOut(
              type,
              type === "checkin" ? checkInData : checkOutData
            );

            if (response.status === "success") {
              toast.show({
                render: () => (
                  <Box bg="green.300" px="4" py="2" rounded="md" shadow={2}>
                    {response?.message}
                  </Box>
                ),
                placement: "top-right",
                duration: 3000,
              });
            } else {
              const errorMessage = response?.message || "Already in campus";
              toast.show({
                render: () => (
                  <Box bg="red.300" px="4" py="2" rounded="md" shadow={2}>
                    {errorMessage}
                  </Box>
                ),
                placement: "top-right",
                duration: 3000,
                isClosable: true,
              });
              throw new Error(response.message || "Something went wrong");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const CustomButton = ({
    onPress,
    iconName,
    text,
    bgColor,
    textColor,
    borderColor,
    status,
  }) => (
    <Pressable
      onPress={onPress}
      disabled={status}
      style={({ pressed }) => [
        {
          backgroundColor: bgColor,
          borderWidth: 0.5,
          borderColor: borderColor,
          borderRadius: 20,
          paddingVertical: 10,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          flexDirection: "row",
          elevation: 3,
          opacity: status ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
    >
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
  const ViolationsStack = ({ cardData }) => (
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
  const LeavesPermissionsStack = () => {
    const isDisabled =
      !leaves?.getpermissionstatus || leaves.getpermissionstatus.length === 0;

    return (
      <Box bg="#F5F5F5" borderRadius="xl" padding="4" marginTop="4">
        <Text fontSize="lg" fontWeight="bold" color="#007367" marginBottom="4">
          Leaves & Permissions ({leaves?.getpermissionstatus?.length || 0})
        </Text>
        <HStack justifyContent="space-between" space={4}>
          <CustomButton
            text="Check In"
            bgColor={
              isDisabled || leaves?.getpermissionstatus[0]?.isapprove === "I"
                ? "#fff"
                : "#007367"
            }
            textColor={
              isDisabled || leaves?.getpermissionstatus[0]?.isapprove === "I"
                ? "black"
                : "#fff"
            }
            borderColor="#37474F"
            status={
              isDisabled || leaves?.getpermissionstatus[0]?.isapprove === "I"
            }
            onPress={() => handleLeavePermissions("checkin")}
          />
          <CustomButton
            text="Check Out"
            bgColor={
              isDisabled || leaves?.getpermissionstatus[0]?.isapprove === "L"
                ? "#fff"
                : "#007367"
            }
            textColor={
              isDisabled || leaves?.getpermissionstatus[0]?.isapprove === "L"
                ? "black"
                : "#fff"
            }
            status={
              isDisabled || leaves?.getpermissionstatus[0]?.isapprove === "L"
            }
            onPress={() => handleLeavePermissions("checkout")}
          />
        </HStack>
      </Box>
    );
  };

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
                (profile?.role === "student" &&
                  profile?.stdprofile?.[0]?.status === "S") ||
                (profile?.role === "staff" &&
                  profile?.stdprofile?.[0]?.status === "A")
                  ? "success"
                  : "error"
              }
              _text={{ fontSize: "md" }}
              borderRadius={5}
            >
              {(profile?.role === "student" &&
                profile?.stdprofile?.[0]?.status === "S") ||
              (profile?.role === "staff" &&
                profile?.stdprofile?.[0]?.status === "A")
                ? "Active"
                : "Inactive"}
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
      <ViolationsStack
        cardData={cardData}
        handleShowViolations={handleShowViolations}
      />
      {profile?.role === "student" &&
        profile?.stdprofile[0]?.hostler === "Y" && <LeavesPermissionsStack />}
    </Box>
  );
}

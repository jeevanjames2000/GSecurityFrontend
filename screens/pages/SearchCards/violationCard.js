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
import { Pressable, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import moment from "moment";
export default function ViolationsCard() {
  const toast = useToast();
  const { cardData, image, noProfile, profile } = useSelector(
    (state) => state.home
  );
  const { profile: SecurityProfile } = useSelector((state) => state.profile);
  const [more, setMore] = useState(false);
  const [leaves, setLeaves] = useState(null);
  const fetchLeavePermissions = async () => {
    try {
      console.log(`Bearer ${profile.token}`);
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
            uri: `${Constants.GSecurity_API_URL}/auth/getImage/Group 11.png`,
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
      !leaves?.getpermissionstatus || leaves?.getpermissionstatus?.length === 0;
    const permissionData = leaves?.getpermissionstatus[0];
    const permissionDate = permissionData?.fromdate
      ? moment(permissionData.fromdate, "DD-MMM-YYYY").format("YYYY-MM-DD")
      : null;
    const currentDate = moment().format("YYYY-MM-DD");
    const isDateMatched = permissionDate === currentDate;
    const fromTime = moment(permissionData?.fromtime, "HH");
    const toTime = moment(permissionData?.totime, "HH.mm");
    const now = moment();
    const canCheckIn = now.isBetween(
      fromTime.clone().subtract(30, "minutes"),
      toTime,
      "minutes",
      "[)"
    );
    const canCheckOut = now.isBetween(
      fromTime,
      toTime.clone().add(30, "minutes"),
      "minutes",
      "[)"
    );
    if (!isDateMatched) return null;
    return (
      <Box bg="#F5F5F5" borderRadius="xl" padding="4" marginTop="4">
        <VStack
          flex={1}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="#007367"
            marginBottom="4"
          >
            Permissions ({leaves?.getpermissionstatus?.length || 0})
          </Text>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="gray.500"
            marginBottom="3"
          >
            {permissionData?.fromdate} | {permissionData?.fromtime} -{" "}
            {permissionData?.totime}
          </Text>
        </VStack>
        <HStack justifyContent="space-between" space={4}>
          <CustomButton
            text="Check In"
            bgColor={
              isDisabled ||
              !canCheckIn ||
              permissionData?.isapprove === "I" ||
              permissionData?.isapprove === "Y"
                ? "#fff"
                : "#007367"
            }
            textColor={
              isDisabled ||
              !canCheckIn ||
              permissionData?.isapprove === "I" ||
              permissionData?.isapprove === "Y"
                ? "black"
                : "#fff"
            }
            status={
              isDisabled ||
              !canCheckIn ||
              permissionData?.isapprove === "I" ||
              permissionData?.isapprove === "Y"
            }
            onPress={() => handleLeavePermissions("checkin")}
          />
          <CustomButton
            text="Check Out"
            bgColor={
              isDisabled || !canCheckOut || permissionData?.isapprove === "L"
                ? "#fff"
                : "#007367"
            }
            textColor={
              isDisabled || !canCheckOut || permissionData?.isapprove === "L"
                ? "black"
                : "#fff"
            }
            status={
              isDisabled || !canCheckOut || permissionData?.isapprove === "L"
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
        <VStack space="0.5" flex={1}>
          <Text color="#007367" fontWeight="bold" fontSize="lg" flexWrap="wrap">
            {profile?.stdprofile?.[0]?.name || "N/A"}
          </Text>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            space={1}
            flexWrap="wrap"
          >
            <Text fontWeight="semibold" fontSize="md">
              {profile?.role || "N/A"}{" "}
              {profile?.stdprofile?.[0]?.hostler === "Y" && (
                <>
                  -{" "}
                  <Text fontWeight="bold" fontSize="lg" color="green.500">
                    H
                  </Text>
                </>
              )}
            </Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            space={2}
            flexWrap="wrap"
          >
            <Text fontWeight="semibold" fontSize="md">
              {profile?.stdprofile?.[0]?.regdno || "N/A"}
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
      <VStack
        flex={1}
        mt={2}
        alignItems="center"
        justifyContent="center"
        pointerEvents="auto"
      >
        <TouchableOpacity onPress={() => setMore((prev) => !prev)}>
          <Text color={"green.600"} fontSize={14} fontWeight={"bold"}>
            Show {more ? "less" : "more"}
          </Text>
        </TouchableOpacity>
      </VStack>
      {more && (
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
                {item?.value || "N/A"}
              </Text>
            </Box>
          ))}
        </VStack>
      )}

      {profile?.role === "student" &&
        profile?.stdprofile[0]?.hostler === "Y" &&
        leaves?.getpermissionstatus?.length !== 0 &&
        moment(leaves?.getpermissionstatus[0]?.fromdate, "DD-MMM-YYYY").format(
          "YYYY-MM-DD"
        ) === moment().format("YYYY-MM-DD") &&
        leaves?.getpermissionstatus[0]?.isapprove != "I" && (
          <LeavesPermissionsStack />
        )}

      <ViolationsStack
        cardData={cardData}
        handleShowViolations={handleShowViolations}
      />
    </Box>
  );
}

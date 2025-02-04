import React from "react";
import { Box, Text, Image, HStack, VStack, Badge } from "native-base";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { showViolationsPage } from "../../../store/slices/violationSlice";
export default function HomeViolationsCard(cardData) {
  const { data } = cardData;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    violations,
    isLoading,
    searchStore,
    profile,
    violationsCount,
    image,
  } = useSelector((state) => state.violations);
  const handleShowViolations = () => {
    dispatch(showViolationsPage(true));
    navigation.navigate("AddViolations");
  };
  return (
    <Box
      padding="6"
      shadow="9"
      bg={"#fff"}
      borderRadius={"xl"}
      minWidth={"sm"}
      maxWidth={"sm"}
    >
      <HStack space={"lg"}>
        <Image
          source={{
            uri: image,
          }}
          alt="Profile Image"
          size="lg"
          borderRadius="xl"
        />
        <VStack space={"2"}>
          <Text color={"#007367"} fontWeight={"bold"} fontSize="lg">
            {profile?.stdprofile?.[0]?.name || "Name not available"}
          </Text>
          <Text fontWeight={"semibold"} fontSize="md">
            {profile?.role || "Role not available"}
          </Text>
          <HStack
            justifyContent={"space-between"}
            alignItems={"center"}
            space={2}
          >
            <Text fontWeight={"semibold"} fontSize="md">
              {profile?.stdprofile?.[0]?.regdno || " not available"}
            </Text>
            <Badge colorScheme="success" _text={{ fontSize: "md" }}>
              {profile?.stdprofile?.[0]?.status === "A" ? "Active" : "Inactive"}
            </Badge>
          </HStack>
        </VStack>
      </HStack>
      <VStack space={1.5} marginTop={"6"}>
        {[
          { key: "Name", value: profile?.stdprofile?.[0]?.name },
          { key: "Role", value: profile?.role },
          { key: "Batch", value: profile?.stdprofile?.[0]?.batch },
          {
            key: "Email",
            value: profile?.stdprofile?.[0]?.emailid,
          },
          {
            key: "Mobile",
            value: profile?.stdprofile?.[0]?.mobile,
          },
        ].map((item, index) => (
          <Box
            key={index}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Text fontSize={"md"}>{item.key}</Text>
            <Text
              fontSize={"md"}
              color={
                item.key === "Role"
                  ? "#007367"
                  : item.key === "Name"
                  ? "#000000"
                  : "#706F6F"
              }
              paddingLeft={4}
            >
              {item.value || "Not available"}
            </Text>
          </Box>
        ))}
      </VStack>
      <HStack
        justifyContent="space-between"
        space={4}
        mt={4}
        alignItems="center"
        width="100%"
      >
        <Pressable
          onPress={handleShowViolations}
          style={{
            borderWidth: 1,
            borderColor: "#37474F",
            borderRadius: 20,
            paddingVertical: 10,
            paddingHorizontal: 15,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            marginRight: 8,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#37474F",
            }}
          >
            Violations {violationsCount}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleShowViolations}
          style={{
            backgroundColor: "#007367",
            borderRadius: 20,
            paddingVertical: 10,
            paddingHorizontal: 15,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            Add Violation
          </Text>
        </Pressable>
      </HStack>
    </Box>
  );
}

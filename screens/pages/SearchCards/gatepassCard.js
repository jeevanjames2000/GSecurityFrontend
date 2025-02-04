import React, { useState } from "react";
import {
  Text,
  VStack,
  HStack,
  Input,
  View,
  FormControl,
  useToast,
  Box,
} from "native-base";
import { Alert, Pressable } from "react-native";
import useSearch from "../../../hooks/useSearch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
const GatepassCard = React.memo(() => {
  const { cardData } = useSelector((state) => ({
    cardData: state.home.cardData,
  }));
  const { profile } = useSelector((state) => state.auth);
  const { handleRefresh } = useSearch();
  const [selectedGatePass] = useState(cardData?.gatePass || null);
  const [particulars, setParticulars] = useState(cardData?.particulars || []);
  const toast = useToast();
  const handleParticularChange = (idx, field, value) => {
    const updatedParticulars = particulars.map((item, index) =>
      index === idx ? { ...item, [field]: value } : item
    );
    setParticulars(updatedParticulars);
  };
  const handleUpdate = async (id, updatedStatus) => {
    try {
      const storedUser = await AsyncStorage.getItem("authUser");
      const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;
      const formData = {
        pass_no: id,
        particulars: JSON.stringify(particulars),
        status: updatedStatus,
        verified_by: parsedStoredUser.stdprofile[0].name,
      };
      const response = await fetch(
        "http://172.17.58.151:9000/gatepass/updateParticulars",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const responseData = await response.json();
      if (response.ok) {
        handleRefresh();
        setTimeout(() => {
          toast.show({
            render: () => (
              <Box bg="green.300" px="4" py="2" rounded="md" shadow={2}>
                {responseData.message}
              </Box>
            ),
            placement: "top-right",
          });
        }, 500);
      } else {
        const errorMessage =
          responseData.error || "An error occurred. Please try again.";
        toast.show({
          render: () => (
            <Box bg="red.300" px="4" py="2" rounded="md" shadow={2}>
              {errorMessage}
            </Box>
          ),
          placement: "top-right",
        });
      }
    } catch (error) {
      console.error("Error in handleUpdate:", error);
      toast.show({
        render: () => (
          <Box bg="red.300" px="4" py="2" rounded="md" shadow={2}>
            {error.message || "An unexpected error occurred."}
          </Box>
        ),
        placement: "top-right",
      });
    }
  };
  const handleApprove = (id) => {
    handleUpdate(id, "approved");
  };
  const handleReject = (id) => {
    Alert.alert(
      "Confirm Reject",
      "Are you sure you want to reject this pass?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Reject",
          onPress: () => handleUpdate(id, "rejected"),
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <VStack padding="6" pt={2} shadow="6" bg={"#fff"} borderRadius={"xl"}>
      {selectedGatePass && particulars.length > 0 && (
        <>
          <View mb={2}>
            <Text
              textAlign={"center"}
              fontWeight={"bold"}
              color="#007367"
              fontSize={18}
              pb={2}
            >
              GatePass Details
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#007367",
                padding: 10,
                borderRadius: 15,
              }}
            >
              <View ml={3}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "#ddd",
                  }}
                >
                  Pass No
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  #{selectedGatePass.pass_no || "null"}
                </Text>
              </View>
              <View mr={3}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "#ddd",
                  }}
                >
                  Type
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {selectedGatePass.pass_type || "null"}
                </Text>
              </View>
            </View>
            <VStack mt={4} space={2}>
              {[
                {
                  label: "Vehicle number",
                  value: selectedGatePass.vehicle_number || "null",
                },
                {
                  label: "Receiver name",
                  value: selectedGatePass.receiver_name || "null",
                  align: "flex-start",
                },
                {
                  label: "Created on",
                  value:
                    new Date(
                      selectedGatePass.created_time
                    ).toLocaleDateString() || "null",
                },
                {
                  label: "Issued to",
                  value: selectedGatePass.receiver_emp_id || "null",
                },
                {
                  label: "Issued by",
                  value: selectedGatePass.issued_by || "null",
                },
                { label: "Note", value: selectedGatePass.note || "null" },
              ].map(({ label, value, align }, index) => (
                <HStack
                  key={index}
                  justifyContent="space-between"
                  alignItems={align || "center"}
                >
                  <Text fontSize="md" fontWeight="bold">
                    {label}
                  </Text>
                  <Text
                    fontSize="md"
                    color="gray.800"
                    textAlign="right"
                    flex={1}
                    width="70%"
                    flexWrap="wrap"
                  >
                    {value}
                  </Text>
                </HStack>
              ))}
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontSize="md" fontWeight="bold">
                  Status
                </Text>
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  textAlign="right"
                  flex={1}
                  color={
                    selectedGatePass.status === "approved"
                      ? "#007367"
                      : selectedGatePass.status === "pending"
                      ? "#DB9669"
                      : "#FF6060"
                  }
                >
                  {selectedGatePass.status === "approved"
                    ? "Approved"
                    : selectedGatePass.status === "rejected"
                    ? "Rejected"
                    : "Pending"}
                </Text>
              </HStack>
            </VStack>
          </View>
          <FormControl
            mt={1}
            borderWidth={1}
            borderColor={"#ddd"}
            borderRadius={10}
            p={3}
            backgroundColor={"#F8FAFC"}
          >
            <FormControl.Label
              _text={{
                fontSize: 18,
                fontWeight: "bold",
                color: "gray.600",
              }}
            >
              Particulars
            </FormControl.Label>
            {particulars.map((particular, idx) => (
              <HStack key={idx} space={3} alignItems="center" mb={2}>
                <Input
                  flex={2}
                  bg="#ffff"
                  fontSize={16}
                  value={particular.particular}
                  p={3}
                  onChangeText={(value) =>
                    handleParticularChange(idx, "particular", value)
                  }
                />
                <Input
                  placeholder="Qty"
                  flex={1}
                  bg="#ffff"
                  p={3}
                  fontSize={16}
                  keyboardType="numeric"
                  value={`${particular.qty}`}
                  onChangeText={(value) =>
                    handleParticularChange(idx, "qty", value)
                  }
                />
              </HStack>
            ))}
          </FormControl>
          {selectedGatePass.status === "pending" && (
            <HStack
              justifyContent="space-between"
              space={4}
              mt={4}
              alignItems="center"
              width="100%"
            >
              <Pressable
                onPress={() => handleReject(selectedGatePass.pass_no)}
                style={{
                  borderWidth: 1,
                  borderColor: "#37474F",
                  borderRadius: 20,
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#37474F",
                  }}
                >
                  Reject
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleApprove(selectedGatePass.pass_no)}
                style={{
                  backgroundColor: "#007367",
                  borderRadius: 20,
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Approve
                </Text>
              </Pressable>
            </HStack>
          )}
        </>
      )}
    </VStack>
  );
});
export default GatepassCard;

import { HStack, VStack, Text, Center, View, Input, Button } from "native-base";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataBySearchQuery } from "../../../store/slices/homeSlice";
export default function VisitorDetailsCard() {
  const { searchStore, cardData, noProfile } = useSelector(
    (state) => state.home
  );

  const dispatch = useDispatch();
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [otp, setOtp] = useState("");
  if (noProfile) {
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
  const handleRefeshViolationpage = () => {
    dispatch(fetchDataBySearchQuery(searchStore));
  };
  const handleOtpSubmit = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch(
        "http://172.17.58.151:9000/auth/updateVisitors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp,
            visitor_id: cardData[0]?.visitor_id,
            status: "approved",
          }),
        }
      );

      if (response.ok) {
        handleRefeshViolationpage();
        setIsOtpSubmitted(true);
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  return (
    <>
      <VStack padding="6" pt={2} shadow="6" bg={"#fff"} borderRadius={"xl"}>
        <Text
          fontSize={20}
          fontWeight="bold"
          color="#007367"
          textAlign="center"
          mb={2}
        >
          Visitor Details
        </Text>

        {[
          {
            label: "Visitor Id",
            value: cardData[0]?.visitor_id || "N/A",
          },
          {
            label: "Name",
            value: cardData[0]?.visitor_name || "N/A",
          },
          {
            label: "Phone Number",
            value: cardData[0]?.contact_no || "N/A",
          },
          {
            label: "Vehicle Type",
            value: cardData[0]?.vehicle_type || "N/A",
          },
          {
            label: "Vehicle Number",
            value: cardData[0]?.vehicle_no || "N/A",
          },
          {
            label: "Visit Time",
            value:
              new Date(cardData[0]?.from_time).toLocaleTimeString() || "N/A",
          },
          {
            label: "Out Time",
            value: new Date(cardData[0]?.to_time).toLocaleTimeString() || "N/A",
          },
          {
            label: "Visit Department",
            value: cardData[0]?.visiting_location || "N/A",
          },
          {
            label: "Status",
            value:
              cardData[0]?.status === "approved"
                ? "Approved"
                : cardData[0]?.status === "rejected"
                ? "Rejected"
                : "Pending" || "N/A",
            color:
              cardData[0]?.status === "pending"
                ? "#DB9669"
                : cardData[0]?.status === "rejected"
                ? "#FF6060"
                : "#007367",
          },
          {
            label: "Purpose",
            value: cardData[0]?.purpose || "N/A",
          },
        ].map(({ label, value, color }, index) => (
          <HStack
            key={index}
            justifyContent="space-between"
            alignItems="flex-start"
            borderBottomWidth={index === 9 ? 1 : 0}
            borderColor="#DADADA"
            pb={index === 9 ? 3 : 0}
            mb={1}
          >
            <Text fontSize="md" fontWeight="bold" flexShrink={1}>
              {label}
            </Text>
            <Text
              fontSize="md"
              fontWeight={label === "Status" ? "bold" : "normal"}
              color={color || "gray.800"}
              width="60%"
              flexWrap="wrap"
              textAlign="right"
            >
              {value}
            </Text>
          </HStack>
        ))}

        <Text fontWeight="bold" color="#007367" fontSize="lg" mt={2}>
          Invitor Details
        </Text>
        {[
          {
            label: "Name",
            value: cardData[0]?.whomToMeet || "Invitor name not available",
          },
          {
            label: "Visitor ID",
            value: cardData[0]?.visitor_id || "Visitor ID not available",
          },
          { label: "Inviter mobile", value: "N/A" },
        ].map(({ label, value }, index) => (
          <HStack key={index} justifyContent="space-between" mb={1}>
            <Text fontSize="md" fontWeight="bold">
              {label}
            </Text>
            <Text fontSize="md" color="gray.800">
              {value}
            </Text>
          </HStack>
        ))}

        {cardData[0]?.status === "pending" && !isOtpSubmitted && (
          <Center mt={4}>
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChangeText={(text) => setOtp(text)}
              keyboardType="numeric"
              maxLength={4}
              p="4"
              fontSize="md"
              color="#9D9D9C"
              borderRadius="xl"
              borderColor="#9D9D9C"
              borderWidth={1}
              w="70%"
              InputRightElement={
                <Button
                  colorScheme="teal"
                  borderRadius="full"
                  mx={4}
                  px={4}
                  onPress={handleOtpSubmit}
                >
                  Allow
                </Button>
              }
            />
          </Center>
        )}
      </VStack>
    </>
  );
}

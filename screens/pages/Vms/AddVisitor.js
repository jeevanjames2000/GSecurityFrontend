import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  VStack,
  Input,
  Button,
  Box,
  FormControl,
  Text,
  Select,
  CheckIcon,
  HStack,
  ScrollView,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const AddVisitor = () => {
  const navigation = useNavigation();
  const [visitorName, setVisitorName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [otp, setOtp] = useState("");
  const [purpose, setPurpose] = useState("");
  const [visitingDept, setVisitingDept] = useState("");
  const [whomToMeet, setWhomToMeet] = useState("");
  const handleSendOtp = () => {
    console.log("OTP sent to:", contactNo);
  };
  const handleSubmit = () => {
    console.log({
      visitorName,
      contactNo,
      otp,
      purpose,
      visitingDept,
      whomToMeet,
    });
  };
  return (
    <Box flex={1} backgroundColor="#f5f5f5">
      {}
      <Box backgroundColor="#007367" paddingY="12" paddingX="4">
        <HStack
          alignItems="center"
          justifyContent="space-between"
          position="relative"
          top={5}
        >
          <Text
            fontSize={30}
            color="white"
            justifyContent={"center"}
            alignItems={"center"}
            fontWeight="bold"
            textAlign="center"
            flex={1}
          >
            Add Visitors
          </Text>
          <Ionicons
            name="arrow-back"
            size={30}
            position="absolute"
            left={0}
            color="white"
            onPress={() => navigation.goBack()}
          />
        </HStack>
      </Box>
      <ScrollView>
        <Box flex={1} paddingX={4} paddingY={5} marginTop={5}>
          <VStack space={5}>
            <FormControl isRequired>
              <FormControl.Label>
                <Text style={styles.label}>Visitor Name</Text>
              </FormControl.Label>
              <Input
                placeholder="Enter Visitor Name"
                value={visitorName}
                onChangeText={(text) => setVisitorName(text)}
                style={styles.inputValue}
              />
            </FormControl>
            {}
            <FormControl isRequired>
              <FormControl.Label>
                <Text style={styles.label}>Contact No</Text>
              </FormControl.Label>
              <HStack space={2} alignItems="center">
                <Input
                  flex={1}
                  placeholder="Enter Contact Number"
                  keyboardType="numeric"
                  value={contactNo}
                  onChangeText={(text) => setContactNo(text)}
                  style={styles.inputValue}
                />
                <Button
                  bgColor="#007367"
                  onPress={handleSendOtp}
                  isDisabled={!contactNo || contactNo.length < 10}
                >
                  Send OTP
                </Button>
              </HStack>
            </FormControl>
            {}
            <FormControl>
              <FormControl.Label>
                <Text style={styles.label}>OTP</Text>
              </FormControl.Label>
              <Input
                placeholder="Enter OTP"
                keyboardType="numeric"
                value={otp}
                onChangeText={(text) => setOtp(text)}
                style={styles.inputValue}
              />
            </FormControl>
            {}
            <FormControl>
              <FormControl.Label>
                <Text style={styles.label}>Purpose</Text>
              </FormControl.Label>
              <Input
                placeholder="Enter Purpose of Visit"
                value={purpose}
                style={styles.inputValue}
                onChangeText={(text) => setPurpose(text)}
              />
            </FormControl>
            {}
            <FormControl>
              <FormControl.Label>
                <Text style={styles.label}>Visiting Department</Text>
              </FormControl.Label>
              <Select
                selectedValue={visitingDept}
                minWidth="200"
                accessibilityLabel="Select Department"
                placeholder="Select Department"
                onValueChange={(itemValue) => setVisitingDept(itemValue)}
                _selectedItem={{
                  endIcon: <CheckIcon size="5" />,
                }}
                style={styles.inputValue}
              >
                <Select.Item label="HR Department" value="HR" />
                <Select.Item label="IT Department" value="IT" />
                <Select.Item label="Finance Department" value="Finance" />
              </Select>
            </FormControl>
            {}
            <FormControl>
              <FormControl.Label>
                <Text style={styles.label}>Whom to Meet</Text>
              </FormControl.Label>
              <Input
                placeholder="Enter Name of Person to Meet"
                value={whomToMeet}
                onChangeText={(text) => setWhomToMeet(text)}
                style={styles.inputValue}
              />
            </FormControl>
            {}
            <Button
              mt="5"
              bgColor="#007367"
              onPress={handleSubmit}
              fontSize="md"
            >
              Submit
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
};
export default AddVisitor;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "semibold",
  },
  inputValue: {
    fontSize: 16,
  },
});

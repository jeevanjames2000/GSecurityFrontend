import React, { useState } from "react";
import {
  Box,
  ScrollView,
  VStack,
  FormControl,
  Stack,
  Input,
  Button,
  TextArea,
  HStack,
  Text,
  Select,
  IconButton,
  useToast,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
export default function AddGatepass() {
  const toast = useToast();
  const navigation = useNavigation();
  const [passType, setPassType] = useState("");
  const [issuedTo, setIssuedTo] = useState("Employee");
  const [issuedBy, setIssuedBy] = useState("");
  const [issuedFrom, setIssuedFrom] = useState("");
  const [mobile, setMobile] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [empId, setEmpId] = useState("");
  const [name, setName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [particulars, setParticulars] = useState([
    { id: 1, particular: "", qty: 0 },
  ]);
  const handleInputChange = (id, field, value) => {
    setParticulars((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };
  const addNewField = () => {
    setParticulars((prev) => [
      ...prev,
      { id: prev.length + 1, particular: "", qty: 0 },
    ]);
  };
  const removeField = (id) => {
    setParticulars((prev) =>
      prev.length > 1
        ? prev.filter((item) => item.id !== id || item.id === 1)
        : prev
    );
  };
  const handleSubmit = async () => {
    const formData = {
      pass_type: passType,
      issued_by: "CAO",
      issued_to: issuedTo,
      issuer_mobile: "6302816551",
      campus: "VSP",
      receiver_emp_id: "878787",
      receiver_type: issuedTo,
      receiver_name: name,
      receiver_mobile_number: mobile,
      vehicle_number: vehicle,
      note: remarks,
      particulars: particulars,
    };
    const response = await fetch(
      "http://172.17.58.151:9000/gatepass/createGatePass",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    if (response.ok) {
      await navigation.navigate("Gate-Pass");
      toast.show({
        render: () => {
          return (
            <Box
              bg="green.300"
              px="4"
              py="2"
              rounded="md"
              shadow={2}
              alignSelf="center"
            >
              GatePass created successfully!
            </Box>
          );
        },
        placement: "top-right",
      });
    } else {
      const errorMessage =
        response.error || "An error occurred. Please try again.";
      toast.show({
        render: () => {
          return (
            <Box
              bg="red.300"
              px="4"
              py="2"
              rounded="md"
              shadow={2}
              alignSelf="flex-end"
            >
              {errorMessage}
            </Box>
          );
        },
        placement: "top-right",
      });
    }
  };
  return (
    <Box flex={1} bg="#f5f5f5">
      <Box backgroundColor="#007367" paddingY="10" paddingX="4">
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
            Create Pass
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
        <Box px={4} py={4} bg={"#FBFBFB"}>
          <FormControl mb={4} isReadOnly>
            <FormControl.Label _text={{ fontSize: 16, fontWeight: "bold" }}>
              Pass Type
            </FormControl.Label>
            <Select
              selectedValue={passType}
              onValueChange={(value) => {
                setPassType(value);
              }}
              placeholder="Select Pass Type"
              bg="#ffff"
              fontSize={13}
              p={3}
              _selectedItem={{
                bg: "gray.200",
                endIcon: <Ionicons name="checkmark" size={20} color="black" />,
              }}
            >
              <Select.Item label="Returnable" value="Returnable" />
              <Select.Item label="Non-Returnable" value="Non-returnable" />
              <Select.Item label="Domestic Waste" value="Domestic-waste" />
              <Select.Item
                label="Construction Waste/Scrap"
                value="Construction-waste"
              />
            </Select>
          </FormControl>
          <VStack space={4}>
            <FormControl mb={4} isReadOnly>
              <FormControl.Label _text={{ fontSize: 16, fontWeight: "bold" }}>
                Issued to
              </FormControl.Label>
              <Select
                selectedValue={issuedTo}
                onValueChange={(value) => {
                  setIssuedTo(value);
                }}
                placeholder="Select Pass Type"
                bg="#ffff"
                fontSize={13}
                p={3}
                _selectedItem={{
                  bg: "gray.200",
                  endIcon: (
                    <Ionicons name="checkmark" size={20} color="black" />
                  ),
                }}
              >
                <Select.Item label="Gitam Employee" value="Employee" />
                <Select.Item label="Other" value="other" />
              </Select>
            </FormControl>
            <Stack>
              <FormControl.Label _text={{ fontSize: 16, fontWeight: "bold" }}>
                Receiver {issuedTo === "Employee" ? "EMPID" : "Name"}
              </FormControl.Label>
              <Input
                placeholder={`Enter ${
                  issuedTo === "Employee" ? "EMPID" : "Name"
                }`}
                bg="#ffff"
                p={3}
                value={name}
                onChangeText={setName}
              />
            </Stack>
            <Stack>
              <FormControl.Label _text={{ fontSize: 16, fontWeight: "bold" }}>
                Receiver Mobile No
              </FormControl.Label>
              <Input
                placeholder="Enter Mobile Number"
                bg="#ffff"
                p={3}
                value={mobile}
                onChangeText={setMobile}
              />
            </Stack>
            <Stack>
              <FormControl.Label _text={{ fontSize: 16, fontWeight: "bold" }}>
                Receiver Vehicle No
              </FormControl.Label>
              <Input
                placeholder="Enter Vehicle Number"
                bg="#ffff"
                p={3}
                value={vehicle}
                onChangeText={setVehicle}
              />
            </Stack>
            <FormControl>
              <FormControl.Label _text={{ fontSize: 16, fontWeight: "bold" }}>
                Particulars
              </FormControl.Label>
              {particulars.map((item, index) => (
                <HStack key={item.id} space={3} alignItems="center" mb={2}>
                  <Input
                    placeholder={`Particular ${index + 1}`}
                    flex={2}
                    bg="#ffff"
                    value={item.particular}
                    p={3}
                    onChangeText={(text) =>
                      handleInputChange(item.id, "particular", text)
                    }
                  />
                  <Input
                    placeholder="Qty"
                    flex={1}
                    bg="#ffff"
                    p={3}
                    keyboardType="numeric"
                    value={item.qty}
                    onChangeText={(text) =>
                      handleInputChange(item.id, "qty", parseInt(text) || 0)
                    }
                  />
                  <HStack>
                    <IconButton
                      icon={
                        <Ionicons name="add-circle" size={24} color="green" />
                      }
                      onPress={addNewField}
                    />
                    {particulars.length > 1 && (
                      <IconButton
                        icon={
                          <Ionicons
                            name="remove-circle"
                            size={24}
                            color="red"
                          />
                        }
                        onPress={() => removeField(item.id)}
                      />
                    )}
                  </HStack>
                </HStack>
              ))}
            </FormControl>
            <Stack>
              <FormControl.Label _text={{ fontSize: 16, fontWeight: "bold" }}>
                Remarks
              </FormControl.Label>
              <TextArea
                placeholder="Enter Remarks"
                bg="#ffff"
                value={remarks}
                onChangeText={setRemarks}
              />
            </Stack>
          </VStack>
          <HStack justifyContent="space-between" mt={4}>
            <Button
              flex={1}
              mr={2}
              bg="#007367"
              onPress={handleSubmit}
              _text={{ fontSize: 16, fontWeight: "bold" }}
            >
              Create
            </Button>
            <Button
              flex={1}
              bg="gray.400"
              onPress={() => navigation.goBack()}
              _text={{ fontSize: 16, fontWeight: "bold" }}
            >
              Cancel
            </Button>
          </HStack>
        </Box>
      </ScrollView>
    </Box>
  );
}

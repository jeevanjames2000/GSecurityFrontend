import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  FormControl,
  Stack,
  View,
  Text,
  Input,
  Button,
  TextArea,
  Image,
  Actionsheet,
  Box,
  Checkbox,
  HStack,
  Wrap,
  Center,
  IconButton,
  useToast,
} from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { setRefresh } from "../../../store/slices/violationSlice";
import { fetchDataBySearchQuery } from "../../../store/slices/homeSlice";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function AddViolations() {
  const { refresh } = useSelector((state) => state.violations);
  const { cardData, cardType, searchStore, profile } = useSelector(
    (state) => state.home
  );
  const { profile: authProfile } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toast = useToast();
  const [isActionSheetOpen, setActionSheetOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [name, setName] = useState(profile?.stdprofile?.[0]?.name);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (selectedValues.length === 0)
      newErrors.violationCategory = "Violation category is required";
    if (!vehicleNumber.trim())
      newErrors.vehicleNumber = "Vehicle number is required";
    if (!comments.trim()) newErrors.comments = "Comments are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlePickImages = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 1,
    });
    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      const validImages = [];
      for (const uri of newImages) {
        const response = await fetch(uri);
        const blob = await response.blob();
        if (blob.size <= 5 * 1024 * 1024) {
          validImages.push(uri);
        } else {
          alert(`Image exceeds the maximum size limit of 5MB.`);
        }
      }
      setSelectedImages((prevImages) => [...prevImages, ...validImages]);
    }
  };
  const handleDeleteImage = (index) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, imgIndex) => imgIndex !== index)
    );
  };
  const [fine, setFine] = useState(0);
  const CustomActionSheet = ({
    isOpen,
    onClose,
    onSubmit,
    selectedValues,
    setErrors,
  }) => {
    const [tempSelectedValues, setTempSelectedValues] =
      useState(selectedValues);
    const [totalFines, setTotalFines] = useState(0);
    const fines = {
      Accident: "",
      "Incorrect parking": 500,
      "Over speeding": 1000,
      "Drink & drive": 3000,
      "No Helmet": 500,
      Others: "",
    };
    const handleCheckboxChange = (value) => {
      setTempSelectedValues((prev) => {
        const updatedValues = prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value];
        const total = updatedValues.reduce(
          (sum, violation) => sum + fines[violation],
          0
        );
        setTotalFines(total);
        return updatedValues;
      });
    };
    const handleSubmit = () => {
      onSubmit(tempSelectedValues, totalFines);
      setErrors((prevErrors) => ({
        ...prevErrors,
        violationCategory:
          tempSelectedValues.length > 0
            ? undefined
            : "Violation category is required",
      }));
      onClose();
    };
    useEffect(() => {
      const total = tempSelectedValues.reduce(
        (sum, violation) => sum + fines[violation],
        0
      );
      setTotalFines(total);
    }, [tempSelectedValues]);
    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content alignItems="left" padding={6}>
          <Box
            w="100%"
            h={60}
            px={4}
            justifyContent="center"
            alignItems="center"
            mb={4}
          >
            <Text style={{ fontSize: 24, fontWeight: "700" }}>
              Violation Type
            </Text>
          </Box>
          {Object.keys(fines).map((label, index) => (
            <Checkbox
              key={index}
              value={label}
              accessibilityLabel={label}
              marginBottom={2}
              isChecked={tempSelectedValues.includes(label)}
              onChange={() => handleCheckboxChange(label)}
            >
              {fines[label] ? `${label} - ₹${fines[label]}` : label}
            </Checkbox>
          ))}

          <Box mt={4}>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              Total Fines: ₹{totalFines}
            </Text>
          </Box>
          <HStack w="100%" justifyContent="space-evenly" mt={4}>
            <Button
              flex={1}
              mr={2}
              backgroundColor="#007367"
              onPress={handleSubmit}
            >
              Submit
            </Button>
            <Button flex={1} ml={2} variant="outline" onPress={onClose}>
              Cancel
            </Button>
          </HStack>
        </Actionsheet.Content>
      </Actionsheet>
    );
  };
  const handleActionSheetSubmit = (values, fines) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      violationCategory:
        values.length > 0 ? undefined : "Violation category is required",
    }));
    setSelectedValues(values);
    setFine(fines);
  };
  const handleRefeshViolationpage = () => {
    dispatch(fetchDataBySearchQuery(searchStore));
    dispatch(setRefresh(!refresh));
  };
  const [comments, setComments] = useState("");
  const handleUploadImage = async () => {
    const storedUser = await AsyncStorage.getItem("authUser");
    const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;
    setIsLoading(true);
    const formData = new FormData();
    selectedImages.forEach((imageUri) => {
      const image = {
        uri: imageUri,
        type: "image/jpeg",
        name: imageUri.split("/").pop(),
      };
      formData.append("images[]", image);
    });
    formData.append("name", name);
    formData.append("vehicle_number", vehicleNumber);
    formData.append("totalFines", fine);
    formData.append("reported_by", parsedStoredUser?.stdprofile[0]?.name);
    selectedValues.forEach((violation) => {
      formData.append("violationType[]", violation);
    });
    formData.append("comments", comments);
    formData.append("regdNo_empId", profile?.stdprofile?.[0]?.regdno);
    try {
      const response = await fetch(
        "http://172.17.58.151:9000/auth/reportViolation",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (response.status === 200) {
        setTimeout(() => {
          handleRefeshViolationpage();
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
                  Violation registered successfully!
                </Box>
              );
            },
            placement: "top-right",
            duration: 3000,
            isClosable: true,
          });
          navigation.goBack();
          setName("");
          setVehicleNumber("");
          setComments("");
          setSelectedImages([]);
          setSelectedValues([]);
          setIsLoading(false);
        }, 2000);
      } else {
        const errorMessage =
          result.error || "An error occurred. Please try again.";
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
          placement: "bottom",
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    } catch (error) {
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
              mt={13}
            >
              Failed to upload violation. Please try again.
            </Box>
          );
        },
        placement: "top-right",
        duration: 3000,
      });
      Alert.alert("Error", "Failed to upload violation. Please try again.");
      setIsLoading(false);
    }
  };
  const UploadPhoto = ({ selectedImages, onPickImages, onDeleteImage }) => (
    <Stack>
      <FormControl.Label
        _text={{
          fontSize: 20,
          color: "#000",
          fontWeight: 700,
          marginBottom: 2,
        }}
      >
        Upload Photo
      </FormControl.Label>
      <Wrap
        space={4}
        style={{ alignItems: "center", justifyContent: "center" }}
        flexDirection="row"
      >
        <Center
          width={"100%"}
          h={20}
          borderColor="#DBDBDB"
          borderWidth={1}
          borderRadius="sm"
          padding={4}
        >
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={onPickImages}
          >
            <MaterialCommunityIcons
              name="camera-plus-outline"
              size={30}
              color="black"
            />
            <Text style={{ marginTop: 5, fontSize: 14 }}>Add Photo</Text>
          </TouchableOpacity>
        </Center>
      </Wrap>
      {}
      {selectedImages.length > 0 && (
        <View style={styles.galleryContainer}>
          <ScrollView horizontal>
            {selectedImages.map((imageUri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri: imageUri }}
                  alt={`Selected ${index}`}
                  style={styles.image}
                />
                <IconButton
                  icon={<Feather name="x-circle" size={25} color="white" />}
                  onPress={() => onDeleteImage(index)}
                  style={styles.deleteIcon}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </Stack>
  );
  const handleSubmit = () => {
    if (!validateForm()) return;
    handleUploadImage(selectedImages);
  };
  return (
    <Box flex={1} backgroundColor="#f5f5f5">
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
            Report Violation
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
        <Box p={4}>
          <FormControl>
            <Stack>
              <FormControl.Label
                _text={{
                  fontSize: 20,
                  color: "#000",
                  fontWeight: 700,
                  marginBottom: 2,
                }}
              >
                Student / Employee name
              </FormControl.Label>
              <Input
                value={name}
                onChangeText={setName}
                placeholder={"Enter Name"}
                variant="filled"
                bg="#F0F2F5"
                p={3}
                borderRadius="md"
                width="100%"
                fontSize={16}
                _focus={{ bg: "#fff" }}
              />
            </Stack>
            <Stack>
              <FormControl.Label
                _text={{
                  fontSize: 20,
                  color: "#000",
                  fontWeight: 700,
                  marginBottom: 2,
                }}
              >
                Violation Category
              </FormControl.Label>
              <TouchableOpacity
                onPress={() => setActionSheetOpen(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F0F2F5",
                  padding: 14,
                  borderRadius: 4,
                  borderWidth: errors.violationCategory ? 1 : 0,
                  borderColor: errors.violationCategory ? "red" : "transparent",
                }}
              >
                <Text style={{ color: "#637587", fontSize: 16, flex: 1 }}>
                  {selectedValues.length > 0
                    ? selectedValues.join(", ")
                    : "Select Violation Type"}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color="#637587"
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>
              {errors.violationCategory && (
                <Text color="red.500">{errors.violationCategory}</Text>
              )}
            </Stack>
            <CustomActionSheet
              isOpen={isActionSheetOpen}
              onClose={() => setActionSheetOpen(false)}
              selectedValues={selectedValues}
              onSubmit={handleActionSheetSubmit}
              setErrors={setErrors}
            />
            <Stack>
              <FormControl.Label
                _text={{
                  fontSize: 20,
                  color: "#000",
                  fontWeight: 700,
                  marginBottom: 2,
                }}
              >
                Vehicle Number
              </FormControl.Label>
              <Input
                value={vehicleNumber}
                onChangeText={(text) => {
                  setVehicleNumber(text);
                  setErrors((prev) => ({ ...prev, vehicleNumber: "" }));
                }}
                placeholder="Vehicle Number"
                variant="filled"
                bg="#F0F2F5"
                p={3}
                borderRadius="md"
                width="100%"
                fontSize={16}
                _focus={{ bg: "#fff" }}
                borderColor={errors.vehicleNumber ? "red.500" : "gray.300"}
              />
              {errors.vehicleNumber && (
                <Text color="red.500">{errors.vehicleNumber}</Text>
              )}
            </Stack>

            <Stack>
              <FormControl.Label
                _text={{
                  fontSize: 20,
                  color: "#000",
                  fontWeight: "700",
                  marginBottom: 2,
                }}
              >
                Comments
              </FormControl.Label>
              <View style={[styles.textAreaContainer]}>
                <TextArea
                  h={20}
                  fontSize={16}
                  w="100%"
                  color="#637587"
                  bg="#F0F2F5"
                  borderColor={errors.vehicleNumber ? "red.500" : "gray.300"}
                  value={comments}
                  placeholder="Enter Violation Information"
                  onChangeText={(text) => {
                    setComments(text);
                    setErrors((prev) => ({ ...prev, comments: "" }));
                  }}
                />
              </View>
              {errors.comments && (
                <Text color="red.500">{errors.comments}</Text>
              )}
            </Stack>
            <UploadPhoto
              selectedImages={selectedImages}
              onPickImages={handlePickImages}
              onDeleteImage={handleDeleteImage}
            />
            <Button
              bg="#007367"
              borderRadius="md"
              width="100%"
              mt={2}
              p={3}
              bottom={0}
              onPress={handleSubmit}
            >
              {isLoading ? (
                <View>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  Submit
                </Text>
              )}
            </Button>
          </FormControl>
        </Box>
      </ScrollView>
    </Box>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  textAreaContainer: {
    position: "relative",
    width: "100%",
  },
  dotsContainer: {
    width: 60,
    padding: 10,
    marginTop: 16,
  },
  micIcon: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10,
  },
  findEle: {
    borderColor: "#000",
    borderWidth: 1,
    borderStyle: "solid",
  },
  dotsContainer: {
    width: 60,
    padding: 10,
    marginTop: 16,
  },
  galleryContainer: {
    marginTop: 10,
    flexDirection: "row",
  },
  imageWrapper: {
    marginRight: 10,
    width: 100,
    height: 90,
    borderColor: "#DBDBDB",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  deleteIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    borderRadius: 50,
  },
});

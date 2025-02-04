import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Pressable,
  Divider,
  Input,
  Image,
  View,
  KeyboardAvoidingView,
  Skeleton,
  ScrollView,
  Badge,
  Modal,
  FlatList,
} from "native-base";
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  searchState,
  profileStore,
  fetchProfile,
  fetchViolations,
  showViolationsPage,
} from "../../../store/slices/violationSlice";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
const ViolationsTabs = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const {
    searchStore,
    violations,
    isLoading,
    profile,
    violationsCount,
    showViolations,
    profileLength,
    image,
    refresh,
  } = useSelector((state) => state.home);
  console.log("violations: ", violations);
  const handleSearch = () => {
    dispatch(searchState(search));
    dispatch(fetchProfile(search));
    setSearch(search);
  };

  useEffect(() => {
    dispatch(fetchViolations());
  }, [dispatch, refresh]);

  const handleClear = () => {
    dispatch(searchState());
    setSearch("");
  };
  const handleTotalViolations = () => {
    dispatch(showViolationsPage(!showViolations));
    navigation.navigate("AddViolations");
  };
  const [filterViolationStatus, setFilterViolationStatus] = useState("all");
  const filteredViloationData = violations?.filter((item) => {
    if (filterViolationStatus === "all") return true;
    return item.status === filterViolationStatus;
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const ModalContent = ({ selectedItem }) => {
    const imageUrls = selectedItem.pics.split(",");

    const renderItem = ({ item }) => (
      <Image
        source={{ uri: item }}
        alt="Violation Image"
        style={{
          width: 300,
          height: 300,
          borderRadius: 10,
          marginHorizontal: 5,
        }}
        resizeMode="cover"
      />
    );

    return (
      <VStack space={5}>
        <Text fontSize="xl" fontWeight="bold" color="gray.800">
          Vehicle Number:{" "}
          <Text fontWeight="medium" color="gray.600">
            {selectedItem.vehicle_number}
          </Text>
        </Text>
        <Text fontSize="lg" fontWeight="bold" color="gray.800">
          Violation:{" "}
          <Text fontWeight="medium" color="gray.600">
            {selectedItem.violation_type}
          </Text>
        </Text>
        <Text fontSize="lg" fontWeight="bold" color="gray.800">
          Total Fine:{" "}
          <Text fontWeight="medium" color="red.500">
            ₹{selectedItem.totalFines}
          </Text>
        </Text>

        <FlatList
          data={imageUrls}
          horizontal
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item}-${index}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 10,
          }}
        />
      </VStack>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="#f5f5f5">
          <Box backgroundColor="#007367" paddingY="2" paddingX="3">
            <HStack
              alignItems="center"
              justifyContent="space-between"
              position="absolute"
              top={10}
              px={2}
            >
              <Ionicons
                name="arrow-back"
                size={30}
                color="white"
                onPress={() => navigation.goBack()}
              />
              <Text
                fontSize={30}
                color="white"
                fontWeight="bold"
                textAlign="center"
                flex={1}
              >
                Violations
              </Text>
            </HStack>
            {profileLength > 0 && (
              <HStack
                backgroundColor="white"
                borderRadius="10"
                alignItems="center"
                paddingX="4"
                paddingY="4"
                mt="2"
                shadow="2"
                top={20}
              >
                <HStack space={"xl"}>
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
                        {profile?.stdprofile?.[0]?.regdno ||
                          "Registration number not available"}
                      </Text>
                      <Badge colorScheme="success" _text={{ fontSize: "md" }}>
                        {profile?.stdprofile?.[0]?.status === "A"
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </HStack>
                  </VStack>
                </HStack>
              </HStack>
            )}
          </Box>
          <View style={{ flex: 1, position: "relative", top: 30 }} p={3}>
            {profile && profileLength > 0 && (
              <Box
                backgroundColor="white"
                borderRadius="10"
                shadow="3"
                py={"8"}
                px={"4"}
                mt="10"
              >
                <HStack justifyContent="space-between" space={3}>
                  <Button
                    variant={
                      filterViolationStatus === "all" ? "filled" : "outline"
                    }
                    borderRadius="20"
                    backgroundColor={
                      filterViolationStatus === "all"
                        ? "#007367"
                        : "transparent"
                    }
                    borderColor="#007367"
                    py="1"
                    _text={{
                      color:
                        filterViolationStatus === "all" ? "#fff" : "#007367",
                      fontWeight: "bold",
                      fontSize: "md",
                    }}
                    flex={1}
                    onPress={() => setFilterViolationStatus("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={
                      filterViolationStatus === "paid" ? "filled" : "outline"
                    }
                    borderRadius="20"
                    backgroundColor={
                      filterViolationStatus === "paid"
                        ? "#007367"
                        : "transparent"
                    }
                    borderColor="#007367"
                    py="1"
                    _text={{
                      color:
                        filterViolationStatus === "paid" ? "#fff" : "#007367",
                      fontWeight: "bold",
                      fontSize: "md",
                    }}
                    flex={1}
                    onPress={() => setFilterViolationStatus("paid")}
                  >
                    Paid
                  </Button>
                  <Button
                    variant={
                      filterViolationStatus === "unpaid" ? "filled" : "outline"
                    }
                    borderRadius="20"
                    backgroundColor={
                      filterViolationStatus === "unpaid"
                        ? "#007367"
                        : "transparent"
                    }
                    borderColor="#007367"
                    py="1"
                    _text={{
                      color:
                        filterViolationStatus === "unpaid" ? "#fff" : "#007367",
                      fontWeight: "bold",
                      fontSize: "md",
                    }}
                    flex={1}
                    onPress={() => setFilterViolationStatus("unpaid")}
                  >
                    Unpaid
                  </Button>
                </HStack>
                {}
                <Divider
                  my="4"
                  thickness="2"
                  bgColor="gray.300"
                  borderRadius="full"
                />

                <VStack space={4}>
                  {filteredViloationData.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        handleOpenModal(item);
                      }}
                      key={index}
                    >
                      <HStack
                        justifyContent="space-between"
                        alignItems="center"
                        backgroundColor="#F0F0F0"
                        borderRadius="10"
                        padding="2"
                        space={"1"}
                      >
                        {}
                        <Text fontSize="md" fontWeight="medium" color="#333">
                          {index + 1}. {item.name}
                        </Text>
                        {}
                        <HStack alignItems="center" space={0}>
                          <Ionicons
                            name={
                              item.type === "car"
                                ? "car-outline"
                                : "bicycle-outline"
                            }
                            size={18}
                            color="#007367"
                          />
                          <Badge
                            colorScheme="coolGray"
                            variant="subtle"
                            _text={{
                              fontSize: "sm",
                              fontWeight: "bold",
                              color: "#555",
                            }}
                          >
                            {item.vehicle_number}
                          </Badge>
                        </HStack>
                      </HStack>
                    </TouchableOpacity>
                  ))}
                </VStack>
              </Box>
            )}
          </View>

          <TouchableOpacity
            style={{
              position: "absolute",
              right: 25,
              zIndex: 1000,
              bottom: 12,
              backgroundColor: "#007367",
              borderRadius: 50,
              paddingVertical: 10,
              paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("Create Pass")}
          >
            <Ionicons name="add-circle-outline" size={30} color="white" />
          </TouchableOpacity>
          <Modal isOpen={isModalVisible} onClose={handleCloseModal}>
            <Modal.Content maxHeight="100%" width="100%" top={10}>
              <Modal.CloseButton />
              <Modal.Header>Violation Details</Modal.Header>
              <Modal.Body>
                {selectedItem && <ModalContent selectedItem={selectedItem} />}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  size="md"
                  width="100"
                  onPress={handleCloseModal}
                  colorScheme="red"
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default ViolationsTabs;

import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  HStack,
  Input,
  VStack,
  View,
  ScrollView,
  useToast,
} from "native-base";
import { Pressable, Linking, Keyboard, BackHandler, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import GatepassCard from "../SearchCards/gatepassCard";
import SkeletonCard from "../SearchCards/skeletonCard";
import ViolationsCard from "../SearchCards/violationCard";
import VisitorDetailsCard from "../SearchCards/visitorsCard";
import useSearch from "../../../hooks/useSearch";
import { useSelector } from "react-redux";
const featuredData = [
  {
    name: "CCTV",
    img: { uri: "http://172.17.58.151:9000/auth/getImage/cctvnew.png" },
  },
  {
    name: "Communication",
    img: { uri: "http://172.17.58.151:9000/auth/getImage/aggressive (1).png" },
  },
];
const emergencyData = [
  {
    name: "Ambulance",
    img: {
      uri: "http://172.17.58.151:9000/auth/getImage/ambulance.png",
    },
    phone: "108",
  },
  {
    name: "Disha",
    img: {
      uri: "http://172.17.58.151:9000/auth/getImage/dishaimg.png",
    },
    phone: "181",
  },
  {
    name: "Fire",
    img: {
      uri: "http://172.17.58.151:9000/auth/getImage/firenew.png",
    },
    phone: "104",
  },
  {
    name: "Police",
    img: {
      uri: "http://172.17.58.151:9000/auth/getImage/policenew.png",
    },
    phone: "100",
  },
];
export default function Home() {
  const navigation = useNavigation();
  const {
    setSearch,
    isSearchTriggered,
    handleSearch,
    handleClear,
    isLoading,
    cardData,
    cardType,
    profile: homeProfile,
  } = useSearch();
  const { profile } = useSelector((state) => state.profile);
  const search = useSelector((state) => state.home.searchStore);
  const toast = useToast();
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search?.trim() !== "") {
        setDebouncedSearch(search);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);
  useFocusEffect(
    useCallback(() => {
      if (debouncedSearch) {
        handleSearch();
      }
      const onBackPress = () => {
        Alert.alert("Exit App", "Are you sure you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [debouncedSearch])
  );
  const handleRoute = (item) => {
    navigation.navigate({ name: item.name });
  };
  const handleEmergencyRoute = (item) => {
    const phoneNumber = `tel:${item.phone}`;
    Linking.openURL(phoneNumber).catch((err) =>
      console.error("Error opening dialer:", err)
    );
  };
  const renderCard = (cardType, cardData) => {
    switch (cardType) {
      case "Violations":
        return <ViolationsCard />;
      case "GatePass":
        return <GatepassCard data={cardData} />;
      case "VisitorManagement":
        return <VisitorDetailsCard data={cardData} />;
      default:
        return (
          <View
            style={{
              flex: 1,
              height: "auto",
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
  };
  const FeaturedCard = ({ item }) => (
    <Pressable
      onPress={() =>
        item.name === "Communication"
          ? handleRoute(item)
          : toast.show({
              render: () => (
                <Box
                  bg="green.300"
                  px="6"
                  py="2"
                  rounded="md"
                  shadow={2}
                  position={"absolute"}
                  right={3}
                >
                  <Text>Coming soon...</Text>
                </Box>
              ),
              placement: "top-right",
              duration: 3000,
              isClosable: true,
            })
      }
      flex={1}
      margin="8"
      marginBottom="8"
    >
      <Box
        bg="white"
        borderRadius="xl"
        alignItems="center"
        justifyContent="center"
        shadow="3"
        padding="2"
        minWidth="12"
        minHeight="20"
      >
        <Image
          source={item.img}
          alt={item.name}
          size="12"
          resizeMode="contain"
        />
      </Box>
      <Text
        fontSize="sm"
        fontWeight="bold"
        color="black"
        mt="1"
        textAlign="center"
      >
        {item.name}
      </Text>
    </Pressable>
  );
  const EmergencyCard = ({ item }) => (
    <Pressable onPress={() => handleEmergencyRoute(item)} flex={1} margin="2">
      <Box
        bg="white"
        borderRadius="xl"
        alignItems="center"
        justifyContent="center"
        shadow="3"
        padding="2"
        minWidth="16"
        minHeight="16"
      >
        <Image
          source={item.img}
          alt={item.name}
          size="10"
          resizeMode="contain"
        />
      </Box>
      <Text
        fontSize="sm"
        fontWeight="bold"
        color="black"
        mt="2"
        textAlign="center"
      >
        {item.name}
      </Text>
    </Pressable>
  );
  const FeaturedAndEmergencyCards = ({ featuredData, emergencyData }) => (
    <>
      <VStack space={4}>
        <HStack justifyContent="space-between" flexWrap="wrap">
          {featuredData.map((item, index) => (
            <FeaturedCard key={index} item={item} />
          ))}
        </HStack>
      </VStack>
      <Box
        paddingX="3"
        paddingY="4"
        backgroundColor="#95E1D975"
        borderRadius={10}
        marginTop={10}
      >
        <Text fontSize="lg" fontWeight="bold" color="black" mb="4">
          Emergency
        </Text>
        <HStack justifyContent="space-between" flexWrap="wrap">
          {emergencyData.map((item, index) => (
            <EmergencyCard key={index} item={item} />
          ))}
        </HStack>
      </Box>
    </>
  );
  const SearchResults = ({ isLoading, cardType, cardData }) => {
    if (isLoading) return <SkeletonCard />;
    return (
      <View>
        <Box backgroundColor="transparent">
          {renderCard(cardType, cardData)}
        </Box>
      </View>
    );
  };
  return (
    <Box flex={1} backgroundColor="#f5f5f5" onPress={Keyboard.dismiss}>
      <Box backgroundColor="#007367" paddingY="4" paddingX="4" zIndex={1}>
        <HStack
          alignItems="center"
          justifyContent="center"
          position="relative"
          top={10}
        >
          <VStack alignItems="center" flex={1}>
            <Text
              fontSize={30}
              color="white"
              fontWeight="bold"
              textAlign="center"
            >
              G-Security
            </Text>
          </VStack>
        </HStack>
        <HStack top={12} justifyContent="center">
          <Text fontSize={18} color="white" fontWeight="thin" textAlign="left">
            {profile?.stdprofile?.[0]?.name || "N/A"}
          </Text>
        </HStack>
        <HStack
          backgroundColor="white"
          borderRadius="20"
          alignItems="center"
          paddingX="4"
          paddingY="4"
          mt="4"
          shadow="2"
          top={50}
        >
          <Input
            flex={1}
            placeholder="Enter Id"
            variant="unstyled"
            fontSize="md"
            value={search}
            onChangeText={(value) => setSearch(value)}
          />
          {search ? (
            <HStack space={3}>
              <Ionicons
                name="close-circle-outline"
                size={26}
                color="black"
                onPress={handleClear}
              />
              <Ionicons
                name="search-outline"
                size={26}
                color="black"
                onPress={handleSearch}
              />
            </HStack>
          ) : (
            <Pressable onPress={handleSearch}>
              <Ionicons name="search-outline" size={26} color="black" />
            </Pressable>
          )}
        </HStack>
      </Box>
      {isSearchTriggered && search?.length > 0 ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 38,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <Box paddingX="4" paddingY="4" marginTop={10} minHeight="100%">
            <SearchResults
              isLoading={isLoading}
              cardType={cardType}
              cardData={cardData}
            />
          </Box>
        </ScrollView>
      ) : (
        <Box paddingX="4" paddingY="4" marginTop={10}>
          <FeaturedAndEmergencyCards
            featuredData={featuredData}
            emergencyData={emergencyData}
          />
        </Box>
      )}
    </Box>
  );
}

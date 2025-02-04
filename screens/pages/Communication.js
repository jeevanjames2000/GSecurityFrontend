import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Text,
  HStack,
  Input,
  VStack,
  ScrollView,
  Pressable,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Communication({ navigation }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { profile } = useSelector((state) => state.profile);
  const formatTime = (time) => {
    if (!time) return "N/A";
    const date = new Date(time);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        "http://172.17.58.151:9000/auth/getAllMessages"
      );
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        console.warn("No messages found.");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("authUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (!profile) {
            setMessages((prevMessages) =>
              prevMessages.map((msg) => ({
                ...msg,
                sender: parsedUser,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user from AsyncStorage:", error);
      }
    };
    fetchUser();
    fetchMessages();
  }, [profile]);
  const handleSendMessage = useCallback(async () => {
    const date = new Date();
    const time = formatTime(date);
    if (message.trim()) {
      const newMessage = {
        regdNo: profile?.stdprofile[0]?.regdno || "Unknown",
        mobile: profile?.stdprofile[0]?.mobile || "Unknown",
        username: profile?.stdprofile[0]?.name || "Anonymous",
        message: message,
        time: time,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
      try {
        const saveResponse = await fetch(
          "http://172.17.58.151:9000/auth/communications",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newMessage),
          }
        );
        const saveData = await saveResponse.json();
        if (!saveData.success) {
          console.warn("Failed to store message:", saveData.error);
          return;
        }
        const tokenResponse = await fetch(
          "http://172.17.58.151:9000/auth/getAllPushTokens"
        );
        const tokenData = await tokenResponse.json();
        if (
          !tokenData.success ||
          !tokenData.pushTokens ||
          tokenData.pushTokens.length === 0
        ) {
          console.warn("No valid push tokens found.");
          return;
        }
        const pushTokens = tokenData.pushTokens;
        await fetch("http://172.17.58.151:9000/auth/expoPushNotification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pushTokens,
            title: "Communication Alert",
            body: message,
          }),
        });
      } catch (error) {
        console.error("Error sending message and notification:", error);
      }
    }
  }, [message, profile]);
  return (
    <Box flex={1} backgroundColor="#fff">
      <Box backgroundColor="#007367" paddingY="10" paddingX="4" zIndex={1}>
        <HStack
          alignItems="center"
          justifyContent="center"
          top={10}
          paddingBottom={"4"}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </Pressable>
          <VStack alignItems="center" flex={1}>
            <Text
              fontSize={30}
              color="white"
              fontWeight="bold"
              textAlign="center"
            >
              Communication
            </Text>
          </VStack>
        </HStack>
      </Box>
      <ScrollView flex={1} marginTop={4} px={"4"} py="2">
        {messages.map((msg, index) => (
          <Box
            key={index}
            bg="#e6f6f6"
            px="4"
            py="2"
            borderRadius="md"
            marginY="1"
          >
            <HStack justifyContent="space-between">
              <HStack space={2}>
                <Text fontWeight="bold">{msg?.username || "Anonymous"}</Text>
                <Text color="gray.500">+91 {msg?.mobile || "N/A"}</Text>
              </HStack>
            </HStack>
            <Text mt="2" py={2} fontSize={"md"}>
              {msg?.message}
            </Text>
            <Text color="gray.500" fontSize="xs" textAlign={"right"}>
              {formatTime(msg.time)}
            </Text>
          </Box>
        ))}
      </ScrollView>
      <HStack space={3} alignItems="center" padding={4}>
        <Input
          flex={1}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          variant="filled"
          backgroundColor="white"
          borderColor={"black"}
          borderRadius="lg"
          p={"4"}
          fontSize={"md"}
        />
        <Pressable onPress={handleSendMessage}>
          <Ionicons name="send" size={26} color="#007367" />
        </Pressable>
      </HStack>
    </Box>
  );
}

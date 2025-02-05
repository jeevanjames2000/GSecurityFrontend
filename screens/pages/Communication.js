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
    if (isNaN(date.getTime())) return "Invalid Time";
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
                time: msg.time
                  ? new Date(msg.time).toISOString()
                  : new Date().toISOString(),
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
    const isoTime = date.toISOString();
    if (message.trim()) {
      const newMessage = {
        regdNo: profile?.stdprofile[0]?.regdno || "Unknown",
        mobile: profile?.stdprofile[0]?.mobile || "Unknown",
        username: profile?.stdprofile[0]?.name || "Anonymous",
        message: message,
        time: isoTime,
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
  const getMessageDateLabel = (messageTime) => {
    if (!messageTime) return "Unknown";
    const msgDate = new Date(messageTime);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    msgDate.setHours(0, 0, 0, 0);
    if (msgDate.getTime() === today.getTime()) return "Today";
    if (msgDate.getTime() === yesterday.getTime()) return "Yesterday";
    return msgDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateLabel = getMessageDateLabel(msg.time);
    if (!acc[dateLabel]) {
      acc[dateLabel] = [];
    }
    acc[dateLabel].push(msg);
    return acc;
  }, {});
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
      <ScrollView flex={1} px="4" py="2">
        {Object.entries(groupedMessages).map(([dateLabel, msgs], index) => (
          <React.Fragment key={index}>
            <Box
              alignSelf="center"
              px="3"
              py="0.5"
              borderRadius="5"
              borderWidth={1}
              borderColor="rgba(0, 0, 0, 0.1)"
              shadow={2}
              bg={"#F8FAFC"}
              mb={0.5}
              mt={0.5}
            >
              <Text
                color="black"
                fontWeight="bold"
                fontSize={14}
                textAlign="center"
              >
                {dateLabel}
              </Text>
            </Box>
            {msgs.map((msg, msgIndex) => (
              <Box
                key={msgIndex}
                bg="#e6f6f6"
                px="4"
                py="2"
                borderRadius="md"
                marginY="1"
              >
                <HStack justifyContent="space-between">
                  <HStack space={2}>
                    <Text fontWeight="bold">
                      {msg?.username || "Anonymous"}
                    </Text>
                    <Text color="gray.500">+91 {msg?.mobile || "N/A"}</Text>
                  </HStack>
                </HStack>
                <Text mt="2" py={2} fontSize="md">
                  {msg?.message}
                </Text>
                <Text color="gray.500" fontSize="xs" textAlign="right">
                  {msg.time ? formatTime(msg.time) : "N/A"}
                </Text>
              </Box>
            ))}
          </React.Fragment>
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
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />
        <Pressable onPress={handleSendMessage}>
          <Ionicons name="send" size={26} color="#007367" />
        </Pressable>
      </HStack>
    </Box>
  );
}

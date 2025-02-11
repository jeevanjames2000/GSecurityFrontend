import React, { useEffect, useState, useCallback, useRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logErrorToDB } from "../../store/slices/loggerSlice";
export default function Communication({ navigation }) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { profile, deviceType } = useSelector((state) => state.profile);
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
      }
    } catch (error) {
      const errorDetails = {
        errorLevel: "error",
        errorMessage: "Error Fetching messages at communications",
        errorType: "API error",
        totalActiveUsers: 0,
        errorLocation: "Communications",
        deviceType: deviceType,
      };

      dispatch(logErrorToDB(errorDetails));
    }
  };
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
      const errorDetails = {
        errorLevel: "error",
        errorMessage: "Error Fetching data from Local storage",
        errorType: "AyncStorage Error",
        totalActiveUsers: 0,
        errorLocation: "Communications",
        deviceType: deviceType,
      };

      dispatch(logErrorToDB(errorDetails));
    }
  };
  const scrollViewRef = useRef(null);
  useEffect(() => {
    fetchUser();
    fetchMessages();
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 500);
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
          `http://172.17.58.151:9000/auth/getAllPushTokens/${profile?.stdprofile[0]?.regdno}`
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
        const errorDetails = {
          errorLevel: "error",
          errorMessage: error || "error sending message or push notifications",
          errorType: "API error",
          totalActiveUsers: 0,
          errorLocation: "Communications",
          deviceType: deviceType,
        };
        dispatch(logErrorToDB(errorDetails));
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
  const sortedMessages = messages.sort(
    (a, b) => new Date(a.time) - new Date(b.time)
  );
  const groupedMessages = sortedMessages.reduce((acc, msg) => {
    const dateLabel = getMessageDateLabel(msg.time);
    if (!acc[dateLabel]) {
      acc[dateLabel] = [];
    }
    acc[dateLabel].push(msg);
    return acc;
  }, {});
  const sortedGroupedMessages = Object.entries(groupedMessages).sort(
    ([a], [b]) => {
      if (a === "Today") return 1;
      if (b === "Today") return -1;
      return new Date(a) - new Date(b);
    }
  );
  function MessageItem({ msg }) {
    const [expanded, setExpanded] = useState(false);
    const isLongMessage = msg?.message.length > 100;
    const displayText = expanded
      ? msg?.message
      : msg?.message.slice(0, 118) + (isLongMessage ? "..." : "");
    return (
      <Box bg="#e6f6f6" px="4" py="1" borderRadius="md" marginY="1">
        <HStack justifyContent="space-between">
          <HStack space={2}>
            <Text fontWeight="bold">{msg?.username || "Anonymous"}</Text>
            <Text color="gray.500">+91 {msg?.mobile || "N/A"}</Text>
          </HStack>
        </HStack>
        <Text mt="2" fontSize="md">
          {displayText}
          {isLongMessage && !expanded && (
            <Text
              color="warning.500"
              fontSize={14}
              textAlign={"right"}
              alignItems={"center"}
              onPress={() => setExpanded(true)}
            >
              Read more
            </Text>
          )}
          {expanded && (
            <Text
              color="blue.500"
              fontSize="md"
              textAlign={"center"}
              onPress={() => setExpanded(false)}
            >
              Read less
            </Text>
          )}
        </Text>
        <Text color="gray.500" fontSize="xs" textAlign="right">
          {msg.time ? formatTime(msg.time) : "N/A"}
        </Text>
      </Box>
    );
  }
  return (
    <Box flex={1} backgroundColor="#fff">
      <Box backgroundColor="#007367" paddingY="10" paddingX="4" zIndex={1}>
        <HStack
          alignItems="center"
          justifyContent="center"
          top={5}
          paddingBottom={"0"}
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
      <ScrollView
        ref={scrollViewRef}
        flex={1}
        px="4"
        py="2"
        mb={1}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {sortedGroupedMessages.map(([dateLabel, msgs], index) => (
          <React.Fragment key={index}>
            <Box
              alignSelf="center"
              px="3"
              py="0.5"
              borderRadius="10"
              borderWidth={1}
              borderColor="rgba(0, 0, 0, 0.1)"
              shadow={2}
              bg={"#F8FAFC"}
              mb={0.5}
              mt={0.5}
            >
              <Text
                color="black"
                fontWeight="thin"
                fontSize={14}
                textAlign="center"
              >
                {dateLabel}
              </Text>
            </Box>
            {msgs.map((msg, msgIndex) => (
              <MessageItem key={msgIndex} msg={msg} />
            ))}
          </React.Fragment>
        ))}
      </ScrollView>
      <HStack space={3} alignItems="center" padding={4} pt={2} pb={2}>
        <Input
          flex={1}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          variant="filled"
          borderColor={"black"}
          bg={"#fff"}
          borderRadius="lg"
          p={"3"}
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

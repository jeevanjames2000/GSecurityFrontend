import React, { useCallback, useRef, useState } from "react";
import {
  Text,
  Box,
  Image,
  VStack,
  Input,
  Spinner,
  View,
  useToast,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch } from "react-redux";
import {
  fetchProfile,
  sendPushTokenToServer,
} from "../../store/slices/profileSlice";
import { fetchProfile as AuthProfile } from "../../store/slices/authSlice";
import Constants from "../../constants/Constants";
export default function Login({ navigation }) {
  const OTP_LENGTH = 4;
  const toast = useToast();
  const dispatch = useDispatch();
  const INITIAL_OTP = Array(OTP_LENGTH).fill("");
  const [mobile, setMobile] = useState("");
  const handleClear = () => {
    setMobile("");
  };
  const [otp, setOtp] = useState(INITIAL_OTP);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = Array(OTP_LENGTH)
    .fill(0)
    .map(() => useRef(null));
  const handleSendOtp = useCallback(async () => {
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${Constants.GSecurity_API_URL}/auth/generateAndStoreOtp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setIsLoading(false);
        setOtpSent(true);
        setError("");
        setTimeout(() => setOtpSent(false), 3000);
      }
    } catch (error) {
      setError("Error Generating OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [mobile]);
  const handleChangeOtp = useCallback(
    (text, index) => {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text.length === 1 && index < OTP_LENGTH - 1) {
        otpRefs[index + 1].current.focus();
      }
    },
    [otp, otpRefs]
  );
  const handleKeyPress = useCallback(
    (event, index) => {
      if (
        event.nativeEvent.key === "Backspace" &&
        otp[index] === "" &&
        index > 0
      ) {
        otpRefs[index - 1].current.focus();
      }
    },
    [otp, otpRefs]
  );
  const handleLogin = useCallback(async () => {
    const pushToken = await AsyncStorage.getItem("pushToken");
    Keyboard.dismiss();
    if (mobile.length !== 10 || otp.includes("")) {
      setError("Please enter a valid mobile number and OTP.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${Constants.GSecurity_API_URL}/auth/loginWithOtp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile, otp: parseInt(otp.join(""), 10) }),
        }
      );
      const data = await response.json();
      const { user, token } = data;
      if (response.ok) {
        await AsyncStorage.setItem("token", token);
        dispatch(sendPushTokenToServer({ pushToken, regdNo: user?.regdNo }));
        dispatch(fetchProfile(user?.regdNo));
        dispatch(AuthProfile(user?.regdNo));
        navigation.replace("Main");
        toast.show({
          render: () => (
            <Box
              bg="green.300"
              px="6"
              py="2"
              rounded="md"
              shadow={2}
              position="absolute"
              right={3}
            >
              <Text>Welcome back! {user?.username}</Text>
            </Box>
          ),
          placement: "top-right",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please check your connection.");
    } finally {
      setOtp(INITIAL_OTP);
      setIsLoading(false);
    }
  }, [mobile, otp, navigation]);
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box flex={1} bg="white" justifyContent="center" alignItems="center">
          <Box
            position="absolute"
            top={10}
            justifyContent="center"
            alignItems="center"
          >
            <Image
              source={{
                uri: `${Constants.GSecurity_API_URL}/auth/getImage/GitamLogo.jpg`,
              }}
              alt="Search Icon"
              style={{ height: 200, width: 200 }}
              resizeMode="contain"
            />
          </Box>
          <Box
            position="absolute"
            top={150}
            width="100%"
            height="50%"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              source={{
                uri: `${Constants.GSecurity_API_URL}/auth/getImage/Frame1.png`,
              }}
              alt="Illustration"
              resizeMode="contain"
              style={{ width: "90%", height: "90%" }}
            />
          </Box>
          <Box
            bg="#00796B"
            borderTopRadius="40"
            p={5}
            pb={10}
            width="100%"
            alignItems="center"
            position="absolute"
            bottom={0}
          >
            <Text
              fontSize="3xl"
              color="white"
              mb={5}
              fontWeight="bold"
              textAlign="center"
            >
              G-Security
            </Text>
            <VStack space={3} width="100%" alignItems="center" padding={1}>
              <Input
                placeholder="Mobile number"
                variant="filled"
                bg="white"
                p={3}
                value={mobile}
                onChangeText={setMobile}
                borderRadius="md"
                width="100%"
                fontSize={16}
                keyboardType="numeric"
                maxLength={10}
                _focus={{ bg: "#fff" }}
                InputRightElement={
                  <Box flexDirection="row" alignItems="center">
                    {/* {mobile.length > 0 && (
                      <TouchableOpacity onPress={handleClear}>
                        <Text fontSize="lg" color="black" marginRight={5}>
                          ✖
                        </Text>
                      </TouchableOpacity>
                    )} */}
                    <TouchableOpacity onPress={handleSendOtp}>
                      <Text fontSize="xl" color="black" marginRight={5}>
                        ➔
                      </Text>
                    </TouchableOpacity>
                  </Box>
                }
              />
              <Box
                flexDirection="row"
                justifyContent="space-between"
                width="100%"
              >
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    value={digit}
                    onChangeText={(text) => handleChangeOtp(text, index)}
                    onKeyPress={(event) => handleKeyPress(event, index)}
                    ref={otpRefs[index]}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                    fontSize={20}
                    bg="white"
                    width="22%"
                  />
                ))}
              </Box>
              {otpSent && (
                <Text color="white">OTP sent to your mobile number.</Text>
              )}
              {error && <Text color="red.500">{error}</Text>}
              {isLoading ? (
                <Spinner size="lg" color="white" />
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#A58255",
                    padding: 15,
                    borderRadius: 5,
                    width: "100%",
                  }}
                  onPress={handleLogin}
                >
                  <Text
                    textAlign="center"
                    fontSize={17}
                    fontWeight="bold"
                    color="#fff"
                  >
                    Log in
                  </Text>
                </TouchableOpacity>
              )}
            </VStack>
            <View position={"absolute"} bottom={2}>
              <Text color={"#ddd"} fontSize={12}>
                Powered by CATS
              </Text>
            </View>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Image,
  FlatList,
} from "react-native";
import { Button, Text } from "native-base";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
export default function QrCamera() {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("back");
  const device = useCameraDevice(cameraFacing);
  const camera = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [animationValue] = useState(new Animated.Value(0));
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [barcodeMode, setBarcodeMode] = useState(false);
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [hasPermission]);
  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-130, 130],
  });
  if (!device) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons name="alert-circle-outline" size={40} color="red" />
        <Text style={styles.text}>Camera device not found!</Text>
      </View>
    );
  }
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
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
      setShowImagePopup(true);
    }
  };
  const toggleFlash = () => {
    setIsFlashOn((prev) => !prev);
  };
  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === "back" ? "front" : "back"));
  };
  const toggleBarcodeMode = () => {
    setBarcodeMode((prev) => !prev);
  };
  const closeImages = () => {
    setSelectedImages([]);
    setShowImagePopup(false);
  };
  const capturePhoto = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto({
        flash: isFlashOn ? "on" : "off",
      });
      console.log("photo path:", photo.path);
      CameraRoll.saveAsset(photo.path);
    }
  };
  const [scannedData, setScannedData] = useState(null);
  const codeScanner = useCodeScanner({
    codeTypes: [
      "qr",
      "ean-13",
      "ean-8",
      "upc-a",
      "upc-e",
      "code-128",
      "code-39",
      "code-93",
      "codabar",
      "aztec",
      "data-matrix",
    ],
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        codes.forEach((code, index) => {
          setScannedData(code.value);
        });
      }
    },
  });
  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        codeScanner={barcodeMode ? codeScanner : undefined}
        isActive={true}
        photo={!barcodeMode}
      />
      <View style={styles.overlay}>
        <View style={styles.qrFrame}>
          {barcodeMode && (
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY }] }]}
            />
          )}
        </View>
        {scannedData?.length > 0 && (
          <Text fontSize={20} color="#fff" padding={4}>
            {scannedData}
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
        <Ionicons
          name={isFlashOn ? "flash" : "flash-off"}
          size={30}
          color="white"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.barcodeButton}
        onPress={toggleBarcodeMode}
      >
        <Ionicons
          name={!barcodeMode ? "barcode-outline" : "camera-outline"}
          size={30}
          color="white"
        />
      </TouchableOpacity>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handlePickImages}
        >
          <Ionicons name="images-outline" size={30} color="white" />
        </TouchableOpacity>
        {!barcodeMode && (
          <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
            <Ionicons name="camera-outline" size={40} color="black" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraFacing}
        >
          <Ionicons name="camera-reverse-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <Modal visible={showImagePopup} transparent={true} animationType="slide">
        <View style={styles.popupContainer}>
          <FlatList
            data={selectedImages}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.imagePreview} />
            )}
          />
          <Button
            variant={"outline"}
            colorScheme={"red"}
            style={{ bottom: 20 }}
            onPress={closeImages}
          >
            Clear all selected images
          </Button>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowImagePopup(false)}
          >
            <Ionicons name="close-circle-outline" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  qrFrame: {
    width: 300,
    height: 300,
    borderWidth: 5,
    borderColor: "#007367",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  scanLine: {
    width: "100%",
    height: 2,
    backgroundColor: "white",
  },
  flashButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 2,
  },
  galleryButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#fff",
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  flipButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 10,
  },
  barcodeButton: {
    position: "absolute",
    top: 90,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
  },
  imagePreview: {
    width: 300,
    height: "100%",
    resizeMode: "contain",
    marginHorizontal: 10,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 10,
    zIndex: 1,
  },
});

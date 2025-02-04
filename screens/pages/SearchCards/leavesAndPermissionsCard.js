import {
  Badge,
  Box,
  HStack,
  Image,
  Pressable,
  VStack,
  Text,
  Center,
} from "native-base";

export default function LeavesAndPermissionsCard() {
  const profileData = [
    { key: "Batch", value: "2023-2027" },
    { key: "Email", value: "johndoe@example.com" },
    { key: "Parent/Guardian", value: "Jane Doe" },
    { key: "Parent Contact", value: "+9876543210" },
    { key: "Branch", value: "Computer Science" },
  ];

  const approvalData = [
    { key: "Approved By", value: "Faculty Name" },
    { key: "Type", value: "Leave" },
    { key: "Time", value: "10:00 AM" },
    { key: "Status", value: "Approved" },
  ];

  return (
    <Center>
      <Box
        padding="6"
        shadow="9"
        bg={"#fff"}
        borderRadius={"xl"}
        minWidth={"sm"}
        maxWidth={"sm"}
        mt="1"
        mb="1"
      >
        <HStack space={"lg"}>
          <Image
            source={{
              uri: "http://172.17.58.151:9000/auth/getImage/progfile_sec.jpg",
            }}
            alt="Profile Image"
            size="lg"
            borderRadius="xl"
          />
          <VStack space={"2"}>
            <Text color={"#007367"} fontWeight={"bold"} fontSize="lg">
              John Doe
            </Text>
            <Text fontWeight={"semibold"} fontSize="md">
              Student
            </Text>
            <HStack
              justifyContent={"space-between"}
              alignItems={"center"}
              space={2}
            >
              <Text fontWeight={"semibold"} fontSize="md">
                785489654
              </Text>
              <Badge colorScheme="success" _text={{ fontSize: "md" }}>
                Active
              </Badge>
            </HStack>
          </VStack>
        </HStack>
        {/* Profile Information */}
        <VStack space={1.5} marginTop={"6"}>
          {profileData.map((item, index) => (
            <Box
              key={index}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Text fontSize={"md"}>{item.key}</Text>
              <Text fontSize={"md"} color="#706F6F" paddingLeft={4}>
                {item.value || "Not available"}
              </Text>
            </Box>
          ))}
        </VStack>
        {/* Divider */}
        <Box height="1" backgroundColor="#f0f0f0" my="6" />
        {/* Approval Information */}
        <VStack space={1.5}>
          {approvalData.map((item, index) => (
            <Box
              key={index}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Text fontSize={"md"}>{item.key}</Text>
              <Text fontSize={"md"} color="#706F6F" paddingLeft={4}>
                {item.value || "Not available"}
              </Text>
            </Box>
          ))}
        </VStack>
        {/* Buttons */}

        <HStack
          justifyContent="space-between"
          space={4}
          mt={4}
          alignItems="center"
          width="100%"
        >
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: "#37474F",
              borderRadius: 20,
              paddingVertical: 10,
              paddingHorizontal: 15,
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginRight: 8,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#37474F",
              }}
            >
              Check In
            </Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: "#007367",
              borderRadius: 20,
              paddingVertical: 10,
              paddingHorizontal: 15,
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              Check Out
            </Text>
          </Pressable>
        </HStack>
      </Box>
    </Center>
  );
}

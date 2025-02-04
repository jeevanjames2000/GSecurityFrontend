import React from "react";
import { HStack, VStack, Skeleton } from "native-base";
export default function SkeletonCard() {
  return (
    <VStack space={4} padding={4} bg="white" borderRadius={10} shadow={2}>
      <HStack space={4} alignItems="center">
        <Skeleton
          h={20}
          w="30%"
          startColor="gray.300"
          endColor="gray.100"
          borderRadius={5}
        />
        <VStack space={2} flex={1}>
          <Skeleton
            h={5}
            w="80%"
            startColor="gray.300"
            endColor="gray.100"
            borderRadius={5}
          />
          <Skeleton
            h={5}
            w="40%"
            startColor="gray.300"
            endColor="gray.100"
            borderRadius={5}
          />
          <Skeleton
            h={5}
            w="50%"
            startColor="gray.300"
            endColor="gray.100"
            borderRadius={5}
          />
        </VStack>
      </HStack>
      <VStack space={2} marginTop={3}>
        {[...Array(5)].map((_, index) => (
          <HStack
            key={index}
            justifyContent="space-between"
            alignItems="center"
            py={1}
          >
            <Skeleton
              h={5}
              w="30%"
              startColor="gray.300"
              endColor="gray.100"
              borderRadius={5}
            />
            <Skeleton
              h={5}
              w="60%"
              startColor="gray.300"
              endColor="gray.100"
              borderRadius={5}
            />
          </HStack>
        ))}
      </VStack>
      {}
      <HStack justifyContent="space-between" space={4} marginTop={3}>
        <Skeleton
          h={10}
          w="45%"
          startColor="gray.300"
          endColor="gray.100"
          borderRadius={10}
        />
        <Skeleton
          h={10}
          w="45%"
          startColor="gray.300"
          endColor="gray.100"
          borderRadius={10}
        />
      </HStack>
    </VStack>
  );
}

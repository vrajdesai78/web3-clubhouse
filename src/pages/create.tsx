import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { contractABI } from "@/utils/contractABI";
import { ethers } from "ethers";
import { contractAddress } from "@/utils/constants";
import { useRouter } from "next/router";

export default function SplitScreen() {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const { push } = useRouter();

  const handleCreateSpaces = async () => {
    const response = await fetch("/api/createRoom", {
      method: "POST",
      body: JSON.stringify({
        title: name,
        startTime: new Date(time).toISOString(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data) {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      contract
        .scheduleMeeting(name, data.roomId, new Date(time).toISOString())
        .then((res: string) => {
          if (res) {
            toast.success("Space Created Successfully");
            push("/");
          }
        });
    }
  };

  return (
    <Stack
      minH={"100vh"}
      direction={{ base: "column", md: "row" }}
      backgroundColor="gray.800"
      textColor={"whiteAlpha.800"}
    >
      <Flex p={12} flex={1} align={"center"} justify={"center"} mt="16">
        <Stack spacing={4} w={"full"} maxW={"md"} className="border border-custom-5 p-8 rounded-lg">
          <Heading fontSize={"2xl"}>Create Your Audio Space</Heading>
          <FormControl id="spaceName">
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              placeholder="Give a title"
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl id="spaceTime">
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              color={"whiteAlpha.800"}
              onChange={(e) => setTime(e.target.value)}
            />
          </FormControl>
            <Button
              colorScheme={"blue"}
              variant={"solid"}
              onClick={handleCreateSpaces}
            >
              Create Spaces
            </Button>
        </Stack>
      </Flex>
      <Flex flex={1} mt="16">
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
          }
        />
      </Flex>
    </Stack>
  );
}

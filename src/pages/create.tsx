import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  DarkMode,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { contractABI } from "@/utils/contractABI";
import { contractAddress } from "@/utils/constants";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { useRouter } from "next/router";

export default function SplitScreen() {
  const [name, setName] = useState("");
  const [time, setTime] = useState(new Date().toISOString());
  const [roomId, setRoomId] = useState("");
  const { push } = useRouter();

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "scheduleMeeting",
    args: [name, roomId, new Date(time).toISOString()],
  });

  const { write, status, data } = useContractWrite(config);

  useEffect(() => {
    if (status === "success") {
      console.log(data);
      toast.success("Space created successfully");
      push(`/`);
    }
  }, [status]);

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
      setRoomId(data.roomId);
    }
  };

  useEffect(() => {
    if (roomId && write) {
      console.log("Inside");
      write();
    }
  }, [roomId, write]);

  return (
    <DarkMode>
      <Stack
        minH={"100vh"}
        direction={{ base: "column", md: "row" }}
        backgroundColor="gray.800"
        textColor={"whiteAlpha.800"}
      >
        <Flex p={12} flex={1} align={"center"} justify={"center"} mt="16">
          <Stack
            spacing={4}
            w={"full"}
            maxW={"md"}
            className="border border-custom-5 p-8 rounded-lg"
          >
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
              variant={"solid"}
              bgColor={"blue.500"}
              onClick={async () => {
                await handleCreateSpaces();
              }}
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
    </DarkMode>
  );
}

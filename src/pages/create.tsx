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
  Checkbox,
  Radio,
  RadioGroup,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { contractABI } from "@/utils/contractABI";
import { contractAddress as NFTContractAddress } from "@/utils/constants";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { useRouter } from "next/router";

export default function SplitScreen() {
  const [name, setName] = useState("");
  const [time, setTime] = useState(new Date().toISOString());
  const [roomId, setRoomId] = useState("");
  const [isTokenGate, setIsTokenGate] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [tokenType, setTokenType] = useState("ERC721");
  const [chain, setChain] = useState("ETHEREUM");
  const { push } = useRouter();

  const { config } = usePrepareContractWrite({
    address: NFTContractAddress,
    abi: contractABI,
    functionName: "scheduleMeeting",
    args: [name, roomId, new Date(time).toISOString()],
  });

  const { write, status, data } = useContractWrite(config);

  useEffect(() => {
    if (status === "success") {
      console.log(data);
      toast.success("Space created successfully");
      window.location.href = "/";
    }
  }, [status]);

  const handleCreateSpaces = async () => {
    const response = await fetch("/api/createRoom", {
      method: "POST",
      body: JSON.stringify({
        title: name,
        startTime: new Date(time).toISOString(),
        isTokenGate: isTokenGate,
        tokenType: tokenType,
        contractAddress: contractAddress,
        chain: chain,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    if (data) {
      setRoomId(data.roomId);
    }
  };

  useEffect(() => {
    if (roomId && write) {
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
            <Heading fontSize={"2xl"}>Create Room for Data DAOs</Heading>
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

            <FormControl id="isTokenGate">
              <Checkbox
                onChange={() => setIsTokenGate((prev) => !prev)}
                checked={isTokenGate}
              >
                Token Gate Room
              </Checkbox>
            </FormControl>

            {isTokenGate && 
              <>
                <FormControl id="token-gate-type">
                  <FormLabel>Token Gate With</FormLabel>
                  <RadioGroup
                    onChange={(condition) => {
                      setTokenType(condition);
                    }}
                    value={tokenType}
                    className="border p-2 rounded-lg"
                  >
                    <Stack direction="row">
                      <Radio value={"ERC20"}>ERC20</Radio>
                      <Radio value={"ERC721"}>ERC721</Radio>
                      <Radio value={"ERC1155"}>ERC1155</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl id="select-chain">
                  <FormLabel>Select Chain</FormLabel>
                  <Select
                    placeholder="Select Chain"
                    onChange={(e) => setChain(e.target.value)}
                  >
                    <option value="ETHEREUM">Ethereum</option>
                    <option value="POLYGON">Polygon</option>
                    <option value="ARBITRUM">Arbitrum</option>
                  </Select>
                </FormControl>

                <FormControl id="token-gate-value">
                  <FormLabel>Contract Address</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter Contract Address"
                    onChange={(e) => setContractAddress(e.target.value)}
                  />
                </FormControl>

                {tokenType === "ERC1155" && (
                  <FormControl id="token-gate-value">
                    <FormLabel>Token ID</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter Token ID"
                      onChange={(e) => setContractAddress(e.target.value)}
                    />
                  </FormControl>
                )}
              </>
            }
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

import { contractABI } from "@/utils/contractABI";
import { SimpleGrid, Box, Stack, Text, Button } from "@chakra-ui/react";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useAccount, useContractRead } from "wagmi";
import { useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { contractAddress } from "@/utils/constants";
import useStore from "@/store/slices";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

interface contractResponse {
  title: string;
  roomId: string;
  time: string;
}

export const getServerSideProps = async () => {
  const response = await fetch(
    "https://api.huddle01.com/api/v1/live-meetings",
    {
      method: "GET",
      headers: {
        "x-api-key": process.env.API_KEY as string,
      },
    }
  );
  const liveMeetings = await response.json();
  return {
    props: {
      liveMeetings,
    },
  };
};

const Home = ({
  liveMeetings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const setSpacesTitle = useStore((state) => state.setSpacesTitle);
  const { push } = useRouter();

  useEffectOnce(() => {
    setIsLoading(true);
  });

  const calculateRemainingTime = (time: string) => {
    const now = new Date();
    const targetTime = new Date(time);
    const timeDifference = targetTime.getTime() - now.getTime();
    if (timeDifference <= 0) {
      return `Start Spaces`;
    }
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    let result = "Starts in ";
    if (hours > 0) {
      result += `${hours} hour `;
    }

    if (minutes > 0) {
      result += `${minutes} minutes`;
    }

    if (hours === 0 && minutes === 0) {
      result = `Start Spaces`;
    }

    return result;
  };

  const { data: yourMeetings } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "getUserMeetings",
    args: [address],
  });

  return (
    <Stack className="bg-custom-3 h-screen text-custom-7">
      <Text className="flex mt-20 items-center justify-center text-2xl">
        Your Spaces
      </Text>
      <SimpleGrid
        columns={4}
        spacing={10}
        px={12}
        py={6}
        className="bg-custom-3"
      >
        {isLoading &&
          (yourMeetings as contractResponse[]) &&
          (yourMeetings as contractResponse[]).map((room: contractResponse) => (
            <Box
              key={room.roomId}
              className="bg-custom-1 rounded-xl p-4 justify-center items-center"
              minW={72}
            >
              <div className="flex flex-col gap-2 items-center justify-center">
                <h1 className="flex items-center justify-center text-xl font-bold">
                  {room.title}
                </h1>
                <Image
                  src="/images/AppIcon.png"
                  alt="logo"
                  width={96}
                  height={96}
                  className="object-contain p-2 rounded-2xl"
                  quality={100}
                />
                <Button
                  className="flex items-center justify-center"
                  type="button"
                  colorScheme={"blue"}
                  onClick={() => {
                    if (calculateRemainingTime(room.time) === "Start Spaces") {
                    setSpacesTitle(room.title);
                    push(`/${room.roomId}/lobby`);
                    } else {
                      toast.error("You can't join this space yet");
                    }
                  }}
                  _disabled={{
                    bg: "gray.300",
                  }}
                >
                  {calculateRemainingTime(room.time)}
                </Button>
              </div>
            </Box>
          ))}
      </SimpleGrid>
      <div className="flex items-center justify-center text-2xl">
        Live Spaces
      </div>
      <SimpleGrid
        columns={4}
        spacing={10}
        px={12}
        py={6}
        className="bg-custom-3"
      >
        {liveMeetings.liveMeetings.map((room: any) => (
          <Box
            key={room.roomId}
            className="bg-custom-1 rounded-xl p-4 justify-center items-center"
            minW={72}
          >
           <div className="flex flex-col gap-2 items-center justify-center">
                <h1 className="flex items-center justify-center text-xl font-bold">
                  {room.title}
                </h1>
                <Image
                  src="/images/AppIcon.png"
                  alt="logo"
                  width={96}
                  height={96}
                  className="object-contain p-2 rounded-2xl"
                  quality={100}
                />
                <Button
                  className="flex items-center justify-center"
                  type="button"
                  colorScheme={"blue"}
                  onClick={() => {
                    setSpacesTitle(room.title);
                    push(`/${room.roomId}/lobby`);
                  }}
                >
                  Join Now
                </Button>
              </div>
            </Box>
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default Home;

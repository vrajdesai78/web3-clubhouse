import { contractABI } from "@/utils/contractABI";
import { SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { InferGetServerSidePropsType } from "next";
import { useAccount, useContractRead } from "wagmi";
import { useEffect, useState } from "react";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { contractAddress } from "@/utils/constants";
import { SpaceCards } from "@/components/common/SpaceCards";

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

  useEffectOnce(() => {
    setIsLoading(true);
  });

  const { data: yourMeetings } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "getUserMeetings",
    args: [address],
  });

  useEffect(() => {
    if (yourMeetings) {
      console.log(yourMeetings);
    }
  }, [yourMeetings]);

  return (
    <Stack className="bg-custom-3 h-screen text-custom-7">
      <Text className="flex mt-20 items-center justify-center text-2xl font-bold">
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
            <SpaceCards
              roomId={room.roomId}
              title={room.title}
              time={room.time}
              key={room.roomId}
            />
          ))}
      </SimpleGrid>
      <div className="flex items-center justify-center text-2xl font-bold">
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
          <SpaceCards
            roomId={room.roomId}
            title={room.title}
            time={room.time}
            key={room.roomId}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default Home;

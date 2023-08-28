import IntroPage from "@/components/IntroPage/IntroPage";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

interface RoomDetails {
  message: string;
  data: {
    roomId: string;
  };
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("https://api.huddle01.com/api/v1/create-room", {
    method: "POST",
    body: JSON.stringify({
      title: "Test Room",
    }),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY as string,
    },
  });
  const data: RoomDetails = await res.json();
  const { roomId } = data.data;
  return {
    props: {
      roomId,
    },
  };
};

export default function Home({
  roomId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <IntroPage roomId={roomId} />;
}

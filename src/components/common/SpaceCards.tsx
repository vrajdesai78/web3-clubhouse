import { Box, Button } from "@chakra-ui/react";
import Image from "next/image";
import { calculateRemainingTime } from "@/utils/helpers";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import useStore from "@/store/slices";

interface SpaceCardsProps {
  roomId: string;
  title: string;
  time: string;
}

export const SpaceCards: React.FC<SpaceCardsProps> = ({ roomId, title, time }) => {
  const { push } = useRouter();
  const setSpacesTitle = useStore((state) => state.setSpacesTitle);

  return (
    <Box
      key={roomId}
      className="bg-custom-1 rounded-xl p-4 justify-center items-center"
      minW={72}
    >
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="flex items-center justify-center text-xl font-bold">
          {title}
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
          bgColor={"blue.500"}
          onClick={() => {
            if (calculateRemainingTime(time) === "Start Spaces") {
              setSpacesTitle(title);
              push(`/${roomId}/lobby`);
            } else {
              toast.error("You can't join this space yet");
            }
          }}
          _disabled={{
            bg: "gray.300",
          }}
        >
          {calculateRemainingTime(time)}
        </Button>
      </div>
    </Box>
  );
};

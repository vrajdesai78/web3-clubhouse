import React from "react";
import Image from "next/image";
import { Web3Button } from "@web3modal/react";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import useStore from "@/store/slices";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const { push } = useRouter();
  const { spacesTitle } = useStore();

  return (
    <header className="border-b border-custom-1 w-full absolute top-0 left-0 h-16 flex items-center px-10 z-10 text-slate-100 justify-between">
      <Image
        src="/images/Logo.png"
        alt="logo"
        width={180}
        height={180}
        className="object-contain"
        quality={100}
        priority
      />
      <div className="text-2xl ml-32 font-bold">{spacesTitle}</div>
      <div className="flex items-center gap-4">
        <Button
          bgColor={"blue.500"}
          variant={"solid"}
          onClick={() => push("/create")}
        >
          Create Spaces
        </Button>
        <Web3Button />
      </div>
    </header>
  );
};
export default Navbar;

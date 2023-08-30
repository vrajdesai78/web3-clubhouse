import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/common/Navbar";
import HuddleProvider from "@/components/ClientComponents/HuddleProvider";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Web3Modal } from "@web3modal/react";
import { WagmiConfig } from "wagmi";
import { config, ethereumClient } from "@/utils/wagmi";

export default function App({ Component, pageProps }: AppProps) {
  const theme = extendTheme({
    colors: {
      lobby: " #121212",
      audio: "#050505",
      custom: {
        1: "#23262F",
        2: "#121214",
        3: "#181A20",
        4: "#334155",
        5: "#CBD5E1",
        6: "#94A3B8",
        7: "#E2E8F0",
        8: "#246BFD",
      },
      rgbColors: {
        1: "rgba(24, 24, 27, 0.8)",
        2: "rgba(71, 85, 105, 0.2)",
        3: "rgba(148, 163, 184, 1)",
        4: "rgba(249, 112, 102, 0.1)",
      },
    },
  });

  return (
    <HuddleProvider>
      <ChakraProvider theme={theme}>
        <WagmiConfig config={config}>
        <Navbar />
        <Component {...pageProps} />
        </WagmiConfig>
        <Web3Modal
        projectId={"33e28c5d43009b3668cccf62984e6dbe"}
        ethereumClient={ethereumClient}
      />
      </ChakraProvider>
    </HuddleProvider>
  );
}

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/common/Navbar";
import HuddleProvider from "@/components/ClientComponents/HuddleProvider";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3Modal } from "@web3modal/react";
import { WagmiConfig } from "wagmi";
import { config, ethereumClient } from "@/utils/wagmi";

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <HuddleProvider>
      <ChakraProvider>
        <WagmiConfig config={config}>
        <Navbar />
        <Component {...pageProps} />
        </WagmiConfig>
        <Web3Modal
        projectId={process.env.NEXT_PUBLIC_WC_PROJECT_ID as string}
        ethereumClient={ethereumClient}
      />
      </ChakraProvider>
    </HuddleProvider>
  );
}

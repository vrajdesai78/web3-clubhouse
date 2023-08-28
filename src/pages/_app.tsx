import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/common/Navbar";
import HuddleProvider from "@/components/ClientComponents/HuddleProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <HuddleProvider>
        <Component {...pageProps} />
      </HuddleProvider>
    </>
  );
}

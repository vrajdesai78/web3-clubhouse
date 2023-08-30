import { configureChains, createConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';

const modeTestnet = {
    id: 919,
    name: "Mode Testnet",
    network: "Mode Testnet",
    nativeCurrency: {
      decimals: 18,
      name: "Mode",
      symbol: "ETH",
    },
    rpcUrls: {
      default: { http: ["https://sepolia.mode.network/"] },
    },
    testnet: true,
  };

const supportedChains = [polygonMumbai];

const { publicClient } = configureChains(
    // @ts-ignore
    supportedChains,
    [w3mProvider({ projectId: "33e28c5d43009b3668cccf62984e6dbe" })],
);

export const config = createConfig({
    autoConnect: true,
    // @ts-ignore
    connectors: w3mConnectors({ projectId: "33e28c5d43009b3668cccf62984e6dbe", chains: supportedChains}),
    publicClient, 
});
// @ts-ignore
export const ethereumClient = new EthereumClient(config, supportedChains)
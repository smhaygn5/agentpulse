import { defineChain } from "viem";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { ARC_TESTNET } from "./chain";

/**
 * viem chain definition for Circle Arc testnet.
 *
 * NOTE on decimals: Arc's gas token is USDC (6 decimals on-chain), but
 * MetaMask's `wallet_addEthereumChain` only accepts nativeCurrency.decimals
 * === 18 and silently rejects anything else (which is why "add/switch network"
 * did nothing). We declare 18 here so MetaMask actually shows the add/switch
 * prompt; ARC_TESTNET keeps the semantically-correct 6 for our own display.
 */
export const arcTestnet = defineChain({
  id: ARC_TESTNET.id,
  name: ARC_TESTNET.name,
  nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: [ARC_TESTNET.rpcUrl] } },
  blockExplorers: {
    default: { name: ARC_TESTNET.explorerName, url: ARC_TESTNET.explorerUrl },
  },
  testnet: true,
});

/**
 * wagmi config: MetaMask / any injected EVM wallet, single chain (Arc testnet).
 * `ssr: true` lets the provider hydrate cleanly under the App Router.
 * `switchChain` will trigger wallet_addEthereumChain automatically when the
 * user hasn't added Arc yet.
 */
export const wagmiConfig = createConfig({
  chains: [arcTestnet],
  // Target MetaMask specifically. With multiple wallet extensions installed
  // (e.g. Auro), a generic injected connector can grab the wrong provider and
  // silently no-op network switches. EIP-6963 discovery stays on so MetaMask
  // is found even when it isn't window.ethereum.
  connectors: [injected({ target: "metaMask" })],
  transports: { [arcTestnet.id]: http() },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

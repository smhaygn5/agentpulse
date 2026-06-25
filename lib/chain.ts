/**
 * Circle Arc testnet configuration — the single source of truth for chain
 * params across the app (wallet "add network", explorer links, data adapters).
 *
 * Arc is Circle's EVM-compatible Layer-1 for stablecoin finance: gas is paid
 * in USDC (no volatile native token), and it works with MetaMask / any EVM
 * wallet. These values are public (not secrets). Verify against
 * https://docs.arc.network before mainnet — testnet params can change.
 */
export const ARC_TESTNET = {
  id: 5042002,
  name: "Arc Testnet",
  network: "arc-testnet",
  rpcUrl: "https://rpc.testnet.arc.network",
  explorerName: "ArcScan",
  explorerUrl: "https://testnet.arcscan.app",
  faucetUrl: "https://faucet.circle.com",
  docsUrl: "https://docs.arc.network",
  nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 6 },
} as const;

/** Build an ArcScan link for an address / tx / token. */
export function arcScanUrl(
  kind: "address" | "tx" | "token",
  value: string,
): string {
  return `${ARC_TESTNET.explorerUrl}/${kind}/${value}`;
}

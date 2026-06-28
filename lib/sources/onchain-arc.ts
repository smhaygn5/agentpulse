import "server-only";
import {
  createPublicClient,
  http,
  defineChain,
  formatUnits,
  getAddress,
  type Address,
} from "viem";
import { ARC_TESTNET } from "@/lib/chain";

/**
 * Real, cost-free on-chain reads from the Arc testnet public RPC (no API key).
 *
 * What the RPC can give us cheaply: whether an address is a contract, ERC-20
 * metadata, total supply, and ownership (Ownable `owner()`). Holder counts and
 * liquidity require an indexer/DEX and are intentionally left out (marked N/A
 * in the UI) rather than faked.
 */
const arc = defineChain({
  id: ARC_TESTNET.id,
  name: ARC_TESTNET.name,
  nativeCurrency: ARC_TESTNET.nativeCurrency,
  rpcUrls: { default: { http: [ARC_TESTNET.rpcUrl] } },
});

const client = createPublicClient({ chain: arc, transport: http() });

const ERC20_ABI = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
] as const;

const ZERO = "0x0000000000000000000000000000000000000000";

export interface ArcOnchain {
  address: Address;
  isContract: boolean;
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  totalSupply: string | null; // human-readable
  owner: string | null;
  ownershipRenounced: boolean | null;
  explorerUrl: string;
}

async function read<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

/** Fetch real on-chain facts for an address on Arc testnet. */
export async function fetchArcOnchain(addressInput: string): Promise<ArcOnchain> {
  const address = getAddress(addressInput); // checksums / throws on bad input
  const base = { address, explorerUrl: `${ARC_TESTNET.explorerUrl}/address/${address}` };

  const code = await read(() => client.getCode({ address }));
  const isContract = Boolean(code && code !== "0x");
  if (!isContract) {
    return {
      ...base,
      isContract: false,
      name: null,
      symbol: null,
      decimals: null,
      totalSupply: null,
      owner: null,
      ownershipRenounced: null,
    };
  }

  const [name, symbol, decimals, supplyRaw, owner] = await Promise.all([
    read(() => client.readContract({ address, abi: ERC20_ABI, functionName: "name" })),
    read(() => client.readContract({ address, abi: ERC20_ABI, functionName: "symbol" })),
    read(() => client.readContract({ address, abi: ERC20_ABI, functionName: "decimals" })),
    read(() => client.readContract({ address, abi: ERC20_ABI, functionName: "totalSupply" })),
    read(() => client.readContract({ address, abi: ERC20_ABI, functionName: "owner" })),
  ]);

  const dec = typeof decimals === "number" ? decimals : null;
  const totalSupply =
    supplyRaw != null && dec != null
      ? formatUnits(supplyRaw as bigint, dec)
      : null;
  const ownerAddr = owner ? (owner as string) : null;

  return {
    ...base,
    isContract: true,
    name: (name as string) ?? null,
    symbol: (symbol as string) ?? null,
    decimals: dec,
    totalSupply,
    owner: ownerAddr,
    ownershipRenounced: ownerAddr ? ownerAddr.toLowerCase() === ZERO : null,
  };
}

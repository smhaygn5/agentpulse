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
  // Enriched from the ArcScan (Blockscout) free API:
  holders: number | null;
  transfers: number | null;
  reputation: string | null;
  explorerUrl: string;
}

const BLOCKSCOUT = `${ARC_TESTNET.explorerUrl}/api/v2`;

/** Holder/transfer counts + reputation from ArcScan's Blockscout API (no key). */
async function fetchBlockscout(address: string): Promise<{
  holders: number | null;
  transfers: number | null;
  reputation: string | null;
}> {
  const num = (v: unknown): number | null => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  try {
    const [tokenRes, countersRes] = await Promise.all([
      fetch(`${BLOCKSCOUT}/tokens/${address}`, { next: { revalidate: 120 } }),
      fetch(`${BLOCKSCOUT}/tokens/${address}/counters`, { next: { revalidate: 120 } }),
    ]);
    const token = tokenRes.ok ? await tokenRes.json() : {};
    const counters = countersRes.ok ? await countersRes.json() : {};
    return {
      holders: num(counters.token_holders_count ?? token.holders_count),
      transfers: num(counters.transfers_count),
      reputation: typeof token.reputation === "string" ? token.reputation : null,
    };
  } catch {
    return { holders: null, transfers: null, reputation: null };
  }
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
      holders: null,
      transfers: null,
      reputation: null,
    };
  }

  const [name, symbol, decimals, supplyRaw, owner, blockscout] = await Promise.all([
    read(() => client.readContract({ address, abi: ERC20_ABI, functionName: "name" })),
    read(() => client.readContract({ address, abi: ERC20_ABI, functionName: "symbol" })),
    read(() => client.readContract({ address, abi: ERC20_ABI, functionName: "decimals" })),
    read(() => client.readContract({ address, abi: ERC20_ABI, functionName: "totalSupply" })),
    read(() => client.readContract({ address, abi: ERC20_ABI, functionName: "owner" })),
    fetchBlockscout(address),
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
    holders: blockscout.holders,
    transfers: blockscout.transfers,
    reputation: blockscout.reputation,
  };
}

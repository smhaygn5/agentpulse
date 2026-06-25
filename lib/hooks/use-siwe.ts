"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { createSiweMessage } from "viem/siwe";
import { arcTestnet } from "@/lib/wagmi";

/**
 * Sign-In With Ethereum (EIP-4361) client flow:
 *   nonce -> build message -> wallet signs -> server verifies -> session cookie.
 */
export function useSiwe() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [authed, setAuthed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate current session.
  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => active && setAuthed(d.address ?? null))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const { nonce } = await fetch("/api/auth/nonce").then((r) => r.json());
      const now = new Date();
      const message = createSiweMessage({
        address,
        chainId: arcTestnet.id,
        domain: window.location.host,
        uri: window.location.origin,
        version: "1",
        nonce,
        statement: "Sign in to AgentPulse.",
        issuedAt: now,
        // Short-lived message → tighter replay window (server enforces it).
        expirationTime: new Date(now.getTime() + 10 * 60_000),
      });
      const signature = await signMessageAsync({ message });
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, signature }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sign-in failed");
        return;
      }
      setAuthed(data.address);
    } catch {
      setError("Sign-in cancelled");
    } finally {
      setLoading(false);
    }
  }, [address, signMessageAsync]);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setAuthed(null);
  }, []);

  // Drop session view if the wallet disconnects or switches accounts.
  useEffect(() => {
    if (!isConnected) setAuthed(null);
    else if (authed && address && authed.toLowerCase() !== address.toLowerCase()) {
      setAuthed(null);
    }
  }, [isConnected, address, authed]);

  return { authed, signIn, signOut, loading, error };
}

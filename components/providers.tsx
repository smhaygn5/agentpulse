"use client";

import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { wagmiConfig } from "@/lib/wagmi";

/**
 * App-wide client providers: theme + wagmi (wallet) + react-query.
 * QueryClient is created once per browser session via useState.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      {/* reconnectOnMount={false}: never restore a session silently — the user
          must click Connect and approve in MetaMask every time. */}
      <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

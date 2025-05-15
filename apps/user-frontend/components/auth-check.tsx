"use client";

import type React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConnectWalletButton } from "@/components/connect-wallet-button";

import { authService } from "@/lib/apiClient";
import { SignMessage } from "./sign-message";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated via cookie
    const checkAuth = async () => {
      if (connected && publicKey) {
        try {
          const response = await authService.authCheck();
          // @ts-ignore
          if (response.statusCode == 200) {
            setIsAuthenticated(true);
            router.push("/tasks");
          }
        } catch (error) {
          console.error("Auth check error:", error);
        }
      }
    };

    if (connected && publicKey) {
      checkAuth();
    } else {
      setIsLoading(false);
      setIsAuthenticated(false);
    }
  }, [connected, publicKey]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold">Loading...</h1>
          <p className="text-muted-foreground">
            Checking authentication status...
          </p>
        </div>
      </div>
    );
  }

  if (!connected || !publicKey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Please connect your Solana wallet to access tasks and earn rewards.
          </p>
          <ConnectWalletButton />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <SignMessage userType="user" onSuccess={() => setIsAuthenticated(true)} />
    );
  }

  return <>{children}</>;
}

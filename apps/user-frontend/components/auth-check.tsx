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
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: false,
    isChecked: false,
  });

  console.log("Is user  authenticated", authState);

  useEffect(() => {
    if (!connected || !publicKey) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        isChecked: true,
      });
      return;
    }
    // Check if user is authenticated via cookie
    const checkAuth = async () => {
      if (connected && publicKey) {
        try {
          // This part is responding later.
          const response = await authService.authCheck();
          // @ts-ignore
          if (response.statusCode === 200) {
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              isChecked: true,
            });
          } else {
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              isChecked: true,
            });
          }
        } catch (error) {
          console.error("Auth check error:", error);
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            isChecked: true,
          });
        }
      }
    };

    checkAuth();
  }, [connected, publicKey]);

  useEffect(() => {
    if (
      authState.isAuthenticated &&
      authState.isChecked &&
      !authState.isLoading
    ) {
      router.push("/tasks");
    }
  }, [
    authState.isAuthenticated,
    authState.isChecked,
    authState.isLoading,
    router,
  ]);

  if (authState.isLoading) {
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

  if (!authState.isAuthenticated && authState.isChecked) {
    return (
      <SignMessage
        userType="user"
        onSuccess={() =>
          setAuthState((prev) => ({ ...prev, isAuthenticated: true }))
        }
      />
    );
  }

  return <>{children}</>;
}

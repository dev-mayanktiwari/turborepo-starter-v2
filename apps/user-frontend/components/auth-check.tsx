"use client"

import type React from "react"

import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ConnectWalletButton } from "@/components/connect-wallet-button"

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const { connected, publicKey } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!connected || !publicKey) {
      router.push("/")
    }
  }, [connected, publicKey, router])

  if (!connected || !publicKey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold">Connect Your Wallet</h1>
          <p className="text-muted-foreground">Please connect your Solana wallet to access tasks and earn rewards.</p>
          <ConnectWalletButton />
        </div>
      </div>
    )
  }

  return <>{children}</>
}

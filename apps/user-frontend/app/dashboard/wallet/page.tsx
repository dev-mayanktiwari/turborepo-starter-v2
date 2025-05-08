"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react"
import { truncateAddress } from "@/lib/utils"

export default function WalletPage() {
  const { publicKey } = useWallet()
  const [amount, setAmount] = useState("")

  // Mock data for transactions
  const transactions = [
    {
      id: "tx1",
      type: "outgoing",
      amount: 2.5,
      description: "Task: Image Classification",
      date: "2025-05-05",
      status: "confirmed",
    },
    {
      id: "tx2",
      type: "incoming",
      amount: 10.0,
      description: "Wallet top-up",
      date: "2025-05-03",
      status: "confirmed",
    },
    {
      id: "tx3",
      type: "outgoing",
      amount: 4.2,
      description: "Task: Object Detection",
      date: "2025-04-28",
      status: "confirmed",
    },
    {
      id: "tx4",
      type: "outgoing",
      amount: 1.8,
      description: "Task: Sentiment Analysis",
      date: "2025-04-25",
      status: "confirmed",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">Manage your SOL wallet and view transaction history.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription>Your current SOL balance and wallet address.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <span className="text-4xl font-bold">24.5 SOL</span>
              <span className="text-sm text-muted-foreground">≈ $2,450.00 USD</span>
            </div>
            <div className="flex flex-col space-y-1">
              <Label>Wallet Address</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {publicKey ? truncateAddress(publicKey.toString(), 8) : "Not connected"}
                </span>
                {publicKey && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                    <a
                      href={`https://explorer.solana.com/address/${publicKey.toString()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View on Solana Explorer</span>
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Top Up Wallet</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Send SOL or create a new task.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="send">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="send">Send</TabsTrigger>
                <TabsTrigger value="create">Create Task</TabsTrigger>
              </TabsList>
              <TabsContent value="send" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input id="recipient" placeholder="Enter Solana address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (SOL)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <Button className="w-full">Send SOL</Button>
              </TabsContent>
              <TabsContent value="create" className="pt-4">
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                  <p className="text-center text-sm text-muted-foreground">
                    Create a new labeling task and reward users with SOL.
                  </p>
                  <Button asChild>
                    <a href="/dashboard/create-task">Create New Task</a>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent transactions from your wallet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      tx.type === "incoming" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {tx.type === "incoming" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${tx.type === "incoming" ? "text-green-500" : "text-red-500"}`}>
                    {tx.type === "incoming" ? "+" : "-"}
                    {tx.amount} SOL
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

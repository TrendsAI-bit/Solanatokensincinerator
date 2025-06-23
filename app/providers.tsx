'use client'

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { Connection } from '@solana/web3.js'
import { useMemo, ReactNode } from 'react'

require('@solana/wallet-adapter-react-ui/styles.css')

interface Props {
  children: ReactNode
}

// Use Helius RPC instead of default Solana RPC to avoid 403 errors on Vercel
const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || 'd966b6f9-d9d7-4e34-a109-2cf782d34e87'
const HELIUS_RPC_URL = `https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`

export function WalletContextProvider({ children }: Props) {
  // Create custom connection using Helius RPC
  const connection = useMemo(() => new Connection(HELIUS_RPC_URL, 'confirmed'), [])
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={HELIUS_RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
} 
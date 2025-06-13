"use client";

import Image from 'next/image'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Flame, Coins, History, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-bg to-black">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-fire-orange/20 via-transparent to-transparent opacity-30" />
        
        <div className="relative z-10">
          <div className="mb-8 relative">
            <div className="absolute inset-0 animate-pulse-fire rounded-full bg-fire-orange/30 filter blur-xl" />
            <Image
              src="/asset/logo.svg"
              alt="Solana Incinerator Logo"
              width={180}
              height={180}
              className="relative animate-float"
              priority
            />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-glow bg-clip-text text-transparent bg-gradient-to-r from-fire-orange to-fire-gold">
            Solana Incinerator
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-pulse-fire">
            Burn your bags. Earn from the ashes.
          </p>
          
          <div className="relative">
            <div className="absolute inset-0 animate-pulse-fire rounded-lg bg-fire-orange/30 filter blur-md" />
            <WalletMultiButton className="relative bg-gradient-to-r from-fire-orange to-fire-gold hover:from-fire-gold hover:to-fire-orange text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-dark-bg/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 animate-glow">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            {[
              {
                icon: <WalletMultiButton className="text-white" />,
                title: "Connect Wallet",
                description: "Link your Solana wallet to get started"
              },
              {
                icon: <Flame className="w-8 h-8 text-white" />,
                title: "Choose Token",
                description: "Select any token you want to burn"
              },
              {
                icon: <Coins className="w-8 h-8 text-white" />,
                title: "Earn $ASHED",
                description: "Get 5,000 $ASHED per burn"
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-white" />,
                title: "Claim SOL",
                description: "Redeem 100,000 $ASHED for 1 SOL"
              }
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-fire-orange/20 to-fire-gold/20 rounded-xl animate-pulse-fire filter blur-md" />
                <div className="relative bg-ash-gray p-6 rounded-xl transform transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-fire-orange to-fire-gold rounded-full flex items-center justify-center mx-auto mb-4 animate-burn">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:animate-glow">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Burn Feed Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 to-black/80 backdrop-blur-xl" />
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16 animate-glow">Live Burn Feed</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-fire-orange/20 to-fire-gold/20 rounded-lg animate-pulse-fire filter blur-sm" />
                <div className="relative flex items-center justify-between p-6 bg-ash-gray/90 rounded-lg backdrop-blur-xl transform transition-all duration-300 hover:scale-102">
                  <div className="flex items-center space-x-4">
                    <Flame className="w-6 h-6 text-fire-orange animate-burn" />
                    <span className="text-gray-300">
                      0x69...dead burned 12,400 $RUG
                    </span>
                  </div>
                  <span className="text-fire-gold animate-pulse-fire">+5,000 $ASHED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Claim Tracker Section */}
      <section className="py-20 px-4 bg-dark-bg/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 animate-glow">Your Burn Progress</h2>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-fire-orange/20 to-fire-gold/20 rounded-xl animate-pulse-fire filter blur-md" />
            <div className="relative bg-ash-gray p-8 rounded-xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 animate-glow">Current Balance: 25,000 $ASHED</h3>
                <div className="relative w-full h-4 bg-ash-gray/50 rounded-full mb-4 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-fire-orange to-fire-gold animate-shimmer bg-[length:200%_100%]" style={{ width: '25%' }} />
                </div>
                <p className="text-gray-400 mb-6">75,000 $ASHED until next SOL claim</p>
                <button className="bg-gradient-to-r from-fire-orange to-fire-gold text-white font-bold py-3 px-8 rounded-lg opacity-50 cursor-not-allowed">
                  Claim 1 SOL
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 to-black/80 backdrop-blur-xl" />
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16 animate-glow">Tokenomics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Total Supply",
                value: "1B $ASHED",
                description: "No dev wallet, fair distribution through burning"
              },
              {
                title: "Liquidity",
                value: "100% Backed",
                description: "Redemption pool ensures 1 SOL per 100,000 $ASHED"
              }
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-fire-orange/20 to-fire-gold/20 rounded-xl animate-pulse-fire filter blur-md" />
                <div className="relative bg-ash-gray p-8 rounded-xl transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fire-orange to-fire-gold animate-pulse-fire mb-2">
                    {item.value}
                  </p>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-dark-bg/90 backdrop-blur-xl border-t border-ash-gray">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xl font-bold mb-4 animate-glow">Powered by fire. Built for redemption.</p>
          <div className="flex justify-center space-x-6 mb-8">
            {["Twitter", "Telegram", "Discord"].map((platform) => (
              <a
                key={platform}
                href="#"
                className="text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-fire-orange hover:to-fire-gold transition-all duration-300 transform hover:scale-110"
              >
                {platform}
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Contract: 0x1234...5678
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © 2024 Solana Incinerator. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
} 
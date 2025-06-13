import Image from 'next/image'
import { motion } from 'framer-motion'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Flame, Coins, History, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-8"
        >
          <Image
            src="/asset/logo.png"
            alt="Solana Incinerator Logo"
            width={120}
            height={120}
            className="animate-float"
          />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-4"
        >
          Solana Incinerator
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-8"
        >
          Burn your bags. Earn from the ashes.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <WalletMultiButton className="btn-primary" />
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-dark-bg">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            <div className="card text-center">
              <div className="w-16 h-16 bg-fire-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <WalletMultiButton className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Connect Wallet</h3>
              <p className="text-gray-400">Link your Solana wallet to get started</p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-fire-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Choose Token</h3>
              <p className="text-gray-400">Select any token you want to burn</p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-fire-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Earn $ASHED</h3>
              <p className="text-gray-400">Get 5,000 $ASHED per burn</p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-fire-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Claim SOL</h3>
              <p className="text-gray-400">Redeem 100,000 $ASHED for 1 SOL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Burn Feed Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center">Live Burn Feed</h2>
          <div className="card">
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-ash-gray rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Flame className="w-6 h-6 text-fire-orange" />
                    <span className="text-gray-300">
                      0x69...dead burned 12,400 $RUG
                    </span>
                  </div>
                  <span className="text-fire-gold">+5,000 $ASHED</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Claim Tracker Section */}
      <section className="py-20 px-4 bg-dark-bg">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center">Your Burn Progress</h2>
          <div className="card">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Current Balance: 25,000 $ASHED</h3>
              <div className="w-full bg-ash-gray rounded-full h-4 mb-4">
                <div className="bg-fire-orange h-4 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <p className="text-gray-400 mb-6">75,000 $ASHED until next SOL claim</p>
              <button className="btn-primary" disabled>
                Claim 1 SOL
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center">Tokenomics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-2xl font-bold mb-4">Total Supply</h3>
              <p className="text-3xl font-bold text-fire-gold mb-2">1B $ASHED</p>
              <p className="text-gray-400">No dev wallet, fair distribution through burning</p>
            </div>
            <div className="card">
              <h3 className="text-2xl font-bold mb-4">Liquidity</h3>
              <p className="text-3xl font-bold text-fire-gold mb-2">100% Backed</p>
              <p className="text-gray-400">Redemption pool ensures 1 SOL per 100,000 $ASHED</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-dark-bg border-t border-ash-gray">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xl font-bold mb-4">Powered by fire. Built for redemption.</p>
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-gray-400 hover:text-fire-orange transition-colors">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-fire-orange transition-colors">
              Telegram
            </a>
            <a href="#" className="text-gray-400 hover:text-fire-orange transition-colors">
              Discord
            </a>
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
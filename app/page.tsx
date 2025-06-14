"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Flame, Coins, History, TrendingUp } from 'lucide-react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { motion } from 'framer-motion';
import { FireAnimation } from '../components/FireAnimation';

const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;

  const burnToken = async (mint: string) => {
    if (!publicKey) return;

    try {
      // This is a placeholder for the actual burn logic.
      // In a real scenario, you would create a transaction
      // with the correct instructions to burn the token.
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey("11111111111111111111111111111111"), // Burn address
          lamports: 10000, // Placeholder amount
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
      alert(`Burned token with mint: ${mint}`);
    } catch (error) {
      console.error('Error burning token:', error);
      alert('Error burning token. See console for details.');
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);
      }
    };

    const fetchTokens = async () => {
      if (publicKey && HELIUS_API_KEY) {
        try {
          const response = await fetch(
            `https://api.helius.xyz/v0/addresses/${publicKey.toString()}/balances?api-key=${HELIUS_API_KEY}`
          );
          const data = await response.json();
          setTokens(data.tokens || []);
        } catch (error) {
          console.error('Error fetching tokens:', error);
        }
      }
    };

    if (connected) {
      fetchBalance();
      fetchTokens();
    }
  }, [publicKey, connected, connection, HELIUS_API_KEY]);

  return (
    <main className="min-h-screen bg-black text-gray-200 font-futuristic">
      <FireAnimation />
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section 
          className="relative h-screen flex flex-col items-center justify-center text-center px-4"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div 
            className="mb-12"
            variants={fadeInUp}
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/logo.png"
              alt="Solana Incinerator Logo"
              width={200}
              height={200}
              className="rounded-full drop-shadow-[0_0_40px_#ff003c]"
            />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-4 section-title red-glow"
            variants={fadeInUp}
          >
            Solana Incinerator
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 section-subtitle"
            variants={fadeInUp}
          >
            Burn your bags. Earn from the ashes.
          </motion.p>
          
          <motion.div variants={fadeInUp} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <WalletMultiButton className="btn-primary red-glow" />
            {connected && balance !== null && (
              <p className="mt-4 text-fire-orange font-bold animate-pulse">Balance: {balance.toFixed(4)} SOL</p>
            )}
          </motion.div>
        </motion.section>

        {/* Your Tokens Section */}
        {connected && (
          <section className="py-20 px-4 bg-dark-bg">
            <div className="max-w-6xl mx-auto">
              <h2 className="section-title text-center red-glow">Your Tokens</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {tokens.length > 0 ? (
                  tokens.map((token) => (
                    <motion.div
                      key={token.mint}
                      className="card red-glow hover:scale-105 hover:shadow-[0_0_40px_#ff003c] transition-transform duration-300"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <h3 className="text-xl font-bold mb-2">{token.tokenMetadata?.onchainMetadata?.metadata?.data?.name || 'Unknown Token'}</h3>
                      <p className="text-gray-400 mb-4">Amount: {token.amount / (10 ** token.decimals)}</p>
                      <button
                        onClick={() => burnToken(token.mint)}
                        className="btn-primary w-full red-glow"
                      >
                        Burn
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center col-span-full">No tokens found.</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* How It Works Section */}
        <motion.section 
          className="py-20 px-4 bg-dark-bg red-glow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title text-center red-glow">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
              <motion.div className="card text-center red-glow" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.97 }}>
                <div className="w-16 h-16 bg-fire-orange rounded-full flex items-center justify-center mx-auto mb-4 red-glow">
                  <WalletMultiButton className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Connect Wallet</h3>
                <p className="text-gray-400">Link your Solana wallet to get started</p>
              </motion.div>
              <motion.div className="card text-center red-glow" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.97 }}>
                <div className="w-16 h-16 bg-fire-orange rounded-full flex items-center justify-center mx-auto mb-4 red-glow">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Choose Token</h3>
                <p className="text-gray-400">Select any token you want to burn</p>
              </motion.div>
              <motion.div className="card text-center red-glow" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.97 }}>
                <div className="w-16 h-16 bg-fire-orange rounded-full flex items-center justify-center mx-auto mb-4 red-glow">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Earn $ASHED</h3>
                <p className="text-gray-400">Get 5,000 $ASHED per burn</p>
              </motion.div>
              <motion.div className="card text-center red-glow" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.97 }}>
                <div className="w-16 h-16 bg-fire-orange rounded-full flex items-center justify-center mx-auto mb-4 red-glow">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Claim SOL</h3>
                <p className="text-gray-400">Redeem 100,000 $ASHED for 1 SOL</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Live Burn Feed Section */}
        <motion.section 
          className="py-20 px-4 red-glow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title text-center red-glow">Live Burn Feed</h2>
            <div className="card red-glow">
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-ash-gray rounded-lg red-glow hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center space-x-4">
                      <Flame className="w-6 h-6 text-fire-orange animate-fire-flicker" />
                      <span className="text-gray-300">
                        0x69...dead burned 12,400 $RUG
                      </span>
                    </div>
                    <span className="text-fire-gold font-bold animate-pulse">+5,000 $ASHED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Claim Tracker Section */}
        <motion.section 
          className="py-20 px-4 bg-dark-bg red-glow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title text-center red-glow">Your Burn Progress</h2>
            <div className="card red-glow">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Current Balance: <span className="text-fire-gold animate-pulse">25,000 $ASHED</span></h3>
                <div className="w-full bg-ash-gray rounded-full h-4 mb-4 overflow-hidden">
                  <div className="bg-fire-orange h-4 rounded-full animate-glow" style={{ width: '25%' }}></div>
                </div>
                <p className="text-gray-400 mb-6">75,000 $ASHED until next SOL claim</p>
                <button className="btn-primary red-glow" disabled>
                  Claim 1 SOL
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tokenomics Section */}
        <motion.section 
          className="py-20 px-4 red-glow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title text-center red-glow">Tokenomics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card red-glow hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-4">Total Supply</h3>
                <p className="text-3xl font-bold text-fire-gold mb-2 animate-pulse">1B $ASHED</p>
                <p className="text-gray-400">No dev wallet, fair distribution through burning</p>
              </div>
              <div className="card red-glow hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-4">Liquidity</h3>
                <p className="text-3xl font-bold text-fire-gold mb-2 animate-pulse">100% Backed</p>
                <p className="text-gray-400">Redemption pool ensures 1 SOL per 100,000 $ASHED</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-ash-gray/20 red-glow">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xl font-bold mb-4 animate-pulse">Powered by fire. Built for redemption.</p>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-gray-400 hover:text-fire-orange transition-colors red-glow">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-fire-orange transition-colors red-glow">
                Telegram
              </a>
              <a href="#" className="text-gray-400 hover:text-fire-orange transition-colors red-glow">
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
      </div>
    </main>
  )
} 
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Flame, Info, CheckCircle2, XCircle, Zap } from 'lucide-react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FireAnimation } from '../components/FireAnimation';
import GlitchText from '../components/GlitchText';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const glassPanel = 'glass-card cosmic-border shadow-stellar-glow';

export default function Home() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [burning, setBurning] = useState(false);
  const [burnResult, setBurnResult] = useState<{success: boolean, message: string, txid?: string}|null>(null);
  const [form, setForm] = useState({ address: '', amount: '' });
  const [formError, setFormError] = useState('');
  const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;

  useEffect(() => {
    if (!connected) return;
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
    fetchBalance();
    fetchTokens();
  }, [publicKey, connected, connection, HELIUS_API_KEY]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const validateForm = () => {
    if (!form.address || !form.amount) {
      setFormError('Please enter both token address and amount.');
      return false;
    }
    if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setFormError('Amount must be a positive number.');
      return false;
    }
    return true;
  };

  const burnToken = async () => {
    if (!validateForm()) return;
    setBurning(true);
    setBurnResult(null);
    try {
      // Placeholder for actual burn logic
      await new Promise((res) => setTimeout(res, 2000));
      setBurnResult({ success: true, message: 'Token burned successfully!', txid: 'SAMPLE_TX_ID' });
    } catch (error) {
      setBurnResult({ success: false, message: 'Burn failed. Please try again.' });
    } finally {
      setBurning(false);
    }
  };

  return (
    <main className="min-h-screen bg-cosmic-blue text-star-white font-orbitron relative overflow-x-hidden">
      {/* Animated space background */}
      <div className="fixed inset-0 -z-10 bg-space-nebula animate-cosmic-drift" />
      <div className="fixed inset-0 -z-5 starfield-bg opacity-30" />
      
      {/* Solana watermark */}
      <div className="fixed bottom-0 right-0 opacity-10 pointer-events-none select-none z-0">
        <Image src="/solana-logo.svg" alt="Solana" width={300} height={100} />
      </div>
      
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 w-full z-20">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Stellar Token Burner Logo" width={48} height={48} className="rounded-full animate-float" />
          <GlitchText
            speed={0.5}
            enableShadows={true}
            enableOnHover={true}
            className="text-2xl font-bold"
          >
            Stellar Incinerator
          </GlitchText>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-cosmic-cyan hover:text-stellar-purple transition-colors" title="Info">
            <Info size={24} />
          </button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center pt-24 pb-12">
        <motion.h1 className="section-title" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <GlitchText
            speed={1}
            enableShadows={true}
            enableOnHover={true}
            className="section-title"
          >
            Burn Solana Tokens Across the Galaxy
          </GlitchText>
        </motion.h1>
        <motion.p className="section-subtitle max-w-xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
          A stellar, space-inspired dApp for incinerating your Solana tokens. Powered by cosmic energy, secured by the void, visually stunning like nebulae.
        </motion.p>
        <motion.div className="mt-6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
          <WalletMultiButton className="btn-primary text-lg px-8 py-4" />
          {connected && balance !== null && (
            <span className="block mt-2 text-cosmic-cyan font-semibold">Balance: {balance.toFixed(4)} SOL</span>
          )}
        </motion.div>
      </section>
      
      {/* Main Form Section */}
      <section className="flex flex-col items-center justify-center min-h-[40vh] pb-16">
        <motion.div className={glassPanel + ' w-full max-w-lg mx-auto'} initial="initial" animate="animate" variants={fadeInUp}>
          <motion.h2 className="text-2xl font-bold mb-6 flex items-center gap-2 section-title" initial="initial" animate="animate" variants={fadeInUp}>
            <Zap className="text-cosmic-cyan animate-twinkle" /> Incinerate Tokens
          </motion.h2>
          <div className="mb-4">
            <label className="block text-sm mb-1 text-stellar-purple">Token Address</label>
            <div className="relative">
              <input
                name="address"
                value={form.address}
                onChange={handleInput}
                placeholder="Enter token address..."
                className="w-full p-3 rounded-lg bg-cosmic-blue/60 border border-stellar-purple focus:outline-none focus:ring-2 focus:ring-cosmic-cyan text-lg placeholder-gray-400"
                autoComplete="off"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cosmic-cyan">
                <Zap size={20} />
              </span>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-1 text-stellar-purple">Amount</label>
            <input
              name="amount"
              value={form.amount}
              onChange={handleInput}
              placeholder="0.0"
              type="number"
              className="w-full p-3 rounded-lg bg-cosmic-blue/60 border border-stellar-purple focus:outline-none focus:ring-2 focus:ring-cosmic-cyan text-lg placeholder-gray-400"
              autoComplete="off"
            />
          </div>
          {formError && (
            <motion.div className="text-red-500 mb-4 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <XCircle size={20} /> {formError}
            </motion.div>
          )}
          <motion.button
            type="button"
            className="btn-primary w-full flex items-center justify-center text-lg gap-2 mt-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={burnToken}
            disabled={burning}
          >
            <span>Incinerate Tokens</span>
            <Zap className="text-white animate-twinkle" />
          </motion.button>
        </motion.div>
        
        {/* Confirmation/Result Section */}
        <AnimatePresence>
          {burnResult && (
            <motion.div
              className={glassPanel + ' mt-8 w-full max-w-md mx-auto text-center'}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5 }}
            >
              {burnResult.success ? (
                <>
                  <CheckCircle2 className="mx-auto text-plasma-green mb-2" size={40} />
                  <div className="text-xl font-bold mb-2">{burnResult.message}</div>
                  <div className="text-sm text-gray-400">Transaction ID: <span className="text-cosmic-cyan">{burnResult.txid}</span></div>
                </>
              ) : (
                <>
                  <XCircle className="mx-auto text-red-500 mb-2" size={40} />
                  <div className="text-xl font-bold mb-2">{burnResult.message}</div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-4 text-center text-gray-400 text-sm">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
          <span>Powered by <span className="text-stellar-purple font-bold">cosmic energy</span>. Built for <span className="text-cosmic-cyan font-bold">stellar exploration</span>.</span>
          <span className="hidden md:inline">|</span>
          <span>Contract: <span className="text-gray-400">0x1234...5678</span></span>
        </div>
        <div className="mt-2">© 2024 Stellar Incinerator. All rights reserved.</div>
      </footer>
    </main>
  )
} 
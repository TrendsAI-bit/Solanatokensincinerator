"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Flame, Info, CheckCircle2, XCircle, Zap, ExternalLink } from 'lucide-react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { 
  LAMPORTS_PER_SOL, 
  PublicKey, 
  Transaction
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  createBurnInstruction
} from "@solana/spl-token";
import { motion, AnimatePresence } from 'framer-motion';
import GlitchText from '../components/GlitchText';
import SplashCursor from '../components/SplashCursor';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const glassPanel = 'glass-card cosmic-border shadow-stellar-glow';

interface TokenAccount {
  mint: PublicKey;
  amount: number;
  decimals: number;
  symbol?: string;
  name?: string;
  logoURI?: string;
}

interface BurnLogEntry {
  token: string;
  tokenName?: string;
  amount: string;
  signature: string;
  timestamp: number;
}

// Function to get a better token name based on common patterns
function getTokenDisplayName(mint: string, symbol?: string, name?: string) {
  // Check for common token patterns
  const mintStr = mint.toString();
  
  // Well-known token mints (you can expand this list)
  const knownTokens: { [key: string]: { symbol: string; name: string } } = {
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { symbol: 'USDC', name: 'USD Coin' },
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { symbol: 'USDT', name: 'Tether USD' },
    'So11111111111111111111111111111111111111112': { symbol: 'SOL', name: 'Wrapped SOL' },
    // Add more known tokens here
  };
  
  if (knownTokens[mintStr]) {
    return knownTokens[mintStr];
  }
  
  // Use provided symbol/name if available
  if (symbol && symbol !== 'Unknown') {
    return { 
      symbol, 
      name: name && name !== 'Unknown Token' ? name : `${symbol} Token` 
    };
  }
  
  // Generate from mint address
  const shortMint = mintStr.slice(0, 8);
  return {
    symbol: `TOKEN_${mintStr.slice(0, 4).toUpperCase()}`,
    name: `Token ${shortMint}...${mintStr.slice(-4)}`
  };
}

export default function Home() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<TokenAccount[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenAccount | null>(null);
  const [burnAmount, setBurnAmount] = useState('');
  const [burning, setBurning] = useState(false);
  const [burnResult, setBurnResult] = useState<{success: boolean, message: string, txid?: string}|null>(null);
  const [formError, setFormError] = useState('');
  const [ashBalance, setAshBalance] = useState(0);
  const [burnLog, setBurnLog] = useState<BurnLogEntry[]>([]);
  const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || 'd966b6f9-d9d7-4e34-a109-2cf782d34e87';

  useEffect(() => {
    if (!connected || !publicKey) return;
    
    const fetchBalance = async () => {
      if (publicKey) {
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);
      }
    };

    const fetchTokens = async () => {
      if (publicKey) {
        try {
          console.log('Fetching tokens for wallet:', publicKey.toString());
          
          // Method 1: Try Helius API first
          if (HELIUS_API_KEY) {
            try {
              console.log('Trying Helius balances API...');
              const heliusResponse = await fetch(
                `https://api.helius.xyz/v0/addresses/${publicKey.toString()}/balances?api-key=${HELIUS_API_KEY}`
              );
              
              if (heliusResponse.ok) {
                const heliusData = await heliusResponse.json();
                console.log('Helius balances response:', heliusData);
                
                if (heliusData.tokens && heliusData.tokens.length > 0) {
                  const heliusTokens: TokenAccount[] = heliusData.tokens
                    .filter((token: any) => token.amount > 0)
                    .map((token: any) => {
                      console.log('Processing Helius token:', token);
                      // Use the symbol/name from Helius if available
                      const symbol = token.symbol || token.ticker || `TOKEN_${token.mint.slice(0, 4).toUpperCase()}`;
                      const name = token.name || symbol || `Token ${token.mint.slice(0, 8)}`;
                      
                      return {
                        mint: new PublicKey(token.mint),
                        amount: parseFloat(token.amount),
                        decimals: token.decimals || 6,
                        symbol: symbol,
                        name: name,
                        logoURI: token.logoURI || token.image
                      };
                    });
                  
                  console.log('Parsed Helius tokens:', heliusTokens);
                  setTokens(heliusTokens);
                  return; // Exit early if Helius worked
                }
              }
            } catch (heliusError) {
              console.log('Helius balances API failed, trying token metadata API:', heliusError);
            }
          }

          // Method 2: Fallback to direct RPC call
          console.log('Using direct RPC to fetch token accounts...');
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: TOKEN_PROGRAM_ID,
          });

          console.log('Raw token accounts:', tokenAccounts.value.length);

          const parsedTokens: TokenAccount[] = tokenAccounts.value
            .map((acc) => {
              const info = acc.account.data.parsed.info;
              const mint = new PublicKey(info.mint);
              const amount = Number(info.tokenAmount.uiAmount);
              const decimals = info.tokenAmount.decimals;
              
              console.log(`Token: ${mint.toString()}, Amount: ${amount}, Decimals: ${decimals}`);
              
              return { mint, amount, decimals };
            })
            .filter((t) => t.amount > 0);

          console.log('Parsed tokens with balance > 0:', parsedTokens.length);

          // Try to get token metadata for the tokens we found
          if (HELIUS_API_KEY && parsedTokens.length > 0) {
            try {
              const mints = parsedTokens.map(t => t.mint.toString());
              console.log('Fetching metadata for mints:', mints);
              
              // Try multiple metadata endpoints
              const metadataPromises = [
                // Method 1: Helius token metadata
                fetch(`https://api.helius.xyz/v0/token-metadata?api-key=${HELIUS_API_KEY}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ mintAccounts: mints }),
                }),
                // Method 2: Helius DAS API for better metadata
                fetch(`https://api.helius.xyz/v0/tokens/metadata?api-key=${HELIUS_API_KEY}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ mintAccounts: mints }),
                })
              ];

              const results = await Promise.allSettled(metadataPromises);
              let metadata: any[] = [];

              // Process results from different APIs
              for (let i = 0; i < results.length; i++) {
                const result = results[i];
                if (result.status === 'fulfilled' && result.value.ok) {
                  const data = await result.value.json();
                  console.log(`Metadata API ${i + 1} response:`, data);
                  if (Array.isArray(data)) {
                    metadata = metadata.concat(data);
                  }
                }
              }

              console.log('Combined metadata:', metadata);
              
              // Merge metadata with token info
              parsedTokens.forEach((token) => {
                const meta = metadata.find((m: any) => 
                  m.account === token.mint.toString() || 
                  m.mint === token.mint.toString() ||
                  m.address === token.mint.toString()
                );
                console.log(`Processing token ${token.mint.toString()}:`, meta);
                
                if (meta) {
                  // Try different metadata structures
                  let symbol = null;
                  let name = null;
                  
                  // Structure 1: onChainMetadata
                  if (meta.onChainMetadata?.metadata?.data) {
                    const onChainData = meta.onChainMetadata.metadata.data;
                    symbol = onChainData.symbol;
                    name = onChainData.name;
                  }
                  
                  // Structure 2: offChainMetadata
                  if (meta.offChainMetadata?.metadata) {
                    const offChainData = meta.offChainMetadata.metadata;
                    symbol = symbol || offChainData.symbol;
                    name = name || offChainData.name;
                    token.logoURI = token.logoURI || offChainData.image;
                  }
                  
                  // Structure 3: Direct properties
                  symbol = symbol || meta.symbol || meta.ticker;
                  name = name || meta.name;
                  
                  if (symbol) {
                    token.symbol = symbol.trim();
                    console.log(`Found symbol: ${token.symbol}`);
                  }
                  if (name) {
                    token.name = name.trim();
                    console.log(`Found name: ${token.name}`);
                  }
                }
                
                // Final fallback: use mint address parts if still no good name
                if (!token.symbol || token.symbol === 'Unknown') {
                  const displayName = getTokenDisplayName(token.mint.toString(), token.symbol, token.name);
                  token.symbol = displayName.symbol;
                  token.name = displayName.name;
                }
              });
            } catch (metadataError) {
              console.log('Could not fetch token metadata:', metadataError);
              // Add fallback symbols for tokens without metadata
              parsedTokens.forEach((token) => {
                if (!token.symbol) {
                  const displayName = getTokenDisplayName(token.mint.toString(), token.symbol, token.name);
                  token.symbol = displayName.symbol;
                  token.name = displayName.name;
                }
              });
            }
          } else {
            // Add fallback symbols when no API key
            parsedTokens.forEach((token) => {
              const displayName = getTokenDisplayName(token.mint.toString(), token.symbol, token.name);
              token.symbol = displayName.symbol;
              token.name = displayName.name;
            });
          }

          console.log('Final parsed tokens:', parsedTokens);
          setTokens(parsedTokens);

        } catch (error) {
          console.error('Error fetching tokens:', error);
          setFormError('Failed to load tokens. Please try again.');
        }
      }
    };

    fetchBalance();
    fetchTokens();
  }, [publicKey, connected, connection, HELIUS_API_KEY]);

  const validateBurn = () => {
    if (!selectedToken || !burnAmount) {
      setFormError('Please select a token and enter an amount.');
      return false;
    }
    const amount = parseFloat(burnAmount);
    if (isNaN(amount) || amount <= 0) {
      setFormError('Amount must be a positive number.');
      return false;
    }
    if (amount > selectedToken.amount) {
      setFormError('Amount exceeds available balance.');
      return false;
    }
    return true;
  };

  const burnToken = async () => {
    if (!validateBurn() || !publicKey || !selectedToken) return;
    
    setBurning(true);
    setBurnResult(null);
    setFormError('');

    try {
      const amount = parseFloat(burnAmount);
      const burnAmountLamports = Math.floor(amount * Math.pow(10, selectedToken.decimals));

      // Get the user's token account
      const userTokenAccount = await getAssociatedTokenAddress(
        selectedToken.mint,
        publicKey
      );

      // Create burn instruction
      const burnInstruction = createBurnInstruction(
        userTokenAccount,
        selectedToken.mint,
        publicKey,
        burnAmountLamports
      );

      const transaction = new Transaction().add(burnInstruction);
      
      // Send and confirm transaction
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      // Update ASH balance (1000 ASH per burn)
      setAshBalance(prev => prev + 1000);

      // Add to burn log
      const logEntry: BurnLogEntry = {
        token: selectedToken.mint.toString(),
        tokenName: selectedToken.symbol || selectedToken.name || 'Unknown',
        amount: burnAmount,
        signature,
        timestamp: Date.now()
      };
      setBurnLog(prev => [logEntry, ...prev.slice(0, 9)]); // Keep last 10 entries

      setBurnResult({ 
        success: true, 
        message: `Successfully burned ${burnAmount} ${selectedToken.symbol || 'tokens'}!`, 
        txid: signature 
      });

      // Reset form
      setBurnAmount('');
      setSelectedToken(null);

      // Refresh token balances
      setTimeout(() => {
        if (publicKey) {
          connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: TOKEN_PROGRAM_ID,
          }).then(tokenAccounts => {
            const parsedTokens: TokenAccount[] = tokenAccounts.value
              .map((acc) => {
                const info = acc.account.data.parsed.info;
                const mint = new PublicKey(info.mint);
                const amount = Number(info.tokenAmount.uiAmount);
                const decimals = info.tokenAmount.decimals;
                return { mint, amount, decimals };
              })
              .filter((t) => t.amount > 0);
            setTokens(parsedTokens);
          });
        }
      }, 2000);

    } catch (error: any) {
      console.error('Burn failed:', error);
      setBurnResult({ 
        success: false, 
        message: `Burn failed: ${error.message || 'Unknown error'}` 
      });
    } finally {
      setBurning(false);
    }
  };

  return (
    <main className="min-h-screen bg-cosmic-blue text-star-white font-orbitron relative overflow-x-hidden">
      {/* Cosmic Cursor Effect */}
      <SplashCursor />
      
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
          <motion.h2 className="text-2xl font-bold mb-6 flex items-center gap-2" initial="initial" animate="animate" variants={fadeInUp}>
            <Zap className="text-cosmic-cyan animate-twinkle" /> 
            <GlitchText
              speed={0.8}
              enableShadows={true}
              enableOnHover={true}
              className="text-2xl font-bold"
            >
              Incinerate Tokens
            </GlitchText>
          </motion.h2>

          {connected ? (
            <>
              {/* Token Selector */}
              <div className="mb-4">
                <label className="block text-sm mb-1 text-stellar-purple">
                  Select Token {tokens.length > 0 && <span className="text-cosmic-cyan">({tokens.length} found)</span>}
                </label>
                <select
                  className="w-full p-3 rounded-lg bg-cosmic-blue/60 border border-stellar-purple focus:outline-none focus:ring-2 focus:ring-cosmic-cyan text-lg"
                  onChange={(e) => {
                    const token = tokens.find((t) => t.mint.toString() === e.target.value);
                    setSelectedToken(token || null);
                    setFormError('');
                  }}
                  value={selectedToken?.mint.toString() || ""}
                >
                  <option value="" disabled>
                    {tokens.length === 0 ? 'Loading tokens...' : 'Choose a token to burn'}
                  </option>
                  {tokens.map((token, i) => (
                    <option key={i} value={token.mint.toString()}>
                      {token.symbol || token.name || `${token.mint.toString().slice(0, 4)}...${token.mint.toString().slice(-4)}`} 
                      ({token.amount.toFixed(4)})
                    </option>
                  ))}
                </select>
                {tokens.length === 0 && connected && (
                  <div className="text-sm text-gray-400 mt-1">
                    No tokens found in your wallet or still loading...
                  </div>
                )}
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm mb-1 text-stellar-purple">
                  Amount to Burn
                  {selectedToken && (
                    <span className="text-cosmic-cyan ml-2">
                      (Max: {selectedToken.amount.toFixed(4)})
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={burnAmount}
                    onChange={(e) => {
                      setBurnAmount(e.target.value);
                      setFormError('');
                    }}
                    placeholder="0.0"
                    step="any"
                    min="0"
                    max={selectedToken?.amount || undefined}
                    className="w-full p-3 rounded-lg bg-cosmic-blue/60 border border-stellar-purple focus:outline-none focus:ring-2 focus:ring-cosmic-cyan text-lg placeholder-gray-400"
                    autoComplete="off"
                  />
                  {selectedToken && (
                    <button
                      type="button"
                      onClick={() => setBurnAmount(selectedToken.amount.toString())}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cosmic-cyan hover:text-stellar-purple text-sm"
                    >
                      MAX
                    </button>
                  )}
                </div>
              </div>

              {formError && (
                <motion.div className="text-red-500 mb-4 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <XCircle size={20} /> {formError}
                </motion.div>
              )}

              <motion.button
                type="button"
                className="btn-primary w-full flex items-center justify-center text-lg gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: burning ? 1 : 1.05 }}
                whileTap={{ scale: burning ? 1 : 0.97 }}
                onClick={burnToken}
                disabled={burning || !selectedToken || !burnAmount}
              >
                {burning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Incinerating...</span>
                  </>
                ) : (
                  <>
                    <span>Incinerate → +1000 ASH</span>
                    <Zap className="text-white animate-twinkle" />
                  </>
                )}
              </motion.button>

              {/* ASH Balance */}
              <div className="mt-6 text-center">
                <div className="text-lg font-bold text-meteor-orange">
                  🔥 ASH Accumulated: {ashBalance.toLocaleString()} / 50,000
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Redeem 50,000 ASH for rewards
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-stellar-purple mb-4">Connect your wallet to start burning tokens</p>
              <WalletMultiButton className="btn-primary" />
            </div>
          )}
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
                  {burnResult.txid && (
                    <div className="text-sm text-gray-400">
                      <a 
                        href={`https://solscan.io/tx/${burnResult.txid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cosmic-cyan hover:text-stellar-purple flex items-center justify-center gap-1"
                      >
                        View Transaction <ExternalLink size={16} />
                      </a>
                    </div>
                  )}
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

        {/* Burn History */}
        {burnLog.length > 0 && (
          <motion.div
            className={glassPanel + ' mt-8 w-full max-w-2xl mx-auto'}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Flame className="text-meteor-orange" />
              Recent Burns
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {burnLog.map((log, i) => (
                <div key={i} className="bg-cosmic-blue/40 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-semibold">
                      {log.amount} {log.tokenName}
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <a
                    href={`https://solscan.io/tx/${log.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cosmic-cyan hover:text-stellar-purple transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
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
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Flame, Info, CheckCircle2, XCircle, Zap, ExternalLink, Share, Copy, BookOpen } from 'lucide-react'
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
import GlitchLogo from '../components/GlitchLogo';
import SplashCursor from '../components/SplashCursor';
import LoadingScreen from '../components/LoadingScreen';

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

// Update the burn result to include ASH earned and token info
interface BurnResult {
  success: boolean;
  message: string;
  txid?: string;
  ashEarned?: number;
  tokenSymbol?: string;
  amountBurned?: string;
}

// Helius API configuration
const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || 'd966b6f9-d9d7-4e34-a109-2cf782d34e87';

// Enhanced token fetching using Helius API
async function fetchTokensWithHelius(walletAddress: string) {
  try {
    console.log('🔍 Fetching tokens with Helius /balances API for:', walletAddress);
    
    const url = `https://api.helius.xyz/v0/addresses/${walletAddress}/balances?api-key=${HELIUS_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📊 Helius /balances API response:', data);
    
    if (!data.tokens || !Array.isArray(data.tokens)) {
      console.warn('⚠️ Unexpected Helius API response format');
      return [];
    }
    
    // Filter and map tokens with proper safety checks
    const validTokens = data.tokens
      .filter((token: any) => {
        return token && 
               token.mint && 
               typeof token.amount === 'string' && 
               Number(token.amount) > 0 &&
               typeof token.decimals === 'number';
      })
      .map((token: any) => {
        try {
          return {
            mint: new PublicKey(token.mint),
            amount: Number(token.amount),
            decimals: token.decimals || 9,
            symbol: token.symbol || `TOKEN_${token.mint.slice(0, 4).toUpperCase()}`,
            name: token.tokenName || token.symbol || `Token ${token.mint.slice(0, 6)}...${token.mint.slice(-4)}`,
            logoURI: token.logoURI || undefined
          };
        } catch (error) {
          console.error('❌ Error parsing token:', token, error);
          return null;
        }
      })
      .filter((token: any) => token !== null);
    
    console.log(`✅ Successfully parsed ${validTokens.length} tokens from Helius /balances`);
    return validTokens;
    
  } catch (error) {
    console.error('❌ Error fetching tokens with Helius /balances:', error);
    return [];
  }
}

// Fallback function using direct RPC (with safety guards)
async function fetchTokensWithRPC(connection: any, publicKey: PublicKey) {
  try {
    console.log('🔄 Fallback: Fetching tokens with RPC');
    
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });

    const parsedTokens: TokenAccount[] = tokenAccounts.value
      .map((acc: any) => {
        try {
          const info = acc?.account?.data?.parsed?.info;
          if (!info || !info.mint || !info.tokenAmount) {
            return null;
          }
          
          const mint = new PublicKey(info.mint);
          const amount = Number(info.tokenAmount.uiAmount || 0);
          const decimals = Number(info.tokenAmount.decimals || 0);
          
          if (amount <= 0) return null;
          
          return { 
            mint, 
            amount, 
            decimals,
            symbol: `TOKEN_${info.mint.slice(0, 4).toUpperCase()}`,
            name: `Token ${info.mint.slice(0, 8)}...${info.mint.slice(-4)}`
          };
        } catch (error) {
          console.error('❌ Error parsing RPC token account:', error);
          return null;
        }
      })
      .filter((t: any) => t !== null);

    console.log(`✅ RPC fallback found ${parsedTokens.length} tokens`);
    return parsedTokens;
    
  } catch (error) {
    console.error('❌ RPC fallback failed:', error);
    return [];
  }
}

export default function Home() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<TokenAccount[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenAccount | null>(null);
  const [burnAmount, setBurnAmount] = useState('');
  const [burning, setBurning] = useState(false);
  const [burnResult, setBurnResult] = useState<BurnResult | null>(null);
  const [formError, setFormError] = useState('');
  const [ashBalance, setAshBalance] = useState(0);
  const [burnLog, setBurnLog] = useState<BurnLogEntry[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Bonk burn animation overlay state
  const [showBurnAnimation, setShowBurnAnimation] = useState(false);

  // Show animation when burnResult.success changes to true
  useEffect(() => {
    if (burnResult && burnResult.success) {
      setShowBurnAnimation(true);
      const timer = setTimeout(() => setShowBurnAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [burnResult]);

  // Calculate ASH preview based on current burn amount
  const calculateAshPreview = () => {
    if (!burnAmount || !parseFloat(burnAmount)) return 0;
    const amount = parseFloat(burnAmount);
    return Math.floor((amount / 1000000) * 1000);
  };

  // Generate Twitter share message and URL
  const generateTwitterShareMessage = (tokenName: string, amountBurned: string, ashEarned: number, txid: string) => {
    const message = `🔥 Just incinerated ${parseFloat(amountBurned).toLocaleString()} ${tokenName} tokens across the galaxy! ✨ Earned ${ashEarned.toLocaleString()} ASH in the process! 🌌 

Transaction: https://solscan.io/tx/${txid}

#StellarIncinerator #Solana #TokenBurn #SpaceThemed`;
    
    const encodedMessage = encodeURIComponent(message);
    return `https://twitter.com/intent/tweet?text=${encodedMessage}`;
  };

  // Copy share message to clipboard
  const copyShareMessage = (tokenName: string, amountBurned: string, ashEarned: number, txid: string) => {
    const message = `🔥 Just incinerated ${parseFloat(amountBurned).toLocaleString()} ${tokenName} tokens across the galaxy! ✨ Earned ${ashEarned.toLocaleString()} ASH in the process! 🌌

Transaction: https://solscan.io/tx/${txid}

#StellarIncinerator #Solana #TokenBurn #SpaceThemed`;

    navigator.clipboard.writeText(message).then(() => {
      // You could add a toast notification here
      console.log('Share message copied to clipboard!');
    });
  };

  useEffect(() => {
    if (!connected || !publicKey) {
      setTokens([]);
      setSelectedToken(null);
      setBalance(null);
      return;
    }
    
    const fetchBalance = async () => {
      try {
        if (publicKey) {
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
        }
      } catch (error) {
        console.error('❌ Error fetching balance:', error);
      }
    };

    const fetchTokens = async () => {
      if (!publicKey) return;
      
      setLoadingTokens(true);
      setFormError('');
      
      try {
        // Try Helius API first
        let fetchedTokens = await fetchTokensWithHelius(publicKey.toString());
        
        // Fallback to RPC if Helius fails or returns no tokens
        if (fetchedTokens.length === 0) {
          console.log('🔄 Helius returned no tokens, trying RPC fallback...');
          fetchedTokens = await fetchTokensWithRPC(connection, publicKey);
        }
        
        console.log(`🎯 Final token count: ${fetchedTokens.length}`);
        setTokens(fetchedTokens);
        
        if (fetchedTokens.length === 0) {
          setFormError('No tokens found in your wallet. Make sure you have SPL tokens with a balance > 0.');
        }
        
      } catch (error) {
        console.error('❌ Error in fetchTokens:', error);
        setFormError('Failed to load tokens. Please try again.');
      } finally {
        setLoadingTokens(false);
      }
    };

    fetchBalance();
    fetchTokens();
  }, [publicKey, connected, connection]);

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
    if (!validateBurn() || !publicKey || !selectedToken) {
      console.error('❌ Validation failed or missing required data');
      return;
    }
    
    setBurning(true);
    setBurnResult(null);
    setFormError('');

    try {
      const amount = parseFloat(burnAmount);
      const burnAmountLamports = Math.floor(amount * Math.pow(10, selectedToken.decimals));

      console.log(`🔥 Burning ${amount} ${selectedToken.symbol || 'tokens'} (${burnAmountLamports} lamports)`);

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
      console.log('📝 Transaction signature:', signature);
      
      await connection.confirmTransaction(signature, 'confirmed');
      console.log('✅ Transaction confirmed');

      // Calculate proportional ASH rewards: 1 million tokens = 1000 ASH
      // Formula: ASH = (tokens_burned / 1,000,000) * 1000
      const ashReward = Math.floor((amount / 1000000) * 1000);
      console.log(`🔥 ASH reward calculated: ${amount} tokens → ${ashReward} ASH`);
      
      // Update ASH balance with proportional reward
      setAshBalance(prev => prev + ashReward);

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
        message: `Successfully burned ${burnAmount} ${selectedToken.symbol || 'tokens'}! Earned ${ashReward} ASH.`, 
        txid: signature,
        ashEarned: ashReward,
        tokenSymbol: selectedToken.symbol || 'tokens',
        amountBurned: burnAmount
      });

      // Reset form
      setBurnAmount('');
      setSelectedToken(null);

      // Refresh token balances after a delay
      setTimeout(async () => {
        if (publicKey) {
          try {
            const refreshedTokens = await fetchTokensWithHelius(publicKey.toString());
            if (refreshedTokens.length > 0) {
              setTokens(refreshedTokens);
            }
          } catch (error) {
            console.error('❌ Error refreshing tokens:', error);
          }
        }
      }, 2000);

    } catch (error: any) {
      console.error('❌ Burn failed:', error);
      setBurnResult({ 
        success: false, 
        message: `Burn failed: ${error.message || 'Unknown error'}` 
      });
    } finally {
      setBurning(false);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen 
            key="loading"
            onLoadingComplete={() => setIsLoading(false)} 
          />
        ) : (
          <motion.main 
            key="main"
            className="min-h-screen bg-cosmic-blue text-star-white font-orbitron relative overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
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
            <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 w-full z-20">
              <div className="flex items-center space-x-2 md:space-x-3">
                <GlitchLogo 
                  src="/asset/logo.png" 
                  alt="Bonk Token Burner Logo" 
                  width={48} 
                  height={48}
                  glitchInterval={4000}
                  glitchDuration={500}
                  className="md:w-14 md:h-14 pixel-border pixel-glow"
                />
                <GlitchText
                  speed={0.5}
                  enableShadows={true}
                  enableOnHover={true}
                  className="text-lg md:text-2xl font-bold text-meteor-orange drop-shadow-pixel-orange"
                >
                  Bonk Token Burner
                </GlitchText>
              </div>
              <div className="flex items-center space-x-2 md:space-x-4">
                <a 
                  href="https://trendsai.gitbook.io/stellar-incinerator/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cosmic-cyan hover:text-stellar-purple transition-colors font-semibold flex items-center gap-1 z-50 relative cursor-pointer bg-cosmic-blue/20 px-2 py-1 rounded border border-cosmic-cyan/30 hover:border-stellar-purple/50 text-sm md:text-base"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('https://trendsai.gitbook.io/stellar-incinerator/', '_blank', 'noopener,noreferrer');
                  }}
                >
                  <BookOpen size={14} className="md:w-4 md:h-4" />
                  <span className="hidden sm:inline">GitBook</span>
                  <span className="sm:hidden">Guide</span>
                </a>
              </div>
            </header>
            
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center pt-12 md:pt-24 pb-8 md:pb-12 px-4">
              <motion.h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-star-white mb-4 font-orbitron animate-stellar-pulse" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <GlitchText
                  speed={1}
                  enableShadows={true}
                  enableOnHover={true}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
                >
                  Burn Solana Tokens Across the Galaxy
                </GlitchText>
              </motion.h1>
              <motion.p className="text-base md:text-xl text-cosmic-cyan mb-6 md:mb-8 font-orbitron max-w-xl mx-auto px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
                A stellar, space-inspired dApp for incinerating your Solana tokens. Send tokens to space and get ASH in return. Powered by cosmic energy, secured by the void, visually stunning like nebulae.
              </motion.p>
              
              <motion.div className="mt-4 md:mt-6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
                <WalletMultiButton className="btn-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4" />
                {connected && balance !== null && (
                  <span className="block mt-2 text-cosmic-cyan font-semibold text-sm md:text-base">Balance: {balance.toFixed(4)} SOL</span>
                )}
              </motion.div>
            </section>
            
            {/* Main Form Section */}
            <section className="flex flex-col items-center justify-center min-h-[40vh] pb-12 md:pb-16 px-4">
              <motion.div className={glassPanel + ' w-full max-w-lg mx-auto'} initial="initial" animate="animate" variants={fadeInUp}>
                <motion.h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2" initial="initial" animate="animate" variants={fadeInUp}>
                  <Zap className="text-cosmic-cyan animate-twinkle" size={20} /> 
                  <GlitchText
                    speed={0.8}
                    enableShadows={true}
                    enableOnHover={true}
                    className="text-xl md:text-2xl font-bold"
                  >
                    Incinerate Tokens
                  </GlitchText>
                </motion.h2>

                {connected ? (
                  <>
                    {/* Token Selector */}
                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-stellar-purple">
                        Select Token 
                        {loadingTokens ? (
                          <span className="text-cosmic-cyan ml-2">(Loading...)</span>
                        ) : tokens.length > 0 ? (
                          <span className="text-cosmic-cyan ml-2">({tokens.length} found)</span>
                        ) : (
                          <span className="text-gray-400 ml-2">(No tokens found)</span>
                        )}
                      </label>
                      <select
                        className="w-full p-3 rounded-lg bg-cosmic-blue/60 border border-stellar-purple focus:outline-none focus:ring-2 focus:ring-cosmic-cyan text-base md:text-lg"
                        onChange={(e) => {
                          const token = tokens.find((t) => t.mint.toString() === e.target.value);
                          setSelectedToken(token || null);
                          setFormError('');
                        }}
                        value={selectedToken?.mint.toString() || ""}
                        disabled={loadingTokens}
                      >
                        <option value="" disabled>
                          {loadingTokens ? 'Loading tokens...' : tokens.length === 0 ? 'No tokens found' : 'Choose a token to burn'}
                        </option>
                        {tokens.length === 0 ? (
                          <option value="" disabled>Loading tokens...</option>
                        ) : (
                          tokens.map((token, i) => (
                            <option key={token.mint.toString()} value={token.mint.toString()}>
                              {token.name} ({token.amount.toFixed(4)})
                            </option>
                          ))
                        )}
                      </select>
                      {!loadingTokens && tokens.length === 0 && connected && (
                        <div className="text-sm text-gray-400 mt-1">
                          No tokens found in your wallet
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
                          className="w-full p-3 rounded-lg bg-cosmic-blue/60 border border-stellar-purple focus:outline-none focus:ring-2 focus:ring-cosmic-cyan text-base md:text-lg placeholder-gray-400"
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
                      {/* ASH Preview */}
                      {burnAmount && parseFloat(burnAmount) > 0 && (
                        <div className="mt-2 text-center">
                          <div className="text-sm text-meteor-orange font-semibold">
                            🔥 You will earn: {calculateAshPreview().toLocaleString()} ASH
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            ({parseFloat(burnAmount).toLocaleString()} tokens × 0.001 ASH per token)
                          </div>
                        </div>
                      )}
                    </div>

                    {formError && (
                      <motion.div className="text-red-500 mb-4 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <XCircle size={20} /> {formError}
                      </motion.div>
                    )}

                    <motion.button
                      type="button"
                      className="btn-primary w-full flex items-center justify-center text-base md:text-lg gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          <span className="text-sm md:text-base">
                            {burnAmount && parseFloat(burnAmount) > 0 
                              ? `Incinerate → +${calculateAshPreview().toLocaleString()} ASH`
                              : 'Incinerate → Earn ASH'
                            }
                          </span>
                          <Zap className="text-white animate-twinkle" size={20} />
                        </>
                      )}
                    </motion.button>

                    {/* ASH Balance */}
                    <div className="mt-4 md:mt-6 text-center">
                      <div className="text-base md:text-lg font-bold text-meteor-orange">
                        🔥 ASH Accumulated: {ashBalance.toLocaleString()} / 50,000
                      </div>
                      <div className="text-xs md:text-sm text-gray-400 mt-1">
                        Redeem 50,000 ASH for rewards • 1M tokens = 1000 ASH
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 md:py-8">
                    <p className="text-stellar-purple mb-4 text-sm md:text-base">Connect your wallet to start burning tokens</p>
                    <WalletMultiButton className="btn-primary" />
                  </div>
                )}
              </motion.div>
              
              {/* Confirmation/Result Section - Moved above feature cards for better visibility */}
              <AnimatePresence>
                {burnResult && (
                  <motion.div
                    className={glassPanel + ' mt-6 md:mt-8 w-full max-w-md mx-auto text-center'}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.5 }}
                  >
                    {burnResult.success ? (
                      <>
                        <CheckCircle2 className="mx-auto text-plasma-green mb-2" size={32} />
                        <div className="text-lg md:text-xl font-bold mb-2">{burnResult.message}</div>
                        {burnResult.txid && (
                          <>
                            <div className="text-sm text-gray-400 mb-4">
                              <a 
                                href={`https://solscan.io/tx/${burnResult.txid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cosmic-cyan hover:text-stellar-purple flex items-center justify-center gap-1"
                              >
                                View Transaction <ExternalLink size={14} />
                              </a>
                            </div>
                            
                            {/* Share Section */}
                            <div className="bg-cosmic-blue/40 p-3 md:p-4 rounded-lg">
                              <div className="text-xs md:text-sm text-stellar-purple mb-3 font-semibold">
                                🌌 Share your cosmic burn across the galaxy! Share to X instantly.
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center">
                                <a
                                  href={generateTwitterShareMessage(
                                    selectedToken?.symbol || 'tokens',
                                    burnResult.amountBurned || '',
                                    burnResult.ashEarned || 0,
                                    burnResult.txid
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-2 bg-stellar-purple hover:bg-stellar-purple/80 text-white px-3 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm"
                                >
                                  <Share size={14} />
                                  Share on X
                                </a>
                                <button
                                  onClick={() => copyShareMessage(
                                    selectedToken?.symbol || 'tokens',
                                    burnResult.amountBurned || '',
                                    burnResult.ashEarned || 0,
                                    burnResult.txid
                                  )}
                                  className="flex items-center justify-center gap-2 bg-cosmic-cyan hover:bg-cosmic-cyan/80 text-white px-3 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm"
                                >
                                  <Copy size={14} />
                                  Copy Message
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <XCircle className="mx-auto text-red-500 mb-2" size={32} />
                        <div className="text-lg md:text-xl font-bold mb-2">{burnResult.message}</div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Scroll-Triggered Feature Cards */}
              <motion.div 
                className="mt-12 md:mt-16 mb-6 md:mb-8 flex flex-col gap-4 md:gap-6 max-w-3xl mx-auto px-4 w-full"
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div 
                  className="bg-gradient-to-br from-stellar-purple/10 to-cosmic-cyan/15 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-stellar-purple/20 flex items-center gap-3 md:gap-4 hover:border-stellar-purple/40 transition-all duration-300 hover:scale-105 cursor-pointer group w-full"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-gradient-to-br from-stellar-purple/20 to-cosmic-cyan/20 p-2 md:p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Share className="text-cosmic-cyan animate-twinkle group-hover:animate-pulse" size={24} />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-base md:text-lg font-bold text-star-white group-hover:text-cosmic-cyan transition-colors duration-300 leading-tight">Share to X Instantly</div>
                    <div className="text-xs md:text-sm text-cosmic-cyan/80 group-hover:text-cosmic-cyan transition-colors duration-300 leading-tight mt-1">Auto-generate cosmic burn posts with one click</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-cosmic-cyan/10 to-nebula-pink/15 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-cosmic-cyan/20 flex items-center gap-3 md:gap-4 hover:border-cosmic-cyan/40 transition-all duration-300 hover:scale-105 cursor-pointer group w-full"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-gradient-to-br from-cosmic-cyan/20 to-nebula-pink/20 p-2 md:p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Zap className="text-meteor-orange animate-pulse group-hover:animate-bounce" size={24} />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-base md:text-lg font-bold text-star-white group-hover:text-meteor-orange transition-colors duration-300 leading-tight">Earn ASH Rewards</div>
                    <div className="text-xs md:text-sm text-meteor-orange/80 group-hover:text-meteor-orange transition-colors duration-300 leading-tight mt-1">1M tokens = 1000 ASH • Instant rewards</div>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Burn History */}
              {burnLog.length > 0 && (
                <motion.div
                  className={glassPanel + ' mt-6 md:mt-8 w-full max-w-2xl mx-auto'}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                    <Flame className="text-meteor-orange" size={20} />
                    Recent Burns
                  </h3>
                  <div className="space-y-2 md:space-y-3 max-h-64 overflow-y-auto">
                    {burnLog.map((log, i) => (
                      <div key={i} className="bg-cosmic-blue/40 p-3 rounded-lg flex justify-between items-center">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm md:text-base truncate">
                            {log.amount} {log.tokenName}
                          </div>
                          <div className="text-xs md:text-sm text-gray-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <a
                          href={`https://solscan.io/tx/${log.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cosmic-cyan hover:text-stellar-purple transition-colors ml-2 flex-shrink-0"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </section>
            
            {/* Footer */}
            <footer className="py-8 md:py-10 px-4 text-center text-gray-400 text-xs md:text-sm">
              <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
                <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                  <span>Powered by <span className="text-stellar-purple font-bold">cosmic energy</span>. Built for <span className="text-cosmic-cyan font-bold">stellar exploration</span>.</span>
                  <span className="hidden md:inline">|</span>
                  <a 
                    href="https://trendsai.gitbook.io/stellar-incinerator/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cosmic-cyan hover:text-stellar-purple transition-colors font-semibold flex items-center gap-1 z-50 relative cursor-pointer bg-cosmic-blue/20 px-2 py-1 rounded border border-cosmic-cyan/30 hover:border-stellar-purple/50 text-xs md:text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('https://trendsai.gitbook.io/stellar-incinerator/', '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <BookOpen size={12} className="md:w-4 md:h-4" />
                    <span className="hidden sm:inline">GitBook</span>
                    <span className="sm:hidden">Guide</span>
                  </a>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                  <span>Contract: <span className="text-gray-400 break-all">0x1234...5678</span></span>
                  <span className="hidden md:inline">|</span>
                  <span>© 2025 Stellar Incinerator. All rights reserved.</span>
                </div>
              </div>
            </footer>
            {/* Burn Animation Overlay */}
            {showBurnAnimation && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 animate-fade-in-out pointer-events-none">
                <img src="/asset/postburnanimation.gif" alt="Bonk Burn Animation" className="w-80 h-80 md:w-[400px] md:h-[400px] pixel-border pixel-glow" style={{imageRendering: 'pixelated'}} />
              </div>
            )}
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
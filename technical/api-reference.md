# 📚 API Reference

Complete reference guide for all APIs, functions, and interfaces used in Bonkseus Incinerator.

## 🌐 External APIs

### Helius RPC API
Primary blockchain data provider for enhanced Solana interactions.

#### Base Endpoint
```
https://rpc.helius.xyz/?api-key=d966b6f9-d9d7-4e34-a109-2cf782d34e87
```

#### Token Balances API
```typescript
interface HeliusBalanceRequest {
  addresses: string[];
  includeNativeBalance?: boolean;
  includeProgramAccounts?: boolean;
}

interface HeliusBalanceResponse {
  address: string;
  nativeBalance: number;
  tokens: {
    mint: string;
    amount: number;
    decimals: number;
    tokenAccount: string;
  }[];
}

// Usage
const getTokenBalances = async (walletAddress: string): Promise<HeliusBalanceResponse> => {
  const response = await fetch('https://rpc.helius.xyz/?api-key=YOUR_KEY', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenBalances',
      params: {
        addresses: [walletAddress],
        includeNativeBalance: true
      }
    })
  });
  
  return response.json();
};
```

#### Digital Asset Standard (DAS) API
```typescript
interface DASMetadataRequest {
  assetIds: string[];
}

interface DASMetadataResponse {
  id: string;
  content: {
    metadata: {
      name: string;
      symbol: string;
      description: string;
    };
    files: {
      uri: string;
      mime: string;
    }[];
  };
}

const getDASMetadata = async (mintAddress: string): Promise<DASMetadataResponse> => {
  const response = await fetch('https://rpc.helius.xyz/?api-key=YOUR_KEY', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getAsset',
      params: {
        id: mintAddress
      }
    })
  });
  
  return response.json();
};
```

### Jupiter Token List API
Community-maintained token metadata source.

```typescript
interface JupiterToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
}

const getJupiterTokenList = async (): Promise<JupiterToken[]> => {
  const response = await fetch('https://token.jup.ag/all');
  return response.json();
};

const findJupiterToken = (tokenList: JupiterToken[], mintAddress: string): JupiterToken | null => {
  return tokenList.find(token => token.address === mintAddress) || null;
};
```

## 🔗 Solana Web3.js Integration

### Connection Management
```typescript
import { Connection, Commitment, ConnectionConfig } from '@solana/web3.js';

class SolanaConnectionManager {
  private connection: Connection;
  private endpoint: string;
  private commitment: Commitment;

  constructor(endpoint: string, commitment: Commitment = 'confirmed') {
    this.endpoint = endpoint;
    this.commitment = commitment;
    
    const config: ConnectionConfig = {
      commitment,
      confirmTransactionInitialTimeout: 30000,
      wsEndpoint: endpoint.replace('https', 'wss')
    };
    
    this.connection = new Connection(endpoint, config);
  }

  getConnection(): Connection {
    return this.connection;
  }

  async getHealth(): Promise<string> {
    try {
      const health = await this.connection.getHealth();
      return health;
    } catch (error) {
      throw new Error(`Connection health check failed: ${error.message}`);
    }
  }

  async getSlot(): Promise<number> {
    return this.connection.getSlot(this.commitment);
  }
}
```

### Token Account Operations
```typescript
import { 
  PublicKey, 
  TOKEN_PROGRAM_ID,
  ParsedTokenAccountsByOwnerResponse 
} from '@solana/web3.js';

interface TokenAccountInfo {
  mint: PublicKey;
  owner: PublicKey;
  amount: number;
  decimals: number;
  address: PublicKey;
}

const getTokenAccountsByOwner = async (
  connection: Connection,
  owner: PublicKey
): Promise<TokenAccountInfo[]> => {
  const response: ParsedTokenAccountsByOwnerResponse = 
    await connection.getParsedTokenAccountsByOwner(
      owner,
      { programId: TOKEN_PROGRAM_ID }
    );

  return response.value
    .filter(account => account.account.data.parsed.info.tokenAmount.uiAmount > 0)
    .map(account => ({
      mint: new PublicKey(account.account.data.parsed.info.mint),
      owner: new PublicKey(account.account.data.parsed.info.owner),
      amount: account.account.data.parsed.info.tokenAmount.uiAmount,
      decimals: account.account.data.parsed.info.tokenAmount.decimals,
      address: account.pubkey
    }));
};
```

### Transaction Building
```typescript
import { 
  Transaction, 
  TransactionInstruction,
  PublicKey,
  SystemProgram 
} from '@solana/web3.js';
import { createBurnInstruction } from '@solana/spl-token';

interface BurnTransactionParams {
  tokenAccount: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amount: number;
  decimals: number;
}

const buildBurnTransaction = async (
  connection: Connection,
  params: BurnTransactionParams
): Promise<Transaction> => {
  const { tokenAccount, mint, owner, amount, decimals } = params;
  
  // Convert amount to lamports
  const lamportAmount = BigInt(amount * Math.pow(10, decimals));
  
  // Create burn instruction
  const burnInstruction = createBurnInstruction(
    tokenAccount,
    mint,
    owner,
    lamportAmount
  );
  
  // Build transaction
  const transaction = new Transaction();
  transaction.add(burnInstruction);
  transaction.feePayer = owner;
  
  // Set blockhash
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  
  return transaction;
};
```

## 🎯 Core Application APIs

### Token Metadata Resolution
```typescript
interface TokenMetadata {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  description?: string;
  source: 'jupiter' | 'helius' | 'onchain' | 'unknown';
}

class TokenMetadataResolver {
  private jupiterTokens: JupiterToken[] = [];
  private cache = new Map<string, TokenMetadata>();

  async initialize() {
    this.jupiterTokens = await getJupiterTokenList();
  }

  async resolveMetadata(mintAddress: string): Promise<TokenMetadata> {
    // Check cache first
    if (this.cache.has(mintAddress)) {
      return this.cache.get(mintAddress)!;
    }

    // Try Jupiter first
    const jupiterToken = findJupiterToken(this.jupiterTokens, mintAddress);
    if (jupiterToken) {
      const metadata: TokenMetadata = {
        mint: mintAddress,
        name: jupiterToken.name,
        symbol: jupiterToken.symbol,
        decimals: jupiterToken.decimals,
        logoURI: jupiterToken.logoURI,
        source: 'jupiter'
      };
      
      this.cache.set(mintAddress, metadata);
      return metadata;
    }

    // Try Helius DAS API
    try {
      const dasMetadata = await getDASMetadata(mintAddress);
      if (dasMetadata.content?.metadata) {
        const metadata: TokenMetadata = {
          mint: mintAddress,
          name: dasMetadata.content.metadata.name || 'Unknown Token',
          symbol: dasMetadata.content.metadata.symbol || 'UNK',
          decimals: 9, // Default, should be fetched from mint info
          description: dasMetadata.content.metadata.description,
          logoURI: dasMetadata.content.files?.[0]?.uri,
          source: 'helius'
        };
        
        this.cache.set(mintAddress, metadata);
        return metadata;
      }
    } catch (error) {
      console.warn('Failed to fetch DAS metadata:', error);
    }

    // Fallback to basic info
    const fallbackMetadata: TokenMetadata = {
      mint: mintAddress,
      name: `TOKEN_${mintAddress.slice(0, 8)}`,
      symbol: 'UNK',
      decimals: 9,
      source: 'unknown'
    };

    this.cache.set(mintAddress, fallbackMetadata);
    return fallbackMetadata;
  }
}
```

### ASH Reward Calculation
```typescript
interface ASHCalculationResult {
  baseASH: number;
  bonusASH: number;
  totalASH: number;
  tier: 'bronze' | 'silver' | 'gold';
  nextTierThreshold: number;
}

class ASHCalculator {
  private static readonly BASE_DIVISOR = 1_000_000;
  private static readonly BASE_MULTIPLIER = 1_000;
  
  private static readonly TIER_THRESHOLDS = {
    bronze: 1_000,
    silver: 10_000,
    gold: 50_000
  };

  static calculateASH(tokensBurned: number): number {
    return (tokensBurned / this.BASE_DIVISOR) * this.BASE_MULTIPLIER;
  }

  static calculateWithBonus(
    tokensBurned: number,
    currentASHBalance: number,
    isSpecialEvent: boolean = false
  ): ASHCalculationResult {
    const baseASH = this.calculateASH(tokensBurned);
    const currentTier = this.getTier(currentASHBalance);
    
    // Tier multipliers
    const tierMultipliers = {
      bronze: 1.0,
      silver: 1.1,
      gold: 1.25
    };

    let bonusASH = baseASH * (tierMultipliers[currentTier] - 1);
    
    // Special event bonus
    if (isSpecialEvent) {
      bonusASH += baseASH; // Double bonus during events
    }

    const totalASH = baseASH + bonusASH;
    const nextTierThreshold = this.getNextTierThreshold(currentTier);

    return {
      baseASH,
      bonusASH,
      totalASH,
      tier: currentTier,
      nextTierThreshold
    };
  }

  private static getTier(ashBalance: number): 'bronze' | 'silver' | 'gold' {
    if (ashBalance >= this.TIER_THRESHOLDS.gold) return 'gold';
    if (ashBalance >= this.TIER_THRESHOLDS.silver) return 'silver';
    return 'bronze';
  }

  private static getNextTierThreshold(currentTier: 'bronze' | 'silver' | 'gold'): number {
    switch (currentTier) {
      case 'bronze': return this.TIER_THRESHOLDS.silver;
      case 'silver': return this.TIER_THRESHOLDS.gold;
      case 'gold': return Infinity;
    }
  }
}
```

### Burn History Management
```typescript
interface BurnRecord {
  id: string;
  signature: string;
  timestamp: number;
  tokenMint: string;
  tokenSymbol: string;
  tokenName: string;
  amountBurned: number;
  ashEarned: number;
  preBurnBalance: number;
  postBurnBalance: number;
  gasUsed: number;
  status: 'confirmed' | 'failed' | 'pending';
}

class BurnHistoryManager {
  private static readonly STORAGE_KEY = 'stellar_incinerator_burn_history';
  private history: BurnRecord[] = [];

  constructor() {
    this.loadFromStorage();
  }

  addBurnRecord(record: Omit<BurnRecord, 'id' | 'timestamp'>): string {
    const burnRecord: BurnRecord = {
      ...record,
      id: this.generateId(),
      timestamp: Date.now()
    };

    this.history.push(burnRecord);
    this.saveToStorage();
    
    return burnRecord.id;
  }

  updateBurnRecord(id: string, updates: Partial<BurnRecord>): boolean {
    const index = this.history.findIndex(record => record.id === id);
    if (index === -1) return false;

    this.history[index] = { ...this.history[index], ...updates };
    this.saveToStorage();
    
    return true;
  }

  getBurnHistory(): BurnRecord[] {
    return [...this.history].sort((a, b) => b.timestamp - a.timestamp);
  }

  getSuccessfulBurns(): BurnRecord[] {
    return this.history.filter(record => record.status === 'confirmed');
  }

  getTotalASHEarned(): number {
    return this.getSuccessfulBurns()
      .reduce((total, record) => total + record.ashEarned, 0);
  }

  getTotalTokensBurned(): number {
    return this.getSuccessfulBurns()
      .reduce((total, record) => total + record.amountBurned, 0);
  }

  getBurnsByToken(tokenMint: string): BurnRecord[] {
    return this.history.filter(record => record.tokenMint === tokenMint);
  }

  private generateId(): string {
    return `burn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(BurnHistoryManager.STORAGE_KEY);
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load burn history from storage:', error);
      this.history = [];
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        BurnHistoryManager.STORAGE_KEY, 
        JSON.stringify(this.history)
      );
    } catch (error) {
      console.error('Failed to save burn history to storage:', error);
    }
  }
}
```

## 🎨 UI Component APIs

### Wallet Integration
```typescript
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

interface WalletState {
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  wallet: Wallet | null;
  disconnect: () => Promise<void>;
  select: (walletName: WalletName | null) => void;
  signTransaction: ((transaction: Transaction) => Promise<Transaction>) | undefined;
  sendTransaction: ((transaction: Transaction, connection: Connection) => Promise<string>) | undefined;
}

const useWalletState = (): WalletState => {
  const {
    connected,
    connecting,
    publicKey,
    wallet,
    disconnect,
    select,
    signTransaction,
    sendTransaction
  } = useWallet();

  return {
    connected,
    connecting,
    publicKey,
    wallet,
    disconnect,
    select,
    signTransaction,
    sendTransaction
  };
};
```

### Token Management Hook
```typescript
interface UseTokensResult {
  tokens: TokenAccountInfo[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const useTokens = (walletAddress: PublicKey | null): UseTokensResult => {
  const [tokens, setTokens] = useState<TokenAccountInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connection } = useConnection();

  const fetchTokens = useCallback(async () => {
    if (!walletAddress) {
      setTokens([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tokenAccounts = await getTokenAccountsByOwner(connection, walletAddress);
      const metadataResolver = new TokenMetadataResolver();
      await metadataResolver.initialize();

      const tokensWithMetadata = await Promise.all(
        tokenAccounts.map(async (token) => ({
          ...token,
          metadata: await metadataResolver.resolveMetadata(token.mint.toString())
        }))
      );

      setTokens(tokensWithMetadata);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
    } finally {
      setLoading(false);
    }
  }, [walletAddress, connection]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return {
    tokens,
    loading,
    error,
    refetch: fetchTokens
  };
};
```

## 🔧 Utility Functions

### Input Validation
```typescript
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

class InputValidator {
  static validateBurnAmount(amount: string, balance: number): ValidationResult {
    if (!amount || amount.trim() === '') {
      return { isValid: false, error: 'Amount is required' };
    }

    const numAmount = Number(amount);
    
    if (isNaN(numAmount)) {
      return { isValid: false, error: 'Amount must be a valid number' };
    }

    if (numAmount <= 0) {
      return { isValid: false, error: 'Amount must be greater than 0' };
    }

    if (numAmount > balance) {
      return { isValid: false, error: 'Amount exceeds available balance' };
    }

    return { isValid: true };
  }

  static validatePublicKey(address: string): ValidationResult {
    try {
      new PublicKey(address);
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid Solana address' };
    }
  }
}
```

### Format Utilities
```typescript
class FormatUtils {
  static formatTokenAmount(amount: number, decimals: number = 2): string {
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(decimals)}B`;
    }
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(decimals)}M`;
    }
    if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(decimals)}K`;
    }
    return amount.toFixed(decimals);
  }

  static formatAddress(address: string, length: number = 8): string {
    if (address.length <= length * 2) return address;
    return `${address.slice(0, length)}...${address.slice(-length)}`;
  }

  static formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  static formatPercentage(value: number, decimals: number = 2): string {
    return `${(value * 100).toFixed(decimals)}%`;
  }
}
```

## 📊 Error Handling

### Error Types
```typescript
enum BurnErrorCode {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INVALID_TOKEN_ACCOUNT = 'INVALID_TOKEN_ACCOUNT',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

interface BurnError {
  code: BurnErrorCode;
  message: string;
  recoverable: boolean;
  details?: any;
}

class ErrorHandler {
  static handleBurnError(error: any): BurnError {
    if (error.code === 0x1) {
      return {
        code: BurnErrorCode.INSUFFICIENT_BALANCE,
        message: 'Insufficient token balance for burn operation',
        recoverable: true
      };
    }

    if (error.message?.includes('TokenAccountNotFound')) {
      return {
        code: BurnErrorCode.INVALID_TOKEN_ACCOUNT,
        message: 'Token account not found or invalid',
        recoverable: false
      };
    }

    if (error.message?.includes('WalletNotConnectedError')) {
      return {
        code: BurnErrorCode.WALLET_NOT_CONNECTED,
        message: 'Wallet not connected',
        recoverable: true
      };
    }

    return {
      code: BurnErrorCode.UNKNOWN_ERROR,
      message: error.message || 'An unknown error occurred',
      recoverable: false,
      details: error
    };
  }
}
```

---

*Complete API documentation for [Bonkseus Incinerator](https://solanatokensincinerator-evd2ucu25-devais-projects-c74be0cf.vercel.app)!* 
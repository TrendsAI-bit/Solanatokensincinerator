# 🏗️ Architecture

Comprehensive overview of Bonkseus Incinerator's technical architecture and system design.

## 🌌 System Overview

### High-Level Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Blockchain     │    │   External      │
│   (Next.js)     │◄──►│   Integration    │◄──►│   Services      │
│                 │    │   (Solana)       │    │   (Helius)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   UI Components │    │   Web3 Layer     │    │   Metadata      │
│   Visual Effects│    │   Wallet Adapter │    │   Token APIs    │
│   State Mgmt    │    │   Transaction    │    │   Price Data    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core Technologies Stack
- **Frontend Framework**: Next.js 14.2.3 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom bonk theme
- **Animations**: Framer Motion + WebGL effects
- **Blockchain**: Solana Web3.js + SPL Token libraries
- **Deployment**: Vercel with global CDN

## 🎨 Frontend Architecture

### Component Hierarchy
```
App (layout.tsx)
├── Providers (providers.tsx)
│   ├── WalletContextProvider
│   ├── ConnectionProvider
│   └── ThemeProvider
├── Page Components
│   ├── HomePage (page.tsx)
│   ├── BurnInterface
│   ├── TokenSelector
│   └── ShareModal
└── Shared Components
    ├── SplashCursor
    ├── GlitchText
    ├── WalletButton
    └── LoadingSpinner
```

### State Management Pattern
```typescript
// Global state using React Context
interface AppState {
  wallet: {
    connected: boolean;
    publicKey: PublicKey | null;
    balance: number;
  };
  tokens: {
    list: TokenAccount[];
    loading: boolean;
    error: string | null;
  };
  burns: {
    history: BurnRecord[];
    totalASH: number;
  };
}

// Context providers for clean state management
const useAppState = () => useContext(AppStateContext);
const useWalletState = () => useContext(WalletContext);
const useTokenState = () => useContext(TokenContext);
```

### File Structure
```
/app
├── layout.tsx              # Root layout with providers
├── page.tsx               # Main burning interface
├── providers.tsx          # Context providers setup
└── globals.css           # Global styles and animations

/components
├── SplashCursor.tsx      # WebGL cursor effects
├── GlitchText.tsx        # Text animation component
├── WalletButton.tsx      # Wallet connection UI
└── ui/                   # Reusable UI components

/lib
├── solana.ts            # Blockchain interactions
├── tokens.ts            # Token metadata utilities
├── utils.ts             # Helper functions
└── constants.ts         # App constants

/public
├── fonts/               # Orbitron font files
└── icons/               # App icons and logos
```

## ⚡ Blockchain Integration Layer

### Web3 Architecture
```typescript
// Connection management
class SolanaConnection {
  private connection: Connection;
  private wallet: WalletContextState;
  
  constructor(endpoint: string) {
    this.connection = new Connection(endpoint, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 30000
    });
  }
  
  async getTokenAccounts(owner: PublicKey) {
    return this.connection.getParsedTokenAccountsByOwner(
      owner,
      { programId: TOKEN_PROGRAM_ID }
    );
  }
  
  async burnTokens(params: BurnParams) {
    const transaction = await this.createBurnTransaction(params);
    return this.executeTransaction(transaction);
  }
}
```

### Transaction Flow
```
1. User Input → Amount Validation
2. Create Burn Instruction → Add to Transaction
3. Simulate Transaction → Verify Success
4. Request Wallet Signature → User Approval
5. Submit to Network → Await Confirmation
6. Update UI State → Show Results
7. Record Burn History → Update ASH Balance
```

### Error Handling Strategy
```typescript
interface TransactionResult {
  success: boolean;
  signature?: string;
  error?: {
    code: string;
    message: string;
    recoverable: boolean;
  };
}

const handleTransactionError = (error: any): TransactionResult => {
  if (error.code === 0x1) {
    return {
      success: false,
      error: {
        code: 'INSUFFICIENT_BALANCE',
        message: 'Not enough tokens to burn',
        recoverable: true
      }
    };
  }
  
  // Handle other error types...
};
```

## 🎨 Visual Effects Architecture

### WebGL Cursor System
```typescript
// Shader-based cursor effects
class CosmicCursor {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private uniforms: UniformLocations;
  
  constructor(canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext('webgl')!;
    this.program = this.createShaderProgram();
    this.setupUniforms();
  }
  
  private createShaderProgram(): WebGLProgram {
    const vertexShader = this.compileShader(vertexSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentSource, this.gl.FRAGMENT_SHADER);
    
    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    
    return program;
  }
  
  render(time: number, mousePos: [number, number]) {
    this.gl.useProgram(this.program);
    this.gl.uniform1f(this.uniforms.uTime, time);
    this.gl.uniform2fv(this.uniforms.uMouse, mousePos);
    
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}
```

### Animation System
```typescript
// Framer Motion configuration
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const cosmicSpring = {
  type: "spring",
  damping: 25,
  stiffness: 120
};

// CSS-in-JS animations
const cosmicAnimations = {
  drift: keyframes`
    0% { transform: translateX(-50px) translateY(-30px); }
    50% { transform: translateX(50px) translateY(30px); }
    100% { transform: translateX(-50px) translateY(-30px); }
  `,
  twinkle: keyframes`
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  `
};
```

## 🔄 Data Flow Architecture

### Token Discovery Flow
```
Wallet Connection
       ↓
Fetch Token Accounts (Solana RPC)
       ↓
Filter Positive Balances
       ↓
Fetch Metadata (Multiple Sources)
       ↓
Merge Data & Update UI
       ↓
Enable Token Selection
```

### Burn Execution Flow
```
Token Selection + Amount Input
       ↓
Real-time ASH Calculation
       ↓
Transaction Creation
       ↓
Simulation & Validation
       ↓
Wallet Signature Request
       ↓
Network Submission
       ↓
Confirmation Polling
       ↓
State Updates & UI Feedback
```

## 🛡️ Security Architecture

### Client-Side Security
```typescript
// Input validation
const validateBurnAmount = (amount: string, balance: number): ValidationResult => {
  if (!amount || isNaN(Number(amount))) {
    return { valid: false, error: 'Invalid amount format' };
  }
  
  const numAmount = Number(amount);
  if (numAmount <= 0) {
    return { valid: false, error: 'Amount must be positive' };
  }
  
  if (numAmount > balance) {
    return { valid: false, error: 'Insufficient balance' };
  }
  
  return { valid: true };
};

// Transaction sanitization
const sanitizeTransaction = (transaction: Transaction): Transaction => {
  // Remove any unauthorized instructions
  const allowedPrograms = [TOKEN_PROGRAM_ID];
  
  transaction.instructions = transaction.instructions.filter(
    instruction => allowedPrograms.includes(instruction.programId)
  );
  
  return transaction;
};
```

### Wallet Security
- **No Private Key Access**: Never request or store private keys
- **Transaction Simulation**: All transactions simulated before execution
- **User Confirmation**: Every action requires explicit user approval
- **Secure Communication**: HTTPS only, no sensitive data in URLs

## 📊 Performance Architecture

### Optimization Strategies
```typescript
// React optimizations
const TokenList = memo(({ tokens }: TokenListProps) => {
  return (
    <div className="token-list">
      {tokens.map(token => (
        <TokenItem key={token.mint} token={token} />
      ))}
    </div>
  );
});

// Debounced API calls
const debouncedMetadataFetch = useMemo(
  () => debounce(fetchTokenMetadata, 300),
  []
);

// Lazy loading
const SplashCursor = lazy(() => import('./SplashCursor'));
```

### Caching Strategy
```typescript
// Memory cache for token metadata
class TokenMetadataCache {
  private cache = new Map<string, TokenMetadata>();
  private maxAge = 5 * 60 * 1000; // 5 minutes
  
  get(mint: string): TokenMetadata | null {
    const entry = this.cache.get(mint);
    if (!entry || Date.now() - entry.timestamp > this.maxAge) {
      return null;
    }
    return entry.data;
  }
  
  set(mint: string, data: TokenMetadata) {
    this.cache.set(mint, {
      data,
      timestamp: Date.now()
    });
  }
}
```

## 🌐 Deployment Architecture

### Vercel Configuration
```javascript
// next.config.js
module.exports = {
  experimental: {
    appDir: true
  },
  images: {
    domains: ['raw.githubusercontent.com', 'arweave.net']
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false
    };
    return config;
  }
};

// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/**": {
      "maxDuration": 30
    }
  }
}
```

### Environment Configuration
```typescript
// Environment variables
interface Config {
  HELIUS_API_KEY: string;
  RPC_ENDPOINT: string;
  NETWORK: 'mainnet-beta' | 'devnet' | 'testnet';
  COMMITMENT_LEVEL: Commitment;
}

const config: Config = {
  HELIUS_API_KEY: process.env.NEXT_PUBLIC_HELIUS_API_KEY!,
  RPC_ENDPOINT: `https://rpc.helius.xyz/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
  NETWORK: 'mainnet-beta',
  COMMITMENT_LEVEL: 'confirmed'
};
```

## 🔧 Development Architecture

### Build System
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@solana/web3.js": "^1.87.6",
    "@solana/wallet-adapter-react": "^0.15.35",
    "next": "14.2.3",
    "react": "^18.2.0",
    "framer-motion": "^10.16.4"
  }
}
```

### Testing Strategy
```typescript
// Unit tests
describe('Token Burning', () => {
  it('calculates ASH rewards correctly', () => {
    expect(calculateASH(1000000)).toBe(1000);
    expect(calculateASH(500000)).toBe(500);
  });
});

// Integration tests
describe('Wallet Integration', () => {
  it('connects to wallet successfully', async () => {
    const wallet = await connectWallet();
    expect(wallet.connected).toBe(true);
  });
});
```

## 🔮 Scalability Considerations

### Future Architecture Improvements
- **Microservices**: Split into specialized services
- **Database Integration**: Persistent burn history storage
- **Real-time Updates**: WebSocket connections for live data
- **CDN Optimization**: Global content delivery network
- **Load Balancing**: Multiple RPC endpoint failover

### Performance Monitoring
```typescript
// Performance tracking
const trackPerformance = (operation: string, duration: number) => {
  if (duration > 1000) {
    console.warn(`Slow operation: ${operation} took ${duration}ms`);
  }
  
  // Send to analytics service
  analytics.track('performance', {
    operation,
    duration,
    timestamp: Date.now()
  });
};
```

---

*Master the art of token burning at [Bonkseus Incinerator](https://solanatokensincinerator-evd2ucu25-devais-projects-c74be0cf.vercel.app)!* 
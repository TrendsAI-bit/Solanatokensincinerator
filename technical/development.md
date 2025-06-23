# 🛠️ Development Setup

Complete guide for setting up your development environment and contributing to Stellar Incinerator.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control
- **Solana CLI** (optional, for advanced development)

### Environment Setup
```bash
# Clone the repository
git clone https://github.com/stellar-incinerator/stellar-incinerator.git
cd stellar-incinerator

# Install dependencies
npm install
# or
yarn install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
# or
yarn dev
```

## 📋 Environment Variables

### Required Variables
Create a `.env.local` file with the following variables:

```bash
# Helius API Configuration
NEXT_PUBLIC_HELIUS_API_KEY=your_helius_api_key_here
NEXT_PUBLIC_RPC_ENDPOINT=https://rpc.helius.xyz/?api-key=your_helius_api_key_here

# Application Configuration
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_NETWORK=mainnet-beta

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Getting API Keys

#### Helius API Key
1. Visit [Helius Dashboard](https://dashboard.helius.xyz/)
2. Sign up for a free account
3. Create a new project
4. Copy your API key from the dashboard
5. Add it to your `.env.local` file

```bash
# Free tier provides:
# - 100,000 requests per month
# - Enhanced APIs access
# - Better reliability than public RPC
```

## 🏗️ Project Structure

```
stellar-incinerator/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # Context providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── SplashCursor.tsx   # WebGL cursor effect
│   ├── GlitchText.tsx     # Text animation
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions
│   ├── solana.ts          # Blockchain utilities
│   ├── tokens.ts          # Token operations
│   └── utils.ts           # General utilities
├── public/                # Static assets
│   ├── fonts/             # Orbitron font files
│   └── icons/             # App icons
├── docs/                  # Documentation
├── .env.example           # Environment template
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS config
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

## 🔧 Development Commands

### Core Commands
```bash
# Development server
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Code Quality
npm run format       # Format code with Prettier
npm run lint:fix     # Fix linting issues automatically
```

### Custom Scripts
```bash
# Development utilities
npm run clean        # Clean build artifacts
npm run analyze      # Analyze bundle size
npm run deploy       # Deploy to Vercel
npm run docs:dev     # Start documentation server
```

## 🎨 Styling & Design System

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'cosmic-blue': '#0B1426',
        'stellar-purple': '#6B46C1',
        'nebula-pink': '#EC4899',
        'cosmic-cyan': '#06B6D4',
        'star-white': '#F8FAFC',
        'plasma-green': '#10B981',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
      },
      animation: {
        'cosmic-drift': 'cosmic-drift 20s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'orbit': 'orbit 10s linear infinite',
        'stellar-pulse': 'stellar-pulse 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
```

### Component Development
```typescript
// Example component structure
import React from 'react';
import { motion } from 'framer-motion';

interface ComponentProps {
  // Define props with TypeScript
}

export const ExampleComponent: React.FC<ComponentProps> = ({ ...props }) => {
  return (
    <motion.div
      className="cosmic-component"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Component content */}
    </motion.div>
  );
};
```

## 🔗 Blockchain Development

### Solana Setup
```bash
# Install Solana CLI (optional)
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"

# Configure for development
solana config set --url devnet
solana config set --keypair ~/.config/solana/id.json

# Create test wallet
solana-keygen new --outfile ~/.config/solana/test-wallet.json
```

### Web3 Development Patterns
```typescript
// Connection management
import { Connection, PublicKey } from '@solana/web3.js';

const useConnection = () => {
  const connection = useMemo(
    () => new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT!, 'confirmed'),
    []
  );
  
  return connection;
};

// Wallet integration
import { useWallet } from '@solana/wallet-adapter-react';

const useWalletConnection = () => {
  const { publicKey, connected, sendTransaction } = useWallet();
  const connection = useConnection();
  
  return {
    publicKey,
    connected,
    sendTransaction: (transaction: Transaction) => 
      sendTransaction(transaction, connection)
  };
};
```

## 🧪 Testing Strategy

### Unit Testing
```typescript
// components/__tests__/ExampleComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { ExampleComponent } from '../ExampleComponent';

describe('ExampleComponent', () => {
  it('renders correctly', () => {
    render(<ExampleComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Integration Testing
```typescript
// lib/__tests__/solana.test.ts
import { Connection } from '@solana/web3.js';
import { getTokenAccounts } from '../solana';

describe('Solana Integration', () => {
  it('fetches token accounts', async () => {
    const connection = new Connection('https://api.devnet.solana.com');
    const publicKey = new PublicKey('test-address');
    
    const accounts = await getTokenAccounts(connection, publicKey);
    expect(Array.isArray(accounts)).toBe(true);
  });
});
```

### Test Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,ts,jsx,tsx}',
    'components/**/*.{js,ts,jsx,tsx}',
    'lib/**/*.{js,ts,jsx,tsx}',
  ],
};
```

## 🚀 Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables Setup
```bash
# Set environment variables in Vercel
vercel env add NEXT_PUBLIC_HELIUS_API_KEY
vercel env add NEXT_PUBLIC_RPC_ENDPOINT

# Pull environment variables locally
vercel env pull .env.local
```

### Build Configuration
```javascript
// next.config.js
module.exports = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['raw.githubusercontent.com', 'arweave.net'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};
```

## 🔍 Debugging

### Development Tools
```typescript
// Debug utilities
const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Transaction debugging
const debugTransaction = async (signature: string) => {
  const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT!);
  const transaction = await connection.getTransaction(signature);
  
  console.log('Transaction Debug:', {
    signature,
    slot: transaction?.slot,
    blockTime: transaction?.blockTime,
    fee: transaction?.meta?.fee,
    status: transaction?.meta?.err ? 'Failed' : 'Success',
    logs: transaction?.meta?.logMessages,
  });
};
```

### Browser DevTools
```typescript
// Add to global scope for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugUtils = {
    debugTransaction,
    connection: new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT!),
    PublicKey,
  };
}
```

## 📝 Code Style Guidelines

### TypeScript Best Practices
```typescript
// Use strict typing
interface StrictInterface {
  required: string;
  optional?: number;
  readonly constant: boolean;
}

// Prefer type over interface for unions
type Status = 'loading' | 'success' | 'error';

// Use generic constraints
function processData<T extends { id: string }>(data: T[]): T[] {
  return data.filter(item => item.id.length > 0);
}
```

### React Patterns
```typescript
// Use functional components with hooks
const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<StateType>(initialState);
  
  const memoizedValue = useMemo(() => {
    return expensiveCalculation(prop1);
  }, [prop1]);
  
  const handleCallback = useCallback((value: string) => {
    setState(prev => ({ ...prev, value }));
  }, []);
  
  return <div>{/* JSX */}</div>;
};
```

### Styling Guidelines
```typescript
// Use CSS modules or Tailwind classes
const styles = {
  container: 'min-h-screen bg-cosmic-blue text-star-white',
  button: 'px-4 py-2 bg-stellar-purple hover:bg-nebula-pink transition-colors',
  text: 'font-orbitron text-lg font-medium',
};
```

## 🤝 Contributing Guidelines

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Message Format
```
type(scope): description

feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructure
test: add tests
chore: maintenance tasks
```

### Pull Request Process
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request
6. **Address** review feedback

## 🔧 Troubleshooting

### Common Issues

#### Node Modules Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

#### TypeScript Errors
```bash
# Run type checking
npm run type-check

# Common fixes
# - Update @types packages
# - Check tsconfig.json configuration
# - Verify import paths
```

#### Wallet Connection Issues
```typescript
// Debug wallet connection
const debugWallet = () => {
  console.log('Wallet state:', {
    connected: wallet.connected,
    publicKey: wallet.publicKey?.toString(),
    adapter: wallet.wallet?.adapter.name,
  });
};
```

### Performance Optimization
```typescript
// Optimize component rendering
const OptimizedComponent = React.memo(({ data }) => {
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>;
});

// Optimize API calls
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Web3.js Guide](https://solana-labs.github.io/solana-web3.js/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion API](https://www.framer.com/motion/)

### Community
- [Solana Discord](https://discord.gg/solana)
- [Next.js Discord](https://discord.gg/nextjs)
- [Project GitHub](https://github.com/stellar-incinerator)

---

*Start building the future of token burning at [Stellar Incinerator](https://solanatokensincinerator-evd2ucu25-devais-projects-c74be0cf.vercel.app)!* 
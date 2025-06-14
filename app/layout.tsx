import { Orbitron } from 'next/font/google'
import './globals.css'
import { WalletContextProvider } from './providers'
import '@solana/wallet-adapter-react-ui/styles.css'

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={orbitron.className}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  )
} 
import { Inter } from 'next/font/google';
import ClientSessionProvider from '@/components/ClientSessionProvider';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'API Vault - Secure Key Management',
  description: 'Professional API key management with enterprise-grade security',
  keywords: 'api keys, security, encryption, key management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientSessionProvider>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}

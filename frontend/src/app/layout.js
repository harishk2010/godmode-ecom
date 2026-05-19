import { Syne } from 'next/font/google';
import { DM_Sans } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-clash',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
});

export const metadata = {
  title: { default: 'GOD MODE — Premium E-Commerce', template: '%s | GOD MODE' },
  description: 'Experience next-level shopping with GOD MODE. Curated products, unmatched quality.',
  keywords: ['ecommerce', 'shopping', 'godmode', 'premium', 'online store'],
  openGraph: {
    title: 'GOD MODE — Premium E-Commerce',
    description: 'Experience next-level shopping',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="grain">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e1e2a',
              color: '#f8f8ff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontFamily: 'var(--font-clash)',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}

import './globals.css';

export const metadata = {
  title: 'MediBurgh Billing Platform',
  description:
    'Quote with confidence. Bill with clarity. A Next.js + Firebase foundation for medical quoting and billing.',
  openGraph: {
    title: 'MediBurgh Billing Platform',
    description:
      'Quote with confidence. Bill with clarity. A Next.js + Firebase foundation for medical quoting and billing.',
    type: 'website',
    siteName: 'MediBurgh',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediBurgh Billing Platform',
    description:
      'Quote with confidence. Bill with clarity. A Next.js + Firebase foundation for medical quoting and billing.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="hero">
          <div className="hero__emblem" aria-hidden>
            <span className="hero__glyph" />
          </div>
          <div>
            <h1>MediBurgh</h1>
            <p className="tagline">Quote with confidence. Bill with clarity.</p>
          </div>
        </header>
        <main>{children}</main>
        <footer>
          <small>&copy; {new Date().getFullYear()} MediBurgh Labs. All rights reserved.</small>
        </footer>
      </body>
    </html>
  );
}

import './globals.css';
import Script from 'next/script';
import { Rubik, Vazirmatn } from 'next/font/google';

const rubik = Rubik({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '700'] });
const vazirmatn = Vazirmatn({ subsets: ['arabic', 'latin'], weight: ['400', '500'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const shouldLoadFigmaCapture =
    process.env.NEXT_PUBLIC_ENABLE_FIGMA_CAPTURE === 'true';

  return (
    <html lang="ru">
      <body className={`${rubik.className} ${vazirmatn.className}`}>
        {shouldLoadFigmaCapture ? (
          <Script
            src="https://mcp.figma.com/mcp/html-to-design/capture.js"
            strategy="afterInteractive"
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
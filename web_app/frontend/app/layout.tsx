import './globals.css';
import { Rubik } from 'next/font/google';

const rubik = Rubik({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '700'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={rubik.className}>{children}</body>
    </html>
  );
}

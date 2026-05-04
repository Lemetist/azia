import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Primal Training',
  description:
    'Фитнес-платформа с onboarding, расписанием, тренировками и аналитикой прогресса.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const shouldLoadFigmaCapture =
    process.env.NEXT_PUBLIC_ENABLE_FIGMA_CAPTURE === 'true';

  return (
    <html lang="ru">
      <body>
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

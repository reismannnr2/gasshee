import type { Metadata } from 'next';
import './global.scss';
export const metadata: Metadata = {
  title: 'Gasshee - GAS based Character Sheet Editor',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/ress@4.0.0/dist/ress.min.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}

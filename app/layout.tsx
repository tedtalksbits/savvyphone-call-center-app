import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Savvy Phone Companion',
  description: 'A web companion app for Savvy Phone',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}

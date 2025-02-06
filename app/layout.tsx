import type { Metadata } from 'next';
import './globals.css';
import ReactQueryProvider from '@/providers/react-query-provider';
import { ThemeProvider } from 'next-themes';

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
      <body>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ExploreNesia CMS',
  description: 'Admin CMS untuk ExploreNesia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}



import type { Metadata } from 'next';
import './globals.css';
import { GlobalNavbar } from '@/components/layout/GlobalNavbar';
import { GlobalFooter } from '@/components/layout/GlobalFooter';

export const metadata: Metadata = {
  title: 'HELIX — 3D Print Studio',
  description: 'Where ideas take shape. Professional FDM 3D printing services — fast, affordable, pan-India delivery.',
  keywords: ['3D printing', 'HELIX', 'FDM', 'CAD files', 'prototyping', '3D print studio', 'Ahmedabad'],
  openGraph: {
    title: 'HELIX 3D Studio',
    description: 'Where ideas take shape.',
    siteName: 'HELIX',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: '#0A0A0F', color: '#F5F0E8' }}>
        <GlobalNavbar />
        <main className="flex-grow">{children}</main>
        <GlobalFooter />
      </body>
    </html>
  );
}

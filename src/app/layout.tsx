import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HELIX — 3D Print Studio',
  description: 'Where ideas take shape. Professional 3D printing services — FDM, SLA, SLS, DMLS and more.',
  keywords: ['3D printing', 'HELIX', 'FDM', 'SLA', 'SLS', 'DMLS', 'CAD files', 'prototyping', '3D print studio'],
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
      <body className="min-h-screen" style={{ backgroundColor: '#0A0A0F', color: '#F5F0E8' }}>
        {children}
      </body>
    </html>
  );
}

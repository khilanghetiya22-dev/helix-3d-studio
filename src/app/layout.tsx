import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FORMIQ — 3D Print Studio',
  description: 'Layer by layer. Smarter by design. Professional 3D printing services — FDM, SLA, SLS, DMLS and more.',
  keywords: ['3D printing', 'FORMIQ', 'FDM', 'SLA', 'SLS', 'DMLS', 'CAD files', 'prototyping', '3D print studio'],
  openGraph: {
    title: 'FORMIQ 3D Print Studio',
    description: 'Layer by layer. Smarter by design.',
    siteName: 'FORMIQ',
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
      <body className="min-h-screen" style={{ backgroundColor: '#1A1A1A', color: '#F5F4F0' }}>
        {children}
      </body>
    </html>
  );
}

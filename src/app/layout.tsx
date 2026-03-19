import type { Metadata } from 'next';
import { Geist, Geist_Mono, Figtree } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/navbar';
import ThemeProvider from '@/components/theme-provider';
import BackToTop from '@/components/back-to-top';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        default: 'Streaming Tracker',
        template: '%s | Streaming Tracker',
    },
    description:
        'Find where to watch your favorite movies and shows across Netflix, Hulu, Disney+, Max, and more.',
    keywords: [
        'streaming',
        'movies',
        'tv shows',
        'netflix',
        'hulu',
        'disney',
        'watchlist',
    ],
    icons: {
        icon: '/favicon.svg',
    },
    openGraph: {
        title: 'Streaming Tracker',
        description: 'Find where to watch your favorite movies and shows.',
        type: 'website',
        url: 'https://streamingtracker.vercel.app',
        images: [
            {
                url: '../og-image.png',
                width: 1200,
                height: 630,
                alt: 'Streaming Tracker',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Streaming Tracker',
        description: 'Find where to watch your favorite movies and shows.',
        images: ['../og-image'],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang='en'
            className={cn('font-sans', figtree.variable)}
            suppressHydrationWarning //React will throw hydration warning b/c server doesnt know user's theme pref but client does
        >
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider>
                    <Navbar />
                    {children}
                    <BackToTop />
                </ThemeProvider>
            </body>
        </html>
    );
}

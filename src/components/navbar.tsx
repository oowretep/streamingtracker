'use client';

import Link from 'next/link';
import { useSession, signOut, signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ThemeToggle = dynamic(() => import('@/components/theme-toggle'), {
    ssr: false,
    loading: () => <div className='w-9 h-9 cursor-pointer' />,
});

const HamburgerIcon = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <line x1='4' y1='6' x2='20' y2='6' />
        <line x1='4' y1='12' x2='20' y2='12' />
        <line x1='4' y1='18' x2='20' y2='18' />
    </svg>
);

const SearchIcon = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='14'
        height='14'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <circle cx='11' cy='11' r='8' />
        <line x1='21' y1='21' x2='16.65' y2='16.65' />
    </svg>
);

const Navbar = () => {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    const close = () => setOpen(false);
    const isDark =
        typeof window !== 'undefined' &&
        document.documentElement.classList.contains('dark');

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setQuery('');
        }
    };

    return (
        <nav className='border-b border-border bg-background/60 backdrop-blur-lg sticky top-0 z-50 relative'>
            <div className='max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4'>
                <Link href='/' className='font-medium text-lg shrink-0'>
                    Streaming Tracker
                </Link>

                {/* Search input */}
                <div className='hidden sm:flex flex-1 max-w-xs relative items-center'>
                    <span className='absolute left-3 text-muted-foreground'>
                        <SearchIcon />
                    </span>
                    <input
                        type='text'
                        placeholder='Search...'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className='w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-border bg-background/60 outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-100 dark:focus:border-blue-700 dark:focus:ring-blue-950 placeholder:text-muted-foreground transition-all'
                    />
                </div>

                {/* Desktop nav */}
                <div className='hidden sm:flex items-center gap-4 shrink-0'>
                    <ThemeToggle />
                    {session ? (
                        <>
                            <Link
                                href='/releases'
                                className='text-sm text-muted-foreground hover:text-foreground'
                            >
                                New & Upcoming
                            </Link>
                            <Link
                                href='/watchlist'
                                className='text-sm text-muted-foreground hover:text-foreground'
                            >
                                My Lists
                            </Link>
                            <Link
                                href='/profile'
                                className='text-sm text-muted-foreground hover:text-foreground'
                            >
                                {session.user.name}
                            </Link>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => signOut()}
                            >
                                Sign out
                            </Button>
                        </>
                    ) : (
                        <Button
                            size='sm'
                            onClick={() =>
                                signIn.social({
                                    provider: 'google',
                                    callbackURL: '/',
                                })
                            }
                        >
                            Sign in
                        </Button>
                    )}
                </div>

                {/* Mobile nav */}
                <div className='flex sm:hidden items-center gap-2'>
                    <ThemeToggle />
                    <Button
                        variant='outline'
                        size='sm'
                        className='w-9 h-9 p-0'
                        onClick={() => setOpen(!open)}
                    >
                        <HamburgerIcon />
                    </Button>
                </div>
            </div>

            {/* Mobile search + menu */}
            <div
                className={`sm:hidden absolute top-14 right-0 left-0 border-b border-border z-50 px-4 py-6 flex flex-col gap-4 transition-all duration-200 ${
                    open
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
                style={{
                    backgroundColor: isDark
                        ? 'oklch(0.145 0 0)'
                        : 'oklch(1 0 0)',
                }}
            >
                {/* Mobile search */}
                <div className='relative flex items-center'>
                    <span className='absolute left-3 text-muted-foreground'>
                        <SearchIcon />
                    </span>
                    <input
                        type='text'
                        placeholder='Search...'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && query.trim()) {
                                router.push(
                                    `/search?q=${encodeURIComponent(query.trim())}`,
                                );
                                setQuery('');
                                close();
                            }
                        }}
                        className='w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-border bg-background outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-100 placeholder:text-muted-foreground transition-all'
                    />
                </div>

                {session ? (
                    <>
                        <div className='pb-4 border-b border-border'>
                            <p className='font-medium'>{session.user.name}</p>
                            <p className='text-sm text-muted-foreground'>
                                {session.user.email}
                            </p>
                        </div>
                        <Link
                            href='/releases'
                            className='text-sm hover:text-muted-foreground transition-colors'
                            onClick={close}
                        >
                            New & Upcoming
                        </Link>
                        <Link
                            href='/watchlist'
                            className='text-sm hover:text-muted-foreground transition-colors'
                            onClick={close}
                        >
                            My Lists
                        </Link>
                        <Link
                            href='/profile'
                            className='text-sm hover:text-muted-foreground transition-colors'
                            onClick={close}
                        >
                            Profile
                        </Link>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                                signOut();
                                close();
                            }}
                        >
                            Sign out
                        </Button>
                    </>
                ) : (
                    <Button
                        size='sm'
                        onClick={() => {
                            signIn.social({
                                provider: 'google',
                                callbackURL: '/',
                            });
                            close();
                        }}
                    >
                        Sign in
                    </Button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

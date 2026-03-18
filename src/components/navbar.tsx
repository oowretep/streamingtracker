'use client';

import Link from 'next/link';
import { useSession, signOut, signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ThemeToggle = dynamic(() => import('@/components/theme-toggle'), {
    ssr: false,
    loading: () => <div className='w-9 h-9' />,
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

const Navbar = () => {
    const isDark =
        typeof window !== 'undefined' &&
        document.documentElement.classList.contains('dark');
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);

    const close = () => setOpen(false);

    return (
        <nav className='border-b border-border bg-background/60 backdrop-blur-lg sticky top-0 z-50 relative'>
            <div className='max-w-3xl mx-auto px-4 h-14 flex items-center justify-between'>
                <Link href='/' className='font-medium text-lg'>
                    Streaming Tracker
                </Link>

                {/* Desktop nav */}
                <div className='hidden sm:flex items-center gap-4'>
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
                                className='hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors'
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
                            className='hover:bg-green-50 hover:text-green-600 hover:border-green-300 dark:hover:bg-green-950 dark:hover:text-green-400 transition-colors'
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

                {/* Mobile menu dropdown */}
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
                    {session ? (
                        <>
                            <div className='pb-4 border-b border-border'>
                                <p className='font-medium'>
                                    {session.user.name}
                                </p>
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
                                className='hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors'
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
                            className='hover:bg-green-50 hover:text-green-600 hover:border-green-300 dark:hover:bg-green-950 dark:hover:text-green-400 transition-colors'
                        >
                            Sign in
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

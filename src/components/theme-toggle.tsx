'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

const SunIcon = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <circle cx='12' cy='12' r='4' />
        <line x1='12' y1='2' x2='12' y2='6' />
        <line x1='12' y1='18' x2='12' y2='22' />
        <line x1='2' y1='12' x2='6' y2='12' />
        <line x1='18' y1='12' x2='22' y2='12' />
        <line x1='4.93' y1='4.93' x2='7.76' y2='7.76' />
        <line x1='16.24' y1='16.24' x2='19.07' y2='19.07' />
        <line x1='4.93' y1='19.07' x2='7.76' y2='16.24' />
        <line x1='16.24' y1='7.76' x2='19.07' y2='4.93' />
    </svg>
);

const MoonIcon = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
    </svg>
);

const ThemeToggle = () => {
    const { resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const toggle = () => {
        setTimeout(() => {
            setTheme(isDark ? 'light' : 'dark');
        }, 150);
    };

    return (
        <Button
            variant='outline'
            size='sm'
            className='w-9 h-9 p-0 overflow-hidden cursor-pointer'
            onClick={toggle}
            aria-label='Toggle theme'
        >
            <span
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 150ms ease, opacity 150ms ease',
                }}
            >
                {isDark ? <MoonIcon /> : <SunIcon />}
            </span>
        </Button>
    );
};

export default ThemeToggle;

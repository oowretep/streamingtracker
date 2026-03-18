'use client';

import { useState, useEffect } from 'react';

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='cursor-pointer fixed bottom-6 right-6 w-10 h-10 rounded-full border border-border bg-background hover:bg-accent transition-all shadow-sm flex items-center justify-center'
            aria-label='Back to top'
        >
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
                <path d='M18 15l-6-6-6 6' />
            </svg>
        </button>
    );
};

export default BackToTop;

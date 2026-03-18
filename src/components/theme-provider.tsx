'use client';

import { ThemeProvider as NextTheseProvider } from 'next-themes';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <NextTheseProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextTheseProvider>
    );
};

export default ThemeProvider;

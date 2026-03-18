'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (!query.trim()) return;
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className='flex gap-2'>
            <Input
                placeholder='Search for a movie or show'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Button
                onClick={handleSearch}
                className='cursor-pointer flex-1 px-4 py-2 rounded-md border border-border bg-background text-foreground text-sm outline-none transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:focus:border-blue-700 dark:focus:ring-blue-950 placeholder:text-muted-foreground hover:text-white dark:hover:text-blue-950 dark:hover:bg-white'
            >
                Search
            </Button>
        </div>
    );
};

export default SearchBar;

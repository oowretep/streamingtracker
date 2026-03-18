import Link from 'next/link';
import SaveSearch from '@/components/save-search';
import SearchResults from '@/components/search-results';

interface TitleResult {
    id: number;
    name: string;
    type: string;
    year: number;
    poster: string | null;
}

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
    const { q: query } = await searchParams;

    if (!query) {
        return (
            <main className='max-w-3xl mx-auto px-4 py-12'>
                <p className='text-muted-foreground'>
                    No search query provided.
                </p>
            </main>
        );
    }

    const res = await fetch(
        `${process.env.BETTER_AUTH_URL}/api/search?q=${encodeURIComponent(query)}`,
        { cache: 'no-store' },
    );

    const data = await res.json();
    const results: TitleResult[] = data.title_results ?? [];

    return (
        <main className='max-w-3xl mx-auto px-4 py-8 sm:py-12'>
            <Link
                href='/'
                className='text-sm text-muted-foreground hover:text-foreground mb-6 inline-block'
            >
                ← Back to search
            </Link>
            <h2 className='text-2xl font-medium mb-6'>
                Results for &quot;{query}&quot;
            </h2>
            <SaveSearch query={query} hasResults={results.length > 0} />
            <SearchResults results={results} query={query} />
        </main>
    );
};

export async function generateMetadata({ searchParams }: SearchPageProps) {
    const { q: query } = await searchParams;
    return {
        title: query ? `Results for "${query}"` : 'Search',
    };
}

export default SearchPage;

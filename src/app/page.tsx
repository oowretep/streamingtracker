import SearchBar from '@/components/search-bar';
import RecentSearches from '@/components/recent-searches';
import HomepageReleases from '@/components/homepage-releases';

const Home = () => {
    return (
        <div>
            <div
                className='py-16 px-4'
                style={{ background: 'var(--accent-gradient)' }}
            >
                <div className='max-w-3xl mx-auto'>
                    <h1 className='text-4xl font-medium mb-3 tracking-tight'>
                        Find where to watch
                    </h1>
                    <p className='text-muted-foreground mb-8 text-lg'>
                        Search across Netflix, Hulu, Disney+, Max, and more.
                    </p>
                    <SearchBar />
                    <RecentSearches />
                </div>
            </div>
            <div className='max-w-3xl mx-auto px-4 py-10'>
                <HomepageReleases />
            </div>
        </div>
    );
};

export default Home;

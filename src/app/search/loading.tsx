import { Skeleton } from '@/components/ui/skeleton';

const SearchLoading = () => {
    return (
        <main className='max-w-3xl mx-auto px-4 py-12'>
            <Skeleton className='h-8 w-48 mb-6' />

            <div className='flex flex-col gap-3'>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className='p-4 rounded-lg border border-border flex items-center justify-between'
                    >
                        <div className='flex flex-col gap-2'>
                            <Skeleton className='h-4 w-48' />
                            <Skeleton className='h-3 w-24' />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default SearchLoading;

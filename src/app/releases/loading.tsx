import { Skeleton } from '@/components/ui/skeleton';

const ReleasesLoading = () => {
    return (
        <main className='max-w-3xl mx-auto px-4 py-12'>
            <Skeleton className='h-4 w-24 mb-6' />
            <Skeleton className='h-8 w-48 mb-2' />
            <Skeleton className='h-4 w-64 mb-8' />

            <div className='flex gap-2 mb-3'>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className='h-7 w-20 rounded-full' />
                ))}
            </div>

            <div className='flex gap-2 mb-8'>
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className='h-7 w-16 rounded-full' />
                ))}
            </div>

            <Skeleton className='h-6 w-36 mb-4' />

            <div className='flex flex-col gap-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className='flex items-center gap-4 p-3 rounded-lg border border-border'
                    >
                        <Skeleton className='w-12 h-16 rounded shrink-0' />
                        <div className='flex-1 flex flex-col gap-2'>
                            <Skeleton className='h-4 w-40' />
                            <Skeleton className='h-3 w-28' />
                        </div>
                        <Skeleton className='h-6 w-16 rounded-full' />
                    </div>
                ))}
            </div>
        </main>
    );
};

export default ReleasesLoading;

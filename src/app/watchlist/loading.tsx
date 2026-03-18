import { Skeleton } from '@/components/ui/skeleton';

const WatchlistLoading = () => {
    return (
        <main className='max-w-3xl mx-auto px-4 py-12'>
            <Skeleton className='h-4 w-24 mb-6' />
            <Skeleton className='h-8 w-32 mb-8' />
            <Skeleton className='h-6 w-24 mb-4' />
            <div className='flex flex-col gap-3 mb-12'>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className='flex items-center gap-4 p-3 rounded-lg border border-border'
                    >
                        <Skeleton className='w-12 h-16 rounded shrink-0' />
                        <div className='flex-1 flex flex-col gap-2'>
                            <Skeleton className='h-4 w-40' />
                            <Skeleton className='h-3 w-24' />
                        </div>
                        <div className='flex gap-2'>
                            <Skeleton className='h-8 w-24 rounded-full' />
                            <Skeleton className='h-8 w-16' />
                        </div>
                    </div>
                ))}
            </div>
            <Skeleton className='h-6 w-24 mb-4' />
            <div className='flex flex-col gap-3'>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className='flex items-center gap-4 p-3 rounded-lg border border-border'
                    >
                        <Skeleton className='w-12 h-16 rounded shrink-0' />
                        <div className='flex-1 flex flex-col gap-2'>
                            <Skeleton className='h-4 w-40' />
                            <Skeleton className='h-3 w-24' />
                        </div>
                        <div className='flex gap-2'>
                            <Skeleton className='h-8 w-24 rounded-full' />
                            <Skeleton className='h-8 w-16' />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default WatchlistLoading;

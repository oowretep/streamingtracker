import { Skeleton } from '@/components/ui/skeleton';

const TitleLoading = () => {
    return (
        <main className='max-w-3xl mx-auto px-4 py-12'>
            <Skeleton className='h-4 w-24 mb-6' />
            <div className='flex gap-6 mb-6'>
                <Skeleton className='w-32 h-48 rounded-lg shrink-0' />
                <div className='flex flex-col gap-3 flex-1'>
                    <Skeleton className='h-8 w-64' />
                    <Skeleton className='h-4 w-32' />
                    <div className='flex gap-2'>
                        <Skeleton className='h-6 w-16 rounded-full' />
                        <Skeleton className='h-6 w-16 rounded-full' />
                        <Skeleton className='h-6 w-16 rounded-full' />
                    </div>
                    <Skeleton className='h-4 w-40' />
                    <div className='flex gap-2'>
                        <Skeleton className='h-9 w-28' />
                        <Skeleton className='h-9 w-28' />
                    </div>
                </div>
            </div>
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-3/4 mb-8' />
            <Skeleton className='h-6 w-36 mb-4' />
            <div className='flex flex-wrap gap-2'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className='h-10 w-24 rounded-full' />
                ))}
            </div>
        </main>
    );
};

export default TitleLoading;

import { Skeleton } from '@/components/ui/skeleton';

const ProfileLoading = () => {
    return (
        <main className='max-w-3xl mx-auto px-4 py-12'>
            <div className='flex items-center gap-4 mb-10'>
                <Skeleton className='w-16 h-16 rounded-full' />
                <div className='flex flex-col gap-2'>
                    <Skeleton className='h-6 w-40' />
                    <Skeleton className='h-4 w-56' />
                </div>
            </div>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className='border border-border rounded-lg p-4 text-center'
                    >
                        <Skeleton className='h-9 w-12 mx-auto mb-2' />
                        <Skeleton className='h-3 w-16 mx-auto' />
                    </div>
                ))}
            </div>
        </main>
    );
};

export default ProfileLoading;

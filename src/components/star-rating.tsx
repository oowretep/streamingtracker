const StarRating = ({ rating }: { rating: number }) => {
    const total = 10;
    const rounded = Math.round(rating * 2) / 2; // rounds to nearest 0.5

    return (
        <div className='flex items-center gap-1'>
            {Array.from({ length: total }).map((_, i) => {
                const filled = rounded >= i + 1;
                const half = !filled && rounded >= i + 0.5;

                return (
                    <svg key={i} className='w-4 h-4' viewBox='0 0 20 20'>
                        {/* Empty star background */}
                        <path
                            d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'
                            className='fill-muted-foreground/30'
                        />
                        {/* Filled overlay — full or half width */}
                        {(filled || half) && (
                            <path
                                d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'
                                fill='rgb(251 191 36)'
                                clipPath={half ? `inset(0 50% 0 0)` : undefined}
                            />
                        )}
                    </svg>
                );
            })}
            <span className='text-sm text-muted-foreground ml-1'>
                {rating}/10
            </span>
        </div>
    );
};

export default StarRating;

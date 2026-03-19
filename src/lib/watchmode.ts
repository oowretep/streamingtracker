const BASE_URL = 'https://api.watchmode.com/v1';
const API_KEY = process.env.WATCHMODE_API_KEY;

export const GENRES: Record<number, string> = {
    1: 'Action',
    2: 'Adventure',
    3: 'Animation',
    4: 'Comedy',
    5: 'Crime',
    6: 'Documentary',
    7: 'Drama',
    8: 'Fantasy',
    9: 'History',
    10: 'Horror',
    11: 'Music',
    12: 'Mystery',
    13: 'News',
    14: 'Reality',
    15: 'Sci-Fi',
    16: 'Sport',
    17: 'Thriller',
    18: 'Western',
    19: 'Romance',
    20: 'Family',
    21: 'Talk Show',
    22: 'War',
};

export const STREAMING_PLATFORMS = [
    { id: 203, name: 'Netflix' },
    { id: 157, name: 'Hulu' },
    { id: 372, name: 'Disney+' },
    { id: 387, name: 'Max' },
    { id: 26, name: 'Prime Video' },
    { id: 371, name: 'AppleTV+' },
    { id: 389, name: 'Peacock' },
    { id: 444, name: 'Paramount+' },
];

export const formatType = (type: string): string => {
    return type
        .split('_')
        .map((word) => {
            if (word.toLowerCase() === 'tv') return 'TV';
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};

export const getTypeBadgeClass = (type: string): string => {
    if (type.includes('movie') || type === 'short_film') {
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
    }
    if (type === 'tv_series') {
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
    }
    return 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800';
};

const getDateDaysAgo = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0].replace(/-/g, '');
};
const getDateDaysAhead = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0].replace(/-/g, '');
};

const watchmode = {
    search: async (query: string) => {
        const res = await fetch(
            `${BASE_URL}/search/?apiKey=${API_KEY}&search_field=name&search_value=${query}`,
        );

        if (!res.ok) throw new Error('Failed to fetch from Watchmode');
        return res.json();
    },

    getTitle: async (id: string) => {
        const res = await fetch(
            `${BASE_URL}/title/${id}/details/?apiKey=${API_KEY}`,
        );

        if (!res.ok) throw new Error('Failed to fetch title details');
        return res.json();
    },

    getSources: async (id: string) => {
        const res = await fetch(
            `${BASE_URL}/title/${id}/sources/?apiKey=${API_KEY}`,
        );

        if (!res.ok) throw new Error('Failed to fetch streaming sources');
        return res.json();
    },

    getReleases: async (sourceIds: string) => {
        const res = await fetch(
            `${BASE_URL}/releases/?apiKey=${API_KEY}&source_ids=${sourceIds}&release_date_start=${getDateDaysAgo(30)}&release_date_end=${getDateDaysAhead(30)}&limit=20`,
            { next: { revalidate: 86400 } },
        );

        if (!res.ok) throw new Error('Failed to fetch release');
        return res.json();
    },
};

export default watchmode;

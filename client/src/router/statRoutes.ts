export interface show {
    city: string;
    num_songs: number;
    setlist: string[];
};

export async function get_setlists(date: string): Promise<show> {
    const ref = await fetch(`https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=f58384a4-2ad2-4f24-89c5-c7b74ae1cce7&date=${date}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY
        }
    });
    if (!ref.ok) {
        throw new Error(`HTTP error! status: ${ref.status}`);
    };
    return ref.json().then((data) => {
        return {
            city: data.setlist[0].venue.city.name,
            num_songs: data.setlist[0].sets.set[0].song.length,
            setlist: data.setlist[0].sets.set[0].song.map((song: any) => song.name)
        };
    });
};
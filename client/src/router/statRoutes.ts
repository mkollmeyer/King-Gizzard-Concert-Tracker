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

export async function create_user_setlists(id: string): Promise<show> {
    const ref = await fetch(`http://localhost:3000/api/set/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    });
    if (!ref.ok) {
        throw new Error(`HTTP error! status: ${ref.status}`);
    }
    const user = await ref.json();
    return user.data;
}

export async function get_user_setlists(id: string): Promise<show> {
    const ref = await fetch(`http://localhost:3000/api/set/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    });
    if (!ref.ok) {
        throw new Error(`HTTP error! status: ${ref.status}`);
    }
    return ref.json().then((data) => {
        return {
            city: data.setlist[0].venue.city.name,
            num_songs: data.setlist[0].sets.set[0].song.length,
            setlist: data.setlist[0].sets.set[0].song.map((song: any) => song.name)
        };
    });
}

export async function update_user_setlists(id: string, city: string, num_songs: number, setlist: string[]): Promise<void> {
    const ref = await fetch(`http://localhost:3000/api/set/${id}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ city, num_songs, setlist })
    });
    if (!ref.ok) {
        throw new Error(`HTTP error! status: ${ref.status}`);
    };
}
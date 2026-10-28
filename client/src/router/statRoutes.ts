export interface show {
    city: Record<string, number>;
    num_songs: number;
    setlist: Record<string, number>;
};

export interface newshow {
    city: string;
    num_songs: number;
    setlist: string[];
};

export async function get_setlists(date: string): Promise<newshow> {
    const ref = await fetch(`http://localhost:3000/api/set/api/${date}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    });
    if (!ref.ok) {
        throw new Error(`HTTP error! status: ${ref.status}`);
    };
    const res = await ref.json();
    const data = res.data;
    return {
        city: data.city,
        num_songs: data.num_songs,
        setlist: data.setlist
    };
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
    const res = await ref.json();
    const data = res.data;
    let city: Record<string, number>;
    let num_songs: number;
    let setList: Record<string, number>;
    city = data.cities;
    setList = data.songs;
    num_songs = data.numofSongs;
    console.log(city);
    console.log(num_songs);
    console.log(setList);
    return {
        city: city,
        num_songs: num_songs,
        setlist: setList
    };
};

export async function update_user_setlists(id: string, city: Record<string, number>, num_songs: number, setlist: Record<string, number>): Promise<void> {
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
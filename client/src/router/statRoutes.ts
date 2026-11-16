export interface show {
    city: Record<string, number>;
    date: string[];
    num_songs: number;
    setlist: Record<string, number>;
};

export interface newshow {
    city: string;
    date: string;
    num_songs: number;
    setlist: string[];
};

export async function get_setlists(date: string): Promise<newshow> {
    const ref = await fetch(`/api/setlists/get_setlist/${date}`, {
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
        date: data.date,
        city: data.city,
        num_songs: data.num_songs,
        setlist: data.setlist
    };
};

export async function create_user_setlists(token: string): Promise<show> {
    const ref = await fetch('/api/setlists/create_setlist', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!ref.ok) {
        throw new Error(`HTTP error! status: ${ref.status}`);
    }
    const user = await ref.json();
    return user.data;
}

export async function get_user_setlists(token: string): Promise<show> {
    const ref = await fetch('/api/setlists/me', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
    if (!ref.ok) {
        throw new Error(`HTTP error! status: ${ref.status}`);
    }
    const res = await ref.json();
    const data = res.data;
    return {
        date: data.dates ?? [],
        city: data.cities ?? {},
        num_songs: data.num_songs ?? 0,
        setlist: data.songs ?? {}
    };
};

export async function update_user_setlists(token: string, city: Record<string, number>, dates: string[], num_songs: number, setlist: Record<string, number>): Promise<void> {
    const ref = await fetch('/api/setlists/me', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ city, dates, num_songs, songs: setlist })
    });
    if (!ref.ok) {
        throw new Error(`HTTP error! status: ${ref.status}`);
    };
}
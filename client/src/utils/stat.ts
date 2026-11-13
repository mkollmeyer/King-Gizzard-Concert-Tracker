import { type show } from "../router/statRoutes"

export function update_show(show: show, newcity: string, newdate: string, newSongs: number, newSetlist: string[] ) {
    const city = show.city;
    const setlist = show.setlist;
    city[newcity] = (city[newcity] ?? 0) + 1;
    const num_songs = show.num_songs + newSongs;
    for (let i = 0; i < newSetlist.length; i++) {
        setlist[newSetlist[i]] = (setlist[newSetlist[i]] ?? 0) + 1;
    };
    const date = [...show.date, newdate];
    return {
        city: city,
        date: date,
        num_songs: num_songs,
        setlist: setlist
    };
}
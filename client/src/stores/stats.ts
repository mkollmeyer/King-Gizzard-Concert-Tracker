import { get_user_setlists, get_setlists, update_user_setlists, type show } from '../router/statRoutes.ts'
import { update_show } from '../utils/stat.ts';
import { defineStore } from 'pinia'

type StatsState = {
    city: Record<string, number>;
    num_songs: number;
    setlist: Record<string, number>;
}

export const useStatsStore = defineStore('stats', {
  state: (): StatsState => ({
    city: {},
    num_songs: 0,
    setlist: {},
  }),
  actions: {
    async updateStats(id: string | null, date: string) {
      let shows;
      if (id != null) {
        try {
          shows = await get_setlists(date);
        } catch (error: unknown) {
          console.error("Error fetching setlists:", error);
          throw new Error('Unable to find setlist for that show');
        }
        const userShow = await get_user_setlists(id);
        console.log(userShow);
        if (userShow.date?.includes(shows.date)) {
          throw new Error("Show already added to the stats");
        }
        const newShow: show = update_show(userShow, shows.city, shows.date, shows.num_songs, shows.setlist);
        console.log(newShow);
        await update_user_setlists(id, newShow.city, newShow.date, newShow.num_songs, newShow.setlist);
        this.city = newShow.city;
        this.num_songs = newShow.num_songs;
        this.setlist = newShow.setlist;
      }
    },
    async getStats(id: string | null) {
      if (id != null) {
        const stats = await get_user_setlists(id);
        this.city = stats.city;
        this.num_songs = stats.num_songs;
        this.setlist = stats.setlist;
      }
    }
  }
})
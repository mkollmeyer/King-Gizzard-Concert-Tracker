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
      if (id != null) {
        const shows = await get_setlists(date);
        const userShow = await get_user_setlists(id);
        const newShow: show = update_show(userShow, shows.city, shows.num_songs, shows.setlist);
        console.log(newShow);
        await update_user_setlists(id, newShow.city, newShow.num_songs, newShow.setlist);
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
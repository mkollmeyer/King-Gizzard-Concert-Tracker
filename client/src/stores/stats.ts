import { get_user_setlists, get_setlists, update_user_setlists, type show } from '../router/statRoutes.ts'
import { update_show } from '../utils/stat.ts';
import { getAuth } from '../utils/auth.ts';
import { tokenService } from '../utils/token.ts';
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
      if (id == null) return;

      const token = tokenService.getToken();
      const auth = await getAuth();
      if (!token || auth.user?.username !== id) {
        throw new Error('Cannot authenticate setlist');
      }

      const shows = await get_setlists(date);
      const userShow = await get_user_setlists(token);
      if (userShow.date?.includes(shows.date)) {
        throw new Error("Show already added to the stats");
      }
      const newShow: show = update_show(userShow, shows.city, shows.date, shows.num_songs, shows.setlist);
      await update_user_setlists(token, newShow.city, newShow.date, newShow.num_songs, newShow.setlist);
      this.city = newShow.city;
      this.num_songs = newShow.num_songs;
      this.setlist = newShow.setlist;
    },
    async getStats(id: string | null) {
      if (id == null) return;

      const token = tokenService.getToken();
      const auth = await getAuth();
      if (!token || auth.user?.username !== id) {
        throw new Error('Cannot authenticate setlist');
      }

      const stats = await get_user_setlists(token);
      this.city = stats.city;
      this.num_songs = stats.num_songs;
      this.setlist = stats.setlist;
    }
  }
})
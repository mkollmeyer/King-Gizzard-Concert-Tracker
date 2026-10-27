import { get_user_setlists } from '../router/statRoutes.ts'
import { defineStore } from 'pinia'

type StatsState = {
    city: string;
    num_songs: number;
    setlist: string[];
}

export const useStatsStore = defineStore('stats', {
  state: (): StatsState => ({
    city: '',
    num_songs: 0,
    setlist: [],
  }),
  actions: {
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
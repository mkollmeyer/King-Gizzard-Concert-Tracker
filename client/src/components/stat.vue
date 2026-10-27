<script setup lang="ts">
import { onMounted } from 'vue'
import router from '../router/index.ts';
import { useAuthStore } from '../stores/auth.ts'
import { useStatsStore } from '../stores/stats.ts';

const auth = useAuthStore()
const stats = useStatsStore()

onMounted(async () => {
  if (!auth.getUser) {
    router.push('/login')
    return
  }
  await stats.getStats(auth.getUser?.id as string)
  console.log(auth.getUser.username)
  console.log(await auth.getSession?.id)
})
</script>
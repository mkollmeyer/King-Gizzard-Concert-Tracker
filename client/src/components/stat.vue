<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '../router/index.ts';
import { useAuthStore } from '../stores/auth.ts'
import { useStatsStore } from '../stores/stats.ts';

const auth = useAuthStore()
const stats = useStatsStore()

const localError = ref('')
const date = ref('')

onMounted(async () => {
  if (!auth.getUser) {
    router.push('/login')
    return
  }
  await stats.getStats(auth.getUser?.id as string)
  console.log(auth.getUser.username)
  console.log(await auth.getSession?.id)
})
async function submitDate() {
  localError.value = ''
  await stats.updateStats(auth.getUser!.id, date.value);
}
</script>
<template>
    <div>
      <label class="field">
        <span>Date of show attended</span>
        <input v-model="date" type="text" />
      </label>
     <button @click="submitDate">Submit</button>
    </div>
</template>
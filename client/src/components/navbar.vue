<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth.ts'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const logoutError = ref('');

const isStats = (): boolean => {
    return route.path === '/stats';
};

async function logout() {
  logoutError.value = '';
  try {
    await authStore.signout();
    await router.push('/login');
  } catch (error) {
    logoutError.value = error instanceof Error ? error.message : 'Unable to log out';
  }
}
</script>

<template>
  <nav class = 'navigation'>
    <div id="left">
      <button v-if="isStats()" @click="$router.push('/');">Home</button>
      <button v-else="isStats()" @click="$router.push('/stats');">Stats</button>
    </div>
    <div id="right">
      <button v-if="authStore.user===null" @click="router.push('/login')">Login</button>
      <button v-else @click="logout">Logout</button>
      <p v-if="logoutError" role="alert">{{ logoutError }}</p>
    </div>
  </nav>
</template>

<style lang="css" scoped>

.navigation {
  margin-top: 0;
  top: 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding: 0.5rem;
  position: sticky; 
  align-items: center;
  justify-items: top;
  background-color: #942311;
  position: sticky;
  top: 0;
  left: 0;
  width: 98.4%;
  z-index: 1000;
  align-self: flex-start;
}

.left {
  display: flex;
  gap: 20px;
}

.right {
  margin-left: auto;
}

.navigation a:hover {
  color: #0084ff;
}

</style>
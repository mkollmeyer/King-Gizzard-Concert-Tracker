<script setup lang="ts">
import { useAuthStore } from '../stores/auth.ts'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const currentTheme = ref('theme-nonagon');

const applyThemeToBody = () => {
    const theme = currentTheme.value
  document.documentElement.setAttribute('data-theme', theme)
  // Optional: save preference to localStorage
  localStorage.setItem('app-theme', theme)
};

onMounted(() => {
  const savedTheme = localStorage.getItem('app-theme');
  if (savedTheme) {
    currentTheme.value = savedTheme;
  }
  applyThemeToBody();
});

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const logoutError = ref('');

const isStats = (): boolean => {
    return route.path === '/stats';
};

const isLogin = (): boolean => {
    return route.path === '/login';
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
    <div class = "left">
      <button v-if="isStats() || isLogin()" @click="$router.push('/');">Home</button>
      <button v-else-if="!isStats() && authStore.user" @click="$router.push('/stats');">Stats</button>
      <button v-else @click="$router.push('/login');">Stats</button>
      <label class = "form-label" for="theme">Select a theme:</label>
      <select id="theme-select" v-model="currentTheme" @change="applyThemeToBody">
          <option value="theme-nonagon">Nonagon Infinity</option>
          <option value="theme-banana">Flying Microtonal Banana</option>
          <option value="theme-fuzz">I'm in Your Mind Fuzz</option>
          <option value="theme-omnium">Omnium Gatherum</option>
          <option value="theme-alien">Alien Metal</option>
      </select>
    </div>
    <div class="right">
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
  background-color: var(--background-color);
  position: sticky;
  top: 0;
  left: 0;
  width: 98.4%;
  z-index: 1000;
  align-self: flex-start;
}

.left {
  font-family: 'Gamer-Bold', sans-serif;
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-label {
  font-family: 'Gamer-Bold', sans-serif;
  color: var(--text);
  text-shadow: 
    -0.75px -0.75px 0 #fff,  
     0.75px -0.75px 0 #fff,
    -0.75px  0.75px 0 #fff,
     0.75px  0.75px 0 #fff,
    -0.75px  0px 0 #fff,
     0.75px  0px 0 #fff,
     0px -0.75px 0 #fff,
     0px  0.75px 0 #fff;
  margin-right: 0.5rem;
}

.right {
  margin-left: auto;
}

.navigation a:hover {
  color: #0084ff;
}

</style>
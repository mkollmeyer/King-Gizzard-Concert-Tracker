<script setup lang="ts">
import { useAuthStore } from '../stores/auth.ts'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const currentTheme = ref('theme-nonagon');

const applyThemeToBody = () => {
    const theme = currentTheme.value
  document.documentElement.setAttribute('data-theme', theme)
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
      <a href="https://github.com/mkollmeyer" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--link-color, #000)">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      </a>
      <a href="https://linkedin.com/in/max-kollmeyer" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--link-color, #000)">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
      </a>
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
  padding: 0.5rem;
  position: sticky;
  align-items: center;
  background-color: var(--background-color);
  width: 100%;
  box-sizing: border-box;
  gap: 0.5rem;
  z-index: 1000;
  align-self: flex-start;
}

.left {
  font-family: 'Gamer-Bold', sans-serif;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.form-label {
  font-family: 'Gamer-Bold', sans-serif;
  font-size: clamp(0.75rem, 1.5vw, 1rem);
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
  display: flex;
  margin-left: auto;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  fill: var(--link-color);
}

.navigation button,
.navigation select {
  font-size: clamp(0.75rem, 1.5vw, 1rem);
}

.navigation select {
  max-width: 100%;
}

.navigation a:hover {
  color: #0084ff;
}

@media (max-width: 600px) {
  .navigation {
    flex-direction: column;
  }

  .left,
  .right {
    justify-content: center;
    margin-left: 0;
  }
}

</style>
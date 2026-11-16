<script setup lang="ts">
import { ref } from 'vue'
import router from '../router/index.ts'
import { useAuthStore } from '../stores/auth.ts'

const auth = useAuthStore()
auth.error = null

console.log("Loaded login.vue");

const username = ref('')
const password = ref('')
const localError = ref('')

async function submitLogin() {
  localError.value = ''
  const loggedIn = await auth.login(username.value, password.value)
  if (loggedIn) {
    await router.push('/stats')
  }
}

function clearErrors() {
  localError.value = ''
  auth.error = null
}
</script>
<template>
  <section class="signup-view">
    <div class="signup-card">
      <h1 style="color: white; font-family: Gamer-Bold">Sign In</h1>
      <form @submit.prevent="submitLogin()">
        <label class="field">
          <span>Username</span>
          <input v-model="username" type="text" />
        </label>
        <label class="field">
          <span>Password</span>
          <input v-model="password" type="password" />
        </label>
        <p v-if="localError" class="error-text">{{ localError }}</p>
        <p v-else-if="auth.error" class="error-text">{{ auth.error }}</p>
        <button type="submit" class="primary-btn">Sign In</button>
      </form>

      <p class="switch-text">
        Don't Have an Account?
        <router-link to="/signup" class="switch-link" @click="clearErrors">Sign up</router-link>
      </p>
    </div>
  </section>
</template>

<style scoped>
.signup-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.signup-card {
  font-family: 'Roboto Mono Variable', monospace;
  font-weight: 400;
  width: min(100%, 24rem);
  padding: 1.5rem;
  background: #000000;
  color: #fff;
  text-align: left;
  border: 1px solid #dcd9d5;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field input {
  padding: 0.65rem 0.75rem;
  border: 1px solid #d4d1ca;
  border-radius: 0.35rem;
}

.primary-btn {
  margin-top: 0.9rem;
  font-family: 'Roboto Mono Variable', monospace;
  border: none;
  padding: 0.7rem 0.9rem;
  border-radius: 0.4rem;
  background: var(--button-bg);
  color: #f9f8f4;
  font-weight: 600;
  width: 100%;
}

.error-text {
  color: #a12c7b;
  margin: 0;
}

.switch-text {
  font-family: 'Roboto Mono Variable', monospace;
  margin: 0;
  text-align: center;
  color: #5f5c56;
}

.switch-link {
  color: var(--link-color);
  font-weight: 600;
  text-decoration: none;
}
</style>
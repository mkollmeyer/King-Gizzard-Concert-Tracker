<script setup lang="ts">
import { ref } from 'vue'
import router from '../router/index.ts'
import { useAuthStore } from '../stores/auth.ts'

const auth = useAuthStore()

console.log("Loaded login.vue");

const username = ref('')
const password = ref('')
const localError = ref('')

async function submitLogin() {
  localError.value = ''
  await auth.login(username.value, password.value)
  if (auth.user) {
    router.push('/stats')
  }
}
</script>
<template>
  <section class="signup-view">
    <div class="signup-card">
      <h1 :style="{color:'black'}">Sign In</h1>

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

      <button type="button" class="primary-btn" @click="submitLogin()">Sign In</button>

      <p class="switch-text">
        Don't Have an Account?
        <router-link to="/signup" class="switch-link">Sign up</router-link>
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
  width: min(100%, 24rem);
  padding: 1.5rem;
  background: #f9f8f5;
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
  border: none;
  padding: 0.7rem 0.9rem;
  border-radius: 0.4rem;
  background: #01696f;
  color: #f9f8f4;
  font-weight: 600;
}

.error-text {
  color: #a12c7b;
  margin: 0;
}

.switch-text {
  margin: 0;
  text-align: center;
  color: #5f5c56;
}

.switch-link {
  color: #01696f;
  font-weight: 600;
  text-decoration: none;
}
</style>
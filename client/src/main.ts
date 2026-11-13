import { createApp } from 'vue'
import '../styles/style.css'
import App from './App.vue'
import login from './components/login.vue'
import  { createPinia } from 'pinia'
import router from './router/index.ts'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@fontsource-variable/roboto-mono';
import { useAuthStore } from './stores/auth.ts'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
const auth = useAuthStore(pinia);
void auth.clearExpiredSession();
app.component('login', login);
app.use(router)
app.mount('#app');
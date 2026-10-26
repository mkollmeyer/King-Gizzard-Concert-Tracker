import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: () => import('../components/home.vue')},
    { path: '/login', component: () => import('../components/login.vue')},
    { path: '/signup', component: () => import('../components/signup.vue')},
    { path: '/stats', component: () => import('../components/stat.vue')}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
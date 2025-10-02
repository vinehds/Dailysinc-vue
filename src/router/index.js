import { createRouter, createWebHistory } from 'vue-router';

import Login from "../views/Login.vue";
import Home from '../views/Home.vue';
/*import Dashboard from '../views/Dashboard.vue';
import Settings from '../views/Settings.vue';*/
import { useAuthStore } from '../store/auth';

const routes = [
    { path: '/login', component: Login },
    { path: '/', component: Home, meta: { requiresAuth: true } },
    /*  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
      { path: '/settings', component: Settings, meta: { requiresAuth: true } },*/
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const auth = useAuthStore();
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        next('/login');
    } else {
        next();
    }
});

export default router;

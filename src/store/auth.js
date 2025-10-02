import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '',
    }),
    getters: {
        isLoggedIn: (state) => !!state.token,
    },
    actions: {
        async login(email, password) {
            try {
                const res = await axios.post('http://localhost:8080/auth/login', { email, password });
                this.token = res.data.token;
                localStorage.setItem('token', this.token);
            } catch {
                throw new Error('Login falhou');
            }
        },
        logout() {
            this.token = '';
            localStorage.removeItem('token');
        },
    },
});
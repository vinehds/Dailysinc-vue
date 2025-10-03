// src/services/api.js
import axios from "axios";
import { useAuthStore } from "../store/auth";


const api = axios.create({
    baseURL: 'http://localhost:8080'
})

// Interceptor para adicionar Authorization automaticamente
api.interceptors.request.use((config) => {
    try {
        // Import dinamicamente para evitar dependência circular
        const authStore = useAuthStore();
        const token = authStore.accessToken || localStorage.getItem("access_token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (err) {
        // no-op: em ambientes de build sem Pinia disponível ainda
    }
    return config;
});

export default api;
import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const axiosInstance = axios.create({
        baseURL: config.public.apiBase,
    });

    // Add request interceptor
    axiosInstance.interceptors.request.use(async (config) => {
        if (process.client) {
            try {
                const { getAuth } = await import("firebase/auth");
                const auth = getAuth();
                const user = auth.currentUser;

                if (user) {
                    const token = await user.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.warn("Axios Interceptor: Failed to attach token", error);
            }
        }
        return config;
    });

    return {
        provide: {
            axios: axiosInstance,
        },
    };
});

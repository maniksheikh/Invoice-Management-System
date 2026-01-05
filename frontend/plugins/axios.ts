import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const axiosInstance = axios.create({
        baseURL: config.public.apiBase,
    });

    return {
        provide: {
            axios: axiosInstance,
        },
    };
});

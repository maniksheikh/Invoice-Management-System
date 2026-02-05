import { defineStore } from 'pinia'
import { markRaw } from 'vue'

export const useMainStore = defineStore('main', {
    state: () => ({
        user: null,
        userDetails: null,
        loading: false,
        isAuthReady: false,
        theme: 'dark', // Default theme
    }),

    actions: {
        initTheme() {
            if (process.client) {
                const savedTheme = localStorage.getItem('theme') || 'dark'
                this.theme = savedTheme
                document.documentElement.classList.toggle('dark', savedTheme === 'dark')
            }
        },
        toggleTheme() {
            this.theme = this.theme === 'dark' ? 'light' : 'dark'
            if (process.client) {
                localStorage.setItem('theme', this.theme)
                document.documentElement.classList.toggle('dark', this.theme === 'dark')
            }
        },
        setAuthReady(ready) {
            this.isAuthReady = ready
        },
        setUser(user) {
            this.user = user ? markRaw(user) : null
        },
        setUserDetails(details) {
            this.userDetails = details
        },
        setUserLoading(loading) {
            this.loading = loading
        },

        async getUserDetails(email) {
            try {
                const { $axios } = useNuxtApp()
                console.log(`Store: Fetching user details for ${email}...`);
                const { data } = await $axios.get(`/person/v1/details`, {
                    params: { email }
                })
                console.log('Store: User details fetched successfully:', data);
                return data;
            } catch (error) {
                console.error('Store: Failed to fetch user details:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
                    config: error.config?.url
                });
                return null;
            }
        },

        async postUserDetails(payload) {
            try {
                const { $axios } = useNuxtApp()
                await $axios.post('/person/v1/param', payload);
            } catch (error) {
                console.warn('Failed to post user details:', error.response?.data || error.message);
            }
        }
    },
})

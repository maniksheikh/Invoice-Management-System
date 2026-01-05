import { defineStore } from 'pinia'
import { markRaw } from 'vue'

export const useMainStore = defineStore('main', {
    state: () => ({
        user: null,
        userDetails: null,
        loading: false,
    }),
    actions: {
        setUser(user) {
            // Use markRaw to prevent Vue from making Firebase user objects reactive
            // This prevents SecurityError when Firebase popup tries to access cross-origin properties
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

import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
    state: () => ({
        user: null,
        userDetails: null,
        loading: false,
    }),
    actions: {
        setUser(user) {
            this.user = user
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
                const { data } = await $axios.get(`/person/v1/details`, {
                    params: { email }
                })
                return data;
            } catch (error) {
                console.warn('Failed to fetch user details:', error);
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

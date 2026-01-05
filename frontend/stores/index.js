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
                const data = await $fetch(`/api/person/v1/details`, {
                    query: { email }
                }).catch(() => null);
                return data;
            } catch (error) {
                console.warn('Failed to fetch user details:', error);
                return null;
            }
        },
        async postUserDetails(payload) {
            try {
                await $fetch('/api/person/v1/param', {
                    method: 'POST',
                    body: payload
                }).catch(() => null);
            } catch (error) {
                console.warn('Failed to post user details:', error);
            }
        }
    },
})

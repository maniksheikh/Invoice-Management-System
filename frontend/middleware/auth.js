import { watch } from 'vue'

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return

    const { isLoggedIn, isAuthReady } = useAuth()

    // Wait for auth to be ready if on client
    if (process.client && !isAuthReady.value) {
        await new Promise((resolve) => {
            const unwatch = watch(isAuthReady, (ready) => {
                if (ready) {
                    unwatch()
                    resolve()
                }
            })
        })
    }

    if (isLoggedIn.value && (to.path === '/login' || to.path === '/register')) {
        return navigateTo('/')
    }
    if (!isLoggedIn.value && to.path !== '/login' && to.path !== '/register') {
        return navigateTo('/login')
    }
})

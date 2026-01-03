export const useAuth = () => {
    const user = useState('auth_user', () => null)
    const token = useState('auth_token', () => null)
    const config = useRuntimeConfig()

    const isLoggedIn = computed(() => !!token.value)

    // Initialize from localStorage (client-side only)
    if (process.client) {
        const savedToken = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('auth_user')
        if (savedToken && savedUser) {
            token.value = savedToken
            user.value = JSON.parse(savedUser)
        }
    }

    const login = async (email, password) => {
        try {
            const { data, error } = await useFetch(`${config.public.apiBase}/person/v1/login`, {
                method: 'POST',
                body: { email, password }
            })

            if (error.value) throw error.value

            token.value = data.value.token
            user.value = data.value.person

            if (process.client) {
                localStorage.setItem('auth_token', data.value.token)
                localStorage.setItem('auth_user', JSON.stringify(data.value.person))
            }

            return data.value
        } catch (err) {
            throw new Error(err.data?.message || err.message || 'Login failed')
        }
    }

    const register = async (name, email, password) => {
        try {
            const { data, error } = await useFetch(`${config.public.apiBase}/person/v1/register`, {
                method: 'POST',
                body: { name, email, password }
            })

            if (error.value) throw error.value
            return data.value
        } catch (err) {
            throw new Error(err.data?.message || err.message || 'Registration failed')
        }
    }

    const logout = () => {
        token.value = null
        user.value = null
        if (process.client) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
        }
        navigateTo('/login')
    }

    return {
        user,
        token,
        isLoggedIn,
        login,
        register,
        logout
    }
}

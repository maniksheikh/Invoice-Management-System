import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

import {
    getAnalytics,
    logEvent,
    setUserId,
    isSupported,
} from "firebase/analytics";
import { useMainStore } from "~/stores/index.js";
import { onMounted, watch, markRaw } from "vue";
import { useRoute, useRouter } from "vue-router";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDd3qm8YW0OlHTBOu7Tq5_FyZ6PyZ_aCoc",
    authDomain: "invoice-management-system-e1.firebaseapp.com",
    projectId: "invoice-management-system-e1",
    storageBucket: "invoice-management-system-e1.firebasestorage.app",
    messagingSenderId: "152498324526",
    appId: "1:152498324526:web:5c1fd8e9fd32e67b130bbf",
    measurementId: "G-V957KDX5E6"
};

let app, auth, storage, db, analytics;
let isInitialized = false;

let tokenRefreshInterval;

export default function () {
    const { $axios, $pinia } = useNuxtApp();
    const axiosInstance = $axios;
    const store = useMainStore($pinia);
    const router = useRouter();

    if (process.client && !isInitialized) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        setPersistence(auth, browserLocalPersistence);
        storage = getStorage(app);
        db = getFirestore(app);
        isSupported().then((supported) => {
            if (supported) {
                analytics = getAnalytics(app);
            }
        });

        auth.onAuthStateChanged(async (user) => {
            if (user) {
                if (!store.user) {
                    store.setUser(markRaw(user));
                    try {
                        const details = await store.getUserDetails(user.email);
                        if (details) {
                            store.setUserDetails(details);
                        }
                    } catch (error) {
                        console.error("Error getting user details:", error);
                    }
                    if (analytics) {
                        setUserId(analytics, user.uid);
                    }
                }

 // Immediately refresh and set up interval
                try {
                    await refreshAndSetIdToken(user);
                } catch (e) {
                    console.error("Initial token refresh failed:", e);
                }
                if (tokenRefreshInterval) clearInterval(tokenRefreshInterval);
                tokenRefreshInterval = setInterval(async () => {
                    const currentUser = getAuth().currentUser;
                    if (currentUser) {
                        await refreshAndSetIdToken(currentUser);
                    }
                }, 55 * 60 * 1000);
            } else {
                if (tokenRefreshInterval) clearInterval(tokenRefreshInterval);
                store.setUser(null);
                store.setUserDetails(null);
                if (axiosInstance) {
                    axiosInstance.defaults.headers.common["Authorization"] = "";
                }
            }
            store.setUserLoading(false);
        });
        isInitialized = true;
    }

    async function refreshAndSetIdToken(user) {
        if (!user) return;
        try {
            const idToken = await user.getIdToken(true);
            const app = useNuxtApp();
            const currentAxios = app.$axios || axiosInstance;
            if (currentAxios) {
                currentAxios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
                console.log("Auth: ID Token refreshed and set in Axios");
            } else {
                console.warn("Auth: Axios instance not found during token refresh");
            }
        } catch (error) {
            console.error("Error refreshing ID token:", error);
        }
    }

    const provider = () => new GoogleAuthProvider();
    onMounted(() => {
        if (analytics) {
            const route = useRoute();
            watch(
                () => route.path,
                (newPath) => {
                    logEvent(analytics, "page_view", { page_path: newPath });
                },
                { immediate: true }
            );
        }
    });

// Function to log events
    function eventLog(event_name, payload) {
        if (analytics) {
            logEvent(analytics, event_name, payload);
        }
    }
    return { auth, provider, storage, eventLog, db, refreshAndSetIdToken };
}
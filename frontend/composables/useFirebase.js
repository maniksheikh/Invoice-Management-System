import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

import {
    getAnalytics,
    logEvent,
    setUserId,
    isSupported,
} from "firebase/analytics";
import { useMainStore } from "~/stores/index.js";
import { onMounted, watch } from "vue";
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

export default function () {
    const { $axios, $pinia } = useNuxtApp();
    const store = useMainStore($pinia);
    const router = useRouter();

    if (!isInitialized) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        storage = getStorage(app);
        db = getFirestore(app);

        // Check if Firebase Analytics is supported
        isSupported().then((supported) => {
            if (supported) {
                analytics = getAnalytics(app);
            } else {
                console.log("Firebase Analytics is not supported in this environment");
            }
        });

        let tokenRefreshInterval;

        auth.onAuthStateChanged(async (user) => {
            if (user) {
                // Initialize or update the user in the store
                if (!store.user) {
                    store.setUser(user);
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

                // Set the ID token in Axios headers immediately
                refreshAndSetIdToken();

                // Set up or refresh the token refresh interval
                clearInterval(tokenRefreshInterval);
                tokenRefreshInterval = setInterval(() => {
                    refreshAndSetIdToken();
                }, 55 * 60 * 1000); // Refresh token every 55 minutes
            } else {
                // User is signed out, clear the interval and reset the store
                clearInterval(tokenRefreshInterval);
                store.setUser(null);
                store.setUserDetails(null);
                // Optionally, clear the Authorization header
                $axios.defaults.headers.common["Authorization"] = "";
            }

            // Crucial: Set loading to false after the auth state is determined
            store.setUserLoading(false);
        });

        async function refreshAndSetIdToken() {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const idToken = await currentUser.getIdToken(true);
                    $axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
                }
            } catch (error) {
                console.error("Error refreshing ID token:", error);
            }
        }

        isInitialized = true;
    }

    const provider = () => new GoogleAuthProvider();

    onMounted(() => {
        const route = useRoute();
        watch(
            route,
            (to) => {
                if (analytics) {
                    logEvent(analytics, "page_view", { page_path: to.path });
                }
            },
            { immediate: true }
        );
    });

    // Function to log events
    function eventLog(event_name, payload) {
        if (analytics) {
            logEvent(analytics, event_name, payload);
        }
    }

    return { auth, provider, storage, eventLog, db };
}
import { useMainStore } from "~/stores/index.js";

import {
    applyActionCode,
    confirmPasswordReset,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    updatePassword,
    verifyPasswordResetCode,
} from "firebase/auth";

export default function useAuth() {
    const { $pinia, $toast } = useNuxtApp();
    const store = useMainStore($pinia);
    const { auth, provider, eventLog } = useFirebase();

    async function signInWithGoogle() {
        console.log('Auth Composable: signInWithGoogle started');
        try {
            store.setUserLoading(true);
            const userCredential = await signInWithPopup(auth, provider());
            const user = userCredential.user;
            console.log('Auth Composable: Firebase sign-in successful', user.email);

            store.setUser(user);

            const response = await store.getUserDetails(user.email);
            if (!response) {
                console.log('Auth Composable: New user, creating profile...');
                const payload = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    isVerified: true,
                    photoURL: user.photoURL,
                };
                await store.postUserDetails(payload);
                store.setUserDetails(payload);
            } else {
                console.log('Auth Composable: Existing user found');
                store.setUserDetails(response);
            }
            store.setUserLoading(false);
            return { success: true, user: response || user };
        } catch (error) {
            console.error('Auth Composable: Google sign-in error', error);
            store.setUserLoading(false);
            throw error;
        }
    }

    async function signUpWithEmail(email, password, displayName) {
        const response = await store.getUserDetails(email);

        if (response) {
            throw new Error("User already exists. Please Sign In.");
        } else {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
                displayName
            );
            const user = userCredential.user;

            await sendEmailVerification(auth.currentUser);

            const payload = {
                uid: user.uid,
                email: user.email,
                displayName: displayName,
                isVerified: false,
                photoURL: user.providerData[0]?.photoURL || null,
            };
            store.setUser(user);
            store.postUserDetails(payload);
            $toast(
                "A verification email has been send to your email. To sign in verify your email first."
            );
        }
    }
    async function signInWithEmail(payload) {
        try {
            store.setUserLoading(true);
            const userCredential = await signInWithEmailAndPassword(
                auth,
                payload.email,
                payload.password
            );

            const user = userCredential.user;
            store.setUser(user);

            const userDetails = await store.getUserDetails(user.email);
            if (userDetails && userDetails.isVerified) {
                // Ensure userDetails has the latest photoURL from Firebase if it's missing
                if (!userDetails.photoURL && user.photoURL) {
                    userDetails.photoURL = user.photoURL;
                    store.setUserDetails(userDetails);
                }
                return { success: true, user: userDetails };
            } else {
                await sendEmailVerification(auth.currentUser);
                throw new Error(
                    "You need to verify your email first. We have sent you a verification email to your email address."
                );
            }
        } catch (error) {
            store.setUserLoading(false);
            throw error;
        }
    }
    async function forgetPassword(email) {
        await sendPasswordResetEmail(auth, email);
    }
    async function verifyEmail(actionCode) {
        await applyActionCode(auth, actionCode);
    }
    async function setNewPassword(payload) {
        const password = payload.password;
        const actionCode = payload.oobCode;
        await verifyPasswordResetCode(auth, actionCode).then((email) => {
            const accountEmail = email;
            confirmPasswordReset(auth, actionCode, password);
        });
    }
    async function changePassword(newPassword) {
        const user = auth.currentUser;
        await updatePassword(user, newPassword);
    }

    function logout() {
        auth
            .signOut()
            .then(() => {
                store.setUser(null);
                store.setUserDetails(null);
                return navigateTo("/");
            })
            .catch((e) => {
                console.error(e);
            });
    }

    return {
        signInWithGoogle,
        logout,
        signUpWithEmail,
        signInWithEmail,
        forgetPassword,
        setNewPassword,
        changePassword,
        verifyEmail,
        user: computed(() => store.user),
        isLoggedIn: computed(() => !!store.user),
    };
}

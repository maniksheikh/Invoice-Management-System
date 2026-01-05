export default defineNuxtPlugin(() => {
    if (process.client) {
        useFirebase();
    }
});

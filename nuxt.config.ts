// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    app: { pageTransition: { name: 'page', mode: 'out-in' } },
    css: ["~/assets/css/style.css"],
    runtimeConfig: {
        public: {
            appName: '',
            appVersion: '',
            appKey: '',
            apiBase: '',
            siteUrl: '',
            imgbbUrl: '',
            imgbbKey: ''
        },
    },
    $production: {
        ignorePrefix: "dev*"
    },
})

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ucenter.9999server',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    script: [
      { src: '/html5-qrcode.min.js' }
    ]
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/script.js' }
  ],

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/main'
  ],

  styleResources: {
    scss: ['@/assets/css/*.scss']
  },

  serverMiddleware: [
    { path: '/lib', handler: '~/api/index.js' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    // https://i18n.nuxtjs.org
    'nuxt-i18n',
    // for global css style sheet
    '@nuxtjs/style-resources',
    // https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // https://auth.nuxtjs.org/
    '@nuxtjs/auth-next'
  ],

  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    liveEdit: false
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  axios: {
    proxy: true
  },

  proxy: {
    '/api': {
      target: process.env.NODE_ENV === "production" ? 'openapi.9999server.com' : 'http://192.168.75.52:8010',
      pathRewrite: {
        '^/api': '/',
        changeOrigin: true
      }
    },
  },

  server: {
    host: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'uat' ? '0.0.0.0' : 'localhost',
    port: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'uat' ? '8001' : '7070'
  }
}

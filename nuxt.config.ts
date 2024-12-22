// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
  ],
  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    {
      href: 'https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap',
      rel: 'stylesheet',
    }],
    }
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            'xmas': ['Mountains of Christmas', 'serif'],
          }
        }
      }
    }
  }
})
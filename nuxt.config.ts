import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
	modules: ['@pinia/nuxt'],
	imports: {
		imports: [
			{
				from: 'vue-i18n',
				name: 'useI18n',
			},
		],
	},
	app: {
		head: {
			title: 'Vue - Momentum',
			link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
			meta: [
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'description', content: 'Polish Football League standings and team information' },
			],
		},
	},
	components: [
		{
			path: '~/components',
			pathPrefix: false,
		},
	],
	devtools: { enabled: true },
	css: ['~/assets/main.css'],

	vite: {
		plugins: [tailwindcss()],
	},

	compatibilityDate: '2025-03-14',
})

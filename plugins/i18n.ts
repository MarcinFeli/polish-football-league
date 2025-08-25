import { createI18n } from 'vue-i18n'
import pl from '~/locales/pl.json'
import en from '~/locales/en.json'

export default defineNuxtPlugin(nuxtApp => {
	const config = useRuntimeConfig()
	const defaultLocale = 'en'
	const fallbackLocale = 'en'

	const messages = { pl, en }

	const i18n = createI18n({
		legacy: false,
		globalInjection: true,
		locale: defaultLocale,
		fallbackLocale,
		messages,
	})

	const localeCookie = useCookie<'en' | 'pl'>('locale')
	if (localeCookie.value) {
		i18n.global.locale.value = localeCookie.value
	}

	nuxtApp.vueApp.use(i18n)
	return {
		provide: {
			i18n,
		},
	}
})

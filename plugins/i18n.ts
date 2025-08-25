import { createI18n } from 'vue-i18n'
import pl from '~/locales/pl.json'
import en from '~/locales/en.json'

export default defineNuxtPlugin(nuxtApp => {
	const defaultLocale = 'en'
	const fallbackLocale = 'en'
	const messages = { pl, en }

	const localeCookie = useCookie<'en' | 'pl'>('locale')
	const initialLocale = localeCookie.value || defaultLocale

	const i18n = createI18n({
		legacy: false,
		globalInjection: true,
		locale: initialLocale,
		fallbackLocale,
		messages,
	})

	nuxtApp.vueApp.use(i18n)
	return {
		provide: {
			i18n,
		},
	}
})

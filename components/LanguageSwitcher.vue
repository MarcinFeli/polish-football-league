<template>
	<div class="inline-flex items-center rounded-full bg-slate-100/60 p-1">
		<button
			class="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400"
			:class="currentLocale === 'pl' ? 'bg-white text-indigo-600 shadow' : 'text-slate-600 hover:bg-white/60'"
			:aria-pressed="currentLocale === 'pl'"
			aria-label="Polski"
			@click="switchLocale('pl')">
			<span class="text-lg">🇵🇱</span>
			<span class="hidden sm:inline">PL</span>
		</button>

		<button
			class="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ml-1 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400"
			:class="currentLocale === 'en' ? 'bg-white text-indigo-600 shadow' : 'text-slate-600 hover:bg-white/60'"
			:aria-pressed="currentLocale === 'en'"
			aria-label="English"
			@click="switchLocale('en')">
			<span class="text-lg">🇬🇧</span>
			<span class="hidden sm:inline">EN</span>
		</button>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { locale } = useI18n()
const cookie = useCookie('locale')

const currentLocale = computed(() => locale.value as string)

function switchLocale(l: 'pl' | 'en') {
	if (locale.value === l) return
	locale.value = l
	cookie.value = l
}
</script>

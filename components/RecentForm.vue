<template>
	<div class="flex space-x-1">
		<span
			v-for="(result, index) in recentForm"
			:key="index"
			class="w-6 h-6 flex items-center justify-center text-white text-xs font-bold rounded-full"
			:class="resultClass(resultKey(result))">
			{{ t(`teams.${resultKey(result)}`) }}
		</span>
	</div>
</template>

<script setup lang="ts">
import { resultKey, resultClass } from '../composables/useResult'
const { t } = useI18n()
const props = defineProps<{
	recentForm: string[]
}>()
</script>
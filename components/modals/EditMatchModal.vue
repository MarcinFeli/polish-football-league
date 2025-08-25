<template>
	<BaseModal title="Edit Match Result" save-button-text="Save Result" @close="$emit('close')" @save="saveResult">
		<div>
			<div class="flex items-center justify-between mb-4">
				<div class="text-center">
					<p class="font-semibold dark:text-white">{{ match.homeTeam }}</p>
					<p class="text-sm text-gray-500 dark:text-gray-400">(Home)</p>
				</div>
				<div class="text-center">
					<p class="font-semibold dark:text-white">vs</p>
				</div>
				<div class="text-center">
					<p class="font-semibold dark:text-white">{{ match.awayTeam }}</p>
					<p class="text-sm text-gray-500 dark:text-gray-400">(Away)</p>
				</div>
			</div>

			<div class="flex items-center justify-center space-x-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Home Score</label>
					<input
						v-model.number="homeScore"
						type="number"
						min="0"
						max="7"
						class="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
				</div>
				<div class="text-xl font-bold dark:text-white">-</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Away Score</label>
					<input
						v-model.number="awayScore"
						type="number"
						min="0"
						max="7"
						class="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
				</div>
			</div>
		</div>
	</BaseModal>
</template>

<script setup lang="ts">
import { useTeamsStore } from '~/stores/teams'
import type { FormattedMatch } from '~/types'

const props = defineProps<{
	match: FormattedMatch
}>()

const emit = defineEmits(['close', 'save'])

const teamsStore = useTeamsStore()

const homeScore = ref(0)
const awayScore = ref(0)

onMounted(() => {
	homeScore.value = props.match.homeScore
	awayScore.value = props.match.awayScore
})

function saveResult() {
	if (homeScore.value < 0 || homeScore.value > 7 || awayScore.value < 0 || awayScore.value > 7) {
		alert('Scores must be between 0 and 7')
		return
	}

	teamsStore.updateMatchResult(props.match.id, homeScore.value, awayScore.value)
	emit('save')
	emit('close')
}
</script>

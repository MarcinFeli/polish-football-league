<template>
	<BaseModal
		title="Add New Match"
		save-button-text="Add Match"
		:save-disabled="!isValid"
		@close="$emit('close')"
		@save="saveMatch">
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
				<input
					v-model="matchDate"
					type="date"
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Home Team</label>
					<select
						v-model.number="homeTeamId"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
						<option value="">Select team</option>
						<option v-for="team in availableHomeTeams" :key="team.id" :value="team.id">
							{{ team.name }}
						</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Away Team</label>
					<select
						v-model.number="awayTeamId"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
						<option value="">Select team</option>
						<option v-for="team in availableAwayTeams" :key="team.id" :value="team.id">
							{{ team.name }}
						</option>
					</select>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Home Score</label>
					<input
						v-model.number="homeScore"
						type="number"
						min="0"
						max="7"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Away Score</label>
					<input
						v-model.number="awayScore"
						type="number"
						min="0"
						max="7"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
				</div>
			</div>
		</div>
	</BaseModal>
</template>

<script setup lang="ts">
import type { Team } from '~/types'
import { useTeamsStore } from '~/stores/teams'

const emit = defineEmits(['close', 'save'])

const teamsStore = useTeamsStore()

const matchDate = ref(new Date().toISOString().split('T')[0])
const homeTeamId = ref<number | ''>('')
const awayTeamId = ref<number | ''>('')
const homeScore = ref(0)
const awayScore = ref(0)

const availableHomeTeams = computed(() => {
	return teamsStore.teams.filter((team: Team) => team.id !== awayTeamId.value)
})

const availableAwayTeams = computed(() => {
	return teamsStore.teams.filter((team: Team) => team.id !== homeTeamId.value)
})

const isValid = computed(() => {
	return (
		matchDate.value &&
		homeTeamId.value !== '' &&
		awayTeamId.value !== '' &&
		homeScore.value >= 0 &&
		homeScore.value <= 7 &&
		awayScore.value >= 0 &&
		awayScore.value <= 7
	)
})

function saveMatch() {
	if (!isValid.value) return

	teamsStore.addNewMatch({
		date: matchDate.value,
		homeTeamId: homeTeamId.value as number,
		awayTeamId: awayTeamId.value as number,
		homeScore: homeScore.value,
		awayScore: awayScore.value,
	})

	emit('save')
	emit('close')
}
</script>

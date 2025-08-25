<template>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
		<div class="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
			<h2 class="text-3xl font-bold">{{ team.name }}</h2>
			<p class="text-blue-100">
				{{ t('teams.positionInLeague') }}: #{{ team.position }} • {{ t('teams.points') }}: {{ team.points }}
			</p>
		</div>

		<div class="p-6">
			<div class="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
				<div>
					<div class="flex items-center mb-4">
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ team.name }}</h2>
						<span
							class="ml-3 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
							#{{ team.position }}
						</span>
					</div>

					<div class="space-y-3">
						<div class="flex items-center space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-gray-500 dark:text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<p class="dark:text-gray-300">
								<strong>{{ t('teams.founded') }}:</strong> {{ team.founded }}
							</p>
						</div>
						<div class="flex items-center space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-gray-500 dark:text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
							</svg>
							<p class="dark:text-gray-300">
								<strong>{{ t('teams.stadium') }}:</strong> {{ team.stadium }}
								<button
									@click="showEditModal = true"
									class="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
									{{ t('teams.edit') }}
								</button>
							</p>
						</div>
						<div class="flex items-center space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-gray-500 dark:text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
							<p class="dark:text-gray-300">
								<strong>{{ t('teams.coach') }} :</strong> {{ team.coach }}
							</p>
						</div>
					</div>
				</div>

				<div>
					<h3 class="text-xl font-semibold mb-4 dark:text-white">{{ t('teams.teamStats') }}</h3>
					<div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
						<div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
							<h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
								{{ t('teams.points') }}
							</h4>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ team.points }}</p>
						</div>
						<div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
							<h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
								{{ t('teams.goalsScored') }}
							</h4>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ team.goalsFor }}</p>
						</div>
						<div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
							<h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
								{{ t('teams.goalsConceded') }}
							</h4>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ team.goalsAgainst }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<MatchList :team="team" @start-edit="startEditingMatch" />
		<div
			v-if="showTeamSuccess"
			class="fixed bottom-4 right-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-3 rounded-lg shadow-lg">
			{{ t('matches.teamDetailsUpdated') }}
		</div>
		<div
			v-if="showSuccess"
			class="flex items-center fixed bottom-4 right-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-3 rounded-lg shadow-lg">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 mr-2"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			{{ t('matches.matchUpdated') }}
		</div>
		<EditTeamModal v-if="showEditModal" :team="team" @close="showEditModal = false" @save="handleTeamUpdate" />
		<EditMatchModal v-if="editingMatch" :match="editingMatch" @close="editingMatch = null" @save="handleMatchUpdate" />
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTeamsStore } from '~/stores/teams'
import type { Team, FormattedMatch } from '~/types'

const { t } = useI18n()
const props = defineProps<{
	team: Team
}>()

const teamsStore = useTeamsStore()
const showEditModal = ref(false)
const showSuccess = ref(false)
const showTeamSuccess = ref(false)
const editingMatch = ref<FormattedMatch | null>(null)

function handleTeamUpdate() {
	showTeamSuccess.value = true
	setTimeout(() => {
		showTeamSuccess.value = false
	}, 3000)
}

function startEditingMatch(match: FormattedMatch) {
	editingMatch.value = match
}

function handleMatchUpdate() {
	showSuccess.value = true
	setTimeout(() => {
		showSuccess.value = false
	}, 3000)
}
</script>

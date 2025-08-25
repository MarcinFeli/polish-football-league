<template>
	<div class="p-6 border-t border-gray-200 dark:border-gray-700">
		<h3 class="text-xl font-semibold mb-4 dark:text-white">{{ t('matches.allMatches') }}</h3>
		<Loading v-if="isLoadingMatches" />
		<div v-else-if="teamMatches.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
			No match history available
		</div>
		<div v-else>
			<div class="mb-6">
				<h4 class="text-lg font-medium mb-2 dark:text-white">{{ t('teams.recentForm') }}</h4>
				<div class="flex space-x-3">
					<span
						v-for="(result, index) in team.recentForm"
						:key="index"
						class="w-10 h-10 flex items-center justify-center text-white text-sm font-bold rounded-full"
						:class="resultClass(resultKey(result))">
						{{ t(`teams.${resultKey(result)}`) }}
					</span>
				</div>
				<p class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ t('teams.mostRecentMatch') }}</p>
			</div>
			<div class="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
				<h4 class="text-lg font-medium mb-3 dark:text-white">{{ t('teams.seasonSummary') }}</h4>
				<div class="grid grid-cols-4 gap-4">
					<div class="text-center">
						<p class="text-sm text-gray-500 dark:text-gray-400">{{ t('teams.played') }}</p>
						<p class="text-2xl font-bold dark:text-white">{{ gamesPlayed }}</p>
					</div>
					<div class="text-center">
						<p class="text-sm text-gray-500 dark:text-gray-400">{{ t('teams.won') }}</p>
						<p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ team.wins }}</p>
					</div>
					<div class="text-center">
						<p class="text-sm text-gray-500 dark:text-gray-400">{{ t('teams.drawn') }}</p>
						<p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ team.draws }}</p>
					</div>
					<div class="text-center">
						<p class="text-sm text-gray-500 dark:text-gray-400">{{ t('teams.lost') }}</p>
						<p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ team.losses }}</p>
					</div>
				</div>
			</div>
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead class="bg-gray-50 dark:bg-gray-700">
						<tr>
							<th
								scope="col"
								class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								{{ t('matches.date') }}
							</th>
							<th
								scope="col"
								class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								{{ t('matches.match') }}
							</th>
							<th
								scope="col"
								class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								{{ t('matches.result') }}
							</th>
							<th
								scope="col"
								class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								{{ t('matches.actions') }}
							</th>
						</tr>
					</thead>
					<tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
						<tr v-for="match in teamMatches" :key="match.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
							<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
								{{ match.date }}
							</td>
							<td class="px-4 py-3 whitespace-nowrap">
								<div class="flex items-center">
									<span :class="{ 'font-bold': match.isHome }" class="text-gray-900 dark:text-white">
										{{ match.homeTeam }}
									</span>
									<span class="mx-2 text-gray-500 dark:text-gray-400">vs</span>
									<span :class="{ 'font-bold': !match.isHome }" class="text-gray-900 dark:text-white">
										{{ match.awayTeam }}
									</span>
								</div>
							</td>
							<td class="px-4 py-3 whitespace-nowrap">
								<div class="flex items-center space-x-2">
									<span class="text-gray-900 dark:text-white font-medium">
										{{ match.homeScore }} - {{ match.awayScore }}
									</span>
									<span
										class="w-6 h-6 flex items-center justify-center text-white text-xs font-bold rounded-full"
										:class="resultClass(resultKey(match.result))">
										{{ t(`teams.${resultKey(match.result)}`) }}
									</span>
								</div>
							</td>
							<td class="px-4 py-3 whitespace-nowrap">
								<button
									@click="startEditingMatch(match)"
									class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
									{{ t('matches.editResult') }}
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTeamsStore } from '~/stores/teams'
import type { Team, FormattedMatch } from '~/types'
import { resultKey, resultClass } from '../composables/useResult'

const { t } = useI18n()

const props = defineProps<{
	team: Team
}>()

const emit = defineEmits<{
	(e: 'start-edit', match: FormattedMatch): void
}>()

const isLoadingMatches = ref(false)

const teamsStore = useTeamsStore()

const teamMatches = computed(() => {
	return teamsStore.getTeamMatches(props.team.id)
})

const gamesPlayed = computed(() => {
	return props.team.wins + props.team.draws + props.team.losses
})

function startEditingMatch(match: FormattedMatch) {
	emit('start-edit', match)
}
</script>

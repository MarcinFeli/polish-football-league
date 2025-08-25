<template>
	<div class="mb-8">
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
			<div class="p-4 bg-blue-50 dark:bg-blue-900 border-b border-blue-100 dark:border-blue-800">
				<div v-if="favoriteTeam" class="flex justify-between items-center">
					<h2 class="text-lg font-semibold text-blue-800 dark:text-blue-200">
						<span class="mr-2">⭐</span> {{ favoriteTeam.name }} - {{ t('teams.recentForm') }}
					</h2>
					<NuxtLink
						:to="`/teams/${favoriteTeam.id}`"
						class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
						{{ t('navigation.viewFullDetails') }}
					</NuxtLink>
				</div>
			</div>
			<div class="p-6">
				<div v-if="recentMatches.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
					{{ t('matches.noRecentMatches') }}
				</div>
				<div v-else>
					<div class="mt-2">
						<div class="flex space-x-3">
							<span
								v-for="(match, index) in recentMatches"
								:key="index"
								class="w-10 h-10 flex items-center justify-center text-white text-sm font-bold rounded-full"
								:class="resultClass(resultKey(match.result))">
								{{ t(`teams.${resultKey(match.result)}`) }}
							</span>
						</div>
						<p class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ t('teams.mostRecentMatch') }}</p>
					</div>
					<div class="mt-6 overflow-x-auto">
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
								</tr>
							</thead>
							<tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
								<tr v-for="match in recentMatches" :key="match.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
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
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTeamsStore } from '~/stores/teams'
import type { FormattedMatch } from '~/types'
import { resultKey, resultClass } from '../composables/useResult'

const { t } = useI18n()
const teamsStore = useTeamsStore()

const favoriteTeam = computed(() => teamsStore.favoriteTeam)
const recentMatches = computed<FormattedMatch[]>(() => {
	if (!favoriteTeam.value) return []
	return teamsStore.getTeamMatches(favoriteTeam.value.id, 5)
})
</script>

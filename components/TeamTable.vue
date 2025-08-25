<template>
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
		<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-700">
				<tr>
					<th
						v-for="column in columns"
						:key="column.field"
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
						@click="column.sortable !== false && toggleSortDirection(column.field)">
						<div class="flex items-center space-x-1">
							<span>{{ column.label }}</span>
							<svg
								v-if="column.sortable !== false && sortBy === column.field"
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									v-if="sortDirection === SortDirection.Asc"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 15l7-7 7 7" />
								<path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</th>
				</tr>
			</thead>
			<tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
				<tr
					v-for="team in filteredAndSortedTeams"
					:key="team.id"
					@click="navigateToTeam(team.id)"
					class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
					:class="{ 'bg-blue-50 dark:bg-blue-900/20': favoriteTeamId === team.id }">
					<td class="px-6 py-4 whitespace-nowrap">
						<div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.position }}</div>
					</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<div class="flex items-center">
							<div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.name }}</div>
							<button
								@click="toggleFavoriteTeam(team, $event)"
								class="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
								:class="{
									'bg-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': favoriteTeamId === team.id,
									'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300': favoriteTeamId !== team.id,
								}"
								title="Set as favorite team">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
								</svg>
							</button>
						</div>
					</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.points }}</div>
					</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<div class="text-sm font-medium text-gray-900 dark:text-white">{{ gamesPlayed(team) }}</div>
					</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.wins }}</div>
					</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.draws }}</div>
					</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.losses }}</div>
					</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.goalsFor }}</div>
					</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<div class="text-sm font-medium text-gray-900 dark:text-white">{{ team.goalsAgainst }}</div>
					</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<RecentForm :recentForm="team.recentForm" />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
import { useTeamsStore } from '../stores/teams'
import { SortField, SortDirection } from '../types/enums'
import type { Team } from '../types'

const teamsStore = useTeamsStore()
const router = useRouter()

const sortBy = ref<SortField>(SortField.Position)
const sortDirection = ref<SortDirection>(SortDirection.Asc)

type ExtraNonSortField = 'played' | 'form'
type Column = { field: SortField | ExtraNonSortField; label: string; sortable?: boolean }

const columns: Column[] = [
	{ field: SortField.Position, label: 'Pos' },
	{ field: SortField.Name, label: 'Team' },
	{ field: SortField.Points, label: 'Points' },
	{ field: 'played', label: 'Played', sortable: false },
	{ field: SortField.Wins, label: 'W' },
	{ field: SortField.Draws, label: 'D' },
	{ field: SortField.Losses, label: 'L' },
	{ field: SortField.GoalsFor, label: 'GF' },
	{ field: SortField.GoalsAgainst, label: 'GA' },
	{ field: 'form', label: 'Form', sortable: false },
]

const favoriteTeamId = computed(() => teamsStore.favoriteTeamId)
const gamesPlayed = computed(() => teamsStore.gamesPlayed)

function isSortField(field: unknown): field is SortField {
	return typeof field === 'string' && (Object.values(SortField) as string[]).includes(field)
}

function toggleSortDirection(field: SortField | ExtraNonSortField) {
	if (!isSortField(field)) return
	if (sortBy.value === field) {
		sortDirection.value = sortDirection.value === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
	} else {
		sortBy.value = field
		sortDirection.value = SortDirection.Asc
	}
}

const filteredAndSortedTeams = computed<Team[]>(() => {
	let filtered = teamsStore.teams

	return [...filtered].sort((a, b) => {
		let comparison = 0

		if (sortBy.value === SortField.Name) {
			comparison = a.name.localeCompare(b.name)
		} else if (sortBy.value === SortField.Points) {
			comparison = a.points - b.points
		} else if (sortBy.value === SortField.Wins) {
			comparison = a.wins - b.wins
		} else if (sortBy.value === SortField.Draws) {
			comparison = a.draws - b.draws
		} else if (sortBy.value === SortField.Losses) {
			comparison = a.losses - b.losses
		} else if (sortBy.value === SortField.GoalsFor) {
			comparison = a.goalsFor - b.goalsFor
		} else if (sortBy.value === SortField.GoalsAgainst) {
			comparison = a.goalsAgainst - b.goalsAgainst
		} else {
			comparison = a.position - b.position
		}

		return sortDirection.value === SortDirection.Asc ? comparison : -comparison
	})
})

function navigateToTeam(teamId: number) {
	localStorage.setItem('lastVisitedTeamId', teamId.toString())
	router.push(`/teams/${teamId}`)
}

function toggleFavoriteTeam(team: Team, event: Event) {
	event.stopPropagation()

	if (teamsStore.favoriteTeamId === team.id) {
		teamsStore.setFavoriteTeam(null)
	} else {
		teamsStore.setFavoriteTeam(team.id)
	}
}
</script>

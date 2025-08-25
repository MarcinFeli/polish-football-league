<template>
	<div>
		<Loading v-if="isLoading && !team" />
		<div v-else-if="!team && !isLoading" class="text-center py-8">
			<p class="text-gray-500 dark:text-gray-400">Team not found</p>
			<NuxtLink
				to="/"
				class="mt-4 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
				Back to Teams
			</NuxtLink>
		</div>

		<div class="py-6" v-else>
			<div class="flex justify-between items-center mb-6">
				<NuxtLink
					to="/"
					class="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Back to Teams
				</NuxtLink>

				<button
					@click="toggleFavorite"
					class="flex items-center px-3 py-2 rounded-md transition-colors"
					:class="{
						'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': isFavorite,
						'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300': !isFavorite,
					}">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
					</svg>
					{{ isFavorite ? 'Favorite Team' : 'Set as Favorite' }}
				</button>
			</div>

			<TeamDetails :team="team" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useTeamsStore } from '~/stores/teams'

const route = useRoute()
const teamsStore = useTeamsStore()
const isLoading = computed(() => teamsStore.isLoading)

const teamId =
	computed(() => parseInt(route.params.id as string)) || (localStorage.getItem('lastViewedTeamId') as string)
console.log(teamId.value)
const team = computed(() => {
	if (!Number.isFinite(teamId.value)) return null
	return teamsStore.getTeamById(teamId.value)
})
const isFavorite = computed(() => teamsStore.favoriteTeamId === teamId.value)

function toggleFavorite() {
	if (isFavorite.value) {
		teamsStore.setFavoriteTeam(null)
	} else {
		teamsStore.setFavoriteTeam(teamId.value)
	}
}

onMounted(() => {
	console.log('wykonuje sie')
	teamsStore.ensureTeamsLoaded()
})
</script>

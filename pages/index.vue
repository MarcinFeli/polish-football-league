<template>
	<div>
		<Loading v-if="teamsStore.isLoading" />
		<div v-else>
			<div class="mb-6 flex justify-end">
				<button
					@click="showAddMatch = true"
					class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
					Add New Match
				</button>
			</div>

			<TeamTable class="mb-8" />
			<FavoriteTeamSection v-if="teamsStore.favoriteTeam" />
		</div>

		<AddMatchModal v-if="showAddMatch" @close="showAddMatch = false" @save="handleMatchAdded" />

		<div
			v-if="showSuccess"
			class="fixed bottom-4 right-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-3 rounded-lg shadow-lg">
			New match added successfully!
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useTeamsStore } from '~/stores/teams'

const teamsStore = useTeamsStore()

const showAddMatch = ref(false)
const showSuccess = ref(false)

onMounted(async () => {
	if (teamsStore.teams.length === 0) {
		await teamsStore.fetchTeams()
	}
	teamsStore.loadFavoriteTeam()
})

function handleMatchAdded() {
	showSuccess.value = true
	setTimeout(() => {
		showSuccess.value = false
	}, 3000)
}
</script>

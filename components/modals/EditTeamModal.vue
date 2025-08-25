<template>
	<BaseModal
		:title="t('modals.editTeamDetails')"
		:save-button-text="t('buttons.saveDetails')"
		@close="$emit('close')"
		@save="saveDetails">
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('teams.coach') }} </label>
				<input
					v-model="coach"
					type="text"
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					placeholder="Coach name" />
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('teams.stadium') }} </label>
				<input
					v-model="stadium"
					type="text"
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					placeholder="Stadium name" />
			</div>
		</div>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTeamsStore } from '~/stores/teams'
import type { Team } from '~/types'

const { t } = useI18n()

const props = defineProps<{
	team: Team
}>()

const emit = defineEmits(['close', 'save'])

const teamsStore = useTeamsStore()

const coach = ref('')
const stadium = ref('')

onMounted(() => {
	coach.value = props.team.coach
	stadium.value = props.team.stadium
})

function saveDetails() {
	teamsStore.updateTeamDetails(props.team.id, coach.value, stadium.value)
	emit('save')
	emit('close')
}
</script>

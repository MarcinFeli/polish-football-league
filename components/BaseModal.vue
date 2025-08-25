<template>
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
			<h3 class="text-xl font-bold mb-4 dark:text-white">{{ title }}</h3>
			<div class="mb-6">
				<slot></slot>
			</div>
			<div class="flex justify-end space-x-3">
				<slot name="footer">
					<button
						@click="$emit('close')"
						class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none">
						{{}}
						{{ t('buttons.cancel') }}
					</button>
					<button
						@click="$emit('save')"
						:disabled="saveDisabled"
						class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
						{{ saveButtonText }}
					</button>
				</slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const { t } = useI18n()
defineProps({
	title: {
		type: String,
		required: true,
	},
	saveButtonText: {
		type: String,
		default: 'Save',
	},
	saveDisabled: {
		type: Boolean,
		default: false,
	},
})

defineEmits(['close', 'save'])
</script>

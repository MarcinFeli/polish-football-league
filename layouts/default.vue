<template>
	<div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
		<header class="bg-white dark:bg-blue-800 shadow-md">
			<div class="container mx-auto px-4 py-4">
				<div class="flex justify-between items-center">
					<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Polish Football League</h1>
				</div>
			</div>
		</header>

		<main class="container mx-auto grow px-4 py-8">
			<slot />
		</main>

		<footer class="bg-gray-100 dark:bg-blue-800 py-6 mt-12">
			<div class="container mx-auto px-4">
				<div class="text-center text-gray-600 dark:text-gray-400">
					<p>© {{ new Date().getFullYear() }} Polish Football League. All rights reserved.</p>
					<p class="mt-2 text-sm">Data is for demonstration purposes only.</p>
				</div>
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { useTeamsStore } from '../stores/teams'

const store = useTeamsStore()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
	font-family: 'Inter', sans-serif;
}
</style>
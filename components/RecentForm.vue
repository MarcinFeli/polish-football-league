<template>
  <div class="flex space-x-1">
    <span 
      v-for="(result, index) in recentForm" 
      :key="index"
      class="w-6 h-6 flex items-center justify-center text-white text-xs font-bold rounded-full"
      :class="{
        'bg-green-500': result === 'W',
        'bg-red-500': result === 'L',
        'bg-yellow-500': result === 'D'
      }"
    >
      {{ result }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  recentForm: string[]
}>();


</script>
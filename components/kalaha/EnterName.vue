<template>
    <div>Enter Player Names</div>
    <label for="player-a">Player 1</label>
    <input id="player-a"
           type="text"
           v-model="playerA"
           class="border border-amber-600 rounded py-1 px-2" />
    <label for="player-b">Player 2</label>
    <input id="palyer-b"
           type="text"
           v-model="playerB"
           class="border border-blue-500 rounded py-1 px-2" />

    <button type="button"
            @click="() => emit('start', true)"
            class="bg-sky-500 text-white font-bold rounded py-3 px-4">
        Submit & Start
    </button>
</template>
<script setup lang="ts">
const playerA = defineModel('playerA');
const playerB = defineModel('palyerB');
const emit = defineEmits<{
    start: [boolean];
}>();
</script>
<template>
    <div class="bg-white flex flex-col gap-8">
        <div>Enter Player Names</div>
        <div>
            <label for="player-a" class="mr-2">Player 1</label>
            <input id="player-a"
                   type="text"
                   v-model="playerA"
                   placeholder="Player A"
                   class="border-2 border-amber-600 rounded p-2" />
        </div>
        <div>
            <label for="player-b" class="mr-2">Player 2</label>
            <input id="palyer-b"
                   type="text"
                   v-model="playerB"
                   placeholder="Player B"
                   class="border-2 border-blue-500 rounded p-2" />
        </div>
        <button type="button"
                @click="() => emit('start', true)"
                class="bg-sky-500 text-white font-bold rounded py-3 px-4">
            Submit & Start
        </button>
    </div>
</template>
<script setup lang="ts">
const playerA = defineModel<string>('playerA');
const playerB = defineModel<string>('playerB');
const emit = defineEmits<{
    start: [boolean];
}>();
</script>
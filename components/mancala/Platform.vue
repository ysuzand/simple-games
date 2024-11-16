<template>
    <div class="text-green-500">Mancala platform</div>
    <MancalaBoard player="a" :rowData="playerA" @selected="run" :selectedPit="selectedPit" />
    <MancalaBoard player="b" :rowData="playerB" @selected="run" :selectedPit="selectedPit" />
</template>
<script setup lang="ts">
import type { EmitSelectedPayloadType, PlayerBoardData, PlayerType } from './types';

const playerA = reactive({
    one: 4,
    two: 4,
    three: 4,
    four: 4,
    five: 4,
    six: 4,
    store: 0
});
const playerB = reactive({
    one: 4,
    two: 4,
    three: 4,
    four: 4,
    five: 4,
    six: 4,
    store: 0
});

const board: { [key in PlayerType]: PlayerBoardData } = {
    a: playerA,
    b: playerB
};
const selectedPit = ref<EmitSelectedPayloadType | null>(null);

const run = (payload: EmitSelectedPayloadType) => {
    selectedPit.value = payload;
    const { player, key } = payload;
    const holdStones = board[player][key];
    board[player][key] = 0;
    console.log(holdStones);

    // console.log(board.a === playerA);
};
</script>

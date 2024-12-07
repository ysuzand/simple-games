<template>
    <KalahaEnterName v-if="!hasStarted" v-model:playerA="first" v-model:palyerB="second"
                     @start="(val: boolean) => (hasStarted = val)" />
    <div v-else :class="[currentPlayer === 'a' ? 'bg-amber-200' : 'bg-blue-200']">
        <div class="text-green-500">Kalaha platform</div>
        <KalahaPitsRow whoseRow="a" :rowData="playerA" @selected="run" :selectedPit="selectedPit" />
        <KalahaPitsRow whoseRow="b" :rowData="playerB" @selected="run" :selectedPit="selectedPit" />
        <p>Current player: {{ currentPlayer === 'a' ? first : second }}</p>
        <div>
            <span v-for="stone in stonesUi">*</span>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { EmitSelectedPayloadType, PlayerBoardData, PlayerType } from './types';

const first = ref('Player A');
const second = ref('Player B');
const hasStarted = ref(false);

const currentPlayer = ref<PlayerType>('a');
provide('currentPlayer', currentPlayer);
const stonesPosition = reactive<PlayerBoardData>({
    1: 4,
    2: 4,
    3: 4,
    4: 4,
    5: 4,
    6: 4,
    7: 0, // store of A
    8: 4,
    9: 4,
    10: 4,
    11: 4,
    12: 4,
    13: 4,
    14: 0 // store of B
});

const pairedRows = [
    [1, 13],
    [2, 12],
    [3, 11],
    [4, 10],
    [5, 9],
    [6, 8],
    [7, 14] // stores
];

const playerA = computed(() => {
    const arrayA = Object.entries(stonesPosition).slice(0, 7);
    return Object.fromEntries(arrayA);
});

const playerB = computed(() => {
    const arrayB = Object.entries(stonesPosition).slice(7);
    return Object.fromEntries(arrayB);
});

const selectedPit = ref<EmitSelectedPayloadType | null>(null);

const lastPit = ref(0);

let timer: ReturnType<typeof setTimeout> | null = null;

// onUnmounted(() => {
//     if (!!timer) {
//         clearTimeout(timer);
//     }
// });

const stonesInHand = ref(0);
const stonesUi = computed(() => Array.from({ length: stonesInHand.value }));

const _handleRotation = async (selectedPit: `${number}`) => {
    // Hold stones in hand.
    stonesInHand.value = stonesPosition[selectedPit];
    // Empty pit where you pick up stones.
    stonesPosition[selectedPit] = 0;

    let pitToSaw = +selectedPit + 1;
    const tempPitIndex = +selectedPit + stonesInHand.value;
    lastPit.value = tempPitIndex > 14 ? tempPitIndex % 14 : tempPitIndex;

    const timer = setInterval(async () => {
        if (stonesInHand.value === 0) {
            clearInterval(timer);
            return;
        }
        console.log(stonesInHand.value);
        console.log(`pit to saw: ${pitToSaw}`);
        if (currentPlayer.value === 'a' && pitToSaw === 14) {
            pitToSaw = 1;
        } else if (currentPlayer.value === 'b' && pitToSaw === 7) {
            pitToSaw++;
        } else {
            // place a stone to each pit.
            stonesPosition[`${pitToSaw}`] += 1;

            if (pitToSaw === 14) {
                pitToSaw = 1;
            } else {
                pitToSaw++;
            }

            stonesInHand.value--;
        }
    }, 800);
};

const _findPairPit = () => {
    if (lastPit.value > 7) {
        return pairedRows.find((pair) => pair[1] === lastPit.value)?.[0];
    }
    return pairedRows.find((pair) => pair[0] === lastPit.value)?.[1];
};

const _isFinishInStore = () => {
    return lastPit.value === 7 || lastPit.value === 14;
};

const _checkIfYouTakeOpponentStones = () => {
    if (stonesPosition[`${lastPit.value}`] === 1) {
        const pairedPit = _findPairPit();
        return pairedPit ? pairedPit : null;
    }
    return null;
};

const _checkTurn = () => {
    let turn = currentPlayer.value;

    if (turn === 'a' && lastPit.value !== 7) {
        return 'b';
    }

    if (turn === 'b' && lastPit.value !== 14) {
        return 'a';
    }

    return turn;
};

const _pickUpOpponentStonesToAddYourStore = (opponentPit: number | null) => {
    if (opponentPit) {
        const pickOpponentStones = stonesPosition[`${opponentPit}`];
        stonesPosition[`${opponentPit}`] = 0;
        if (currentPlayer.value === 'a') {
            stonesPosition['7'] += pickOpponentStones;
        } else {
            stonesPosition['14'] += pickOpponentStones;
        }
    }
};

watch(stonesInHand, (val) => {
    if (val === 0) {
        // When the player finishes placing stone,
        // check if the last stone was placed in an empty pit.
        if (!_isFinishInStore()) {
            const check = _checkIfYouTakeOpponentStones();
            _pickUpOpponentStonesToAddYourStore(check);
        }
        // Check if players should be changed.
        currentPlayer.value = _checkTurn();
    }
});

const run = async ({ pitPosition }: EmitSelectedPayloadType) => {
    _handleRotation(pitPosition);
};
</script>

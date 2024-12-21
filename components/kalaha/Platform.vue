<template>
    <div :class="[
        currentPlayer === 'a' ? 'bg-amber-200' : 'bg-blue-200',
        !hasStarted && 'bg-white']"
         class="flex  justify-center">
        <KalahaEnterName v-if="!hasStarted" v-model:playerA="first" v-model:palyerB="second"
                         @start="(val: boolean) => (hasStarted = val)" />
        <div v-else class="w-fit">
            <div class="text-green-500">Kalaha</div>
            <div v-if="hasWinner">Game over: {{ hasWinner === 'a' ? first : second }} won!</div>
            <div class="flex h-8 gap-2">
                <div v-for="stone in stonesUi" class="w-4 h-4 bg-purple-800 rounded-full"></div>
            </div>
            <KalahaPitsRow whoseRow="a" :rowData="playerRowA" @selected="run" :selectedPit="selectedPit" />
            <KalahaPitsRow whoseRow="b" :rowData="playerRowB" @selected="run" :selectedPit="selectedPit" />
            <KalahaAvatartsTogglePlayer :playerName="{ a: first, b: second }" :hasWinner="hasWinner" />
        </div>
    </div>
</template>
<script setup lang="ts">
import type { EmitSelectedPayloadType, PlayerBoardData, PlayerType } from './types';

const first = ref('Player A');
const second = ref('Player B');
const hasStarted = ref(false);
const STONES_PER_PIT = 4;
const currentPlayer = ref<PlayerType>('a');
provide('currentPlayer', currentPlayer);
const stonesPosition = reactive<PlayerBoardData>({
    1: STONES_PER_PIT,
    2: STONES_PER_PIT,
    3: STONES_PER_PIT,
    4: STONES_PER_PIT,
    5: STONES_PER_PIT,
    6: STONES_PER_PIT,
    7: 0, // store of A
    8: STONES_PER_PIT,
    9: STONES_PER_PIT,
    10: STONES_PER_PIT,
    11: STONES_PER_PIT,
    12: STONES_PER_PIT,
    13: STONES_PER_PIT,
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

const playerRowA = computed(() => {
    const arrayA = Object.entries(stonesPosition).slice(0, 7);
    return Object.fromEntries(arrayA);
});

const playerRowB = computed(() => {
    const arrayB = Object.entries(stonesPosition).slice(7);
    return Object.fromEntries(arrayB);
});

const selectedPit = ref<EmitSelectedPayloadType | null>(null);
const lastPit = ref(0);
const stonesInHand = ref(0);
const stonesUi = computed(() => Array.from({ length: stonesInHand.value }));
const playCount = ref(0);
const hasWinner = ref<PlayerType | null>(null);

const _handleRotation = async (selectedPit: `${number}`, gameOverCheck?: () => PlayerType | null) => {
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
            if (gameOverCheck) {
                hasWinner.value = gameOverCheck();
            }

            return;
        }

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
    }, 200);
};

const _findPairPit = () => {
    if (lastPit.value < 7) {
        return pairedRows.find((pair) => pair[0] === lastPit.value)?.[1];
    }

    if (lastPit.value >= 8) {
        return pairedRows.find((pair) => pair[1] === lastPit.value)?.[0];
    }

    return null;
};

const _isFinishInStore = () => {
    return lastPit.value === 7 || lastPit.value === 14;
};

const _isEligibleToTakeOppoinentStones = () => {
    // In case of player A:
    if (currentPlayer.value === 'a') {
        return lastPit.value < 7;
    }

    // In case of player B:
    return lastPit.value >= 8 && lastPit.value !== 14;
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
        if (!_isFinishInStore() && _isEligibleToTakeOppoinentStones()) {
            console.log('Take opponents stones');
            const check = _checkIfYouTakeOpponentStones();
            console.log(`take this pit: ${check}`);
            _pickUpOpponentStonesToAddYourStore(check);
        }
        // Check if players should be changed.
        currentPlayer.value = _checkTurn();
    }
});

const _checkIfRowIsEmpty = () => {
    const rowA = Object.values(playerRowA.value).slice(0, 6);
    const rowB = Object.values(playerRowB.value).slice(0, 6);

    const isFinish = !(rowA.some(stonesInPit => stonesInPit !== 0) && rowB.some(stonesInPit => stonesInPit !== 0));
    if (isFinish) {
        return stonesPosition['7'] > stonesPosition['14'] ? 'a' : 'b';
    }

    return null;
};

const run = async ({ pitPosition }: EmitSelectedPayloadType) => {
    if (playCount.value < 1) {
        _handleRotation(pitPosition);
    } else {
        _handleRotation(pitPosition, _checkIfRowIsEmpty);
    }
    playCount.value++;
};
</script>

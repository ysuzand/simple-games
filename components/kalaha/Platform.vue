<template>
    <div :class="[
        currentPlayer === 'a' ? 'bg-amber-200' : 'bg-blue-200',
        !hasStarted && 'bg-white']"
         class="flex  justify-center">
        <KalahaEnterName v-if="!hasStarted" v-model:playerA="first" v-model:playerB="second"
                         @start="(val: boolean) => (hasStarted = val)" />
        <div v-else class="w-fit">
            <div class="text-green-500">Kalaha</div>
            <Button v-show="!!hasWinner" type="button" class="h-12 mb-2" @click="hasStarted = false">Reset</Button>
            <div v-if="hasWinner">Game over: {{ hasWinner === 'a' ? first : second }} won!</div>
            <div class="flex h-8 gap-2">
                <div v-for="stone in stonesUi"><img src="/public/assets/coin.svg" /></div>
            </div>
            <KalahaPitsRow whoseRow="a" :rowData="playerRowA" @selected="run" :selectedPit="selectedPit"
                           :is-disabled="!!hasWinner" />
            <KalahaPitsRow whoseRow="b" :rowData="playerRowB" @selected="run" :selectedPit="selectedPit"
                           :is-disabled="!!hasWinner" />
            <KalahaAvatartsTogglePlayer :playerName="{ a: first, b: second }" :hasWinner="hasWinner" />
        </div>
    </div>
</template>
<script setup lang="ts">
import type { EmitSelectedPayloadType, PlayerBoardData, PlayerType } from './types';
import { useKalahaPlatform } from './composables/useKalahaPlatform';
const { first, second, hasStarted, currentPlayer, stonesPosition, playerRowA, playerRowB, pairedRows } = useKalahaPlatform();

provide('currentPlayer', currentPlayer);

const selectedPit = ref<EmitSelectedPayloadType | null>(null);
const lastPit = ref(0);
const stonesInHand = ref(0);
const stonesUi = computed(() => Array.from({ length: stonesInHand.value }));
const playCount = ref(0);
const hasWinner = ref<PlayerType | null>(null);

const _handleRotation = async (
    selectedPit: `${number}`,
    gameOverCheck?: () => void,
) => {
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
                gameOverCheck();
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

const _isEndedUpInStore = () => {
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
        if (!_isEndedUpInStore() && _isEligibleToTakeOppoinentStones()) {
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

    return !(rowA.some(stonesInPit => stonesInPit !== 0) && rowB.some(stonesInPit => stonesInPit !== 0));
};

const _handleGameOver = () => {
    const res = _checkIfRowIsEmpty();

    let totalA = 0;
    let totalB = 0;
    let result = null;

    if (res) {
        totalA = Object.values(playerRowA.value).reduce((total, stones) => total + stones, 0);
        totalB = Object.values(playerRowB.value).reduce((total, stones) => total + stones, 0);

        result = totalA > totalB ? 'a' : 'b' as PlayerType;

        // Prepare for the final result.
        stonesPosition['7'] = 0;
        stonesPosition['14'] = 0;
    }

    // Count up the final result in the UI.
    const timer = setInterval(() => {
        if (totalA > 0) {
            stonesPosition['7'] += 1;
            totalA--;
        }

        if (totalB > 0) {
            stonesPosition['14'] += 1;
            totalB--;
        }

        if (!(totalA || totalB)) {
            clearInterval(timer);
            hasWinner.value = result;
        }
    }, 300);
};

const run = async ({ pitPosition }: EmitSelectedPayloadType) => {
    if (playCount.value < 1) {
        _handleRotation(pitPosition);
    } else {
        _handleRotation(pitPosition, _handleGameOver);
    }
    playCount.value++;
};
</script>

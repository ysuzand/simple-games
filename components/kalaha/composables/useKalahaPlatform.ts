import type { EmitSelectedPayloadType, PlayerBoardData, PlayerType } from '@/components/kalaha/types';
import { ref, computed, reactive } from 'vue';

const STONES_PER_PIT = 4;

export function useKalahaPlatform() {
    const first = ref('');
    const second = ref('');
    const hasStarted = ref(false);
    const currentPlayer = ref<PlayerType>('a');
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

    return {
        first,
        second,
        hasStarted,
        currentPlayer,
        stonesPosition,
        playerRowA,
        playerRowB,
        pairedRows,
    };
}
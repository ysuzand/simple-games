<template>
    <ol class="flex"
        :class="[whoseRow === 'b' ? 'flex-row-reverse justify-end' : 'pl-24']">
        <li v-for="(value, pitPosition) in rowData">
            <button v-if="!store.includes(pitPosition)"
                    type="button"
                    class="border rounded flex flex-col justify-center items-center w-24 h-24"
                    :class="[(selectedPit?.pitPosition === pitPosition)
                        ? 'bg-green-300'
                        : 'bg-white',
                    error?.pitPosition === pitPosition && currentPlayer !== error.whoseRow && 'bg-red-400',
                    whoseRow === 'b' ? 'border border-blue-500' : 'border border-amber-600'
                    ]"
                    :ariaLabel="'pit id of ' + pitPosition"
                    @click="() => run({ whoseRow, pitPosition })">
                <div>{{ whoseRow }}: pit: {{ pitPosition }}</div>
                <div class="text-xl font-bold">{{ value }}</div>
            </button>
            <div v-else class="border rounded flex flex-col justify-center items-center w-24 bg-slate-600 text-white">
                <div>{{ whoseRow }}: store: {{ pitPosition }}</div>
                <div class="text-xl font-bold">{{ value }}</div>
            </div>
        </li>
    </ol>
</template>
<script setup lang="ts">
import type { EmitSelectedPayloadType, PlayerBoardData, PlayerType } from './types';

const store = ['7', '14'];

defineProps<{
    whoseRow: PlayerType;
    rowData: Record<keyof PlayerBoardData, number>;
    selectedPit: EmitSelectedPayloadType | null;
}>();

const emit = defineEmits<{
    selected: [EmitSelectedPayloadType];
}>();

const currentPlayer = inject('currentPlayer');
const error = ref<EmitSelectedPayloadType | null>(null);

const run = async (payload: EmitSelectedPayloadType) => {
    await nextTick(); // Wait the currentPlayer is updated.
    if (payload.whoseRow !== unref(currentPlayer)) {
        error.value = payload;
    } else {
        error.value = null;
        emit('selected', payload);
    }
};
</script>
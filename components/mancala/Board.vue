<template>
    <ol class="flex" :class="[player === 'a' ? 'flex-row-reverse justify-end' : 'pl-24']">
        <li v-for="(value, key) in rowData"
            :class="[key === 'store' && 'bg-gray-100']">
            <button type="button"
                    class="border rounded flex justify-center items-center w-24 h-24"
                    :class="[(selectedPit?.key === key && selectedPit.player === player) ? 'bg-green-300' : 'bg-white']"
                    :ariaLabel="'pit id of ' + key"
                    @click="() => run({ player, key })">
                {{ value }}: {{ player }}: {{ key }}
            </button>
        </li>
    </ol>
</template>
<script setup lang="ts">
import type { EmitSelectedPayloadType, PlayerBoardData, PlayerType } from './types';

defineProps<{
    player: PlayerType;
    rowData: Record<keyof PlayerBoardData, number>;
    selectedPit: EmitSelectedPayloadType | null;
}>();

const emit = defineEmits<{
    selected: [EmitSelectedPayloadType];
}>();

const run = (payload: EmitSelectedPayloadType) => {
    console.log('clicked', emit('selected', payload));

    emit('selected', payload);
};
</script>
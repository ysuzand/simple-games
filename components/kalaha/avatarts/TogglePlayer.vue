<template>
    <div class="relative h-80">
        <Transition mode="out-in">
            <div v-if="currentPlayer === 'a'" class="absolute flex mt-6">
                <KalahaAvatartsPlayerA />
                <div v-show="!hasWinner"
                     class="pop type-a bg-white border border-orange-400 h-fit py-3 px-6 rounded-md">
                    It's your turn, {{ playerName.a }}
                </div>
            </div>
            <div v-else class="absolute flex mt-6">
                <KalahaAvatartsPlayerB />
                <div v-show="!hasWinner" class="pop type-b bg-white border border-blue-400 h-fit py-3 px-6 rounded-md">
                    It's your turn, {{ playerName.b }}
                </div>
            </div>
        </Transition>
    </div>
</template>
<script setup lang="ts">
import type { PlayerType } from '@/components/kalaha/types';
const currentPlayer = inject('currentPlayer');
defineProps<{
    playerName: {
        a: string;
        b: string;
    };
    hasWinner: PlayerType | null;
}>();
</script>
<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
    transform: translateY(0);
    transition: all 0.6s ease;
}

.v-enter-from,
.v-leave-to {
    transform: translateY(3rem);
    opacity: 0;
}

.pop {
    position: relative;

    &::before {
        content: '';
        display: block;
        width: 0.75rem;
        height: 0.75rem;
        background-color: white;
        position: absolute;
        left: -0.4rem;
        top: 1rem;
        transform: rotate(45deg);
    }

    &.type-a::before {
        border-left: 1px solid orange;
        border-bottom: 1px solid orange;
    }

    &.type-b::before {
        border-left: 1px solid rgb(96, 165, 250);
        border-bottom: 1px solid rgb(96, 165, 250);
    }
}
</style>
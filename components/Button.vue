<template>
	<component :is="tag"
						 class="rounded text-blue-100 text-xl font-bold py-4 px-8">
		<slot />
	</component>
</template>
<script setup lang="ts">
const props = withDefaults(defineProps<{
	tag?: 'button' | 'a';
}>(), {
	tag: 'button'
});

const attr = {
	button: { type: 'button' },
};
</script>
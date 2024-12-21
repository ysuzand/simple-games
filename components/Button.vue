<template>
	<component :is="tag"
			   class="rounded text-xl font-bold py-2 px-8 border border-slate-500">
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
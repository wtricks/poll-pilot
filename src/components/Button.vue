<script setup lang="ts">
import { computed } from 'vue';

// Props
const props = defineProps<{
    variant: 'primary' | 'secondry',
    path?: string
}>();

const buttonStyles = computed(() => {
    const baseClasses = `text-sm font-medium p-2 px-3 rounded-full select-none :disabled:cursor-not-allowed outline-none border border-transparent active:scale-95 transition-transform inline-flex items-center`;

    const primaryClasses = `bg-blue-600 text-white hover:bg-blue-500`
    const seconryClasses = `hover:bg-slate-100 hover:border-slate-200 text-slate-950`;

    const variantClasses = props.variant == 'primary'
        ? primaryClasses
        : seconryClasses;

    return [baseClasses, variantClasses];
})


</script>
<template>
    <button v-if="!path" :class="buttonStyles">
        <slot />
    </button>

    <RouterLink v-else :to="path" :class="buttonStyles">
        <slot />
    </RouterLink>
</template>
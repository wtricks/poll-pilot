<script setup lang="ts">

const model = defineModel<string>()
    
defineProps<{
    type: 'text' | 'email' | 'textarea' | 'select' | 'password',
    label?: string,
    id?: string,
    options?: string[]
}>();

const baseClasses = `p-2 px-2.5 border border-slate-300 rounded-full text-sm font-medium text-slate-800 outline-none focus:ring focus:ring-blue-600`;

</script>

<template>
    <label v-if="label" :for="id" class="text-sm font-medium block mb-1 ml-1">
        {{ label  }}
    </label>

    <textarea v-model="model" v-if="type == 'textarea'" :id="id" :class="[baseClasses, 'resize-y rounded-2xl px-2']" v-bind="$attrs"></textarea>

    <select v-model="model" v-else-if="type == 'select'" :id="id" :class="baseClasses">
        <option v-for="option of options" :key="option">
            {{ option }}
        </option>
    </select>

    <input v-model="model" v-else :id="id" :type="type" :class="baseClasses" v-bind="$attrs" />

</template>
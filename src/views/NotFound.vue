<script setup lang="ts">
import Emoji from '../components/icons/emoji.vue';
import Button from '../components/Button.vue'
</script>

<template>
    <div class="min-h-screen container p-3 flex flex-col justify-center items-center">
        <Emoji class="size-20" />
        <h2 class="font-bold text-[2rem] text-center">404 not found</h2>
        <p class="text-sm text-slate-700 text-center">The page you're looking for, is not found</p>

        <Button variant="primary" class="mt-12" path="/">
            Go to main page
        </Button>
    </div>
</template>
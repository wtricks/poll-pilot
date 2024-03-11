<script setup lang="ts">
import useAlertStore from '../store/useAlert';

import Cross from './icons/Cross.vue';

const { messages, close } = useAlertStore();
</script>

<template>
    <Teleport to="body">
        <div class="fixed bottom-4 left-4 backdrop-blur-md z-40">
            <div v-for="message of messages" :key="message.id" class="mb-2 flex items-center bg-slate-950 rounded-full p-2 shadow-md px-3 transition-transform">
                <p class="text-white text-sm font-medium">{{message.message}}</p>

                <button @click="close(message.id)" variant="secondry" class="hover:bg-slate-500 ml-2 hover:border-transparent transition-colors p-1 rounded-full">
                    <Cross class="size-6" />
                </Button>
            </div>
        </div>
    </Teleport>
</template>
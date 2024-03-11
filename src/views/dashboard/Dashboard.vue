<script setup lang="ts">
import PageHeader from '../../components/PageHeader.vue';

const activeClasses = `!text-blue-600 bg-slate-100`

</script>

<template>
    <PageHeader />

    <div class="container mx-auto flex mt-3">
        <div class="max-w-[272px] p-2 px-3 w-full mr-5 sticky top-0">
            <RouterLink to="/dashboard/polls" class="p-3 border w-full block rounded-full text-sm font-semibold px-4 text-slate-800 hover:bg-slate-50 mb-2" :exact-active-class="activeClasses">
                Polls
            </RouterLink>
            <RouterLink to="/dashboard/users" class="p-3 border w-full block rounded-full text-sm font-semibold px-4 text-slate-800 hover:bg-slate-50 mb-2" :exact-active-class="activeClasses">
                Users
            </RouterLink>
        </div>

        <div class="w-full">
            <RouterView />
        </div>
    </div>
</template>
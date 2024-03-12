<script setup lang="ts">
import useUsers from '../../store/useUsers';

const users = useUsers()

</script>

<template>
    <div class="flex items-center justify-between w-full mb-5">
        <h2 class="text-2xl font-semibold">Users</h2>
    </div>

    <table class="w-full">
        <thead>
            <tr class="w-full border">
                <th class="p-1 font-bold text-sm">Name</th>
                <th class="p-1 font-bold text-sm">Username</th>
                <th class="p-1 font-bold text-sm">Email</th>
                <th class="p-1 font-bold text-sm">RegisteredAt</th>
            </tr>
        </thead>
        <tbody>
            <tr class="w-full border hover:bg-slate-100" v-for="user of users.users" :key="user.uid">
                <td class="p-1 text-sm">{{user.fname}}</td>
                <td class="p-1 text-sm">{{user.username}}</td>
                <td class="p-1 text-sm">{{user.email}}</td>
                <td class="p-1 text-sm">{{user.registeredAt}}</td>
            </tr>
        </tbody>
    </table>
    <p v-if="users.users.length == 0" class="mt-12 text-lg text-center font-sans">
        No users found
    </p>
</template>
<script setup lang="ts">
import Button from '../../components/Button.vue';
import useAuth from '../../store/useAuth';
import useUsers from '../../store/useUsers';

const users = useUsers()
const {user: u}= useAuth()

</script>

<template>
    <div class="flex items-center justify-between w-full mb-5">
        <h2 class="text-2xl font-semibold">Users</h2>
    </div>

    <ul class="list-none w-full">
        <li v-for="user in users.users" class="border p-2 bg-slate-50 hover:bg-slate-100 mb-2 rounded-xl flex items-center">
            <p class="text-sm">
                <b class="mr-2">Name:</b>
                <span>{{  user.fname  }}</span>
                <br>

                <b class="mr-2">Email:</b>
                <span>{{  user.email  }}</span>
                <br>

                <b class="mr-2">Resgisered:</b>
                <span>{{  new Date(user.createdAt)  }}</span>
            </p>

            <Button v-if="u.id != user.id" variant="secondry" class="ml-auto" @click="users.removeUser(user.id)">
                Remove
            </Button>
        </li>
    </ul>
</template>
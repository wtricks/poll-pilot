<script setup lang="ts">
import { ref } from 'vue';

import Input from '../../components/Input.vue'
import Button from '../../components/Button.vue'
import useAlertStore from '../../store/useAlert';
import useUsers from '../../store/useUsers';
import useAuth from '../../store/useAuth';
import { useRouter } from 'vue-router';

const email = ref('')
const password = ref('')

const { show } = useAlertStore();
const router = useRouter();

const onSignIn = () => {
    if (!email.value) {
        show('Email is required.')
    }

    else if (!password.value) {
        show('Password is required.')
    }

    else {
        const users = useUsers();
        const user = users.findBy('email', email.value);

        if (!user || user.password != password.value) {
            show('Invalid credentials.')
        }

        else {
            users.addUser(user.fname, user.email, user.password as string);
            useAuth().changeUser(user);

            show('Logged in successfully.');
            router.push('/')
        }
    }
}

</script>

<template>
    <h2 class="text-2xl font-bold text-slate-950 text-center">Welcome back</h2>
    <p class="text-sm font-normal text-slate-800 text-center mt-1">Login to your account to continue.</p>

    <form action="/" method="post" class="w-full px-3 mt-8" @submit.prevent="onSignIn">

        <Input 
            type="email"
            placeholder="ex. example@site.com"
            label="Email address"
            class="mb-3 w-full"
            v-model="email"
            required
        />

        <Input 
            type="password"
            label="Password"
            class="mb-3 w-full"
            v-model="password"
            required
        />

       <RouterLink to="/auth/forgot" class="text-blue-600 text-sm text-end hover:text-blue-500 block" title="Forgot password?">Forgot password?</RouterLink>

        <Button variant="primary" class="w-full justify-center mt-8">
            Sign In
        </Button>

        <p class="text-sm text-center mt-3">
            Don't have an account <RouterLink to="/auth/signup" class="text-blue-600 hover:text-blue-500" title="Terms and conditions">Sign Up</RouterLink>
        </p>
    </form>
</template>
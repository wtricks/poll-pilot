<script setup lang="ts">
import { ref } from 'vue';

import Input from '../../components/Input.vue'
import Button from '../../components/Button.vue'
import useAlertStore from '../../store/useAlert';
import useUsers from '../../store/useUsers';

const email = ref('')
const { show } = useAlertStore()

const onForgot = () => {
    if (!email.value) {
        show('Email address is required.')
    }

    else {
        const user = useUsers().findBy('email', email.value);
        if (!user) {
            show('Invalid credentials')
            return
        }

        const token = Math.random() + '';
        useUsers().addUser(user.fname, user.email, user.password as string, token);

        console.log("/auth/reset/" + token);

        show('We have send a link to your registered email address.')
    }
}

</script>

<template>
    <h2 class="text-2xl font-bold text-slate-950 text-center">Forgot password?</h2>
    <p class="text-sm font-normal text-slate-800 text-center mt-1">Don't worry we'll help you to restore your password.</p>

    <form action="/" method="post" class="w-full px-3 mt-8" @submit.prevent="onForgot">

        <Input 
            type="email"
            placeholder="ex. example@site.com"
            label="Email address"
            class="mb-3 w-full"
            v-model="email"
            required
        />

        <Button variant="primary" class="w-full justify-center mt-8">
            Send link
        </Button>

        <p class="text-sm text-center mt-3">
            Back to <RouterLink to="/auth/signin" class="text-blue-600 hover:text-blue-500" title="Terms and conditions">Signin</RouterLink>
        </p>
    </form>
</template>
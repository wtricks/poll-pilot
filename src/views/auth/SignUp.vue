<script setup lang="ts">
import { ref } from 'vue';
import useAlertStore from '../../store/useAlert'
import useUsers from '../../store/useUsers'

import Input from '../../components/Input.vue'
import Button from '../../components/Button.vue'
import { useRouter } from 'vue-router';

const fname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const { show } = useAlertStore()
const router = useRouter();

const onSignUp = () => {
    if (!fname.value) {
        show('Name is required.')
    }

    else if (!email.value) {
        show('Email is required.')
    }

    else if (!password.value) {
        show('Password is required.')
    }

    else if (!confirmPassword.value) {
        show('Confirm password is required.')
    }

    else if (password.value != confirmPassword.value) {
        show('Confirm password doesn\'t match.')
    }

    else {
        const { findBy, addUser } = useUsers();

        if (findBy('email', email.value)) {
            show('Email address is already taken.')
            return
        }

        addUser(fname.value, email.value, password.value);

        fname.value = email.value = password.value = confirmPassword.value = '';
        show('Your account is created, Sign in now.')

        setTimeout(() => {
            router.push('/auth/signin')
        }, 2000)
    }

}

</script>

<template>
    <h2 class="text-2xl font-bold text-slate-950 text-center">Get started</h2>
    <p class="text-sm font-normal text-slate-800 text-center mt-1">Join us to vote and share polls.</p>

    <form action="/" method="post" class="w-full px-3 mt-8" @submit.prevent="onSignUp">
        <Input 
            type="text"
            placeholder="ex. Anuj Kumar"
            label="Full name"
            class="mb-3 w-full"
            v-model="fname"
            required
        />

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

        <Input 
            type="password"
            label="Confirm password"
            class="mb-3 w-full"
            v-model="confirmPassword"
            required
        />


        <p class="text-sm text-center mt-1">
            By creating account, you agree to our <RouterLink to="/pages/terms" class="text-blue-600 hover:text-blue-500" title="Terms and conditions">terms</RouterLink> and <RouterLink to="/pages/terms" class="text-blue-600 hover:text-blue-500" title="Privacy Policy">privacy</RouterLink>.
        </p>

        <Button variant="primary" class="w-full justify-center mt-8">
            Sign Up
        </Button>

        <p class="text-sm text-center mt-3">
            Already have an account <RouterLink to="/auth/signin" class="text-blue-600 hover:text-blue-500" title="Terms and conditions">Sign In</RouterLink>
        </p>
    </form>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import Input from '../../components/Input.vue'
import Button from '../../components/Button.vue'
import { useRoute, useRouter } from 'vue-router';
import useUsers from '../../store/useUsers';
import useAlertStore from '../../store/useAlert';
import { User } from '../../store/useUsers';

const password = ref('')
const confirmPassword = ref('')

const route = useRoute();
const router = useRouter();
const { findBy, addUser } = useUsers()
const { show } = useAlertStore()

if (!findBy('token', route.params.id as string)) {
    router.replace('/auth/signin');
    show('Password reset link is expired!.')
}

const onReset = () => {
    if (!password.value) {
        show('Password is required')
    }

    else if (!password.value) {
        show('Confirm password is required')
    }

    else if (confirmPassword.value != password.value) {
        show('Confirm password doesn\' match.')
    }

    else {
        const user = findBy('token', route.params.id as string) as User;
        addUser(user.fname, user.email, password.value, '');

        show('You password was reseted!')
        setTimeout(() => {
            router.push('/auth/signin')
        }, 1000)
    }
}

</script>

<template>
    <h2 class="text-2xl font-bold text-slate-950 text-center">Reset password</h2>
    <p class="text-sm font-normal text-slate-800 text-center mt-1">Choose a difficult and unguessable password.</p>

    <form action="/" method="post" class="w-full px-3 mt-8" @submit.prevent="onReset">

        <Input 
            type="password"
            label="New password"
            class="mb-3 w-full"
            v-model="password"
        />

        <Input 
            type="password"
            label="New password"
            class="mb-3 w-full"
            v-model="confirmPassword"
        />

        <Button variant="primary" class="w-full justify-center mt-8">
            Reset
        </Button>

        <p class="text-sm text-center mt-3">
            Back to <RouterLink to="/auth/signin" class="text-blue-600 hover:text-blue-500" title="Terms and conditions">Signin</RouterLink>
        </p>
    </form>
</template>
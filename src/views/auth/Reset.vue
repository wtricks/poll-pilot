<script setup lang="ts">
import { onMounted, ref } from 'vue';

import Input from '../../components/Input.vue'
import Button from '../../components/Button.vue'
import { useRoute, useRouter } from 'vue-router';
import useAlertStore from '../../store/useAlert';
import { getDocs, query, collection, where, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { updatePassword } from 'firebase/auth';

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const route = useRoute();
const router = useRouter();
const { show } = useAlertStore()

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
        loading.value = true;
        updatePassword(auth.currentUser!, password.value)
            .then(() => {
                router.push('/auth/signin')
                show('You password was reseted!')
            })
            .catch((err: Error) => {
            show('An error occured: ' + err.message)
            }).finally(() => {
            loading.value = false;
        })
    }
}

onMounted(async () => {
    const token = route.params.id;
    if (!token) {
        show('Link is expired.')
        router.push({ name: 'signin' })
        return
    }

    const data = await getDocs(query(collection(db, 'users'), where('token', '==', token)));

    if (!data.empty) {
        await setDoc(doc(db, 'users', data.docs[0].id), { token: '' }, { merge: true });
    } else {
        show('Link is expired.')
        router.push({ name: 'signin' })
    }
})

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

        <Button variant="primary" class="w-full justify-center mt-8" :disabled="loading">
            Reset
        </Button>

        <p class="text-sm text-center mt-3">
            Back to <RouterLink to="/auth/signin" class="text-blue-600 hover:text-blue-500" title="Terms and conditions">Signin</RouterLink>
        </p>
    </form>
</template>collection, doc, , setDoc, whereimport { User } from 'firebase/auth';
import { db } from '../../firebase';

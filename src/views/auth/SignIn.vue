<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import Input from '../../components/Input.vue'
import Button from '../../components/Button.vue'
import useAlertStore from '../../store/useAlert';
import { signIn } from '../../store/useAuth';
import { useRouter } from 'vue-router';

import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

// router params
const route = useRoute();

const email = ref('')
const password = ref('')
const loading = ref(false)

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
        loading.value = true;
        signIn(email.value, password.value, (done) => {
            if (done) {
                show('Logged in successfully.');
                router.push('/')
            }
            loading.value = false;
        })
    }
}

onMounted(async () => {
    const q = route.query.token;
    if (q) {
        const data = await getDocs(query(collection(db, 'users'), where('token', '==', q)));

        if (!data.empty) {
            await setDoc(doc(db, 'users', data.docs[0].id), { token: '', isVerified: true }, { merge: true });

            show('Email address is verified, you can signin.')
        }
    }
})

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

        <Button variant="primary" class="w-full justify-center mt-8" :disabled="loading">
            Sign In
        </Button>

        <p class="text-sm text-center mt-3">
            Don't have an account <RouterLink to="/auth/signup" class="text-blue-600 hover:text-blue-500" title="Terms and conditions">Sign Up</RouterLink>
        </p>
    </form>
</template>
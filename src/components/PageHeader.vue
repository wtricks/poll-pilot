<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import useAuth from '../store/useAuth';
import Button from './Button.vue';
import Poll from './icons/Poll.vue';
import useAlertStore from '../store/useAlert';

const route = useRoute()
const router = useRouter();
const { show } = useAlertStore() 
const auth = useAuth()

const onLogout = () => {
    useAuth().changeUser(null!);
    show('Logged out successfully')

    setTimeout(() => {
        router.push('/auth/signin')
    }, 1000)
}
</script>

<template>
    <header class="w-full flex items-center border-b p-2 bg-slate-50 backdrop-blur-sm sticky top-0 z-30">
        <div class="container mx-auto flex items-center">
            <RouterLink 
                to="/" 
                class="font-bold text-lg flex items-center" 
                title="PollPilot logo">
                <Poll class="fill-blue-600 mr-2 size-8" />
                PollPilot
            </RouterLink>

            <div class="ml-auto flex items-center">
                <Button title="Logout" class="mr-4" variant="primary" v-if="auth.user?.isAdmin" :path="route.name == 'home'? '/dashboard/polls' : '/'">
                    {{ route.name == 'home' ? 'Dashboard' : 'HomePage' }}
                </Button>

                <Button title="Logout" variant="secondry" @click="onLogout">
                    Log out
                </Button>
            </div>
        </div>
    </header>
</template>
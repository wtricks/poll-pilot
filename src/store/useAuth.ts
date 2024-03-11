import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import type { User } from './useUsers'

const useAuth = defineStore('auth', () => {
    const user = ref<User | null>(JSON.parse(window.localStorage.getItem('pp_auth') || '{"value": null}').value);

    const changeUser = (u: User) => {
        user.value = u;
    }

    watch(user, () => {
        window.localStorage.setItem('pp_auth', JSON.stringify({ value: user.value }))
    }, { immediate: true })

    return { user, changeUser }
})

export default useAuth
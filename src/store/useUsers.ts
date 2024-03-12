import { reactive } from 'vue'
import { defineStore } from 'pinia'

import type{ U  } from './useAuth'
import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter } from 'firebase/firestore'
import { db } from '../firebase'
import useAlertStore from './useAlert'

interface Option {
    limit: number,
    order: [by: keyof U, type?: 'desc' | 'asc'],
    reset: boolean,
    insert: 'push' | 'unshift'
}

const useUsers = defineStore('users', () => {
    const users = reactive<U[]>([]);
    const col = collection(db, 'users');
    const { show } = useAlertStore();

    const fetch = async (options: Option) => {
        if (options.reset) {
            // remove everything
            users.splice(0)
        }

        const start = users.length
            ? [startAfter(users[users.length - 1])]
            : []

        const queryRef = query(col, orderBy(options.order[0], options.order[1]), ...start, limit(options.limit));

        const docs = await getDocs(queryRef);

        docs.forEach(async (d) => {
            users[options.insert]({
                uid: d.id,
                ...d.data()
            } as U)
        })
    }

    const remove = async (uid: string) => {
        await deleteDoc(doc(db, 'users', uid))
        users.splice(users.findIndex(user => user.uid == uid));

        show('User with ID: ' + uid + ' is removed.')
    }

    const update = async (uid: string, username: string, fname: string) => {
        const d = doc(db, 'users', uid);
        if (!(await getDoc(d)).exists()) {
            show('User with ID: ' + uid + ' is not found.')
            return
        }

        await setDoc(d, { username, fname })
        const user = users[users.findIndex(user => user.uid == uid)];
        user.username = username;
        user.fname = fname;

        show('User with ID: ' + uid + ' is updated.')
    }

    fetch({ limit: 10, reset: false, order: ['registeredAt', 'asc'], insert: 'push' })

    return { users, remove, fetch, update }
})

export default useUsers
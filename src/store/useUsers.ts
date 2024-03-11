import { reactive, toRaw, watch } from 'vue'
import { defineStore } from 'pinia'

export interface User {
    id: number,
    fname: string,
    email: string,
    password: string | number,
    createdAt: number,
    updatedAt: number,
    isAdmin?: boolean,
    token?: string
}

const useUsers = defineStore('users', () => {
    const users = reactive<User[]>(JSON.parse(window.localStorage.getItem('pp__users') || "[]") as User[]);

    const findBy = <T extends keyof User>(by: T, prop: string) => {
        const index = users.findIndex(user => user[by] == prop)
        if (index == -1) {
            return null;
        }

        return users[index];
    }

    const addUser = (name: string, email: string, password: string, token?: string ) => {
        const user = findBy('email', email);
        const newUser: User = (user ? user : {
            fname: name,
            email: email,
            password: password,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            id: Math.random()
        })

        newUser.email = email;
        newUser.fname = name;
        newUser.password = password;

        if (token == undefined) {
            newUser.updatedAt = Date.now();
        } else {
            newUser.token = token;
        }

        if (user) {
            users[users.findIndex(user => user.email == email)] = newUser;
        } else {
            users.push(newUser);
        }
    }

    const removeUser = (id: number) => {
        const index = users.findIndex(user => user.id == id)
        if (index == -1) {
            return;
        }
        
        users.splice(index, 1)
    } 

    watch(users, () => {
        window.localStorage.setItem('pp__users', JSON.stringify(toRaw(users)))
    }, { immediate: true })

    return { users, findBy, addUser, removeUser }
})

export default useUsers
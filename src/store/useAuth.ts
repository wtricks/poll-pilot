import { ref } from "vue";
import { defineStore } from "pinia";

import { auth, db } from "../firebase";
import {
    onAuthStateChanged,
    User,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    UserCredential,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";

import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'

import useAlertStore from "./useAlert"
import { useRouter } from "vue-router";

interface U {
    uid: string,
    username: string,
    email: string,
    registeredAt?: string,
    lastLoginAt?: string,
    token?: string,
    isVerified: boolean,
    isAdmin?: boolean
}

export const generateRandomdId = (length: number = 10) => {
    const string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const result: string[] = [];

    for (let i = 0; i < length; i++) {
        result.push(string[Math.floor(Math.random() * 62)])
    }

    return result.join("")
}

const useAuth = defineStore('auth', () => {
    const initialUser = ref<U | null>();
    const router = useRouter()

    const checkCurrentUser = async (user: User | null) => {
        if (!user) {
            initialUser.value = null;
            return
        }

        const dbUser = await getDoc(doc(db, 'users', user.uid));
        if (dbUser.exists()) {
            initialUser.value = {
                ...dbUser.data(),
                registeredAt: user.metadata.creationTime,
                lastLoginAt: user.metadata.lastSignInTime
            } as U;

            router.push({name:'home'})
        } else {
            initialUser.value = null;
        }
    }

    onAuthStateChanged(auth, checkCurrentUser);
    checkCurrentUser(auth.currentUser);

    return { user: initialUser }
})

export const signUp = (fname: string, email: string, password: string, next: (err: boolean) => void) => {
    const { show } = useAlertStore();

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (user: UserCredential) => {
            if (user.user.emailVerified) {
                show('Email address is already taken.')
                return
            }

            const token = generateRandomdId(20)

            // store user in database
            // also we're using 'merge=true'
            await setDoc(doc(db, 'users', user.user.uid), {
                name: fname,
                email: email,
                username: fname.replace(/\s*/, '').toLowerCase() + (Math.random() * 99999),
                token: token,
                isVerified: false
            }, { merge: true })


            // send an email verification link
            sendEmailVerification(auth.currentUser as User, {
                url: window.location.href.split("/").slice(0, 3).join("/") + '/auth/signin?token=' + token,
                handleCodeInApp: true
            }).then(() => { 
                next(true);
            }).catch((err: Error) => {
                show('An error occured: ' + err.message)
                next(false);
            })
        })
        .catch((err: Error) => {
            show('An error occured: ' + err.message)
            next(false);
        })   
}

export const signIn = (email: string, password: string, next: (err: boolean) => void) => {
    const { show } = useAlertStore();
    
    signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
            if (!user.user.emailVerified) {
                show('Email address is not verified.')
                return
            }

            next(true);
        })
        .catch((err: Error) => {
            show('An error occured: ' + err.message)
            next(false);
        })
}

export const logout = async () => {
    return await auth.signOut()
}

export const sendPasswordResetLink = async (email: string, next: (err: boolean) =>
    void) => {
    const { show } = useAlertStore();
    
    const user = await getDocs(query(collection(db, 'users'), where('email', '==', email)))

    if (user.empty) {
        show('Email address is not found.')
        return next(false)
    }

    const token = generateRandomdId(20);
    await setDoc(doc(db, 'users', user.docs[0].id), { token }, { merge: true })

    sendPasswordResetEmail(auth, email, {
        url: window.location.href.split("/").slice(0, 3).join("/") + '/auth/reset/' + token,
        handleCodeInApp: true
    }).then(() => {
        next(true);
    }).catch((err: Error) => {
        show('An error occured: ' + err.message)
        next(false)
    })
}

export default useAuth

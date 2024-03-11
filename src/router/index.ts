import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '../views/NotFound.vue'
import Dashboard from '../views/dashboard/Dashboard.vue'
import Users from '../views/dashboard/Users.vue'
import Polls from '../views/dashboard/Polls.vue'
import useAuth from '../store/useAuth'

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomePage.vue'),
        },
        {
            path: '/auth',
            component: () => import('../views/auth/Auth.vue'),
            children: [
                {
                    path: 'signup',
                    name: 'signup',
                    component: () => import('../views/auth/SignUp.vue')
                },
                {
                    path: 'signin',
                    name: 'signin',
                    component: () => import('../views/auth/SignIn.vue')
                },
                {
                    path: 'forgot',
                    name: 'forgot',
                    component: () => import('../views/auth/Forgot.vue')
                },
                {
                    path: 'reset/:id',
                    name: 'reset',
                    component: () => import('../views/auth/Reset.vue')
                }
            ]
        },
        {
            path: '/dashboard',
            component: Dashboard,
            name: 'admin',
            children: [
                {
                    path: 'users',
                    name: 'users',
                    component: Users
                },
                {
                    path: 'polls',
                    name: 'polls',
                    component: Polls
                }
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            component: NotFound,
            name: '404'
        }
    ]
})

router.beforeEach((to) => {
    const auth = useAuth();

    if (!auth.user && !['signin', 'signup', 'forgot', 'reset', '404'].some(route => route == to.name)) {
        return { name: 'signin' }
    }

    return true;
})
import { createRouter, createWebHistory } from 'vue-router'
import NotesList from "@/components/NotesList.vue";
import NoteForm from "@/components/NoteForm.vue";
import Registration from "@/components/Registration.vue";
import Login from "@/components/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/list',
    },
      {
          path: '/login',
          name : "login",
          component : Login
      },
      {
          path: '/register',
          name : "register",
          component : Registration
      },
      {
          path : '/list',
          name: 'list',
          component : NotesList,
          meta : { requireAuth: true },
      },

      {
          path : '/create',
          component : NoteForm,
          meta : { requireAuth: true },
      },
      {
          path : "/edit/:id",
          component : NoteForm,
          props : true,
          meta : { requireAuth: true },
      }
  ],
})


router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('auth_token')
    const isLoggedIn = !!token // true if token exists
    const needsAuth = to.matched.some(r => r.meta.requireAuth) // match your route meta

    if (to.name === 'login' && isLoggedIn) {
        next({ name: 'list' }) // logged-in users cannot access login
        return
    }

    if (needsAuth && !isLoggedIn) {
        next({ name: 'login' }) // unauthenticated users are redirected
        return
    }

    next()
})


export default router

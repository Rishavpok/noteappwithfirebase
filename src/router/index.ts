import { createRouter, createWebHistory } from 'vue-router'
import NotesList from "@/components/NotesList.vue";
import NoteForm from "@/components/NoteForm.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/list',
    },
      {
          path : '/list',
          component : NotesList
      },

      {
          path : '/create',
          component : NoteForm
      },
      {
          path : "/edit/:id",
          component : NoteForm,
          props : true
      }
  ],
})



export default router

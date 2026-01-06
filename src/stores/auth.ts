import { defineStore } from "pinia";
import {computed, ref} from "vue";

export const useAuth = defineStore("auth", () => {
    const token = ref("")
    function  setToken(authToken: string) {
        token.value = authToken
    }
    const  isLoggedIn = computed(() => {
         return !!token.value;
    })

    return { setToken , isLoggedIn }
})
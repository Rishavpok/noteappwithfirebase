<script setup lang="ts">
import { useRouter } from 'vue-router';
import {onMounted, ref} from 'vue';
import { useToast } from 'vue-toastification';
import {useAuth} from "@/stores/auth.ts";
import {storeToRefs} from "pinia";

const router = useRouter();
const toast = useToast();
const isLoggingOut = ref(false);
const authStore = useAuth();

const { isLoggedIn } = storeToRefs(authStore)

const logout = () => {
  isLoggingOut.value = true;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_uid');
  toast.success('Logged out successfully!');
  router.push('/login');
  isLoggingOut.value = false;
};

</script>

<template>
  <div class="app-container">
    <!-- 🔹 Floating logout button -->
    <button v-if="isLoggedIn" class="logout-btn" @click="logout" :disabled="isLoggingOut">
      Logout
    </button>

    <!-- Main content -->
    <router-view></router-view>
  </div>
</template>

<style scoped>
.app-container {
  position: relative; /* needed for absolute positioning of button */
  min-height: 100vh;
}

/* 🔹 Floating logout button */
.logout-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 16px;
  background: #ff4b5c;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.logout-btn:hover {
  background: #e03e50;
}

.logout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

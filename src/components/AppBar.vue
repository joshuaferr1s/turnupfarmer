<script setup>
  import { getAuth, signOut } from "firebase/auth";
  import { useRouter } from "vue-router";

  import { authStore } from "@/stores/authStore.js";

  const auth = getAuth();
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(auth);
      authStore.id = null;
      authStore.email = null;
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
</script>

<template>
  <header class="bg-zinc-700 text-white">
    <div class="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
      <!-- Home Icon -->
      <RouterLink :to="authStore.id === null ? '/' : '/dashboard'" class="block text-red-400">
        <span class="sr-only">Home</span>

        <svg xmlns="http://www.w3.org/2000/svg" class="rotate-180" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff4500" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 3l4.919 4.5c.61 .587 1.177 1.177 1.703 1.771a5.527 5.527 0 0 1 .264 6.979c-1.18 1.56 -3.338 1.92 -4.886 .75v1l1 3h-6l1 -3v-1c-1.54 1.07 -3.735 .772 -4.886 -.75a5.527 5.527 0 0 1 .264 -6.979a30.883 30.883 0 0 1 1.703 -1.771a1541.72 1541.72 0 0 1 4.919 -4.5z" />
        </svg>
      </RouterLink>

      <!-- Navigation items -->
      <div class="flex flex-1 items-center justify-end">
        <div v-if="authStore.id === null" class="flex items-center gap-4">
          <RouterLink to="/login" class="block rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700">
            Login
          </RouterLink>
          <RouterLink to="/register" class="block rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:text-red-600/75">
            Register
          </RouterLink>
        </div>
        <div v-else>
          <button @click="logout" class="block rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700">
            Sign out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

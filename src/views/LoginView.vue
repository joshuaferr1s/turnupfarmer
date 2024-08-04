<script setup>
  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
  import { ref } from "vue";
  import { useRouter } from "vue-router";

  import { authStore } from "@/stores/authStore.js";

  import ErrorAlert from "@/components/ErrorAlert.vue";
  import SubmitButton from "@/components/SubmitButton.vue";

  const auth = getAuth();
  const router = useRouter();

  const loading = ref(false);
  const email = ref("");
  const password = ref("");
  const loginError = ref(null);

  const login = async () => {
    try {
      loginError.value = null;
      loading.value = true;

      const { user } = await signInWithEmailAndPassword(auth, email.value, password.value);
      authStore.id = user.uid;
      authStore.email = user.email;
      router.push("/dashboard");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          loginError.value = "Invalid email.";
          break;
        case "auth/user-not-found":
          loginError.value = "Either your email or password is incorrect.";
          break;
        case "auth/wrong-password":
          loginError.value = "Either your email or password is incorrect.";
          break;
        default:
          loginError.value = error.message;
          break;
      }
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <main class="h-full p-8 md:p-12 lg:px-16 lg:py-24">
    <h2 class="text-center text-2xl font-bold leading-9 tracking-light text-gray-900">Sign in to your account</h2>
    
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <form @submit.prevent="login" class="space-y-6">
        <!-- Submission error -->
        <ErrorAlert :error="loginError" ></ErrorAlert>

        <!-- Email input -->
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Miami Email address</label>
          <input v-model="email" id="email" name="email" type="email" autocomplete="email" required class="mt-2 block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>

        <!-- Password input -->
        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <RouterLink to="/forgot-password" class="text-sm font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</RouterLink>
          </div>
          <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required class="mt-2 block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>

        <!-- Submit button -->
        <SubmitButton :loading="loading">
          Sign in
        </SubmitButton>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Don't have an account? <RouterLink to="/register" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Register now</RouterLink>
      </p>
    </div>
  </main>
</template>

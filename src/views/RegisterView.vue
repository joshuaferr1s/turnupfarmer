<script setup>
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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
  const registrationError = ref(null);

  const register = async () => {
    try {
      registrationError.value = null;
      loading.value = true;

      const { user } = await createUserWithEmailAndPassword(auth, email.value, password.value);
      authStore.id = user.uid;
      authStore.email = user.email;
      router.push("/dashboard");
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          registrationError.value = "This email is already in use.";
          break;
        case "auth/invalid-email":
          registrationError.value = "Invalid email.";
          break;
        case "auth/weak-password":
          registrationError.value = "Password is too weak.";
          break;
        default:
          registrationError.value = error.message;
          break;
      }
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <main class="h-full p-8 md:p-12 lg:px-16 lg:py-24">
    <h2 class="text-center text-2xl font-bold leading-9 tracking-light text-gray-900">Register an account</h2>
    
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <form @submit.prevent="register" autocomplete="off" class="space-y-6">
        <!-- Submission error -->
        <ErrorAlert :error="registrationError" ></ErrorAlert>

        <!-- Email input -->
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Miami Email address</label>
          <input v-model="email" id="email" name="email" type="email" required class="mt-2 block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>

        <!-- Password input -->
        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <input v-model="password" id="password" name="password" type="password" required class="mt-2 block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>

        <!-- Submit button -->
        <SubmitButton :loading="loading">
          Register
        </SubmitButton>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Already have an account? <RouterLink to="/login" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Login now</RouterLink>
      </p>
    </div>
  </main>
</template>

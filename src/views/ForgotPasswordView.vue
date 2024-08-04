<script setup>
  import { getAuth, sendPasswordResetEmail } from "firebase/auth";
  import { ref } from "vue";

  import ErrorAlert from "@/components/ErrorAlert.vue";
  import SubmitButton from "@/components/SubmitButton.vue";
  import SuccessAlert from "@/components/SuccessAlert.vue";

  const auth = getAuth();
  
  const email = ref("");
  const loading = ref(false);
  const resetError = ref(null);
  const showSuccessMsg = ref(false);

  const resetPassword = async () => {
    try {
      resetError.value = null;
      showSuccessMsg.value = false;
      loading.value = true;

      await sendPasswordResetEmail(auth, email.value);
      showSuccessMsg.value = true;
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          resetError.value = "No account found for that email.";
          break;
        case "auth/invalid-email":
          resetError.value = "Invalid email.";
          break;
        default:
          resetError.value = error.message;
          break;
      }
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <main class="h-full p-8 md:p-12 lg:px-16 lg:py-24">
    <h2 class="text-center text-2xl font-bold leading-9 tracking-light text-gray-900">Forgot Password</h2>
    
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <form @submit.prevent="resetPassword" class="space-y-6">
        <!-- Submission error -->
        <ErrorAlert :error="resetError" ></ErrorAlert>

        <!-- Submission success -->
        <SuccessAlert v-if="showSuccessMsg">
          We've sent you an email with a link to reset your password.
        </SuccessAlert>

        <!-- Email input -->
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Miami Email address</label>
          <input v-model="email" id="email" name="email" type="email" autocomplete="email" required class="mt-2 block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>

        <!-- Submit button -->
        <SubmitButton :loading="loading">
          Reset password
        </SubmitButton>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Remembered your password? <RouterLink to="/login" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Login now</RouterLink>
      </p>
    </div>
  </main>
</template>

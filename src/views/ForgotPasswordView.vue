<script setup>
  import ErrorAlert from "@/components/ErrorAlert.vue";
  import SuccessAlert from "@/components/SuccessAlert.vue";
</script>

<template>
  <main class="h-full p-8 md:p-12 lg:px-16 lg:py-24">
    <h2 class="text-center text-2xl font-bold leading-9 tracking-light text-gray-900">Forgot Password</h2>
    
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <form class="space-y-6">
        <!-- Submission error -->
        <ErrorAlert>
          No account found for that email.
        </ErrorAlert>

        <!-- Submission success -->
        <SuccessAlert>
          We've sent you an email with a link to reset your password.
        </SuccessAlert>

        <!-- Email input -->
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Miami Email address</label>
          <input id="email" name="email" type="email" autocomplete="email" required class="mt-2 block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>

        <!-- Submit button -->
        <button type="submit" class="flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Reset Password</button>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Remembered your password? <RouterLink to="/login" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Login now</RouterLink>
      </p>
    </div>
  </main>
</template>

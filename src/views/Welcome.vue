<template>
  <div class="flex h-full flex-col items-center justify-center gap-8 px-4 md:gap-16">

    <!-- Title -->
    <h1 class="bg-gradient-to-br from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
      TaskBuddy
    </h1>
    <p class="text-xl text-gray-600 md:text-2xl text-center">
      Your personal task management assistant
    </p>

    <!-- Welcome Message -->
    <div class="text-2xl font-semibold md:text-3xl">
      <span v-if="userStore.userName">
        Welcome back, {{ userStore.userName }} 👋
      </span>
      <span v-else>
        Welcome to TaskBuddy 🎉
      </span>
    </div>

    <!-- Login Form -->
    <div v-if="!isRegistering && !userStore.userName" class="flex flex-col gap-4">
      <div class="relative">
        <input
          v-model="inputEmail"
          class="h-12 w-80 rounded-lg border border-gray-300 p-3 text-lg focus:border-primary focus:outline-none"
          type="email"
          placeholder="Email"
          @keyup.enter="login"
        />
        <Transition>
          <p v-if="isEmailInvalid" class="text-red-500 text-sm font-medium">
            Please enter a valid email address.
          </p>
        </Transition>
      </div>
      <div class="relative">
        <input
          v-model="inputPassword"
          class="h-12 w-80 rounded-lg border border-gray-300 p-3 text-lg focus:border-primary focus:outline-none"
          type="password"
          placeholder="Password"
          @keyup.enter="login"
        />
        <Transition>
          <p v-if="isPasswordInvalid" class="text-red-500 text-sm font-medium">
            {{ userStore.errorMessage }}
          </p>
        </Transition>
      </div>
      <Transition>
        <p v-if="isInputInvalid" class="text-red-500 text-sm font-medium">
          Please fill out both fields.
        </p>
      </Transition>
    </div>

    <!-- Register Form -->
    <div v-if="isRegistering && !userStore.userName" class="flex flex-col gap-4">
      <div class="relative">
        <input
          v-model="registerEmail"
          class="h-12 w-80 rounded-lg border border-gray-300 p-3 text-lg focus:border-primary focus:outline-none"
          type="email"
          placeholder="Email"
        />
        <Transition>
          <p v-if="isRegisterEmailInvalid" class="text-red-500 text-sm font-medium">
            {{ emailErrorMessage }}
          </p>
        </Transition>
      </div>
      <div class="relative">
        <input
          v-model="registerName"
          class="h-12 w-80 rounded-lg border border-gray-300 p-3 text-lg focus:border-primary focus:outline-none"
          type="text"
          placeholder="Name"
        />
      </div>
      <div class="relative">
        <input
          v-model="registerPassword"
          class="h-12 w-80 rounded-lg border border-gray-300 p-3 text-lg focus:border-primary focus:outline-none"
          type="password"
          placeholder="Password"
        />
        <Transition>
          <p v-if="isRegisterPasswordInvalid" class="text-red-500 text-sm font-medium">
            Password must be at least 6 characters long.
          </p>
        </Transition>
      </div>
      <Transition>
        <p v-if="isRegisterInputInvalid" class="text-red-500 text-sm font-medium">
          {{ userStore.errorMessage }}
        </p>
      </Transition>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col items-center gap-4">
      <button
        v-if="!isRegistering"
        class="w-64 rounded-lg bg-primary py-2 text-lg text-white shadow-md transition-all duration-300 hover:bg-secondary active:scale-90"
        @click="login"
      >
        Login
      </button>
      <button
        v-if="!isRegistering && !userStore.userName"
        class="w-64 rounded-lg bg-gray-300 py-2 text-lg text-gray-800 shadow-md transition-all duration-300 hover:bg-gray-400 active:scale-90"
        @click="toggleRegister"
      >
        Register
      </button>
      <button
        v-if="isRegistering"
        class="w-64 rounded-lg bg-primary py-2 text-lg text-white shadow-md transition-all duration-300 hover:bg-secondary active:scale-90"
        @click="register"
      >
        Create Account
      </button>
      <button
        v-if="isRegistering"
        class="w-64 rounded-lg bg-gray-300 py-2 text-lg text-gray-800 shadow-md transition-all duration-300 hover:bg-gray-400 active:scale-90"
        @click="toggleRegister"
      >
        Back to Login
      </button>
    </div>

    <!-- Sign In As Another Person -->
    <u v-if="userStore.userName" class="mt-4 text-blue-500 cursor-pointer hover:underline" @click="showConfirmation = true">
      Sign in as another person
    </u>

    <!-- Confirmation Modal -->
    <Transition name="modal">
      <div v-if="showConfirmation" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="w-96 rounded-lg bg-white p-6 shadow-lg">
          <p class="text-lg font-semibold mb-4">
            Are you sure you want to sign in as another person?
          </p>
          <div class="flex justify-end gap-4">
            <button class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400" @click="showConfirmation = false">
              No
            </button>
            <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" @click="confirmLogout">
              Yes
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { useTasksStore } from "@/stores/tasksStore";

const inputEmail = ref("");
const inputPassword = ref("");
const isInputInvalid = ref(false);
const isEmailInvalid = ref(false);
const isPasswordInvalid = ref(false);

const registerEmail = ref("");
const registerName = ref("");
const registerPassword = ref("");
const emailErrorMessage = ref('');
const isRegisterInputInvalid = ref(false);
const isRegisterEmailInvalid = ref(false);
const isRegisterPasswordInvalid = ref(false);

const isRegistering = ref(false);
const showConfirmation = ref(false);

const router = useRouter();
const userStore = useUserStore();
const tasksStore = useTasksStore();

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const login = async () => {
  if (userStore.userName) {
    router.push("/tasks");
  } else {
  if (!inputEmail.value || !inputPassword.value) {
    isInputInvalid.value = true;
    setTimeout(() => (isInputInvalid.value = false), 5000);
    return;
  }

  if (!isValidEmail(inputEmail.value)) {
    isEmailInvalid.value = true;
    setTimeout(() => (isEmailInvalid.value = false), 5000);
    return;
  }

  try {
    await userStore.login(inputEmail.value, inputPassword.value);
    router.push("/tasks");
  } catch (error) {
    isPasswordInvalid.value = true;
    setTimeout(() => (isPasswordInvalid.value = false), 5000);
    return; // Prevent further processing on error
  }}
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const register = async () => {
  if (!registerEmail.value || !registerName.value || !registerPassword.value) {
    isRegisterInputInvalid.value = true;
    setTimeout(() => (isRegisterInputInvalid.value = false), 5000);
    return;
  }

  if (!isValidEmail(registerEmail.value)) {
    emailErrorMessage.value = "Please enter a valid email address.";
    isRegisterEmailInvalid.value = true;
    setTimeout(() => (isRegisterEmailInvalid.value = false), 5000);
    return;
  }

  if (registerPassword.value.length < 6) {
    isRegisterPasswordInvalid.value = true;
    setTimeout(() => (isRegisterPasswordInvalid.value = false), 5000);
    return;
  }

  try {
    const capitalizedRegisterName = capitalizeFirstLetter(registerName.value);
    await userStore.signup(registerEmail.value, capitalizedRegisterName, registerPassword.value);

    if (userStore.errorMessage) {
      if (userStore.errorMessage === "Email already exists.") {
        emailErrorMessage.value = "Email already exists.";
        isRegisterEmailInvalid.value = true;
        setTimeout(() => (isRegisterEmailInvalid.value = false), 5000);
        return;
      }
    }

    userStore.setUserName(capitalizedRegisterName);
    isRegistering.value = false;
    router.push("/tasks");
  } catch (error) {
    emailErrorMessage.value = "Unable to connect to the server. Please try again.";
    isRegisterEmailInvalid.value = true;
    setTimeout(() => (isRegisterEmailInvalid.value = false), 5000);
    return;
  }
};

const toggleRegister = () => {
  isRegistering.value = !isRegistering.value;
};

const confirmLogout = async () => {
  userStore.logout();
  tasksStore.clearTasks();
  showConfirmation.value = false;
};

onMounted(() => {
  userStore.fetchUserName();
});
</script>

<style scoped>
  .v-enter-from,
  .v-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }

  .v-enter-active,
  .v-leave-active {
    transition: all 0.3s ease-out;
  }

  input:focus {
    outline: 2px solid var(--primary);
  }
</style>

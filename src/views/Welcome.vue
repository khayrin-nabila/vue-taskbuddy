<template>
  <div class="flex h-full flex-col items-center justify-center gap-24">

    <div
      class="bg-gradient-to-br from-primary from-45% to-secondary bg-clip-text text-7xl font-semibold text-transparent xl:text-9xl"
    >
      TaskBuddy
    </div>

    <div
      v-if="userStore.userName"
      class="flex items-center justify-center text-center text-5xl font-semibold"
    >
      Welcome back, {{ userStore.userName }}
    </div>

    <div
      v-else
      class="flex items-center justify-center text-center text-5xl font-semibold"
    >
      Welcome to TaskBuddy
    </div>

    <div class="relative">

      <input
        v-if="!userStore.userName"
        class="h-10 w-64 rounded-lg border-2 border-primary bg-white/90 p-2 italic focus:outline-none"
        type="text"
        placeholder="Your name"
        v-model="inputUserName"
        @keyup.enter="login"
      />
     
      <Transition>
        <p
          v-if="isUserNameEmpty === true"
          class="absolute -bottom-10 text-lg font-semibold italic text-secondary"
        >
          Please enter your name.
        </p>
      </Transition>

    </div>

    <div>
      <button
        @click="login"
        class="w-64 rounded-lg bg-primary py-2 text-alt transition-all duration-300 hover:bg-secondary active:scale-90"
      >
        Login
      </button>
    </div>

    <u v-if="userStore.userName" @click="showConfirmation = true" class="text-blue-600 hover:underline cursor-pointer">
      Sign in as another person
    </u>

    <Transition name="modal">
      <div v-if="showConfirmation" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="w-96 rounded-lg bg-white p-6 shadow-lg">
          <p class="text-lg font-semibold mb-4">
            Are you sure you want to sign in as another person? Your current item checklist will be removed.
          </p>
          <div class="flex justify-end gap-4">
            <button @click="showConfirmation = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">No</button>
            <button @click="confirmLogout" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Yes</button>
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

const inputUserName = ref("");
const isUserNameEmpty = ref(false);
const showConfirmation = ref(false)
const router = useRouter();
const userStore = useUserStore();
const tasksStore = useTasksStore();

const login = () => {
  if (userStore.userName) {
    router.push("/tasks");
  } else {
    if (inputUserName.value === "") {
      isUserNameEmpty.value = true;
      setTimeout(() => {
        isUserNameEmpty.value = false;
      }, 5000);
    } else {
      userStore.setUserName(inputUserName.value);
      router.push("/tasks");
    }
  }
};

const confirmLogout = () => {
  userStore.setUserName("");
  tasksStore.clearTask();
  showConfirmation.value = false;
};

onMounted(() => {
  userStore.fetchUserName();
 });
</script>

<style scoped>
.v-enter-from,
.v-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease-out;
}
</style>

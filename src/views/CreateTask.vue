<template>
  <div class="fixed bottom-24 left-6 right-6 z-10">
    
    <Transition>
      <div v-show="isTaskEmpty" class="ml-6 text-lg font-semibold italic text-secondary">
        Task cannot be empty
      </div>
    </Transition>

    <div class="flex w-auto items-center gap-4">
    
      <input
        class="h-12 flex-grow rounded-full border-2 border-primary px-4 focus:shadow-md focus:shadow-primary focus:outline-none"
        v-model="task"
        type="text"
        @keyup.enter="createTask"
      />
    
      <button
        class="rounded-full bg-primary p-2 hover:bg-secondary"
        @click="createTask"
      >
        <PlusIcon class="size-8 text-alt" />
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { PlusIcon } from "@heroicons/vue/24/solid";
import { useTasksStore } from "@/stores/tasksStore";

const task = ref("");
const isTaskEmpty = ref(false);
const tasksStore = useTasksStore();

const createTask = () => {
  if (task.value !== "") {
    tasksStore.addTask(task.value);
    task.value = "";
    isTaskEmpty.value = false;
  } else {
    isTaskEmpty.value = true;
    setTimeout(() => {
      isTaskEmpty.value = false;
    }, 2000);
  }
};
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

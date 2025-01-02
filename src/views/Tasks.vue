<template>
  <div class="h-10"><Navbar /></div>

  <main class="flex-1">
    <div class="flex justify-between items-center mb-8 mt-4">
      <h1 class="text-3xl font-semibold">
        What's up, {{ userStore.userName }}!
      </h1>
      <p class="text-md font-medium">
        {{ currentTime.toLocaleString() }}
      </p>
    </div>

    <div
      v-if="showTaskInput"
      class="fixed bottom-6 right-6 flex justify-end"
      data-intro="Click here to close the task input panel."
      @click="showTaskInput = false"
    >
      <button
        class="rounded-full bg-primary p-2 shadow-lg shadow-primary hover:bg-secondary hover:shadow-secondary"
      >
        <XMarkIcon class="size-8 text-alt" />
      </button>
    </div>

    <div
      v-if="!showTaskInput"
      class="fixed bottom-6 right-6 flex justify-end"
      data-intro="Click this button to create a new task!"
      @click="showTaskInput = true"
    >
    <button
      class="rounded-full bg-primary p-2 shadow-lg shadow-primary hover:bg-secondary hover:shadow-secondary pulse-animation"
    >
      <PlusIcon class="size-8 text-alt" />
    </button>
    </div>

    <CreateTask v-else />

    <div
      v-if="tasksLoaded && tasksStore.tasks.length > 0"
      class="flex flex-col gap-2 pb-20"
    >
      <TransitionGroup name="task-list" appear>
        <Task v-for="task in sortedTasks" :key="task.id" :task="task" />
      </TransitionGroup>
    </div>

    <div v-else class="flex flex-col items-center gap-4">
      <p class="text-9xl font-semibold lg:my-24 lg:text-center">
        You are free today!
      </p>
      <p class="text-xl font-semibold lg:my-24 lg:text-center">
        Got something to add?<br /><br />
        Get started by clicking the "+" button below to add your first task.
      </p>
    </div>
  </main>
</template>

<script setup>
import { onMounted, computed, ref, watch } from "vue";
import { PlusIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import { onBeforeRouteLeave } from "vue-router";
import IntroJs from 'intro.js';
import 'intro.js/introjs.css';

import Navbar from "@/components/Navbar.vue";
import { useUserStore } from "@/stores/userStore";
import { useTasksStore } from "@/stores/tasksStore";
import Task from "./Task.vue";
import CreateTask from "./CreateTask.vue";

const tasksStore = useTasksStore();
const showTaskInput = ref(false);
const userStore = useUserStore();
const tasksLoaded = ref(false);

const currentTime = ref(new Date());

onBeforeRouteLeave(() => {
  tasksStore.tasks.forEach((task) => {
    task.isEditing = false;
  });
});

onMounted(() => {
  tasksStore.fetchTasks();
  tasksLoaded.value = true;
  userStore.fetchUserName();
  setInterval(() => {
    currentTime.value = new Date();
  }, 1000);

  const userName = userStore.userName;
  const tourSeenKey = `tourSeen_${userName}`;

  if (userName && !localStorage.getItem(tourSeenKey)) {
    const intro = IntroJs();
    intro.setOptions({
      steps: [
        {
          element: '[data-intro="Click this button to create a new task!"]',
          intro: "Ready to add your first task? Click here to create a new task and get started! 🎉",
          position: 'bottom',
        },
      ],
    });
    intro.oncomplete(() => {
      localStorage.setItem(tourSeenKey, "true");
    });
    intro.onexit(() => {
      localStorage.setItem(tourSeenKey, "true");
    });
    intro.start();
  }
});


watch(
  tasksStore.tasks,
  () => {
    // tasksStore.saveTasks();
    tasksStore.fetchTasks();
  },
  { deep: true },
);

const sortedTasks = computed(() => {
  return tasksStore.tasks.slice().sort((a, b) => {
    if (a.isCompleted && !b.isCompleted) return 1;
    if (!a.isCompleted && b.isCompleted) return -1;
    return 0;
  });
});
</script>

<style scoped>
@keyframes pulse {
  0% {
    box-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 165, 0, 0.9);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
  }
}

.pulse-animation {
  animation: pulse 1.5s infinite;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 50;
}

.highlight {
  position: absolute;
  bottom: 6rem;
  right: 6rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 255, 255, 1);
  background: transparent;
  z-index: 51;
}

</style>
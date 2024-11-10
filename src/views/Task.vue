<template>

<Transition>
    <div class="group flex h-14 w-full items-center gap-2 rounded-lg bg-primary/40 px-4 hover:bg-primary/50" >

      <!-- Checkbox -->

      <label class="flex w-1/12 cursor-pointer items-center">
        <input
          type="checkbox"
          :checked="task.isCompleted"
          @input="tasksStore.toggleTaskCompletion(task.id)"
          class="hidden"
        />
        <div class="flex size-6 items-center justify-center rounded-full border-2 border-primary">
          <CheckCircleIcon
            v-if="task.isCompleted"
            class="pointer-events-none text-primary"
          />
        </div>
      </label>

      <!-- Task Name -->

      <div
        class="flex items-center"
        :class="
          isConfirmationPending || task.isEditing
            ? 'w-7/12 overflow-hidden'
            : 'w-9/12'
        "
      >
        <input
          v-if="task.isEditing"
          type="text"
          class="flex-grow border-b-2 border-primary bg-transparent focus:outline-none"
          v-model="editedTask"
          @keyup.enter="tasksStore.updateTask(task.id, editedTask)"
        />
        <div
          v-else="task.task"
          :class="task.isCompleted && 'line-through'"
          class="truncate"
        >
          {{ task.task }}
        </div>
      </div>

      <!-- Actions -->

      <div
        class="flex w-2/12 justify-end gap-2"
        :class="
          task.isEditing || isConfirmationPending === true
            ? 'visible w-5/12'
            : 'invisible group-hover:visible'
        "
      >
        <CheckIcon
          v-if="task.isEditing"
          @click="tasksStore.updateTask(task.id, editedTask)"
          class="size-6 cursor-pointer transition-all duration-150 hover:scale-125"
        />
        <XMarkIcon
          v-if="task.isEditing"
          @click="
            tasksStore.cancelEdit(task.id);
            editedTask = task.task;
          "
          class="size-6 cursor-pointer hover:text-secondary"
        />
        <PencilIcon
          v-if="
            !task.isEditing &&
            !task.isCompleted &&
            isConfirmationPending === false
          "
          @click="tasksStore.editTask(task.id)"
          class="size-6 cursor-pointer transition-all duration-150 hover:scale-125"
        />

        <TrashIcon
          v-if="isConfirmationPending === false"
          @click="isConfirmationPending = true"
          class="size-6 cursor-pointer transition-all duration-150 hover:scale-125 hover:text-secondary"
        />
        <div
          v-if="isConfirmationPending === true"
          class="flex items-center gap-2 rounded-lg p-1"
        >
          <p class="font-semibold">Delete?</p>
          <TrashIcon
            @click="
              tasksStore.deleteTask(task.id);
              isConfirmationPending = false;
            "
            class="size-6 cursor-pointer transition-all duration-150 hover:scale-125 hover:text-secondary"
          />
          <ArrowUturnLeftIcon
            @click="isConfirmationPending = false"
            class="size-6 cursor-pointer transition-all duration-150 hover:scale-90"
          />
        </div>
      </div>
    </div>
</Transition>
</template>

<script setup>
import { ref, watch } from "vue";
import { useTasksStore } from "@/stores/tasksStore";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/vue/24/solid";

const isConfirmationPending = ref(false);
const tasksStore = useTasksStore();

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const editedTask = ref(props.task.task);

watch(
  tasksStore.tasks,
  () => {
    tasksStore.saveTasks();
    tasksStore.fetchTasks();
  },
  { deep: true },
);
</script>

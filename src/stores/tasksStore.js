import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useTasksStore = defineStore("tasks", {

  state: () => ({
    tasks: [],
  }),

  actions: {

    saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },

    fetchTasks() {
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks);
      }
    },

    addTask(newTask) {
      this.tasks.push({
        id: uuidv4(),
        task: newTask,
        isCompleted: false,
        isEditing: false,
      });
    },

    toggleTaskCompletion(taskId) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task) task.isCompleted = !task.isCompleted;
    },

    editTask(taskId) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task) task.isEditing = true;
    },

    cancelEdit(taskId) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task) task.isEditing = false;
    },

    updateTask(taskId, newTaskValue) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task) {
        task.task = newTaskValue;
        task.isEditing = false;
      }
    },
    
    deleteTask(taskId) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
      this.saveTasks();
    },

    clearTask() {
      this.tasks = [];
      localStorage.removeItem("tasks");
    },
  },
});

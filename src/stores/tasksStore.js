import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [],
    errorMessage: "", // Add errorMessage state
  }),

  actions: {
    async fetchTasks() {
      try {
        const response = await axios.get("/api/tasks");
        this.tasks = response.data;
      } catch (error) {
        this.errorMessage = "An error occurred while fetching tasks. Please try again later.";
      }
    },

    async addTask(newTask) {
      try {
        const task = {
          id: uuidv4(),
          task: newTask,
          isCompleted: false,
          isEditing: false,
        };

        const response = await axios.post("/api/tasks", task);
        this.tasks.push(response.data);
      } catch (error) {
        this.errorMessage = "Failed to add task. Please try again.";
      }
    },

    toggleTaskCompletion(taskId) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task) {
        try {
          task.isCompleted = !task.isCompleted;
          axios.put(`/api/tasks/${taskId}`, task); 
        } catch (error) {
          this.errorMessage = "Error updating task completion status. Please try again.";
        }
      }
    },

    editTask(taskId) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task) task.isEditing = true;
    },

    cancelEdit(taskId) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task) task.isEditing = false;
    },

    async updateTask(taskId, newTaskValue) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task) {
        try {
          task.task = newTaskValue;
          task.isEditing = false;
          await axios.put(`/api/tasks/${taskId}`, task); // Sync with API
        } catch (error) {
          this.errorMessage = "Error updating task. Please try again.";
        }
      }
    },

    async deleteTask(taskId) {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        this.tasks = this.tasks.filter((task) => task.id !== taskId); // Remove from state
      } catch (error) {
        this.errorMessage = "Error deleting task. Please try again.";
      }
    },
  },
});

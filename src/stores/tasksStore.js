import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export const useTasksStore = defineStore("tasks", {

  state: () => ({
    tasks: [],
  }),

  actions: {

    // saveTasks() {
    //   localStorage.setItem("tasks", JSON.stringify(this.tasks));
    // },

    async fetchTasks() {
      try {
        const response = await axios.get("/api/tasks");
        this.tasks = response.data;
      } catch (error) {
        console.error("Error fetching tasks:", error);
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
        console.error("Error adding task:", error);
      }
    },

    toggleTaskCompletion(taskId) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task) {
        try {
        task.isCompleted = !task.isCompleted;
        axios.put(`/api/tasks/${taskId}`, task); 
      }catch (error) {
        console.error("Error updating task:", error);
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
          console.error("Error updating task:", error);
        }
      }
    },
    
    async deleteTask(taskId) {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        this.tasks = this.tasks.filter((task) => task.id !== taskId); // Remove from state
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },

  //   async clearTask() {
  //     try {
  //         await axios.delete('/api/tasks');
  //         this.tasks = []; // Clear tasks locally
  //       } catch (error) {
  //         console.error("Error clearing tasks:", error);
  //     }
  // },
  
  },
});

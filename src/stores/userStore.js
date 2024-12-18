import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {

  state: () => ({
    userName: null,
  }),

  actions: {
    
    setUserName(name) {
      this.userName = name;
      localStorage.setItem("userName", name);
    },

    fetchUserName() {
      this.userName = localStorage.getItem("userName") || null;
    },

    async login(email, password) {
      try {
        const response = await axios.post("/api/login", { email, password });
        this.setUserName(response.data.user.name);
      } catch (error) {
        console.error("Error logging in:", error);
      }
    },

    async signup(email, name, username, password){
      try {
        const response = await axios.post("/api/signup", { email, name, username, password });
        this.setUserName(response.data.name);
      } catch (error) {
        console.error("Error signing up:", error);
      }
    }
  },
});

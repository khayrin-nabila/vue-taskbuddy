import { defineStore } from "pinia";
import axios from "axios";
import { errorMessages } from "vue/compiler-sfc";

export const useUserStore = defineStore("user", {

  state: () => ({
    userName: null,
    errorMessage: ''
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
        this.errorMessage = "Invalid email or password. Please try again.";
      }
    },

    async signup(email, name, username, password){
      try {
        const response = await axios.post("/api/signup", { email, name, username, password });
        this.setUserName(response.data.name);
      } catch (error) {
        this.errorMessage = "Failed to sign up. Please try again.";
      }
    }
  },
});

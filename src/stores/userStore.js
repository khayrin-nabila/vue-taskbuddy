import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    userName: null,
    errorMessage: '',
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
      if (!email || !password) {
        this.errorMessage = "Email and password are required.";
        return;
      }
    
      try {
        const response = await axios.post("/api/login", { email, password });
        if (response.data?.user?.name) {
          this.setUserName(response.data.user.name);
        } else {
          throw new Error("Invalid response from server.");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = "Invalid email or password. Please try again.";
        } else {
          this.errorMessage = "Something went wrong. Please try again later.";
        }
        throw error;
      }
    },    

    async signup(email, name, password) {
      if (!email || !name || !password) {
        this.errorMessage = "Please fill out all fields.";
        return;
      }
    
      if (password.length < 6) {
        this.errorMessage = "Password must be at least 6 characters long.";
        return;
      }
    
      try {
        const response = await axios.post("/api/signup", { email, name, password });
        this.setUserName(response.data.name);
        this.errorMessage = null;
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;

          if (status === 400) {
            this.errorMessage = data.message || "Please fill out all fields.";
          } else if (status === 409) {
            this.errorMessage = "Email already exists.";
          } else {
            this.errorMessage = "An error occurred. Please try again later.";
          }
        } else {
          this.errorMessage = "Unable to connect to the server. Please try again.";
        }
      }
    },   

    async logout() {
      try {
        await axios.get("/api/logout");
        this.userName = null;
        localStorage.removeItem("userName");
      } catch (error) {
        this.errorMessage = "Failed to log out. Please try again later.";
      }
    }
    
  },
});

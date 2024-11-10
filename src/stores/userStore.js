import { defineStore } from "pinia";

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
  },
});

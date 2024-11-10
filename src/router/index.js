import { createRouter, createWebHistory } from "vue-router";

import Welcome from "@/views/Welcome.vue";
import Tasks from "@/views/Tasks.vue";
import Info from "@/views/Info.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Welcome,
    },
    {
      path: "/tasks",
      component: Tasks,
    },
    {
      path: "/info",
      component: Info,
    },
  ],
});

export default router;

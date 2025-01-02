import { createRouter, createWebHistory } from "vue-router";
import Welcome from "@/views/Welcome.vue";
import Tasks from "@/views/Tasks.vue";
import Info from "@/views/Info.vue";
import { useUserStore } from "@/stores/userStore";

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
      meta: { requiresAuth: true }, // Add a flag for protected routes
    },
    {
      path: "/info",
      component: Info,
    },
  ],
});

// Add navigation guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.userName) {
    userStore.errorMessage = "You need to log in to access this page.";
    next("/");
  } else {
    next();
  }
});

export default router;

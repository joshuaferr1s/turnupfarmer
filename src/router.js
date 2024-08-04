import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createRouter, createWebHistory } from "vue-router";

import { authStore } from "@/stores/authStore";

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(getAuth(), user => {
      unsubscribe();
      if (user) {
        authStore.id = user.uid;
        authStore.email = user.email;
      }
      resolve(user);
    }, reject);
  });
};

const routes = [
  { path: "/", component: () => import("@/views/HomeView.vue"), meta: { requiresAuth: false } },
  { path: "/login", component: () => import("@/views/LoginView.vue"), meta: { requiresAuth: false } },
  { path: "/register", component: () => import("@/views/RegisterView.vue"), meta: { requiresAuth: false } },
  { path: "/forgot-password", component: () => import("@/views/ForgotPasswordView.vue"), meta: { requiresAuth: false } },
  { path: "/dashboard", component: () => import("@/views/DashboardView.vue"), meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", component: () => import("@/views/NotFoundView.vue"), meta: { requiresAuth: false } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      alert("You must be logged in to access this page!");
      next("/login");
    }
  } else {
    if ((to.path === "/login" || to.path === "/register" || to.path === "/forgot-password") && await getCurrentUser()) {
      next("/dashboard");
    } else {
      next();
    }
  }
});

export default router;

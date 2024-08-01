import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("@/views/HomeView.vue"), meta: { requiresAuth: false } },
  { path: "/login", component: () => import("@/views/LoginView.vue"), meta: { requiresAuth: false } },
  { path: "/register", component: () => import("@/views/RegisterView.vue"), meta: { requiresAuth: false } },
  { path: "/forgot-password", component: () => import("@/views/ForgotPasswordView.vue"), meta: { requiresAuth: false } },
  { path: "/:pathMatch(.*)*", component: () => import("@/views/NotFoundView.vue"), meta: { requiresAuth: false } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

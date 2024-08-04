import { initializeApp } from "firebase/app";
import { createApp } from "vue";

import App from "@/App.vue";
import router from "@/router";
import "@/style.css";

initializeApp({
  apiKey: "AIzaSyBIOP32AEWNmvTfusqqmFrxVofrk0svL6w",
  authDomain: "turn-up-farmer.firebaseapp.com",
  projectId: "turn-up-farmer",
  storageBucket: "turn-up-farmer.appspot.com",
  messagingSenderId: "765415610845",
  appId: "1:765415610845:web:cb73151c66c3d82878fe34",
});

createApp(App).use(router).mount("#app");

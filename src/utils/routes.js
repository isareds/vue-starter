import Main from "@/views/Main";
import RouterView from "@/views/RouterView";

const routes = [
  {
    path: "/",
    name: "root",
    meta: {
      requiresAuth: true
    },
    component: Main,
  }
];

export { routes };

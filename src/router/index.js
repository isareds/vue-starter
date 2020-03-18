import Vue from "vue";
import VueRouter from "vue-router";
import axios from "axios";

import { routes } from "@/utils/routes";
import {
  isLoggedIn,
  getProfile
} from "@/utils/auth";

const noAuthRouteList = ["password_reset", "welcome"];

const router = new VueRouter({
  routes: routes,
  mode: "history"
});

Vue.use(VueRouter);

// Is Authenticated
router.beforeEach((to, from, next) => {
  let authUser = getProfile();
  let routeRequiresAuth = to.matched.some(route => {
    return route.meta && route.meta.requiresAuth;
  });

  if (!routeRequiresAuth) {
    next();
    return;
  }

  if (!authUser) {
    router.push("/login");
    return;
  }

  if (!authUser.isActive) {
    if (router.currentRoute.name == "profile") {
      return;
    }

    if (to.name == "profile" || from.name == "profile") {
      next();
      return;
    }

    router.push("/profile");
    return;
  }

  if (noAuthRouteList.indexOf(to.name) == -1) {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // Getting rid of starting "/" => /skills -> skills

      // User is active
      /* if (!isUserActive() && to.name != "login") {
        router.push({
          name: "welcome"
        });

        return;
      }

      // User is enabled
      if (!isUserEnabled() && to.name != "login") {
        router.push({
          name: "not_enabled"
        });

        return;
      } */

      var redirectPath = to.path.split("/")[1];

      if (!isLoggedIn()) {
        router.push("/login?redirect=" + redirectPath);
        next(false);
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

// Role based auth
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.roles)) {
    if (localStorage.getItem("goToHome") != null) {
      localStorage.removeItem("goToHome");
      router.push("/");
      next(false);
      return;
    }

    var user = getProfile();

    if (!user) {
      router.push("/login");
      next(false);
    }

    var roleHolder = null;

    // Get the last route role guard
    for (var index in to.matched) {
      var path = to.matched[index];

      if (path.meta && path.meta.roles) {
        roleHolder = path.meta.roles;
      }
    }

    if (roleHolder != null && user != null) {
      let userRole = user.role.code.toLowerCase();
      let userHasRole = roleHolder.indexOf(userRole) != -1;

      if (userHasRole) {
        next();
      } else {
        router.push("/login");
        next(false);
      }
    } else {
      // If no roles are provided, simply let the user in
      next();
    }
  } else {
    next();
  }
});

axios.interceptors.response.use(undefined, function(err) {
  if (err.response.status == 401) {
    router.push("/login");
    return Promise.reject(err);
  }

  return Promise.reject(err);
});

export default router;

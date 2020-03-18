import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Dialog from "./plugins/dialog.js";
import VueFormulate from '@braid/vue-formulate';

import { helpers } from "./utils/helpers";
import { EventBus } from "./utils/event-bus.js";

import filters from "./utils/filters";

import "./utils/components";
import "./registerServiceWorker";
import "@/assets/css/app.css";

Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));
Object.keys(helpers).forEach(key => Vue.prototype[key] = helpers[key]);

Vue.use(Dialog);
Vue.use(VueFormulate);
Vue.prototype.EventBus = EventBus;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

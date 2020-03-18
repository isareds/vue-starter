import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import moment from "moment";
import Dialog from "./plugins/dialog.js";
import _ from "lodash";

import { helpers } from "./utils/helpers";
import { EventBus } from "./utils/event-bus.js";

import filters from "./utils/filters";
import "./utils/components";

import "@/assets/css/app.css";

Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

function deepFind(obj, path) {
  var paths = path.split("."),
    current = obj,
    i;

  if (!current) {
    return "";
  }

  for (i = 0; i < paths.length; ++i) {
    if (current[paths[i]] == undefined) {
      return undefined;
    } else {
      current = current[paths[i]];
    }
  }

  return current;
}

function getColor(colorString) {
  colorString = colorString ? colorString : "gray-400";

  let elem = document.querySelector(".color-swatch.bg-" + colorString);

  return elem != null ? getComputedStyle(elem).backgroundColor : "";
}

function createRandomArray(min, max, number) {
  let array = [];

  for (var i = 0; i < number; i++) {
    array.push(Math.round(Math.random() * max) + min);
  }

  return array;
}

Vue.prototype.deepPick = (object, nestedField, type = "text") => {
  let value = _.get(object, nestedField);

  let round = function(value, round = 2) {
    return Number(value).toFixed(round);
  };

  switch (type) {
    case "number":
      return round(value);
    case "text":
      return value;
  }
};

Vue.prototype.moment = moment;
Vue.prototype.helpers = helpers;
Vue.prototype.EventBus = EventBus;
Vue.prototype.deepFind = deepFind;
Vue.prototype.getColor = getColor;
Vue.prototype.createRandomArray = createRandomArray;

Vue.use(Dialog);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

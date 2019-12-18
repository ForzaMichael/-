import Vue from "vue";
import App from "./App.vue";
import { fetchGet, fetchPost } from "./axiosConfig";
Vue.prototype.$get = fetchGet;
Vue.prototype.$post = fetchPost;
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

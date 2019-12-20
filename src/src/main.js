import Vue from "vue";
import App from "./App.vue";
import { fetchGet, fetchPost } from "./axiosConfig";
import { Button } from 'mint-ui';
import ElementUI from "element-ui";
Vue.prototype.$get = fetchGet;
Vue.prototype.$post = fetchPost;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component(Button.name, Button);
new Vue({
  render: h => h(App)
}).$mount("#app");

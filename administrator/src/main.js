import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios';
const API = {
    development: 'http://localhost:8000/',
    production: 'http://120.27.232.135:8000/'
};
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.prototype.$API = process.env.NODE_ENV;

Vue.use(iView);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
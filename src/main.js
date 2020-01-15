import Vue from 'vue';
import App from './App.vue';
import QDialog from './components/QDialog';

Vue.prototype.$dialog = QDialog;

new Vue({
  render: h => h(App)
}).$mount('#app');

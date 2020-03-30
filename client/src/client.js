import Vue from 'vue';
import App from './components/App.vue';
import {
  Checkbox,
  Loading,
  Button,
  Input,
  Switch,
  Select
} from 'buefy';
import 'buefy/dist/buefy.css';

Vue.use(Checkbox);
Vue.use(Loading);
Vue.use(Button);
Vue.use(Input);
Vue.use(Switch);
Vue.use(Select);

new Vue({
  render(h) {
    return h(App);
  }
}).$mount('#app');

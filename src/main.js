import Vue from 'vue'
import App from './app.vue'
import router from './router'
import Axios from 'axios'
import AxiosVue from 'axios-vue'

Vue.config.productionTip = false
Vue.use(AxiosVue, Axios)
Vue.prototype.$warehouse = {
  compInstances: {},
  user: null
}
Axios.get('../wivs.config.json')
  .then((res) => {
    Vue.prototype.$wivsConfig = res.data
    new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  })
  .catch((err) => {
    console.log(err)
  })

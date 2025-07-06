import Vue from 'vue'
import { ToastPlugin, ModalPlugin, VBTooltip } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'

import axiosIns from '@/libs/axios'
import VueSweetalert2 from 'vue-sweetalert2'

import router from './router'
import store from './store'
import App from './App.vue'

// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'

Vue.prototype.$http = axiosIns

Vue.use(VueSweetalert2)

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)
Vue.directive('b-tooltip', VBTooltip)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

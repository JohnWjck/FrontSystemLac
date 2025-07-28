import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'
import user from './user'
import auth from './auth'
import producer from './Producer'
import supplier from './Supplier'
import customer from './Customer'
import carrier from './Carrier'
import milkLoad from './MilkLoad'
import payment from './Payment'
import currency from './Currency'
import cheese from './Cheese'
import invoice from './Invoice'
import accounting from './Accounting'
import employee from './Employee'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    user,
    auth,
    producer,
    supplier,
    customer,
    carrier,
    milkLoad,
    payment,
    currency,
    cheese,
    invoice,
    employee,
    accounting,
  },
  strict: process.env.DEV,
})

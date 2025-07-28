import API from '@/libs/axios'

export default {
  namespaced: true,
  state: {
    topProducer: [],
    topCarrier: [],
    invoicePending: [],
    kilosCheese: [],
    milkDay: [],
    milkWeek: [],
    milkPerDayByWeek: [],
  },
  getters: {},
  mutations: {
    SET_PRODUCERS(state, topProducer) {
      state.topProducer = topProducer
    },
    SET_CARRIER(state, topCarrier) {
      state.topCarrier = topCarrier
    },
    SET_INVOICE_PENDING(state, invoicePending) {
      state.invoicePending = invoicePending
    },
    SET_KILOS_CHEESE(state, kilosCheese) {
      state.kilosCheese = kilosCheese
    },
    SET_MILK_DAY(state, milkDay) {
      state.milkDay = milkDay
    },
    SET_MILK_WEEK(state, milkWeek) {
      state.milkWeek = milkWeek
    },
    SET_MILK_PER_DAY_BY_WEEK(state, milkPerDayByWeek) {
      state.milkPerDayByWeek = milkPerDayByWeek
    },
  },
  actions: {
    async getTopProducers({ commit }) {
      try {
        await API.get('accounting/top-producers').then(response => {
          // Si la respuesta es { producers: [...] }, guarda solo el array
          commit('SET_PRODUCERS', response.data.producers || response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async getTopCarriers({ commit }) {
      try {
        await API.get('accounting/top-carriers').then(response => {
          // Si la respuesta es { carriers: [...] }, guarda solo el array
          commit('SET_CARRIER', response.data.carriers || response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async getInvoicePending({ commit }) {
      try {
        await API.get('accounting/pending-invoices').then(response => {
          commit('SET_INVOICE_PENDING', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async getKilosCheese({ commit }) {
      try {
        await API.get('accounting/kilos-cheese').then(response => {
          commit('SET_KILOS_CHEESE', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async getMilkDay({ commit }) {
      try {
        await API.get('accounting/milk-day').then(response => {
          commit('SET_MILK_DAY', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async getMilkWeek({ commit }) {
      try {
        await API.get('accounting/milk-week').then(response => {
          commit('SET_MILK_WEEK', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async getMilkPerDayByWeek({ commit }) {
      try {
        await API.get('accounting/milk-per-day-by-week').then(response => {
          // Guardar solo el array de días, no el objeto completo
          commit('SET_MILK_PER_DAY_BY_WEEK', response.data.days)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
  },
}

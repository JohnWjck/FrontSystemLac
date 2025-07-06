import API from '@/libs/axios'

export default {
  namespaced: true,
  state: {
    items: [],
    invoice: [],
  },
  getters: {},
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    SET_INVOICE(state, invoice) {
      state.invoice = invoice
    },
  },
  actions: {
    // <------------------------- MOSTRAR --------------------------------->
    async getProducers({ commit }) {
      try {
        await API.get('payments/producers').then(response => {
          commit('SET_ITEMS', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },

    async getCarriers({ commit }) {
      try {
        await API.get('payments/carriers').then(response => {
          commit('SET_ITEMS', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },

    async getPaid({ commit }) {
      try {
        await API.get('payments/paid').then(response => {
          commit('SET_ITEMS', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    // <------------------------- Pagar directamente --------------------------------->
    async paid({ commit, state }, payload) {
      try {
        console.log(payload)
        const { data: response } = await API.post('payments/approve', {
          id: payload.id,
        })
        if (response.success) {
          const items = state.items.filter(item => item.id !== payload.id)
          commit('SET_ITEMS', items)
        }
      } catch (error) {
        console.log(error)
      }
    },

    // <------------------------- Ver Factura --------------------------------->
    async getInvoice({ commit }, payload) {
      try {
        const { data } = await API.post('payments/invoice', { id: payload.id })
        commit('SET_INVOICE', data)
      } catch (error) {
        console.log(error)
      }
    },

    async getInvoiceCarrier({ commit }, payload) {
      try {
        const { data } = await API.post('payments/invoice-carrier', {
          id: payload.id,
        })
        commit('SET_INVOICE', data)
      } catch (error) {
        console.log(error)
      }
    },

    // <-------------------- Generar pago directamente --------------------------->
    async generatePaymentProducer({ commit }) {
      try {
        const { data: response } = await API.post('payments/generate')
        if (response.success) {
          commit('SET_ITEMS')
        }
      } catch (error) {
        console.log(error)
      }
    },

    async generatePaymentCarrier({ commit }) {
      try {
        const { data: response } = await API.post('payments/generate-carrier')
        if (response.success) {
          commit('SET_ITEMS')
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}

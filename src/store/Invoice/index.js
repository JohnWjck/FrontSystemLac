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
    // ---------- Funcion para cargar las notas ---------- //
    async get({ commit }) {
      try {
        await API.get('invoices').then(response => {
          commit('SET_ITEMS', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async getPaid({ commit }) {
      try {
        await API.get('invoices/completed').then(response => {
          commit('SET_ITEMS', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async getPending({ commit }) {
      try {
        await API.get('invoices/pending').then(response => {
          commit('SET_ITEMS', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    // ---------- Funcion para guardar las notas ---------- //
    async save({ commit, state }, payload) {
      try {
        const response = await API.post('invoices/create', payload)

        if (!payload.id) {
          commit('SET_ITEMS', [...state.items, response.data])
        } else {
          commit(
            'SET_ITEMS',
            state.items.map(item => (item.id === payload.id ? response.data : item)),
          )
        }
        return response.data
      } catch (error) {
        console.log(error)
      }
      return false
    },
    // ---------- Funcion para pagar la nota ---------- //
    async paid({ commit, state }, payload) {
      try {
        console.log(payload)
        const { data: response } = await API.post('invoices/paid', {
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

    // ---------- Funcion para ver la nota ---------- //
    async getInvoice({ commit }, payload) {
      try {
        const { data } = await API.post('invoices/customer', { id: payload.id })
        commit('SET_INVOICE', data)
      } catch (error) {
        console.log(error)
      }
    },
  },
}

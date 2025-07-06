import API from '@/libs/axios'

export default {
  namespaced: true,
  state: {
    items: [],
    cheeses: [],
  },
  getters: {},
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    SET_CHEESES(state, cheeses) {
      state.cheeses = cheeses
    },
  },
  actions: {
    // ---------- Funcion para cargar los quesos ---------- //
    async getCheeses({ commit }) {
      try {
        await API.get('cheeses').then(response => {
          commit('SET_CHEESES', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    // ---------- Funcion para guardar y editar los quesos ---------- //
    async saveCheese({ commit, state }, payload) {
      try {
        const response = await API.post('cheeses/create', payload)

        if (!payload.id) {
          commit('SET_CHEESES', [...state.items, response.data])
        } else {
          commit(
            'SET_CHEESES',
            state.items.map(item => (item.id === payload.id ? response.data : item)),
          )
        }
        return response.data
      } catch (error) {
        console.log(error)
      }
      return false
    },
    // ---------- Funcion para cargar las cargas de los quesos ---------- //
    async get({ commit }) {
      try {
        await API.get('load-cheeses').then(response => {
          commit('SET_ITEMS', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    // ---------- Funcion para guardar y editar las cargas de los quesos ---------- //
    async save({ commit, state }, payload) {
      try {
        const response = await API.post('load-cheeses/create', payload)

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
  },
}

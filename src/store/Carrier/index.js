import API from '@/libs/axios'

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {},
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
  },
  actions: {
    // <------------------------- MOSTRAR --------------------------------->
    async get({ commit }) {
      try {
        await API.get('carriers').then(response => {
          commit('SET_ITEMS', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    // <------------------------- GUARDAR --------------------------------->
    async save({ commit, state }, payload) {
      try {
        const response = await API.post('carriers/create', payload)

        if (!payload.id) {
          console.log('Crea uno Nuevo')
          commit('SET_ITEMS', [...state.items, response.data])
        } else {
          console.log('edita el: ', payload.id)
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
    // <------------------------- ELIMINAR --------------------------------->
    async delete({ commit, state }, payload) {
      try {
        console.log(payload)
        const { data: response } = await API.delete('carriers/delete', {
          params: payload,
        })
        if (response.success) {
          const items = state.items.filter(item => item.id !== payload.id)
          commit('SET_ITEMS', items)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}

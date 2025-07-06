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
    // ---------- Funcion para cargar los usuarios ---------- //
    async get({ commit }) {
      try {
        await API.get('users').then(response => {
          commit('SET_ITEMS', response.data)
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    // ---------- Funcion para guardar y editar lso usuarios ---------- //
    async save({ commit, state }, payload) {
      try {
        const response = await API.post('users', payload)

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
    // ---------- Funcion de eliminar los registros ---------- //
    async delete({ commit, state }, payload) {
      try {
        console.log(payload)
        const { data: response } = await API.delete('users', {
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

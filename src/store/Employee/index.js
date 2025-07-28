import API from '@/libs/axios'

export default {
  namespaced: true,
  state: {
    items: [],
    selected: null,
  },
  getters: {},
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    SET_SELECTED(state, employee) {
      state.selected = employee
    },
  },
  actions: {
    // ---------- Funcion para cargar los usuarios ---------- //
    async get({ commit }) {
      try {
        await API.get('employees').then(response => {
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
        const response = await API.post('employees/create', payload)

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
    // ---------- Funcion de eliminar los registros ---------- //
    async delete({ commit, state }, payload) {
      try {
        console.log(payload)
        const { data: response } = await API.delete('employees/delete', {
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
    // ---------- Obtener empleado por ID ---------- //
    async getById({ commit }, id) {
      try {
        const { data } = await API.get(`employees/${id}`)
        commit('SET_SELECTED', data)
        return data
      } catch (error) {
        commit('SET_SELECTED', null)
        console.log(error)
        return null
      }
    },
  },
}

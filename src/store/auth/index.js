/* eslint-disable consistent-return */
import API from '@/libs/axios'

export default {
  namespaced: true,
  state: {
    user: null,
    loginLoading: false,
  },
  getters: {},
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_LOGIN_LOADING(state, val) {
      state.loginLoading = val
    },

  },
  actions: {
    // --------- Funcion de hacer login al backend --------------- //
    async login({ commit }, { username, password }) {
      commit('SET_LOGIN_LOADING', true)

      try {
        const { data } = await API.post('auth/login', {
          username,
          password,
        })

        commit('SET_LOGIN_LOADING', false)
        if (data.success) {
          commit('SET_USER', data?.data?.user)
          localStorage.setItem('token', data?.data?.token)
        }

        return data
      } catch (error) {
        commit('SET_LOGIN_LOADING', false)
        throw error
      }
    },
    // ----- Funcion de validar a los usuarios y traer la informacion ------ //
    async me({ commit }) {
      try {
        const { data } = await API.get('auth/me')
        commit('SET_USER', data?.data?.user)
        localStorage.setItem('siracom', data?.data?.user?.id)
        return data
      } catch (error) {
        console.log(error)
      }
    },
    // --------- Funcion de cerrar la sesion --------------- //
    async logout({ commit }) {
      try {
        await API.post('auth/logout')
        commit('SET_USER', null)
        localStorage.removeItem('token')
      } catch (error) {
        console.log(error)
      }
    },
    clearLocalStorage({ commit }) {
      commit('SET_USER', null) // Limpia los datos del usuario en el estado de Vuex
      localStorage.clear() // Elimina el token del local storage
    },
  },
}

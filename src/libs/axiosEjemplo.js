// axios
import axios from 'axios'
import interceptors from '@/helpers/axios-interceptors'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: 'http://localhost:85/SICOB/BackEnd/public/api/',
  // timeout: 1000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true,
})
interceptors(axiosIns)
// Vue.prototype.$http = axiosIns

export default axiosIns

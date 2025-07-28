// eslint-disable-next-line import/no-cycle
import { authGuard } from '../index'

export default [
  {
    path: '/Usuarios',
    name: 'usuarios',
    component: () => import('@/views/Users/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Productores',
    name: 'producers',
    component: () => import('@/views/Producers/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Empleados',
    name: 'employees',
    component: () => import('@/views/Employees/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Proveedores',
    name: 'suppliers',
    component: () => import('@/views/Suppliers/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Clientes',
    name: 'customers',
    component: () => import('@/views/Customers/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Ruteros',
    name: 'carriers',
    component: () => import('@/views/Carriers/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Carga-lactea',
    name: 'milkLoad',
    component: () => import('@/views/MilkLoad/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Historial-cargas',
    name: 'milkLoadHistory',
    component: () => import('@/views/MilkLoad/components/History.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Pagos-productores',
    name: 'paymentProducer',
    component: () => import('@/views/Payment/Producer/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Pagos-ruteros',
    name: 'paymentCarrier',
    component: () => import('@/views/Payment/Carrier/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Pagos-Realizados',
    name: 'paymentPaid',
    component: () => import('@/views/Payment/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Variables-Precios',
    name: 'currencies',
    component: () => import('@/views/Currency/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Quesos',
    name: 'cheeses',
    component: () => import('@/views/Cheeses/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/carga-de-quesos',
    name: 'cheeseLoad',
    component: () => import('@/views/Cheeses/HistoryLoad.vue'),
    beforeEnter: authGuard,
  },

  {
    path: '/Notas-de-Entrega',
    name: 'deliveryNotes',
    component: () => import('@/views/Invoices/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Clientes-pagados',
    name: 'customersPaid',
    component: () => import('@/views/Customers/Paid/index.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Cientes-pendientes',
    name: 'customersPending',
    component: () => import('@/views/Customers/Pending/index.vue'),
    beforeEnter: authGuard,
  },
]

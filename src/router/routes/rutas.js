/* eslint-disable import/no-cycle */
import { authGuard } from '../index'

export default [
  {
    path: '/Factura-Productor/:id',
    name: 'invoice-producer',
    component: () => import('@/views/Payment/Producer/Components/ViewInvoice.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Factura-Rutero/:id',
    name: 'invoice-carrier',
    component: () => import('@/views/Payment/Carrier/Components/ViewInvoiceCarrier.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/Nota-Entrega/:id',
    name: 'invoice-customer',
    component: () => import('@/views/Invoices/components/ViewInvoice.vue'),
    beforeEnter: authGuard,
  },
]

export default [
  {
    title: 'Inicio',
    route: 'home',
    icon: 'HomeIcon',
  },
  {
    title: 'Sistema',
    icon: 'LayersIcon',
    children: [
      {
        title: 'Usuarios',
        route: 'usuarios',
        icon: 'UserIcon',
      },
      {
        title: 'Historial de Cargas',
        route: 'milkLoadHistory',
        icon: 'TrendingUpIcon',
      },
      {
        title: 'Precios',
        route: 'currencies',
        icon: 'DollarSignIcon',
      },
    ],
  },
  {
    title: 'Empleados',
    route: 'employees',
    icon: 'BriefcaseIcon',
  },
  {
    title: 'Productores',
    route: 'producers',
    icon: 'ClipboardIcon',
  },
  {
    title: 'Ruteros',
    route: 'carriers',
    icon: 'TruckIcon',
  },
  // {
  //   title: 'Proveedores',
  //   icon: 'ShoppingCartIcon',
  //   children: [
  //     {
  //       title: 'Lista General',
  //       route: 'suppliers',
  //     },
  //     {
  //       title: 'Inventario',
  //       route: null,
  //     },
  //   ],
  // },
  {
    title: 'Clientes',
    icon: 'UsersIcon',
    children: [
      {
        title: 'Lista General',
        route: 'customers',
      },
      {
        title: 'En Deuda',
        route: 'customersPending',
      },
      {
        title: 'Cobrados',
        route: 'customersPaid',
      },
    ],
  },
  {
    title: 'Pagos',
    icon: 'DollarSignIcon',
    children: [
      {
        title: 'Productores',
        route: 'paymentProducer',
      },
      {
        title: 'Ruteros',
        route: 'paymentCarrier',
      },
      {
        title: 'Historial de Pagos',
        route: 'paymentPaid',
      },
    ],
  },
  {
    title: 'Entrada de Leche',
    route: 'milkLoad',
    icon: 'TrendingUpIcon',
  },
  {
    title: 'Quesos',
    icon: 'TrendingDownIcon',
    children: [
      {
        title: 'Quesos',
        route: 'cheeses',
      },
      {
        title: 'Carga de Quesos',
        route: 'cheeseLoad',
      },
      {
        title: 'Ventas de Quesos',
        route: 'deliveryNotes',
      },
    ],
  },
]

<template>
  <div>
    <b-card>
      <b-row>
        <b-col
          class="buscar"
          cols="10"
          md="3"
        >
          <b-form-group>
            <b-input-group>
              <b-input-group-prepend is-text>
                <feather-icon
                  icon="SearchIcon"
                  size="1.4x"
                  class="text-info"
                />
              </b-input-group-prepend>
              <b-form-input v-model="search" />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col
          cols="12"
          md="7"
          class="text-center nombreTabla"
        >
          <h1 class="font-weight-bold text-info">
            Pagos Realizados
            <feather-icon
              icon="DollarSignIcon"
              size="1.1x"
            />
          </h1>
        </b-col>
        <b-col
          class="accion"
          cols="2"
          md="2"
        />
      </b-row>
      <b-row>
        <b-col
          cols="12"
          md="12"
        >
          <b-table
            responsive="sm"
            :items="items"
            :fields="fields"
            :filter="search"
            :filter-function="filterTable"
            :per-page="perPage"
            :current-page="currentPage"
            :table-class="'text-capitalize text-center'"
            hover
            striped
          >
            <template #cell(id)="data">
              <b-link
                v-b-tooltip.hover.top="'Ver Pago'"
                :to="data.item.payable_type === 'App\\Models\\Producer' ? { name: 'invoice-producer', params: { id: data.item.id }} : { name: 'invoice-carrier', params: { id: data.item.id }}"
                class="font-weight-bold text-info"
              >
                #{{ String(data.value).padStart(8, '0') }}
              </b-link>
            </template>
            <template #cell(payable_type)="data">
              {{ data.value === 'App\\Models\\Producer' ? 'Productor' : 'Rutero' }}
            </template>
            <template #cell(liters)="data">
              <div class="font-weight-bold">
                {{ data.value }} Lts
              </div>
            </template>
            <template #cell(amount)="data">
              <div class="font-weight-bold text-success">
                $ {{ data.value }}
              </div>
            </template>
            <template #cell(amount_bss)="data">
              <div class="font-weight-bold text-success">
                Bs {{ data.value }}
              </div>
            </template>
            <template #cell(start_week)="data">
              <div class="font-weight-bold text-warning">
                {{ new Date(data.value).toLocaleDateString('es-ES') }}
              </div>
            </template>
            <template #cell(end_week)="data">
              <div class="font-weight-bold text-danger">
                {{ new Date(data.value).toLocaleDateString('es-ES') }}
              </div>
            </template>
            <template #cell(status)="data">
              <b-badge
                pill
                :variant="data.value === 'Pendiente' ? 'warning' : 'success'"
              >
                {{ data.value }}
              </b-badge>
            </template>
            <template #cell(payment_date)="data">
              <div class="font-weight-bold text-primary">
                {{ new Date(data.value).toLocaleDateString('es-ES') }}
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          cols="12"
          md="12"
        >
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            align="center"
          />
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BTable,
  BFormGroup,
  BFormInput,
  BCol,
  BRow,
  BPagination,
  BInputGroup,
  BInputGroupPrepend,
  BBadge,
  BLink,
} from 'bootstrap-vue'
import { mapState } from 'vuex'

export default {
  components: {

    BCard,
    BTable,
    BFormGroup,
    BFormInput,
    BCol,
    BRow,
    BPagination,
    BInputGroup,
    BInputGroupPrepend,
    BBadge,
    BLink,
  },
  data() {
    return {
      open: false,
      item: null,
      search: '',
      perPage: 10,
      currentPage: 1,
      fields: [
        {
          key: 'id',
          label: 'N°',
          sortable: true,
        },
        {
          key: 'payable.name',
          label: 'Razón Social',
          sortable: true,
        },
        {
          key: 'payable_type',
          label: 'Tipo',
          sortable: true,
        },
        {
          key: 'liters',
          label: 'Litros',
        },
        {
          key: 'amount',
          label: 'Total $',
        },
        {
          key: 'amount_bss',
          label: 'Total Bs',
        },
        {
          key: 'start_week',
          label: 'Fecha Desde',
        },
        {
          key: 'end_week',
          label: 'Fecha Hasta',
        },
        {
          key: 'status',
          label: 'Estado',
        },
        {
          key: 'payment_date',
          label: 'Fecha de Pago',
          variant: 'success',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      items: state => state.payment.items,
    }),
    rows() {
      return this.items.length
    },
  },
  mounted() {
    this.getItems()
  },
  methods: {
    /// ////////////  Funcion Mostrar //////////////////
    getItems() {
      this.$store.dispatch('payment/getPaid')
    },
    filterTable(item, filter) {
      const searchTerm = filter.toLowerCase()
      return (
        item.id.toString().includes(searchTerm)
        || item.payable.name.toLowerCase().includes(searchTerm)
      )
    },
  },
}
</script>

  <style>
     @media (max-width: 768px) {

       .buscar:nth-child(1) {
         order: 2;
       }
       .nombreTabla:nth-child(2) {
         order: 1;
       }
       .accion:nth-child(3) {
         order: 3;
       }
       .b-sidebar {
         width: 80% !important;
       }
     }
  </style>

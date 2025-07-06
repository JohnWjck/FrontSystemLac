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
            Pagos Pendientes de Productores
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
        >
          <b-button
            v-b-tooltip.hover.top="'Generar Todos los Pagos de la Semana'"
            variant="info"
            class="float-right px-1"
            @click="allPaid()"
          >
            <span class="font-weight-bold">Generar Pagos</span>
            <feather-icon
              icon="DollarSignIcon"
              size="1.1x"
            />
          </b-button>
        </b-col>
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
                :to="{ name: 'invoice-producer', params: { id: data.item.id }}"
                class="font-weight-bold text-info"
              >
                #{{ data.value }}
              </b-link>
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
            <template #cell(start_week)="data">
              <div class="font-weight-bold text-primary">
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
            <template #cell(actions)="data">
              <b-dropdown
                v-b-tooltip.hover.top="'Pagar'"
                size="lg"
                variant="link"
                toggle-class="text-decoration-none"
                no-caret
              >
                <template #button-content>
                  <feather-icon
                    icon="SettingsIcon"
                    class="text-info"
                  />
                </template>
                <b-dropdown-item
                  @click="paidProducer(data.item)"
                ><span class="align-middle">Pagar</span>
                </b-dropdown-item>
                <!-- <b-dropdown-item
                    @click="deleteItem(data.item)"
                  ><span class="align-middle">Eliminar</span>
                  </b-dropdown-item> -->
              </b-dropdown>
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
    <b-sidebar
      v-model="open"
      width="35%"
      bg-variant="white"
      right
      backdrop
      shadow
    />
  </div>
</template>

<script>
import {
  BCard,
  BButton,
  BTable,
  BSidebar,
  BFormGroup,
  BFormInput,
  BCol,
  BRow,
  BPagination,
  BInputGroup,
  BInputGroupPrepend,
  BDropdown,
  BDropdownItem,
  BBadge,
  BLink,
} from 'bootstrap-vue'
import { mapState } from 'vuex'
import { confirmAlert } from '@/helpers/utils'

export default {
  components: {

    BCard,
    BButton,
    BTable,
    BSidebar,
    BFormGroup,
    BFormInput,
    BCol,
    BRow,
    BPagination,
    BInputGroup,
    BInputGroupPrepend,
    BDropdown,
    BDropdownItem,
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
          label: 'Productor',
          sortable: true,
        },
        {
          key: 'liters',
          label: 'Litros',
        },
        {
          key: 'amount',
          label: 'Total',
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
          key: 'actions',
          label: 'Acciones',
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
      this.$store.dispatch('payment/getProducers')
    },
    filterTable(item, filter) {
      const searchTerm = filter.toLowerCase()
      return (
        item.id.toString().includes(searchTerm)
        || item.payable.name.toLowerCase().includes(searchTerm)
      )
    },
    edit(item) {
      this.item = item
      this.openSidebar()
    },
    crear() {
      this.item = null
      this.openSidebar()
    },
    async paidProducer(item) {
      const res = await confirmAlert('¿Está seguro de Pagar este Productor?')
      console.log(res)
      if (res.value) {
        const r = await this.$store.dispatch('payment/paid', {
          id: item.id,
        })
        console.log(r)
        this.$swal('Pagado', 'El Productor ha sido Pagado', 'success')
        this.getItems()
      }
    },
    async allPaid() {
      const res = await confirmAlert('¿Está seguro de Generar todos los Pagos De la Semana?')
      console.log(res)
      if (res.value) {
        const r = await this.$store.dispatch('payment/generatePaymentProducer')
        console.log(r)
        this.$swal('Generado', 'Todos los Pagos han sido Generados', 'success')
        this.getItems()
      }
    },
    openSidebar(open = true) {
      this.getItems()
      this.open = open
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

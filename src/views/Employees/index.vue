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
            Empleados
            <feather-icon
              icon="BriefcaseIcon"
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
            v-b-tooltip.hover.top="'Crear nuevo Usuario'"
            variant="info"
            class="float-right px-1"
            @click="crear"
          >
            <feather-icon
              icon="PlusIcon"
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
            :filter-included-fields="['name', 'dni', 'position', 'department']"
            :per-page="perPage"
            :current-page="currentPage"
            :table-class="'text-capitalize text-center'"
            hover
            striped
          >
            <template #cell(dni)="data">
              <div
                class="font-weight-bold"
                :class="{
                  'text-success': data.item.status === 'active',
                  'text-warning': data.item.status === 'inactive'
                }"
              >
                Nº-{{ data.value }}
              </div>
            </template>
            <template #cell(name)="data">
              <div class="font-weight-bold text-dark">
                {{ data.value }}
              </div>
            </template>
            <template #cell(hire_date)="data">
              <div class="font-weight-bold text-info">
                {{ new Date(data.value).toLocaleDateString('es-ES') }}
              </div>
            </template>
            <template #cell(status)="data">
              <b-badge
                pill
                :variant="data.value === 'inactive' ? 'warning' : 'success'"
              >
                {{ data.value === 'inactive' ? 'Inactivo' : 'Activo' }}
              </b-badge>
            </template>
            <template #cell(actions)="data">
              <b-dropdown
                v-b-tooltip.hover.top="'Acciones para el empleado'"
                size="md"
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
                  @click="edit(data.item)"
                ><span class="align-middle">Ver Detalles</span>
                </b-dropdown-item>
                <b-dropdown-item
                  :to="{ name: 'print-proof', params: { id: data.item.id }}"
                ><span class="align-middle">Ver Constancia</span>
                </b-dropdown-item>
                <b-dropdown-item
                  @click="deleteItem(data.item)"
                ><span class="align-middle">Eliminar</span>
                </b-dropdown-item>
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
      width="40%"
      bg-variant="white"
      right
      backdrop
      shadow
    >
      <NewEmployee
        :item="item"
        @saved="handleSaved"
      />
    </b-sidebar>
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
} from 'bootstrap-vue'
import { mapState } from 'vuex'
import { confirmAlert } from '@/helpers/utils'
import NewEmployee from './components/NewEmployee.vue'

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
    NewEmployee,

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
          key: 'dni',
          label: 'Cédula',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Nombre',
        },
        {
          key: 'last_name',
          label: 'Apellido',
        },
        {
          key: 'email',
          label: 'Correo Electrónico',
        },
        {
          key: 'position',
          label: 'Cargo',
        },
        {
          key: 'department',
          label: 'Departamento',
          sortable: true,
        },
        {
          key: 'status',
          label: 'Estado',
          sortable: true,
        },
        {
          key: 'hire_date',
          label: 'Fecha de Contratación',
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
      items: state => state.employee.items,
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
      this.$store.dispatch('employee/get')
    },
    edit(item) {
      this.item = item
      this.openSidebar()
    },
    crear() {
      this.item = null
      this.openSidebar()
    },
    async deleteItem(item) {
      const res = await confirmAlert('¿Está seguro de eliminar este registro?')
      console.log(res)
      if (res.value) {
        const r = await this.$store.dispatch('employee/delete', {
          id: item.id,
        })
        console.log(r)
        this.$swal('Eliminado', 'El registro ha sido eliminado', 'success')
        this.getItems()
      }
    },
    openSidebar(open = true) {
      this.open = open
    },
    handleSaved() {
      this.openSidebar(false)
      this.getItems()
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

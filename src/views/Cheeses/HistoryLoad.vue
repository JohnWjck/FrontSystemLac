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
            Carga de Quesos
            <feather-icon
              icon="TruckIcon"
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
            v-b-tooltip.hover.top="'Cargo de Quesos'"
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
            :filter-included-fields="['name', 'dni']"
            :per-page="perPage"
            :current-page="currentPage"
            :table-class="'text-capitalize text-center'"
            hover
            striped
          >
            <template #cell(id)="data">
              <div class="font-weight-bold text-info">
                #{{ data.value }}
              </div>
            </template>
            <template #cell(kilograms)="data">
              <div class="font-weight-bold">
                {{ data.value }} Kg
              </div>
            </template>
            <template #cell(created_at)="data">
              <div class="font-weight-bold text-success">
                {{ new Date(data.value).toLocaleDateString('es-ES') }}
              </div>
            </template>
            <template #cell(actions)="data">
              <b-dropdown
                v-b-tooltip.hover.top="'Editar'"
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
                  @click="edit(data.item)"
                ><span class="align-middle">Editar</span>
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
    >
      <LoadForm
        :item="item"
        @saved="() => openSidebar(false)"
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
} from 'bootstrap-vue'
import { mapState } from 'vuex'
import LoadForm from './components/LoadForm.vue'
// import { confirmAlert } from '@/helpers/utils'

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
    LoadForm,
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
          key: 'cheese.name',
          label: 'Tipo de Queso',
          sortable: true,
        },
        {
          key: 'kilograms',
          label: 'Kilogramos Cargados',
          sortable: true,
        },
        {
          key: 'created_at',
          label: 'Fecha',
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
      items: state => state.cheese.items,
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
      this.$store.dispatch('cheese/get')
    },
    edit(item) {
      this.item = item
      this.openSidebar()
    },
    crear() {
      this.item = null
      this.openSidebar()
    },
    // async deleteItem(item) {
    //   const res = await confirmAlert('¿Está seguro de eliminar este registro?')
    //   console.log(res)
    //   if (res.value) {
    //     const r = await this.$store.dispatch('milkLoad/delete', {
    //       id: item.id,
    //     })
    //     console.log(r)
    //     this.$swal('Eliminado', 'El registro ha sido eliminado', 'success')
    //     this.getItems()
    //   }
    // },
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

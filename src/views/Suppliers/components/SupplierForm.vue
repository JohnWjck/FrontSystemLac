<template>
  <div>
    <b-form
      class="m-3"
      @submit.prevent="newProveedor"
    >
      <b-row>
        <b-col cols="12">
          <h2 class="mb-2 d-flex justify-content-center">
            {{ item ? 'Editar Proveedor' : 'Nuevo Proveedor' }}
          </h2>
        </b-col>
        <!-- name -->
        <b-col cols="12">
          <b-form-group
            label="Razón Social:"
            description="Ingresar la Razón Social del Proveedor"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="TruckIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="supplier.name"
                required
                type="text"
                placeholder="Razón Social"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Tipo -->
        <b-col
          v-if="!item"
          cols="4"
          class="pr-0 mr-0"
        >
          <b-form-group
            label="Tipo:"
            description="Tipo de cedula"
          >
            <b-form-select
              v-model="supplier.tipo"
              :options="optionsId"
              required
            />
          </b-form-group>
        </b-col>
        <!-- rif -->
        <b-col
          v-if="!item"
          cols="8"
        >
          <b-form-group
            label="Rif:"
            description="Ingrese el Rif del Proveedor"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="CreditCardIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="supplier.dni"
                required
                maxlength="9"
                pattern="[0-9]{9}"
                type="text"
                placeholder="N° Rif"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- rif Edit -->
        <b-col
          v-if="item"
          cols="6"
          class="mr-0"
        >
          <b-form-group
            label="Rif:"
            description="Ingrese el Rif del Proveedor"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="CreditCardIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="supplier.dni"
                required
                maxlength="11"
                pattern="/^[VJE0-9-]{9}$/"
                type="text"
                placeholder="N° Rif"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- cod -->
        <b-col
          v-if="!item"
          cols="5"
          class="pr-0 mr-0"
        >
          <b-form-group
            label="Cod:"
            description="Codigo de area"
          >
            <b-form-select
              v-model="supplier.cod"
              :options="optionsTlf"
              required
            />
          </b-form-group>
        </b-col>
        <!-- telefono -->
        <b-col
          v-if="!item"
          cols="7"
        >
          <b-form-group
            label="Telefono:"
            description="Ingrese N° telefono del Proveedor"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="SmartphoneIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="supplier.phone"
                required
                type="text"
                maxlength="7"
                pattern="[0-9]{7}"
                placeholder="N° telefono "
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- telefono Edit -->
        <b-col
          v-if="item"
          cols="6"
          class="ml-0 pl-0"
        >
          <b-form-group
            label="Telefono:"
            description="Ingrese N° telefono del Proveedor"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="SmartphoneIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="supplier.phone"
                required
                type="text"
                maxlength="12"
                pattern="/^[0-9-]{11}$/"
                placeholder="N° telefono "
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Dreccion-->
        <b-col cols="12">
          <b-form-group
            label="Dirección:"
            description="Ingresa la dirección del Proveedor"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="MapPinIcon" />
              </b-input-group-prepend>
              <b-form-textarea
                v-model="supplier.address"
                required
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Correo -->
        <b-col cols="12">
          <b-form-group
            label="Correo Electronico:"
            description="Ingresa el Correo del Proveedor"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="MailIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="supplier.mail"
                required
                type="email"
                placeholder="Correo"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <div class="d-flex justify-content-center align-items-center">
            <b-button
              variant="success"
              class="mt-2"
              type="submit"
            >
              Guardar
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BButton,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BForm,
  BFormSelect,
  BInputGroup,
  BInputGroupPrepend,
} from 'bootstrap-vue'

const supplierData = {
  id: null,
  name: null,
  tipo: 'J-',
  dni: null,
  cod: null,
  phone: null,
  address: null,
  mail: null,
}

export default {
  components: {
    BButton,
    BForm,
    BFormInput,
    BFormTextarea,
    BRow,
    BFormGroup,
    BCol,
    BFormSelect,
    BInputGroup,
    BInputGroupPrepend,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      optionsId: [
        { value: 'V-', text: 'V-' },
        { value: 'J-', text: 'J-' },
        { value: 'E-', text: 'E-' },
      ],
      optionsTlf: [
        { value: null, text: '04xx-' },
        { value: '0414-', text: '0414-' },
        { value: '0424-', text: '0424-' },
        { value: '0416-', text: '0416-' },
        { value: '0426-', text: '0426-' },
        { value: '0412-', text: '0412-' },
      ],
      supplier: { ...supplierData },
    }
  },
  computed: {},
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.supplier = { ...val }
        } else {
          this.supplier = { ...supplierData }
        }
      },
      deep: true,
    },
  },
  methods: {
    async newProveedor() {
      try {
        const res = await this.$store.dispatch('supplier/save', {
          ...this.supplier,
        })
        this.supplier = { ...supplierData }
        this.$emit('saved', res)
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

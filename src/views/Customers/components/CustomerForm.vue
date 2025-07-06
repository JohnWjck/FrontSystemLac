<template>
  <div>
    <b-form
      class="m-3"
      @submit.prevent="newCustomer"
    >
      <b-row>
        <b-col cols="12">
          <h2 class="mb-2 d-flex justify-content-center">
            {{ item ? 'Editar Cliente' : 'Nuevo Cliente' }}
          </h2>
        </b-col>
        <!-- name -->
        <b-col cols="12">
          <b-form-group
            label="Nombre y Apellido:"
            description="Ingresar el Nombre y Apellido del Cliente"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="UserIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="customer.name"
                required
                type="text"
                placeholder="Nombre y Apellido"
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
              v-model="customer.tipo"
              :options="optionsId"
              required
            />
          </b-form-group>
        </b-col>
        <!-- cedula -->
        <b-col
          v-if="!item"
          cols="8"
        >
          <b-form-group
            label="Cedula:"
            description="Ingrese la cedula del Cliente"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="CreditCardIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="customer.dni"
                required
                maxlength="8"
                pattern="[0-9]{8}"
                type="text"
                placeholder="N° Cedula"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- cedula Edit -->
        <b-col
          v-if="item"
          cols="6"
          class="mr-0"
        >
          <b-form-group
            label="Cedula:"
            description="Ingrese la cedula del Cliente"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="CreditCardIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="customer.dni"
                required
                maxlength="10"
                pattern="/^[VJE0-9-]{10}$/"
                type="text"
                placeholder="N° Cedula"
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
              v-model="customer.cod"
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
            description="Ingrese N° telefono del Cliente"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="SmartphoneIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="customer.phone"
                required
                type="number"
                maxlength="7"
                pattern="[0-9]{7}"
                placeholder="N° telefono "
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- telefono Edit-->
        <b-col
          v-if="item"
          ccols="6"
          class="ml-0 pl-0"
        >
          <b-form-group
            label="Telefono:"
            description="Ingrese N° telefono del Cliente"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="SmartphoneIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="customer.phone"
                required
                maxlength="12"
                pattern="/^[0-9-]{11}$/"
                type="text"
                placeholder="N° telefono "
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Dreccion-->
        <b-col cols="12">
          <b-form-group
            label="Dirección:"
            description="Ingresa la dirección del Cliente"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="MapPinIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="customer.address"
                required
                type="text"
                placeholder="Dirección"
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
  BForm,
  BFormSelect,
  BInputGroup,
  BInputGroupPrepend,
} from 'bootstrap-vue'

const customerData = {
  id: null,
  name: null,
  tipo: 'V-',
  dni: null,
  cod: null,
  phone: null,
  address: null,
}

export default {
  components: {
    BButton,
    BForm,
    BFormInput,
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
      customer: { ...customerData },
    }
  },
  computed: {},
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.customer = { ...val }
        } else {
          this.customer = { ...customerData }
        }
      },
      deep: true,
    },
  },
  methods: {
    async newCustomer() {
      try {
        const res = await this.$store.dispatch('customer/save', {
          ...this.customer,
        })
        this.customer = { ...customerData }
        this.$emit('saved', res)
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

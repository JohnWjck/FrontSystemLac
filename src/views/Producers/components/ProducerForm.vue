<template>
  <div>
    <b-form
      class="m-3"
      @submit.prevent="newProducer"
    >
      <b-row>
        <b-col cols="12">
          <h2 class="mb-2 d-flex justify-content-center">
            {{ item ? 'Editar Productor' : 'Nuevo Productor' }}
          </h2>
        </b-col>
        <!-- name -->
        <b-col cols="12">
          <b-form-group
            label="Razón Social:"
            description="Ingresar el Nombre del Productor"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="UserIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="producer.name"
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
              v-model="producer.tipo"
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
                v-model="producer.dni"
                required
                maxlength="10"
                pattern="[0-9-]{10}"
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
                v-model="producer.dni"
                required
                maxlength="12"
                pattern="^[VJE0-9-]{12}$"
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
              v-model="producer.cod"
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
            description="Ingrese N° telefono del Productor"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="SmartphoneIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="producer.phone"
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
            description="Ingrese N° telefono del Productor"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="SmartphoneIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="producer.phone"
                required
                type="text"
                maxlength="12"
                pattern="^[0-9-]{12}$"
                placeholder="N° telefono "
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- finca -->
        <b-col cols="12">
          <b-form-group
            label="Nombre de la Finca:"
            description="Ingresar el Nombre de la Finca"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="HomeIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="producer.farm"
                required
                type="text"
                placeholder="Nombre de la Finca"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Dreccion-->
        <b-col cols="12">
          <b-form-group
            label="Dirección:"
            description="Ingresa la dirección del Productor"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="MapPinIcon" />
              </b-input-group-prepend>
              <b-form-textarea
                v-model="producer.address"
                required
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

const producerData = {
  id: null,
  name: null,
  tipo: 'J-',
  dni: null,
  cod: null,
  phone: null,
  farm: null,
  address: null,
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
      producer: { ...producerData },
    }
  },
  computed: {},
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.producer = { ...val }
        } else {
          this.producer = { ...producerData }
        }
      },
      deep: true,
    },
  },
  methods: {
    async newProducer() {
      try {
        const res = await this.$store.dispatch('producer/save', {
          ...this.producer,
        })
        this.producer = { ...producerData }
        this.$emit('saved', res)
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

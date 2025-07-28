<template>
  <div>
    <b-form
      class="m-5"
      @submit.prevent="newUser"
    >
      <b-row>
        <b-col cols="12">
          <h2 class="mb-2 d-flex justify-content-center">
            Nueva Variable
          </h2>
        </b-col>
        <b-col cols="12">
          <b-form-group
            label="Nombre de la variable"
            description="Ingresar el Nombre"
          >
            <b-form-input
              v-model="currency.name"
              required
              type="text"
            />
          </b-form-group>
        </b-col>
        <!-- precio -->
        <b-col cols="12">
          <b-form-group
            label="Precio"
            description="Ingresar el Precio"
          >
            <b-form-input
              v-model="currency.price"
              required
              type="number"
              step="0.01"
            />
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
} from 'bootstrap-vue'

const currencyData = {
  id: null,
  name: null,
  price: null,
}

export default {
  components: {
    BButton,
    BForm,
    BFormInput,
    BRow,
    BFormGroup,
    BCol,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      currency: { ...currencyData },
    }
  },
  computed: {},
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.currency = { ...val }
        } else {
          this.currency = { ...currencyData }
        }
      },
      deep: true,
    },
  },
  methods: {
    async newUser() {
      try {
        const res = await this.$store.dispatch('currency/save', {
          ...this.currency,
        })
        this.currency = { ...currencyData }
        this.$emit('saved', res)
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

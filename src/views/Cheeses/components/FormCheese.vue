<template>
  <div>
    <b-form
      class="m-5"
      @submit.prevent="newCheese"
    >
      <b-row>
        <b-col cols="12">
          <h2 class="mb-2 d-flex justify-content-center">
            {{ item ? 'Editar Queso' : 'Nuevo Queso' }}
          </h2>
        </b-col>
        <b-col cols="12">
          <b-form-group
            label="Nombre del Queso"
            description="Ingresar el Nombre del Queso"
          >
            <b-form-input
              v-model="cheese.name"
              required
              type="text"
            />
          </b-form-group>
        </b-col>
        <!-- Kilogramos -->
        <b-col cols="6">
          <b-form-group
            v-if="!item"
            label="Kilogramos"
            description="Ingresar los Kilogramos"
          >
            <b-form-input
              v-model="cheese.kilograms"
              required
              type="number"
            />
          </b-form-group>
        </b-col>
        <!-- Precio -->
        <b-col :cols="item ? 12 : 6">
          <b-form-group
            label="Variable de Precio"
            description="Ingresar el Precio"
          >
            <v-select
              v-model="cheese.currency_id"
              :options="currencies"
              required
              item-value="id"
              label="name"
              :reduce="currency => currency.id"
              :clearable="false"
              placeholder="Selecciona una variable"
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
import { mapState } from 'vuex'
import vSelect from 'vue-select'

const cheeseData = {
  id: null,
  name: null,
  kilograms: null,
  currency_id: null,
}

export default {
  components: {
    BButton,
    BForm,
    BFormInput,
    BRow,
    BFormGroup,
    BCol,
    vSelect,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      cheese: { ...cheeseData },
    }
  },
  computed: {
    ...mapState({
      currencies: state => state.currency.items,
    }),
  },
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.cheese = { ...val }
        } else {
          this.cheese = { ...cheeseData }
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getItems()
  },
  methods: {
    getItems() {
      this.$store.dispatch('currency/get')
    },
    async newCheese() {
      try {
        const res = await this.$store.dispatch('cheese/saveCheese', {
          ...this.cheese,
        })
        this.cheese = { ...cheeseData }
        this.$emit('saved', res)
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
<style lang="scss">
  @import '@core/scss/vue/libs/vue-select.scss';
  @import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>

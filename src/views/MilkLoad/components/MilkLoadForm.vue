<template>
  <div>
    <b-form
      class="m-3"
      @submit.prevent="newMilkLoad"
    >
      <b-row>
        <b-col cols="12">
          <h2 class="mb-2 d-flex justify-content-center">
            {{ item ? 'Editar Carga' : 'Nueva Carga' }}
          </h2>
        </b-col>
        <!-- Productor -->
        <b-col cols="6">
          <b-form-group
            label="Productor:"
            description="Seleccione el Productor"
          >
            <v-select
              v-model="milkLoad.producer"
              :options="producers"
              required
              item-value="id"
              label="name"
              :clearable="false"
              placeholder="Selecciona un Productor"
            />
          </b-form-group>
        </b-col>
        <!-- Rutero -->
        <b-col
          cols="6"
          class="pr-0 mr-0"
        >
          <b-form-group
            label="Rutero:"
            description="Seleccione el Rutero"
          >
            <v-select
              v-model="milkLoad.carrier"
              :options="carriers"
              item-value="id"
              label="name"
              :clearable="false"
              class="variant-info"
              placeholder="Selecciona un Rutero"
            />
          </b-form-group>
        </b-col>
        <!-- litros -->
        <b-col
          cols="6"
        >
          <b-form-group
            label="Litros:"
            description="Ingrese la Cantidad de Litros"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="CreditCardIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="milkLoad.liters"
                required
                type="number"
                step="0.01"
                placeholder="Litros"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Precio por litro -->
        <!-- <b-col
          cols="6"
          class="align-self-center text-right"
        >
          <span>Precio de la leche por litro:</span>
          <b-badge
            variant="info"
            class="ml-1"
          >
            {{ pricePerLiter ? `$${pricePerLiter}` : 'N/A' }}
          </b-badge>
          <span>Precio por litro al Rutero:</span>
          <b-badge
            variant="info"
            class="ml-1"
          >
            {{ pricePerCarrier ? `$${pricePerCarrier}` : 'N/A' }}
          </b-badge>

        </b-col> -->
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
  BInputGroup,
  BInputGroupPrepend,
  VBToggle,
  // BBadge,
} from 'bootstrap-vue'
import { mapState } from 'vuex'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { confirmAlert } from '@/helpers/utils'

const milkLoadData = {
  id: null,
  producer: null,
  carrier: null,
  liters: null,
  price_per_liter: null,
  price_per_carrier: null,
}

export default {
  components: {
    BButton,
    BForm,
    BFormInput,
    BRow,
    BFormGroup,
    BCol,
    BInputGroup,
    BInputGroupPrepend,
    // BBadge,
    vSelect,
  },
  directives: {
    Ripple,
    'b-toggle': VBToggle,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      milkLoad: { ...milkLoadData },
    }
  },
  computed: {
    ...mapState({
      producers: state => state.producer.items,
      carriers: state => state.carrier.items,
      currencies: state => state.currency.items,
    }),
    pricePerLiter() {
      const item = this.currencies.find(c => c.id === 2)
      return item ? item.price : null
    },
    pricePerCarrier() {
      const item = this.currencies.find(c => c.id === 3)
      return item ? item.price : null
    },
  },
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.milkLoad = { ...val }
        } else {
          this.milkLoad = { ...milkLoadData }
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
      this.$store.dispatch('carrier/get')
      this.$store.dispatch('producer/get')
      this.$store.dispatch('currency/get')
    },
    async newMilkLoad() {
      try {
        const dataToSend = {
          id: this.milkLoad.id,
          producer_id: this.milkLoad.producer.id,
          carrier_id: this.milkLoad.carrier?.id || null,
          liters: this.milkLoad.liters,
          price_per_liter: this.pricePerLiter,
          price_per_carrier: this.pricePerCarrier,
        }
        // Si no hay carrier_id, mostrar confirmación
        if (!dataToSend.carrier_id) {
          const res = await confirmAlert(
            '¿Registrar sin Rutero?',
            'No se ha seleccionado un Rutero. ¿Desea continuar y registrar la carga sin Rutero?',
          )
          if (!res.value) return
        }
        const result = await this.$store.dispatch('milkLoad/save', dataToSend)
        this.milkLoad = { ...milkLoadData }
        this.$emit('saved', result)
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

<template>
  <div>
    <b-form
      class="m-5"
      @submit.prevent="newCheese"
    >
      <b-row>
        <b-col cols="12">
          <h2 class="mb-2 d-flex justify-content-center">
            {{ item ? 'Editar Nota de Entrega' : 'Nueva Nota de Entrega' }}
          </h2>
        </b-col>
        <!-- cliente -->
        <b-col cols="12">
          <b-form-group
            label="Cliente"
            description="Seleccionar el Cliente"
          >
            <v-select
              v-model="cheese.customer_id"
              :options="customer"
              required
              item-value="id"
              label="name"
              :clearable="false"
              placeholder="Selecciona un Cliente"
            />
          </b-form-group>
        </b-col>
        <!-- Queso -->
        <b-col cols="12">
          <b-form-group
            label="Tipo de Queso"
            description="Seleccionar el Tipo de Queso"
          >
            <v-select
              v-model="cheese.cheese_id"
              :options="cheeses"
              required
              item-value="id"
              label="name"
              :clearable="false"
              placeholder="Selecciona un Queso"
              @input="handleCheeseSelection"
            />
          </b-form-group>
        </b-col>
        <!-- Kilogramos -->
        <b-col cols="6">
          <b-form-group
            label="Kilogramos"
            :description="`Stock disponible: ${selectedCheeseStock} kg`"
          >
            <b-form-input
              v-model.number="cheese.kilograms"
              required
              type="number"
              :max="selectedCheeseStock"
              min="0"
              step="0.01"
              @input="calculateAmount"
            />
          </b-form-group>
          <small
            v-if="kilosError"
            class="text-danger"
          >
            {{ kilosError }}
          </small>
        </b-col>
        <!-- Monto -->
        <b-col cols="6">
          <b-form-group
            label="Total"
            :description="`Total en Bolivares: ${cheese.amount * convercion} Bs`"
          >
            <b-form-input
              v-model="cheese.amount"
              required
              type="number"
              step="0.01"
            />
          </b-form-group>
        </b-col>
        <!-- status -->
        <b-col cols="12">
          <b-form-checkbox
            v-model="cheese.status"
            :value="'Pagado'"
            :unchecked-value="'Pendiente'"
          >
            Marcar como Pagado
          </b-form-checkbox>
        </b-col>
        <!-- Guardar -->
        <b-col cols="12">
          <div class="d-flex justify-content-center align-items-center">
            <b-button
              variant="success"
              class="mt-2"
              type="submit"
              :disabled="!isFormValid"
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
  BFormCheckbox,
} from 'bootstrap-vue'
import { mapState } from 'vuex'
import vSelect from 'vue-select'

const deliveryNote = {
  id: null,
  customer_id: null,
  cheese_id: null,
  kilograms: null,
  status: 'Pendiente',
  amount: null,
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
    BFormCheckbox,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      convercion: null,
      kilos: null,
      cheese: { ...deliveryNote },
      selectedCheeseStock: 0,
      kilosError: '',
    }
  },
  computed: {
    ...mapState({
      cheeses: state => state.cheese.cheeses,
      customer: state => state.customer.items,
      currency: state => state.currency.items,
    }),
    isFormValid() {
      return (
        this.cheese.customer_id
          && this.cheese.cheese_id
          && this.cheese.kilograms > 0
          && this.cheese.kilograms <= this.selectedCheeseStock
          && this.cheese.amount > 0
          && !this.kilosError
      )
    },
  },
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.cheese = { ...val }
        } else {
          this.cheese = { ...deliveryNote }
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
      this.$store.dispatch('cheese/getCheeses')
      this.$store.dispatch('customer/get')
      this.$store.dispatch('currency/get').then(() => {
        const dollarCurrency = this.currency.find(({ id }) => id === 1)
        const dollar = dollarCurrency ? parseFloat(dollarCurrency.price) : 0

        const kilosCurrency = this.currency.find(({ id }) => id === 4)
        const kilos = kilosCurrency ? parseFloat(kilosCurrency.price) : 0

        this.convercion = dollar
        this.kilos = kilos
      })
    },
    handleCheeseSelection(selectedCheese) {
      if (selectedCheese) {
        this.selectedCheeseStock = selectedCheese.kilograms || 0
        this.cheese.kilograms = null
        this.cheese.amount = null
        this.calculateAmount()
      }
    },
    calculateAmount() {
      if (!this.cheese.cheese_id || !this.cheese.kilograms) {
        this.cheese.amount = null
        return
      }

      if (this.cheese.kilograms > this.selectedCheeseStock) {
        this.kilosError = `No puede exceder el stock disponible de ${this.selectedCheeseStock} kg`
        return
      }

      if (this.cheese.kilograms <= 0) {
        this.kilosError = 'La cantidad debe ser mayor a 0'
        return
      }

      this.kilosError = ''
      this.cheese.amount = (this.cheese.kilograms * this.kilos).toFixed(2)
    },
    async newCheese() {
      try {
        if (!this.isFormValid) return

        const dataToSend = {
          id: this.cheese.id,
          customer_id: this.cheese.customer_id.id,
          cheese_id: this.cheese.cheese_id.id,
          kilograms: this.cheese.kilograms,
          status: this.cheese.status,
          amount: parseFloat(this.cheese.amount),
        }
        const res = await this.$store.dispatch('invoice/save', dataToSend)
        this.cheese = { ...deliveryNote }
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

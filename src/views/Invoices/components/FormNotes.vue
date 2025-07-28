<template>
  <div>
    <b-form
      class="m-5"
      @submit.prevent="newCheese"
    >
      <b-row>
        <b-col cols="12">
          <h2 class="mb-2 d-flex justify-content-center">
            {{ item ? 'Editar Orden de Compra' : 'Nueva Orden de Compra' }}
          </h2>
        </b-col>
        <!-- cliente -->
        <b-col cols="12">
          <b-form-group
            label="Cliente"
            description="Seleccionar el Cliente"
          >
            <v-select
              v-model="customerSelected"
              :options="customer"
              required
              item-value="id"
              label="name"
              :clearable="false"
              placeholder="Selecciona un Cliente"
            />
          </b-form-group>
        </b-col>
        <!-- Productos dinámicos -->
        <b-col
          v-for="(prod, idx) in cheesesList"
          :key="idx"
          cols="12"
          class="mb-2"
        >
          <b-card class="shadow-sm position-relative">
            <b-row>
              <b-col cols="5">
                <b-form-group
                  label="Tipo de Queso"
                  description="Seleccionar el Tipo de Queso"
                >
                  <v-select
                    v-model="prod.cheese_id"
                    :options="cheeses"
                    required
                    item-value="id"
                    label="name"
                    :clearable="false"
                    placeholder="Selecciona un Queso"
                    @input="cheese => handleCheeseSelection(idx, cheese)"
                  />
                </b-form-group>
              </b-col>
              <b-col cols="3">
                <b-form-group
                  label="Kilogramos"
                  :description="`Stock: ${prod.selectedCheeseStock || 0} kg`"
                >
                  <b-form-input
                    v-model.number="prod.kilograms"
                    required
                    type="number"
                    :max="prod.selectedCheeseStock || 0"
                    min="0"
                    step="0.01"
                    @input="() => calculateAmount(idx)"
                  />
                </b-form-group>
              </b-col>
              <b-col cols="3">
                <b-form-group
                  label="Total"
                  :description="getProductDescription(prod, 'short')"
                >
                  <b-form-input
                    v-model="prod.amount"
                    required
                    type="number"
                    step="0.01"
                  />
                </b-form-group>
              </b-col>
              <b-col
                v-if="getProductDescription(prod, 'long') || prod.kilosError === 'Este tipo de queso ya fue seleccionado en otro producto.'"
                cols="12"
              >
                <div
                  v-if="prod.kilosError === 'Este tipo de queso ya fue seleccionado en otro producto.'"
                  class="text-danger"
                  style="white-space: pre-line; width: 100%;"
                >
                  {{ prod.kilosError }}
                </div>
                <div
                  v-else
                  class="text-muted"
                  style="white-space: pre-line; width: 100%;"
                >
                  {{ getProductDescription(prod, 'long') }}
                </div>
              </b-col>
              <!-- Botón eliminar siempre en la esquina superior derecha del card -->
              <b-button
                v-if="cheesesList.length > 1"
                variant="link"
                class="p-0 text-danger btn-trash-absolute"
                title="Eliminar producto"
                style="position: absolute; top: 8px; right: 8px; z-index: 2;"
                @click="removeProduct(idx)"
              >
                <feather-icon
                  icon="TrashIcon"
                  size="22"
                />
              </b-button>
            </b-row>
          </b-card>
        </b-col>
        <!-- status -->
        <b-col cols="6">
          <b-form-checkbox
            v-model="status"
            :value="'Pagado'"
            :unchecked-value="'Pendiente'"
          >
            Marcar como Pagado
          </b-form-checkbox>
        </b-col>

        <!-- Agregar producto -->
        <b-col
          cols="6"
          class="d-flex justify-content-end"
        >
          <b-button
            variant="primary"
            class="mb-2"
            @click="addProduct"
          >
            <feather-icon
              icon="PlusCircle"
              size="16"
              class="mr-1"
            />
            Agregar Producto
          </b-button>
        </b-col>
        <!-- Total General (Bs y USD) fuera del v-for, entre checkbox y botón agregar producto -->
        <b-col
          cols="12"
          class="mb-2 "
        >
          <div class="d-flex flex-column align-items-end">
            <div class="mt-1">
              <span class="font-weight-bold">Total General (Bs): </span>
              <span class="h4 mb-0">{{ totalGeneralBs }}</span>
            </div>
            <div class="mt-1">
              <span class="font-weight-bold">Total General ($):  </span>
              <span class="h4 mb-0">{{ totalGeneralUsd }}</span>
            </div>
          </div>
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
  BCard,
} from 'bootstrap-vue'
import { mapState } from 'vuex'
import vSelect from 'vue-select'
import FeatherIcon from '@core/components/feather-icon/FeatherIcon.vue'

const productTemplate = {
  cheese_id: null,
  kilograms: null,
  amount: null,
  selectedCheeseStock: 0,
  kilosError: '',
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
    FeatherIcon,
    BCard,
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
      cheesesList: [{ ...productTemplate }],
      customerSelected: null,
      status: 'Pendiente',
    }
  },
  computed: {
    ...mapState({
      cheeses: state => state.cheese.cheeses,
      customer: state => state.customer.items,
      currency: state => state.currency.items,
    }),
    isFormValid() {
      if (!this.customerSelected) return false
      if (this.hasDuplicateCheeses()) return false
      return this.cheesesList.every(
        prod => prod.cheese_id
          && prod.kilograms > 0
          && prod.kilograms <= (prod.selectedCheeseStock || 0)
          && prod.amount > 0
          && !prod.kilosError,
      )
    },
    totalGeneralBs() {
      // Refactor: todos los precios están en dólares, convertir siempre usando la tasa (id=1)
      const bsCurrency = this.currency.find(cur => cur.id === 1)
      if (!bsCurrency) return 0

      const tasa = parseFloat(bsCurrency.price)
      const total = this.cheesesList.reduce((acc, prod) => {
        if (!prod.cheese_id || !prod.kilograms) return acc
        return acc + (parseFloat(prod.amount) * tasa)
      }, 0)
      return total.toFixed(2)
    },

    totalGeneralUsd() {
      // Refactor: todos los precios están en dólares, solo sumar amounts
      const total = this.cheesesList.reduce((acc, prod) => {
        if (!prod.cheese_id || !prod.kilograms) return acc
        return acc + parseFloat(prod.amount)
      }, 0)
      return total.toFixed(2)
    },
  },
  watch: {
    item: {
      handler(val) {
        if (val && val.products) {
          this.customerSelected = val.customer_id
          this.status = val.status
          this.cheesesList = val.products.map(prod => ({
            cheese_id: prod.cheese_id,
            kilograms: prod.kilograms,
            amount: prod.amount,
            selectedCheeseStock: prod.selectedCheeseStock || 0,
            kilosError: '',
          }))
        } else {
          this.customerSelected = null
          this.status = 'Pendiente'
          this.cheesesList = [{ ...productTemplate }]
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
    handleCheeseSelection(idx, selectedCheese) {
      if (selectedCheese) {
        // Validar si ya existe este queso en otro producto
        const exists = this.cheesesList.some((prod, i) => i !== idx && prod.cheese_id && prod.cheese_id.id === selectedCheese.id)
        if (exists) {
          this.$set(this.cheesesList[idx], 'cheese_id', null)
          this.$set(this.cheesesList[idx], 'selectedCheeseStock', 0)
          this.cheesesList[idx].kilograms = null
          this.cheesesList[idx].amount = null
          this.$set(this.cheesesList[idx], 'kilosError', 'Este tipo de queso ya fue seleccionado en otro producto.')
          return
        }
        this.$set(this.cheesesList[idx], 'kilosError', '')
        this.$set(this.cheesesList[idx], 'selectedCheeseStock', selectedCheese.kilograms || 0)
        this.cheesesList[idx].kilograms = null
        this.cheesesList[idx].amount = null
        this.calculateAmount(idx)
      }
    },
    calculateAmount(idx) {
      const prod = this.cheesesList[idx]
      if (!prod.cheese_id || !prod.kilograms) {
        prod.amount = null
        prod.amountBs = null
        return
      }

      if (prod.kilograms > (prod.selectedCheeseStock || 0)) {
        prod.kilosError = `No puede exceder el stock disponible de ${prod.selectedCheeseStock || 0} kg`
        return
      }

      if (prod.kilograms <= 0) {
        prod.kilosError = 'La cantidad debe ser mayor a 0'
        return
      }

      prod.kilosError = ''

      const cheese = this.cheeses.find(c => c.id === (prod.cheese_id.id || prod.cheese_id))
      if (!cheese) {
        prod.amount = null
        prod.amountBs = null
        return
      }

      const currency = this.currency.find(cur => cur.id === cheese.currency_id)
      if (!currency) {
        prod.amount = null
        prod.amountBs = null
        return
      }

      const price = parseFloat(currency.price)
      const bsCurrency = this.currency.find(cur => cur.id === 1)

      // Calcular el monto en la moneda original
      prod.amount = (prod.kilograms * price).toFixed(2)

      // Calcular la conversión a Bs si corresponde
      if (currency.id !== 1 && bsCurrency) {
        // Primero convertimos a USD y luego a Bs
        const amountInUsd = parseFloat(prod.amount) / price
        prod.amountBs = (amountInUsd * parseFloat(bsCurrency.price)).toFixed(2)
      } else if (currency.id === 1) {
        // Si ya está en Bs, simplemente multiplicamos por la tasa
        prod.amountBs = (parseFloat(prod.amount) * parseFloat(bsCurrency.price)).toFixed(2)
      }
    },
    getProductDescription(prod, type = 'short') {
      // type: 'short' para solo precio x kilo, 'long' para el resto
      if (!prod.cheese_id) return ''
      const cheeseId = typeof prod.cheese_id === 'object' ? prod.cheese_id.id : prod.cheese_id
      if (!cheeseId) return ''
      const cheese = this.cheeses.find(c => c.id === cheeseId)
      if (!cheese) return ''
      const bsCurrency = this.currency.find(cur => cur.id === 1)
      if (!bsCurrency) return ''
      const tasa = parseFloat(bsCurrency.price)
      let priceUsd = 0
      if (cheese.price && !Number.isNaN(parseFloat(cheese.price))) {
        priceUsd = parseFloat(cheese.price)
      } else if (prod.kilograms && prod.amount) {
        priceUsd = parseFloat(prod.amount) / parseFloat(prod.kilograms)
      }
      if (type === 'short') {
        return `Precio x Kg: ${priceUsd.toFixed(2)} $`
      }
      let desc = ''
      if (prod.amount) {
        const montoBs = (parseFloat(prod.amount) * tasa).toFixed(2)
        desc += `\nEquivale a: ${montoBs} Bs (Tasa: ${tasa})`
      }
      return desc
    },
    addProduct() {
      this.cheesesList.push({ ...productTemplate })
    },
    removeProduct(idx) {
      if (this.cheesesList.length > 1) {
        this.cheesesList.splice(idx, 1)
      }
    },
    async newCheese() {
      try {
        if (!this.isFormValid) return
        const items = this.cheesesList.map(prod => {
          const cheeseId = typeof prod.cheese_id === 'object' ? prod.cheese_id.id : prod.cheese_id
          const cheese = this.cheeses.find(c => c.id === cheeseId)
          let unitPrice = 0
          if (cheese && cheese.price && !Number.isNaN(parseFloat(cheese.price))) {
            unitPrice = parseFloat(cheese.price)
          } else if (prod.amount && prod.kilograms) {
            unitPrice = parseFloat(prod.amount) / parseFloat(prod.kilograms)
          }
          return {
            cheese_id: cheeseId,
            kilograms: prod.kilograms,
            unitPrice: unitPrice ? unitPrice.toFixed(2) : '0.00',
            subtotal: parseFloat(prod.amount),
          }
        })
        // Obtener la tasa de cambio actual (Bs/USD)
        const bsCurrency = this.currency.find(cur => cur.id === 1)
        const tasa = bsCurrency ? parseFloat(bsCurrency.price) : 0
        const totalBs = parseFloat(this.totalGeneralBs)
        const dataToSend = {
          customer_id: this.customerSelected.id,
          status: this.status,
          amount: parseFloat(this.totalGeneralUsd), // total en USD
          totalBs, // total en Bs
          tasa, // tasa de cambio usada
          items,
        }
        const res = await this.$store.dispatch('invoice/save', dataToSend)
        this.customerSelected = null
        this.status = 'Pendiente'
        this.cheesesList = [{ ...productTemplate }]
        this.$emit('saved', res)
      } catch (e) {
        console.log(e)
      }
    },
    hasDuplicateCheeses() {
      const ids = this.cheesesList.map(prod => prod.cheese_id && prod.cheese_id.id).filter(Boolean)
      return new Set(ids).size !== ids.length
    },
  },
}
</script>

<style lang="scss">
  @import '@core/scss/vue/libs/vue-select.scss';
  @import '@core/scss/vue/libs/vue-flatpicker.scss';

  .btn-trash-absolute {
    position: absolute !important;
    top: 8px;
    right: 8px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
  }
</style>

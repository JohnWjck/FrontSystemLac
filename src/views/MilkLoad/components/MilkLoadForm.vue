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
              required
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
          cols="12"
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
                step="0.1"
                placeholder="Litros"
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
  BInputGroup,
  BInputGroupPrepend,
  VBToggle,
} from 'bootstrap-vue'
import { mapState } from 'vuex'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'

const milkLoadData = {
  id: null,
  producer: null,
  carrier: null,
  liters: null,
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
    }),
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
    },
    async newMilkLoad() {
      try {
        const dataToSend = {
          id: this.milkLoad.id,
          producer_id: this.milkLoad.producer.id,
          carrier_id: this.milkLoad.carrier.id,
          liters: this.milkLoad.liters,
        }
        const res = await this.$store.dispatch('milkLoad/save', dataToSend)
        this.milkLoad = { ...milkLoadData }
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

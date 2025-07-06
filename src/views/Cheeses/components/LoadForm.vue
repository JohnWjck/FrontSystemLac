<template>
  <div>
    <b-form
      class="m-5"
      @submit.prevent="newCheese"
    >
      <b-row>
        <b-col cols="12">
          <h2 class="mb-2 d-flex justify-content-center">
            {{ item ? 'Editar Carga' : 'Nuevo Carga de Queso' }}
          </h2>
        </b-col>
        <b-col cols="6">
          <b-form-group
            label="Nombre del Queso"
            description="Ingresar el Nombre del Queso"
          >
            <v-select
              v-model="cheese.cheese_id"
              :options="cheeses"
              required
              item-value="id"
              label="name"
              :reduce="cheese => cheese.id"
              :clearable="false"
              placeholder="Selecciona un Queso"
            />
          </b-form-group>
        </b-col>
        <!-- Kilogramos -->
        <b-col cols="6">
          <b-form-group
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

const loadCheeseData = {
  id: null,
  cheese_id: null,
  kilograms: null,
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
      cheese: { ...loadCheeseData },
    }
  },
  computed: {
    ...mapState({
      cheeses: state => state.cheese.cheeses,
    }),
  },
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.cheese = { ...val }
        } else {
          this.cheese = { ...loadCheeseData }
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
    },
    async newCheese() {
      try {
        const dataToSend = {
          id: this.cheese.id,
          cheese_id: this.cheese.cheese_id.id || this.cheese.cheese_id,
          kilograms: this.cheese.kilograms,
        }
        const res = await this.$store.dispatch('cheese/save', dataToSend)
        this.cheese = { ...loadCheeseData }
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

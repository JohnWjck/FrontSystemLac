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
        <b-col cols="12">
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

const cheeseData = {
  id: null,
  name: null,
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
  computed: {},
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
  methods: {
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

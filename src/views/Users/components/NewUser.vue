<template>
  <div>
    <b-form
      class="m-5"
      @submit.prevent="newUser"
    >
      <b-row>
        <b-col cols="12">
          <h2 class="mb-2 d-flex justify-content-center">
            Nuevo Usuario
          </h2>
        </b-col>
        <b-col cols="12">
          <b-form-group
            label="Nombre y Apellido"
            description="Ingresar el Nombre y Apellido"
          >
            <b-form-input
              v-model="user.name"
              required
              type="text"
            />
          </b-form-group>
        </b-col>
        <!-- cedula -->
        <b-col cols="12">
          <b-form-group
            label="Cedula"
            description="Ingresar la Cedula"
          >
            <b-form-input
              v-model="user.dni"
              required
              type="text"
            />
          </b-form-group>
        </b-col>
        <!-- Nombre de usuario -->
        <b-col cols="12">
          <b-form-group
            label="Nombre de Ususario"
            description="Ingresar el Nombre de Ususario"
          >
            <b-form-input
              v-model="user.username"
              required
              type="text"
            />
          </b-form-group>
        </b-col>
        <!-- password -->
        <b-col cols="12">
          <b-form-group
            label="Contraseña"
            description="Ingresar una Contraseña"
          >
            <b-form-input
              v-model="user.password"
              required
              type="password"
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

const userData = {
  id: null,
  name: null,
  dni: null,
  username: null,
  password: null,
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
      user: { ...userData },
    }
  },
  computed: {},
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.user = { ...val }
        } else {
          this.user = { ...userData }
        }
      },
      deep: true,
    },
  },
  methods: {
    async newUser() {
      try {
        const res = await this.$store.dispatch('user/save', {
          ...this.user,
        })
        this.user = { ...userData }
        this.$emit('saved', res)
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

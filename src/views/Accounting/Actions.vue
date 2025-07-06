<template>
  <div>
    <b-card
      class="card-congratulation-medal text-center"
    >
      <h2>Bienvenidos!</h2>
      <b-card-text class="font-small-3">
        Sistema de control lacteo
      </b-card-text>
      <div class="mb-75 mt-2 pt-50">
        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="outline-primary"
          @click="cargar"
        >
          <feather-icon
            icon="TrendingUpIcon"
            class="mr-50"
          />
          Carga de hoy
        </b-button>
        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="outline-primary"
          class="ml-2"
          @click="NuevaNota"
        >
          <feather-icon
            icon="TrendingDownIcon"
            class="mr-50"
          />
          <span class="align-middle">Nueva Nota </span>
        </b-button>
      </div>
    </b-card>
    <b-sidebar
      v-model="openUp"
      width="35%"
      bg-variant="white"
      right
      backdrop
      shadow
    >
      <MilkLoadForm
        @saved="() => openSidebarUp(false)"
      />
    </b-sidebar>
    <b-sidebar
      v-model="openDown"
      width="35%"
      bg-variant="white"
      right
      backdrop
      shadow
    >
      <FormNotes
        @saved="() => openSidebarDown(false)"
      />
    </b-sidebar>
  </div>
</template>

<script>
import {
  BCard, BCardText, BButton, BSidebar,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import MilkLoadForm from '@/views/MilkLoad/components/MilkLoadForm.vue'
import FormNotes from '@/views/Invoices/components/FormNotes.vue'

export default {
  components: {
    BCard,
    BCardText,
    BButton,
    BSidebar,

    MilkLoadForm,
    FormNotes,
  },
  directives: {
    Ripple,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      openUp: false,
      openDown: false,
    }
  },
  methods: {
    cargar() {
      this.item = null
      this.openSidebarUp()
    },
    NuevaNota() {
      this.item = null
      this.openSidebarDown()
    },
    openSidebarUp(open = true) {
      this.openUp = open
      this.$emit('saved')
    },
    openSidebarDown(open = true) {
      this.openDown = open
      this.$emit('saved')
    },
  },
}
</script>

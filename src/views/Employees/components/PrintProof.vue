<template>
  <section class="invoice-preview-wrapper">
    <!-- Watermark Logo Background SIEMPRE visible -->
    <!-- <div class="invoice-watermark-bg only-print">
      <img
        src="/logoMV.png"
        alt="Logo Marca de Agua"
      >
    </div> -->

    <!-- Alert: No item found -->
    <b-alert
      variant="danger"
      :show="invoiceData === undefined"
    >
      <h4 class="alert-heading">
        Error fetching invoice data
      </h4>
      <div class="alert-body">
        No invoice found with this invoice id. Check
        <b-link
          class="alert-link"
          :to="{ name: 'apps-invoice-list'}"
        >
          Invoice List
        </b-link>
        for other invoices.
      </div>
    </b-alert>

    <b-row
      v-if="invoiceData"
      class="invoice-preview justify-content-center"
    >
      <!-- Col: Left (Invoice Container) -->
      <b-col
        cols="12"
        xl="9"
        md="8"
      >
        <b-card
          no-body
          class="invoice-preview-card"
        >
          <!-- Header -->
          <b-card-body class="invoice-padding pb-0">
            <div class="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">
              <div>
                <div class="logo-wrapper mb-1">
                  <logo />
                  <div class="ml-5 text-center">
                    <span
                      class="d-block text-info ml-1"
                      style="font-size:2rem; font-weight:500; letter-spacing:1px;"
                    >DISTRIBUIDORA E INVERSIONES</span>
                    <span
                      class="d-block text-info ml-1"
                      style="font-size:3rem; font-weight:700; letter-spacing:2px; text-shadow:0 2px 8px rgba(0,0,0,0.08);"
                    >LACTEOS MV 2016, C.A.</span>
                  </div>
                </div>
                <b-card-text class="mb-25 ml-2">
                  <strong>Rif-J-41237828-7</strong>
                </b-card-text>
              </div>
              <!-- Header: Right Content -->
              <div class="mt-md-0 mt-2 float-right fechaIzquierda">
                <div class="invoice-date-wrapper">
                  <!-- <p class="invoice-date">
                    {{ new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                  </p> -->
                </div>
              </div>
            </div>
          </b-card-body>

          <!-- Spacer -->
          <h1 class="text-center text-info">
            <strong>Constancia de Trabajo</strong>
          </h1>
          <hr class="invoice-spacing mb-5">

          <!-- Contenido central: Datos del trabajador -->
          <b-card-body
            v-if="employeeData"
            class="invoice-padding pt-0"
          >
            <div
              class="mb-3"
              style="text-align: justify;"
            >
              <h3 class="font-weight-bold text-dark mb-2 text-center">
                A QUIEN PUEDA INTERESAR
              </h3>
              <p class="mb-2">
                Quien suscribe, hace constar por medio de la presente que el(la) ciudadano(a) <span class="font-weight-bold">{{ employeeData.name }} {{ employeeData.last_name }}</span>, titular de la cédula de identidad N° <span class="font-weight-bold">{{ employeeData.dni }}</span>, presta sus servicios en nuestra empresa <span class="font-weight-bold">DISTRIBUIDORA E INVERSIONES LACTEOS MV 2016, C.A.</span> desempeñando el cargo de <span class="font-weight-bold">{{ employeeData.position }}</span> en el departamento de <span class="font-weight-bold">{{ employeeData.department }}</span>.
              </p>
              <p class="mb-1">
                El(la) trabajador(a) ingresó a la empresa el día <span class="font-weight-bold">{{ new Date(employeeData.hire_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>, devengando actualmente un sueldo mensual de <span class="font-weight-bold">${{ parseFloat(employeeData.salary).toFixed(2) }}</span>.
              </p>
              <p class="mb-1">
                Teléfono de contacto: <span class="font-weight-bold">{{ employeeData.phone }}</span>
                <span v-if="employeeData.email"> | Correo: <span class="font-weight-bold">{{ employeeData.email }}</span></span>
              </p>
              <p class="mb-5">
                La presente constancia se expide a solicitud de la parte interesada en Sabaneta de Barinas, a los {{ new Date().getDate() }} días del mes de {{ new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) }}, y no constituye una oferta de trabajo ni compromiso laboral distinto al aquí señalado.
              </p>
              <div class="mt-5 mb-2 text-center">
                Atentamente,
              </div>
              <div class="firma-zona mt-5 mb-2 text-center">
                <div
                  style="margin-bottom: 80px;"
                >
                  &nbsp;
                </div>
                <div
                  style="border-top: 1px solid #222; width: 300px; margin: 0 auto;"
                />
                <div class="mt-1">
                  Firma y Sello de la Empresa
                </div>
              </div>
            </div>
          </b-card-body>
          <!-- Spacer -->
          <div class="targetaDePie">
            <!-- Note -->
            <b-card-body class="invoice-padding p-0 m-0 pb-2 text-center">
              <hr class="invoice-spacing p-0 m-1">
              <span class="m-1 pt-0">
                Av. Principal, Casa S/N Sector La Raya (La Raya Arriba) Barinas Zona Postal 5217
              </span>
            </b-card-body>
          </div>
        </b-card>
      </b-col>
      <!-- Right Col: Card -->
      <b-col
        cols="12"
        md="4"
        xl="3"
        class="invoice-actions"
      >
        <b-card
          class="position-fixed"
          style="width: 18%;"
        >
          <!-- Button: Print -->
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-info"
            class="mb-75"
            block
            @click="printInvoice"
          >
            Imprimir
          </b-button>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>

import {
  BRow,
  BCol,
  BCard,
  BButton,
  BCardBody,
  BCardText,
  BAlert,
  BLink,
  VBToggle,
} from 'bootstrap-vue'
import Logo from '@core/layouts/components/Logo.vue'
import Ripple from 'vue-ripple-directive'
import { mapState } from 'vuex'
import { confirmAlert } from '@/helpers/utils'

export default {
  directives: {
    Ripple,
    'b-toggle': VBToggle,
  },
  components: {
    BRow,
    BCol,
    BCard,
    BButton,
    BCardBody,
    BCardText,
    BAlert,
    BLink,
    Logo,
  },
  data() {
    return {
      invoiceData: {},
      employeeData: null,
      loaded: false,
    }
  },
  computed: {
    ...mapState({
      items: state => state.payment.invoice,
      currency: state => state.currency.items,
    }),
    invoiceNumber() {
      // Serializa el id a 8 dígitos con ceros a la izquierda
      if (!this.invoiceData || !this.invoiceData.id) return ''
      return String(this.invoiceData.id).padStart(8, '0')
    },
  },
  mounted() {
    this.getEmployeeData()
  },
  methods: {
    getEmployeeData() {
      // Obtiene el id desde la ruta
      const { id } = this.$route.params
      this.$store.dispatch('employee/getById', id).then(data => {
        this.employeeData = data
        this.loaded = true
      })
    },
    printInvoice() {
      window.print()
    },
    async paidCarrier(item) {
      const res = await confirmAlert('¿Está seguro de Pagar este Rutero?')
      if (res.value) {
        const r = await this.$store.dispatch('payment/paid', {
          id: item,
        })
        console.log(r)
        this.$swal('Pagado', 'El Rutero ha sido Pagado', 'success')
        this.getItems()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
    @import "~@core/scss/base/pages/app-invoice.scss";

// Oculta el watermark en pantalla, solo visible al imprimir
.only-print {
  display: none;
}

@media print {
  .only-print {
    display: flex !important;
  }
}

// Asegura que el contenido esté por encima del watermark
.invoice-preview-wrapper {
  position: relative;
  z-index: 1;
}
</style>

<style lang="scss">
          @media print {

            // Global Styles
            body {
              background-color: transparent !important;
            }
            nav.header-navbar {
              display: none;
            }
            .main-menu {
              display: none;
            }
            .header-navbar-shadow {
              display: none !important;
            }
            .content.app-content {
              margin-left: 0;
              padding-top: 2rem !important;
            }
            footer.footer {
              display: none;
            }
            .card {
              background-color: transparent;
              box-shadow: none;
            }
            .customizer-toggle {
              display: none !important;
            }

            // Invoice Specific Styles
            .invoice-preview-wrapper {
              .row.invoice-preview {
                .col-md-8 {
                  max-width: 100%;
                  flex-grow: 1;
                }

                .invoice-preview-card {
                  .card-body:nth-of-type(2) {
                    .row {
                        > .col-12 {
                        max-width: 50% !important;
                      }

                      .col-12:nth-child(2) {
                        display: flex;
                        align-items: flex-start;
                        justify-content: flex-end;
                        margin-top: 0 !important;
                      }
                    }
                  }
                }
              }

              // Action Right Col
              .invoice-actions {
                display: none;
              }
            }
            // Watermark background logo styles para impresión
            .invoice-watermark-bg {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              opacity: 0.08 !important;
              z-index: 0 !important;
              pointer-events: none !important;
            }
            .invoice-watermark-bg img {
              max-width: 90vw !important;
              max-height: 95vh !important;
              filter: grayscale(100%) contrast(110%);
              user-select: none;
            }
          }
</style>

<style scoped>
        @media print {
          @page {
            width: 100%;
            max-width: none;
          }
          .invoice-preview-wrapper {
            font-size: 15pt;
            size: letter;
          }
          .targetaDePie{
            position: fixed;
            bottom: 0;
            width: 100%;
          }
          .fechaIzquierda {
           position: absolute;
           padding-left: 75%;
           text-align: right;
          }
        }
</style>

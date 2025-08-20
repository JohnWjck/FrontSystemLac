<template>
  <section class="invoice-preview-wrapper">
    <!-- Watermark Logo Background SIEMPRE visible -->
    <div class="invoice-watermark-bg only-print">
      <img
        src="/logoMV.png"
        alt="Logo Marca de Agua"
      >
    </div>

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
          <b-card-body class="pb-0">
            <div class="d-flex justify-content-between flex-md-row flex-column mt-0">
              <div>
                <div class="logo-wrapper mb-25">
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
                    <p class="text-center text-info">
                      Av. Principal, Casa S/N Sector La Raya (La Raya Arriba) Barinas Zona Postal 5217.
                    </p>
                  </div>
                </div>
                <b-card-text class="mb-25 ml-2">
                  <strong>Rif-J-41237828-7</strong>
                </b-card-text>
                <b-card-text class="mb-25 ml-1">
                  <strong>Tlf-(0416)-195-70-38</strong><br>
                  <strong>Tlf-(0412)-673-47-76</strong>
                </b-card-text>
              </div>
              <!-- Header: Right Content -->
              <div class="mt-md-0 mt-2 float-right fechaIzquierda">
                <h4 class="invoice-title mb-25">
                  N° <span class="invoice-number">#{{ invoiceNumber }}</span>
                </h4>
                <div class="invoice-date-wrapper">
                  <p class="invoice-date-title">
                    Fecha:
                  </p>
                  <p class="invoice-date">
                    {{ new Date(invoiceData.created_at).toLocaleDateString('es-ES') }}
                  </p>
                </div>
              </div>
            </div>
            <div style="margin-top: -7rem;">
              <h3 class="text-center text-info">
                <strong>Reporte Semanal del Rutero</strong>
              </h3>
              <p class="text-center mb-0">
                <strong>Del {{ new Date(invoiceData.start_week).toLocaleDateString('es-ES') }} Al {{ new Date(invoiceData.end_week).toLocaleDateString('es-ES') }}</strong>
              </p>
            </div>
          </b-card-body>

          <!-- Spacer -->
          <hr class="invoice-spacing mb-25 mt-3">

          <!-- Invoice Client & Payment Details -->
          <p
            v-if="invoiceData.id && invoiceData.carrier && invoiceData.carrier[0]"
            class="text-center p-0 m-0"
          >
            <strong>Rutero:</strong>
            {{ invoiceData.carrier[0].dni }} -
            {{ invoiceData.carrier[0].name }}
            <strong>TLF:</strong> {{ invoiceData.carrier[0].phone }}
            <strong>Dirección:</strong> {{ invoiceData.carrier[0].address }}
          </p>

          <!-- Invoice Description: Table -->
          <b-table
            v-if="loaded"
            small
            responsive
            :items="invoiceData.milk_loads"
            :fields="fields"
            class="table-sm text-center border-0"
          >
            <template #cell(created_at)="data">
              <b-card-text class="text-nowrap mb-25">
                {{ formatDate(data.value, true).split(',')[0] }}
              </b-card-text>
              <b-card-text class="font-weight-bold mb-25">
                {{ formatDate(data.value, false) }}
              </b-card-text>
            </template>
            <template #cell(producer.name)="data">
              <b-card-text class="font-weight-bold mb-25">
                {{ data.value }}
              </b-card-text>
            </template>
            <template #cell(liters)="data">
              <b-card-text class="font-weight-bold mb-25">
                {{ data.value }} Lts
              </b-card-text>
            </template>
            <template #cell(price_per_carrier)="data">
              <b-card-text class="font-weight-bold mb-25">
                ${{ data.value }}
              </b-card-text>
            </template>
            <template #cell(subTotal)="data">
              <b-card-text class="font-weight-bold mb-25">
                ${{ (data.item.liters * data.item.price_per_carrier).toFixed(2) }}
              </b-card-text>
            </template>
          </b-table>
          <b-col
            cols="12"
            xl="12"
            class="float-right"
          >
            <h5 class="p-0 ml-2 float-left text-info">
              Total en Litros: {{ invoiceData.liters }}Lts
            </h5>
            <h4
              v-b-tooltip.hover.top="'Bs '+(invoiceData.amount * convercion).toFixed(2)"
              class="p-0 float-right text-info"
            >
              {{ invoiceData.status === 'Pagado' ? ' Total Pagado' : ' Total a Pagar' }}  ${{ invoiceData.amount }}
            </h4>
            <hr class="invoice-spacing">
          </b-col>
          <!-- Spacer -->
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
          <div class="mb-1 text-center">
            <b-badge
              pill
              :variant="invoiceData.status === 'Pendiente' ? 'warning' : 'success'"
            >
              {{ invoiceData.status }}
            </b-badge>
          </div>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-info"
            class="mb-75"
            block
            @click="printInvoice"
          >
            Imprimir
          </b-button>
          <!-- Button: Send Invoice -->
          <b-button
            v-if="invoiceData.status === 'Pendiente'"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="outline-success"
            class="mb-75"
            block
            @click="paidCarrier(invoiceData.id)"
          >
            Pagar
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
  BBadge,
  BTable,
  BCardText,
  BAlert,
  BLink,
  VBToggle,
} from 'bootstrap-vue'
import Logo from '@core/layouts/components/Logo.vue'
import Ripple from 'vue-ripple-directive'
import { mapState } from 'vuex'
import Vue from 'vue'
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
    BTable,
    BCardText,
    BAlert,
    BLink,
    BBadge,
    Logo,
  },
  data() {
    return {
      invoiceData: Vue.observable({}),
      convercion: null,
      liters: null,
      totalIva: '0.00',
      fields: [
        {
          key: 'created_at',
          label: 'Fecha',
          sortable: true,
        },
        {
          key: 'producer.name',
          label: 'Productor',
        },
        {
          key: 'liters',
          label: 'Litros',
          sortable: true,
        },
        {
          key: 'price_per_carrier',
          label: 'Precio',
          sortable: true,
        },
        {
          key: 'subTotal',
          label: 'Sub Total',
          sortable: true,
        },
      ],
      carrier: [
        {
          key: 'dni',
          label: 'Identificación',
        },
        {
          key: 'name',
          label: 'Rutero',
        },
        {
          key: 'phone',
          label: 'Teléfono',
        },
        {
          key: 'address',
          label: 'Dirección',
        },
      ],
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
    this.getItems()
  },
  methods: {
    getItems() {
      this.$store.dispatch('currency/get').then(() => {
        // Busca el registro con el nombre '$'
        const dollarCurrency = this.currency.find(({ id }) => id === 1)
        const dollar = dollarCurrency ? parseFloat(dollarCurrency.price) : 0

        // Busca el registro con el nombre 'litros'
        const literCurrency = this.currency.find(({ id }) => id === 3)
        const liters = literCurrency ? parseFloat(literCurrency.price) : 0

        // Asigna los valores a las variables
        this.convercion = dollar
        this.liters = liters

        console.log(this.convercion, this.liters)
      })
      this.$store.dispatch('payment/getInvoiceCarrier', { id: this.$route.params.id }).then(() => {
        const invoice = this.items
        if (invoice) {
          const {
            milk_loads, payment,
          } = invoice
          const { id } = payment
          const { liters } = payment
          const { payable } = payment
          const carrier = [payable]
          const { created_at } = payment
          const { start_week } = payment
          const { end_week } = payment
          const { amount } = payment
          const { status } = payment

          // Asigna los valores a las variables

          this.invoiceData = {
            id,
            milk_loads,
            payment,
            liters,
            carrier,
            created_at,
            start_week,
            end_week,
            amount,
            status,
          }
        }
        this.loaded = true
      })
    },
    formatDate(dateString, showWeekday = true) {
      const date = new Date(dateString)
      if (!date) return ''
      const options = showWeekday
        ? {
          weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC',
        }
        : {
          year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC',
        }
      return date.toLocaleDateString('es-ES', options)
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
              padding-top:  1rem !important;
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
              // Hacer la tabla y sus celdas completamente transparentes al imprimir
              .invoice-preview-wrapper .table,
              .invoice-preview-wrapper .table th,
              .invoice-preview-wrapper .table td,
              .invoice-preview-wrapper .b-table,
              .invoice-preview-wrapper .b-table th,
              .invoice-preview-wrapper .b-table td {
                background: transparent !important;
                background-color: transparent !important;
                box-shadow: none !important;
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
                  position: absolute !important;
                  top: 0 !important;
                  left: 0 !important;
                  width: 100vw !important;
                  height: auto !important;
                  display: flex !important;
                  align-items: flex-start !important;
                  justify-content: center !important;
                  opacity: 0.08 !important;
                  z-index: 0 !important;
                  pointer-events: none !important;
            }
            .invoice-watermark-bg img {
                  max-width: 70vw !important;
                  max-height: 75vh !important;
                margin-top: 0 !important;
                padding-top: 0 !important;
                filter: grayscale(100%) contrast(150%);
                user-select: none;
            }
            // El resto de estilos de impresión ya están definidos arriba
          }
</style>

<style scoped>
        @media print {
            @page {
              width: 100%;
              max-width: none;
              margin-top: -1.5%;
            }
          .invoice-preview-wrapper {
            font-size: 9pt;
            size: letter;
          }
          .fechaIzquierda {
           position: absolute;
           padding-left: 75%;
           text-align: right;
          }
        }
</style>

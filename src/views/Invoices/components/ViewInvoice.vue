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
          <b-card-body class="invoice-padding pb-0">

            <div class="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">

              <div>
                <div class="logo-wrapper mb-1">
                  <logo />
                  <h3 class="ml-5 text-info invoice-logo">
                    DISTRIBUIDORA E INVERSIONES LACTEOS
                  </h3>
                </div>
                <b-card-text class="mb-25 ml-4">
                  <strong>Rif-J-41237828-7</strong>
                </b-card-text>
                <b-card-text class="mb-25 ml-3">
                  <strong>Tlf-0416-196-70-38</strong>
                </b-card-text>
              </div>

              <!-- Header: Right Content -->
              <div class="mt-md-0 mt-2 float-right fechaIzquierda">
                <h4 class="invoice-title">
                  N°
                  <span class="invoice-number">#{{ invoiceNumber }}</span>
                </h4>
                <div class="invoice-date-wrapper">
                  <p class="invoice-date-title">
                    Fecha:
                  </p>
                  <p class="invoice-date">
                    {{ invoiceData.created_at }}
                  </p>
                </div>
              </div>
            </div>
          </b-card-body>

          <!-- Spacer -->
          <h3 class="text-center text-info">
            <strong>Orden de Compra</strong>
          </h3>
          <hr class="invoice-spacing">

          <!-- Invoice Client & Payment Details -->
          <b-card-body
            v-if="invoiceData.id && invoiceData.customer && invoiceData.customer[0]"
            class="invoice-padding pt-0"
          >
            <b-card class="mb-1 bg-light border-info align-items-center">
              <b-card-title class="text-info mb-1" />
              <b-row class="align-items-center">
                <b-col
                  class="ßmb-md-0"
                >
                  <strong>Cliente:</strong>
                  {{ invoiceData.customer[0].dni }} -
                  {{ invoiceData.customer[0].name }}
                  <strong>TLF:</strong>  {{ invoiceData.customer[0].phone }}
                  <strong>Dirección:</strong> {{ invoiceData.customer[0].address }}
                </b-col>
              </b-row>
            </b-card>
          </b-card-body>

          <!-- Invoice Description: Table -->
          <b-table-lite
            v-if="loaded"
            responsive
            :items="details"
            :fields="fields"
            class="mb-5 text-center"
          >
            <template #cell(created_at)="data">
              <b-card-text class="font-weight-bold mb-25">
                {{ new Date(data.value).toLocaleDateString('es-ES') }}
              </b-card-text>
            </template>
            <template #cell(kilograms)="data">
              <b-card-text class="font-weight-bold mb-25">
                {{ data.value }} Kg
              </b-card-text>
            </template>
            <template #cell(amount)="data">
              <b-card-text class="font-weight-bold mb-25">
                ${{ data.value }}
              </b-card-text>
            </template>
          </b-table-lite>
          <b-col
            cols="12"
            xl="12"
            class="float-right"
          >
            <h5
              class="p-0 float-right"
            >
              Total en Kilos: {{ invoiceData.kilograms }}Kg
            </h5><br><br>
            <h4
              v-b-tooltip.hover.top="'Bs '+(invoiceData.amount * convercion).toFixed(2)"
              class="p-0 float-right text-success"
            >
              {{ invoiceData.status === 'Pagado' ? 'Total Pagado' : 'Total a Pagar' }}  ${{ invoiceData.amount }}
            </h4>
          </b-col>
          <div class="mb-5" />
          <!-- Spacer -->
          <div class="targetaDePie">
            <hr class="invoice-spacing">
            <!-- Note -->
            <b-card-body class="invoice-padding p-0 m-0 pb-2 text-center">
              <span class="font-weight-bold text-info m-0 p-0">
                Productos de primera calidad, para un sabor inigualable.
              </span>
              <hr class="invoice-spacing p-0 m-1">
              <span class="m-1 pt-0">
                Sabaneta de Barinas Zona Postal 5201
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
            @click="paidProducer(invoiceData.id)"
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
  BTableLite,
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
    BTableLite,
    BCardText,
    BAlert,
    BLink,
    BBadge,
    Logo,
  },
  data() {
    return {
      invoiceData: Vue.observable({}),
      details: Vue.observable({}),
      convercion: null,
      liters: null,
      totalIva: '0.00',
      fields: [
        {
          key: 'created_at',
          label: 'Emitido',
        },
        {
          key: 'cheese.name',
          label: 'Tipo de Queso',
        },
        {
          key: 'kilograms',
          label: 'Kilos',
        },
        {
          key: 'amount',
          label: 'Sub Total',
        },
      ],
      customer: [
        {
          key: 'dni',
          label: 'Identificación',
        },
        {
          key: 'name',
          label: 'Razón Social',
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
      items: state => state.invoice.invoice,
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
        const literCurrency = this.currency.find(({ id }) => id === 2)
        const liters = literCurrency ? parseFloat(literCurrency.price) : 0

        // Asigna los valores a las variables
        this.convercion = dollar
        this.liters = liters

        console.log(this.convercion, this.liters)
      })
      this.$store.dispatch('invoice/getInvoice', { id: this.$route.params.id }).then(() => {
        const { dataNote } = this.items

        if (dataNote) {
          this.invoiceData = {
            id: dataNote.id,
            cheese: dataNote.cheese,
            customer: [dataNote.customer],
            created_at: new Date(dataNote.created_at).toLocaleDateString('es-ES'),
            kilograms: dataNote.kilograms,
            amount: dataNote.amount,
            status: dataNote.status,
          }

          this.details = [dataNote]
        }
        this.loaded = true
      })
    },
    printInvoice() {
      window.print()
    },
    async paidProducer(item) {
      const res = await confirmAlert('¿Está seguro de Pagar esta Nota?')
      if (res.value) {
        const r = await this.$store.dispatch('invoice/paid', {
          id: item,
        })
        console.log(r)
        this.$swal('Pagado', 'La Nota ha sido Pagada', 'success')
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
            // El resto de estilos de impresión ya están definidos arriba
          }
</style>

<style scoped>
        @media print {
          @page {
            width: 100%;
            max-width: none;
          }
          .invoice-preview-wrapper {
            font-size: 14pt;
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

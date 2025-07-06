<template>
  <section class="invoice-preview-wrapper">

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
                    SysLact
                  </h3>
                </div>
                <b-card-text class="mb-25 ml-4">
                  <strong>Rif-J-xxxx-xxxx-xx</strong>
                </b-card-text>
                <b-card-text class="mb-25 ml-3">
                  <strong>Tlf-xxxx-xxx-xx-xx</strong>
                </b-card-text>
              </div>

              <!-- Header: Right Content -->
              <div class="mt-md-0 mt-2 float-right fechaIzquierda">
                <h4 class="invoice-title">
                  N°
                  <span class="invoice-number">#{{ invoiceData.id }}</span>
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
            <strong>Reporte Semanal del Rutero</strong>
          </h3>
          <p class="text-center mb-0">
            <strong>Del {{ invoiceData.start_week }} Al {{ invoiceData.end_week }}</strong>
          </p>
          <hr class="invoice-spacing">

          <!-- Invoice Client & Payment Details -->
          <b-card-body
            v-if="invoiceData.id"
            class="invoice-padding pt-0"
          >
            <b-row class="invoice-spacing">

              <!-- Col: Invoice To -->
              <b-table-lite
                v-if="loaded"
                responsive
                :items="invoiceData.carrier"
                :fields="carrier"
                class="mb-2"
              />
            </b-row>
          </b-card-body>

          <!-- Invoice Description: Table -->
          <b-table-lite
            v-if="loaded"
            responsive
            :items="invoiceData.milk_loads"
            :fields="fields"
            class="mb-5 text-center"
          >
            <template #cell(created_at)="data">
              <b-card-text class="text-nowrap mb-25">
                {{ new Date(data.value).toLocaleDateString('es-ES', { weekday: 'long' }) }}
              </b-card-text>
              <b-card-text class="font-weight-bold mb-25">
                {{ new Date(data.value).toLocaleDateString('es-ES') }}
              </b-card-text>
            </template>
            <template #cell(liters)="data">
              <b-card-text class="font-weight-bold mb-25">
                {{ data.value }} Lts
              </b-card-text>
            </template>
            <template #cell(subTotal)="data">
              <b-card-text class="font-weight-bold mb-25">
                ${{ (data.item.liters * liters).toFixed(2) }}
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
              Total en Litros: {{ invoiceData.liters }}Lts
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
                Leche de primera calidad, para un sabor inigualable.
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
          key: 'subTotal',
          label: 'Sub Total',
          sortable: true,
        },
      ],
      carrier: [
        {
          key: 'dni',
          label: 'Identificación',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Rutero',
          sortable: true,
        },
        {
          key: 'phone',
          label: 'Teléfono',
          sortable: true,
        },
        {
          key: 'address',
          label: 'Dirección',
          sortable: true,
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
            created_at: new Date(created_at).toLocaleDateString('es-ES'),
            start_week: new Date(start_week).toLocaleDateString('es-ES'),
            end_week: new Date(end_week).toLocaleDateString('es-ES'),
            amount,
            status,
          }
        }
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

<template>
  <section id="dashboard-ecommerce">
    <b-row class="match-height">
      <b-col
        xl="4"
        md="6"
      >
        <actions @saved="() => getItems()" />
      </b-col>
      <b-col
        xl="8"
        md="6"
      >
        <ecommerce-statistics :data="staticItems" />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        md="12"
      >
        <DayAndWeek :days="milkPerDayByWeek" />
      </b-col>
    </b-row>
    <b-row class="match-height">
      <b-col
        xl="6"
        md="6"
      >
        <top-producer :store="topProducer" />
      </b-col>
      <b-col
        xl="6"
        md="6"
      >
        <top-carrier
          :store="topCarrier"
        />
      </b-col>
    </b-row>
  </section>
</template>

<script>
import {
  BRow,
  BCol,
} from 'bootstrap-vue'
import { mapState } from 'vuex'
import TopProducer from '@/views/Accounting/TopProducer.vue'
import TopCarrier from '@/views/Accounting/TopCarrier.vue'
import Actions from '@/views/Accounting/Actions.vue'
import EcommerceStatistics from '@/views/Accounting/components/EcommerceStatistics.vue'
import DayAndWeek from '@/views/Accounting/DayAndWeek.vue'

export default {
  components: {
    BRow,
    BCol,
    Actions,
    TopProducer,
    TopCarrier,
    EcommerceStatistics,
    DayAndWeek,
  },
  data() {
    return {
      store: { name: 'hola' },
    }
  },
  computed: {
    ...mapState({
      topProducer: state => state.accounting.topProducer,
      pendingInvoice: state => state.accounting.invoicePending,
      topCarrier: state => state.accounting.topCarrier,
      kilosCheese: state => state.accounting.kilosCheese,
      milkWeek: state => state.accounting.milkWeek,
      milkDay: state => state.accounting.milkDay,
      milkPerDayByWeek: state => state.accounting.milkPerDayByWeek,
      cheeses: state => state.cheese.cheeses,
    }),
    cheeseTooltip() {
      if (!this.cheeses || !this.cheeses.length) return 'Sin datos'
      // Genera una lista HTML ordenada, resaltando en verde si es mayor a 0
      return `
        <ul style='margin:0;padding-left:1.2em;'>
          ${this.cheeses.map(q => {
    const isPositive = parseFloat(q.kilograms) > 0
    return `<li>${q.name}: <span style='color:${isPositive ? '#28c76f' : '#ea5455'};font-weight:bold;'>${q.kilograms} </span>kg</li>`
  }).join('')}
        </ul>
      `
    },
    staticItems() {
      return [
        {
          icon: 'CodesandboxIcon',
          color: 'light-warning',
          title: `${this.kilosCheese.kilos || 0} kg`,
          subtitle: 'Queso en existencia',
          tooltip: this.cheeseTooltip,
          tooltipHtml: true,
        },
        {
          icon: 'DatabaseIcon',
          color: 'light-info',
          title: `${this.milkWeek.litros || 0} L`,
          subtitle: 'Litros por Semana',
        },
        {
          icon: 'DropletIcon',
          color: 'light-success',
          title: `${this.milkDay.litros || 0} L`,
          subtitle: 'Litros por Dia',
        },
        {
          icon: 'DollarSignIcon',
          color: 'light-danger',
          title: `${this.pendingInvoice.total || 0}`,
          subtitle: 'Clientes Pendientes',
        },
      ]
    },
  },
  mounted() {
    this.getItems()
    this.$store.dispatch('cheese/getCheeses')
  },
  methods: {
    getItems() {
      this.$store.dispatch('accounting/getTopProducers')
      this.$store.dispatch('accounting/getInvoicePending')
      this.$store.dispatch('accounting/getTopCarriers')
      this.$store.dispatch('accounting/getKilosCheese')
      this.$store.dispatch('accounting/getMilkWeek')
      this.$store.dispatch('accounting/getMilkDay')
      this.$store.dispatch('accounting/getMilkPerDayByWeek')
    },
  },
}
</script>

<style lang="scss">
  @import '@core/scss/vue/pages/dashboard-ecommerce.scss';
  @import '@core/scss/vue/libs/chart-apex.scss';
</style>

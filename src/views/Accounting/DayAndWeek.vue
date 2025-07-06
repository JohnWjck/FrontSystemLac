<template>
  <b-card no-body>
    <b-card-header>
      <!-- title -->
      <div>
        <b-card-title class="font-weight-bolder">
          Litros por día en la semana
        </b-card-title>
      </div>
    </b-card-header>

    <b-card-body>
      <vue-apex-charts
        type="bar"
        height="350"
        :options="barChart.chartOptions"
        :series="barChart.series"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardBody, BCardTitle,
} from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'

export default {
  components: {
    VueApexCharts,
    BCard,
    BCardHeader,
    BCardBody,
    BCardTitle,
  },
  props: {
    store: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      barChart: {
        series: [],
        chartOptions: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          colors: ['#28b463'], // Puedes cambiar el color si lo deseas
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: '30%',
              endingShape: 'rounded',
            },
          },
          grid: {
            xaxis: {
              lines: {
                show: false,
              },
            },
          },
          dataLabels: {
            enabled: true,
          },
          xaxis: {
            categories: [],
          },
          yaxis: {},
        },
      },
    }
  },
  watch: {
    store: {
      immediate: true,
      handler(newStore) {
        this.updateChartData(newStore.days)
      },
    },
  },
  methods: {
    updateChartData(days) {
      const seriesData = days.map(day => parseFloat(day.liters))
      const categories = days.map(day => {
        const date = new Date(day.date)
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' })
        return `${dayName}, ${date.getDate()}`
      })

      this.barChart.series = [{ data: seriesData }]
      this.barChart.chartOptions.xaxis.categories = categories
    },
  },
}
</script>

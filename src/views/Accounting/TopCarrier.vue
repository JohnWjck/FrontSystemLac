<template>
  <b-card no-body>
    <b-card-header>
      <b-card-title class="mb-sm-0 mb-1">
        Top 3 Ruteros con más litros al mes
      </b-card-title>
    </b-card-header>

    <b-card-body>
      <vue-apex-charts
        type="radialBar"
        height="400"
        :options="radialBarChart.chartOptions"
        :series="radialBarChart.series"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardTitle, BCardBody, BCardHeader,
} from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'

const chartColors = {
  donut: {
    series1: '#2b9bf4',
    series2: '#3498db',
    series3: '#21618c',
  },
}

export default {
  components: {
    VueApexCharts,
    BCard,
    BCardTitle,
    BCardBody,
    BCardHeader,
  },
  props: {
    store: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      radialBarChart: {
        series: [],
        chartOptions: {
          colors: [],
          plotOptions: {
            radialBar: {
              size: 185,
              hollow: {
                size: '25%',
              },
              track: {
                margin: 15,
              },
              dataLabels: {
                name: {
                  fontSize: '2rem',
                  fontFamily: 'Montserrat',
                },
                value: {
                  fontSize: '1rem',
                  fontFamily: 'Montserrat',
                },
                total: {
                  show: true,
                  fontSize: '1rem',
                  label: 'Ruteros',
                  formatter() {
                    return '100Lts = 1%'
                  },
                },
              },
            },
          },
          legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
          },
          stroke: {
            lineCap: 'round',
          },
          labels: [],
        },
      },
    }
  },
  watch: {
    store: {
      immediate: true,
      handler(newStore) {
        this.updateChartData(newStore)
      },
    },
  },
  mounted() {
    this.updateChartData(this.store)
  },
  methods: {
    updateChartData(store) {
      const series = store.map(item => parseFloat(item.quantity / 100))
      const labels = store.map(item => item.name)
      const colors = [
        chartColors.donut.series1,
        chartColors.donut.series2,
        chartColors.donut.series3,
      ]

      this.radialBarChart.series = series
      this.radialBarChart.chartOptions.labels = labels
      this.radialBarChart.chartOptions.colors = colors
    },
  },
}
</script>

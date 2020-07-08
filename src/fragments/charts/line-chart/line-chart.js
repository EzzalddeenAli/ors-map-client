import {Line} from 'vue-chartjs'

export default {
  extends: Line,
  data () {
    return {
      gradient: null,
      gradient2: null
    }
  },
  props: {
    labels: {
      type: Array,
      required: true
    },
    datasets: {
      type: Array,
      required: true
    }
  },
  methods: {
    render () {
      this.renderChart(
        {
          labels: this.labels,
          datasets: this.datasets
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          height: 100
        }
      )
    },
    tryRender (event) {
      try {
        this.render(event)
      } catch (error) {
        // silence is gold
      }
    }
  },
  watch: {
    labels: function () {
      this.render()
    },
    datasets: function () {
      this.render()
    }
  },
  mounted () {
    this.render()
    window.addEventListener('resize', this.tryRender)
  },
  destroyed () {
    window.removeEventListener('resize', this.tryRender, false)
  }
}
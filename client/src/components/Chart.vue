<script>
  import { Line, mixins } from 'vue-chartjs';

  const Chart = {
    extends: Line,
    mixins: [mixins.reactiveProp],
    mounted() {
      this.renderChart(this.chartData, {
        maintainAspectRatio: false,
        responsive: true
      });
    }
  };

  export default Chart;
</script>

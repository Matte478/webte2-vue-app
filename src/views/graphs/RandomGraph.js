import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}
// {
//   extends: VueChartJs.Line,
//   mounted () {
//     this.renderChart({
//       labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      // datasets: [
			// 	{
			// 		label: 'data two',
			// 		backgroundColor: "#f82599",
			// 		data: [10, 29, 0, 30, 9, 8, 4]
			// 	},
      //   {
      //     label: 'Data One',
      //     backgroundColor: '#f87979',
      //     data: [40, 39, 10, 40, 39, 80, 40]
					
      //   }
      // ]
//     }, {responsive: true, maintainAspectRatio: false})
//   }
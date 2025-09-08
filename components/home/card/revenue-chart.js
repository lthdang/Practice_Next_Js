// eslint-disable-next-line
export default {
  height: 228,
  type: 'donut',
  options: {
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      min: 0,
      max: 100,
    },
    labels: ['Youtube', 'Facebook', 'Twitter'],
    legend: {
      show: true,
      position: 'bottom',
      fontFamily: 'inherit',
      labels: {
        colors: 'inherit',
      },
    },
    itemMargin: {
      horizontal: 10,
      vertical: 10,
    },
    colors: ['#ff413a', '#3366ff', '#00cfd5'],
  },
  series: [1258, 975, 500],
};

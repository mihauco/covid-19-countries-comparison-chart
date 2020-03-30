<template>
  <div
    class="chart-view"
    v-if="countriesData"
  >
    <div class="chart-view__wrapper">
      <chart
        :key="chartKey"
        :style="{
          height: '400px',
          position: 'relative'
        }"
        :chart-data="chartData"
      />
    </div>
    <div class="chart-view__controls">
      <div class="chart-view__controll">
        <b-switch
          v-model="casesType"
          true-value="active"
          false-value="total"
        >
          Only active cases
        </b-switch>
      </div>
      <div class="chart-view__controll">
        <b-switch
          v-model="chartType"
          true-value="fromDayZero"
          false-value="dayByDay"
        >
          From day zero
        </b-switch>
      </div>
      <div class="chart-view__controll chart-view__controll--period">
        <period-picker
          :options="periodOptions"
          @change="peridChangeHandler"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import Chart from './Chart.vue';
  import PeriodPicker from './PeriodPicker.vue';

  const ChartView = {
    name: 'chart-view',
    components: {
      Chart,
      PeriodPicker
    },
    props: {
      countriesData: Array
    },
    data() {
      return {
        casesType: 'total',
        chartType: 'dayByDay',
        colors: [
          '#f53b57',
          '#3c40c6',
          '#ffa801',
          '#05c46b',
          '#1e272e'
        ],
        chartKey: 0,
        chartData: null,
        period: null,
        periodOptions: []
      };
    },
    watch: {
      countriesData() {
        this.createPeriodPickerOptions();
        this.period = null;
        this.createChartData();
        this.chartKey++;
      },
      chartType() {
        this.createPeriodPickerOptions();
        this.period = null;
        this.createChartData();
      },
      casesType() {
        this.createChartData();
      }
    },
    methods: {
      createChartData() {
        if (!this.countriesData) return;

        this.chartData = {
          labels: this.createLabels(),
          datasets: this.createDatasets()
        };
      },
      getCountryWithLongestPeriod() {
        let countryWithLongestPeriod;

        this.countriesData.forEach(country => {
          if (!countryWithLongestPeriod || countryWithLongestPeriod.data.total.length < country.data.total.length) {
            countryWithLongestPeriod = country;
          }
        });

        return countryWithLongestPeriod;
      },
      createLabels() {
        return this.getCountryWithLongestPeriod().data.total
          .map((dayData, dayIndex) => this.chartType === 'dayByDay' ? dayData.date : dayIndex)
          .filter(day => {
            if (this.period) {
              const currentDay = this.chartType === 'dayByDay' ? new Date(day).getTime() : day;
              return currentDay >= this.period[0] && currentDay <= this.period[1];
            }

            return true;
          })
          .map(day => {
            return this.chartType === 'dayByDay' ? day : `Day ${day}`;
          });
      },
      createDatasets() {
        return this.countriesData
          .map((countryData, countryIndex) => {
            const countryDataset = countryData.data[this.casesType]
              .filter((dayData, dayIndex) => {
                if (this.period) {
                  const currentDay = this.chartType === 'dayByDay' ? new Date(dayData.date).getTime() : dayIndex;
                  return currentDay >= this.period[0] && currentDay <= this.period[1];
                }

                return true;
              })
              .map(dayData => {
                return dayData.cases;
              });

            if (this.chartType === 'dayByDay') {
              while (countryDataset.length < this.getCountryWithLongestPeriod().data[this.casesType].length) {
                countryDataset.unshift(0);
              }
            }

            return {
              label: countryData.name,
              fill: false,
              borderColor: this.colors[countryIndex],
              data: countryDataset
            };
          });
      },
      createPeriodPickerOptions() {
        this.periodOptions = this.getCountryWithLongestPeriod().data.total
          .map((dayData, dayIndex) => {
            if (this.chartType === 'dayByDay') {
              return {
                label: dayData.date,
                value: new Date(dayData.date).getTime()
              };
            }

            return {
              label: `Day ${dayIndex}`,
              value: dayIndex
            };
          });
      },
      peridChangeHandler(data) {
        this.period = data;
        this.createChartData();
      }
    }
  };

  export default ChartView;
</script>

<style lang="scss">
  @import '../utilities/mediaMixin.scss';

  .chart-view {
    &__wrapper {
      background: #f5f5f5;
      border-radius: 5px;
      margin-bottom: 30px;
    }

    &__controls {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: center;
    }

    &__controll {
      width: 50%;

      @include mediaMixin {
        width: 33%;
      }

      &--period {
        width: 100%;
        margin-top: 20px;

        @include mediaMixin {
          width: 33%;
          margin-top: 0;
        }
      }
    }
  }
</style>

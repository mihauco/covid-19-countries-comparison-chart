<template>
  <div class="app">
    <b-loading
      :active="isLoading"
    />
    <header class="app__header">
      <h1 class="app__headline | title is-3">COVID-19 cases - countries comparison chart</h1>
    </header>
    <countries-list
      class="app__countries-list"
      :countries-list="countriesList"
      @countriesselect="loadCountriesData"
    />
    <chart-view
      class="app__chart-view"
      :countries-data="countriesData"
    />
    <footer class="app__footer">
      <span class="app__footer-info">
        Data source: <a href="https://www.worldometers.info/coronavirus/" target="_blank">worldometers.info</a>
      </span>
      <span class="app__footer-info">
        <a href="https://github.com/noiff/covid-19-countries-comparison-chart" target="_blank">github</a>
      </span>
    </footer>
  </div>
</template>

<script>
  import axios from 'axios';
  import CountriesList from './CountriesList.vue';
  import ChartView from './ChartView.vue';

  const App = {
    name: 'app',
    components: {
      CountriesList,
      ChartView
    },
    data() {
      return {
        isLoading: false,
        countriesList: [],
        countriesData: null
      };
    },
    created() {
      this.loadCountriesList();
    },
    methods: {
      loadCountriesList() {
        this.isLoading = true;
        axios.get('/api/get-countries-list')
          .then(response => {
            this.countriesList = response.data;
            this.isLoading = false;
          });
      },
      loadCountriesData(countries) {
        this.isLoading = true;
        axios.get(`/api/get-countries-data?countries=${countries.join(',')}`)
          .then(response => {
            this.countriesData = response.data;
            this.isLoading = false;
          });
      }
    }
  };

  export default App;
</script>

<style lang="scss">
  .app {
    width: 100%;
    max-width: 750px;
    padding: 15px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    padding-bottom: 100px;

    &__chart-view {
      margin-top: 30px;
    }

    &__header {
      border-bottom: 1px solid #ddd;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }

    &__footer {
      position: absolute;
      width: calc(100% - 30px);
      left: 15px;
      bottom: 0;
      min-height: 50px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
    }
  }
</style>

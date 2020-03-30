<template>
  <div class="countries-list">
    <div class="countries-list__header">
      <h2 class="countries-list__headline subtitle">Pick up to 5 countries.</h2>
      <b-input
        class="countries-list__search"
        placeholder="Search country"
        v-model="search"
      />
      <b-button
        class="countries-list__button"
        :disabled="!selectedCountries.length"
        type="is-primary"
        @click="buttonClickHandler"
      >
        Create chart
      </b-button>
    </div>
    <div
      v-for="country in filteredCountries"
      :key="country.id"
      class="countries-list__country-wrapper"
    >
      <b-checkbox
        v-model="selectedCountries"
        :native-value="country.id"
        :disabled="selectedCountries.length >= 5 && !selectedCountries.includes(country.id)"
        class="countries-list__country"
      >
        {{ country.name }}
      </b-checkbox>
    </div>
  </div>
</template>

<script>
  const CountriesList = {
    name: 'countries-list',
    props: {
      countriesList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        selectedCountries: [],
        search: ''
      };
    },
    methods: {
      buttonClickHandler() {
        if (this.selectedCountries.length) {
          this.$emit('countriesselect', this.selectedCountries);
        }
      }
    },
    computed: {
      filteredCountries() {
        return this.countriesList.filter(country => {
          return country.name.toLowerCase().match(this.search.toLowerCase());
        });
      }
    }
  };

  export default CountriesList;
</script>

<style lang="scss">
  @import '../utilities/mediaMixin.scss';

  .countries-list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    &__header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    &__headline {
      width: 100%;
    }

    &__search {
      width: 100%;
      margin-bottom: 20px;

      @include mediaMixin {
        width: 25%;
        min-width: 200px;
      }
    }

    &__button {
      width: 100%;

      @include mediaMixin {
        width: auto;
        min-width: 150px;
      }
    }

    &__country-wrapper {
      width: 50%;
      margin: 0;

      @include mediaMixin {
        width: 25%;
      }
    }
  }
</style>

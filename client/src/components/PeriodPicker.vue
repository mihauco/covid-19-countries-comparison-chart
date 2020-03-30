<template>
  <div class="period-picker">
    <b-select
      v-model="startValue"
      class="period-picker__select"
      @input="inputHandler"
      expanded
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.value >= endValue"
      >
        {{option.label}}
      </option>
    </b-select>
    <span class="period-picker__divider"/>
    <b-select
      v-model="endValue"
      class="period-picker__select"
      @input="inputHandler"
      expanded
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.value <= startValue"
      >
        {{option.label}}
      </option>
    </b-select>
  </div>
</template>

<script>
  const PeriodPicker = {
    name: 'period-picker',
    props: {
      options: {
        type: Array,
        default() {return []}
      }
    },
    data() {
      return {
        startValue: null,
        endValue: null
      }
    },
    created() {
      this.setDefaultValues();
    },
    methods: {
      setDefaultValues() {
        console.log(this.options);
        if (this.options.length) {
          this.startValue = this.options[0].value;
          this.endValue = this.options[this.options.length - 1].value;
        }
      },
      inputHandler() {
        this.$emit('change', [this.startValue, this.endValue]);
      }
    },
    watch: {
      options() {
        console.log('change');
        this.setDefaultValues();
      }
    }
  };

  export default PeriodPicker;
</script>

<style lang="scss">
  .period-picker {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__select {
      width: calc(50% - 14px);
    }

    &__divider {
      display: block;
      width: 12px;
      height: 2px;
      background: #000;
      margin: 0 8px;
    }
  }
</style>

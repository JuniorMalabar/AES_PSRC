<template>
  <button
    class="button"
    :disabled="disabled"
    @click="toTop()">
    {{ textOnButton }}
  </button>
</template>

<script>
export default {
  props: {
    textOnButton: {
      type: String,
      default: "Push"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    toTop() {
      this.$emit("select-element")
    }
  }
}
</script>

<style lang="scss">

.button {
  width: fit-content;
  padding: 10px 20px;
  background: rgba(22, 62, 115, 0.5);
  color: white;
  border: 1px solid transparent;

  &:hover {
    cursor: pointer;
    background: rgba(22, 62, 115, 0.8);
  }

  &:active {
    background: rgba(22, 62, 115, 1);
  }

  &[disabled] {
    background: gray;
    cursor:not-allowed
  }

}

</style>
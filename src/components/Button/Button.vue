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
  height: 37px;
  border: 1px solid transparent;
  display: flex;
  justify-content: center;
  font-size: 16px !important;
  align-items: center;

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

  &.error {
    margin-top: 15px;

    &:nth-child(2) {
      margin-left: 10px;
    }
  }
}

</style>
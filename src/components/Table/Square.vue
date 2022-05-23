<template>
  <td class="cell" :class="!border?'no-border':''">
    {{ num }}
  </td>
</template>

<script>


export default {
  props: {
    num: String,
    rowIndex: Number,
    colIndex: Number,
    border: {
      type: Boolean,
      default: true
    }
  },

  data: function () {
    return {
    }
  },

  methods: {
  }
}
</script>


<style lang="scss" scoped>

.cell {
  display: flex;
  justify-content: center;
  align-self: start;
  border: 1px solid;
  padding: 10px;
  width: 20px;
  height: 20px;
  background: white;
  font-size: 16px;

  &:hover {
    cursor: pointer
  }

  &.no-border {
    border: 1px solid transparent;
  }
}

</style>

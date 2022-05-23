<template>
  <td class="cell" :class="subByte?'wow':''"
  >
    {{ num }}
  </td>
</template>

<script>


export default {
  props: {
    num: String,
    rowIndex: Number,
    colIndex: Number,
    subByte:{
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    }
  },

  data: function () {
    return {
    }
  },

}
</script>


<style lang="scss" scoped>

.cell {
  display: flex;
  justify-content: center;
  align-self: start;
  border: 1px solid black;
  padding: 10px;
  width: 20px;
  height: 20px;
  background: white;
  font-size: 16px;
  &:hover {
    cursor: pointer
  }

  &.wow{
    background: rgba(#008000,0.2);
    color: black;
    border-color: #008000;
  }
}

</style>

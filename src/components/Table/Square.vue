<template>
  <div class="cell" :class="outputByte?'wow':''"
  >
    {{ num }}
  </div>
</template>

<script>


export default {
  props: {
    num: String,
    tableId: String,
    rowIndex: Number,
    colIndex: Number,
    outputByte:{
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    }
  },

  watch: {
    outputByte: {
      immediate: true,
      handler(value) {
        if(value) {
          this.$store.dispatch("setTableData", {data: this.num, tableId: this.tableId })
        }
      }
    }
  }

}
</script>


<style lang="scss" scoped>

.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  padding: 10px;
  width: 20px;
  height: 20px;
  background: white;
  font-size: 14px;
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

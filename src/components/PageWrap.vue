<template>
  <div class="main-wrap">

  <Table
    :type="tableTypes[0]"
    :bytes="standartTable"
    :tableId="1"
  />
  <button style="margin-top: 20px" @click="show = !show">
    <img height="100px" src="../assets/double-arrows-down.png" alt="">
  </button>
  
  <div class="info-tables-wrapper">
    <Table
      style="transition: 0.5s"
      :style="show?'opacity:1':'opacity:0'"
      :type="tableTypes[0]"
      :bytes="standartTable"
      :tableId="2"
      :modulo="'x2+1'"
    />

    <Table
      style="transition: 0.5s"
      :style="show?'opacity:1':'opacity:0'"
      :type="tableTypes[0]"
      :bytes="standartTable"
      :tableId="3"
      :modulo="'x2+1'"
    />
  </div>
  

  </div>
</template>

<script>
import Standart from '../helpers/standart'
import Table from './Table/Table.vue';

export default {

  components: {
    Table
  },

  data: function () {
    return {
      standartTable: null,
      tableTypes: ["standart", "information", "control"],
      show: false 
    }
  },

  mounted() {
    this.standartTable = new Standart().STANDART_TABLE();
  }
}
</script>


<style scoped>
  .main-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .info-tables-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-around;
  }
</style>

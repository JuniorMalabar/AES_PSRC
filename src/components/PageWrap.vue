<template>
  <div class="main-wrap">
  <Edit 
    @select-element="selectElement"
    @input-error="inputError"
    :message="'Введите значение входного байта'"
  />
  <p v-if="inputByte && !error">
    Входной байт: {{ convert.toHex(inputByte) }} 
    <br>
    В двоичной форме: {{ binaryInputByte }}
  </p>
  <Table
    :type="tableTypes[0]"
    :bytes="standartTable"
    :tableId="1"
  />
  <button style="margin: 20px" @click="show = !show">
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
import Edit from './Edit/Edit.vue';
import Convert from '../helpers/convert';
import Display from '../helpers/display';

export default {

  components: {
    Table,
    Edit
},

  data: function () {
    return {
      standartTable: null,
      tableTypes: ["standart", "information", "control"],
      show: false,
      inputByte: null,
      convert: null,
      display: null,
      error: false
    }
  },

  mounted() {
    this.standartTable = new Standart().STANDART_TABLE();
    this.convert = new Convert(),
    this.display = new Display()
  },

  methods: {
    selectElement(input) {
      this.inputByte =  Number(this.display.addHexPrefix(input))
    },
    inputError(inputError){
      this.error = inputError
    }
  },

  computed: {
    binaryInputByte() {
      return this.convert.toBin(this.inputByte);
    }
  }
}
</script>


<style lang="scss" scoped>
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

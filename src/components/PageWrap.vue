<template>
  <div class="main-wrap">
    <Edit 
      @select-element="selectElement"
      @input-error="inputError"
      :message="'Введите значение входного байта'"
      :errorOnTop="error"
    />
  
    <div class="initial-data" v-if="inputByte && !error">
      <div @click="reset" class="reset">×</div>
      <p>
        Входной байт: {{ convert.toHex(inputByte) }}
      </p>
      <p>
        В двоичной форме: {{ binaryInputByte }}
      </p>
      <p>
        В полиномиальной форме: <span ref="input-polynom"/> 
      </p>
      <p>
        Левая часть входного байта 
        ({{ display.addHexPrefix(leftPartOfInputByte) }}) 
        определяет номер строки
      </p>
      <p>
        Правая часть входного байта 
        ({{ display.addHexPrefix(rightPartOfInputByte) }})
        определяет номер столбца
      </p>
    </div>
    <Table
      v-if="inputByte"
      :type="tableTypes[0]"
      :bytes="standartTable"
      :tableId="'S'"
      :selectedElementRowIndex="convert.fromHexToDec(leftPartOfInputByte)"
      :selectedElementColIndex="convert.fromHexToDec(rightPartOfInputByte)"
    />
    <!-- <button style="margin: 20px" @click="show = !show">
      <img height="100px" src="../assets/double-arrows-down.png" alt="">
    </button> -->
    
    <div class="info-tables-wrapper" style="display: none">
      <Table
        
        :type="tableTypes[1]"
        :bytes="standartTable"
        :tableId="'S1'"
        :modulo="'x4+x+1'"
      />

      <Table
        :type="tableTypes[1]"
        :bytes="standartTable"
        :tableId="'S2'"
        :modulo="'x4+x3+1'"
      />
    </div>
    
    <div class="control-tables-wrapper" style="display: none">
      <Table
        :type="tableTypes[2]"
        :bytes="standartTable"
        :tableId="'S1*'"
      />

      <Table
        :type="tableTypes[2]"
        :bytes="standartTable"
        :tableId="'S2*'"
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
import Calculation from '../helpers/calculation';

export default {

  components: {
    Table,
    Edit
},

  data: function () {
    return {
      standartTable: null,
      tableTypes: ["standart", "information", "control"],
      inputByte: null,
      convert: null,
      display: null,
      calculation: null,
      error: false
    }
  },

  mounted() {
    
    this.standartTable = new Standart().STANDART_TABLE();
    this.convert = new Convert(),
    this.display = new Display(),
    this.calculation = new Calculation()
    
  },

  methods: {
    selectElement(input) {
      let check = Number(this.display.addHexPrefix(input))
      if (isNaN(check)) {
        this.error = true
      } else if (check == 0){
        this.inputByte = "0"  
      } else {
        this.inputByte =  check;
      }
      
      if (this.inputByte) {
        this.$nextTick(()=> {
          this.$refs["input-polynom"].innerHTML = this.polynomInputByte;
        })
      } 
    },
    reset() {
      this.inputByte = null
    },
    inputError(inputError){
      this.error = inputError
    }
  },

  computed: {
    binaryInputByte() {
      return this.convert.toBin(this.inputByte);
    },

    polynomInputByte() {
      return this.display.indexesToTop(this.convert.binaryToPolynom(this.binaryInputByte));
    },

    leftPartOfInputByte() {
      return this.convert.toHex(this.inputByte).slice(0,1);
    },
    
    rightPartOfInputByte() {
      return this.convert.toHex(this.inputByte).slice(1,2);
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
    background: gainsboro;
    min-height: 98vh;

    & * {
      font-size: 18px;
    }
  }
  .reset {
    text-align: end;
    font-size: 24px;
    font-weight: bold;
    position: absolute;
    right: 15px;
    top: 8px;

    &:hover {
      cursor: pointer;
    }
  }

  .info-tables-wrapper,
  .control-tables-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-around;
    margin-top: 20px;
  }

  .initial-data {
      border: 1px solid;
      margin-bottom: 20px;
      padding: 15px;
      position: relative;
    p {
      text-align: center;
      margin: 5px 0;
    }
  }
</style>

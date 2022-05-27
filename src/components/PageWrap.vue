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
        <label for="checkbox"><b>Замена по стандарту AES</b></label>
        <input type="checkbox" id="checkbox" v-model="AESreplace">
      </p>
      <div v-if="AESreplace">
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
        <p>
          Выходной байт: <b>{{tableValue('S')}}</b>
        </p>
      </div>
      <p>
        <label for="checkbox"><b>Замена с помощью ПСКВ</b></label>
        <input @change="showPolynom" type="checkbox" id="checkbox" v-model="PSRCreplace">
      </p>
      <div v-if="PSRCreplace">
        <p>
          В полиномиальной форме: <span ref="input-polynom"/> 
        </p>
        <p>
          Получим представление входного байта в ПСКВ, поочерёдно разделив его на основания ПСКВ
        </p>
        <p>
          Остаток от деления на <span ref="first-polynom"/> : <span ref="first-remainder"/>
        </p>
        <p>
          Остаток от деления на <span ref="second-polynom"/> : <span ref="second-remainder"/>
        </p>
        <p>
          Представление входного байта в ПСКВ: ( <span ref="PSRC-first-remainder"/>, <span ref="PSRC-second-remainder"/> )
        </p>
        <p>
          Выходной байт первой информационной таблицы: <b>{{tableValue('S1')}}</b>
        </p>
        <p>
          Выходной байт второй информационной таблицы: <b>{{tableValue('S2')}}</b>
        </p>
        <p>
          Выходной байт первой контрольной таблицы: <b>{{tableValue('S1*')}}</b>
        </p>
        <p>
          Выходной байт второй контрольной таблицы: <b>{{tableValue('S2*')}}</b>
        </p>
      </div>
    </div>
    <Table
      v-if="inputByte && AESreplace"
      :type="tableTypes[0]"
      :bytes="standartTable"
      :tableId="'S'"
      :selectedElementRowIndex="convert.fromHexToDec(leftPartOfInputByte)"
      :selectedElementColIndex="convert.fromHexToDec(rightPartOfInputByte)"
    />
    
    <div v-if="inputByte && PSRCreplace" class="tables-wrapper">
      <div class="info-tables-wrapper">
        <Table
          :type="tableTypes[1]"
          :bytes="standartTable"
          :tableId="'S1'"
          :selectedElementRowIndex="convert.fromBinToDec(convert.polynomToBinary(firstRemainder))"
          :selectedElementColIndex="convert.fromBinToDec(convert.polynomToBinary(secondRemainder))"
          :modulo="firstFourthDegreePolynomial"
        />

        <Table
          :type="tableTypes[1]"
          :bytes="standartTable"
          :tableId="'S2'"
          :selectedElementRowIndex="convert.fromBinToDec(convert.polynomToBinary(firstRemainder))"
          :selectedElementColIndex="convert.fromBinToDec(convert.polynomToBinary(secondRemainder))"
          :modulo="secondFourthDegreePolynomial"
        />
      </div>
      
      <div class="control-tables-wrapper">
        <Table
          :type="tableTypes[2]"
          :bytes="standartTable"
          :tableId="'S1*'"
          :selectedElementRowIndex="convert.fromBinToDec(convert.polynomToBinary(firstRemainder))"
          :selectedElementColIndex="convert.fromBinToDec(convert.polynomToBinary(secondRemainder))"
        />

        <Table
          :type="tableTypes[2]"
          :bytes="standartTable"
          :tableId="'S2*'"
          :selectedElementRowIndex="convert.fromBinToDec(convert.polynomToBinary(firstRemainder))"
          :selectedElementColIndex="convert.fromBinToDec(convert.polynomToBinary(secondRemainder))"
        />
      </div>
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
      error: false,
      AESreplace: false,
      PSRCreplace: false,
      firstFourthDegreePolynomial: "x4+x+1",
      secondFourthDegreePolynomial: "x4+x3+1",
      thirdFourthDegreePolynomial: "x4+x3+x2+x+1"
    }
  },

  mounted() {
    this.standartTable = new Standart().STANDART_TABLE();
    this.convert = new Convert(),
    this.display = new Display(),
    this.calculation = new Calculation()
  },

  methods: {
    showPolynom() {
      if (this.inputByte && this.PSRCreplace) {
        this.$nextTick(()=> {
          this.$refs["input-polynom"].innerHTML = this.polynomInputByte;
          this.$refs["first-polynom"].innerHTML = this.display.indexesToTop(this.firstFourthDegreePolynomial);  
          this.$refs["first-remainder"].innerHTML = this.display.indexesToTop(this.firstRemainder);  
          this.$refs["PSRC-first-remainder"].innerHTML = this.display.indexesToTop(this.firstRemainder);  
          this.$refs["second-polynom"].innerHTML = this.display.indexesToTop(this.secondFourthDegreePolynomial);  
          this.$refs["second-remainder"].innerHTML = this.display.indexesToTop(this.secondRemainder);  
          this.$refs["PSRC-second-remainder"].innerHTML = this.display.indexesToTop(this.secondRemainder);  
        })
      } 
    },

    tableValue(tableId) {
      return this.$store.getters.tableDataById(tableId);
    },

    selectElement(input) {
      let check = Number(this.display.addHexPrefix(input))
      if (isNaN(check)) {
        this.error = true;
        this.inputByte = null;
      } else if (check == 0){
        this.inputByte = "0"  
      } else {
        this.inputByte =  check;
      }
      if (this.PSRCreplace || this.AESreplace) {
        this.showPolynom();
      }

    },

    reset() {
      this.inputByte = null;
      this.AESreplace = false;
      this.PSRCreplace = false;
      this.$store.dispatch("resetTableData")
    },

    inputError(inputError){
      this.error = inputError;
      this.inputByte = null;
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
    },

    firstRemainder() {
      let res = this.calculation.remainderAfterDividingAPolynomialByAPolynomial(this.convert.binaryToPolynom(this.binaryInputByte), this.firstFourthDegreePolynomial)
      return this.convert.binaryToPolynom(this.convert.toBin(res))
    },

    secondRemainder() {
      let res = this.calculation.remainderAfterDividingAPolynomialByAPolynomial(this.convert.binaryToPolynom(this.binaryInputByte), this.secondFourthDegreePolynomial) 
      console.log("🚀 ~ file: PageWrap.vue ~ line 231 ~ secondRemainder ~ res", res)
      console.log()
      return this.convert.binaryToPolynom(this.convert.toBin(res))
    }
  }
}
</script>


<style lang="scss" scoped>
  .main-wrap {
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    background: gainsboro;
    min-height: 100vh;

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
  .tables-wrapper {
    width: 100%;
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

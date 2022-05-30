<template>
  <div class="main-wrap">
    <Edit 
      @select-element="selectElement"
      @input-error="inputError"
      :message="'Введите значение входного байта в шестнадцатеричной системе счисления'"
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
          :bytes="firstInfoTableData"
          :tableId="'S1'"
          :selectedElementRowIndex="convert.fromBinToDec(convert.polynomToBinary(firstRemainder))"
          :selectedElementColIndex="convert.fromBinToDec(convert.polynomToBinary(secondRemainder))"
          :modulo="firstFourthDegreePolynomial"
        />

        <Table
          :type="tableTypes[1]"
          :bytes="secondInfoTableData"
          :tableId="'S2'"
          :selectedElementRowIndex="convert.fromBinToDec(convert.polynomToBinary(firstRemainder))"
          :selectedElementColIndex="convert.fromBinToDec(convert.polynomToBinary(secondRemainder))"
          :modulo="secondFourthDegreePolynomial"
        />
      </div>
      
      <div class="control-tables-wrapper">
        <Table
          :type="tableTypes[2]"
          :bytes="firstControlTableData"
          :tableId="'S1*'"
          :selectedElementRowIndex="convert.fromBinToDec(convert.polynomToBinary(firstRemainder))"
          :selectedElementColIndex="convert.fromBinToDec(convert.polynomToBinary(secondRemainder))"
        />

        <Table
          :type="tableTypes[2]"
          :bytes="secondControlTableData"
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
import _ from 'lodash'

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
      thirdFourthDegreePolynomial: "x4+x3+x2+x+1",
    }
  },

  mounted() {
    this.standartTable = new Standart().STANDART_TABLE();
    this.convert = new Convert(),
    this.display = new Display(),
    this.calculation = new Calculation()
    this.test(this.standartTable)   
  },

  methods: {
    test(collection) {
      let zeros = new Standart().ZEROS_TABLE();
      console.log(collection)
      for (let row = 0; row < collection.length; row++) {
        for (let col = 0; col < collection.length; col++) {
          let rowInd = this.convert.toHexWithoutZeros(row)
          let colInd = this.convert.toHexWithoutZeros(col)
          let oldByte = collection[row][col]
          let rowCol = rowInd + colInd
          
          let newRow = this.convert.fromBinToDec(
            this.calculation.binaryByDegrees(
              this.calculation.remainderAfterDividingAPolynomialByAPolynomial(
                this.convert.binaryToPolynom(
                  this.convert.toBin(
                    this.convert.fromHexToDec(rowCol)
                  )
                ), this.firstFourthDegreePolynomial
              )
            )
          )
          let newCol = this.convert.fromBinToDec(
            this.calculation.binaryByDegrees(
              this.calculation.remainderAfterDividingAPolynomialByAPolynomial(
                this.convert.binaryToPolynom(
                  this.convert.toBin(
                    this.convert.fromHexToDec(rowCol)
                  )
                ), this.secondFourthDegreePolynomial
              )
            )
          )
          if(newRow == 10 && newCol == 1 && zeros[newRow][newCol] != '0x00') {
            zeros[newRow][newCol-1] = oldByte
          } else if (newRow == 1 && newCol == 10  && zeros[newRow][newCol] != '0x00') {
            zeros[newRow-1][newCol] = oldByte
          } else {
            zeros[newRow][newCol] = oldByte
          }
          
        }
        
      }
      console.log(zeros)
    },
    newTableData(collection, tableId) {
      if (tableId == "S1") {
          return _.map(collection, 
            (line) => { 
              return _.map(line, 
                (el) => {
                  return this.convert.fromBinToDec(this.calculation.binaryByDegrees(this.calculation.remainderAfterDividingAPolynomialByAPolynomial(this.convert.binaryToPolynom(this.convert.toBin(el)), this.firstFourthDegreePolynomial)))
                }
              )
            }
          )
      } else if (tableId == "S2") {
          return _.map(collection, 
            (line) => { 
              return _.map(line, 
                (el) => {
                  return this.convert.fromBinToDec(this.calculation.binaryByDegrees(this.calculation.remainderAfterDividingAPolynomialByAPolynomial(this.convert.binaryToPolynom(this.convert.toBin(el)), this.secondFourthDegreePolynomial)))
                }
              )
            }
          )
      } else if (tableId == "S1*") {
          let newCollection = []
          for (let i = 0; i < collection[0].length; i++) {
            let line = []
            for (let j = 0; j < collection[1].length; j++) {
              let fromFirst = this.calculation.getPolynomialDegrees(
                this.convert.binaryToPolynom(
                  this.convert.toBin(
                    collection[0][i][j]
                  )
                )
              )
              let fromSecond = this.calculation.getPolynomialDegrees(
                this.convert.binaryToPolynom(
                  this.convert.toBin(
                    collection[1][i][j]
                  )
                )
              )
              line.push(
                this.convert.toHex(
                  this.convert.fromBinToDec(
                    this.calculation.binaryByDegrees(
                      this.calculation.moduloAddition(fromFirst, fromSecond)
                    )
                  )
                ) 
              )
            }
            newCollection.push(line)
          }
          return newCollection
      } else if (tableId == "S2*") {
          let newCollection = []
          for (let i = 0; i < collection[0].length; i++) {
            let line = []
            for (let j = 0; j < collection[1].length; j++) {
              let fromFirst = this.calculation.getPolynomialDegrees(
                this.convert.binaryToPolynom(
                  this.convert.toBin(
                    collection[0][i][j]
                  )
                )
              )
              let fromSecond = this.calculation.getPolynomialDegrees(
                this.calculation.multiplicationOnX(
                  this.convert.binaryToPolynom(
                    this.convert.toBin(
                      collection[1][i][j]
                    )
                  )
                )
              )
              line.push(
                this.convert.toHex(
                  this.convert.fromBinToDec(
                    this.calculation.binaryByDegrees(
                      this.calculation.remainderAfterDividingAPolynomialByAPolynomial(  
                        this.convert.binaryToPolynom(
                          this.calculation.binaryByDegrees(
                            this.calculation.moduloAddition(fromFirst, fromSecond)
                          )
                        ),
                        "x4+x3+x2+x+1"
                      )
                    )
                  )
                )
              )  
            }
            newCollection.push(line)
          }
          return newCollection
      } else return collection
    },
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
    firstInfoTableData() {
      return this.newTableData(this.standartTable, 'S1')
    },

    secondInfoTableData() {
      return this.newTableData(this.standartTable, 'S2')
    },

    firstControlTableData() {
      return this.newTableData([this.firstInfoTableData, this.secondInfoTableData], 'S1*')
    },

    secondControlTableData() {
      return this.newTableData([this.firstInfoTableData, this.secondInfoTableData], 'S2*')
    },

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
      return this.convert.binaryToPolynom(this.calculation.binaryByDegrees(res))
    },

    secondRemainder() {
      let res = this.calculation.remainderAfterDividingAPolynomialByAPolynomial(this.convert.binaryToPolynom(this.binaryInputByte), this.secondFourthDegreePolynomial) 
      return this.convert.binaryToPolynom(this.calculation.binaryByDegrees(res))
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
    background: #E7EBF1;
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

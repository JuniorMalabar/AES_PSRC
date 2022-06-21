<template>
  <div class="main-wrap">
    <Edit 
      v-if="!inputByte"
      @select-element="selectElement"
      @input-error="inputError"
      :message="'Введите значение входного байта в шестнадцатеричной системе счисления'"
      :errorOnTop="error"
    />
    <div class="initial-data" v-if="inputByte && !error">
      <div @click="reset" class="reset">×</div>
      <p>
        Входной байт: {{ hexInputByte }}
      </p>
      <p>
        В двоичной форме: {{ binaryInputByte }}
      </p>
      <p>
        <enhanced-check :label="'Замена по стандарту AES'"
                v-model="AESreplace"
                id="aes-checkbox"/>
      </p>
      <div v-if="AESreplace">
        <p>
          Левая часть входного байта 
          ({{ leftPartOfInputByte }}) 
          определяет номер строки
        </p>
        <p>
          Правая часть входного байта 
          ({{ rightPartOfInputByte }})
          определяет номер столбца
        </p>
        <p>
          Выходной байт: <b>{{tableValue('S')}}</b>
        </p>
      </div>
      <p>
        <enhanced-check :label="'Замена с помощью ПСКВ'"
                v-model="PSRCreplace" 
                id="psrc-checkbox"/>
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
      <p v-if="PSRCreplace">
        <enhanced-check :label="'Коррекция ошибки'"
                v-model="addError" 
                id="error-checkbox"/>
      </p>
      <div v-if="addError && PSRCreplace" class="choose-error-place">
        <p>
          Выберите основание и разряд, подвергнувшиеся искажению:
        </p>
        <div class="choose-wrapper">
          <div class="choose-base">
            <p>
              Выбор основания
            </p>
            <enhanced-check-radio 
                      :label="['Первое основание', 'Второе основание', 'Третье основание', 'Четвёртое основание']"
                      v-model="erroneousBasis"
                      :rounded="true" id="enhancedCheckRadio" 
                      :value="['S1', 'S2', 'S1*', 'S2*']"/>
          </div>
          <div v-if="erroneousBasis" class="choose-bit">
            <p>
              Выбор разряда
            </p>
            <enhanced-check-radio 
                      :label="['Первый разряд', 'Второй разряд', 'Третий разряд', 'Четвёртый разряд']"
                      v-model="erroneousBit"
                      :rounded="true" id="enhancedCheckRadio1" 
                      :value="['0', '1', '2', '3']"/>
          </div>
        </div>
        <span class="choose-res" v-if="erroneousBasis&&erroneousBit">Ошибка в {{ erroneousBasisShow }} основании, {{ erroneousBitShow }} разряде  </span>
        <div class="error-buttons-wrapper">
          <button  v-if="erroneousBasis&&erroneousBit" class="button error" @click="openErrorInfoTable">Внести ошибку</button>
          <button  v-if="erroneousBasis&&erroneousBit" class="button error" @click="removeErrorToBases">Убрать ошибку</button>
        </div>
        

        <div v-if="erroneousBasis&&erroneousBit&&openErrorInfo">
          <p>В результате воздействия ошибки получены следующие значения:</p>
          <p>
            <span v-if="erroneousBasis=='S1'">Искаженный в</span><span v-else>В</span>ыходной байт первой информационной таблицы: <b>{{tableValueWithError('S1')}}</b>
          </p>
          <p>
            <span v-if="erroneousBasis=='S2'">Искаженный в</span><span v-else>В</span>ыходной байт второй информационной таблицы: <b>{{tableValueWithError('S2')}}</b>
          </p>
          <p>
            <span v-if="erroneousBasis=='S1*'">Искаженный в</span><span v-else>В</span>ыходной байт первой контрольной таблицы: <b>{{tableValueWithError('S1*')}}</b>
          </p>
          <p>
            <span v-if="erroneousBasis=='S2*'">Искаженный в</span><span v-else>В</span>ыходной байт второй контрольной таблицы: <b>{{tableValueWithError('S2*')}}</b>
          </p>
          <p>
            Вычислим синдром ошибки Δ, сложив соответствующие значения контрольных байтов:
          </p>
          <p>
            Δ<sub>1</sub> = {{ this.$store.getters.tableDataById("S1*") }} + {{ this.$store.getters.tableDataWithErrorById("S1*") }} = <span ref="first-syndrome"/>
          </p>
          <p>
            Δ<sub>2</sub> = {{ this.$store.getters.tableDataById("S2*") }} + {{ this.$store.getters.tableDataWithErrorById("S2*") }} = <span ref="second-syndrome"/>
          </p>
          <p class="syndrome-conclusion" v-if="firstErrorSyndrome && secondErrorSyndrome">
            Полученный результат свидетельствует о том, что избыточный код ПСКВ содержит ошибку.
            <br>
            В результате соотношения рассчитанного синдрома ошибки <span ref="result-syndrome"/> с таблицей синдромов ошибок можно точно определить, что ошибка произошла в {{ erroneousBitShow }} разряде {{ erroneousBasisShow }} основания.    
            <br>
            Так же данная таблица хранит соответствующий вектор ошибки - {{ errorVector }}
            <br>
            Для коррекции ошибки сложим вектор ошибки с искаженным байтом ({{ this.$store.getters.tableDataWithErrorById(erroneousBasis) }} , {{ showErroniusByteAsBin(erroneousBasis, true) }})
            <br>
            {{ showErroniusByteAsBin(erroneousBasis) }} + {{ errorVector }} = {{ showRecoveredByteAsBin() }} =  {{ showRecoveredByteAsByte() }}
            <br>
            Ошибка исправлена!
          </p>
          <p v-if="firstErrorSyndrome && secondErrorSyndrome">
            
          </p>
        </div>
        
      </div>
    </div>
    <Table
      v-if="inputByte && AESreplace"
      :type="tableTypes[0]"
      :bytes="standartTable"
      :tableId="'S'"
      :selectedElementRowIndex="decLeftPartOfInputByte"
      :selectedElementColIndex="decRightPartOfInputByte"
    />

    
    
    <div v-if="inputByte && PSRCreplace" class="tables-wrapper">
      <div class="info-tables-wrapper">
        <vsa-list>
          <vsa-item>
            <vsa-heading>
              Первая информационная таблица
            </vsa-heading>

            <vsa-content>
              <Table
                :type="tableTypes[1]"
                :bytes="firstInfoTableData"
                :tableId="'S1'"
                :selectedElementRowIndex="newRow"
                :selectedElementColIndex="newCol"
                :modulo="firstFourthDegreePolynomial"
              />
            </vsa-content>
          </vsa-item>
          <vsa-item>
            <vsa-heading>
              Вторая информационная таблица
            </vsa-heading>

            <vsa-content>
              <Table
                :type="tableTypes[1]"
                :bytes="secondInfoTableData"
                :tableId="'S2'"
                :selectedElementRowIndex="newRow"
                :selectedElementColIndex="newCol"
                :modulo="secondFourthDegreePolynomial"
              />
            </vsa-content>
          </vsa-item>
          <vsa-item>
            <vsa-heading>
              Первая контрольная таблица
            </vsa-heading>

            <vsa-content>
              <Table
                :type="tableTypes[2]"
                :bytes="firstControlTableData"
                :tableId="'S1*'"
                :selectedElementRowIndex="newRow"
                :selectedElementColIndex="newCol"
              />
            </vsa-content>
          </vsa-item>
          <vsa-item>
            <vsa-heading>
              Вторая контрольная таблица
            </vsa-heading>

            <vsa-content>
              <Table
                :type="tableTypes[2]"
                :bytes="secondControlTableData"
                :tableId="'S2*'"
                :selectedElementRowIndex="newRow"
                :selectedElementColIndex="newCol"
              />
            </vsa-content>
          </vsa-item>
        </vsa-list>
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
import { VsaList, VsaItem, VsaHeading, VsaContent } from 'vue-simple-accordion';
import 'vue-simple-accordion/dist/vue-simple-accordion.css';
import { EnhancedCheck, EnhancedCheckRadio } from 'vue-enhanced-check'

export default {

  components: {
    Table,
    Edit,
    VsaList,
    VsaItem,
    VsaHeading,
    VsaContent,
    EnhancedCheck,
    EnhancedCheckRadio
  },

  data: function () {
    return {
      standartTable: null,
      tableTypes: ["standart", "information", "control"],
      inputByte: null,
      hexInputByte: null,
      leftPartOfInputByte: null,
      rightPartOfInputByte: null,
      newRow: null,
      newCol: null,
      error: false,
      AESreplace: false,
      PSRCreplace: false,
      addError: false,
      erroneousBasis: '',
      erroneousBit: '',
      firstFourthDegreePolynomial: "x4+x+1",
      secondFourthDegreePolynomial: "x4+x3+1",
      thirdFourthDegreePolynomial: "x4+x3+x2+x+1",
      openErrorInfo: false,
      firstErrorSyndrome: null,
      secondErrorSyndrome: null,
      errorSyndrome: [],
      errorVector: null
    }
  },

  mounted() {
    this.standartTable = Standart.STANDART_TABLE();

  },

  watch: {
    addError: {
      handler(newVal) {
        this.erroneousBasis = ''
        this.erroneousBit = ''
        this.openErrorInfo = false
        this.errorSyndrome = []
        this.firstErrorSyndrome = null
        this.secondErrorSyndrome = null
        return newVal
      },
      immediate: true
    },
    PSRCreplace: {
      handler(newVal) {
        this.showPolynom()
        return newVal
      },
      immediate: true
    },
    erroneousBasis: {
      handler() {
        if(this.erroneousBasis && this.erroneousBit && this.openErrorInfo) {
          this.addErrorToBases()
        }
      },
      immediate: false
    },
    erroneousBit: {
      handler() {
        if(this.erroneousBasis && this.erroneousBit && this.openErrorInfo) {
          this.addErrorToBases()
        }
      },
      immediate: false
    }
  },

  methods: {
    generateInfoTable(collection, tablePolynom) {
      let newCollection = Standart.ZEROS_TABLE();
      for (let row = 0; row < collection.length; row++) {
        for (let col = 0; col < collection.length; col++) {
          let rowInd = Convert.toHexWithoutZeros(row)
          let colInd = Convert.toHexWithoutZeros(col)
          let oldByteByTableModulo = Calculation.getNewByteByTablePolynom(collection[row][col], tablePolynom)
          
          let rowCol = rowInd + colInd
          
          let newRow = Calculation.getNewRowColFromStandartRow(rowCol, this.firstFourthDegreePolynomial)
          let newCol = Calculation.getNewRowColFromStandartRow(rowCol, this.secondFourthDegreePolynomial)
          
          if(newRow == 10 && newCol == 1 && newCollection[newRow][newCol] != '0x00') {
            newCollection[newRow][newCol-1] = oldByteByTableModulo
          } else if (newRow == 1 && newCol == 10  && newCollection[newRow][newCol] != '0x00') {
            newCollection[newRow-1][newCol] = oldByteByTableModulo
          } else {
            newCollection[newRow][newCol] = oldByteByTableModulo
          }
          
        }
        
      }
      return newCollection
    },

    addErrorToBases() {
      this.$store.dispatch("resetTableDataWithError")
      
      let correctByte =
        Convert.toBin(
          Convert.fromHexToDec(
            this.tableValue(this.erroneousBasis)
          )
        ) 
      let errorByte =
      Display.addHexPrefix(
        Convert.toHex(
          Convert.fromBinToDec(
            Calculation.addError(correctByte, this.erroneousBit) 
          )
        )
      )
      this.$store.dispatch("setTableDataWithError", {data: errorByte, tableId: this.erroneousBasis })
      if(this.erroneousBasis == "S1") {
        this.$store.dispatch("setTableDataWithError", 
        {
          data: Display.addHexPrefix(Calculation.getFirstControlByte(Convert.fromHexToDec(errorByte), Convert.fromHexToDec(this.$store.getters.tableDataById("S2")))), 
          tableId: "S1*"
        })
        this.$store.dispatch("setTableDataWithError", 
        {
          data: Display.addHexPrefix(Calculation.getSecondControlByte(Convert.fromHexToDec(errorByte), Convert.fromHexToDec(this.$store.getters.tableDataById("S2")), this.thirdFourthDegreePolynomial)), 
          tableId: "S2*" 
        })
      } else if (this.erroneousBasis == "S2") {
        this.$store.dispatch("setTableDataWithError", 
        {
          data: Display.addHexPrefix(Calculation.getFirstControlByte(Convert.fromHexToDec(this.$store.getters.tableDataById("S1")), Convert.fromHexToDec(errorByte))), 
          tableId: "S1*"
        })
        this.$store.dispatch("setTableDataWithError", 
        {
          data: Display.addHexPrefix(Calculation.getSecondControlByte(Convert.fromHexToDec(this.$store.getters.tableDataById("S1")), Convert.fromHexToDec(errorByte), this.thirdFourthDegreePolynomial)), 
          tableId: "S2*" 
        })
      }

      this.getErrorSyndrome()
      this.getErrorVector(this.erroneousBit)      
    },

    showErroniusByteAsBin(errBasis, pref=false) {
      if(pref){
        return Display.addBinPrefix(Convert.toBinWithoutZeros(Convert.fromHexToDec(this.$store.getters.tableDataWithErrorById(errBasis))))
      }
      return Convert.toBinWithoutZeros(Convert.fromHexToDec(this.$store.getters.tableDataWithErrorById(errBasis)))
    },

    showRecoveredByteAsByte() {
      return Display.addHexPrefix(Convert.toHex(Convert.fromBinToDec(Calculation.combinationRecovery(Convert.toBin(Convert.fromHexToDec(this.$store.getters.tableDataWithErrorById(this.erroneousBasis))),this.errorVector))))
    },

    showRecoveredByteAsBin() {
      return Display.addBinPrefix(Calculation.combinationRecovery(Convert.toBinWithoutZeros(Convert.fromHexToDec(this.$store.getters.tableDataWithErrorById(this.erroneousBasis))),this.errorVector))
    },

    openErrorInfoTable() {
      this.openErrorInfo = true
      this.addErrorToBases()
    },

    getErrorSyndrome() {
      this.firstErrorSyndrome = Calculation.errorSyndrome(
        this.$store.getters.tableDataById("S1*"),
        this.$store.getters.tableDataWithErrorById("S1*")
      )

      this.secondErrorSyndrome = Calculation.errorSyndrome(
        this.$store.getters.tableDataById("S2*"),
        this.$store.getters.tableDataWithErrorById("S2*")
      )

      this.errorSyndrome = [this.firstErrorSyndrome, this.secondErrorSyndrome]

      this.$nextTick(()=> {
        this.$nextTick(()=> {
          this.$refs["first-syndrome"].innerHTML = Display.indexesToTop(this.firstErrorSyndrome);  
          this.$refs["second-syndrome"].innerHTML = Display.indexesToTop(this.secondErrorSyndrome); 
          this.$refs["result-syndrome"].innerHTML = "(" + Display.indexesToTop(this.firstErrorSyndrome) + ", " + Display.indexesToTop(this.secondErrorSyndrome) + ")";  
        })
      })
    },

    removeErrorToBases() {
      this.erroneousBasis = '';
      this.erroneousBit = '';
      this.errorSyndrome = []
      this.firstErrorSyndrome = null
      this.secondErrorSyndrome = null
      this.openErrorInfo = false;
      this.$store.dispatch("resetTableDataWithError")
    },

    newTableData(collection, tableId) {
      if (tableId == "S1") {
          return this.generateInfoTable(this.standartTable, this.firstFourthDegreePolynomial)
      } else if (tableId == "S2") {
          return this.generateInfoTable(this.standartTable, this.secondFourthDegreePolynomial)
      } else if (tableId == "S1*") {
          let newCollection = []
          for (let i = 0; i < collection[0].length; i++) {
            let line = []
            for (let j = 0; j < collection[1].length; j++) {
              line.push( Calculation.getFirstControlByte(collection[0][i][j],collection[1][i][j]))
            }
            newCollection.push(line)
          }
          return newCollection
      } else if (tableId == "S2*") {
          let newCollection = []
          for (let i = 0; i < collection[0].length; i++) {
            let line = []
            for (let j = 0; j < collection[1].length; j++) {
              line.push(Calculation.getSecondControlByte(collection[0][i][j],collection[1][i][j], this.thirdFourthDegreePolynomial))
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
          this.$refs["first-polynom"].innerHTML = Display.indexesToTop(this.firstFourthDegreePolynomial);  
          this.$refs["first-remainder"].innerHTML = Display.indexesToTop(this.firstRemainder);  
          this.$refs["PSRC-first-remainder"].innerHTML = Display.indexesToTop(this.firstRemainder);  
          this.$refs["second-polynom"].innerHTML = Display.indexesToTop(this.secondFourthDegreePolynomial);  
          this.$refs["second-remainder"].innerHTML = Display.indexesToTop(this.secondRemainder);  
          this.$refs["PSRC-second-remainder"].innerHTML = Display.indexesToTop(this.secondRemainder);  
        })
      } 
    },
    setParams(inputByte) {

      this.leftPartOfInputByte = Convert.toHex(inputByte).slice(0,1);
      this.rightPartOfInputByte = Convert.toHex(inputByte).slice(1,2);      

      let rowCol = this.leftPartOfInputByte+this.rightPartOfInputByte
      this.newRow = Calculation.getNewRowColFromStandartRow(rowCol, this.firstFourthDegreePolynomial)
      this.newCol = Calculation.getNewRowColFromStandartRow(rowCol, this.secondFourthDegreePolynomial)
      this.$forceUpdate()
    },

    tableValue(tableId) {
      return this.$store.getters.tableDataById(tableId);
    },

    tableValueWithError(tableId) {
      return this.$store.getters.tableDataWithErrorById(tableId);
    },

    selectElement(input) {
      let check = Number(Display.addHexPrefix(input))
      if (isNaN(check)) {
        this.error = true;
        this.inputByte = null;
        this.hexInputByte = null
      } else if (check == 0){
        this.inputByte = "0"
        this.hexInputByte = "0x00"
        this.setParams(this.inputByte) 
      } else {
        this.inputByte =  check;
        this.hexInputByte = Display.addHexPrefix(Convert.toHex(this.inputByte))
        this.setParams(this.inputByte)
      }
      if (this.PSRCreplace || this.AESreplace) {
        this.showPolynom();
      }

    },

    reset() {
      this.inputByte = null;
      this.AESreplace = false;
      this.PSRCreplace = false;
      this.addError = false;
      this.erroneousBasis = '';
      this.erroneousBit = '';
      this.$store.dispatch("resetTableData")
      this.$store.dispatch("resetTableDataWithError")
    },

    inputError(inputError){
      this.error = inputError;
      this.inputByte = null;
    },

    getErrorVector(errBit) {
      this.errorVector =  Calculation.errorVector(errBit)
    },
  },

  computed: {
    

    erroneousBasisShow() {
      if(this.erroneousBasis == "S1") {
        return 1
      } else if(this.erroneousBasis == "S2") {
        return 2
      } else if(this.erroneousBasis == "S1*") {
        return 3
      } else {
        return 4
      }
    },

    erroneousBitShow() {
      if(this.erroneousBit == "0") {
        return 1
      } else if(this.erroneousBit == "1") {
        return 2
      } else if(this.erroneousBit == "2") {
        return 3
      } else {
        return 4
      }
    },

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
      return Convert.toBin(this.inputByte);
    },

    polynomInputByte() {
      return Display.indexesToTop(Convert.binaryToPolynom(this.binaryInputByte));
    },

    decLeftPartOfInputByte() {
      return Convert.fromHexToDec(this.leftPartOfInputByte)
    },

    decRightPartOfInputByte() {
      return Convert.fromHexToDec(this.rightPartOfInputByte)
    },

    firstRemainder() {
      let res = Calculation.remainderAfterDividingAPolynomialByAPolynomial(Convert.binaryToPolynom(this.binaryInputByte), this.firstFourthDegreePolynomial)
      return Convert.binaryToPolynom(Calculation.binaryByDegrees(res))
    },

    firstRemainderToTable() {
      return Convert.fromBinToDec(Convert.polynomToBinary(this.firstRemainder))
    },

    secondRemainder() {
      let res = Calculation.remainderAfterDividingAPolynomialByAPolynomial(Convert.binaryToPolynom(this.binaryInputByte), this.secondFourthDegreePolynomial) 
      return Convert.binaryToPolynom(Calculation.binaryByDegrees(res))
    },

    secondRemainderToTable() {
      return Convert.fromBinToDec(Convert.polynomToBinary(this.secondRemainder))
    }
  }
}
</script>


<style lang="scss" >

  
  .vsa-item__trigger{
    background: rgba(22, 62, 115, 0.5);
    color: white;
    &:hover {
      cursor: pointer;
      background: rgba(22, 62, 115, 0.8);
    }
    &:active {
      background: rgba(22, 62, 115, 1);
    }
    &[aria-expanded = 'true'] {
      background: rgba(22, 62, 115, 0.8);
    }
  }
  
  span.vsa-item__trigger__content {
    font-size: 24px;
    font-weight: normal;
  }
  
  .vsa-item__trigger__icon--is-default:after, 
  .vsa-item__trigger__icon--is-default:before {
    background: white;
  }
  
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
    .initial-data {
      .enhancedCheck input[type=checkbox] + label,
      .enhancedCheck input[type=radio] + label {
        border: none;
        
        &:before {
          background: rgba(22, 62, 115, 0.1);
          color: rgb(22, 62, 115)
        }
      }
      .enhancedCheck input[type=radio] + label:before {
        line-height: 140%;
        color: rgb(22, 62, 115);
        font-size: 24px;
      }

      .enhancedCheck input[type=radio]:checked + label:before {
        content: "•";
      }

      .enhancedCheck input[type=radio]:not(:checked) + label:hover:before {
        content: "•";
      }
      
      input[type=checkbox]:not(:checked) + label:hover,
      input[type=radio]:not(:checked) + label:hover {
        color: black
      }
    }
    
  }
  .syndrome-conclusion {
    max-width: 675.94px;
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
    margin: 20px 0;
  }

  .initial-data {
      margin-top: 20px;
      border: 1px solid;
      margin-bottom: 20px;
      padding: 15px;
      position: relative;
      display: flex;
      align-items: center;
      flex-direction: column;
    p {
      text-align: center;
      margin: 5px 0;
    }
  }

  .choose-error-place {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .choose-wrapper {
      display: flex;
      .choose-base {
        margin-right: 30px;
      }

      p {
        text-align: start;
        font-weight: bold;
        padding-left: 5px;
      }

      input:checked + label  {
        font-weight: bold;
      } 
    }
    span.choose-res {
      margin-top: 10px;
    }
  }
  .error-buttons-wrapper {
    display: flex;
  }
</style>

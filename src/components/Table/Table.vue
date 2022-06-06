<template>
  <table :id="'table-' + tableId">
    <caption :ref="'table-caption' + tableId"></caption>
    <thead>
      <Square :num="tableId"/>
      <th :colindex="h" v-for="h  in header" :key="h">
        {{h}}
      </th>
    </thead>
    <tbody>
      <tr v-for="(line,rowIndex) in bytes" :key="rowIndex">
        <th :colIndex="header[rowIndex]">{{header[rowIndex]}}</th>
        <td v-for="(byte,colIndex) in line" :key="colIndex">
          <Square :rowIndex="rowIndex" :colIndex="colIndex" :tableId="tableId"
          :pathToOutputByte="rowIndex == selectedElementRowIndex || colIndex == selectedElementColIndex" 
          :outputByte="rowIndex == selectedElementRowIndex && colIndex == selectedElementColIndex" :num="displayByte(byte)"/>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Square from './Square.vue'
import Display from '../../helpers/display'
import Convert from '../../helpers/convert'

export default {
    components: {
        Square
    },

    props: {
        type: {
            type: String,
            require: true
        },
        bytes: {
            type: Array,
            require: true
        },
        modulo: {
            type: String,
            require: false
        },
        tableId: {
            type: String
        },
        selectedElementRowIndex: {
            type: Number
        },
        selectedElementColIndex: {
            type: Number
        },
    },

    data() {
        return {
            header: Display.tableHeader(),
        }
    },

    mounted() {
        let tableCaption = this.$refs["table-caption" + this.tableId];
        if(this.modulo){
            tableCaption.innerHTML= "Основание " + Display.indexesToTop(this.modulo)
        } else if (this.type == "standart") {
            tableCaption.innerHTML = "Таблица замен стандарта AES";
        } else if (this.type == "control") {
            tableCaption.innerHTML = "Контрольная таблица";
        } 
    },

    methods: {
      displayByte(byte) {
        return Display.addHexPrefix(Convert.toHex(byte))
      }
    }
}
</script>

<style lang="scss" scoped>
    table {
        width: fit-content;
        margin-bottom: 10px;
        
        caption {
            margin-bottom: 10px;
            font-size: 20px;
            font-weight: bold;
        }

        th {
            background: rgba(22, 62, 115, 1);
            color: white;
        }
    }
</style>
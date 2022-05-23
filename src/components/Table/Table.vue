<template>
    <table :id="'table-' + tableId">
        <caption :ref="'table-caption' + tableId"></caption>
        <thead>
            <Square :border="false"></Square>
            <th :colindex="h" v-for="h  in header" :key="h">
                {{h}}
            </th>
        </thead>
        <tbody>
            <tr v-for="(line,rowIndex) in bytes" :key="rowIndex">
                <th :colIndex="header[rowIndex]">{{header[rowIndex]}}</th>
                <td v-for="(byte,colIndex) in line" :key="colIndex">
                    <Square :rowIndex="rowIndex" :colIndex="colIndex" :num="display.addHexPrefix(convert.toHex(byte))"/>
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
        }
    },

    data() {
        return {
            header: new Display().tableHeader(),
            display: new Display(),
            convert: new Convert()
        }
    },

    mounted() {
        let tableCaption = this.$refs["table-caption" + this.tableId];
        if(this.modulo){
            tableCaption.innerHTML= this.display.asPolynom(this.modulo)
        } else if (this.type == "standart") {
            tableCaption.innerHTML = "Таблица замен стандарта AES";
        } else if (this.type == "control") {
            tableCaption.innerHTML = "Контрольная таблица";
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

        .cell.no-border {
            background: rgba(22, 62, 115, 1);
            
        }
    }
</style>
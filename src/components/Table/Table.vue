<template>
    <table :id="'table-' + tableId">
        <caption :id="'table-caption' + tableId">Таблица замен стандарта AES</caption>
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
            type: Number
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
        if(this.modulo){
            document.getElementById("table-caption" + this.tableId).innerHTML= this.display.asPolynom(this.modulo)
        } 
    }

}
</script>

<style>
table {
    width: fit-content;
}

</style>
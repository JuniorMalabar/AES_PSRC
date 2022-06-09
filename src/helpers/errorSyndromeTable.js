//import Calculation from "./calculation";
import Convert from "./convert";

class ErrorSyndromeTable {


  static generateTable() {
    let table = {}

    for (let byte = 0; byte < 256; byte++) {
      table[Convert.toHex(byte)] = {

      }
    }

    return table
  }

}

export default ErrorSyndromeTable;
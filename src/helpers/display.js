import _ from 'lodash'

class Display {

  tableHeader() {
    return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
  }

  addHexPrefix(num) {
    return "0x" + num;
  }

  addBinPrefix(num) {
    return "0b" + num;
  }

  indexesToTop(polynom) {
    return _.replace(polynom, /x\d/g, function a(a) { return a[0] + '<sup>' + a[1] + '</sup>' })
  }

}

export default Display;
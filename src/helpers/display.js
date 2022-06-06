import _ from 'lodash'

class Display {

  static tableHeader() {
    return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
  }

  static addHexPrefix(num) {
    return "0x" + num;
  }

  static addBinPrefix(num) {
    return "0b" + num;
  }

  static indexesToTop(polynom) {
    return _.replace(polynom, /x\d/g, function a(a) { return a[0] + '<sup>' + a[1] + '</sup>' })
  }

}

export default Display;
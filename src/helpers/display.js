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

  asPolynom(string) {
    return _.replace(string, /x\d/g, function a(a) { return a[0] + '<sup>' + a[1] + '</sup>' })
  }

  binaryAsPolynom(string) {
    let polynom = [];
    for (let i = 0; i < string.length; i++) {
      if (string[i] == 1) {
        if (i == string.length - 1) {
          polynom.push('1')
        } else if (i == (string.length - 2)) {
          polynom.push('x')
        } else {
          polynom.push('x' + (string.length - i - 1));
        }
      }
    }
    if (!polynom.length) {
      return '0'
    } else {
      return this.asPolynom(polynom.join("+"))
    }
  }

}

export default Display;
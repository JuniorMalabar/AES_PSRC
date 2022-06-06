
class Convert {

  static toHexWithoutZeros(num) {
    num = num.toString(16)
    return num
  }

  static toHex(num) {
    num = num.toString(16)
    if (num.length < 2) {
      num = '0' + num
    }
    return num.toUpperCase();
  }

  static toBin(num) {
    num = num.toString(2)
    while (num.length < 8) {
      num = '0' + num
    }
    return num;
  }

  static fromBinToDec(str) {
    return parseInt(str, 2)
  }

  static fromHexToDec(str) {
    return parseInt(str, 16)
  }

  static binaryToPolynom(string) {
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
      return polynom.join("+")
    }
  }

  static polynomToBinary(polynom) {
    let binary = '00000000'.split('')
    let degrees = []
    polynom.split('+').forEach(el => {
      if (el == "x") {
        degrees.push("1")
      } else if (el == "1") {
        degrees.push("0")
      } else {
        degrees.push(el[1])
      }
    });
    for (let i = 0; i < degrees.length; i++) {
      binary[degrees[i]] = '1'
    }
    return binary.reverse().join('')
  }
}

export default Convert;
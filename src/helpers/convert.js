
class Convert {

    toHex(num) {
        num = num.toString(16)
        if (num.length < 2) {
            num = '0' + num
        }
        return num.toUpperCase();
    }

    toBin(num) {
        num = num.toString(2)
        while (num.length < 8) {
            num = '0' + num
        }
        return num;
    }

    fromBinToDec(str) {
        return parseInt(str, 2)
    }

    fromHexToDec(str) {
        return parseInt(str, 16)
    }

    binaryToPolynom(string) {
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

    polynomToBinary (polynom) {
      let binary = '00000000'.split('')
      let positions = []
      polynom.split('+').forEach(el => {
        if (el == "x") {
          positions.push("1")
        } else if(el == "1") {
          positions.push("0")
        } else {
          positions.push(el[1])
        }
      });
      for (let i = 0; i < positions.length; i++) {
        binary[positions[i]] = '1'
      }
      return binary.reverse().join('')
    }
}

export default Convert;
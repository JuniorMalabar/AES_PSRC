import _ from 'lodash'
import Display from './display';
import Convert from './convert';

class Calculation {

  static multiplicationOnX(polynom) {
    if (polynom == "0") {
      return "0"
    }
    return _.chain(polynom).replace(/\d/g,
      (match) => {
        if (match == "1") {
          return "x"
        } else {
          return Number(match) + 1
        }
      }).replace('+x+',
        () => {
          return '+x2+'
        }).value();
  }

  static remainderAfterDividingAPolynomialByAPolynomial(polynom_1, polynom_2) {

    if (polynom_1 == polynom_2) {
      return [0];
    }

    let degrees_1 = this.getPolynomialDegrees(polynom_1);
    let degrees_2 = this.getPolynomialDegrees(polynom_2);
    let seniorDegree_1 = degrees_1[0];
    let seniorDegree_2 = degrees_2[0];
    if (seniorDegree_1 < seniorDegree_2) {
      return polynom_1;
    } else {
      while (seniorDegree_1 >= seniorDegree_2) {
        let difference = seniorDegree_1 - seniorDegree_2;

        let intermediateTerm = _.map(degrees_2, (el) => { return el + difference })
        degrees_1 = this.moduloAddition(degrees_1, intermediateTerm)
        seniorDegree_1 = degrees_1[0]
      }
    }
    return degrees_1;
  }

  static binaryByDegrees(degrees) {
    let binary = '00000000'.split('')
    if (typeof degrees === 'string') {
      degrees = this.getPolynomialDegrees(degrees)
    }
    for (let i = 0; i < degrees.length; i++) {
      binary[degrees[i]] = '1'
    }
    return binary.reverse().join('')
  }

  static moduloAddition(firstDeg, secondDeg) {
    if (firstDeg == [] && secondDeg == []) {
      return '0'
    }
    if (firstDeg == [] && secondDeg != []) {

      return secondDeg
    }
    if (secondDeg == [] && firstDeg != []) {
      return firstDeg
    }
    return Array.from(new Set(_.concat(_.difference(firstDeg, secondDeg),
      _.difference(secondDeg, firstDeg)))).sort().reverse()
  }

  static getPolynomialDegrees(polynom) {
    let degrees = [];
    if (polynom == "0") {
      return degrees
    }
    polynom.split("+").forEach((el) => {
      if (el == "x") {
        degrees.push(1);
      } else if (el == "1") {
        degrees.push(0);
      } else {
        degrees.push(Number(el[1]));
      }
    });

    return degrees
  }

  static addError(correctByteAsBin, errorBit) {
    let outputByteAsBin = correctByteAsBin.split('').reverse()
    if (outputByteAsBin[Number(errorBit)] == "1") {
      outputByteAsBin[Number(errorBit)] = "0"
    } else {
      outputByteAsBin[Number(errorBit)] = "1"
    }
    return outputByteAsBin.reverse().join('')
  }

  static getFirstControlByte(firstInfoByte, secondInfoByte) {

    let fromFirst = this.getPolynomialDegrees(
      Convert.binaryToPolynom(
        Convert.toBin(
          firstInfoByte
        )
      )
    )
    let fromSecond = this.getPolynomialDegrees(
      Convert.binaryToPolynom(
        Convert.toBin(
          secondInfoByte
        )
      )
    )
    let hexFirstControlByte = Convert.toHex(
      Convert.fromBinToDec(
        this.binaryByDegrees(
          this.moduloAddition(fromFirst, fromSecond)
        )
      )
    )

    return hexFirstControlByte
  }

  static getSecondControlByte(firstInfoByte, secondInfoByte, modulo) {
    let fromFirst = this.getPolynomialDegrees(
      Convert.binaryToPolynom(
        Convert.toBin(
          firstInfoByte
        )
      )
    )

    let fromSecond = this.getPolynomialDegrees(
      this.multiplicationOnX(
        Convert.binaryToPolynom(
          Convert.toBin(
            secondInfoByte
          )
        )
      )
    )

    let hexSecondControlByte = Convert.toHex(
      Convert.fromBinToDec(
        this.binaryByDegrees(
          this.remainderAfterDividingAPolynomialByAPolynomial(
            Convert.binaryToPolynom(
              this.binaryByDegrees(
                this.moduloAddition(fromFirst, fromSecond)
              )
            ),
            modulo
          )
        )
      )
    )

    return hexSecondControlByte
  }

  static getNewRowColFromStandartRow(rowCol, polynom) {
    return Convert.fromBinToDec(
      this.binaryByDegrees(
        this.remainderAfterDividingAPolynomialByAPolynomial(
          Convert.binaryToPolynom(
            Convert.toBin(
              Convert.fromHexToDec(rowCol)
            )
          ), polynom
        )
      )
    )
  }

  static getNewByteByTablePolynom(oldByte, tablePolynom) {
    return Convert.fromBinToDec(
      this.binaryByDegrees(
        this.remainderAfterDividingAPolynomialByAPolynomial(
          Convert.binaryToPolynom(
            Convert.toBin(oldByte)
          ),
          tablePolynom
        )
      )
    )
  }

  static errorSyndrome(firstControlByte, secondControlByte) {
    let errorSyndrome =
      Convert.binaryToPolynom(this.binaryByDegrees(this.moduloAddition(
        this.getPolynomialDegrees(Convert.binaryToPolynom(Convert.toBin(Convert.fromHexToDec(firstControlByte)))),
        this.getPolynomialDegrees(Convert.binaryToPolynom(Convert.toBin(Convert.fromHexToDec(secondControlByte))))
      )))
    return errorSyndrome
  }

  static errorVector(bit) {
    let zeros = [...'0000']
    zeros.splice(bit, 1, "1")
    return zeros.reverse().join('');
  }

  static altBinaryAddition(firstBin, secondBin) {
    return (Number(Display.addBinPrefix(firstBin)) + Number(Display.addBinPrefix(secondBin))).toString(2)
  }
  static combinationRecovery(erronousBinaryCombination, errorVector) {
    return (Number(Display.addBinPrefix(erronousBinaryCombination)) ^ Number(Display.addBinPrefix(errorVector))).toString(2)
  }
}

export default Calculation;
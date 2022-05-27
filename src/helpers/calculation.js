import _ from 'lodash'

class Calculation {

  multiplicationOnX(polynom) {
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

  remainderAfterDividingAPolynomialByAPolynomial(polynom_1, polynom_2) {

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

  binaryByDegrees(degrees) {
    let binary = '00000000'.split('')
    if( typeof degrees === 'string') {
      degrees = this.getPolynomialDegrees(degrees)
    }
    for (let i = 0; i < degrees.length; i++) {
      binary[degrees[i]] = '1'
    }
    return binary.reverse().join('')
  }

  moduloAddition(firstDeg, secondDeg) {
    return Array.from(new Set(_.concat(_.difference(firstDeg, secondDeg),
      _.difference(secondDeg, firstDeg)))).sort().reverse()
  }

  getPolynomialDegrees(polynom) {
    let degrees = [];

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
}

export default Calculation;
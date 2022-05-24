import _ from 'lodash'

class Calculation {


    firstControlTableByte(S1BinByte, S2BinByte) {
        return S1BinByte ^ S2BinByte
    }

    secondControlTableByte(S1BinByte, S2BinByte) {
        return S1BinByte ^ S2BinByte //доработать 
    }

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

    remainderAfterDividingByAPolynomial(binary, polynom) {
        return binary % polynom
    }
}

export default Calculation;
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

    remainderAfterDividingAPolynomialByAPolynomial(polynom_1, polynom_2) {
        if (polynom_1 == polynom_2) {
            return 0;
        }

        let positions_1 = [];
        let positions_2 = [];

        polynom_1.split("+").forEach((el) => {
            if (el == "x") {
                positions_1.push(1);
            } else if (el == "1") {
                positions_1.push(0);
            } else {
                positions_1.push(Number(el[1]));
            }
        });
        polynom_2.split("+").forEach((el) => {
            if (el == "x") {
                positions_2.push(1);
            } else if (el == "1") {
                positions_2.push(0);
            } else {
                positions_2.push(Number(el[1]));
            }
        });
        let seniorDegree_1 = positions_1[0];
        let seniorDegree_2 = positions_2[0];
        if (seniorDegree_1 < seniorDegree_2) {
            return polynom_1;
        } else {
            console.log(positions_1)
            console.log(positions_2)
            while (seniorDegree_1 >= seniorDegree_2) {
                let difference = seniorDegree_1 - seniorDegree_2;
                
                let intermediateTerm = _.map(positions_2, (el) => { return el+difference})
                let d1 = _.difference(positions_1, intermediateTerm);
                let d2 = _.difference(intermediateTerm, positions_1);
                positions_1 = Array.from(new Set(_.concat(d1,d2))).sort().reverse()
                seniorDegree_1 = positions_1[0]
            }
        }
        
        return _.map(positions_1, el => {return el+1});
    }
}

export default Calculation;
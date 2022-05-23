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

}

export default Convert;
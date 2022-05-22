
class Validate {
    
    allowedLen (digit) {
        let len = Math.floor(Math.log10(digit+1))
        let lenOfStr = digit.toString().length;
        if(len>2 || lenOfStr>2) {
            return true;
        }
        else {
            return false;
        }
    }

}

export default Validate;
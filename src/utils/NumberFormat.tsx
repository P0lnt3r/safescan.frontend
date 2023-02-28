

export default ( number : number | string , n? : number ) => {
    n = n ? n : 3;
    let parm = Number((number || 0)).toString();  //使用Number强转一下再toString
    let integer = ``,
      isNegativeNumber = false,
      decimal = ``,
      result = ``;
    isNegativeNumber = Number((number || 0)) / 1 > 0 ? false : true;
    parm = parm.replace('-', '');
    integer = parm.split(`.`)[0];
    if (parm.split(`.`).length > 1) {
      decimal = parm.split(`.`)[1];
    }
    while (integer.length > 3) {
      result = `,${integer.slice(-n)}${result}`;
      integer = integer.slice(0, integer.length - 3);
    }
    if (integer) {
      result = decimal ? `${integer}${result}.${decimal}` : `${integer}${result}`;
    }
  
    if (isNegativeNumber && (Number((number || 0)) / 1) !== 0) {
      result = `-${result}`;
    }
    return result;

}
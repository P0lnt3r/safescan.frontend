
export function format(value: string, fix?: number , forceFix ?: boolean): string {
  const n = 3;
  let integer = '', decimal = '', result = '';

  // 判断是否有小数点，拆分整数部分和小数部分
  if (value.indexOf(".") > 0) {
    [integer, decimal] = value.split(".");
  } else {
    integer = value;
  }

  // 整数部分格式化：每3位加一个逗号
  while (integer.length > 3) {
    result = `,${integer.slice(-n)}${result}`;
    integer = integer.slice(0, integer.length - 3);
  }

  // 移除小数部分末尾的多余 0
  while (decimal.length > 0 && decimal.lastIndexOf('0') == decimal.length - 1) {
    decimal = decimal.substring(0, decimal.lastIndexOf('0'));
  }

  // 根据 fix 补全小数位
  if (fix !== undefined && forceFix) {
    decimal = decimal.padEnd(fix, '0'); // 补足到 fix 位小数
  }

  // 组装结果
  if (integer) {
    result = decimal ? `${integer}${result}.${decimal}` : `${integer}${result}`;
  }

  return result;
}


export default (number: number | string, n?: number) => {
  // n = n ? n : 3;
  // let parm = BigInt((number || 0)).toString();  //使用Number强转一下再toString
  // let integer = ``,
  //   isNegativeNumber = false,
  //   decimal = ``,
  //   result = ``;
  // isNegativeNumber = Number((number || 0)) / 1 > 0 ? false : true;
  // parm = parm.replace('-', '');
  // integer = parm.split(`.`)[0];
  // if (parm.split(`.`).length > 1) {
  //   decimal = parm.split(`.`)[1];
  // }
  // while (integer.length > 3) {
  //   result = `,${integer.slice(-n)}${result}`;
  //   integer = integer.slice(0, integer.length - 3);
  // }
  // if (integer) {
  //   result = decimal ? `${integer}${result}.${decimal}` : `${integer}${result}`;
  // }
  // if (isNegativeNumber && (Number((number || 0)) / 1) !== 0) {
  //   result = `-${result}`;
  // }
  return "";
}
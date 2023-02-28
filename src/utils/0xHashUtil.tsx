
export function BothSub( str : string , length: number ){
    if ( length > 0 ){
        let left = str.substring(0,length + 2);
        let right = str.substring( str.length - length );
        return left + "......" + right;
    }
    return str;
}

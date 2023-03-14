import { Abi_Method_Define, Abi_Method_Param } from ".";


export default (signature: string): Abi_Method_Define => {
    if ( signature.startsWith("function ") || signature.startsWith("event ") ){
        signature = signature.substring( signature.indexOf(" ") + 1 );
    }
    const firstSplitIndex = signature.indexOf("(");
    const name = signature.substring(0, firstSplitIndex);
    const paramStr = signature.substring(firstSplitIndex + 1, signature.length - 1);
    const paramStrArr = paramStr.split(",");

    const params: Abi_Method_Param[] = [];
    const indexed: Abi_Method_Param[] = [];
    const data: Abi_Method_Param[] = [];

    paramStrArr.forEach((param: string) => {
        const arr = param.trim().split(" ");
        let name: string = "",
            type: string = ""
        if (arr.length === 2) {
            type = arr[0];
            name = arr[1];
            data.push({ name, type, index: 0 })
            params.push({ name, type, index: 0 })
        } else if (arr.length === 3) {
            if ("indexed" === arr[1].trim()) {
                type = arr[0];
                name = arr[2];
            } else {
                type = arr[1];
                name = arr[2];
            }
            indexed.push({ name, type, index: indexed.length })
            params.push({ name, type, index: indexed.length })
        }
    })
    const define: Abi_Method_Define = {
        name, signature,
        params, indexed, data
    }
    return define;

}
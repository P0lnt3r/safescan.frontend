

/**
 * erc721 => ERC-721
 * erc1155 => ERC-1155
 * @param type erc1155 | erc721
 */
export function NFT_Type_Label( type : string ){
    if ( "erc721" == type ){
        return "ERC-721";
    }
    if ( "erc1155" == type ){
        return "ERC-1155"
    }
    return type;
}
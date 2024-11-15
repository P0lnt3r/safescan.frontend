import { useState } from "react";
// import ERC20_DEFAULT_LOGO from "../images/erc20_default_32.png";
import ERC20_DEFAULT_LOGO from "../images/ERC20.png";

export default ( { address , width } : { address : string , width ?: string } ) => {
    const [ logoURI , setLogoURI ] = useState(`/images/erc20_logos/${address}`);
    return (
        <img style={{background:"grey" , borderRadius:"6px" , padding:"2px 2px 2px 2px"}} width={width ? width : "22px"} src={logoURI} onError={() => {
            setLogoURI(ERC20_DEFAULT_LOGO);
        }}/>
    )
}
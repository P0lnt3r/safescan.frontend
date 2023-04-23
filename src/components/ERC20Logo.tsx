import { useState } from "react";
import ERC20_DEFAULT_LOGO from "../images/erc20_default_32.png";

export default ( { address} : { address : string } ) => {
    const [ logoURI , setLogoURI ] = useState(`/images/erc20_logos/${address}`);
    return (
        <img width='8%' src={logoURI} onError={ () => {
            setLogoURI(ERC20_DEFAULT_LOGO);
        }} />
    )
}
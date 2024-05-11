import { ethers } from "ethers";

const safe3AddressBase58Regex = /^X[a-zA-Z0-9]{33}$/;

export function IsSafe3Address( address : string ) : boolean {
    return safe3AddressBase58Regex.test(address);
}

export function IsSafe4Address( address : string ) : boolean {
    return ethers.utils.isAddress(address);
}
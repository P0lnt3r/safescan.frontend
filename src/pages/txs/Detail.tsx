import { useParams } from "react-router-dom"

export default function(){
    const {txHash} = useParams();
    return (
        <>Transactions for hash : {txHash}</>
    )
}
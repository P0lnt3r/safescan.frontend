import { useParams } from "react-router-dom"

export default function(){

    const {address} = useParams();
    return (
        <>Address Detail for : {address}</>
    )
    
}
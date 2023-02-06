import { useParams } from "react-router-dom";

export default function(){

    const {height} = useParams();
    
    return (
        <>block - detail for : {height}</>
    )

}
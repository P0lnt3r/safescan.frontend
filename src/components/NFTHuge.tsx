import { useState } from "react"
import NFT_PLACEHOLDER from "../images/nft-placeholder.svg";

export default ({ uri }: { uri: string | undefined }) => {

    const [showDefault, setShowDefault] = useState<boolean>(uri == undefined);
    console.log( "for huge:" , showDefault );
    return <>
        <div style={{
            height: "490px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            {
                !showDefault &&
                <img src={uri}
                    style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: ".5rem"
                    }}
                    onError={() => {
                        setShowDefault(true)
                    }}
                >
                </img>
            }
            {
                showDefault && <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:"rgba(173,181,189,.1)",
                    height:"100%",
                    width:"100%",
                    borderRadius:".5rem"
                }}>
                    <img src={NFT_PLACEHOLDER} style={{
                        width: "128px",
                        height: "auto",
                    }} />
                </div>

            }
        </div>
    </>

}
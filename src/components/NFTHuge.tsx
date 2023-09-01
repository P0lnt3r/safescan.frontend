import { MouseEventHandler, useMemo, useState } from "react"
import NFT_PLACEHOLDER from "../images/nft-placeholder.svg";
import { sign } from "crypto";

export enum NFT_URI_SIZE {
    LARGE = "large",
    MIDDLE = "middle",
    SMALL = "small"
}

export default ({ uri, size, onClick }: {
    uri: string | undefined,
    size: NFT_URI_SIZE,
    onClick?: MouseEventHandler | undefined
}) => {
    const [showDefault, setShowDefault] = useState<boolean>(uri == undefined);
    const { wrapperHeight, imgHeight } = useMemo(() => {
        if (size == NFT_URI_SIZE.LARGE) {
            return {
                wrapperHeight: "450px",
                imgHeight: "128px"
            }
        }
        if (size == NFT_URI_SIZE.MIDDLE) {
            return {
                wrapperHeight: "200px",
                imgHeight: "64px",
            }
        }
        return {
            wrapperHeight: "",
            imgHeight: ""
        }
    }, [size]);


    return <>
        <div onClick={ onClick ? onClick : () => {} } style={{
            height: wrapperHeight,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: onClick ? "pointer" : "auto"
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
                showDefault && <div onClick={ onClick ? onClick : () => {} }
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(173,181,189,.1)",
                        height: "100%",
                        width: "100%",
                        borderRadius: ".5rem",
                        cursor: onClick ? "pointer" : "auto"
                    }}>
                    <img src={NFT_PLACEHOLDER} style={{
                        height: imgHeight
                    }} />
                </div>

            }
        </div>
    </>

}
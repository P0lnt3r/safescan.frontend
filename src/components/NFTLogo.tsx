
import { Table, Typography, Row, Col, PaginationProps, Tooltip, TablePaginationConfig , Button } from 'antd';
import NFT_PLACEHOLDER from "../images/nft-placeholder.svg";

export default () => {
    return <>
        <Button style={{ width: "42px", height: "42px", borderRadius: "8px" }}>
            <img style={{
                marginLeft: "-10px"
            }} src={NFT_PLACEHOLDER} width={"32px"} />
        </Button>
    </>
}
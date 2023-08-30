import { useParams } from "react-router"
import { Row, Col, Card, Typography, Divider, Tabs } from "antd"
import ERC20Logo from "../../components/ERC20Logo";
import Address from "../../components/Address";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import type { TabsProps } from 'antd';
import { useEffect, useMemo, useState } from "react";
import { fetchERC20Transfers } from "../../services/tx";
import { ContractVO, ERC20TokenVO, ERC20TransferVO, TokenInfoVO } from "../../services";
import ERC20Transfers from "./ERC20Transfers";
import ERC20TokenTransfers from "./ERC20TokenTransfers";
import ERC20TokenHolders from "./ERC20TokenHolders";
import { fetchToken } from "../../services/assets";
import ERC20TokenAmount from "../../components/ERC20TokenAmount";
import NFTLogo from "../../components/NFTLogo";

import NFT_PLACEHOLDER from "../../images/nft-placeholder.svg";

const { Title, Text, Paragraph, Link } = Typography;

export default () => {
    
    const { token, tokenId } = useParams();

    return <>
        <Row>
            <Col style={{ marginTop: "15px", padding: "5px" }} xl={10} xs={24} >
                <Card size="small" style={{ textAlign: "center" ,padding:"5%" }}>
                    <Card style={{
                        backgroundColor:"rgba(173,181,189,.1)",
                        height:"450px",
                        alignItems:"center" ,   
                        display: "flex",
                        justifyContent: "center"
                        }}>
                        <img src={NFT_PLACEHOLDER} width="128px">
                        </img>
                    </Card>
                </Card>
            </Col>
            <Col style={{ marginTop: "15px", padding: "5px" }} xl={14} xs={24} >
                <Title level={2}>BasCollectable</Title>     
                <Title level={5}>#{tokenId} </Title>       
                <Title level={5}>BasCollectable</Title>
                <Card size="small" style={{ fontSize:"16px" , marginTop:"30px" , height:"394px" }} title={<Title level={5}>Details</Title>}>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong type="secondary">Owner:</Text></Col>
                        <Col xl={18} xs={24}>
                            12312312312
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong type="secondary">Contract Address:</Text></Col>
                        <Col xl={18} xs={24}>

                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong type="secondary">Contract Creator:</Text></Col>
                        <Col xl={18} xs={24} style={{ lineHeight: "18px" }}>

                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong type="secondary">Token ID:</Text></Col>
                        <Col xl={18} xs={24}>

                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong type="secondary">Token Standard:</Text></Col>
                        <Col xl={18} xs={24}>
                            ERC-721
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </>

}
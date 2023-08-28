
import { useParams } from "react-router"
import { Row, Col, Card, Typography, Divider, Tabs } from "antd"
import ERC20Logo from "../../components/ERC20Logo";
import Address from "../../components/Address";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import type { TabsProps } from 'antd';
import { useEffect, useMemo, useState } from "react";
import { fetchERC20Transfers } from "../../services/tx";
import { ContractVO, ERC20TokenVO, ERC20TransferVO, NftTokenVO, TokenInfoVO } from "../../services";
import ERC20Transfers from "./ERC20Transfers";
import ERC20TokenTransfers from "./ERC20TokenTransfers";
import ERC20TokenHolders from "./ERC20TokenHolders";
import { fetchToken } from "../../services/assets";
import ERC20TokenAmount from "../../components/ERC20TokenAmount";
import NumberFormat, { format } from "../../utils/NumberFormat";
const { Title, Text, Paragraph, Link } = Typography;

export default ({ address, contractVO, nftTokenVO }: {
    address: string,
    contractVO: ContractVO,
    nftTokenVO: NftTokenVO
}) => {
    return <>
        <Row>
            <Col style={{ marginTop: "15px", padding: "5px" }} xl={12} xs={24} >
                <Card size="small" title={<Title level={5}>Overview</Title>}>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Contract:</Text></Col>
                        <Col xl={18} xs={24}>
                            {address}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Holders:</Text></Col>
                        <Col xl={18} xs={24}>
                            {format(nftTokenVO.holders+"")}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Total Transfers:</Text></Col>
                        <Col xl={18} xs={24}>
                            {format(nftTokenVO.totalTransfers+"")}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Contract Creator</Text></Col>
                        <Col xl={18} xs={24}>
                            <Row>
                                <Col span={24}>
                                    <Address address={contractVO.creator} />
                                </Col>
                                <Col span={24}>
                                    At Txn : <TransactionHash txhash={contractVO.creatorTransactionHash} />
                                </Col>
                                <Col span={24}>
                                    <Text type="secondary">{DateFormat(contractVO.creatorTimestamp * 1000)}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col style={{ marginTop: "15px", padding: "5px" }} xl={12} xs={24} >
                <Card size="small" style={{height:"258px"}} title={<Title level={5}>Profile Summary</Title>}>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Total Supply:</Text></Col>
                        <Col xl={18} xs={24}>
                            {format(nftTokenVO.totalAssets+"")}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Name:</Text></Col>
                        <Col xl={18} xs={24}>
                            {nftTokenVO.name}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Symbol:</Text></Col>
                        <Col xl={18} xs={24} style={{ lineHeight: "18px" }}>
                            {
                                address &&
                                <ERC20Logo address={address} />
                            }
                            <Text style={{ marginLeft: "5px" }}>{nftTokenVO.symbol}</Text>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Official Site:</Text></Col>
                        <Col xl={18} xs={24}>

                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </>
}
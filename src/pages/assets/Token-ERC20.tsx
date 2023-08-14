
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
const { Title, Text, Paragraph, Link } = Typography;

export default ({ address, contractVO, erc20TokenVO }: {
    address: string,
    contractVO: ContractVO,
    erc20TokenVO: ERC20TokenVO
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
                            {erc20TokenVO.holders}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Transfer Amounts:</Text></Col>
                        <Col xl={18} xs={24}>
                            <Text strong>
                                <ERC20TokenAmount raw={erc20TokenVO.totalTransferAmount} address={address}
                                    decimals={erc20TokenVO.decimals} name={erc20TokenVO.name} symbol={erc20TokenVO.symbol}
                                    fixed={erc20TokenVO.decimals} />
                                <span style={{marginLeft:"5px"}}>{erc20TokenVO.symbol}</span>    
                            </Text>

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
                <Card size="small" title={<Title level={5}>Profile Summary</Title>}>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Total Supply:</Text></Col>
                        <Col xl={18} xs={24}>

                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Name:</Text></Col>
                        <Col xl={18} xs={24}>
                            {erc20TokenVO.name}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Symbol:</Text></Col>
                        <Col xl={18} xs={24} style={{ lineHeight: "18px" }}>
                            {
                                address &&
                                <ERC20Logo address={address} />
                            }
                            <Text style={{ marginLeft: "5px" }}>{erc20TokenVO.symbol}</Text>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Decimals:</Text></Col>
                        <Col xl={18} xs={24}>
                            {erc20TokenVO.decimals}
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
import { useParams } from "react-router"
import { Row, Col, Card, Typography, Divider, Tabs } from "antd"
import ERC20Logo from "../../components/ERC20Logo";
import Address from "../../components/Address";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import type { TabsProps } from 'antd';
import { useEffect, useMemo, useState } from "react";
import { fetchERC20Transfers } from "../../services/tx";
import { ERC20TransferVO } from "../../services";
import ERC20Transfers from "./ERC20Transfers";
import ERC20TokenTransfers from "./ERC20TokenTransfers";
import ERC20TokenHolders from "./ERC20TokenHolders";
const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const { address } = useParams();

    const items: TabsProps['items'] = useMemo(() => {
        return [
            {
                key: 'transfers',
                label: "Transfers",
                children: address && <ERC20TokenTransfers tokenAddress={address} />,
            },
            {
                key: 'holders',
                label: "Holders",
                children: address && <ERC20TokenHolders token={address} />,
            },
        ]
    }, [address]);

    return <>
        <Divider style={{ margin: '0px 0px' }} />
        <Row>
            <Col style={{ marginTop: "15px", padding: "5px" }} xl={12} xs={24} >
                <Card size="small" title={<Title level={5}>Overview</Title>}>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Total Supply:</Text></Col>
                        <Col xl={18} xs={24}>

                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Holders:</Text></Col>
                        <Col xl={18} xs={24}>

                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Transfers:</Text></Col>
                        <Col xl={18} xs={24}>

                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Contract Creator</Text></Col>
                        <Col xl={18} xs={24}>
                            <Row>
                                <Col span={24}>
                                    <Address address="0xbfdc074a61648b8b51fb00eb9beba79733cceb51" />
                                </Col>
                                <Col span={24}>
                                    At Txn : <TransactionHash txhash="0x059d39d85f3a06dae6b157acf6b70f419187223c381c1cc6836b58fd50be55a6" />
                                </Col>
                                <Col span={24}>
                                    <Text type="secondary">{DateFormat(1689251427 * 1000)}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col style={{ marginTop: "15px", padding: "5px" }} xl={12} xs={24} >
                <Card size="small" title={<Title level={5}>Profile Summary</Title>}>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Contract:</Text></Col>
                        <Col xl={18} xs={24}>
                            {address}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Name:</Text></Col>
                        <Col xl={18} xs={24}>
                            Wrap Bitcoin
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Symbol:</Text></Col>
                        <Col xl={18} xs={24} style={{ lineHeight: "18px" }}>
                            {
                                address &&
                                <ERC20Logo address={address} />
                            }
                            <Text style={{ marginLeft: "5px" }}>wBTC</Text>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Decimals:</Text></Col>
                        <Col xl={18} xs={24}>
                            18
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={6} xs={24}><Text strong>Official Site:</Text></Col>
                        <Col xl={18} xs={24}>
                            https://www.anwang.com
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>

        <Divider style={{ margin: '20px 0px' }} />

        <Card>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>

    </>

}
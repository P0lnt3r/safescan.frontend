import { useParams } from "react-router-dom"
import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal } from 'antd';
import {
    SearchOutlined, QrcodeOutlined, FileTextOutlined, UserOutlined
} from '@ant-design/icons';
import { isMobile } from 'react-device-detect'
import type { TabsProps } from 'antd';
import QRCode from 'qrcode.react';
import { useEffect, useMemo, useState } from "react";
import Transactions from "./Transactions";
import ERC20Transfers from "./ERC20Transfers";
import { fetchAddress } from "../../services/address";
import { AddressVO, MasterNodeVO, SuperNodeVO } from "../../services";
import EtherAmount, { ETHER_Combine } from "../../components/EtherAmount";
import SuperNode from "./SuperNode";
import MasterNode from "./MasterNode";
import NodeRewards from "./NodeRewards";
import AccountRecords from "./AccountRecords";
import ContractInternalTransactions from "./ContractInternalTransactions";

import AddressTokens from "./AddressTokens";

const { Title, Text, Paragraph, Link } = Typography;

export default function () {

    const { address } = useParams();
    const items: TabsProps['items'] = useMemo(() => {
        return [
            {
                key: 'transactions',
                label: "Transactions",
                children: address && <Transactions address={address} ></Transactions>,
            },
            {
                key: 'contractInternalTransactions',
                label: "Internal Txns",
                children: address && <ContractInternalTransactions address={address} ></ContractInternalTransactions>,
            },
            {
                key: 'noderewards',
                label: "Node Rewards",
                children: address && <NodeRewards address={address} />
            },
            {
                key: 'accountRecords',
                label: `Account Records`,
                children: address && <AccountRecords address={address}></AccountRecords>,
            },
            {
                key: 'erc20-transactions',
                label: `ERC20 Transactions`,
                children: address && <ERC20Transfers address={address}></ERC20Transfers>,
            },
        ]
    }, [address]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addressVO, setAddressVO] = useState<AddressVO>();

    useEffect(() => {
        if (address) {
            fetchAddress(address).then(data => {
                setAddressVO(data)
            })
        }
    }, [address])

    const { type, subType, tag, remark, prop } = useMemo(() => {
        return addressVO?.propVO ? addressVO.propVO : {
            type: undefined,
            subType: undefined,
            tag: undefined,
            remark: undefined,
            prop: undefined
        };
    }, [addressVO]);



    return (
        <>
            {
                address &&
                <Modal title={address}
                    open={isModalOpen} onCancel={() => setIsModalOpen(false)} closable={false} style={{ textAlign: "center" }}
                    footer={<></>}>
                    <QRCode
                        value={address}
                        size={200}
                        fgColor="#000000"
                    />
                </Modal>
            }
            <Row>
                <Col xs={24} xl={2}>
                    <Title level={4}>
                        {
                            addressVO && addressVO.type == "contract" && <>
                                <FileTextOutlined />
                                <Text style={{ marginLeft: "8px" }}>Contract</Text>
                            </>
                        }
                        {
                            addressVO && addressVO.type == "address" && <>
                                <UserOutlined />
                                <Text style={{ marginLeft: "8px" }}>Address</Text>
                            </>
                        }
                    </Title>
                </Col>
                <Col xs={24} xl={20}>
                    <Row>
                        <Text type="secondary" strong
                            style={
                                isMobile ? { lineHeight: "30px", fontSize: "14px", letterSpacing: "-1px" }
                                    : { fontSize: "18px" }
                            }>
                            <Paragraph copyable style={{ color: "rgba(52, 104, 171, 0.85)" }}>
                                {address}
                            </Paragraph>
                        </Text>
                        <Tooltip title="Click to view QR Code">
                            <Button onClick={() => setIsModalOpen(true)} style={{ marginTop: "2px", marginLeft: "5px" }} type="primary" size="small" shape="circle" icon={<QrcodeOutlined />} />
                        </Tooltip>
                    </Row>
                </Col>
            </Row>

            <Divider style={{ margin: '0px 0px' }} />

            <Row>
                <Col style={{ marginTop: "15px", padding: "5px" }} xl={12} xs={24} >
                    <Card size="small" title={<Title level={5}>Overview</Title>}>
                        <Row>
                            <Col xl={24} xs={24}><Text strong type="secondary">SAFE VALUE AMOUNT:</Text></Col>
                            <Col xl={24} xs={24}>
                                <Text strong>
                                    {
                                        addressVO && addressVO.balance && addressVO.balance.balance && <>
                                            {
                                                ETHER_Combine([addressVO.balance.balance, addressVO.balance.totalAmount], 18)
                                            }
                                        </>
                                    }
                                </Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={24} xs={24}><Text strong type="secondary">BALANCE:</Text></Col>
                            <Col xl={24} xs={24}>
                                <Text strong>
                                    {
                                        addressVO && addressVO.balance && addressVO.balance.balance && <EtherAmount raw={addressVO.balance.balance} fix={18} />
                                    }
                                </Text>
                            </Col>
                        </Row>
                        <Divider dashed><Text code type="secondary" strong>Account Manager</Text></Divider>
                        <Row>
                            <Col xl={10} xs={4}><Text strong>Total:</Text></Col>
                            <Col xl={14} xs={20}>
                                <Text strong>
                                    {
                                        addressVO && addressVO.balance && addressVO.balance.totalAmount && <EtherAmount raw={addressVO.balance.totalAmount} fix={18} />
                                    }
                                </Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={10} xs={4}><Text strong>Avail:</Text></Col>
                            <Col xl={14} xs={20}>
                                <Text strong>
                                    {
                                        addressVO && addressVO.balance && addressVO.balance.availableAmount && <EtherAmount raw={addressVO.balance.availableAmount} fix={18} />
                                    }
                                </Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={10} xs={4}><Text strong>Lock:</Text></Col>
                            <Col xl={14} xs={20}>
                                <Text strong>
                                    {
                                        addressVO && addressVO.balance && addressVO.balance.lockAmount && <EtherAmount raw={addressVO.balance.lockAmount} fix={18} />
                                    }
                                </Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={10} xs={4}><Text strong>Freeze:</Text></Col>
                            <Col xl={14} xs={20}>
                                <Text strong>
                                    {
                                        addressVO && addressVO.balance && addressVO.balance.freezeAmount && <EtherAmount raw={addressVO.balance.freezeAmount} fix={18} />
                                    }
                                </Text>
                            </Col>
                        </Row>
                        <Divider dashed></Divider>
                        <Row>
                            <Col xl={24} xs={24}><Text strong type="secondary">TOKEN HOLDINGS:</Text></Col>
                            <Col xl={24} xs={24}>
                                <AddressTokens />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col style={{ marginTop: "15px", padding: "5px" }} xl={12} xs={24} >
                    <Card size="small" title={<Title level={5}>More Informations</Title>}>
                        <Row>
                            <Col xl={10} xs={24}><Text strong>Name Tag:</Text></Col>
                            <Col xl={14} xs={24}>
                                <Text>
                                    {
                                        addressVO && addressVO.propVO && addressVO.propVO.tag
                                    }
                                </Text>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Divider style={{ marginTop: "20px" }} />
            {
                subType == "supernode" && prop &&
                <SuperNode {...JSON.parse(prop) as SuperNodeVO} />
            }
            {
                subType == "masternode" && prop &&
                <MasterNode {...JSON.parse(prop) as MasterNodeVO} />
            }
            <Divider style={{ marginTop: "20px" }} />

            <Card>
                <Tabs defaultActiveKey="1" items={items} />
            </Card>

        </>
    )

}
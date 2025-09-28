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
import NodeRewards from "./NodeRewards";
import AccountRecords from "./AccountRecords";
import ContractInternalTransactions from "./ContractInternalTransactions";
import AddressTokens from "./AddressTokens";
import Address, { ChecksumAddress } from "../../components/Address";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import NFTTransfers from "./NFTTransfers";
import AddressAnalytics from "./AddressAnalytics";
import AddressContractSourceCode from "./AddressContractSourceCode";

const { Title, Text, Paragraph, Link } = Typography;

export default function () {

    const address = useParams().address?.toLocaleLowerCase();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addressVO, setAddressVO] = useState<AddressVO>();

    const items: TabsProps['items'] = useMemo(() => {
        const items = [
            {
                key: 'transactions',
                label: "Transactions",
                children: address && <Transactions address={address} ></Transactions>,
            },
            {
                key: 'contractInternalTransactions',
                label: "Internal Txns",
                children: address && <ContractInternalTransactions address={address} ></ContractInternalTransactions>,
            }
        ];
        if (addressVO?.contract) {
            items.push({
                key: "sourceCode",
                label: "Contract",
                children: address && <AddressContractSourceCode address={address} />
            });
        }
        items.push(
            {
                key: 'noderewards',
                label: "Node Rewards",
                children: address && <NodeRewards address={address} />
            }
        );
        items.push(
            {
                key: 'accountRecords',
                label: `Account Records`,
                children: address && <AccountRecords address={address}></AccountRecords>,
            },
        );
        items.push(
            {
                key: 'erc20-transactions',
                label: `SRC20 Transactions`,
                children: address && <ERC20Transfers address={address}></ERC20Transfers>,
            },
        );
        items.push(
            {
                key: 'nft-transfers',
                label: `NFT Transfers`,
                children: address && <NFTTransfers address={address}></NFTTransfers>,
            },
        );
        items.push(
            {
                key: 'analytics',
                label: `Analytics`,
                children: address && <AddressAnalytics address={address}></AddressAnalytics>,
            }
        );
        return items;
    }, [addressVO]);


    useEffect(() => {
        if (address) {
            fetchAddress(address).then(data => {
                setAddressVO(data)
            })
        }
    }, [address])

    const { type, subType, tag, remark, prop } = useMemo(() => {
        return addressVO?.propVO ? addressVO.propVO : {
            type: addressVO?.type,
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
                <Modal title={ChecksumAddress(address)}
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
                                {address && ChecksumAddress(address)}
                            </Paragraph>
                        </Text>
                        <Tooltip title="Click to view QR Code">
                            <Button onClick={() => setIsModalOpen(true)} style={{ marginTop: "2px", marginLeft: "5px" }} type="primary" size="small" shape="circle" icon={<QrcodeOutlined />} />
                        </Tooltip>
                    </Row>
                </Col>
                <Col span={24} style={{ marginBottom: "20px" }}>
                    {
                        "masternode" == subType && <Tag color="#2db7f5">MASTERNODE</Tag>
                    }
                    {
                        "supernode" == subType && <Tag color="#2db7f5">SUPERNODE</Tag>
                    }
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
                                <AddressTokens tokens={addressVO?.tokens} address={address} erc721TokenAssetCounts={addressVO?.erc721TokenAssetCounts} />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col style={{ marginTop: "15px", padding: "5px" }} xl={12} xs={24} >
                    <Card size="small" style={isMobile ? {} : { height: "410px" }} title={<Title level={5}>More Informations</Title>}>
                        <Row style={{ marginTop: "15px" }}>
                            <Col xl={6} xs={24}><Text strong>Name Tag</Text></Col>
                            <Col xl={18} xs={24}>
                                {
                                    address && addressVO && addressVO.propVO &&
                                    <>
                                        {
                                            (subType == "masternode" || subType == "supernode") &&
                                            <Address address={address} propVO={addressVO.propVO}
                                                to={`/node/${address}`}
                                            />
                                        }
                                        {
                                            !(subType == "masternode" || subType == "supernode") &&
                                            <Address address={address} propVO={addressVO.propVO}
                                                style={{ hasLink: false }}
                                            />
                                        }

                                    </>
                                }
                            </Col>
                        </Row>
                        {
                            type == "address" &&
                            <>
                                <Divider />
                                <Row>
                                    <Col xl={6} xs={24}><Text strong>Last Txn Appeared</Text></Col>
                                    <Col xl={18} xs={24}>
                                        {
                                            address && addressVO && addressVO.latestTxHash &&
                                            <Row>
                                                <Col span={24}>
                                                    <div style={{ width: "60%" }}>
                                                        <TransactionHash txhash={addressVO.latestTxHash} />
                                                    </div>
                                                </Col>
                                                <Col span={24}>
                                                    <Text type="secondary">{DateFormat(addressVO.latestTxTimestamp * 1000)}</Text>
                                                </Col>
                                            </Row>
                                        }
                                    </Col>
                                </Row>
                                <Divider />
                                <Row>
                                    <Col xl={6} xs={24}><Text strong>First Txn Appeared</Text></Col>
                                    <Col xl={18} xs={24}>
                                        {
                                            address && addressVO && addressVO.firstTxHash &&
                                            <Row>
                                                <Col span={24}>
                                                    {
                                                        addressVO.firstTxBlockNumber == 0 &&
                                                        <Text strong>GENESIS</Text>
                                                    }
                                                    {
                                                        addressVO.firstTxBlockNumber != 0 &&
                                                        <div style={{ width: "60%" }}>
                                                            <TransactionHash txhash={addressVO.firstTxHash} />
                                                        </div>
                                                    }
                                                </Col>
                                                <Col span={24}>
                                                    <Text type="secondary">{DateFormat(addressVO.firstTxTimestamp * 1000)}</Text>
                                                </Col>
                                            </Row>
                                        }
                                    </Col>
                                </Row>
                            </>
                        }

                        {
                            type == "contract" && <>
                                <Divider />
                                <Row>
                                    <Col xl={6} xs={24}><Text strong>Contract Creator</Text></Col>
                                    <Col xl={18} xs={24}>
                                        {
                                            address && addressVO && addressVO.contract && addressVO.contract.creatorBlockNumber == 0 &&
                                            <Row>
                                                <Col span={24}>
                                                    <Text strong>GENESIS</Text>
                                                </Col>
                                            </Row>
                                        }
                                        {
                                            address && addressVO && addressVO.contract && addressVO.contract.creator &&
                                            <Row>
                                                <Col span={24}>
                                                    <Address address={addressVO.contract.creator} />
                                                </Col>
                                                <Col span={24}>
                                                    <Text style={{ float: "left" }}>
                                                        At Txn:
                                                    </Text>
                                                    <div style={{ width: "70%", float: "left" }}>
                                                        <TransactionHash txhash={addressVO.contract.creatorTransactionHash} />
                                                    </div>
                                                </Col>
                                                <Col span={24}>
                                                    <Text type="secondary">{DateFormat(addressVO.contract.creatorTimestamp * 1000)}</Text>
                                                </Col>
                                                {
                                                    addressVO.contract.selfDestructTransactionHash &&
                                                    <>
                                                        <Divider />
                                                        <Col span={24}>
                                                            <Text strong type="danger">SELF_DESTRUCT</Text>
                                                        </Col>
                                                        <Col span={24}>
                                                            <Text style={{ float: "left" }}>
                                                                At Txn:
                                                            </Text>
                                                            <div style={{ width: "70%", float: "left" }}>
                                                                <TransactionHash txhash={addressVO.contract.selfDestructTransactionHash} />
                                                            </div>
                                                        </Col>
                                                        <Col span={24}>
                                                            <Text type="secondary">{DateFormat(addressVO.contract.selfDestructTimestamp * 1000)}</Text>
                                                        </Col>
                                                    </>
                                                }
                                            </Row>
                                        }
                                    </Col>
                                </Row>
                            </>
                        }


                    </Card>
                </Col>
            </Row>

            <Divider style={{ marginTop: "20px" }} />

            <Card>
                <Tabs defaultActiveKey="sourceCode" items={items} />
            </Card>

        </>
    )

}
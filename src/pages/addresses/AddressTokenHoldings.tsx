import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal, Table } from 'antd';
import {
    SearchOutlined, QrcodeOutlined, FileTextOutlined, UserOutlined
} from '@ant-design/icons';
import { isMobile } from "react-device-detect";
import { Link as RouterLink } from "react-router-dom";
import AddressTokenHoldingsERC20 from "./AddressTokenHoldings-ERC20";
import AddressTokenHoldingsNFT from "./AddressTokenHoldings-NFT";
import AddressTokenHoldingsAccountRecord from "./AddressTokenHoldings-AccountRecord";
import { useEffect, useState } from "react";
import { AddressVO } from "../../services";
import { fetchAddress } from "../../services/address";
import EtherAmount, { ETHER_Combine } from "../../components/EtherAmount";
import shape from '../../images/shape-1.svg'
import { ChecksumAddress } from "../../components/Address";

const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const address = useSearchParams()[0].get("a");
    const [addressVO, setAddressVO] = useState<AddressVO>();
    useEffect(() => {
        if (address) {
            fetchAddress(address).then(data => {
                setAddressVO(data)
            })
        }
    }, [address])

    return <>
        <Row>
            <Col xs={24} xl={3}>
                <Title level={3}>Token Holdings</Title>
            </Col>
            <Col xs={24} xl={20}>
                <Row>
                    <Text type="secondary" strong
                        style={
                            isMobile ? { lineHeight: "30px", fontSize: "14px", letterSpacing: "-1px" }
                                : { fontSize: "16px", lineHeight: "36px" }
                        }>
                        <RouterLink to={`/address/${address}`}>
                            <Paragraph copyable style={{ color: "rgba(52, 104, 171, 0.85)" }}>
                                { address && ChecksumAddress(address) }
                            </Paragraph>
                        </RouterLink>
                    </Text>
                </Row>
            </Col>
        </Row>
        <Divider style={{ margin: '20px 0px' }} />
        <Row>
            <Col span={24}>
                <Title level={5}>Overview</Title>
            </Col>
        </Row>
        <Row>
            <Col span={6}>
                <div style={{
                    height: "120px",
                    borderRight: "1px solid #dfd2d2"
                }}>
                    <Text type="secondary">SAFE Total Value Amount</Text>
                    <br />
                    <Text strong>
                        {
                            addressVO && addressVO.balance && addressVO.balance.balance && <>
                                {
                                    ETHER_Combine([addressVO.balance.balance, addressVO.balance.totalAmount], 18)
                                }
                            </>
                        } SAFE
                    </Text>
                </div>
            </Col>
            <Col span={6} style={{
                marginLeft: "15px"
            }}>
                <div style={{
                    height: "120px",
                    borderRight: "1px solid #dfd2d2"
                }}>
                    <Text type="secondary">SAFE Balance</Text>
                    <br />
                    <Text strong>
                        {
                            addressVO && addressVO.balance && addressVO.balance.balance && <EtherAmount raw={addressVO.balance.balance} fix={18} />
                        }
                    </Text>
                </div>
            </Col>
            <Col span={6} style={{
                marginLeft: "15px"
            }}>
                <div style={{
                    height: "120px",
                }}>
                    <Text type="secondary">Account Manager</Text>
                    <br />
                    <Text strong>
                        {
                            addressVO && addressVO.balance && addressVO.balance.totalAmount && <EtherAmount raw={addressVO.balance.totalAmount} fix={18} />
                        }
                    </Text>
                    <br />
                    <img src={shape} style={{ width: "8px", marginLeft: "5px", marginTop: "-8px", marginRight: "5px" }} />
                    <Text strong type="success">
                        [Avail]
                        {
                            addressVO && addressVO.balance && addressVO.balance.availableAmount &&
                            <Text type="success" style={{ float: "right" }}>
                                <EtherAmount raw={addressVO.balance.availableAmount} fix={18} />
                            </Text>
                        }
                    </Text>
                    <br />
                    <Text strong type="secondary" style={{ marginLeft: "18px" }}>
                        [Lock]
                        {
                            addressVO && addressVO.balance && addressVO.balance.lockAmount &&
                            <Text type="secondary" style={{ float: "right" }}>
                                <EtherAmount raw={addressVO.balance.lockAmount} fix={18} />
                            </Text>
                        }
                    </Text>
                    <br />
                    <Text strong style={{ marginLeft: "18px", color: "rgb(6, 58, 156)" }}>
                        [Freeze]
                        {
                            addressVO && addressVO.balance && addressVO.balance.freezeAmount &&
                            <Text style={{ float: "right",color: "rgb(6, 58, 156)" }}>
                                <EtherAmount raw={addressVO.balance.freezeAmount} fix={18} />
                            </Text>
                        }
                    </Text>
                </div>
            </Col>
        </Row>
        <br />
        <Row>
            <Col span={6}>
                <div className="address-holding-div">
                    <Text type="secondary" strong style={{ fontSize: "16px" }}>Account Records</Text>
                    <br />
                    <Text strong style={{ fontSize: "16px" }}>-</Text>
                </div>
            </Col>
            <Col span={6}>
                <div className="address-holding-div" style={{ marginLeft: "3%" }}>
                    <Text type="secondary" strong style={{ fontSize: "16px" }}>Assets In Wallet</Text>
                    <br />
                    <Text strong style={{ fontSize: "16px" }}>-</Text>
                </div>
            </Col>
            <Col span={6}>
                <div className="address-holding-div" style={{ marginLeft: "6%" }}>
                    <Text type="secondary" strong style={{ fontSize: "16px" }}>NFT Assets</Text>
                    <br />
                    <Text strong style={{ fontSize: "16px" }}>-</Text>
                </div>
            </Col>
            <Col span={6}>
                <div className="address-holding-div" style={{ marginLeft: "9%" }}>
                    <Text type="secondary" strong style={{ fontSize: "16px" }}>Liquidity Pool Assets in Wallet</Text>
                    <br />
                    <Text strong style={{ fontSize: "16px" }}>-</Text>
                </div>
            </Col>
        </Row>

        <Divider style={{ margin: '20px 0px' }} />
        <Row style={{ marginTop: "20px" }}>
            <Col span={24}>
                {
                    address && <AddressTokenHoldingsAccountRecord address={address} />
                }
            </Col>
            <Divider style={{ margin: '20px 0px' }} />
            <Col style={{ marginTop: "20px" }} span={24}>
                {
                    address && <AddressTokenHoldingsERC20 address={address} />
                }
            </Col>
            <Divider style={{ margin: '20px 0px' }} />
            <Col style={{ marginTop: "20px" }} span={24}>
                {
                    address && <AddressTokenHoldingsNFT address={address} />
                }
            </Col>
        </Row>

    </>

}
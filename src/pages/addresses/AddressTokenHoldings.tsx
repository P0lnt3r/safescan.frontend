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

const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const address = useSearchParams()[0].get("a");
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
                                : { fontSize: "18px", lineHeight: "36px" }
                        }>
                        <RouterLink to={`/address/${address}`}>
                            <Paragraph copyable style={{ color: "rgba(52, 104, 171, 0.85)" }}>
                                {address}
                            </Paragraph>
                        </RouterLink>
                    </Text>
                </Row>
            </Col>
        </Row>
        <Divider style={{ margin: '0px 0px' }} />
        <Row style={{ marginTop: "20px" }}>
            <Col span={24}>
                {
                    address && <AddressTokenHoldingsERC20 address={address} />
                }
            </Col>
            <Divider style={{ margin: '0px 0px' }} />
            <Col style={{ marginTop: "20px" }} span={24}>
                {
                    address && <AddressTokenHoldingsNFT address={address} />
                }
            </Col>
        </Row>

    </>

}
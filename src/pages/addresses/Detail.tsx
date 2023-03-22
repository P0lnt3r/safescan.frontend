import { useParams } from "react-router-dom"
import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal } from 'antd';
import {
    SearchOutlined, QrcodeOutlined,
} from '@ant-design/icons';
import { isMobile } from 'react-device-detect'
import type { TabsProps } from 'antd';
import QRCode from 'qrcode.react';
import { useMemo, useState } from "react";
import Transactions from "./Transactions";
import ERC20Transfers from "./ERC20Transfers";

const { Title, Text, Paragraph, Link } = Typography;

export default function () {

    const { address } = useParams();
    const items: TabsProps['items'] = useMemo( () => {
        return [
            {
                key: 'transactions',
                label: "Transactions",
                children: address && <Transactions address={address} ></Transactions>,
            },
            {
                key: 'erc20-transactions',
                label: `ERC20 Transactions`,
                children: address && <ERC20Transfers address={address}></ERC20Transfers>,
            }
        ]
    } , [address]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {
                address &&
                <Modal title={address} 
                       open={isModalOpen} onCancel={()=>setIsModalOpen(false)} closable={false} style={{ textAlign: "center" }}
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
                    <Title level={4}>Address</Title>
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
                        <Tooltip title="点击查看二维码">
                            <Button onClick={()=>setIsModalOpen(true)} style={{ marginTop: "2px", marginLeft: "5px" }} type="primary" size="small" shape="circle" icon={<QrcodeOutlined />} />
                        </Tooltip>
                    </Row>
                </Col>
            </Row>

            <Divider style={{ margin: '0px 0px' }} />

            <Row>
                <Col style={{ marginTop: "15px", padding: "5px" }} xl={12} xs={24} >
                    <Card size="small" title={<Title level={5}>Overview</Title>}>
                        <Row>
                            <Col xl={10} xs={24}><Text strong>Balance:</Text></Col>
                            <Col xl={14} xs={24}><Text strong>5433.21 SAFE</Text></Col>
                        </Row>
                    </Card>
                </Col>
                <Col style={{ marginTop: "15px", padding: "5px" }} xl={12} xs={24} >
                    <Card size="small" title={<Title level={5}>More Informations</Title>}>
                        <Row>
                            <Col xl={10} xs={24}><Text strong>Name Tag:</Text></Col>
                            <Col xl={14} xs={24}><Text ></Text></Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Divider style={{ marginTop: "20px" }} />

            <Card>
                <Tabs defaultActiveKey="1" items={items} />
            </Card>

        </>
    )

}
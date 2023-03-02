import { useParams } from "react-router-dom"
import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal } from 'antd';
import {
    SearchOutlined, QrcodeOutlined,
} from '@ant-design/icons';
import { isMobile } from 'react-device-detect'
import type { TabsProps } from 'antd';
import QRCode from 'qrcode.react';
import { useState } from "react";

const { Title, Text, Paragraph, Link } = Typography;

export default function () {
    const { address } = useParams();

    const items: TabsProps['items'] = [
        {
            key: 'transactions',
            label: <Text strong>Transactions</Text>,
            children: `Content of Tab Pane 1`,
        },
        {
            key: 'erc20-transactions',
            label: `ERC20 Transactions`,
            children: `Content of Tab Pane 2`,
        },
        {
            key: '3',
            label: `Tab 3`,
            children: `Content of Tab Pane 3`,
        },
    ];

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
                    <Card style={{
                        boxShadow: "0 .5rem 1.2rem rgba(189,197,209,.2)",
                        border: "1px solid #e7eaf3",
                        borderRadius: "0.5em"
                    }} size="small" title={<Title level={5}>Overview</Title>}>
                        <Row>
                            <Col xl={10} xs={24}><Text strong>Balance:</Text></Col>
                            <Col xl={14} xs={24}><Text strong>5433.21 SAFE</Text></Col>
                        </Row>
                    </Card>
                </Col>
                <Col style={{ marginTop: "15px", padding: "5px" }} xl={12} xs={24} >
                    <Card style={{
                        boxShadow: "0 .5rem 1.2rem rgba(189,197,209,.2)",
                        border: "1px solid #e7eaf3",
                        borderRadius: "0.5em"
                    }} size="small" title={<Title level={5}>More Informations</Title>}>
                        <Row>
                            <Col xl={10} xs={24}><Text strong>Name Tag:</Text></Col>
                            <Col xl={14} xs={24}><Text ></Text></Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Divider style={{ marginTop: "20px" }} />

            <Card style={{
                boxShadow: "0 .5rem 1.2rem rgba(189,197,209,.2)",
                border: "1px solid #e7eaf3",
                borderRadius: "0.5em"
            }}>
                <Tabs defaultActiveKey="1" items={items} />
            </Card>

        </>
    )

}
import { useParams } from "react-router-dom"
import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal } from 'antd';
import {
    SearchOutlined, QrcodeOutlined, FileTextOutlined, UserOutlined
} from '@ant-design/icons';
import { isMobile } from 'react-device-detect'
import type { TabsProps } from 'antd';
import QRCode from 'qrcode.react';
import { useEffect, useMemo, useState } from "react";
import { fetchAddress } from "../../services/address";
import { AddressVO, MasterNodeVO, SuperNodeVO } from "../../services";
import EtherAmount, { ETHER_Combine } from "../../components/EtherAmount";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import SuperNode from "./SuperNode";
import MasterNode from "./MasterNode";

const { Title, Text, Paragraph, Link } = Typography;

export default function () {

    const address = useParams().address?.toLocaleLowerCase();
    const items: TabsProps['items'] = useMemo(() => {
        return [
            
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
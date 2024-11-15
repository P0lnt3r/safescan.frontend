import { NodeRegisterActionVO } from "../../services"
import { Typography, Tag, Input, Tooltip, Row, Col, Divider, Badge, Card, Space } from 'antd';
import {
    ApartmentOutlined,
    UserOutlined,
    SolutionOutlined,
    HourglassTwoTone,
    ClusterOutlined
} from '@ant-design/icons';
import { useMemo } from "react";
import EtherAmount from "../../components/EtherAmount";
import { Link as RouterLink } from 'react-router-dom';
import { isMobile } from "react-device-detect";

const { Text, Paragraph, Link } = Typography;

export default ({ nodeRegisterActions }: {
    nodeRegisterActions: NodeRegisterActionVO[]
}) => {
    const Render = (nodeRegisterAction: NodeRegisterActionVO) => {
        const { nodeType, registerType, address, operator, amount, lockId, lockDays } = nodeRegisterAction;
        const Ribbon = useMemo(() => {
            if ("MN" == nodeType && "Register" == registerType) {
                return "New Masternode";
            }
            if ("SN" == nodeType && "Register" == registerType) {
                return "New Supernode";
            }
            return undefined;
        }, [nodeType, registerType]);
        const OperatorLabel = registerType == "Register" ? "Creator" : "Founder";
        const Title =
            ("MN" == nodeType ? "Masternode" : "Supernode")
            + " " + registerType;

        return <Row key={"noderegisteraction:" + nodeRegisterAction.transactionHash + nodeRegisterAction.eventLogIndex}>
            <Col span={24} style={{marginTop:"2%"}}>
                <Badge.Ribbon style={(Ribbon) ? {} : { "display": "none" }} text={Ribbon} color={nodeType == "SN" ? "purple" : ""}>
                    <Card title={<Text strong>{Title}</Text>} size="small">
                        <Row>
                            <Col xl={4} xs={24}>
                                {
                                    "MN" == nodeType && <ApartmentOutlined />
                                }
                                {
                                    "SN" == nodeType && <ClusterOutlined />
                                }
                                <Text style={{ marginLeft: "5px" }}>Address</Text>
                            </Col>
                            <Col xl={18} xs={24}>
                                <RouterLink to={`/address/${address}`}>
                                    <Link ellipsis>{address}</Link>
                                </RouterLink>
                            </Col>
                            <Col xl={4} xs={24}>
                                <UserOutlined />
                                <Text style={{ marginLeft: "5px" }}>{OperatorLabel}</Text>
                            </Col>
                            <Col xl={18} xs={24}>
                                <RouterLink to={`/address/${operator}`}>
                                    <Link ellipsis>{operator}</Link>
                                </RouterLink>
                            </Col>
                            <Col xl={4} xs={24}>
                                <SolutionOutlined />
                                <Text style={{ marginLeft: "5px" }}>Stake</Text>
                            </Col>
                            <Col xl={18} xs={24}>
                                <Text strong type="secondary" style={{ marginRight: "5px" }}>[ID:{lockId}]</Text>
                                <EtherAmount raw={amount} fix={18} />
                                <Text style={{ marginLeft: "15px" }}>
                                    (
                                    <HourglassTwoTone />
                                    {lockDays} Days
                                    )
                                </Text>
                            </Col>
                        </Row>
                    </Card>
                </Badge.Ribbon>
            </Col>

        </Row>

    }
    return <>
        {
            nodeRegisterActions.map(Render)
        }
    </>
}
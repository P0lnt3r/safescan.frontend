import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal, Descriptions, Badge } from 'antd';
import { IncentivePlanVO, MasterNodeVO, SuperMasterNodeVO } from '../../services';
import { Link as RouterLink } from 'react-router-dom';
import EtherAmount from '../../components/EtherAmount';
import { Pie } from '@ant-design/plots';
import IncentivePlanPie from '../../components/IncentivePlanPie';

const { Title, Text, Paragraph, Link } = Typography;

export default ( masterNode : MasterNodeVO ) => {
    const incentivePlan = masterNode.incentivePlan;
    return (<>
        <Row>
            <Col style={{ marginTop: "10px", padding: "5px" }} span={24} >
                <Card size="small">
                    <Descriptions title="Master Node" layout="vertical" bordered>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>ID</Text>}>
                            {masterNode.id}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Amount</Text>}>
                            <Text strong>
                                <EtherAmount raw={masterNode.amount} fix={18}></EtherAmount>
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>IP</Text>}>
                            {masterNode.ip}
                        </Descriptions.Item>

                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Update Height</Text>}>
                            {masterNode.updateHeight}
                        </Descriptions.Item>
                       
                        <Descriptions.Item span={2} label={<Text strong style={{ color: "#6c757e" }} >Description</Text>}>
                            {masterNode.description}
                        </Descriptions.Item>

                        <Descriptions.Item span={2} label={<Text strong style={{ color: "#6c757e" }}>Creator</Text>}>
                            <RouterLink to={`/address/${masterNode.creator.toLowerCase()}`}>
                                <Link>{masterNode.creator.toLowerCase()}</Link>
                            </RouterLink>
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Create Height</Text>}>
                            {masterNode.createHeight}
                        </Descriptions.Item>
                        

                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >ENODE</Text>}>
                            {masterNode.enode}
                        </Descriptions.Item>

                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >IncentivePlan</Text>}>
                            <Row>
                                <Col xs={24} xl={8}>
                                    <div style={{ height: "200px" }}>
                                        <IncentivePlanPie {... incentivePlan} />
                                    </div>
                                </Col>
                            </Row>
                        </Descriptions.Item>

                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >Founders ({masterNode.founders.length})</Text>}>
                            {
                                masterNode.founders.map(({ lockID, addr, amount, height }) => {
                                    return (<>
                                        <Row key={lockID}>
                                            <Divider></Divider>
                                            <Col xs={24} xl={6}>
                                                <RouterLink to={`/address/${addr.toLowerCase()}`}>
                                                    <Link>{addr.toLowerCase()}</Link>
                                                </RouterLink>
                                            </Col>
                                            <Col xs={24} xl={6}>
                                                <Text type="secondary">[LockID:{lockID}]</Text>
                                                <Text strong style={{ float: "right" }}>
                                                    Amount:{<EtherAmount raw={amount} fix={18} />}
                                                </Text>
                                            </Col>
                                            <Divider ></Divider>
                                        </Row>
                                    </>)
                                })
                            }
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>
        </Row>
    </>)

}
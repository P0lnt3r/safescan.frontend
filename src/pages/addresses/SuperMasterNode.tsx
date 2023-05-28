import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal, Descriptions, Badge } from 'antd';
import { IncentivePlanVO, SuperMasterNodeVO } from '../../services';
import { Link as RouterLink } from 'react-router-dom';
import EtherAmount from '../../components/EtherAmount';
import { Pie } from '@ant-design/plots';
import IncentivePlanPie from '../../components/IncentivePlanPie';

const { Title, Text, Paragraph, Link } = Typography;

export default (superMasterNode: SuperMasterNodeVO) => {

    const incentivePlan = superMasterNode.incentivePlan;
    const data = [
        {
            type: 'Creator',
            value: 27,
        },
        {
            type: 'Partner',
            value: 25,
        },
        {
            type: 'Voter',
            value: 18,
        },
    ];
    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.75,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name}\n{percentage}',
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
    };

    return (<>
        <Row>
            <Col style={{ marginTop: "10px", padding: "5px" }} span={24} >
                <Card size="small">
                    <Descriptions title="Super Master Node" layout="vertical" bordered>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>ID</Text>}>
                            {superMasterNode.id}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Amount</Text>}>
                            <Text strong>
                                <EtherAmount raw={superMasterNode.amount} fix={18}></EtherAmount>
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>IP</Text>}>
                            {superMasterNode.ip}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Name</Text>}>
                            {superMasterNode.name}
                        </Descriptions.Item>
                        <Descriptions.Item span={2} label={<Text strong style={{ color: "#6c757e" }} >Description</Text>}>
                            {superMasterNode.description}
                        </Descriptions.Item>

                        <Descriptions.Item span={2} label={<Text strong style={{ color: "#6c757e" }}>Creator</Text>}>
                            <RouterLink to={`/address/${superMasterNode.creator.toLowerCase()}`}>
                                <Link>{superMasterNode.creator.toLowerCase()}</Link>
                            </RouterLink>
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Create Height</Text>}>
                            {superMasterNode.createHeight}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Total Voter Amount</Text>}>
                            {superMasterNode.totalVoterAmount}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Total Vote Num</Text>}>
                            {superMasterNode.totalVoteNum}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Update Height</Text>}>
                            {superMasterNode.updateHeight}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >ENODE</Text>}>
                            {superMasterNode.enode}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >Public Key</Text>}>
                            {superMasterNode.pubkey}
                        </Descriptions.Item>

                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >IncentivePlan</Text>}>
                            <Row>
                                <Col xs={24} xl={6}>
                                    <div style={{ height: "150px" }}>
                                        <IncentivePlanPie {... incentivePlan} />
                                    </div>
                                </Col>
                            </Row>
                        </Descriptions.Item>

                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >Founders ({superMasterNode.founders.length})</Text>}>
                            {
                                superMasterNode.founders.map(({ lockID, addr, amount, height }) => {
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

                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >Voters ({superMasterNode.voters.length})</Text>}>
                            {
                                superMasterNode.voters.map(({ lockID, addr, amount, height }) => {
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
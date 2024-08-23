import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal, Descriptions, Badge } from 'antd';
import { MemberInfoVO, SuperNodeVO, SupernodeVoterNumVO } from '../../services';
import { Link as RouterLink } from 'react-router-dom';
import EtherAmount from '../../components/EtherAmount';
import IncentivePlanPie from '../../components/IncentivePlanPie';
import {
    ClusterOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { useBlockNumber } from '../../state/application/hooks';
import Table, { ColumnsType } from 'antd/lib/table';
import { RenderNodeState } from './Utils';
import { useEffect, useState } from 'react';
import { fetchSNVoters } from '../../services/node';
import Address from '../../components/Address';

const { Title, Text, Paragraph, Link } = Typography;

export default (superMasterNode: SuperNodeVO) => {

    const { id, description, creator, enode, incentivePlan, state, lastRewardHeight, totalAmount, totalVoteNum, totalVoteAmount, founders, addr, name } = superMasterNode;
    const nodeState = state;
    const blockNumber = useBlockNumber();
    const [loadingVoters, setLoadingVoters] = useState(false);
    const [voters, setVoters] = useState<SupernodeVoterNumVO[]>();

    useEffect(() => {
        if (addr) {
            setLoadingVoters(true);
            fetchSNVoters(addr).then(data => {
                setLoadingVoters(false);
                setVoters(data);
            });
        }
    }, [addr]);

    const columns: ColumnsType<MemberInfoVO> = [
        {
            title: 'Address',
            dataIndex: 'addr',
            key: 'addr',
            render: (addr) => <Address address={addr.toLowerCase()} style={{ forceTag: false, ellipsis: false, hasLink: true, noTip: true }} />
        },
        {
            title: 'Lock Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => <Text strong><EtherAmount raw={amount} fix={18} /></Text>
        },
        {
            title: 'Account Record ID',
            dataIndex: 'lockID',
            key: 'lockID',
            render: (lockID) => <RouterLink to={`/assets/accountRecords/${lockID}`}>
                <Link strong>{lockID}</Link>
            </RouterLink>
        }
    ]

    const votersColumns: ColumnsType<SupernodeVoterNumVO> = [
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (addr, vo) => {
                const { addressPropVO } = vo;
                return <Address propVO={addressPropVO} address={addr.toLowerCase()} style={{ ellipsis: false, hasLink: true , forceTag:true }} />
            }
        },
        {
            title: 'Vote Amount',
            dataIndex: 'voteNum',
            key: 'voteNum',
            render: (amount) => <Text strong><EtherAmount raw={amount} ignoreLabel /></Text>
        }
    ]

    return (<>
        <Row>
            <Col style={{ marginTop: "10px", padding: "5px" }} span={24} >
                <Card size="default" title={<Text strong><ClusterOutlined style={{ marginRight: "5px" }} />SuperNode</Text>}>
                    <Row>
                        <Col xl={12}>
                            <Row style={{ marginTop: "10px" }}>
                                <Col xl={6} xs={24}><Text strong>ID:</Text></Col>
                                <Col xl={18} xs={24}>
                                    <Text strong>{id}</Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col xl={6} xs={24}><Text strong>State:</Text></Col>
                                <Col xl={18} xs={24}>
                                    {RenderNodeState(nodeState)}
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col xl={6} xs={24}><Text strong>Name:</Text></Col>
                                <Col xl={18} xs={24}>
                                    <Text>{name}</Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col xl={6} xs={24}><Text strong>Creator:</Text></Col>
                                <Col xl={18} xs={24}>
                                    <Address address={creator} style={{ ellipsis: false, hasLink: true }}></Address>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col xl={6} xs={24}><Text strong>Address:</Text></Col>
                                <Col xl={18} xs={24}>
                                    <Address address={addr} style={{ ellipsis: false, hasLink: true }}></Address>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col xl={6} xs={24}><Text strong>Amount:</Text></Col>
                                <Col xl={18} xs={24}>
                                    <Text strong><EtherAmount raw={totalAmount} fix={18}></EtherAmount></Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col xl={6} xs={24}><Text strong>Vote Obtained:</Text></Col>
                                <Col xl={18} xs={24}>
                                    <Text><EtherAmount raw={totalVoteNum} ignoreLabel></EtherAmount></Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col xl={6} xs={24}><Text strong>Vote Amount:</Text></Col>
                                <Col xl={18} xs={24}>
                                    <Text><EtherAmount raw={totalVoteAmount}></EtherAmount></Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col xl={6} xs={24}><Text strong>Latest Reward Height:</Text></Col>
                                <Col xl={18} xs={24}>
                                    <Text>{lastRewardHeight}</Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col xl={12} style={{ marginTop: "10px" }}>
                            <Text strong>Incentive Plan</Text>
                            <div style={{ height: "125px" }}>
                                <IncentivePlanPie {...incentivePlan} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "10px" }}>
                        <Col xl={3} xs={24}><Text strong>Enode:</Text></Col>
                        <Col xl={16} xs={24}>
                            <Paragraph copyable>
                                {enode}
                            </Paragraph>
                        </Col>
                    </Row>
                    <Divider />
                    <Row style={{ marginTop: "10px" }}>
                        <Col xl={3} xs={24}><Text strong>Description:</Text></Col>
                        <Col xl={16} xs={24}>
                            <Text type='secondary'>{description}</Text>
                        </Col>
                    </Row>
                    <Divider />

                    <Descriptions style={{ marginTop: "20px" }} layout="vertical" bordered>
                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >
                            <TeamOutlined style={{ marginRight: "5px" }} />Founders ({founders.length})</Text>}>
                            <Table style={{ marginTop: "10px", marginBottom: "30px" }} columns={columns} dataSource={founders} pagination={false} />
                        </Descriptions.Item>
                        <Descriptions.Item span={2} label={<Text strong style={{ color: "#6c757e" }} >
                            <TeamOutlined style={{ marginRight: "5px" }} />Voters ({voters?.length})</Text>}>
                            <Table loading={loadingVoters} style={{ marginTop: "10px", marginBottom: "30px" }} columns={votersColumns} dataSource={voters} pagination={{ pageSize: 10 }} />
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>
        </Row>

    </>)

}
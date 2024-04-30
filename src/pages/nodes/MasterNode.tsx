import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal, Descriptions, Badge } from 'antd';
import { IncentivePlanVO, MasterNodeVO, MemberInfoVO, SuperNodeVO } from '../../services';
import { Link as RouterLink } from 'react-router-dom';
import EtherAmount from '../../components/EtherAmount';
import { Pie } from '@ant-design/plots';
import IncentivePlanPie from '../../components/IncentivePlanPie';
import {
    ApartmentOutlined,
    UserOutlined,
    SolutionOutlined,
    HourglassTwoTone,
    ClusterOutlined,
    LockOutlined,
    UnlockOutlined,
} from '@ant-design/icons';
import { PresetStatusColorType } from 'antd/es/_util/colors';
import { isMobile } from 'react-device-detect';
import Address from '../../components/Address';
import { useBlockNumber } from '../../state/application/hooks';
import Table, { ColumnsType } from 'antd/lib/table';

const { Title, Text, Paragraph, Link } = Typography;

export default (masterNode: MasterNodeVO) => {

    const { id, description, creator, enode, incentivePlan, state, lastRewardHeight, totalAmount, founders, addr } = masterNode;
    const nodeState = state;
    const nodeAddress = addr.toLowerCase();
    const blockNumber = useBlockNumber();

    function State(state: number) {
        let _state: {
            status: PresetStatusColorType,
            text: string
        } = {
            status: "default",
            text: "UNKNOWN"
        }
        if (state == 0) {
            _state.status = "success";
            _state.text = "INITIALIZE";
        }
        if (state == 1) {
            _state.status = "processing";
            _state.text = "ENABLED";
        }
        if (state == 2) {
            _state.status = "error";
            _state.text = "ERROR";
        }
        return (<>
            <Badge {..._state} />
        </>)
    }

    const columns: ColumnsType<MemberInfoVO> = [
        {
            title: 'Account Record ID',
            dataIndex: 'lockID',
            key: 'lockID',
            render: (lockID) => <RouterLink to={`/assets/accountRecords/${lockID}`}>
                <Link strong>{lockID}</Link>
            </RouterLink>
        },
        {
            title: 'Owner',
            dataIndex: 'addr',
            key: 'addr',
            render: (addr) => <Address address={addr.toLowerCase()} style={{ forceTag: false, ellipsis: false, hasLink: true, noTip: true }} />
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => <Text strong><EtherAmount raw={amount} fix={18} /></Text>
        }
    ]

    return (<>
        <Row>
            <Col style={{ marginTop: "10px", padding: "5px" }} span={24} >
                <Card size="default" title={<Text strong><ApartmentOutlined style={{ marginRight: "5px" }} />Masternode</Text>}>
                    <Row>
                        <Col xl={12}>
                            <Row style={{ marginTop: "15px" }}>
                                <Col span={8}><Text strong>ID:</Text></Col>
                                <Col span={16}>
                                    <Text>{id}</Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "15px" }}>
                                <Col span={8}><Text strong>State:</Text></Col>
                                <Col span={16}>
                                    {State(nodeState)}
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "15px" }}>
                                <Col xl={8} xs={24}><Text strong>Creator:</Text></Col>
                                <Col xl={16} xs={24}>
                                    <Address address={creator} style={{ ellipsis: false, hasLink: true }}></Address>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "15px" }}>
                                <Col span={8}><Text strong>Amount:</Text></Col>
                                <Col span={16}>
                                    <Text strong><EtherAmount raw={totalAmount} fix={18}></EtherAmount></Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "15px" }}>
                                <Col span={8}><Text strong>Latest Reward Height:</Text></Col>
                                <Col span={16}>
                                    <Text>{lastRewardHeight}</Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col xl={12} xs={24} style={{ marginTop: "10px" }}>
                            <Text strong>Incentive Plan</Text>
                            <div style={{ height: "150px" }}>
                                <IncentivePlanPie {...incentivePlan} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={4} xs={24}><Text strong>Enode:</Text></Col>
                        <Col xl={18} xs={24}>
                            <Paragraph copyable>
                                {enode}
                            </Paragraph>
                        </Col>
                    </Row>
                    <Divider />

                    <Row style={{ marginTop: "10px" }}>
                        <Col xl={4} xs={24}><Text strong>Description:</Text></Col>
                        <Col xl={18} xs={24}>
                            <Text type='secondary'>{description}</Text>
                        </Col>
                    </Row>
                    <Divider />

                    <Row>
                        <Col span={24}>
                            <Descriptions style={{ marginTop: "20px", maxWidth: "100%" }} layout="vertical" bordered>
                                <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >Founders ({founders.length})</Text>}>
                                    <Table style={{ marginTop: "10px", marginBottom: "30px" }} columns={columns} dataSource={founders} pagination={false} />
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </>)

}
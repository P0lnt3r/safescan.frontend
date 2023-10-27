import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal, Descriptions, Badge } from 'antd';
import { IncentivePlanVO, MasterNodeVO, SuperNodeVO } from '../../services';
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

const { Title, Text, Paragraph, Link } = Typography;

export default (masterNode: MasterNodeVO) => {

    const { id, ip, description, creator, enode, incentivePlan, stateInfo, lastRewardHeight, amount, founders, addr } = masterNode;
    const nodeState = stateInfo.state;
    const nodeAddress = addr.toLowerCase();
    const blockNumber = useBlockNumber();

    function State(state: number) {
        let _state: {
            status: PresetStatusColorType,
            text: string
        } = {
            status: "default",
            text: "default"
        }
        if (state == 1) {
            _state.status = "processing";
            _state.text = "ENABLED";
        }
        return (<>
            <Badge {..._state} />
        </>)
    }

    return (<>
        <Row>
            <Col style={{ marginTop: "10px", padding: "5px" }} span={24} >
                <Card size="default" title={<Text strong><ApartmentOutlined style={{ marginRight: "5px" }} />MasterNode</Text>}>
                    <Row>
                        <Col xl={12}>
                            <Row style={{ marginTop: "10px" }}>
                                <Col span={8}><Text strong>ID:</Text></Col>
                                <Col span={16}>
                                    <Text>{id}</Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col span={8}><Text strong>State:</Text></Col>
                                <Col span={16}>
                                    {State(nodeState)}
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col span={8}><Text strong>IP:</Text></Col>
                                <Col span={16}>
                                    <Text>{ip}</Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col span={8}><Text strong>Description:</Text></Col>
                                <Col span={16}>
                                    <Text>{description}</Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col span={8}><Text strong>Amount:</Text></Col>
                                <Col span={16}>
                                    <Text><EtherAmount raw={amount} fix={18}></EtherAmount></Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col span={8}><Text strong>Reward Height:</Text></Col>
                                <Col span={16}>
                                    <Text>{lastRewardHeight}</Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col xl={8} xs={24}><Text strong>Creator:</Text></Col>
                                <Col xl={16} xs={24}>
                                    <Address address={creator} style={{ ellipsis: false, hasLink: true }}></Address>
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
                    <Row style={{ marginTop: "10px" }}>
                        <Col xl={4} xs={24}><Text strong>Enode:</Text></Col>
                        <Col xl={18} xs={24}>
                            <Paragraph copyable>
                                {enode}
                            </Paragraph>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Descriptions style={{ marginTop: "20px", maxWidth: "100%" }} layout="vertical" bordered>
                                <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >Founders ({founders.length})</Text>}>
                                    {
                                        founders.map(({ lockID, addr, amount, height, lockDay, unlockHeight, unfreezeHeight, releaseHeight }) => {
                                            const hasLock = lockDay != undefined && lockDay > 0;
                                            const isLocked = hasLock && unlockHeight && unlockHeight > blockNumber;
                                            const isFreezed = (unfreezeHeight && unfreezeHeight > blockNumber)
                                                || (releaseHeight && releaseHeight > blockNumber)
                                            return (<>
                                                <Row key={lockID}>
                                                    <Divider></Divider>
                                                    <Col xs={24} xl={4}>
                                                        {
                                                            hasLock && isLocked && <LockOutlined />
                                                        }
                                                        {
                                                            hasLock && !isLocked && <UnlockOutlined />
                                                        }
                                                        {
                                                            isFreezed && <HourglassTwoTone />
                                                        }
                                                        <Text type="secondary">[ID:{lockID}]</Text>
                                                        <Text strong style={{ float: "right" }}>
                                                            {
                                                                isFreezed && <Text strong style={{ color: "rgb(6, 58, 156)" }}>
                                                                    <EtherAmount raw={amount} fix={18} />
                                                                </Text>
                                                            }
                                                            {
                                                                !isFreezed && isLocked && <Text strong type="secondary" >
                                                                    <EtherAmount raw={amount} fix={18} />
                                                                </Text>
                                                            }
                                                            {
                                                                !isFreezed && !isLocked && <Text strong type="success" >
                                                                    <EtherAmount raw={amount} fix={18} />
                                                                </Text>
                                                            }
                                                        </Text>
                                                    </Col>
                                                    <Col xs={0} xl={2}>

                                                    </Col>
                                                    <Col xs={24} xl={10}>
                                                        {
                                                            addr.toLowerCase() == nodeAddress && <>
                                                                <Tooltip title={addr.toLowerCase()}>
                                                                    <Text code style={{ color: "orange" }}>SELF</Text>
                                                                </Tooltip>
                                                            </>
                                                        }
                                                        {
                                                            addr.toLowerCase() != nodeAddress && <>
                                                                {
                                                                    !isMobile && <Address address={addr.toLowerCase()} />
                                                                }
                                                                {
                                                                    isMobile && <>

                                                                    </>
                                                                }
                                                            </>
                                                        }
                                                    </Col>
                                                    <Divider />
                                                </Row>
                                            </>)
                                        })
                                    }
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </>)

}
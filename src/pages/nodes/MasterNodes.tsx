
import { Card, Typography, Row, Col, Divider, TabsProps, Tabs } from 'antd';
import MasternodeList from './MasternodeList';
import MasternodeHistoryChart from './MasternodeHistoryChart';
import MasternodeStatePie from './MasternodeStatePie';
import NodeRegisters from './NodeRegisters';
const { Title, Text } = Typography;

export default () => {

    return (<>
        <Title level={3}>Safe4 Network Masternodes</Title>
        <Row>
            <Col span={12}>
                <MasternodeHistoryChart />
            </Col>
            <Col offset={2} span={10}>
                <MasternodeStatePie />
            </Col>
        </Row>
        <Divider style={{ margin: '40px 0px' }} />
        <MasternodeList />
        <Divider style={{ margin: '20px 0px' }} />
        <Title level={4}>Latest Masternodes Registers</Title>
        <NodeRegisters type='masternode' />
    </>)


}
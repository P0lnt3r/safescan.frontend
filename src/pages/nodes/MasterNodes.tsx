
import { Card, Typography, Row, Col,Divider, TabsProps, Tabs } from 'antd';
import MasternodesRegisters from './MasternodesRegisters';
import MasternodeList from './MasternodeList';
import MasternodeHistoryChart from './MasternodeHistoryChart';
import MasternodeStatePie from './MasternodeStatePie';
const { Title, Text } = Typography;

export default () => {

    const items: TabsProps['items'] = [
        {
            key: 'registers',
            label: 'Registers',
            children: <MasternodesRegisters />,
        },
        {
            key: 'stateUpdateEvents',
            label: 'State Update Events',
            children: '[State Update Events:<Table:List>]',
        },
    ];

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
        <Title level={4}>Masternode Actions</Title>
        <Card>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>
    </>)


}
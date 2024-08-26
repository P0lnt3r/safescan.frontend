
import { Typography, Row, Col , TabsProps, Divider, Card, Tabs } from 'antd';
import SupernodesVoteActions from './SupernodesVoteActions';
import SuperNodeList from './SuperNodeList';
import SupernodeHistoryChart from './SupernodeHistoryChart';
import SupernodeStatePie from './SupernodeStatePie';
import NodeRegisters from './NodeRegisters';

const { Title } = Typography;


export default () => {

    const items: TabsProps['items'] = [
        {
            key: 'registers',
            label: 'Registers',
            children: <NodeRegisters type='supernode'></NodeRegisters>,
        },
        {
            key: 'votes',
            label: 'Votes',
            children: <SupernodesVoteActions></SupernodesVoteActions>,
        }
    ];

    return (<>
        <Title level={3}>Safe4 Network Supernodes</Title>
        <Row>
            <Col span={12}>
                <SupernodeHistoryChart />
            </Col>
            <Col offset={2} span={10}>
                <SupernodeStatePie />
            </Col>
        </Row>
        <Divider style={{ margin: '40px 0px' }} />
        <SuperNodeList />

        <Divider style={{ margin: '20px 0px' }} />
        <Title level={5}>Latest Supernodes Registers & Votes</Title>
        <Card>
            <Tabs items={items} />
        </Card>

    </>)


}
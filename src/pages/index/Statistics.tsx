
import { Button, Col, Row, Card, Space, Typography, Statistic, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import LatestBlockTransactions from './LatestBlockTransactions';
import { useBlockNumber, useStatistic } from '../../state/application/hooks';
import TransactionsChart from './TransactionsChart';
import { isMobile } from 'react-device-detect';
import {
    UserOutlined,
    FileTextOutlined,
    SafetyOutlined,
    ApartmentOutlined
} from '@ant-design/icons';
const { Title, Text, Link } = Typography;

export default () => {
    const blockNumber = useBlockNumber();
    const statistic = useStatistic();
    
    return (
        <Card>
            <Row>
                <Col xl={6} xs={24} style={{ padding: "1%" }}>
                    <Statistic title="Latest Block Number" value={blockNumber} />
                    <Divider />
                    <Statistic title="Circulation Supply of SAFE" value={21595638.60} />
                    <Col xl={0} xs={24}>
                        <Divider />
                    </Col>
                </Col>
                <Col xl={8} xs={24} style={{ padding: "1%" }}>
                    <Row>
                        <Col span={12}>
                            <Statistic title="Addresses" value={statistic?.totalAddress} prefix={<UserOutlined />} />
                        </Col>
                        <Col span={12}>
                            <Statistic style={{ float: "right" }} valueStyle={{ float: "right" }} title={
                                <Text style={{ float: "right" }} type="secondary">Contracts</Text>}
                                value={statistic?.totalContract} suffix={<FileTextOutlined />}
                            />
                        </Col>
                    </Row>
                    <Divider />
                    <Row>
                        <Col span={12}>
                            <Statistic title="Transactions" value={statistic?.totalTxns} prefix={<SafetyOutlined />} />
                        </Col>
                        <Col span={12}>
                            <Statistic style={{ float: "right" }} valueStyle={{ float: "right" }} title={
                                <Text style={{ float: "right" }} type="secondary">Active Masternodes</Text>}
                                value={9999} suffix={<ApartmentOutlined />}
                            />
                        </Col>
                    </Row>
                    <Col xl={0} xs={24}>
                        <Divider />
                    </Col>
                </Col>
                <Col xl={10} xs={24} style={{ padding: "1%" }}>
                    <TransactionsChart></TransactionsChart>
                </Col>
            </Row>
        </Card>
    )

}
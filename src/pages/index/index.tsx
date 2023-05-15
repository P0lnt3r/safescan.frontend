
import { Button, Col, Row, Card, Space, Typography, Statistic, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import LatestBlockTransactions from './LatestBlockTransactions';
import { useBlockNumber } from '../../state/application/hooks';
import TransactionsChart from './TransactionsChart';
import { isMobile } from 'react-device-detect';

const { Title, Text, Link } = Typography;

export default function () {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const blockNumber = useBlockNumber();

    return (
        <>
            <div style={{ padding: '1%' }}>
                <Card>
                    <Row>
                        <Col xl={6} xs={24} style={{ padding: "1%" }}>
                            <Statistic title="Latest Block Number" value={blockNumber} />
                            <Divider />
                            <Statistic title="Circulation Supply of SAFE" value={1121211222893} />
                            <Col xl={0} xs={24}>
                                <Divider />
                            </Col>
                        </Col>
                        <Col xl={10} xs={24} style={{ padding: "1%" }}>
                            <Row>
                                <Col span={12}>
                                    <Statistic title="Total TXNS" value={112893} />
                                </Col>
                                <Col span={12}>
                                    <Statistic style={{ float: "right" }} title="Active Masternodes" value={112893} />
                                </Col>
                            </Row>
                            <Divider />
                            <Row>
                                <Col span={12}>
                                    <Statistic title="Contracts" value={112893} />
                                </Col>
                                <Col span={12}>
                                    <Statistic style={{ float: "right" }} title="Active Masternodes" value={112893} />
                                </Col>
                            </Row>
                            <Col xl={0} xs={24}>
                                <Divider />
                            </Col>
                        </Col>
                        <Col xl={8} xs={24} style={{ padding: "1%" }}>
                            <TransactionsChart></TransactionsChart>
                        </Col>
                    </Row>
                </Card>
                <p>
                </p>
            </div>
            <LatestBlockTransactions />
        </>
    )
}
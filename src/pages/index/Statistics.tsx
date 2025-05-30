
import { Button, Col, Row, Card, Space, Typography, Statistic, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import LatestBlockTransactions from './LatestBlockTransactions';
import { useBlockNumber, useDBStoredBlockNumber, useStatistic } from '../../state/application/hooks';
import TransactionsChart from './TransactionsChart';
import { isMobile } from 'react-device-detect';
import {
    UserOutlined,
    FileTextOutlined,
    SafetyOutlined,
    ApartmentOutlined
} from '@ant-design/icons';
import { CurrencyAmount } from '@uniswap/sdk';
import { useMemo } from 'react';

const { Title, Text, Link } = Typography;


export default () => {
    const blockNumber = useBlockNumber();
    const dbStoreBlockNumber = useDBStoredBlockNumber();
    const statistic = useStatistic();
    const navigate = useNavigate();

    const circulationSupply = useMemo(() => {
        const circulation = statistic?.circulation;
        return circulation ? CurrencyAmount.ether(circulation).toFixed(2)
            : "0"
    }, [statistic]);

    return (
        <Card>
            <Row>
                <Col xl={6} xs={24} style={{ padding: "1%" }}>
                    <Statistic title="Latest Block Number" value={`${blockNumber}`} />
                    <Divider />
                    <Link onClick={() => navigate("charts/circulation")}>
                        <Statistic title="Circulation Supply of SAFE" value={circulationSupply} />
                    </Link>
                    <Col xl={0} xs={24}>
                        <Divider />
                    </Col>
                </Col>
                <Col xl={8} xs={24} style={{ padding: "1%" }}>
                    <Row>
                        <Col span={12}>
                            <Link onClick={() => {
                                navigate("/charts/addresses")
                            }}>
                                <Statistic title="Addresses" value={statistic?.totalAddress} prefix={<UserOutlined />} />
                            </Link>
                        </Col>
                        <Col span={12}>
                            <Link onClick={() => {
                                navigate("/contracts")
                            }}>
                                <Statistic style={{ float: "right" }} valueStyle={{ float: "right" }} title={
                                    <Text style={{ float: "right" }} type="secondary">Contracts</Text>}
                                    value={statistic?.totalContract} suffix={<FileTextOutlined />}
                                />
                            </Link>
                        </Col>
                    </Row>
                    <Divider />
                    <Row>
                        <Col span={12}>
                            <Link onClick={() => {
                                navigate("/charts/txns")
                            }}>
                                <Statistic title="Transactions" value={statistic?.totalTxns} prefix={<SafetyOutlined />} />
                            </Link>
                        </Col>
                        <Col span={12}>
                            <Link onClick={() => {
                                navigate("/nodes/masternodes")
                            }}>
                                <Statistic style={{ float: "right" }} valueStyle={{ float: "right" }} title={
                                    <Text style={{ float: "right" }} type="secondary">Active Masternodes</Text>}
                                    value={statistic?.totalMasterNodes} suffix={<ApartmentOutlined />}
                                />
                            </Link>
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
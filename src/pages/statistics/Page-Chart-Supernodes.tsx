
import { Card, Typography, Input, Button, Tooltip, Row, Col, Divider } from 'antd';
import {
    ArrowLeftOutlined,
    HighlightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { TEN } from '@uniswap/sdk/dist/constants';
import { useEffect, useState } from 'react';
import { fetchAll } from '../../services/chart';
import ChartTxns, { TxnsChartType } from './Chart-Txns';
import ChartDailyGasUseds, { GasUsedsChartType } from './Chart-DailyGasUseds';
import { JSBI } from '@uniswap/sdk';
import { ETHER, GWEI } from '../../components/EtherAmount';
import ChartAverageBlockTimes, { AverageBlockTimesChartType } from './Chart-AverageBlockTimes';
import ChartMasternodes, { MasternodesChartType } from './Chart-Masternodes';
import ChartSupernodes, { SupernodesChartType } from './Chart-Supernodes';
const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [supernodesChartData, setSupernodesChartData] = useState<SupernodesChartType[]>([]);
    
    useEffect(() => {
        doFetchCharts();
    }, []);

    function doFetchCharts() {
        setLoading(true);
        fetchAll().then(data => {
            setLoading(false);
            const _supernodesChartData: SupernodesChartType[] = [];
            data.forEach(timestampStatistic => {
                const { date , totalSuperNodes, totalSupernodeRewards } = timestampStatistic;
                const supernodesRewards = JSBI.subtract(JSBI.BigInt(totalSupernodeRewards),
                    JSBI.BigInt(_supernodesChartData.length > 0 ? data[_supernodesChartData.length - 1].totalSupernodeRewards : "0")
                );
                _supernodesChartData.push({ date, count: totalSuperNodes, rewards: Number.parseFloat(ETHER(supernodesRewards, 4)) })
            });
            setSupernodesChartData(_supernodesChartData);
        });
    }

    return <>
        <Row>
            <Text style={{
                cursor: "pointer"
            }} onClick={() => {
                navigate("/charts")
            }}><ArrowLeftOutlined /> Charts & Statistics</Text>
        </Row>
        <br />
        <Row>
            <Title level={3}>Daily Supernodes & Rewards</Title>
        </Row>
        <Divider style={{ marginTop: "15px" }} />
        <Row>
            <Col span={16}>
                <Card loading={loading} title="Daily Supernodes & Rewards">
                    <ChartSupernodes supernodesChartData={supernodesChartData} config={{
                        xAxis: {
                            range: [0, 1],
                        },
                        animation: false,
                        slider: {
                            start: 0,
                            end: 1,
                            trendCfg: {
                                isArea: true,
                            },
                        },
                    }}></ChartSupernodes>
                </Card>
            </Col>
            <Col span={8} style={{ paddingLeft: "20px" }}>
                <Title level={5}>About</Title>
                <Text>
                    The chart highlights the total number of transactions on the BNB Smart Chain blockchain with daily individual breakdown for average difficulty,
                    estimated hash rate, average block time and size, total block and uncle block count and total new address seen.
                </Text>
                <Divider style={{ marginTop: "15px" }} />
                <Text type='secondary'><HighlightOutlined /> Highlight</Text>
                <br />
                <Text>Highest number of <Text strong>16,262,505</Text> transactions on Thursday, November 25, 2021</Text>
                <Divider style={{ marginTop: "15px" }} />
                <Text type='secondary'><HighlightOutlined /> Highlight</Text>
                <br />
                <Text>Highest number of <Text strong>16,262,505</Text> transactions on Thursday, November 25, 2021</Text>
            </Col>
        </Row>
    </>
}
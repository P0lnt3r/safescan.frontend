
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
import ChartBlocksRewards, { BlocksRewardsChartType } from './Chart-BlocksRewards';
import { JSBI } from '@uniswap/sdk';
import { ETHER } from '../../components/EtherAmount';
const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BlocksRewardsChartType[]>([]);

    useEffect(() => {
        doFetchCharts();
    }, []);

    function doFetchCharts() {
        setLoading(true);
        fetchAll().then(data => {
            setLoading(false);
            const _blocksRewardsChartData: BlocksRewardsChartType[] = [];
            data.forEach(timestampStatistic => {
                const { date, blockNumberStart, blockNumberEnd, totalRewards, totalSupernodeRewards, totalMasternodeRewards } = timestampStatistic;
                let blocks = blockNumberEnd - blockNumberStart + 1;
                let rewards;
                if (_blocksRewardsChartData.length == 0) {
                    rewards = JSBI.add(JSBI.BigInt(totalSupernodeRewards), JSBI.BigInt(totalMasternodeRewards));
                } else {
                    rewards = JSBI.subtract(JSBI.BigInt(totalRewards),
                        JSBI.BigInt(data[_blocksRewardsChartData.length - 1].totalRewards)
                    );
                }
                _blocksRewardsChartData.push({ date, blocks, rewards: Number.parseFloat(ETHER(rewards, 4)) })
            });
            setData(_blocksRewardsChartData);
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
            <Title level={3}>Safe4 Blockchain Daily Transactions Chart</Title>
        </Row>
        <Divider style={{ marginTop: "15px" }} />
        <Row>
            <Col span={16}>
                <Card loading={loading} title="Blockchain Daily Transactions Chart">
                    <ChartBlocksRewards blocksRewards={data} config={{
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
                    }}></ChartBlocksRewards>
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

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
import { GWEI } from '../../components/EtherAmount';
const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [gasUsedsChartData, setGasUsedChartData] = useState<GasUsedsChartType[]>([]);

    useEffect(() => {
        doFetchCharts();
    }, []);

    function doFetchCharts() {
        setLoading(true);
        fetchAll().then(data => {
            setLoading(false);
            const _gasUsedChartData: GasUsedsChartType[] = [];
            data.forEach(timestampStatistic => {
                const { date, totalGas, totalGasBurnAmount } = timestampStatistic;
                let gas, burn;
                gas = JSBI.subtract(JSBI.BigInt(totalGas),
                    JSBI.BigInt(_gasUsedChartData.length > 0 ? data[_gasUsedChartData.length - 1].totalGas : "0")
                );
                burn = JSBI.subtract(JSBI.BigInt(totalGasBurnAmount),
                    JSBI.BigInt(_gasUsedChartData.length > 0 ? data[_gasUsedChartData.length - 1].totalGasBurnAmount : "0")
                );
                _gasUsedChartData.push({
                    date, used: Number.parseFloat(GWEI(gas, 6)),
                    burn: Number.parseFloat(GWEI(burn, 6)),
                })
            });
            setGasUsedChartData(_gasUsedChartData);
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
            <Title level={3}>Daily Gas Used & Burn</Title>
        </Row>
        <Divider style={{ marginTop: "15px" }} />
        <Row>
            <Col span={16}>
                <Card loading={loading} title="Daily Gas Used & Burn">
                    <ChartDailyGasUseds gasUseds={gasUsedsChartData} config={{
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
                    }}></ChartDailyGasUseds>
                </Card>
            </Col>
            <Col span={8} style={{ paddingLeft: "20px" }}>
                <Title level={5}>About</Title>
                <Text>
                    The Safe4 Blockchain Daily Gas Used Chart shows the historical total daily gas used of the Safe4 Blockchain network.
                </Text>
                <Divider style={{ marginTop: "15px" }} />

            </Col>
        </Row>
    </>
}

import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps } from 'antd';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Line } from '@ant-design/plots';
import { fetchAll } from '../../services/chart';
import { TimestampStatisticVO } from '../../services';
import { ETHER } from '../../components/EtherAmount';
import ChartCirculation, { CirculationType, parseCirculationChartData } from './Chart-Circulation';
import ChartTxns, { TxnsType } from './Chart-Txns';
const { Title, Text, Link } = Typography;

export default () => {

    const [loading, setLoading] = useState(false);
    const [circulationChartData, setCirculationChartData] = useState<CirculationType[]>([]);
    const [txnsChartData , setTxnsChartData] = useState<TxnsType[]>([]);

    useEffect(() => {
        fetchAllChartsData();
    }, []);

    const fetchAllChartsData = () => {
        setLoading(true);
        fetchAll().then(data => {
            setLoading(false);

            // 解析代币流动性图表数据
            const _circulationChartData: CirculationType[] = [];
            data.forEach(timestampStatistic => {
                const { supply, lock, freeze } = parseCirculationChartData(timestampStatistic)
                _circulationChartData.push(supply, lock, freeze);
            })
            setCirculationChartData(_circulationChartData)

            // 解析交易量图表数据.
            const _txnsChartData: TxnsType[] = [];
            data.forEach(timestampStatistic => {
                const { date, totalTxns } = timestampStatistic;
                const txns = totalTxns - (_txnsChartData.length > 0 ? data[_txnsChartData.length - 1].totalTxns : 0);
                _txnsChartData.push({
                    date, txns
                })
            });
            setTxnsChartData(_txnsChartData);
        })
    }

    return <>
        <Title level={3}>Blockchain Charts</Title>
        <Card loading={loading}>
            <Row>
                <Col xl={12} xs={24} style={{ marginTop: "20px", padding: isMobile ? "0px" : "2px" }}>
                    <Card title={"代币流动性"}>
                        <ChartCirculation data={circulationChartData} />
                    </Card>
                </Col>
                <Col xl={12} xs={24} style={{ marginTop: "20px", padding: isMobile ? "0px" : "2px" }}>
                    <Card title={"交易量"}>
                        <ChartTxns data={txnsChartData} />
                    </Card>
                </Col>
            </Row>
        </Card>
    </>

}
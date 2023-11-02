
import { Card, Typography, Input, Button, Tooltip, Row, Col, Divider } from 'antd';
import {
    ArrowLeftOutlined,
    HighlightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { TEN } from '@uniswap/sdk/dist/constants';
import { useEffect, useState } from 'react';
import ChartCirculation, { CirculationChartType, parseCirculationChartData } from './Chart-Circulation';
import { fetchAll } from '../../services/chart';
const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [circulationChartData, setCirculationChartData] = useState<CirculationChartType[]>([]);

    useEffect(() => {
        doFetchCharts();
    }, []);

    function doFetchCharts() {
        setLoading(true);
        fetchAll().then(data => {
            setLoading(false);
            const _circulationChartData: CirculationChartType[] = [];
            data.forEach(timestampStatistic => {
                const { supply, lock, freeze } = parseCirculationChartData(timestampStatistic)
                _circulationChartData.push(supply, lock, freeze);
            });
            setCirculationChartData(_circulationChartData);
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
            <Title level={3}>Safe Total Supply</Title>
        </Row>
        <Divider style={{ marginTop: "15px" }} />
        <Row>
            <Col span={16}>
                <Card title="Safe Total Supply Chart">
                    <ChartCirculation data={circulationChartData} config={{
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
                    }} />
                </Card>
            </Col>
            <Col span={8} style={{ paddingLeft: "20px" }}>
                <Title level={5}>About</Title>
                <Text>
                    
                </Text>
                <Divider style={{ marginTop: "15px" }} />

                <Text type='secondary'><HighlightOutlined /> Supply</Text>
                <br/>
                <Text>Number of blocks and coins per day</Text>
                <br/>
                <Text strong>2880 <Divider type='vertical' /> 1,542.91 SAFE</Text>
                <br/>
                <Text>Number of blocks and coins per month</Text>
                <br/>
                <Text strong>86400 <Divider type='vertical' /> 46,287.47 SAFE</Text>
                <br/>
                <Text>Number of blocks and coins per year</Text>
                <br/>
                <Text strong>1036800 <Divider type='vertical' /> 555,449.67 SAFE</Text>
                <Divider style={{ marginTop: "15px" }} />

                <Text type='secondary'><HighlightOutlined /> Highlight</Text>
                <br/>
                <Text>Highest number of <Text strong>16,262,505</Text> transactions on Thursday, November 25, 2021</Text>
            </Col>
        </Row>
    </>
}
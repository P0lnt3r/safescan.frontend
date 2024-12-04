
import { Card, Typography, Input, Button, Tooltip, Row, Col, Divider } from 'antd';
import {
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import ChartCirculation, { CirculationChartType, parseCirculationChartData } from './Chart-Circulation';
import { fetchAll, fetchCirculation } from '../../services/chart';
import { useBlockNumber } from '../../state/application/hooks';
import { CirculationVO } from '../../services';
import EtherAmount from '../../components/EtherAmount';
const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [circulationChartData, setCirculationChartData] = useState<CirculationChartType[]>([]);
    const [circulationData, setCirculationData] = useState<CirculationVO>();

    useEffect(() => {
        doFetchCharts();
        doFetchCirculation();
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

    function doFetchCirculation() {
        fetchCirculation().then(data => {
            setCirculationData(data);
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
                <Text type='secondary' style={{ fontSize: "20px" }}>Amount</Text>
                <Divider />
                {
                    circulationData && <>
                        <Row>
                            <Col span={24}>
                                <Text>Total Supply</Text>
                                <Text style={{ float: "right" }} strong>
                                    <EtherAmount raw={circulationData?.maxTotalSupply} fix={2} forceFix />
                                </Text>
                            </Col>
                            <Col span={24} style={{ marginTop: "5px" }}>
                                <Text>Umined</Text>
                                <Text style={{ float: "right" }} strong>
                                    <EtherAmount raw={circulationData.unmined} fix={2} forceFix />
                                </Text>
                            </Col>
                            <Col span={24} style={{ marginTop: "5px" }}>
                                <Text>Circulation</Text>
                                <Text style={{ float: "right" }} strong>
                                    <EtherAmount raw={circulationData.circulation} fix={2} forceFix />
                                </Text>
                            </Col>
                            <Col span={24} style={{ marginTop: "5px" }}>
                                <Text>Locked</Text>
                                <Text style={{ float: "right" }} strong>
                                    <EtherAmount raw={circulationData.locked} fix={2} forceFix />
                                </Text>
                            </Col>
                            <Col span={24} style={{ marginTop: "5px" }}>
                                <Text>Stake</Text>
                                <Text style={{ float: "right" }} strong>
                                    <EtherAmount raw={circulationData.freeze} fix={2} forceFix />
                                </Text>
                            </Col>
                        </Row>
                    </>
                }
                <Divider />
                <Text type='secondary' style={{ fontSize: "20px" }}>Supply</Text>
                <Row style={{marginTop:"5px"}}>
                    <Col span={24}>
                        <Text>Number of blocks and coins per day</Text>
                        <Text style={{ float: "right" }} strong>2880 <Divider type='vertical' />
                            1,542.91 SAFE
                        </Text>
                    </Col>
                    <Col span={24} style={{ marginTop: "5px" }}>
                        <Text>Number of blocks and coins per month</Text>
                        <Text style={{ float: "right" }} strong>86400 <Divider type='vertical' />
                            46,287.47 SAFE
                        </Text>
                    </Col>
                    <Col span={24} style={{ marginTop: "5px" }}>
                        <Text>Number of blocks and coins per year</Text>
                        <Text style={{ float: "right" }} strong>1036800 <Divider type='vertical' />
                            555,449.67 SAFE
                        </Text>
                    </Col>
                </Row>
            </Col>
        </Row>
    </>
}
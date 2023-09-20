
import { Card, Typography, Input, Button, Tooltip, Row, Col, Divider } from 'antd';
import { TinyLine } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { fetchAll } from '../../services/chart';
import ChartCirculation, { CirculationType, parseCirculationChartData } from './Chart-Circulation';
import ChartTxns, { TxnsType } from './Chart-Txns';
import ChartAddresses, { AddressesType } from './Chart-Addresses';
import ChartMasternodes, { MasternodesChartType } from './Chart-Masternodes';
import ChartSupernodes, { SupernodesChartType } from './Chart-Supernodes';
const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const [loading, setLoading] = useState(false);
    const [circulationChartData, setCirculationChartData] = useState<CirculationType[]>([]);
    const [txnsChartData, setTxnsChartData] = useState<TxnsType[]>([]);
    const [addressesChartData , setAddressesChartData] = useState<AddressesType[]>([]);
    const [masternodesChartData , setMasternodesChartData] = useState<MasternodesChartType[]>([]);
    const [supernodesChartData , setSupernodesChartData] = useState<SupernodesChartType[]>([]);

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
            // 解析地址增长数据
            const _addressesChartData : AddressesType[] = [];
            data.forEach( timestampStatistic => {
                const { date , totalAddress } = timestampStatistic;
                _addressesChartData.push({ date , count : totalAddress })
            });
            setAddressesChartData(_addressesChartData);
            // 解析主节点增长数据
            const _masternodesChartData : MasternodesChartType[] = [];
            data.forEach( timestampStatistic => {
                const { date , totalMasterNodes } = timestampStatistic;
                _masternodesChartData.push({ date , count : totalMasterNodes })
            });
            setMasternodesChartData(_masternodesChartData);
            // 解析超级节点图表数据
            const _supernodesChartData : SupernodesChartType[] = [];
            data.forEach( timestampStatistic => {
                const { date , totalSuperNodes } = timestampStatistic;
                _supernodesChartData.push({ date , count : totalSuperNodes })
            });
            setSupernodesChartData(_supernodesChartData);
        })
    }

    return <>
        <Row>
            <Title level={3}>Safe Chain Charts & Statistics</Title>
        </Row>
        <Divider style={{ marginTop: "15px" }} />

        <Row>
            <Title level={5}>Blockchain Data</Title>
        </Row>
        <Row style={{ marginTop: "5px" }}>
            <Col xl={8} xs={24} style={{ padding: "10px" }}>
                <Card loading={loading} style={{
                    cursor: "pointer"
                }} title={<Text style={{ fontSize: "14px" }}>SAFE Total Supply Chart</Text>}>
                    <ChartCirculation data={circulationChartData} />
                </Card>
            </Col>
            <Col xl={8} xs={24} style={{ padding: "10px" }}>
                <Card loading={loading} style={{
                    cursor: "pointer"
                }} title={<Text style={{ fontSize: "14px" }}>Daily Transaction Chart</Text>}>
                    <ChartTxns data={txnsChartData} />
                </Card>
            </Col>
            <Col xl={8} xs={24} style={{ padding: "10px" }}>
                <Card title={<Text style={{ fontSize: "14px" }}>Unique Addresses Chart</Text>}>
                    <ChartAddresses data={addressesChartData} config={{height:200}} />
                </Card>
            </Col>
        </Row>
        <Row style={{ marginTop: "5px" }}>
            <Col xl={8} xs={24} style={{ padding: "10px" }}>
                <Card loading={loading} style={{
                    cursor: "pointer"
                }} title={<Text style={{ fontSize: "14px" }}>Block Count & Rewards Chart</Text>}>
                </Card>
            </Col>
            <Col xl={8} xs={24} style={{ padding: "10px" }}>
                <Card loading={loading} style={{
                    cursor: "pointer"
                }} title={<Text style={{ fontSize: "14px" }}>Daily Gas Used Chart</Text>}>
                </Card>
            </Col>
            <Col xl={8} xs={24} style={{ padding: "10px" }}>
                <Card title={<Text style={{ fontSize: "14px" }}>Average Block Time Chart</Text>}>
                </Card>
            </Col>
        </Row>
        <Divider style={{ marginTop: "15px" }} />

        <Row>
            <Title level={5}>Node Data</Title>
        </Row>  
        <Row style={{ marginTop: "5px" }}>
            <Col xl={8} xs={24} style={{ padding: "10px" }}>
                <Card loading={loading} style={{
                    cursor: "pointer"
                }} title={<Text style={{ fontSize: "14px" }}>Masternodes Chart</Text>}>
                    <ChartMasternodes masternodesChartData={masternodesChartData} config={{height:200}}/>
                </Card>
            </Col>
            <Col xl={8} xs={24} style={{ padding: "10px" }}>
                <Card loading={loading} style={{
                    cursor: "pointer"
                }} title={<Text style={{ fontSize: "14px" }}>Supernodes Chart</Text>}>
                     <ChartSupernodes supernodesChartData={supernodesChartData} config={{height:200}}/>
                </Card>
            </Col>
        </Row>      

    </>

}

import { Card, Typography, Input, Button, Tooltip, Row, Col, Divider } from 'antd';
import { TinyLine } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { fetchAll } from '../../services/chart';
import ChartCirculation, { CirculationType, parseCirculationChartData } from './Chart-Circulation';
import ChartTxns, { TxnsType } from './Chart-Txns';
import ChartAddresses, { AddressesType } from './Chart-Addresses';
import ChartMasternodes, { MasternodesChartType } from './Chart-Masternodes';
import ChartSupernodes, { SupernodesChartType } from './Chart-Supernodes';
import { JSBI } from '@uniswap/sdk';
import { ETHER, GWEI } from '../../components/EtherAmount';
import ChartBlocksRewards, { BlocksRewardsChartType } from './Chart-BlocksRewards';
import ChartDailyGasUseds, { GasUsedsChartType } from './Chart-DailyGasUseds';
import ChartAverageBlockTimes, { AverageBlockTimesChartType } from './Chart-AverageBlockTimes';
const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const [loading, setLoading] = useState(false);
    const [circulationChartData, setCirculationChartData] = useState<CirculationType[]>([]);
    const [txnsChartData, setTxnsChartData] = useState<TxnsType[]>([]);
    const [addressesChartData, setAddressesChartData] = useState<AddressesType[]>([]);
    const [masternodesChartData, setMasternodesChartData] = useState<MasternodesChartType[]>([]);
    const [supernodesChartData, setSupernodesChartData] = useState<SupernodesChartType[]>([]);
    const [blocksRewardsChartData, setBlocksRewardsChartData] = useState<BlocksRewardsChartType[]>([]);
    const [gasUsedsChartData , setGasUsedChartData] = useState<GasUsedsChartType[]>([]);
    const [avgBlockTimesChartData , setAvgBlockTimesChartData] = useState<AverageBlockTimesChartType[]>([]);

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
            const _addressesChartData: AddressesType[] = [];
            data.forEach(timestampStatistic => {
                const { date, totalAddress } = timestampStatistic;
                _addressesChartData.push({ date, count: totalAddress })
            });
            setAddressesChartData(_addressesChartData);
            // 解析主节点增长数据
            const _masternodesChartData: MasternodesChartType[] = [];
            data.forEach(timestampStatistic => {
                const { date, totalMasterNodes, totalMasternodeRewards } = timestampStatistic;
                const rewards = JSBI.subtract(JSBI.BigInt(totalMasternodeRewards),
                    JSBI.BigInt(_masternodesChartData.length > 0 ? data[_masternodesChartData.length - 1].totalMasternodeRewards : "0")
                );
                _masternodesChartData.push({
                    date,
                    count: totalMasterNodes,
                    rewards: Number.parseFloat(ETHER(rewards,4))
                })
            });
            setMasternodesChartData(_masternodesChartData);
            // 解析超级节点图表数据
            const _supernodesChartData: SupernodesChartType[] = [];
            data.forEach(timestampStatistic => {
                const { date, totalSuperNodes, totalSupernodeRewards } = timestampStatistic;
                const rewards = JSBI.subtract(JSBI.BigInt(totalSupernodeRewards),
                    JSBI.BigInt(_supernodesChartData.length > 0 ? data[_supernodesChartData.length - 1].totalSupernodeRewards : "0")
                );
                _supernodesChartData.push({ date, count: totalSuperNodes, rewards: Number.parseFloat(ETHER(rewards,4)) })
            });
            setSupernodesChartData(_supernodesChartData);

            // 解析区块及奖励
            const _blocksRewardsChartData: BlocksRewardsChartType[] = [];
            data.forEach(timestampStatistic => {
                const { date, blockNumberStart, blockNumberEnd, totalRewards, totalSupernodeRewards, totalMasternodeRewards } = timestampStatistic;
                let blocks = blockNumberEnd - blockNumberStart + 1;
                let rewards;
                if (_blocksRewardsChartData.length == 0) {
                    rewards = JSBI.add(JSBI.BigInt(totalSupernodeRewards),JSBI.BigInt(totalMasternodeRewards));
                } else {
                    rewards = JSBI.subtract(JSBI.BigInt(totalRewards),
                        JSBI.BigInt(data[_blocksRewardsChartData.length - 1].totalRewards)
                    );
                }
                _blocksRewardsChartData.push({date , blocks , rewards : Number.parseFloat(ETHER(rewards,4))})
                setBlocksRewardsChartData(_blocksRewardsChartData);
            })

            // 解析gas
            const _gasUsedChartData : GasUsedsChartType[] = [];
            data.forEach( timestampStatistic => {
                const { date , totalGas , totalGasBurnAmount } = timestampStatistic;
                let gas , burn ;
                gas = JSBI.subtract(JSBI.BigInt(totalGas),
                    JSBI.BigInt(_gasUsedChartData.length > 0 ? data[_gasUsedChartData.length - 1].totalGas : "0")
                );
                burn = JSBI.subtract(JSBI.BigInt(totalGasBurnAmount),
                    JSBI.BigInt(_gasUsedChartData.length > 0 ? data[_gasUsedChartData.length - 1].totalGasBurnAmount : "0")
                );
                _gasUsedChartData.push({
                    date , used : Number.parseFloat(GWEI(gas,6)) ,
                    burn :  Number.parseFloat(GWEI(burn,6)) ,
                })
                setGasUsedChartData(_gasUsedChartData);
            })

            // 解析blocktimes
            const _avgBlockTimesChartData : AverageBlockTimesChartType[] = [];
            data.forEach( timestampStatistic => {
                const { date , avgBlockTime } = timestampStatistic;
                _avgBlockTimesChartData.push({
                    date , 
                    time : Number.parseFloat(avgBlockTime)
                })
            });
            setAvgBlockTimesChartData(_avgBlockTimesChartData);
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
                    <ChartAddresses data={addressesChartData} config={{ height: 200 }} />
                </Card>
            </Col>
        </Row>
        <Row style={{ marginTop: "5px" }}>
            <Col xl={8} xs={24} style={{ padding: "10px" }}>
                <Card loading={loading} style={{
                    cursor: "pointer"
                }} title={<Text style={{ fontSize: "14px" }}>Block Count & Rewards Chart</Text>}>
                    <ChartBlocksRewards blocksRewards={blocksRewardsChartData} config={{height:200}} />
                </Card>
            </Col>
            <Col xl={8} xs={24} style={{ padding: "10px" }}>
                <Card loading={loading} style={{
                    cursor: "pointer"
                }} title={<Text style={{ fontSize: "14px" }}>Daily Gas Used Chart</Text>}>
                    <ChartDailyGasUseds gasUseds={gasUsedsChartData} config={{height:200}} />
                </Card>
            </Col>
            <Col xl={8} xs={24} style={{ padding: "10px" }}>
                <Card title={<Text style={{ fontSize: "14px" }}>Average Block Time Chart</Text>}>
                    <ChartAverageBlockTimes averageBlockTimes={avgBlockTimesChartData} config={{height:200}} />
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
                }} title={<Text style={{ fontSize: "14px" }}>Daily Masternodes Chart</Text>}>
                    <ChartMasternodes masternodesChartData={masternodesChartData} config={{ height: 200 }} />
                </Card>
            </Col>
            <Col xl={8} xs={24} style={{ padding: "10px" }}>
                <Card loading={loading} style={{
                    cursor: "pointer"
                }} title={<Text style={{ fontSize: "14px" }}>Daily Supernodes Chart</Text>}>
                    <ChartSupernodes supernodesChartData={supernodesChartData} config={{ height: 200 }} />
                </Card>
            </Col>
        </Row>

    </>

}
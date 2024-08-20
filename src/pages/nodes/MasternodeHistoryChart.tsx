import { useEffect, useState } from "react"
import { fetchAll } from "../../services/chart"
import ChartMasternodes, { MasternodesChartType } from "../statistics/Chart-Masternodes";
import { JSBI } from "@uniswap/sdk";
import { ETHER } from "../../components/EtherAmount";


export default () => {

    const [masternodesChartData, setMasternodesChartData] = useState<MasternodesChartType[]>([]);

    useEffect(() => {
        fetchAll().then(data => {
            const _masternodesChartData: MasternodesChartType[] = [];
            data.forEach(timestampStatistic => {
                const { totalMasterNodes } = timestampStatistic;
                // 解析区块及奖励
                const { date, blockNumberStart, blockNumberEnd, totalRewards, totalSupernodeRewards, totalMasternodeRewards } = timestampStatistic;
                const masternodesRewards = JSBI.subtract(JSBI.BigInt(totalMasternodeRewards),
                    JSBI.BigInt(_masternodesChartData.length > 0 ? data[_masternodesChartData.length - 1].totalMasternodeRewards : "0")
                );
                _masternodesChartData.push({
                    date,
                    count: totalMasterNodes,
                    rewards: Number.parseFloat(ETHER(masternodesRewards, 4))
                })
            });
            setMasternodesChartData(_masternodesChartData);
        });
    }, [])

    return <>
        <ChartMasternodes masternodesChartData={masternodesChartData} config={{ height: 300 }} />
    </>

}
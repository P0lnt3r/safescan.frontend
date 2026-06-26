import { Avatar, Card, Col, Divider, Row, Typography } from "antd"
import Address from "../../components/Address";
import { SAFE_LOGO } from "../../images/assets_logos/AssetsLogo";
import {
    ArrowRightOutlined,
} from '@ant-design/icons';
import { BSC_NETWORK_LOGO, NetworkType } from "../../images/networks_logos/NetworkLogo";
import CrosschainStatisticElement from "./CrosschainStatisticElement";
import { useEffect, useState } from "react";
import { fetchCrosschainStatistic } from "../../services/crosschain";
const { Text } = Typography;

export interface CrosschainStatisticVO {
    safe4AssetPoolAddress: string,
    targetNetworkAssetPoolAddress: string,
    safe4AssetPoolBalance: string,
    targetNetworkAssetPoolBalance: string,
    safe4ToTargetNetworkCrosschainCount: number,
    targetNetworkToSafe4CrosschainCount: number,
    safe4ToTargetNetworkCrosschainAmount: string,
    targetNetworkToSafe4CrosschainAmount: string,
    targetNetwork: NetworkType
}

export default () => {

    useEffect(() => {
        fetchCrosschainStatistic().then((data) => {
            const { statistic, balance } = data;
            // safe4 / bsc
            const safe4bscStatistic = {
                safe4AssetPoolAddress: "0x471B9eB32a6750b0356E0C80294Ee035C4bdF60B",
                targetNetworkAssetPoolAddress: "0x4d7Fa587Ec8e50bd0E9cD837cb4DA796f47218a1",
                safe4AssetPoolBalance: balance['safe4']['0x471B9eB32a6750b0356E0C80294Ee035C4bdF60B'],
                targetNetworkAssetPoolBalance: balance['bsc']['0x4d7Fa587Ec8e50bd0E9cD837cb4DA796f47218a1'],
                safe4ToTargetNetworkCrosschainCount: statistic[0].safe4BscCount,
                targetNetworkToSafe4CrosschainCount: statistic[0].bscSafe4Count,
                safe4ToTargetNetworkCrosschainAmount: statistic[0].safe4BscAmount,
                targetNetworkToSafe4CrosschainAmount: statistic[0].bscSafe4Amount,
                targetNetwork: NetworkType.BSC
            };
            const safe4ethStatistic = {
                safe4AssetPoolAddress: "0x30728eBa408684D167CF59828261Db8A2A59E8C7",
                targetNetworkAssetPoolAddress: "0xEE9c1Ea4DCF0AAf4Ff2D78B6fF83AA69797B65Eb",
                safe4AssetPoolBalance: balance['safe4']['0x30728eBa408684D167CF59828261Db8A2A59E8C7'],
                targetNetworkAssetPoolBalance: balance['eth']['0xEE9c1Ea4DCF0AAf4Ff2D78B6fF83AA69797B65Eb'],
                safe4ToTargetNetworkCrosschainCount: statistic[0].safe4EthCount,
                targetNetworkToSafe4CrosschainCount: statistic[0].ethSafe4Count,
                safe4ToTargetNetworkCrosschainAmount: statistic[0].safe4EthAmount,
                targetNetworkToSafe4CrosschainAmount: statistic[0].ethSafe4Amount,
                targetNetwork: NetworkType.ETH
            };
            const safe4maticStatistic = {
                safe4AssetPoolAddress: "0x960Bb626aba915c242301EC47948Ba475CDeC090",
                targetNetworkAssetPoolAddress: "0xb7Dd19490951339fE65E341Df6eC5f7f93FF2779",
                safe4AssetPoolBalance: balance['safe4']['0x960Bb626aba915c242301EC47948Ba475CDeC090'],
                targetNetworkAssetPoolBalance: balance['matic']['0xb7Dd19490951339fE65E341Df6eC5f7f93FF2779'],
                safe4ToTargetNetworkCrosschainCount: statistic[0].safe4MaticCount,
                targetNetworkToSafe4CrosschainCount: statistic[0].maticSafe4Count,
                safe4ToTargetNetworkCrosschainAmount: statistic[0].safe4MaticAmount,
                targetNetworkToSafe4CrosschainAmount: statistic[0].maticSafe4Amount,
                targetNetwork: NetworkType.MATIC
            };
            setCrosschainStatistics([safe4bscStatistic, safe4ethStatistic, safe4maticStatistic]);
        });
    }, []);
    const [crosschainStatistics, setCrosschainStatistics] = useState<CrosschainStatisticVO[]>([]);


    return <>
        <Card title="Statistic">
            <Row>
                {
                    crosschainStatistics.map((statistic, index) => {
                        return <Col key={index} xl={8} xs={24} style={{ padding: "10px" }}>
                            <CrosschainStatisticElement
                                safe4AssetPoolAddress={statistic.safe4AssetPoolAddress}
                                targetNetworkAssetPoolAddress={statistic.targetNetworkAssetPoolAddress}
                                safe4AssetPoolBalance={statistic.safe4AssetPoolBalance}
                                targetNetworkAssetPoolBalance={statistic.targetNetworkAssetPoolBalance}
                                safe4ToTargetNetworkCrosschainCount={statistic.safe4ToTargetNetworkCrosschainCount}
                                targetNetworkToSafe4CrosschainCount={statistic.targetNetworkToSafe4CrosschainCount}
                                safe4ToTargetNetworkCrosschainAmount={statistic.safe4ToTargetNetworkCrosschainAmount}
                                targetNetworkToSafe4CrosschainAmount={statistic.targetNetworkToSafe4CrosschainAmount}
                                targetNetwork={statistic.targetNetwork}
                            />
                        </Col>
                    })
                }
            </Row>
        </Card>
    </>

}
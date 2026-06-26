import { Avatar, Card, Col, Divider, Row, Typography } from "antd"
import Address from "../../components/Address";
import { SAFE_LOGO } from "../../images/assets_logos/AssetsLogo";
import {
    ArrowRightOutlined,
    RetweetOutlined,
} from '@ant-design/icons';
import { BSC_NETWORK_LOGO, getNetworkLogo, getNetworkNameByCoin, NetworkType, outputNetworkCoin } from "../../images/networks_logos/NetworkLogo";
import { CrosschainStatisticVO } from "./CrosschainStatistic";
import EtherAmount from "../../components/EtherAmount";
import { format } from "../../utils/NumberFormat";
const { Text } = Typography;

export default ({
    safe4AssetPoolAddress,
    targetNetworkAssetPoolAddress,
    safe4AssetPoolBalance,
    targetNetworkAssetPoolBalance,
    safe4ToTargetNetworkCrosschainCount,
    targetNetworkToSafe4CrosschainCount,
    safe4ToTargetNetworkCrosschainAmount,
    targetNetworkToSafe4CrosschainAmount,
    targetNetwork
}: CrosschainStatisticVO) => {

    return (<>
        <Card title={<>
            <Text>Safe4 <RetweetOutlined /> {getNetworkNameByCoin(outputNetworkCoin(targetNetwork))}</Text>
        </>}>
            <Row>
                <Col span={17}>
                    <Text type="secondary">Asset Pool Address</Text>
                    <br />
                    <Avatar src={SAFE_LOGO} style={{ padding: "2px", width: "24px", height: "24px" }} />
                    <Address style={{ hasLink: false , noQRCode: true }} address={safe4AssetPoolAddress}></Address>
                    <br />
                    <Avatar src={getNetworkLogo(targetNetwork)} style={{ padding: "2px", width: "24px", height: "24px" }} />
                    <Address style={{ hasLink: false , noQRCode: true }} address={targetNetworkAssetPoolAddress}></Address>
                </Col>
                <Col span={7} style={{ textAlign: "right" }}>
                    <Text type="secondary">Balance</Text>   
                    <br />
                    <Text strong style={{ float: "right" }}>
                        <EtherAmount raw={safe4AssetPoolBalance} fix={1} ignoreLabel />
                    </Text>
                    <br />
                    <Text strong style={{ float: "right" }}>
                        <EtherAmount raw={targetNetworkAssetPoolBalance} fix={1} ignoreLabel />
                    </Text>
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col span={12}>
                    <Text type="secondary">Txn Count</Text>
                    <br />
                    <span>
                        <Avatar src={SAFE_LOGO} style={{ padding: "2px", width: "24px", height: "24px" }} />
                        <ArrowRightOutlined />
                        <Avatar src={getNetworkLogo(targetNetwork)} style={{ padding: "2px", width: "24px", height: "24px" }} />
                        <Divider type="vertical" />
                        <Text>{safe4ToTargetNetworkCrosschainCount}</Text>
                    </span>
                    <br />
                    <span>
                        <Avatar src={getNetworkLogo(targetNetwork)} style={{ padding: "2px", width: "24px", height: "24px" }} />
                        <ArrowRightOutlined />
                        <Avatar src={SAFE_LOGO} style={{ padding: "2px", width: "24px", height: "24px" }} />
                        <Divider type="vertical" />
                        <Text>{targetNetworkToSafe4CrosschainCount}</Text>
                    </span>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                    <Text type="secondary"></Text>
                    <br />
                    <Text strong style={{ float: "right" }}>{format(safe4ToTargetNetworkCrosschainAmount.substring(0, safe4ToTargetNetworkCrosschainAmount.indexOf(".") + 2), 1)}</Text>
                    <br />
                    <Text strong style={{ float: "right" }}>{format(targetNetworkToSafe4CrosschainAmount.substring(0, targetNetworkToSafe4CrosschainAmount.indexOf(".") + 2), 1)}</Text>
                </Col>
            </Row>
        </Card>
    </>)

}
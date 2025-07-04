
import { Avatar, Card, Col, Divider, Row, Typography } from "antd"
import { getNetworkExplorerURLByCoin, getNetworkLogo, getNetworkLogoByCoin, NetworkCoinType, NetworkType } from "../../images/networks_logos/NetworkLogo";
import { SAFE_LOGO } from "../../images/assets_logos/AssetsLogo";
import {
    ArrowRightOutlined,
} from '@ant-design/icons';
import { CrossChainVO } from "../../services";
import { DateFormat } from "../../utils/DateUtil";
import { CrosschainDirection, getCrosschainDirection } from "./Crosschain";
import { ethers } from "ethers";

const { Text, Link } = Typography;

export default ({
    crosschainVO
}: {
    crosschainVO: CrossChainVO
}) => {

    const {
        asset,
        srcNetwork, dstNetwork,
        srcAddress, dstAddress,
        srcAmount, dstAmount,
        srcTxHash, dstTxHash,
        srcTxBlockNumber, srcTxTimestamp,
        dstTxBlockNumber, dstTxTimestamp,
        fee, status
    } = crosschainVO;

    const RenderIcon = () => {
        const crosschainDirection = srcNetwork == 'safe4' ? CrosschainDirection.SAFE4_NETWORKS : CrosschainDirection.NETWORKS_SAFE4;
        if (crosschainDirection == CrosschainDirection.SAFE4_NETWORKS) {
            return <>
                <Avatar src={SAFE_LOGO} style={{ padding: "4px", width: "48px", height: "48px" }} />
                <ArrowRightOutlined />
                <Avatar src={getNetworkLogoByCoin(dstNetwork as NetworkCoinType)} style={{ padding: "4px", width: "48px", height: "48px" }} />
            </>
        } else if (crosschainDirection == CrosschainDirection.NETWORKS_SAFE4) {
            return <>
                <Avatar src={getNetworkLogoByCoin(srcNetwork as NetworkCoinType)} style={{ padding: "4px", width: "48px", height: "48px" }} />
                <ArrowRightOutlined />
                <Avatar src={SAFE_LOGO} style={{ padding: "4px", width: "48px", height: "48px" }} />
            </>
        }
    }

    const RenderStatus = () => {
        if (status == 4) {
            return <>
                <Text strong type="success">Confirmed</Text>
            </>
        }
        return <>
            <Text strong type="secondary">Waiting</Text>
        </>
    }

    return <>
        <Card style={{ width: "100%" }}>
            <Row>
                <Col span={8}>
                    {RenderIcon()}
                </Col>
                <Col span={16} style={{ textAlign: "right" }}>
                    <Text>{srcTxBlockNumber} <Divider type="vertical" /> {srcTxTimestamp && DateFormat(srcTxTimestamp * 1000)}</Text>
                    <br />
                    <Text>{dstTxBlockNumber} <Divider type="vertical" /> {dstTxTimestamp && DateFormat(dstTxTimestamp * 1000)}</Text>
                </Col>
            </Row>
            <Row style={{ marginTop: "5px" }}>
                <Col xxl={4} xs={24}>
                    <Text italic>Source Transaction Hash:</Text>
                </Col>
                <Col xxl={16} xs={24}>
                    <Link ellipsis onClick={() => {
                        window.open(
                            `${getNetworkExplorerURLByCoin(srcNetwork as NetworkCoinType)}/tx/${srcTxHash}`,
                            "_blank"
                        )
                    }}>{srcTxHash}</Link>
                </Col>
            </Row>
            <Row>
                <Col xxl={4} xs={24}>
                    <Text italic>Confirmed Transaction Hash:</Text>
                </Col>
                <Col xxl={16} xs={24}>
                    <Link ellipsis onClick={() => {
                        window.open(
                            `${getNetworkExplorerURLByCoin(dstNetwork as NetworkCoinType)}/tx/${dstTxHash}`,
                            "_blank"
                        )
                    }}>{dstTxHash}</Link>
                </Col>
            </Row>
            <Row style={{ marginTop: "5px" }}>
                <Col xl={12} xs={24}>
                    <Link strong ellipsis onClick={() => {
                        window.open(
                            `${getNetworkExplorerURLByCoin(srcNetwork as NetworkCoinType)}/address/${srcAddress}`,
                            "_blank"
                        )
                    }}>
                        {ethers.utils.getAddress(srcAddress)}
                    </Link>
                    <Text style={{ float: "right" }}>
                        <Text strong style={{ float: "right" }}>{srcAmount} {asset}</Text>
                        <br />
                        <Text style={{ float: "right" }}> - Fee : {fee} {asset}</Text>
                    </Text>
                </Col>
                <Col xl={12} xs={24}>
                    <Link strong ellipsis onClick={() => {
                        window.open(
                            `${getNetworkExplorerURLByCoin(dstNetwork as NetworkCoinType)}/address/${dstAddress}`,
                            "_blank"
                        )
                    }}>
                        <ArrowRightOutlined style={{ marginRight: "5px", marginLeft: "5px" }} />
                        {ethers.utils.getAddress(dstAddress)}
                    </Link>
                    <Text strong style={{ float: "right" }}>
                        <Text strong style={{ float: "right" }}>{dstAmount} {asset}</Text>
                        <br />
                        <Text strong type="success" style={{ float: "right" }}>{RenderStatus()}</Text>
                    </Text>
                </Col>
            </Row>
        </Card>
    </>

}
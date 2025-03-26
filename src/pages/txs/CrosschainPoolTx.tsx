import { Avatar, Col, Divider, Row, Tooltip, Typography } from "antd"
import { CrossChainVO, TransactionVO } from "../../services"
import { BSC_NETWORK_LOGO, getNetworkExplorerURLByCoin, getNetworkExplorerURLByTxPrefix, getNetworkLogoByCoin, getNetworkLogoByTxIDPrefix, getNetworkNameByCoin, getNetworkNameByTxPrefix, NetworkCoinType, NetworkTxIdPrefix } from "../../images/networks_logos/NetworkLogo";
import { CrosschainDirection, getCrosschainDirection } from "../crosschain/Crosschain";
import { ethers } from "ethers";
import { SAFE_LOGO } from "../../images/assets_logos/AssetsLogo";
import Address from "../../components/Address";
import EtherAmount from "../../components/EtherAmount";
import { useBlockNumber } from "../../state/application/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchCrossChainByTxHash } from "../../services/crosschain";
import { SyncOutlined } from "@ant-design/icons";

const { Text, Paragraph, Link } = Typography;

export default ({ txVO }: {
    txVO: TransactionVO,
}) => {

    const {
        from,
        hash,
        input,
        to,
        value,
    } = txVO;

    const blockNumber = useBlockNumber();
    const utf8decode = ethers.utils.toUtf8String(input);
    const [left, right] = utf8decode.split(":");
    const crosschainDirection = getCrosschainDirection(left);
    const [crossChainVO, setCrossChainVO] = useState<CrossChainVO>();

    useEffect(() => {
        if (blockNumber && crosschainDirection) {
            const fetchByTxHashParams: {
                srcTxHash?: string,
                dstTxHash?: string
            } = {};
            if (crosschainDirection == CrosschainDirection.SAFE4_NETWORKS) {
                fetchByTxHashParams.srcTxHash = hash
            } else if (crosschainDirection == CrosschainDirection.NETWORKS_SAFE4) {
                fetchByTxHashParams.dstTxHash = hash
            }
            fetchCrossChainByTxHash(fetchByTxHashParams).then(data => {
                if (data) {
                    setCrossChainVO(data);
                }
            });
        }
    }, [blockNumber, crosschainDirection]);
    const spin = useMemo(() => {
        return crossChainVO ? !(crossChainVO.status == 4) : true;
    }, [crossChainVO]);

    const RenderCrosschainStatus = useCallback(() => {
        if (crossChainVO && crossChainVO.status == 4) {
            return <Text type="success" strong>Confirmed</Text>
        }
        return <Text strong type="secondary" italic>Waiting</Text>
    }, [crossChainVO])

    return <>
        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col xl={8} xs={24}>
                <Tooltip title="The date and time at which a transaction is validated." color='black'>
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Cross-Chain</Text>
            </Col>
            <Col xl={16} xs={24}>
                <Row>
                    <Col span={24}>
                        <Text type="secondary" style={{ marginRight: "5px" }}>Asset</Text><br />
                        {
                            spin && <SyncOutlined spin={spin} style={{ fontSize: "30px", marginRight: "5px" }} />
                        }
                        <Text style={{ fontSize: "20px" }} strong><EtherAmount raw={value} /></Text>
                    </Col>
                    <Col span={24}>

                    </Col>
                </Row>
                {
                    crosschainDirection == CrosschainDirection.NETWORKS_SAFE4 && <>
                        <Row style={{ marginTop: "5px" }}>
                            <Col span={24}>
                                <Text type="secondary">Source Transaction</Text>
                            </Col>
                            <Col span={24}>
                                <Link onClick={() => {
                                    window.open(
                                        `${getNetworkExplorerURLByTxPrefix(left as NetworkTxIdPrefix)}/tx/${right}`,
                                        "_blank"
                                    )
                                }}>{right}</Link>
                            </Col>
                        </Row>
                    </>
                }
                <Row style={{ marginTop: "5px" }}>
                    <Col span={24}>
                        <Text type="secondary">From</Text>
                    </Col>
                    <Col span={24}>
                        {
                            crosschainDirection == CrosschainDirection.SAFE4_NETWORKS && <>
                                <Avatar src={SAFE_LOGO} style={{ marginTop: "8px", float: "left", marginRight: "8px" }} />
                                <div>
                                    <Text strong>Safe4 Network</Text><br />
                                    <Text>
                                        <Address address={from} style={{ ellipsis: false, hasLink: true }} />
                                    </Text>
                                </div>
                            </>
                        }
                        {
                            crosschainDirection == CrosschainDirection.NETWORKS_SAFE4 && <>
                                <Avatar src={getNetworkLogoByTxIDPrefix(left as NetworkTxIdPrefix)} style={{ marginTop: "8px", float: "left", marginRight: "8px" }} />
                                <div>
                                    <Text strong>{getNetworkNameByTxPrefix(left as NetworkTxIdPrefix)}</Text><br />
                                    <Text>
                                        {
                                            crossChainVO && <Address address={crossChainVO.srcAddress}
                                                style={{ ellipsis: false, hasLink: true, forceTag: false }}
                                                to={`${getNetworkExplorerURLByTxPrefix(left as NetworkTxIdPrefix)}/address/${crossChainVO.srcAddress}`}
                                            />
                                        }
                                    </Text>
                                </div>
                            </>
                        }
                    </Col>
                </Row>
                <Row style={{ marginTop: "5px" }}>
                    <Col span={24}>
                        <Text type="secondary">To</Text>
                    </Col>
                    <Col span={24}>
                        {
                            crosschainDirection == CrosschainDirection.SAFE4_NETWORKS && <>
                                <Avatar src={getNetworkLogoByCoin(left as NetworkCoinType)} style={{ marginTop: "8px", float: "left", marginRight: "8px" }} />
                                <div>
                                    <Text strong>{getNetworkNameByCoin(left as NetworkCoinType)}</Text><br />
                                    <Text>
                                        <Address address={right} style={{ ellipsis: false, hasLink: true }}
                                            to={`${getNetworkExplorerURLByCoin(left as NetworkCoinType)}/address/${right}`} />
                                    </Text>
                                </div>
                            </>
                        }
                        {
                            crosschainDirection == CrosschainDirection.NETWORKS_SAFE4 && <>
                                <Avatar src={SAFE_LOGO} style={{ marginTop: "8px", float: "left", marginRight: "8px" }} />
                                <div>
                                    <Text strong>Safe4 Network</Text><br />
                                    <Text>
                                        {
                                            crossChainVO && <Address address={crossChainVO.dstAddress}
                                                style={{ ellipsis: false, hasLink: true, forceTag: false }}
                                            />
                                        }
                                    </Text>
                                </div>
                            </>
                        }
                    </Col>
                </Row>
                {
                    crosschainDirection == CrosschainDirection.SAFE4_NETWORKS && crossChainVO?.status == 4 && <>
                        <Row style={{ marginTop: "5px" }}>
                            <Col span={24}>
                                <Text type="secondary">Confirmed Transaction</Text>
                            </Col>
                            <Col span={24}>
                                <Link onClick={() => {
                                    window.open(
                                        `${getNetworkExplorerURLByCoin(left as NetworkCoinType)}/tx/${crossChainVO.dstTxHash}`,
                                        "_blank"
                                    )
                                }}>{crossChainVO.dstTxHash}</Link>
                            </Col>
                        </Row>
                    </>
                }
                <Row style={{ marginTop: "5px" }}>
                    <Col xl={4} xs={24}>
                        <Text type="secondary">Status</Text><br />
                        {RenderCrosschainStatus()}
                    </Col>
                    {
                        crossChainVO && crossChainVO.status == 4 &&
                        <Col xl={4} xs={24}>
                            <Text type="secondary">Receive</Text><br />
                            <Text strong>{crossChainVO.dstAmount} SAFE</Text>
                        </Col>
                    }
                    {
                        crossChainVO && crossChainVO.status == 4 &&
                        <Col xl={4} xs={24}>
                            <Text type="secondary">Fee</Text><br />
                            <Text>{crossChainVO.fee} SAFE</Text>
                        </Col>
                    }
                </Row>

            </Col>
        </Row>
    </>
}
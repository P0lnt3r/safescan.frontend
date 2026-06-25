import { useNavigate, useParams } from "react-router-dom";
import { Card, Typography, Input, Button, Tooltip, Row, Col, Divider } from "antd";
import { ReactNode, useEffect, useMemo, useState } from "react";
import {
    QuestionCircleOutlined,
    LeftOutlined,
    RightOutlined,
    SyncOutlined,
} from "@ant-design/icons";

import { DateFormat } from "../../utils/DateUtil";
import { format } from "../../utils/NumberFormat";
import { fetchBlock } from "../../services/block";
import { BlockVO } from "../../services";
import { useBlockNumber } from "../../state/application/hooks";
import NavigateLink from "../../components/NavigateLink";
import EtherAmount from "../../components/EtherAmount";
import config from "../../config";
import Address from "../../components/Address";
import "./detail.css";

const { TextArea } = Input;
const { Title, Text } = Typography;

const BLOCKS_DESCRIPTION =
    "Blocks are batches of transactions linked together via cryptographic hashes. Any tampering of a block invalidates subsequent blocks as their hashes would be changed.";

const DEFAULT_TOOLTIP =
    "A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed";

function DetailField({
    label,
    tooltip = DEFAULT_TOOLTIP,
    children,
    labelCol = { xl: 8, xs: 12 },
    valueCol = { xl: 16, xs: 12 },
}: {
    label: string;
    tooltip?: string;
    children: ReactNode;
    labelCol?: { xl: number; xs: number };
    valueCol?: { xl: number; xs: number };
}) {
    return (
        <Row className="block-detail-row" align="top">
            <Col {...labelCol}>
                <Tooltip title={tooltip} color="black">
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong className="block-detail-label">{label}</Text>
            </Col>
            <Col {...valueCol}>{children}</Col>
        </Row>
    );
}

function GroupDivider() {
    return <Divider className="block-detail-group-divider" />;
}

export default function BlockDetailPage() {
    const { height } = useParams();
    const navigate = useNavigate();
    const [blockVO, setBlockVO] = useState<BlockVO>();
    const blockNumber = useBlockNumber();

    useEffect(() => {
        if (!blockVO) {
            fetchBlock(Number(height), undefined).then((data: BlockVO) => {
                setBlockVO(data);
            });
        } else {
            if (blockVO.number + "" != height) {
                fetchBlock(Number(height), undefined).then((data: BlockVO) => {
                    setBlockVO(data);
                });
            }
            if (
                blockVO.confirmed == 0 &&
                blockNumber - blockVO.number >= config.block_confirmed
            ) {
                fetchBlock(Number(height), undefined).then((data: BlockVO) => {
                    setBlockVO(data);
                });
            }
        }
    }, [height, blockNumber]);

    const gasUsedRate = useMemo(() => {
        if (blockVO) {
            const { gasLimit, gasUsed } = blockVO;
            return Math.round((Number(gasUsed) / Number(gasLimit)) * 10000) / 100 + "%";
        }
        return "";
    }, [blockVO]);

    const confirmedBlocks = blockVO ? blockNumber - blockVO.number : 0;

    return (
        <div className="block-detail-page">
            <Row align="middle" className="block-detail-title-row">
                <Title level={3} style={{ marginBottom: 0 }}>Block</Title>
                <Text type="secondary" className="block-detail-number">#{height}</Text>
            </Row>
            <Text type="secondary">{BLOCKS_DESCRIPTION}</Text>
            <Divider className="block-detail-page-divider" />

            <Card className="block-detail-card">
                <DetailField label="Block Height:">
                    <Tooltip title="View previous block">
                        <Button
                            onClick={() => navigate(`/block/${Number(height) - 1}`)}
                            size="small"
                            type="primary"
                            shape="circle"
                            icon={<LeftOutlined />}
                        />
                    </Tooltip>
                    {blockVO?.confirmed == 1 && (
                        <Text strong className="block-detail-height-value">{height}</Text>
                    )}
                    {blockVO?.confirmed == 0 && (
                        <Text italic underline className="block-detail-height-value">{height}</Text>
                    )}
                    <Tooltip title="View next block">
                        <Button
                            disabled={Number(height) + 1 > blockNumber}
                            onClick={() => navigate(`/block/${Number(height) + 1}`)}
                            size="small"
                            type="primary"
                            shape="circle"
                            icon={<RightOutlined />}
                        />
                    </Tooltip>
                </DetailField>

                <DetailField label="Date Time:">
                    <Text>{blockVO && DateFormat(blockVO.timestamp * 1000)}</Text>
                    <br />
                    {blockVO?.confirmed == 1 && (
                        <Text strong>{confirmedBlocks} Blocks Confirmed</Text>
                    )}
                    {blockVO?.confirmed == 0 && (
                        <>
                            <SyncOutlined spin className="block-detail-sync-icon" />
                            <Text italic>{confirmedBlocks} Blocks Confirmed</Text>
                        </>
                    )}
                </DetailField>

                <DetailField label="Transactions:">
                    <NavigateLink path={`/txs?block=${blockVO?.number}`}>
                        <Text code>{blockVO?.txns} txns</Text>
                    </NavigateLink>
                    <Text> in this block</Text>
                </DetailField>

                <GroupDivider />

                <DetailField label="Miner:" labelCol={{ xl: 8, xs: 24 }} valueCol={{ xl: 16, xs: 24 }}>
                    <NavigateLink path={`/address/${blockVO?.miner}`}>
                        {blockVO?.miner}
                    </NavigateLink>
                    {blockVO?.minerPropVO && (
                        <>
                            <br />
                            [ <Address address={blockVO.miner} propVO={blockVO.minerPropVO} style={{ hasLink: false }} /> ]
                        </>
                    )}
                </DetailField>

                <DetailField label="Reward:" labelCol={{ xl: 8, xs: 24 }} valueCol={{ xl: 16, xs: 24 }}>
                    <Text strong>
                        {blockVO && <EtherAmount raw={blockVO.reward} fix={18} />}
                    </Text>
                </DetailField>

                <DetailField label="Difficulty:">
                    <Text>{blockVO?.difficulty}</Text>
                </DetailField>

                <DetailField label="Total Difficulty:">
                    <Text>{blockVO && format(blockVO.totalDifficulty)}</Text>
                </DetailField>

                <DetailField label="Size:">
                    <Text>{blockVO && format(blockVO.size)} bytes</Text>
                </DetailField>

                <GroupDivider />

                <DetailField label="Gas Used:">
                    <Text>{blockVO && format(blockVO.gasUsed)} ({gasUsedRate})</Text>
                </DetailField>

                <DetailField label="Gas Limit:">
                    <Text>{blockVO && format(blockVO.gasLimit)}</Text>
                </DetailField>

                <DetailField label="Hash:" labelCol={{ xl: 8, xs: 24 }} valueCol={{ xl: 16, xs: 24 }}>
                    <Text>{blockVO?.hash}</Text>
                </DetailField>

                <DetailField label="Parent Hash:" labelCol={{ xl: 8, xs: 24 }} valueCol={{ xl: 16, xs: 24 }}>
                    <Text>{blockVO?.parentHash}</Text>
                </DetailField>

                <DetailField label="Sha3Uncles:" labelCol={{ xl: 8, xs: 24 }} valueCol={{ xl: 16, xs: 24 }}>
                    <Text>{blockVO?.sha3Uncles}</Text>
                </DetailField>

                <GroupDivider />

                <DetailField label="Extra Data" labelCol={{ xl: 8, xs: 24 }} valueCol={{ xl: 16, xs: 24 }}>
                    <TextArea
                        className="block-detail-extra-data"
                        rows={4}
                        disabled
                        value={blockVO?.extraData}
                    />
                </DetailField>
            </Card>
        </div>
    );
}

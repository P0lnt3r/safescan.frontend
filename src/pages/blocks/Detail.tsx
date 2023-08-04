import { useNavigate, useParams } from "react-router-dom"
import { Card, Typography, Input, Button, Tooltip, Row, Col, Divider } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import {
    QuestionCircleOutlined,
    LeftOutlined,
    RightOutlined,
    SyncOutlined
} from '@ant-design/icons';

import { DateFormat } from '../../utils/DateUtil';
import { format } from '../../utils/NumberFormat';
import { fetchBlock } from "../../services/block";
import { BlockVO } from "../../services";
import { useBlockNumber } from "../../state/application/hooks";
import NavigateLink from "../../components/NavigateLink";
import EtherAmount from "../../components/EtherAmount";
import config from "../../config";
import Address from "../../components/Address";

const { TextArea } = Input;
const { Title, Text, Paragraph, Link } = Typography;

export default function () {

    const { height } = useParams();
    const navigate = useNavigate();
    const [blockVO, setBlockVO] = useState<BlockVO>();
    const blockNumber = useBlockNumber();

    useEffect(() => {
        if (!blockVO) {
            fetchBlock(Number(height), undefined).then((blockVO: BlockVO) => {
                setBlockVO(blockVO);
            })
        } else {
            if (blockVO.number + "" != height) {
                fetchBlock(Number(height), undefined).then((blockVO: BlockVO) => {
                    setBlockVO(blockVO);
                })
            }
            if (blockVO.confirmed == 0 &&
                blockNumber - blockVO.number >= config.block_confirmed
            ) {
                fetchBlock(Number(height), undefined).then((blockVO: BlockVO) => {
                    setBlockVO(blockVO);
                })
            }
        }
    }, [height, blockNumber]);

    const gasUsedRate = useMemo(() => {
        if (blockVO) {
            const { gasLimit, gasUsed } = blockVO;
            return Math.round(Number(gasUsed) / Number(gasLimit) * 10000) / 100 + "%";
        }
        return "";
    }, [blockVO])

    return (
        <>
            <Row>
                <Title level={3}>Block</Title>
                <Text type="secondary" style={{ lineHeight: "34px", marginLeft: "5px", fontSize: "18px" }}>#{height}</Text>
            </Row>

            <Card>
                <Row>
                    <Col xl={8} xs={12}>
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Block Height:</Text>
                    </Col>
                    <Col xl={16} xs={12}>
                        <Tooltip title="View previous block">
                            <Button
                                onClick={() => navigate(`/block/${Number(height) - 1}`)} size="small" type="primary" shape="circle" icon={<LeftOutlined />} />
                        </Tooltip>
                        {
                            blockVO?.confirmed == 1 && <Text strong style={{ margin: "14px" }}>{height}</Text>
                        }
                        {
                            blockVO?.confirmed == 0 && <Text italic underline style={{ margin: "14px" }}>{height}</Text>
                        }
                        <Tooltip title="View next block">
                            <Button disabled={Number(height) + 1 > blockNumber}
                                onClick={() => navigate(`/block/${Number(height) + 1}`)} size="small" type="primary" shape="circle" icon={<RightOutlined />} />
                        </Tooltip>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={12}>
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Date Time:</Text>
                    </Col>
                    <Col xl={16} xs={12}>
                        <Text>
                            {blockVO && DateFormat(blockVO?.timestamp * 1000)}
                        </Text>
                        <br />
                        {
                            blockVO?.confirmed == 1 &&
                            <Text strong>
                                {blockVO && blockNumber - blockVO?.number} Blocks Confirmed
                            </Text>
                        }
                        {
                            blockVO?.confirmed == 0 && <>
                                <SyncOutlined spin style={{ marginRight: "5px" }} />
                                <Text italic>
                                    {blockVO && blockNumber - blockVO?.number} Blocks Confirmed
                                </Text>
                            </>
                        }
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={12}>
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Transactions:</Text>
                    </Col>
                    <Col xl={16} xs={12}>
                        <NavigateLink path={`/txs?block=${blockVO?.number}`}>
                            <Text code>{blockVO?.txns} txns</Text> 
                        </NavigateLink>
                        in this block
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={24} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Miner:</Text>
                    </Col>
                    <Col xl={16} xs={24} >
                        <NavigateLink path={`/address/${blockVO?.miner}`}>
                            {blockVO?.miner}
                        </NavigateLink>
                        {
                            blockVO?.minerPropVO && <>
                                <br />
                                [ <Address address={blockVO.miner} propVO={blockVO.minerPropVO} style={{ hasLink: false }} /> ]
                            </>
                        }
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={24}>
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Reward:</Text>
                    </Col>
                    <Col xl={16} xs={24}>
                        <Text strong>
                            {blockVO && <EtherAmount raw={blockVO?.reward} fix={18} />}
                        </Text>

                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={12} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Difficulty:</Text>
                    </Col>
                    <Col xl={16} xs={12}>
                        <Text>{blockVO?.difficulty}</Text>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={12} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Total Difficulty:</Text>
                    </Col>
                    <Col xl={16} xs={12}>
                        <Text>{blockVO && format(blockVO.totalDifficulty)}</Text>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={12} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Size:</Text>
                    </Col>
                    <Col xl={16} xs={12} >
                        <Text>{blockVO && format(blockVO.size)} bytes</Text>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={12} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Gas Limit:</Text>
                    </Col>
                    <Col xl={16} xs={12} >
                        <Text>{blockVO && format(blockVO.gasLimit)}</Text>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={12} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Gas Used:</Text>
                    </Col>
                    <Col xl={16} xs={12} >
                        <Text>{blockVO && format(blockVO.gasUsed)} ({gasUsedRate})</Text>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={24} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Hash:</Text>
                    </Col>
                    <Col xl={16} xs={24} >
                        <Text>{blockVO?.hash}</Text>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />


                <Row>
                    <Col xl={8} xs={24} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Parent Hash:</Text>
                    </Col>
                    <Col xl={16} xs={24} >
                        <Text>{blockVO?.parentHash}</Text>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={24}>
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Sha3Uncles:</Text>
                    </Col>
                    <Col xl={16} xs={24} >
                        <Text>{blockVO?.sha3Uncles}</Text>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={24} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Extra Data</Text>
                    </Col>
                    <Col xl={16} xs={24} >
                        <TextArea style={{ cursor: "default", color: "black" }} rows={4} disabled
                            value={blockVO?.extraData} />
                    </Col>
                </Row>

            </Card>
        </>
    )

}
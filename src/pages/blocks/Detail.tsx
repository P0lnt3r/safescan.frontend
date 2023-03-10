import { useNavigate, useParams } from "react-router-dom"
import { Card, Typography, Input, Button,  Tooltip, Row, Col, Divider } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import {
    QuestionCircleOutlined,
    LeftOutlined, 
    RightOutlined
} from '@ant-design/icons';

import { DateFormat } from '../../utils/DateUtil';
import  {format} from '../../utils/NumberFormat';
import { fetchBlock } from "../../services/block";
import { BlockVO } from "../../services";
import { useAddressProp } from "../../state/application/hooks";
import NavigateLink from "../../components/NavigateLink";

const { TextArea } = Input;
const { Title, Text, Paragraph, Link } = Typography;
export default function () {
    const { height } = useParams();
    const navigate = useNavigate();
    const [blockVO, setBlockVO] = useState<BlockVO>();
    const addressProp = useAddressProp(blockVO?.miner);
    useEffect(() => {
        fetchBlock(Number(height), undefined).then((blockVO: BlockVO) => {
            setBlockVO(blockVO);
        })
    }, [height]);

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
                    <Col xl={8} xs={24}>
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Block Height:</Text>
                    </Col>
                    <Col xl={16} xs={24}>
                        <Tooltip title="View previous block">
                            <Button onClick={() => navigate(`/block/${Number(height)-1}`)} size="small" type="primary" shape="circle" icon={<LeftOutlined />} />
                        </Tooltip>
                        <Text strong style={{ margin: "14px" }}>{height}</Text>
                        <Tooltip title="View next block">
                            <Button onClick={() => navigate(`/block/${Number(height)+1}`)} size="small" type="primary" shape="circle" icon={<RightOutlined />} />
                        </Tooltip>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={24}>
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Date Time:</Text>
                    </Col>
                    <Col xl={16} xs={24}>
                        <Text>
                            {blockVO && DateFormat(blockVO?.timestamp * 1000)}
                        </Text>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={24}>
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Transactions:</Text>
                    </Col>
                    <Col xl={16} xs={24}>
                        <NavigateLink path={`/txs?block=${blockVO?.number}`}>
                            <Text code>{blockVO?.txns} transactions</Text>
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
                            addressProp && <Text strong>  ({addressProp?.tag})</Text>
                        }
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={24} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Difficulty:</Text>
                    </Col>
                    <Col xl={16} xs={24}>
                        <Text>{blockVO?.difficulty}</Text>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={24} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Total Difficulty:</Text>
                    </Col>
                    <Col xl={16} xs={24}>
                        <Text>{blockVO && format(blockVO.totalDifficulty)}</Text>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={24} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Size:</Text>
                    </Col>
                    <Col xl={16} xs={24} >
                        <Text>{blockVO && format(blockVO.size)} bytes</Text>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={24} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Gas Limit:</Text>
                    </Col>
                    <Col xl={16} xs={24} >
                        <Text>{blockVO && format(blockVO.gasLimit)}</Text>
                    </Col>
                </Row>
                <Divider style={{ margin: '18px 0px' }} />

                <Row>
                    <Col xl={8} xs={24} >
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Gas Used:</Text>
                    </Col>
                    <Col xl={16} xs={24} >
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
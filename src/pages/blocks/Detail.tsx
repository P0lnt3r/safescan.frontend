import { useParams } from "react-router-dom"
import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { TabsProps } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
    SearchOutlined, LeftOutlined, RightOutlined

} from '@ant-design/icons';

import { DateFormat } from '../../utils/DateUtil';
import EtherAmount from '../../components/EtherAmount';
import JSBI from 'jsbi';
import NumberFormat from '../../utils/NumberFormat';
import { fetchBlock } from "../../services/block";
import { BlockVO } from "../../services";
import { defaultAbiCoder } from 'ethers/lib/utils';
import { useAddressProp } from "../../state/application/hooks";

const { TextArea } = Input;
const { Title, Text, Paragraph, Link } = Typography;
export default function () {
    const { height } = useParams();
    const [blockVO, setBlockVO] = useState<BlockVO>();
    const addressProp = useAddressProp(blockVO?.miner);
    console.log(addressProp);

    useEffect(() => {
        fetchBlock(Number(height), undefined).then((blockVO: BlockVO) => {
            setBlockVO(blockVO);
        })
    }, []);

    const gasUsedRate = useMemo(() => {
        if (blockVO) {
            const { gasLimit, gasUsed } = blockVO;
            return Math.round(gasUsed / gasLimit * 10000) / 100 + "%";
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
                            <Button size="small" type="primary" shape="circle" icon={<LeftOutlined />} />
                        </Tooltip>
                        <Text strong style={{ margin: "14px" }}>{height}</Text>
                        <Tooltip title="View next block">
                            <Button size="small" type="primary" shape="circle" icon={<RightOutlined />} />
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
                        <Link href={`/txs?block=${blockVO?.number}`}>
                            <Text code>{blockVO?.txns} transactions</Text>
                        </Link>
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
                        <Link href={`/address/${blockVO?.miner}`}>
                            {blockVO?.miner}
                        </Link>
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
                        <Text>{blockVO && NumberFormat(blockVO.totalDifficulty)}</Text>
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
                        <Text>{blockVO && NumberFormat(blockVO.size)} bytes</Text>
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
                        <Text>{blockVO && NumberFormat(blockVO.gasLimit)}</Text>
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
                        <Text>{blockVO && NumberFormat(blockVO.gasUsed)} ({gasUsedRate})</Text>
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
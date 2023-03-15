import { Typography, Tag, Input, Tooltip, Row, Col, Divider } from 'antd';
import { useMemo } from 'react';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { TransactionVO } from '../../services';
import { DateFormat } from '../../utils/DateUtil';
import EtherAmount, { GWEI } from '../../components/EtherAmount';
import JSBI from 'jsbi';
import { format } from '../../utils/NumberFormat';
import { useAddressFunctionFragment } from '../../state/application/hooks';
import { useDispatch } from 'react-redux';
import TxInput from './TxInput';
import NavigateLink from '../../components/NavigateLink';
import { CurrencyAmount } from '@uniswap/sdk';

const { Text, Paragraph } = Typography;

export default ({
    blockHash,
    blockNumber,
    from,
    gas,
    gasPrice,
    gasUsed,
    hash,
    input,
    methodId,
    nonce,
    status,
    timestamp,
    to,
    transactionIndex,
    value,
}: TransactionVO) => {

    const { txFee, gasPriceGWEI, gasUsedRate } = useMemo(() => {
        const txFee = (gasPrice && gasUsed) ? JSBI.multiply(
            JSBI.BigInt(gasPrice),
            JSBI.BigInt(gasUsed)
        ).toString() : "0";
        const gasPriceGWEI = (gasPrice) ? GWEI(gasPrice) : "0";
        const gasUsedRate = (gas && gasUsed) ? Math.round(Number(gasUsed) / Number(gas) * 10000) / 100 + "%" : "";
        return {
            txFee, gasPriceGWEI, gasUsedRate
        }
    }, [gasPrice, gasUsed, gas]);
    const functionFragment = useAddressFunctionFragment(to, methodId, useDispatch());

    return <>
        <Row>
            <Col xl={8} xs={24} style={{ marginTop: '14px' }}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Transaction Hash</Text>
            </Col>
            <Col xl={16} xs={24} style={{ marginTop: '14px' }}>
                <Text>
                    <Paragraph copyable>
                        {hash}
                    </Paragraph>
                </Text>
            </Col>
        </Row>
        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col span={8}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Status</Text>
            </Col>
            <Col span={16}>
                {
                    status && status === 1 &&
                    <Tag icon={<CheckCircleOutlined />} color="green">
                        Success
                    </Tag>
                }
                {
                    status && status === 0 &&
                    <Tag icon={<CloseCircleOutlined />} color="red">
                        Fail
                    </Tag>
                }
            </Col>
        </Row>
        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col span={8}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Block</Text>
            </Col>
            <Col span={16}>
                <Text strong>
                    <NavigateLink path={`/block/${blockNumber}`}>
                        {blockNumber}
                    </NavigateLink>
                </Text>
            </Col>
        </Row>
        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col span={8}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>DateTime</Text>
            </Col>
            <Col span={16}>
                <Text>
                    {
                        timestamp ? <>{DateFormat(timestamp * 1000)}</> : <></>
                    }
                </Text>
            </Col>
        </Row>

        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col xl={8} xs={24} style={{ marginTop: '14px' }}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>From</Text>
            </Col>
            <Col xl={16} xs={24} style={{ marginTop: '14px' }}>
                <NavigateLink path={`/address/${from}`}>
                    <Paragraph copyable style={{ color: "rgba(52, 104, 171, 0.85)" }}>
                        {from}
                    </Paragraph>
                </NavigateLink>
            </Col>
        </Row>
        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col xl={8} xs={24} style={{ marginTop: '14px' }}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>To</Text>
            </Col>
            <Col xl={16} xs={24} style={{ marginTop: '14px' }}>
                <NavigateLink path={`/address/${to}`}>
                    <Paragraph copyable style={{ color: "rgba(52, 104, 171, 0.85)" }}>
                        {to}
                    </Paragraph>
                </NavigateLink>
            </Col>
        </Row>

        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col xl={8} xs={24}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Value</Text>
            </Col>
            <Col xl={16} xs={24}>
                {
                    value && <EtherAmount raw={value.toString()} fix={18} />
                }
            </Col>
        </Row>

        <Row style={{ margin: '18px 0px' }}>
            <Col xl={8} xs={24}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Txn Fee</Text>
            </Col>
            <Col xl={16} xs={24}>
                {
                    <EtherAmount raw={txFee} fix={18}></EtherAmount>
                }
            </Col>
        </Row>

        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col xl={8} xs={24}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Gas Price</Text>
            </Col>
            <Col xl={16} xs={24}>
                {
                    <><EtherAmount raw={gasPrice} fix={18}></EtherAmount> ({gasPriceGWEI}Gwei) </>
                }
            </Col>
        </Row>

        <Row style={{ margin: '18px 0px' }}>
            <Col xl={8} xs={24}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Gas Limit <Divider type="vertical" /> Usage by Txn</Text>
            </Col>
            <Col xl={16} xs={24}>
                {
                    <>
                        <Text>{gas && format(`${gas}`)}</Text>
                        <Divider type="vertical" />
                        <Text>{gasUsed && format(gasUsed)} ({gasUsedRate})</Text>
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
                <Text strong style={{ marginLeft: "5px" }}>Other Attributes</Text>
            </Col>
            <Col xl={16} xs={24}>
                {
                    <>
                        <Tag>{`Position:${transactionIndex}`}</Tag>
                        <Tag>{`Nonce:${nonce}`}</Tag>
                    </>
                }
            </Col>
        </Row>

        <Row style={{ margin: '18px 0px' }}>
            <Col xl={8} xs={24} style={{ marginTop: '14px' }}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Input Data</Text>
            </Col>
            <Col xl={16} xs={24} style={{ marginTop: '14px' }}>
                <TxInput raw={input} fragment={functionFragment} methodId={methodId} ></TxInput>
            </Col>
        </Row>

    </>

}
import { Typography, Row, Col, Divider, Tooltip, Table, Space, Tag, List } from 'antd';
import { defaultAbiCoder } from 'ethers/lib/utils';
import NavigateLink from '../../components/NavigateLink';
import { ContractInternalTransactionVO, EventLogVO } from '../../services';
import { useMethodSignature } from '../../state/application/hooks';
import { Abi_Method_Define, Abi_Method_Param } from '../../utils/decode';
import { Link as RouterLink } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table';
import EtherAmount from '../../components/EtherAmount';
import { format } from '../../utils/NumberFormat';
import shape from '../../images/shape-1.svg'
import shape2 from '../../images/shape-2.svg'

import {
    CheckCircleTwoTone,
    CloseCircleTwoTone,
    ArrowRightOutlined,
    LogoutOutlined,
    ExportOutlined
} from '@ant-design/icons';
import { useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import Address, { ChecksumAddress } from '../../components/Address';

const { Text, Link } = Typography;

export default ({
    contractInternalTransactions,
    from,
    to
}: {
    contractInternalTransactions: ContractInternalTransactionVO[] | undefined,
    from: string | undefined,
    to: string | undefined
}) => {

    const TypeTraceAddress = ({ level, status, type }: { level: number, status: number, type: string }) => {
        let content = `${type.toLowerCase()}_0`;
        for (let i = 0; i < level; i++) {
            content += "_1";
        }
        let _level = [];
        for (let i = 1; i < level; i++) {
            _level.push(i);
        }
        return <>
            {
                !isMobile && <>
                    <img src={shape} width={"3%"} style={{ margin: "0.5%", marginTop: "-2%" }} />
                    {
                        _level.map(() => <img src={shape2} width={"3%"} style={{ margin: "0.5%", marginTop: "-2%" }} />)
                    }

                </>
            }
            {
                <>
                    {
                        status == 1 &&
                        <CheckCircleTwoTone style={{ marginLeft: "4px", marginRight: "4px" }} twoToneColor="#52c41a" />
                    }
                    {
                        status == 0 &&
                        <CloseCircleTwoTone style={{ marginLeft: "4px", marginRight: "4px" }} twoToneColor="red" />
                    }
                    {content}
                </>
            }
        </>
    }

    const isExternalAddress = useCallback((address: string) => {
        return !(address === from || address === to);
    }, [from, to]);


    const columns: ColumnsType<ContractInternalTransactionVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Type Trace Address</Text>,
            dataIndex: 'level',
            render: (level, txVO) => <TypeTraceAddress {...txVO}></TypeTraceAddress>,
            width: 150,
            fixed: true
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
            dataIndex: 'from',
            render: (from, txVO) =>
                <Row>
                    <Col span={22}>
                        <Address address={from} propVO={txVO.fromPropVO} />
                    </Col>
                    <Col span={2} >
                        <ArrowRightOutlined />
                    </Col>
                </Row>
            ,
            width: 100,
        },
        {
            title: <><Text strong style={{ color: "#6c757e" }}>To</Text></>,
            dataIndex: 'to',
            render: (to, txVO) =>
                <Row>
                    {
                        isExternalAddress(to) &&
                        <Col span={2} >
                            <Tooltip title="An External Address">
                                <ExportOutlined />
                            </Tooltip>
                        </Col>
                    }
                    <Col span={22}>
                        <Address address={to} propVO={txVO.toPropVO} />
                    </Col>
                </Row>
            ,
            width: 100,
        },
        {
            title: <><Text strong style={{ color: "#6c757e" }}>Value</Text></>,
            dataIndex: 'value',
            render: (value, txVO) => <>
                <Text strong>
                    <EtherAmount raw={value} fix={18} />
                </Text>
            </>,
            width: 180,
        },
        {
            title: <><Text strong style={{ color: "#6c757e" }}>Gas Limit</Text></>,
            dataIndex: 'gas',
            render: (gas, txVO) => <>
                {format(gas)}
            </>,
            width: 80,
        },
    ]

    return <>
        <Text>
            The contract call <Text strong>From
                {from && <Tooltip title={from} color='black'><RouterLink to={`/address/${ChecksumAddress(from)}`}>
                    <Link ellipsis style={{
                        marginLeft: "4px",
                        marginRight: "4px",
                        width: "240px"
                    }}>{ChecksumAddress(from)}</Link>
                </RouterLink></Tooltip>}
                To
                {to && <Tooltip title={to} color='black'><RouterLink to={`/address/${ChecksumAddress(to)}`}>
                    <Link ellipsis style={{
                        marginLeft: "4px",
                        marginRight: "4px",
                        width: "240px"
                    }}>{ChecksumAddress(to)}</Link>
                </RouterLink></Tooltip>}
            </Text>
            produced {contractInternalTransactions?.length} Internal Transactions
        </Text>

        <Row>
            <Col xl={24} xs={0}>
                <Table style={{ marginTop: "12px" }} columns={columns} dataSource={contractInternalTransactions} scroll={{ x: 800 }}
                    rowKey={(vo) => vo.id}
                    pagination={false}
                />
            </Col>
            <Col xl={0} xs={24}>
                <Divider style={{ marginTop: "15px", marginBottom: "1px" }} />
                <List
                    dataSource={contractInternalTransactions}
                    style={{ paddingLeft: "2px", paddingRight: "2px" }}
                    renderItem={(internalTx) => (
                        <List.Item>
                            <Row style={{ lineHeight: "26px", fontSize: "14px", letterSpacing: "-1px" }}>
                                <Col xs={16}>
                                    <TypeTraceAddress {...internalTx} />
                                </Col>
                                <Col xs={8}>
                                    <Text>
                                        GasLimit:{format(internalTx.gas)}
                                    </Text>
                                </Col>
                                <Col xs={24}>
                                    <Text strong>From</Text>
                                </Col>
                                <Col xs={24}>
                                    <RouterLink to={`/address/${internalTx.from}`}>
                                        <Link ellipsis>
                                            {internalTx.from}
                                        </Link>
                                    </RouterLink>
                                </Col>
                                <Col xs={24}>
                                    <Text strong>To</Text>
                                </Col>
                                <Col xs={24}>
                                    <RouterLink to={`/address/${internalTx.to}`}>
                                        <Link ellipsis>
                                            {internalTx.to}
                                        </Link>
                                    </RouterLink>
                                </Col>
                                <Col xs={24}>
                                    <Text strong>Value</Text>
                                </Col>
                                <Col xs={24}>
                                    <EtherAmount raw={internalTx.value} fix={18} />
                                </Col>
                            </Row>
                        </List.Item>
                    )}
                />
            </Col>
        </Row>

    </>

}
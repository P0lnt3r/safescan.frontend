import { Typography, Row, Col, Divider, Tooltip, Table, Space, Tag } from 'antd';
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

    const TypeTraceAddress = ({ level, status }: { level: number, status: number }) => {
        let content = "call_0";
        for (let i = 0; i < level; i++) {
            content += "_1";
        }
        let _level = [];
        for (let i = 1; i < level; i++) {
            _level.push(i);
        }
        return <>
            <img src={shape} width={"3%"} style={{ margin: "0.5%", marginTop: "-2%" }} />
            {
                _level.map(() => <img src={shape2} width={"3%"} style={{ margin: "0.5%", marginTop: "-2%" }} />)
            }
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

    const isExternalAddress = useCallback((address: string) => {
        return !(address === from || address === to);
    }, [from, to]);


    const columns: ColumnsType<ContractInternalTransactionVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Type Trace Address</Text>,
            dataIndex: 'level',
            render: (level, txVO) => <TypeTraceAddress level={level} status={txVO.status}></TypeTraceAddress>,
            width: 150,
            fixed:true
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
            dataIndex: 'from',
            render: (from, txVO) =>
                <Row>
                    <Col span={22}>
                        <Tooltip title={from}>
                            <RouterLink to={`/address/${from}`}>
                                <Link ellipsis>{from}</Link>
                            </RouterLink>
                        </Tooltip>
                    </Col>
                    <Col span={2} >
                        <ArrowRightOutlined />
                    </Col>
                </Row>
            ,
            width: 100,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
            dataIndex: 'to',
            render: (to, txVO) =>
                <Row>
                    {
                        isExternalAddress(to) &&
                        <Col span={4} >
                            <Tooltip title="An External Address">
                                <ExportOutlined />
                            </Tooltip>
                        </Col>
                    }
                    <Col span={18}>
                        <Tooltip title={to}>
                            <RouterLink to={`/address/${to}`}>
                                <Link ellipsis>{to}</Link>
                            </RouterLink>
                        </Tooltip>
                    </Col>
                </Row>
            ,
            width: 100,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
            dataIndex: 'value',
            render: (value, txVO) => <>
                <Text strong>
                    <EtherAmount raw={value} fix={18} />
                </Text>
            </>,
            width: 180,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Gas Limit</Text>,
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
                {from && <Tooltip title={from} color='black'><RouterLink to={`/address/${from}`}>
                    <Link ellipsis style={{
                        marginLeft: "4px",
                        marginRight: "4px",
                        width: "200px"
                    }}>{from}</Link>
                </RouterLink></Tooltip>}
                To
                {to && <Tooltip title={to} color='black'><RouterLink to={`/address/${to}`}>
                    <Link ellipsis style={{
                        marginLeft: "4px",
                        marginRight: "4px",
                        width: "200px"
                    }}>{to}</Link>
                </RouterLink></Tooltip>}
            </Text>
            produced {contractInternalTransactions?.length} Internal Transactions
        </Text>

        <Table style={{ marginTop: "12px" }} columns={columns} dataSource={contractInternalTransactions} scroll={{ x: 800 }}
            rowKey={(vo) => vo.id}
            pagination={false}
        />

    </>

}
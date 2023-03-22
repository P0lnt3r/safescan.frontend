import { useCallback, useEffect, useMemo, useState } from "react"
import { TransactionVO } from "../../services";
import { fetchAddressTransactions } from "../../services/tx";
import { PaginationProps, Table, Typography, Row, Col, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import AddressTag, { ShowStyle } from '../../components/AddressTag';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import EtherAmount from '../../components/EtherAmount';
import NavigateLink from "../../components/NavigateLink";
import TxMethodId from "../../components/TxMethodId";
import { ArrowRightOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link as RouterLink } from "react-router-dom";
import { JSBI } from "@uniswap/sdk";

const { Text, Link } = Typography;

export default ({ address }: { address: string }) => {
    const { t } = useTranslation();

    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchAddressTransactions();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    const [tableData, setTableData] = useState<TransactionVO[]>([]);

    async function doFetchAddressTransactions() {
        console.log("doFetchAddressTransactions :", pagination.current);
        fetchAddressTransactions({
            current: pagination.current,
            pageSize: pagination.pageSize,
            address: address
        }).then(data => {
            setPagination({
                ...pagination,
                current: data.current,
                pageSize: data.pageSize,
                onChange:paginationOnChange,
                total: data.total,
            })
            setTableData(data.records);
        })
    }

    useEffect(() => {
        pagination.current = 1;
        doFetchAddressTransactions();
    }, [address]);

    const columns: ColumnsType<TransactionVO> = [
        {
            title: <>{t('Txn Hash')}</>,
            dataIndex: 'hash',
            key: 'hash',
            render: (val, txVO) => <TransactionHash txhash={val} sub={8} status={txVO.status}></TransactionHash>,
            width: 180,
            fixed: 'left',
        },
        {
            title: 'Method',
            dataIndex: 'methodId',
            width: 100,
            render: (methodId, txVO) => <TxMethodId methodId={methodId} address={txVO.to} />
        },
        {
            title: 'Block',
            dataIndex: 'blockNumber',
            width: 80,
            render: blockNumber => <NavigateLink path={`/block/${blockNumber}`}>{blockNumber}</NavigateLink>
        },
        {
            title: 'Date Time',
            dataIndex: 'timestamp',
            width: 130,
            render: (val) => <>{DateFormat(val * 1000)}</>
        },
        {
            title: "From",
            dataIndex: 'from',
            width: 180,
            render: (from, txVO) => {
                const { fromPropVO } = txVO;
                const tag = fromPropVO?.tag;
                return <>
                    <Row>
                        <Col span={20}>
                            <Tooltip title={from}>
                                {
                                    address === from
                                        ? <Text style={{ width: "80%" }} ellipsis>
                                            {tag ? tag : from}
                                        </Text>
                                        :
                                        <NavigateLink path={`/address/${from}`}>
                                            <Link style={{ width: "80%" }} ellipsis>{tag ? tag : from}</Link>
                                        </NavigateLink>
                                }
                            </Tooltip>
                        </Col>
                        <Col span={4}>
                            {
                                address === from
                                    ? <Text code strong style={{ color: "orange" }}>OUT</Text>
                                    : <Text code strong style={{ color: "green" }}>IN</Text>
                            }
                        </Col>
                    </Row>
                </>
            }
        },
        {
            title: 'To',
            dataIndex: 'to',
            width: 180,
            render: (to, txVO) => {
                const { methodId, toPropVO } = txVO;
                const tag = toPropVO?.tag;
                const type = toPropVO?.type;
                return <>
                    {
                        (methodId || type === "contract") && <Tooltip title="Contract"><FileTextOutlined /></Tooltip>
                    }
                    <Tooltip title={to}>
                        {
                            address === to
                                ? <Text style={{ width: "80%", marginLeft: "5px" }} ellipsis>
                                    {tag ? tag : to}
                                </Text>
                                : <NavigateLink path={`/address/${to}`}>
                                    <Link style={{ width: "80%", marginLeft: "5px" }} ellipsis>{tag ? tag : to}</Link>
                                </NavigateLink>
                        }
                    </Tooltip>

                </>

            }
        },
        {
            title: 'Value',
            dataIndex: 'value',
            width: 100,
            render: (value) => <Text strong><EtherAmount raw={value} /></Text>
        },
        {
            title: 'Txn Fee',
            dataIndex: 'txFee',
            width: 100,
            render: (_, txVO) => {
                const { gasPrice, gasUsed } = txVO;
                const txFee = (gasPrice && gasUsed) ? JSBI.multiply(
                    JSBI.BigInt(gasPrice),
                    JSBI.BigInt(gasUsed)
                ).toString() : "0";
                return <>
                    <Text type="secondary">
                        <EtherAmount raw={txFee.toString()} fix={6} ignoreLabel />
                    </Text>
                </>
            }
        },
    ];

    return <>

        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(txVO: TransactionVO) => txVO.hash}
        />

    </>

}
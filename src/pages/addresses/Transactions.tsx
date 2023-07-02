import { useCallback, useEffect, useMemo, useState } from "react"
import { TransactionVO } from "../../services";
import { fetchAddressTransactions } from "../../services/tx";
import { PaginationProps, Table, Typography, Row, Col, Tooltip, TablePaginationConfig } from 'antd';
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
import { format } from "../../utils/NumberFormat";

const { Text, Link } = Typography;

const DEFAULT_PAGESIZE = 10;

export default ({ address }: { address: string }) => {

    const { t } = useTranslation();

    const [tableData, setTableData] = useState<TransactionVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [unconfirmed, setUnconfirmed] = useState<number>(0);
    const [confirmed, setConfirmed] = useState<number>(0);

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        position: ["topRight", "bottomRight"],
        pageSizeOptions: [],
        responsive: true,
    });

    async function doFetchAddressTransactions() {
        setLoading(true)
        fetchAddressTransactions({
            current: pagination.current,
            pageSize: pagination.pageSize,
            address: address
        }).then(data => {
            setLoading(false)
            setTableData(data.records);
            const unconfirmed = [];
            data.records.forEach(tx => {
                if (tx.confirmed != 1) {
                    unconfirmed.push(tx);
                }
            })
            setConfirmed(data.total);
            setUnconfirmed(unconfirmed.length);
            const onChange = (page: number, pageSize: number) => {
                pagination.pageSize = unconfirmed.length > 0 ? pageSize - unconfirmed.length : pageSize;
                pagination.current = page;
                doFetchAddressTransactions();
            }
            if (pagination.current == 1) {
                const total = data.total;
                const dbSize = data.pageSize;
                const dbPages = Math.floor(total / dbSize);
                const uiTotal = (dbPages * unconfirmed.length) + total;
                setPagination({
                    ...pagination,
                    current: data.current,
                    total: uiTotal,
                    pageSize: data.records.length,
                    onChange: onChange
                })
            } else {
                setPagination({
                    ...pagination,
                    current: data.current,
                    total: data.total,
                    pageSize: data.pageSize,
                    onChange: onChange
                })
            }

        })
    }

    useEffect(() => {
        pagination.current = 1;
        doFetchAddressTransactions();
    }, [address]);

    function OutputTotal() {
        return <>
            {
                confirmed != unconfirmed && <Text strong style={{ color: "#6c757e" }}>Total of {
                    confirmed && <>{format(confirmed + "")}</>
                } Transactions
                    {unconfirmed > 0 && <Text> and {unconfirmed} unconfirmed</Text>}
                </Text>
            }
        </>
    }

    const columns: ColumnsType<TransactionVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
            dataIndex: 'hash',
            key: 'hash',
            render: (val, txVO) => <><TransactionHash blockNumber={txVO.blockNumber} txhash={val} sub={8} status={txVO.status}></TransactionHash></>,
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
                                        <RouterLink to={`/address/${from}`}>
                                            <Link style={{ width: "80%" }} ellipsis>{tag ? tag : from}</Link>
                                        </RouterLink>
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
                                : <RouterLink to={`/address/${to}`}>
                                    <Link style={{ width: "80%", marginLeft: "5px" }} ellipsis>{tag ? tag : to}</Link>
                                </RouterLink>
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
        <OutputTotal></OutputTotal>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            loading={loading}
            pagination={pagination} rowKey={(txVO: TransactionVO) => txVO.hash}
        />

    </>

}
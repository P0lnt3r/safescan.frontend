import { useCallback, useEffect, useMemo, useState } from "react"
import { ContractInternalTransactionVO, TransactionVO } from "../../services";
import { fetchAddressContractInternalTransactions, fetchAddressTransactions } from "../../services/tx";
import { PaginationProps, Table, Typography, Row, Col, Tooltip, TablePaginationConfig } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import EtherAmount from '../../components/EtherAmount';
import { ArrowRightOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link as RouterLink } from "react-router-dom";
import { JSBI } from "@uniswap/sdk";
import { format } from "../../utils/NumberFormat";
import BlockNumber from "../../components/BlockNumber";

const { Text, Link } = Typography;

const DEFAULT_PAGESIZE = 10;

export default ({ address }: { address: string }) => {

    const { t } = useTranslation();

    const [tableData, setTableData] = useState<ContractInternalTransactionVO[]>([]);
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

    async function doFetchAddressContractIntenalTransactions() {
        setLoading(true)
        fetchAddressContractInternalTransactions({
            current: pagination.current,
            pageSize: pagination.pageSize,
            address: address
        }).then(data => {
            setLoading(false)
            setTableData(data.records);
            console.log(data.records);
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
                doFetchAddressContractIntenalTransactions();
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
        doFetchAddressContractIntenalTransactions();
    }, [address]);

    function OutputTotal() {
        return <>
            {
                confirmed != unconfirmed && <Text strong style={{ color: "#6c757e" }}>Total of {
                    confirmed && <>{format(confirmed + "")}</>
                } Contract Internal Transactions
                    {unconfirmed > 0 && <Text> and {unconfirmed} unconfirmed</Text>}
                </Text>
            }
        </>
    }

    const columns: ColumnsType<ContractInternalTransactionVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
            dataIndex: 'blockNumber',
            render: (blockNumber,txVO) => <BlockNumber blockNumber={blockNumber} confirmed={txVO.confirmed}></BlockNumber> ,
            fixed: true,
            width: 100
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date</Text>,
            dataIndex: 'timestamp',
            render: (val) => <>{DateFormat(val * 1000)}</>,
            width: 180
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Parent Txn Hash</Text>,
            dataIndex: 'transactionHash',
            render: (val, txVO) => <TransactionHash txhash={val} sub={8} status={txVO.status}></TransactionHash>,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Type</Text>,
            dataIndex: 'type',
            render: (val, txVO) => <>{val}</>,
            width: 140
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
            dataIndex: 'from',
            render: (val, txVO) => <Text ellipsis>{val}</Text>,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
            dataIndex: 'to',
            render: (val, txVO) => <Text ellipsis>{val}</Text>,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
            dataIndex: 'value',
            render: (val, txVO) => <>
                <Text strong><EtherAmount raw={val} fix={18} /></Text>
            </>,
        },
    ]

    return <>
        <OutputTotal></OutputTotal>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            loading={loading}
            pagination={pagination}
        />

    </>

}
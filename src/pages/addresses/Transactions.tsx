import { useCallback, useEffect, useMemo, useState } from "react"
import { TransactionVO } from "../../services";
import { fetchAddressTransactions } from "../../services/tx";
import { PaginationProps, Table, Typography, Row, Col, Tooltip, TablePaginationConfig } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import EtherAmount from '../../components/EtherAmount';
import TxMethodId from "../../components/TxMethodId";
import { ArrowRightOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link as RouterLink } from "react-router-dom";
import { format } from "../../utils/NumberFormat";
import BlockNumber from "../../components/BlockNumber";
import Address from "../../components/Address";

const { Text, Link } = Typography;
const DEFAULT_PAGESIZE = 20;

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
        pagination.pageSize = DEFAULT_PAGESIZE;
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
            width: 150,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Method</Text>,
            dataIndex: 'methodId',
            width: 100,
            render: (methodId, txVO) => <TxMethodId methodId={methodId} address={txVO.to} />
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
            dataIndex: 'blockNumber',
            width: 80,
            render: (blockNumber,txVO) => <BlockNumber blockNumber={blockNumber} confirmed={txVO.confirmed}></BlockNumber> 
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
            dataIndex: 'timestamp',
            width: 120,
            render: (val) => <>{DateFormat(val * 1000)}</>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
            dataIndex: 'from',
            width: 150,
            render: (from, txVO) => {
                const { fromPropVO } = txVO;
                const hasLink = !(address == from);
                return <>
                    <Row>
                        <Col span={20}>
                            <Address address={from} propVO={fromPropVO} style={ {hasLink:false} } />
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
            title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
            dataIndex: 'to',
            width: 150,
            render: (to, txVO) => {
                const { methodId, toPropVO } = txVO;
                const hasLink = address != to;
                return <>
                    <Address address={to} propVO={toPropVO} style={ {hasLink} }></Address>
                </>

            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
            dataIndex: 'value',
            width: 150,
            render: (value) => <Text strong><EtherAmount raw={value} /></Text>
        },
        // {
        //     title: 'Txn Fee',
        //     dataIndex: 'txFee',
        //     width: 100,
        //     render: (_, txVO) => {
        //         const { gasPrice, gasUsed } = txVO;
        //         const txFee = (gasPrice && gasUsed) ? JSBI.multiply(
        //             JSBI.BigInt(gasPrice),
        //             JSBI.BigInt(gasUsed)
        //         ).toString() : "0";
        //         return <>
        //             <Text type="secondary">
        //                 <EtherAmount raw={txFee.toString()} fix={6} ignoreLabel />
        //             </Text>
        //         </>
        //     }
        // },
    ];

    return <>
        <OutputTotal></OutputTotal>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            loading={loading}
            pagination={pagination} rowKey={(txVO: TransactionVO) => txVO.hash}
        />

    </>

}
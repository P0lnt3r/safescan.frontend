import { Row, Typography, Card, Table } from "antd"
import { useEffect, useState } from "react";
import { ContractInternalTransactionVO } from "../../services";
import { fetchContractInternalTransactions } from "../../services/tx";
import { PaginationProps } from "antd/es/pagination";
import { ColumnsType } from "antd/lib/table";
import TransactionHash from "../../components/TransactionHash";
import NavigateLink from "../../components/NavigateLink";
import { DateFormat } from "../../utils/DateUtil";
import EtherAmount from "../../components/EtherAmount";

const { Title, Text, Link } = Typography;

export default () => {

    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchContranctInternalTransactions();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 20,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    const [tableData, setTableData] = useState<ContractInternalTransactionVO[]>([]);

    async function doFetchContranctInternalTransactions() {
        fetchContractInternalTransactions({
            current: pagination.current,
            pageSize: pagination.pageSize,
        }).then(data => {
            setPagination({
                ...pagination,
                current: data.current,
                pageSize: data.pageSize,
                total: data.total,
                onChange: paginationOnChange,
            })
            setTableData(data.records);
        })
    }
    useEffect(() => {
        pagination.current = 1;
        doFetchContranctInternalTransactions();
    }, []);

    const columns: ColumnsType<ContractInternalTransactionVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
            dataIndex: 'blockNumber',
            render: blockNumber => <NavigateLink path={`/block/${blockNumber}`}>{blockNumber}</NavigateLink>,
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

    return (<>

        <Row>
            <Title level={3}>Contract Internal Transactions</Title>
        </Row>
        <Card>
            <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
                pagination={pagination} rowKey={(txVO: ContractInternalTransactionVO) => txVO.id}
            />
        </Card>
    </>)
}
import { Row, Typography, Card, Table, Col, List, Divider, Skeleton } from "antd"
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from "react";
import { ContractInternalTransactionVO } from "../../services";
import { fetchContractInternalTransactions } from "../../services/tx";
import { PaginationProps } from "antd/es/pagination";
import { ColumnsType } from "antd/lib/table";
import TransactionHash from "../../components/TransactionHash";
import NavigateLink from "../../components/NavigateLink";
import { DateFormat } from "../../utils/DateUtil";
import EtherAmount from "../../components/EtherAmount";
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Address from "../../components/Address";

const { Title, Text, Link } = Typography;

const DEFAULT_PAGESIZE = 20;

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

    async function doFetchContranctInternalTransactions( current ?: number ) {
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
            render: (val, txVO) => <TransactionHash txhash={val} status={txVO.status}></TransactionHash>,
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

    const [loading, setLoading] = useState<boolean>(false);
    const [unconfirmed, setUnconfirmed] = useState<number>(0);
    const [confirmed, setConfirmed] = useState<number>(0);

    function listHasMore(): boolean {
        if (pagination.current && pagination.total) {
          const totalPages = Math.floor(pagination.total / pagination.current)
          return pagination.current < totalPages;
        }
        return true;
      }
      function listNext() {
        if (pagination.current && !loading) {
          pagination.pageSize = DEFAULT_PAGESIZE;
          doFetchContranctInternalTransactions(pagination.current + 1);
        }
      }

    return (<>
        <Row>
            <Title level={3}>Contract Internal Transactions</Title>
        </Row>
        <Card>
            <Row style={{ width: "100%" }}>
                <Col xl={24} xs={0}>
                    <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
                        pagination={pagination} rowKey={(txVO: ContractInternalTransactionVO) => txVO.id}
                    />
                </Col>
                <Col xl={24} xs={24}>
                    <div
                        id="scrollableDiv"
                        style={{
                            height: 600,
                            overflow: 'auto',
                            padding: '0 4px',
                        }}
                    >
                        <InfiniteScroll
                            dataLength={tableData.length}
                            next={listNext}
                            hasMore={listHasMore()}
                            pullDownToRefresh
                            refreshFunction={() => {
                                doFetchContranctInternalTransactions(1);
                            }}
                            releaseToRefreshContent={<Divider plain>Release to refresh</Divider>}
                            pullDownToRefreshContent={<Divider plain>Release to refresh</Divider>}
                            pullDownToRefreshThreshold={2}
                            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                            scrollableTarget="scrollableDiv"
                        >
                            <List
                                dataSource={tableData}
                                loading={loading}
                                renderItem={(internalTxn) => {
                                    const { blockNumber,  transactionHash, timestamp ,confirmed, value, status,
                                        from, fromPropVO, to, toPropVO } = internalTxn;
                                    return <>
                                        <List.Item key={transactionHash}>
                                            <Row style={{ width: "100%" }}>
                                                <Col span={12}>
                                                    {
                                                        confirmed == 1 ? <RouterLink to={`/block/${blockNumber}`}>{blockNumber}</RouterLink> :
                                                            <RouterLink to={`/block/${blockNumber}`}>
                                                                <Link italic underline>{blockNumber}</Link>
                                                            </RouterLink>
                                                    }
                                                </Col>
                                                <Col span={12} style={{ textAlign: "right" }}>
                                                    <Text>{DateFormat(Number(timestamp) * 1000)}</Text>
                                                </Col>
                                                <Col span={24}>
                                                    <Text strong style={{ marginRight: "2px" }}>Hash:</Text>
                                                    <TransactionHash txhash={transactionHash} status={status} blockNumber={blockNumber} />
                                                </Col>
                                                <Col span={24}>
                                                    <Text strong style={{ marginRight: "2px" }}>From:</Text>
                                                    <Address address={from} propVO={fromPropVO} />
                                                </Col>
                                                <Col span={24}>
                                                    <Text strong style={{ marginRight: "2px" }}>To:</Text>
                                                    <Address address={to} propVO={toPropVO} />
                                                </Col>
                                                <Col span={24}>
                                                    <Text code style={{ float: "right" }}><EtherAmount raw={value} fix={6} /></Text>
                                                </Col>
                                            </Row>
                                        </List.Item>
                                    </>
                                }}
                            />
                        </InfiniteScroll>
                    </div>
                </Col>
            </Row>
        </Card>
    </>)
}
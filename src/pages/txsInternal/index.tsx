import { Row, Typography, Card, Table, Col, List, Divider, Skeleton, TablePaginationConfig } from "antd"
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
import { useTranslation } from 'react-i18next';
import BlockNumber from "../../components/BlockNumber";
import { isMobile } from "react-device-detect";
import {
    CheckCircleTwoTone,
    CloseCircleTwoTone,
    ArrowRightOutlined,
    LogoutOutlined,
    ExportOutlined
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const DEFAULT_PAGESIZE = 20;

export default () => {

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

    async function doFetchContranctInternalTransactions(current?: number) {
        setLoading(true);
        fetchContractInternalTransactions({
            current: current ? current : pagination.current,
            pageSize: pagination.pageSize,
        }).then(data => {
            setLoading(false);
            if (current && current > 1) { 
                const loaded = tableData.map((txVO) => {
                    return (txVO.blockNumber + txVO.transactionHash);
                });
                const prepareLoad = data.records.filter((txVO) => {
                    return loaded.indexOf((txVO.blockNumber + txVO.transactionHash)) == -1;
                });
                setTableData([...tableData, ...prepareLoad]);
            } else {
                setTableData(data.records);
            }
            const unconfirmed = [];
            data.records.forEach(tx => {
                if (tx.confirmed != 1) {
                    unconfirmed.push(tx);
                }
            })
            const onChange = (page: number, pageSize: number) => {
                pagination.pageSize = unconfirmed.length > 0 ? pageSize - unconfirmed.length : pageSize;
                pagination.current = page;
                doFetchContranctInternalTransactions();
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
        doFetchContranctInternalTransactions();
    }, []);

    const columns: ColumnsType<ContractInternalTransactionVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
            dataIndex: 'blockNumber',
            render: (blockNumber, txVO) => <BlockNumber blockNumber={blockNumber} confirmed={txVO.confirmed}></BlockNumber>,
            fixed: true,
            width: 80
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date</Text>,
            dataIndex: 'timestamp',
            render: (val) => <>{DateFormat(val * 1000)}</>,
            width: 160
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Parent Txn Hash</Text>,
            dataIndex: 'transactionHash',
            render: (val, txVO) => <TransactionHash txhash={val} status={txVO.status} blockNumber={txVO.blockNumber}></TransactionHash>,
            width:240,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Type</Text>,
            dataIndex: 'type',
            render: (val, txVO) => <>{val}</>,
            width: 80
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
            dataIndex: 'from',
            width:200,
            render: (from, txVO) => <Address address={from} propVO={txVO.fromPropVO} />,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
            dataIndex: 'to',
            width:200,
            render: (to, txVO) => <Address address={to} propVO={txVO.toPropVO} />,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
            dataIndex: 'value',
            width:220,
            render: (val, txVO) => <>
                <Text strong><EtherAmount raw={val} fix={18} /></Text>
            </>,
        },
    ]

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
        </>
    }

    return (<>
        <Row>
            <Title level={3}>Contract Internal Transactions</Title>
        </Row>
        <Card>
            <Row style={{ width: "100%" }}>
                <Col xl={24} xs={0}>
                    <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }} loading={loading}
                        pagination={pagination} rowKey={(txVO: ContractInternalTransactionVO) => txVO.id}
                    />
                </Col>
                <Col xl={0} xs={24}>
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
                                    const { blockNumber, transactionHash, timestamp, confirmed, value, status,
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
                                                    <ArrowRightOutlined style={{ marginRight: "5px" }} />
                                                    <Text strong style={{ marginRight: "2px" }}>To:</Text>
                                                    <Address address={to} propVO={toPropVO} />
                                                </Col>
                                                <Col span={24}>
                                                    <Text>
                                                        <TypeTraceAddress {...internalTxn} />
                                                    </Text>
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
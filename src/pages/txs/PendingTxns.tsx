import { Card, Table, Typography, Row, Col, Tooltip, List, Divider, Skeleton, Tag } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { TransactionVO } from '../../services';
import { fetchPendingTransactions, fetchTransactions } from '../../services/tx';
import { useTranslation } from 'react-i18next';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import EtherAmount, { GWEI } from '../../components/EtherAmount';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import TxMethodId from '../../components/TxMethodId';
import NavigateLink from '../../components/NavigateLink';
import { useDispatch } from 'react-redux';
import { JSBI } from '@uniswap/sdk';
import { useBlockNumber, useDBStoredBlockNumber } from '../../state/application/hooks';
import { format } from '../../utils/NumberFormat';
import Address from '../../components/Address';

import {
  ArrowRightOutlined,
  FileTextOutlined,
  EnvironmentTwoTone
} from '@ant-design/icons';


const { Title, Text, Link } = Typography;
const DEFAULT_PAGESIZE = 20;

export default function () {

  const latestBlockNumber = useBlockNumber();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGESIZE,
    position: ["topRight", "bottomRight"],
    pageSizeOptions: [],
    responsive: true,
  });
  const [tableData, setTableData] = useState<TransactionVO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const doFetchPendingTransactions = async (current?: number) => {
    setLoading(true);
    fetchPendingTransactions({
      current: current ? current : pagination.current,
      pageSize: pagination.pageSize,
    }).then((data) => {
      setLoading(false);
      if (current && current > 1) {
        const loaded = tableData.map((txVO) => {
          return (txVO.hash);
        });
        const prepareLoad = data.records.filter((txVO) => {
          return loaded.indexOf(txVO.hash) == -1;
        });
        setTableData([...tableData, ...prepareLoad]);
      } else {
        setTableData(data.records);
      }
      const onChange = (page: number, pageSize: number) => {
        pagination.pageSize = pageSize;
        pagination.current = page;
        doFetchPendingTransactions();
      }
      setPagination({
        ...pagination,
        current: data.current,
        total: data.total,
        pageSize: data.pageSize,
        onChange: onChange
      })
    })
  }

  useEffect(() => {
    doFetchPendingTransactions();
  }, []);


  const columns: ColumnsType<TransactionVO> = [
    {
      title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
      dataIndex: 'hash',
      render: (val, txVO) => <><TransactionHash blockNumber={txVO.blockNumber} txhash={val} status={txVO.status}></TransactionHash></>,
      width: 180,
      fixed: 'left',
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Method</Text>,
      dataIndex: 'methodId',
      width: 100,
      render: (methodId, txVO) => <TxMethodId address={txVO.to} methodId={methodId}></TxMethodId>
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Nonce</Text>,
      dataIndex: 'nonce',
      width: 80,
      render: (nonce, vo) => {
        return <>
          {nonce}
        </>
      }
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Gas Price</Text>,
      dataIndex: 'value',
      width: 100,
      render: (_, txVO) => {
        const { gasPrice, gasUsed } = txVO;
        return <>
          <Text strong>
            {
              GWEI(gasPrice)
            } GWei
          </Text>
        </>
      }
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
      dataIndex: 'timestamp',
      width: 130,
      render: (val) => <>{DateFormat(val * 1000)}</>
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
      dataIndex: 'from',
      width: 180,
      render: (from, txVO) => {
        const { fromPropVO } = txVO;
        return <>
          <Row>
            <Col span={22}>
              <Address address={from} propVO={fromPropVO} />
            </Col>
            <Col>
              <ArrowRightOutlined />
            </Col>
          </Row>
        </>
      }
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
      dataIndex: 'to',
      width: 180,
      render: (to, txVO) => {
        const { toPropVO } = txVO;
        return <>
          <Address address={to} propVO={toPropVO} />
        </>
      }
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
      dataIndex: 'value',
      width: 100,
      render: (value) => <Text strong><EtherAmount raw={value.toString()} fix={6} /></Text>
    },
  ];

  function OutputTotal() {
    return <>
      {
        <Text strong style={{ color: "#6c757e" }}>
          A total of {pagination.total} pending txns found
        </Text>
      }
    </>
  }

  function listHasMore(): boolean {
    if ( loading ){
      return true;
    }
    if (pagination.current && pagination.total && pagination.pageSize) {
      const totalPages = Math.ceil(pagination.total / pagination.pageSize)
      console.log("listhasmore - totalPages :" , totalPages);
      console.log("listhasmore - current :" , pagination.current);
      console.log("listHasMore :" , pagination.current < totalPages)
      return pagination.current < totalPages;
    }
    return false;
  }
  function listNext() {
    if (pagination.current && !loading) {
      pagination.pageSize = DEFAULT_PAGESIZE;
      doFetchPendingTransactions(pagination.current + 1);
    }
  }

  return (
    <>
      <Row>
        <Title level={3}>Pending Transactions</Title>
      </Row>
      <Card>
        <Row style={{ width: "100%" }}>
          <Col xl={24} xs={0}>
            <OutputTotal />
            <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
              pagination={pagination} rowKey={(txVO) => txVO.hash}
              loading={loading}
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
                  doFetchPendingTransactions(1);
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
                  renderItem={(pendingTxVO) => {
                    const { hash, timestamp, value, methodId,
                      from, fromPropVO, to, toPropVO } = pendingTxVO;
                    return <>
                      <List.Item key={hash}>
                        <Row style={{ width: "100%" }}>
                          <Col span={12}>
                            <Tag color="rgba(119,131,143,.1)">
                              <EnvironmentTwoTone />
                              <Text style={{ color: "#77838f" }}>
                                Pending ...
                              </Text>
                            </Tag>
                          </Col>
                          <Col span={12} style={{ textAlign: "right" }}>
                            <Text>{DateFormat(Number(timestamp) * 1000)}</Text>
                          </Col>
                          <Col span={24}>
                            <Text strong style={{ marginRight: "2px" }}>Hash:</Text>
                            <TransactionHash txhash={hash} />
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
                            <Text style={{ textAlign: "left" }}>
                              Method :<TxMethodId address={to} methodId={methodId}></TxMethodId>
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

    </>
  )
}
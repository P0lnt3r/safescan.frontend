import { Card, Table, Typography, Row, Col, Tooltip, List, Progress } from 'antd';
import { Avatar, Divider, Skeleton } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { TransactionVO } from '../../services';
import { fetchTransactions } from '../../services/tx';
import { useTranslation } from 'react-i18next';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import { ArrowRightOutlined, FileTextOutlined } from '@ant-design/icons';
import EtherAmount from '../../components/EtherAmount';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import TxMethodId from '../../components/TxMethodId';
import NavigateLink from '../../components/NavigateLink';
import { useDispatch } from 'react-redux';
import { useBlockNumber, useDBStoredBlockNumber } from '../../state/application/hooks';
import { format } from '../../utils/NumberFormat';
import Address from '../../components/Address';
import InfiniteScroll from 'react-infinite-scroll-component';
import BlockNumber from '../../components/BlockNumber';
const { Title, Text, Link } = Typography;

const DEFAULT_PAGESIZE = 20;

export default function () {

  const [searchParams] = useSearchParams();
  const blockNumber = useMemo(() => {
    try {
      return Number(searchParams.get("block"));
    } catch (error) {
      return 0;
    }
  }, [searchParams]);
  const dispatch = useDispatch();

  const columns: ColumnsType<TransactionVO> = [
    {
      title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
      dataIndex: 'hash',
      render: (val, txVO) => <>
        <TransactionHash blockNumber={txVO.blockNumber} txhash={val} status={txVO.status}></TransactionHash>
      </>,
      width: 150,
      fixed: 'left',
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Method</Text>,
      dataIndex: 'methodId',
      width: 100,
      render: (methodId, txVO) => <TxMethodId address={txVO.to} methodId={methodId}></TxMethodId>
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
      dataIndex: 'blockNumber',
      width: 80,
      render: (blockNumber, vo) => {
        return <>
          <BlockNumber blockNumber={blockNumber} confirmed={vo.confirmed} />
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
        const tag = fromPropVO?.tag;
        const type = fromPropVO?.type;
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
    }
  ];

  const doFetchTransactions = async (current?: number) => {
    setLoading(true);
    console.log("Fetch page.size =" ,  pagination.pageSize)
    fetchTransactions({
      current: current ? current : pagination.current, pageSize: pagination.pageSize,
      blockNumber: blockNumber > 0 ? blockNumber : undefined
    }, dispatch).then((data) => {
      setLoading(false);
      if (current && current > 1) {
        const loadedTxHashs = tableData.map((txVO) => {
          return txVO.hash;
        });
        const prepareLoadTxs = data.records.filter((txVO) => {
          return loadedTxHashs.indexOf(txVO.hash) == -1;
        });
        setTableData([...tableData, ...prepareLoadTxs]);
      } else {
        setTableData(data.records);
      }
      const unconfirmed = [];
      data.records.forEach(tx => {
        if (tx.confirmed != 1) {
          unconfirmed.push(tx);
        }
      })
      setConfirmed(data.total);
      setUnconfirmed(unconfirmed.length);
      const onChange = (page: number, pageSize: number) => {
        if ( unconfirmed.length == data.records.length ){
          pagination.pageSize = pageSize;
        } else {
          pagination.pageSize = unconfirmed.length > 0 ? pageSize - unconfirmed.length : pageSize;
        }
        pagination.current = page;
        doFetchTransactions();
      }
      if (pagination.current == 1) {
        const total = data.total;
        const dbSize = data.pageSize;
        const dbPages = Math.floor(total / dbSize);
        const uiTotal = unconfirmed.length != dbSize ? (dbPages * unconfirmed.length) + total : total;
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

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGESIZE,
    position: ["topRight", "bottomRight"],
    pageSizeOptions: [],
    responsive: true,
  });

  const [tableData, setTableData] = useState<TransactionVO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [unconfirmed, setUnconfirmed] = useState<number>(0);
  const [confirmed, setConfirmed] = useState<number>(0);

  // useEffect(() => {
  //   if (pagination.current == 1 && dbStoredBlockNumber != latestBlockNumber && unconfirmed >= 0) {
  //     pagination.pageSize = DEFAULT_PAGESIZE;
  //     doFetchTransactions();
  //   }
  // }, [latestBlockNumber, dbStoredBlockNumber, blockNumber]);
  useEffect(() => {
    doFetchTransactions();
  }, []);
  function OutputTotal() {
    return <>
      {
        confirmed != unconfirmed && <Text strong style={{ color: "#6c757e" }}>Total of {
          confirmed && <>{format(confirmed + "")}</>
        } Transactions
          {unconfirmed > 0 && unconfirmed != pagination.pageSize && pagination.current == 1 && <Text> and {unconfirmed} unconfirmed</Text>}
        </Text>
      }
    </>
  }
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
      doFetchTransactions(pagination.current + 1);
    }
  }

  return (
    <>
      <Row>
        <Title level={3}>Transactions</Title>
        {
          blockNumber > 0 &&
          <Text type='secondary' style={{ lineHeight: "34px", marginLeft: "5px", fontSize: "18px" }}>
            For Block <NavigateLink path={`/block/${blockNumber}`}> #{blockNumber} </NavigateLink>
          </Text>
        }
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
                  doFetchTransactions(1);
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
                  renderItem={(transaction) => {
                    const { hash, blockNumber, timestamp, confirmed, value, status,
                      from, fromPropVO, to, toPropVO, methodId } = transaction;
                    return <>
                      <List.Item key={hash}>
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
                            <TransactionHash txhash={hash} status={status} blockNumber={blockNumber} />
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
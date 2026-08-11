import {
  Card,
  Table,
  Typography,
  Row,
  Col,
  List,
  Divider,
  Skeleton,
  Tag,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { TransactionVO } from "../../services";
import { fetchPendingTransactions } from "../../services/tx";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import EtherAmount, { GWEI } from "../../components/EtherAmount";
import { useSearchParams } from "react-router-dom";
import TxMethodId from "../../components/TxMethodId";
import Address from "../../components/Address";
import { ArrowRightOutlined, EnvironmentTwoTone } from "@ant-design/icons";

const { Title, Text } = Typography;
const DEFAULT_PAGESIZE = 20;

export default function PendingTxnsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const current = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);

  const [tableData, setTableData] = useState<TransactionVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchPendingTransactions({ current, pageSize }).then((data) => {
      setLoading(false);
      setTotal(data.total);

      if (isMobile && current > 1) {
        setTableData((prev) => {
          const loaded = new Set(prev.map((tx) => tx.hash));
          const newRecords = data.records.filter((tx) => !loaded.has(tx.hash));
          return [...prev, ...newRecords];
        });
      } else {
        setTableData(data.records);
      }
    });
  }, [current, pageSize]);

  const handlePageChange = (page: number, size?: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      if (size) next.set("pageSize", String(size));
      return next;
    });
  };

  const pagination: TablePaginationConfig = {
    current,
    pageSize,
    total,
    showSizeChanger: true,
    position: ["topRight", "bottomRight"],
  };

  const columns: ColumnsType<TransactionVO> = [
    {
      title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
      dataIndex: "hash",
      render: (val, txVO) => (
        <TransactionHash
          blockNumber={txVO.blockNumber}
          txhash={val}
          status={txVO.status}
        />
      ),
      width: 150,
      fixed: "left",
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Method</Text>,
      dataIndex: "methodId",
      width: 100,
      render: (methodId, txVO) => (
        <TxMethodId address={txVO.to} methodId={methodId} />
      ),
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Nonce</Text>,
      dataIndex: "nonce",
      width: 60,
      render: (nonce) => <>{nonce}</>,
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Gas Price</Text>,
      dataIndex: "value",
      width: 80,
      render: (_, txVO) => (
        <Text strong>{GWEI(txVO.gasPrice)} GWei</Text>
      ),
    },
    // {
    //   title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
    //   dataIndex: "timestamp",
    //   width: 100,
    //   render: (val) => <>{DateFormat(val * 1000)}</>,
    // },
    {
      title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
      dataIndex: "from",
      width: 180,
      render: (from, txVO) => (
        <Row>
          <Col span={22}>
            <Address address={from} propVO={txVO.fromPropVO} />
          </Col>
          <Col>
            <ArrowRightOutlined />
          </Col>
        </Row>
      ),
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
      dataIndex: "to",
      width: 180,
      render: (to, txVO) => (
        <Address address={to} propVO={txVO.toPropVO} />
      ),
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
      dataIndex: "value",
      width: 80,
      render: (value) => (
        <Text strong>
          <EtherAmount raw={value.toString()} fix={6} />
        </Text>
      ),
    },
  ];

  const listHasMore = () => {
    if (loading) return true;
    if (!total) return false;
    return current * pageSize < total;
  };

  const listNext = () => {
    if (!loading) {
      handlePageChange(current + 1);
    }
  };

  const refreshList = () => {
    if (current === 1) {
      setLoading(true);
      fetchPendingTransactions({ current: 1, pageSize }).then((data) => {
        setLoading(false);
        setTableData(data.records);
        setTotal(data.total);
      });
    } else {
      handlePageChange(1);
    }
  };

  return (
    <>
      <Row>
        <Title level={3}>Pending Transactions</Title>
      </Row>
      <Card>
        <Row style={{ width: "100%" }}>
          <Col xl={24} xs={0}>
            <Text strong style={{ color: "#6c757e" }}>
              A total of {total} pending txns found
            </Text>
            <Table
              columns={columns}
              dataSource={tableData}
              scroll={{ x: 800 }}
              rowKey={(txVO) => txVO.hash}
              loading={loading}
              pagination={{
                ...pagination,
                onChange: handlePageChange,
              }}
            />
          </Col>
          <Col xl={0} xs={24}>
            <div
              id="scrollableDiv"
              style={{
                height: 600,
                overflow: "auto",
                padding: "0 4px",
              }}
            >
              <InfiniteScroll
                dataLength={tableData.length}
                next={listNext}
                hasMore={listHasMore()}
                pullDownToRefresh
                refreshFunction={refreshList}
                releaseToRefreshContent={
                  <Divider plain>Release to refresh</Divider>
                }
                pullDownToRefreshContent={
                  <Divider plain>Pull down to refresh</Divider>
                }
                pullDownToRefreshThreshold={2}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                endMessage={
                  <Divider plain>It is all, nothing more 🤐</Divider>
                }
                scrollableTarget="scrollableDiv"
              >
                <List
                  dataSource={tableData}
                  loading={loading}
                  renderItem={(pendingTxVO) => {
                    const {
                      hash,
                      timestamp,
                      value,
                      methodId,
                      from,
                      fromPropVO,
                      to,
                      toPropVO,
                    } = pendingTxVO;
                    return (
                      <List.Item key={hash}>
                        <Row style={{ width: "100%" }}>
                          <Col span={12}>
                            <Tag color="rgba(119,131,143,.1)">
                              <EnvironmentTwoTone />
                              <Text style={{ color: "#77838f" }}>Pending ...</Text>
                            </Tag>
                          </Col>
                          <Col span={12} style={{ textAlign: "right" }}>
                            <Text>{DateFormat(Number(timestamp) * 1000)}</Text>
                          </Col>
                          <Col span={24}>
                            <Text strong style={{ marginRight: "2px" }}>
                              Hash:
                            </Text>
                            <TransactionHash txhash={hash} />
                          </Col>
                          <Col span={24}>
                            <Text strong style={{ marginRight: "2px" }}>
                              From:
                            </Text>
                            <Address address={from} propVO={fromPropVO} />
                          </Col>
                          <Col span={24}>
                            <ArrowRightOutlined style={{ marginRight: "5px" }} />
                            <Text strong style={{ marginRight: "2px" }}>
                              To:
                            </Text>
                            <Address address={to} propVO={toPropVO} />
                          </Col>
                          <Col span={24}>
                            <Text style={{ textAlign: "left" }}>
                              Method :
                              <TxMethodId address={to} methodId={methodId} />
                            </Text>
                            <Text code style={{ float: "right" }}>
                              <EtherAmount raw={value} fix={6} />
                            </Text>
                          </Col>
                        </Row>
                      </List.Item>
                    );
                  }}
                />
              </InfiniteScroll>
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
}

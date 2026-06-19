import {
  Card,
  Table,
  Typography,
  Row,
  Col,
  Progress,
  Skeleton,
  List,
  Divider
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useEffect, useState } from "react";
import { BlockVO } from "../../services";
import { fetchBlocks } from "../../services/block";
import { useTranslation } from "react-i18next";
import { DateFormat } from "../../utils/DateUtil";
import { format } from "../../utils/NumberFormat";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import EtherAmount from "../../components/EtherAmount";
import Address from "../../components/Address";
import BlockNumber from "../../components/BlockNumber";
import InfiniteScroll from "react-infinite-scroll-component";

const { Title, Text } = Typography;

const DEFAULT_PAGE_SIZE = 50;

export default function BlocksPage() {
  const { t } = useTranslation();

  const [tableData, setTableData] = useState<BlockVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [unconfirmed, setUnconfirmed] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  // =========================
  // URL state（核心）
  // =========================
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(
    searchParams.get("pageSize") || DEFAULT_PAGE_SIZE
  );
  const date = searchParams.get("date") || undefined;
  const miner = searchParams.get("miner") || undefined;

  // =========================
  // fetch
  // =========================
  async function loadBlocks(current: number, size: number) {
    setLoading(true);

    try {
      const data = await fetchBlocks({
        current,
        pageSize: size,
        date,
        miner
      });

      setTableData(data.records);
      setTotal(data.total);

      setUnconfirmed(
        data.records.filter((b) => b.confirmed !== 1).length
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // URL-driven effect
  // =========================
  useEffect(() => {
    loadBlocks(page, pageSize);
  }, [page, pageSize, date, miner]);

  // =========================
  // columns
  // =========================
  const columns: ColumnsType<BlockVO> = [
    {
      title: "Number",
      dataIndex: "number",
      width: 100,
      fixed: "left",
      render: (number, vo) => (
        <BlockNumber
          blockNumber={number}
          confirmed={vo.confirmed}
        />
      )
    },
    {
      title: "Date Time",
      dataIndex: "timestamp",
      width: 180,
      render: (val) => DateFormat(Number(val) * 1000)
    },
    {
      title: "Txns",
      dataIndex: "txns",
      width: 80,
      render: (txns, vo) => (
        <RouterLink to={`/txs?block=${vo.number}`}>
          {txns}
        </RouterLink>
      )
    },
    {
      title: "Miner",
      dataIndex: "miner",
      width: 220,
      render: (address, vo) => (
        <Address address={address} propVO={vo.minerPropVO} />
      )
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      width: 120,
      render: (v) => <Text>{v}</Text>
    },
    {
      title: "Gas Used",
      dataIndex: "gasUsed",
      width: 200,
      render: (gasUsed, vo) => {
        const gasLimit = vo.gasLimit;
        const rate =
          Math.round((gasUsed / Number(gasLimit)) * 10000) / 100;

        return (
          <>
            <Text>{format(gasUsed)}</Text>
            <Text type="secondary" style={{ marginLeft: 6 }}>
              ({rate}%)
            </Text>
            <Progress percent={rate} showInfo={false} />
          </>
        );
      }
    },
    {
      title: "Gas Limit",
      dataIndex: "gasLimit",
      width: 150,
      render: (v) => format(v)
    },
    {
      title: "Reward",
      dataIndex: "reward",
      width: 150,
      render: (v) => <EtherAmount raw={v} />
    }
  ];

  // =========================
  // total display
  // =========================
  const OutputTotal = () => {
    const from = tableData?.[0]?.number;
    const to = tableData?.[tableData.length - 1]?.number;

    return (
      <Text strong style={{ color: "#6c757e" }}>
        Block #{to} to #{from} (Total {format(String(total))})
      </Text>
    );
  };

  // =========================
  // pagination (URL driven)
  // =========================
  const pagination: TablePaginationConfig = {
    current: page,
    pageSize,
    total,
    position: ["topRight", "bottomRight"],
    showSizeChanger: true,
    onChange: (p, ps) => {
      setSearchParams({
        page: String(p),
        pageSize: String(ps),
        ...(date ? { date } : {}),
        ...(miner ? { miner } : {})
      });
    }
  };

  // =========================
  // infinite scroll
  // =========================
  function listHasMore() {
    if (!total) return true;
    return page * pageSize < total;
  }

  function listNext() {
    setSearchParams({
      page: String(page + 1),
      pageSize: String(pageSize),
      ...(date ? { date } : {}),
      ...(miner ? { miner } : {})
    });
  }

  // =========================
  // render
  // =========================
  return (
    <>
      <Title level={3}>Blocks</Title>

      <Card>
        <Row>
          {/* ===================== */}
          {/* 大屏 Table */}
          {/* ===================== */}
          <Col xl={24} xs={0}>
            <OutputTotal />

            <Table
              columns={columns}
              dataSource={tableData}
              loading={loading}
              scroll={{ x: 800 }}
              rowKey={(vo) => vo.number}
              pagination={pagination}
              onChange={({ current, pageSize }, filters) => {
                const next: any = {};
                // ======================
                // ✔ 修复分页逻辑（关键）
                // ======================
                next.page = current;
                next.pageSize = pageSize;
                // ======================
                // filters
                // ======================
                if (filters.timestamp?.[0]) {
                  next.date = String(filters.timestamp[0]);
                }
                if (filters.miner?.[0]) {
                  next.miner = String(filters.miner[0]);
                }
                setSearchParams(next);
              }}
            />
          </Col>

          {/* ===================== */}
          {/* 小屏 InfiniteScroll */}
          {/* ===================== */}
          <Col xl={0} xs={24}>
            <div
              id="scrollableDiv"
              style={{
                height: 600,
                overflow: "auto",
                padding: "0 4px"
              }}
            >
              <InfiniteScroll
                dataLength={tableData.length}
                next={listNext}
                hasMore={listHasMore()}
                loader={<Skeleton active />}
                endMessage={
                  <Divider plain>
                    It is all, nothing more 🤐
                  </Divider>
                }
                scrollableTarget="scrollableDiv"
              >
                <List
                  dataSource={tableData}
                  renderItem={(block) => {
                    const rate =
                      Math.round(
                        (Number(block.gasUsed) /
                          Number(block.gasLimit)) *
                        10000
                      ) / 100;

                    return (
                      <List.Item key={block.number}>
                        <Row style={{ width: "100%" }}>
                          <Col span={12}>
                            <BlockNumber
                              blockNumber={block.number}
                              confirmed={block.confirmed}
                            />
                          </Col>

                          <Col
                            span={12}
                            style={{ textAlign: "right" }}
                          >
                            <Text>
                              {DateFormat(
                                Number(block.timestamp) * 1000
                              )}
                            </Text>
                          </Col>

                          <Col span={24}>
                            <Address address={block.miner} />
                          </Col>

                          <Col span={24}>
                            <Text>
                              Gas Used / Limit:{" "}
                              {format(block.gasUsed)} /{" "}
                              {format(block.gasLimit)}
                            </Text>

                            <Progress
                              percent={rate}
                              showInfo
                              style={{ width: "80%" }}
                            />
                          </Col>

                          <Col span={4}>
                            <RouterLink
                              to={`/txs?block=${block.number}`}
                            >
                              Txns : {block.txns}
                            </RouterLink>
                          </Col>

                          <Col
                            span={20}
                            style={{ textAlign: "right" }}
                          >
                            <Text code>
                              <EtherAmount raw={block.reward} />
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
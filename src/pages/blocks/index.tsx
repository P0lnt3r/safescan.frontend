
import { Card, Table, Typography, Progress, Row, Col, DatePicker, Button, Input, Space, InputRef } from 'antd';
import { Divider, List, Skeleton } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { BlockVO } from '../../services';
import { fetchBlocks } from '../../services/block';
import { useTranslation } from 'react-i18next';
import { DateFormat } from '../../utils/DateUtil';
import { format } from '../../utils/NumberFormat';
import { Link as RouterLink } from 'react-router-dom';
import EtherAmount from '../../components/EtherAmount';
import Address from '../../components/Address';
import InfiniteScroll from 'react-infinite-scroll-component';
import BlockNumber from '../../components/BlockNumber';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const { Title, Text, Link } = Typography;

const DEFAULT_PAGE_SIZE = 50;

export default function () {
  const { t } = useTranslation();
  const ref = useRef(null);
  const columns: ColumnsType<BlockVO> = [
    {
      key: 'number',
      title: <Text strong style={{ color: "#6c757e" }}>Number</Text>,
      dataIndex: 'number',
      render: (number, blockVO) => {
        const confirmed = blockVO.confirmed;
        return <BlockNumber blockNumber={number} confirmed={confirmed} />
      },
      width: 100,
      fixed: 'left',
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
      dataIndex: 'timestamp',
      width: 180,
      render: val => DateFormat(Number(val) * 1000),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => {

        return <>
          <div style={{ padding: "5px", width: "250px" }} onKeyDown={(e) => e.stopPropagation()}>
            <DatePicker ref={ref} style={{ marginTop: "20px", marginBottom: "20px", width: "100%" }}
              onChange={(date, dateString) => {
                setSelectedKeys([dateString]);
                confirm();
              }} />
          </div>
        </>
      },
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Txns</Text>,
      dataIndex: 'txns',
      width: 70,
      render: (txns, blockVO) => <RouterLink to={`/txs?block=${blockVO.number}`}>{txns}</RouterLink>
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Miner</Text>,
      dataIndex: 'miner',
      width: 250,
      ellipsis: true,
      render: (address, blockVO) => {
        const propVO = blockVO.minerPropVO;
        return <>
          <Address address={address} propVO={propVO} />
        </>
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8, width: "300px" }} onKeyDown={(e) => e.stopPropagation()}>
          <Input placeholder='Input Miner Address' style={{ marginBottom: 8, display: 'block' }}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          />
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 100 }}
              onClick={() => confirm()}
            >
              Search
            </Button>
            <Button
              size="small"
              style={{ width: 100 }}
              onClick={() => {
                clearFilters && clearFilters();
                confirm();
              }}
            >
              Reset
            </Button>
          </Space>
        </div>
      )
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Difficulty</Text>,
      dataIndex: 'difficulty',
      width: 100,
      render: (difficulty, blockVO) => {
        return <>
          <Text>{difficulty}</Text>
        </>
      }
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Gas Used</Text>,
      dataIndex: 'gasUsed',
      width: 200,
      render: (gasUsed, blockVO) => {
        const gasLimit = blockVO.gasLimit;
        const rate = Math.round(gasUsed / Number(gasLimit) * 10000) / 100;
        return <>
          <Text>{format(gasUsed)}</Text>
          <Text type='secondary' style={{ marginLeft: "6px", fontSize: "12px" }}>({rate}%)</Text>
          <Progress percent={rate} showInfo={false} />
        </>
      }
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Gas Limit</Text>,
      dataIndex: 'gasLimit',
      width: 150,
      render: (gasLimit) => <Text>{format(gasLimit)}</Text>
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Reward</Text>,
      dataIndex: 'reward',
      width: 200,
      render: (reward) => <Text strong><EtherAmount raw={reward} /></Text>
    },
  ];

  const [queryParams, setQueryParams] = useState<{
    date?: string,
    miner?: string
  }>({});

  const doFetchBlocks = async (current?: number) => {
    setLoading(true);
    fetchBlocks({
      current: current ? current : pagination.current,
      pageSize: pagination.pageSize,
      ...queryParams
    }).then((data) => {
      setLoading(false);
      if (current) {
        setTableData([...tableData, ...data.records]);
      } else {
        setTableData(data.records);
      }
      const unconfirmed = data.records.filter(blockVO => blockVO.confirmed != 1).length;
      setConfirmed(data.total);
      setUnconfirmed(unconfirmed);

      if (pagination.current == 1) {
        const total = data.total;
        const dbSize = data.pageSize;
        const dbPages = Math.floor(total / dbSize);
        const uiTotal = (dbPages * unconfirmed) + total;
        setPagination({
          ...pagination,
          current: data.current,
          total: uiTotal,
          pageSize: data.records.length,
        });
      } else {
        setPagination({
          ...pagination,
          current: data.current,
          total: data.total,
          pageSize: data.pageSize,
        });
      }
    })
  }
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    position: ["topRight", "bottomRight"],
    pageSizeOptions: [],
    responsive: true,
  });

  const [tableData, setTableData] = useState<BlockVO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [unconfirmed, setUnconfirmed] = useState<number>(0);
  const [confirmed, setConfirmed] = useState<number>(0);

  useEffect(() => {
    doFetchBlocks();
  }, []);

  function OutputTotal() {
    const from = tableData && tableData[0] && tableData[0].number;
    const to = tableData && tableData[tableData.length - 1] && tableData[tableData.length - 1].number;
    return <>
      <Text strong style={{ color: "#6c757e" }}>Block #{to} to #{from} (Total of {
        confirmed && <>{format(confirmed + "")}</>
      } blocks
        {unconfirmed > 0 && <Text> and {unconfirmed} unconfirmed</Text>}
        ) </Text>
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
    if (pagination.current) {
      pagination.pageSize = DEFAULT_PAGE_SIZE;
      doFetchBlocks(pagination.current + 1);
    }
  }

  return (
    <>
      <Title level={3}>Blocks</Title>
      <Card style={{ padding: "0px" }}>
        <Row>
          <Col xl={24} xs={0}>
            <OutputTotal></OutputTotal>
            <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
              pagination={pagination}
              rowKey={blockVO => blockVO.number}
              loading={loading}
              onChange={({ current, pageSize }, filters, sorter, extra) => {
                queryParams.date = undefined;
                queryParams.miner = undefined;
                if (filters.timestamp && filters.timestamp[0]) {
                  queryParams.date = filters.timestamp[0].toString();
                }
                if (filters.miner && filters.miner[0]) {
                  queryParams.miner = filters.miner[0].toString();
                }
                pagination.pageSize = unconfirmed > 0 ? pageSize ? pageSize - unconfirmed : pageSize : pageSize;
                pagination.current = current;
                doFetchBlocks();
              }}
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
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
              >
                <List
                  dataSource={tableData}
                  renderItem={(block) => {
                    const { number, timestamp, miner, gasLimit, gasUsed, txns, reward, confirmed } = block;
                    const rate = Math.round(Number(gasUsed) / Number(gasLimit) * 10000) / 100;
                    return <>
                      <List.Item key={number}>
                        <Row style={{ width: "100%" }}>
                          <Col span={12}>
                            <BlockNumber blockNumber={number} confirmed={confirmed} />
                          </Col>
                          <Col span={12} style={{ textAlign: "right" }}>
                            <Text>{DateFormat(Number(timestamp) * 1000)}</Text>
                          </Col>
                          <Col span={24}>
                            <Address address={miner} />
                          </Col>
                          <Col span={24}>
                            <Text>Gas <Text type="secondary">Uesd</Text>/Limit:
                              <Text type="secondary">{format(gasUsed)}</Text>/{format(gasLimit)}</Text>
                            <Progress style={{ width: "80%" }} percent={rate} showInfo={true} />
                          </Col>
                          <Col span={4}>
                            <RouterLink to={`/txs?block=${number}`}>Txns : {txns}</RouterLink>
                          </Col>
                          <Col span={20} style={{ textAlign: "right" }}>
                            <Text code><EtherAmount raw={reward} fix={18} /></Text>
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
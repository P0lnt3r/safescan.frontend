
import { Card, Table, Typography, Progress, Tooltip, Row, Col } from 'antd';
import { Avatar, Divider, List, Skeleton } from 'antd';
import { PaginationConfig, PaginationProps } from 'antd/es/pagination';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import { BlockVO } from '../../services';
import { fetchBlocks } from '../../services/block';
import { useTranslation } from 'react-i18next';
import { DateFormat } from '../../utils/DateUtil';
import NumberFormat, { format } from '../../utils/NumberFormat';
import { Link as RouterLink } from 'react-router-dom';
import EtherAmount from '../../components/EtherAmount';
import { useDBStoredBlockNumber } from '../../state/application/hooks';
import Address from '../../components/Address';
import InfiniteScroll from 'react-infinite-scroll-component';
import { isMobile } from 'react-device-detect';
import BlockNumber from '../../components/BlockNumber';

const { Title, Text, Link } = Typography;

const DEFAULT_PAGE_SIZE = 20;

export default function () {

  const { t } = useTranslation();

  const columns: ColumnsType<BlockVO> = [
    {
      key: 'number',
      title: <Text strong style={{ color: "#6c757e" }}>Number</Text>,
      dataIndex: 'number',
      render: (number, blockVO) => {
        const confirmed = blockVO.confirmed;
        return  <BlockNumber blockNumber={number} confirmed={confirmed} />
      },
      width: 100,
      fixed: 'left',
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
      dataIndex: 'timestamp',
      width: 180,
      render: val => DateFormat(Number(val) * 1000)
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
      }
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

  const doFetchBlocks = async (current?: number) => {
    setLoading(true);
    fetchBlocks({ current: current ? current : pagination.current, pageSize: pagination.pageSize }).then((data) => {
      setLoading(false);
      if (current) {
        setTableData([...tableData, ...data.records]);
      } else {
        setTableData(data.records);
      }
      const unconfirmed = [];
      data.records.forEach(blockVO => {
        if (blockVO.confirmed < 1) {
          unconfirmed.push(blockVO);
        }
      });
      setConfirmed(data.total);
      setUnconfirmed(unconfirmed.length);
      const onChange = (page: number, pageSize: number) => {
        pagination.pageSize = unconfirmed.length > 0 ? pageSize - unconfirmed.length : pageSize;
        pagination.current = page;
        doFetchBlocks();
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
    if ( pagination.current && pagination.total ){
      const totalPages = Math.floor( pagination.total / pagination.current )
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
      <Card style={{padding:"0px"}}>
        <Row>
          <Col xl={24} xs={0}>
            <OutputTotal></OutputTotal>
            <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
              pagination={pagination}
              rowKey={blockVO => blockVO.number}
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
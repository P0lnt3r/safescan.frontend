import { Card, Table, Typography, Row, Col } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { TransactionVO } from '../../services';
import { fetchTransactions } from '../../services/tx';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import { ArrowRightOutlined } from '@ant-design/icons';
import EtherAmount from '../../components/EtherAmount';
import { useSearchParams } from 'react-router-dom';
import TxMethodId from '../../components/TxMethodId';
import NavigateLink from '../../components/NavigateLink';
import { useDispatch } from 'react-redux';
import { format } from '../../utils/NumberFormat';
import Address from '../../components/Address';
import BlockNumber from '../../components/BlockNumber';

const { Title, Text } = Typography;
const DEFAULT_PAGESIZE = 20;

export default function TransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  // ===== URL 状态 =====
  const blockNumber = useMemo(() => {
    const v = Number(searchParams.get("block"));
    return isNaN(v) ? 0 : v;
  }, [searchParams]);

  const current = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);

  // ===== state =====
  const [tableData, setTableData] = useState<TransactionVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(0);
  const [unconfirmed, setUnconfirmed] = useState(0);

  // ===== pagination（完全由 URL 驱动）=====
  const pagination: TablePaginationConfig = {
    current,
    pageSize,
    total: confirmed,
    position: ["topRight", "bottomRight"],
    showSizeChanger: true,
  };

  // ===== columns =====
  const columns: ColumnsType<TransactionVO> = [
    {
      title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
      dataIndex: 'hash',
      width: 150,
      fixed: 'left',
      render: (val, txVO) => (
        <TransactionHash
          blockNumber={txVO.blockNumber}
          txhash={val}
          status={txVO.status}
        />
      ),
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Method</Text>,
      dataIndex: 'methodId',
      width: 100,
      render: (methodId, txVO) => (
        <TxMethodId address={txVO.to} methodId={methodId} />
      ),
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
      dataIndex: 'blockNumber',
      width: 80,
      render: (blockNumber, vo) => (
        <BlockNumber blockNumber={blockNumber} confirmed={vo.confirmed} />
      ),
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
      dataIndex: 'timestamp',
      width: 130,
      render: (val) => <>{DateFormat(val * 1000)}</>,
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
      dataIndex: 'from',
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
      dataIndex: 'to',
      width: 180,
      render: (to, txVO) => (
        <Address address={to} propVO={txVO.toPropVO} />
      ),
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
      dataIndex: 'value',
      width: 120,
      render: (value) => (
        <Text strong>
          <EtherAmount raw={value.toString()} fix={6} />
        </Text>
      ),
    },
  ];

  // ===== 数据请求（依赖 URL）=====
  useEffect(() => {
    setLoading(true);

    fetchTransactions({
      current,
      pageSize,
      blockNumber: blockNumber > 0 ? blockNumber : undefined,
    }, dispatch).then((data) => {
      setLoading(false);

      setTableData(data.records);

      const unconfirmedCount = data.records.filter(t => t.confirmed !== 1).length;

      setConfirmed(data.total);
      setUnconfirmed(unconfirmedCount);
    });
  }, [current, pageSize, blockNumber]);

  // ===== URL 翻页 =====
  const handlePageChange = (page: number, size?: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      if (size) next.set("pageSize", String(size));
      return next;
    });
  };

  // ===== UI =====
  return (
    <>
      <Row>
        <Title level={3}>Transactions</Title>

        {blockNumber > 0 && (
          <Text type="secondary" style={{ marginLeft: 8, fontSize: 18 }}>
            For Block{" "}
            <NavigateLink path={`/block/${blockNumber}`}>
              #{blockNumber}
            </NavigateLink>
          </Text>
        )}
      </Row>

      <Card>
        {confirmed > 0 && (
          <Text strong style={{ color: "#6c757e" }}>
            Total of {format(String(confirmed))} Transactions
          </Text>
        )}

        <Table
          columns={columns}
          dataSource={tableData}
          rowKey={(txVO) => txVO.hash}
          scroll={{ x: 800 }}
          loading={loading}
          pagination={{
            ...pagination,
            onChange: handlePageChange,
          }}
        />
      </Card>
    </>
  );
}
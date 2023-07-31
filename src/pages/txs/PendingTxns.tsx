import { Card, Table, Typography, Row, Col, Tooltip } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { TransactionVO } from '../../services';
import { fetchPendingTransactions, fetchTransactions } from '../../services/tx';
import { useTranslation } from 'react-i18next';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import { ArrowRightOutlined, FileTextOutlined } from '@ant-design/icons';
import EtherAmount, { GWEI } from '../../components/EtherAmount';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import TxMethodId from '../../components/TxMethodId';
import NavigateLink from '../../components/NavigateLink';
import { useDispatch } from 'react-redux';
import { JSBI } from '@uniswap/sdk';
import { useBlockNumber, useDBStoredBlockNumber } from '../../state/application/hooks';
import { format } from '../../utils/NumberFormat';
import Address from '../../components/Address';
const { Title, Text, Link } = Typography;
const DEFAULT_PAGESIZE = 50;

export default function () {

  const latestBlockNumber = useBlockNumber();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const columns: ColumnsType<TransactionVO> = [
    {
      title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
      dataIndex: 'hash',
      render: (val, txVO) => <><TransactionHash blockNumber={txVO.blockNumber} txhash={val} sub={8} status={txVO.status}></TransactionHash></>,
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

  const doFetchPendingTransactions = async () => {
    setLoading(true);
    fetchPendingTransactions({
      current: pagination.current, pageSize: pagination.pageSize,
    }).then((data) => {
      setLoading(false);
      setTableData(data.records);
      console.log("Fetch pending TXNS : " , data.records.length)
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

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGESIZE,
    position: ["topRight", "bottomRight"],
    pageSizeOptions: [],
    responsive: true,
  });

  const [tableData, setTableData] = useState<TransactionVO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    doFetchPendingTransactions();
  }, []);

  function OutputTotal() {
    return <>
      {
        <Text strong style={{ color: "#6c757e" }}>
            A total of {pagination.total} pending txns found 
        </Text>
      }
    </>
  }

  return (
    <>
      <Row>
        <Title level={3}>Pending Transactions</Title>
      </Row>
      <Card>
        <OutputTotal />
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
          pagination={pagination} rowKey={(txVO) => txVO.hash}
          loading={loading}
        />
      </Card>

    </>
  )
}
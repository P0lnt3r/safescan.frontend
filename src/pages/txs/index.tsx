import { Card, Table, Typography, Row, Col, Tooltip } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
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
import { JSBI } from '@uniswap/sdk';
import { useBlockNumber, useDBStoredBlockNumber } from '../../state/application/hooks';
import { format } from '../../utils/NumberFormat';
const { Title, Text, Link } = Typography;

const DEFAULT_PAGESIZE = 50;

export default function () {

  const [searchParams] = useSearchParams();

  const blockNumber = useMemo(() => {
    try {
      return Number(searchParams.get("block"));
    } catch (error) {
      return 0;
    }
  }, [searchParams]);

  const latestBlockNumber = useBlockNumber();
  const dbStoredBlockNumber = useDBStoredBlockNumber();

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
      title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
      dataIndex: 'blockNumber',
      width: 80,
      render: (blockNumber, vo) => {
        return <>
          {
            vo.confirmed == 1 && <RouterLink to={`/block/${blockNumber}`}>{blockNumber}</RouterLink>
          }
          {
            vo.confirmed == 0 && 
            <RouterLink to={`/block/${blockNumber}`}>
              <Link italic underline>{blockNumber}</Link>
            </RouterLink>
          }
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
              {<Tooltip title={from}>
                <RouterLink to={`/address/${from}`}>
                  <Link style={{ width: "80%", marginLeft: "5px" }} ellipsis>{tag ? tag : from}</Link>
                </RouterLink>
              </Tooltip>
              }
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
        const { methodId, toPropVO } = txVO;
        const tag = toPropVO?.tag;
        const type = toPropVO?.type;
        return <>
          {
            (methodId || type === "contract") && <Tooltip title="Contract"><FileTextOutlined /></Tooltip>
          }
          {
            <Tooltip title={to}>
              <RouterLink to={`/address/${to}`}>
                <Link style={{ width: "80%", marginLeft: "5px" }} ellipsis>{tag ? tag : to}</Link>
              </RouterLink>
            </Tooltip>
          }
        </>
      }
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
      dataIndex: 'value',
      width: 100,
      render: (value) => <Text strong><EtherAmount raw={value.toString()} fix={6} /></Text>
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Txn Fee</Text>,
      dataIndex: 'txFee',
      width: 100,
      render: (_, txVO) => {
        const { gasPrice, gasUsed } = txVO;
        const txFee = (gasPrice && gasUsed) ? JSBI.multiply(
          JSBI.BigInt(gasPrice),
          JSBI.BigInt(gasUsed)
        ).toString() : "0";
        return <>
          <Text type="secondary">
            <EtherAmount raw={txFee.toString()} fix={6} ignoreLabel />
          </Text>
        </>
      }
    },
  ];

  const doFetchTransactions = async () => {
    setLoading(true);
    fetchTransactions({
      current: pagination.current, pageSize: pagination.pageSize,
      blockNumber: blockNumber > 0 ? blockNumber : undefined
    }, dispatch).then((data) => {
      setLoading(false);
      setTableData(data.records);
      const unconfirmed = [];
      data.records.forEach(tx => {
        if (tx.confirmed != 1) {
          unconfirmed.push(tx);
        }
      })
      setConfirmed(data.total);
      setUnconfirmed(unconfirmed.length);
      const onChange = (page: number, pageSize: number) => {
        pagination.pageSize = unconfirmed.length > 0 ? pageSize - unconfirmed.length : pageSize;
        pagination.current = page;
        doFetchTransactions();
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
    pageSize: DEFAULT_PAGESIZE,
    position: ["topRight", "bottomRight"],
    pageSizeOptions: [],
    responsive: true,
  });

  const [tableData, setTableData] = useState<TransactionVO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [unconfirmed, setUnconfirmed] = useState<number>(0);
  const [confirmed, setConfirmed] = useState<number>(0);

  useEffect(() => {
    if (pagination.current == 1 && dbStoredBlockNumber != latestBlockNumber && unconfirmed >= 0) {
      pagination.pageSize = DEFAULT_PAGESIZE;
      doFetchTransactions();
    }
  }, [latestBlockNumber, dbStoredBlockNumber,blockNumber]);

  function OutputTotal() {
    return <>
      {
        confirmed != unconfirmed && <Text strong style={{ color: "#6c757e" }}>Total of {
          confirmed && <>{format(confirmed + "")}</>
        } Transactions
          {unconfirmed > 0 && <Text> and {unconfirmed} unconfirmed</Text>}
        </Text>
      }
    </>
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
        <OutputTotal />
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
          pagination={pagination} rowKey={(txVO) => txVO.hash}
          loading={loading}
        />
      </Card>

    </>
  )
}
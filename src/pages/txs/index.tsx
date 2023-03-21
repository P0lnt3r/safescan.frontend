import { Card, Table, Typography, Row, Col, Tooltip } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { TransactionVO } from '../../services';
import { fetchTransactions } from '../../services/tx';
import { useTranslation } from 'react-i18next';
import AddressTag from '../../components/AddressTag';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import { ArrowRightOutlined, FileTextOutlined } from '@ant-design/icons';
import EtherAmount from '../../components/EtherAmount';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import TxMethodId from '../../components/TxMethodId';
import NavigateLink from '../../components/NavigateLink';
import { useDispatch } from 'react-redux';
import { JSBI } from '@uniswap/sdk';


const { Title, Text, Link } = Typography;

export default function () {

  const [searchParams] = useSearchParams();
  const blockNumber = useMemo(() => {
    try {
      return Number(searchParams.get("block"));
    } catch (error) {
      return 0;
    }
  }, [searchParams]);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const columns: ColumnsType<TransactionVO> = [
    {
      title: <>{t('Txn Hash')}</>,
      dataIndex: 'hash',
      key: 'hash',
      render: (val, txVO) => <><TransactionHash txhash={val} sub={8} status={txVO.status}></TransactionHash></>,
      width: 180,
      fixed: 'left',
    },
    {
      title: 'Method',
      dataIndex: 'methodId',
      width: 100,
      render: (methodId, txVO) => <TxMethodId address={txVO.to} methodId={methodId}></TxMethodId>
    },
    {
      title: 'Block',
      dataIndex: 'blockNumber',
      width: 80,
      render: blockNumber => <RouterLink to={`/block/${blockNumber}`}>{blockNumber}</RouterLink>
    },
    {
      title: 'Date Time',
      dataIndex: 'timestamp',
      width: 130,
      render: (val) => <>{DateFormat(val * 1000)}</>
    },
    {
      title: "From",
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
      title: 'To',
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
      title: 'Value',
      dataIndex: 'value',
      width: 100,
      render: (value) => <Text strong><EtherAmount raw={value.toString()} fix={6} /></Text>
    },
    {
      title: 'Txn Fee',
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

  const doFetchBlocks = async () => {
    fetchTransactions({
      current: pagination.current, pageSize: pagination.pageSize,
      blockNumber: blockNumber > 0 ? blockNumber : undefined
    }, dispatch).then((data) => {
      setTableData(data.records);
      setPagination({
        current: data.current,
        pageSize: data.pageSize,
        total: data.total,
        ...pagination
      })
    })
  }

  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    showTotal: (total) => <>Total : {total}</>,
    onChange: (page, pageSize) => {
      pagination.current = page;
      doFetchBlocks();
    }
  });
  const [tableData, setTableData] = useState<TransactionVO[]>([]);

  useEffect(() => {
    doFetchBlocks();
  }, []);

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
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
          pagination={pagination} rowKey={(txVO) => txVO.hash}
        />
      </Card>
    </>
  )
}
import { Card, Table, Typography, Row, Col } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { TransactionVO } from '../../services';
import { fetchTransactions } from '../../services/tx';
import { useTranslation } from 'react-i18next';
import AddressTag from '../../components/AddressTag';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import { ArrowRightOutlined } from '@ant-design/icons';
import EtherAmount from '../../components/EtherAmount';
import { useSearchParams } from 'react-router-dom';
import TxMethodId from '../../components/TxMethodId';

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
      render:(methodId , txVO) => <TxMethodId address={txVO.to} methodId={methodId}></TxMethodId>
    },
    {
      title: 'Block',
      dataIndex: 'blockNumber',
      width: 80,
      render: blockNumber => <Link href={`/block/${blockNumber}`}>{blockNumber}</Link>
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
      render: (val) => <>
        <Row>
          <Col span={22}>
            <AddressTag address={val} sub={8}></AddressTag>
          </Col>
          <Col>
            <ArrowRightOutlined />
          </Col>
        </Row>
      </>
    },
    {
      title: 'To',
      dataIndex: 'to',
      width: 180,
      render: (val) => <><AddressTag address={val} sub={8}></AddressTag></>
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: 100,
      render: (value) => < div style={{ fontSize: '14px' }} ><EtherAmount raw={value}></EtherAmount></div>
    },
    {
      title: 'Txn Fee',
      dataIndex: 'txFee',
      width: 100,
    },
  ];

  const doFetchBlocks = async () => {
    fetchTransactions({
      current: pagination.current, pageSize: pagination.pageSize,
      blockNumber: blockNumber > 0 ? blockNumber : undefined
    }).then((data) => {
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
            For Block <Link href={`/block/${blockNumber}`}> #{blockNumber} </Link>
          </Text>
        }
      </Row>
      <Card>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
          pagination={pagination}
        />
      </Card>
    </>
  )
}
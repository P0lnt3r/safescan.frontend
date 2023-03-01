
import { Card, Table, Typography, notification , Progress  } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { BlockVO } from '../../services';
import { fetchBlocks } from '../../services/block';
import { useTranslation } from 'react-i18next';
import { DateFormat } from '../../utils/DateUtil';
import AddressTag from '../../components/AddressTag';
import NumberFormat from '../../utils/NumberFormat';

const { Title , Link , Text } = Typography;

export default function () {

  const { t } = useTranslation();
  const columns: ColumnsType<BlockVO> = [
    {
      title: <>{t('block')}</>,
      dataIndex: 'number',
      key: 'number',
      render: text => <Link href={`/block/${text}`}>{text}</Link>,
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Date Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: val => DateFormat(Number(val) * 1000)
    },
    {
      title: 'Txns',
      dataIndex: 'txns',
      key: 'txns',
      width: 70,
      render: (txns ,blockVO) => <Link href={`/txs?block=${blockVO.number}`}>{txns}</Link>
    },
    {
      title: 'Miner',
      dataIndex: 'miner',
      key: 'miner',
      width: 450,
      render: address => <AddressTag address={address} sub={0}></AddressTag>
    },
    {
      title: 'Gas Used',
      dataIndex: 'gasUsed',
      key: 'gasUsed',
      width: 200,
      render: (gasUsed , blockVO) => {
        const gasLimit = blockVO.gasLimit;
        const rate = Math.round(gasUsed / gasLimit * 10000) / 100;
        return <>
          <Text>{NumberFormat(gasUsed)}</Text>
          <Text type='secondary' style={{marginLeft:"6px",fontSize:"12px"}}>({rate}%)</Text>
          <Progress percent={rate} showInfo={false} />
        </>
      }
    },
    {
      title: 'Gas Limit',
      dataIndex: 'gasLimit',
      key: 'gasLimit',
      width: 150,
      render: ( gasLimit ) => <Text>{NumberFormat(gasLimit)}</Text> 
    },
    {
      title: 'Reward',
      dataIndex: 'reward',
      key: 'reward',
      width: 200,
    },
  ];

  const doFetchBlocks = async () => {
    fetchBlocks( {current : pagination.current , pageSize : pagination.pageSize} ).then((data) => {
      setTableData(data.records);
      setPagination({
        current : data.current,
        pageSize : data.pageSize,
        total : data.total,
        ...pagination
      })
    })
  }

  const [pagination , setPagination] = useState<PaginationProps>({
    current : 1,
    pageSize : 10,
    showTotal: (total) => <>Total : {total}</>,
    onChange:(page,pageSize) => {
        pagination.current = page;
        doFetchBlocks();
    }
  });
  const [tableData , setTableData] = useState<BlockVO[]>([]); 

  useEffect(() => {
    doFetchBlocks();
  }, []);

  return (
    <>
      <Title level={3}>Blocks</Title>
      <Card>
        <Table columns={columns} dataSource={tableData} scroll={{x: 800}}
              pagination={pagination}
        />
      </Card>
    </>
  )
}
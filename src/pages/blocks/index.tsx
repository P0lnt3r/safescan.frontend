
import { Card, Table, Typography, Progress  } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { BlockVO } from '../../services';
import { fetchBlocks } from '../../services/block';
import { useTranslation } from 'react-i18next';
import { DateFormat } from '../../utils/DateUtil';
import AddressTag from '../../components/AddressTag';
import  {format} from '../../utils/NumberFormat';
import NavigateLink from '../../components/NavigateLink';

const { Title , Text } = Typography;

export default function () {

  const { t } = useTranslation();
  const columns: ColumnsType<BlockVO> = [
    {
      key: 'number',
      title: <>{t('block')}</>,
      dataIndex: 'number',
      render: text => <NavigateLink path={`/block/${text}`}>{text}</NavigateLink>,
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Date Time',
      dataIndex: 'timestamp',
      width: 180,
      render: val => DateFormat(Number(val) * 1000) 
    },
    {
      title: 'Txns',
      dataIndex: 'txns',
      width: 70,
      render: (txns ,blockVO) => <NavigateLink path={`/txs?block=${blockVO.number}`}>{txns}</NavigateLink>
    },
    {
      title: 'Miner',
      dataIndex: 'miner',
      width: 450,
      ellipsis: true,
      render: address => <AddressTag address={address} sub={8}></AddressTag>
    },
    {
      title: 'Gas Used',
      dataIndex: 'gasUsed',
      width: 200,
      render: (gasUsed , blockVO) => {
        const gasLimit = blockVO.gasLimit;
        const rate = Math.round(gasUsed / Number(gasLimit) * 10000) / 100;
        return <>
          <Text>{format(gasUsed)}</Text>
          <Text type='secondary' style={{marginLeft:"6px",fontSize:"12px"}}>({rate}%)</Text>
          <Progress percent={rate} showInfo={false} />
        </>
      }
    },
    {
      title: 'Gas Limit',
      dataIndex: 'gasLimit',
      width: 150,
      render: ( gasLimit ) => <Text>{format(gasLimit)}</Text> 
    },
    {
      title: 'Reward',
      dataIndex: 'reward',
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
              rowKey={blockVO => blockVO.number}
        />
      </Card>
    </>
  )
}
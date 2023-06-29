
import { Card, Table, Typography, Progress, Tooltip } from 'antd';
import { PaginationConfig, PaginationProps } from 'antd/es/pagination';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { BlockVO } from '../../services';
import { fetchBlocks } from '../../services/block';
import { useTranslation } from 'react-i18next';
import { DateFormat } from '../../utils/DateUtil';
import NumberFormat, { format } from '../../utils/NumberFormat';
import { Link as RouterLink } from 'react-router-dom';
import EtherAmount from '../../components/EtherAmount';

const { Title, Text, Link } = Typography;

export default function () {
  const { t } = useTranslation();
  const columns: ColumnsType<BlockVO> = [
    {
      key: 'number',
      title: <Text strong style={{ color: "#6c757e" }}>Number</Text>,
      dataIndex: 'number',
      render: number => <RouterLink to={`/block/${number}`}>{number}</RouterLink>,
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
          {
            propVO == null &&
            <Link ellipsis>{address}</Link>
          }
          {
            propVO != null &&
            <Tooltip title={address}>
              <RouterLink to={`/address/${address}`}>
                <Link ellipsis>{propVO.tag}</Link>
              </RouterLink>
            </Tooltip>
          }
        </>
      }
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Difficulty</Text>,
      dataIndex: 'difficulty',
      width: 80,
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
      render: (reward) => <Text strong><EtherAmount raw={reward}/></Text>
    },
  ];

  const doFetchBlocks = async () => {
    setLoading(true);
    fetchBlocks({ current: pagination.current, pageSize: pagination.pageSize }).then((data) => {
      setLoading(false);
      setTableData(data.records);
      const newPG = {
        ...pagination,
        current: data.current,
        total: data.total,
        pageSize:data.pageSize,
      };
      setPagination(newPG)
    })
  }
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    position: ["topRight", "bottomRight"],
    responsive: true,
    onChange: (page, pageSize) => {
      pagination.pageSize = pagination.current == 1 ? pageSize - 6 : pageSize;
      pagination.current = page;
      doFetchBlocks();
    }
  });

  const [tableData, setTableData] = useState<BlockVO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    doFetchBlocks();
  }, []);

  function OutputTotal() {
    const from = tableData && tableData[0] && tableData[0].number;
    const to = tableData && tableData[tableData.length - 1] && tableData[tableData.length - 1].number;
    return <>
      <Text strong style={{ color: "#6c757e" }}>Block #{to} to #{from} (Total of {
        pagination.total && <>{format(pagination.total + "")}</>
      } blocks) </Text>
    </>
  }
  
  return (
    <>
      <Title level={3}>Blocks</Title>
      <Card>
        <OutputTotal></OutputTotal>

        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
          rowKey={blockVO => blockVO.number}
          pagination={false}
        />

        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
          pagination={pagination}
          rowKey={blockVO => blockVO.number}
          loading={loading}
        />

      </Card>
    </>
  )
}

import { Card, Table, Typography, Progress, Tooltip } from 'antd';
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

const { Title, Text, Link } = Typography;

export default function () {
  const { t } = useTranslation();
  const columns: ColumnsType<BlockVO> = [
    {
      key: 'number',
      title: <Text strong style={{ color: "#6c757e" }}>Number</Text>,
      dataIndex: 'number',
      render: (number, blockVO) => {
        const confirmed = blockVO.confirmed;
        return confirmed == 1 ? <RouterLink to={`/block/${number}`}>{number}</RouterLink> :
          <RouterLink to={`/block/${number}`}>
            <Link italic underline>{number}</Link>
          </RouterLink>
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
      render: (reward) => <Text strong><EtherAmount raw={reward} /></Text>
    },
  ];

  const doFetchBlocks = async () => {
    setLoading(true);
    fetchBlocks({ current: pagination.current, pageSize: pagination.pageSize }).then((data) => {
      setLoading(false);
      setTableData(data.records);
      const unconfirmed = [];
      data.records.forEach(blockVO => {
        if (blockVO.confirmed < 1) {
          unconfirmed.push(blockVO);
        }
      });
      setConfirmed(data.total);
      setUnconfirmed(unconfirmed.length);
      const onChange = (page : number, pageSize : number) => {
        pagination.pageSize = unconfirmed.length > 0 ? pageSize - unconfirmed.length : pageSize;
        pagination.current = page;
        doFetchBlocks();
      }
      if (pagination.current == 1) {
        const total = data.total;
        const dbSize = data.pageSize - unconfirmed.length;
        const dbPages = Math.floor(total / dbSize);
        const uiTotal = (dbPages * unconfirmed.length) + total;
        setPagination({
          ...pagination,
          current: data.current,
          total: uiTotal,
          pageSize: data.pageSize,
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
    pageSize: 20,
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

  return (
    <>
      <Title level={3}>Blocks</Title>
      <Card>
        <OutputTotal></OutputTotal>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
          pagination={pagination}
          rowKey={blockVO => blockVO.number}
          loading={loading}
        />
      </Card>
    </>
  )
}
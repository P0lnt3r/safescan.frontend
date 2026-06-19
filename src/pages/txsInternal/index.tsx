import { Row, Typography, Card, Table, Col } from "antd";
import { useEffect, useMemo, useState } from "react";
import { ContractInternalTransactionVO } from "../../services";
import { fetchContractInternalTransactions } from "../../services/tx";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import EtherAmount from "../../components/EtherAmount";
import Address from "../../components/Address";
import { useTranslation } from "react-i18next";
import BlockNumber from "../../components/BlockNumber";
import { useSearchParams } from "react-router-dom";

import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const DEFAULT_PAGESIZE = 20;

export default () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // ================= URL STATE =================
  const current = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);
  const [total,setTotal] = useState(0);

  const blockNumber = useMemo(() => {
    const v = Number(searchParams.get("block"));
    return isNaN(v) ? 0 : v;
  }, [searchParams]);

  // ================= STATE =================
  const [tableData, setTableData] = useState<ContractInternalTransactionVO[]>([]);
  const [loading, setLoading] = useState(false);

  // ================= PAGINATION (URL DRIVEN) =================
  const pagination: TablePaginationConfig = {
    current,
    pageSize,
    position: ["topRight", "bottomRight"],
    showSizeChanger: true,
  };

  // ================= FETCH =================
  useEffect(() => {
    setLoading(true);

    fetchContractInternalTransactions({
      current,
      pageSize,
    }).then((data) => {
      setLoading(false);
      setTableData(data.records);
      setTotal(data.total);
    });
  }, [current, pageSize]);

  // ================= PAGE CHANGE =================
  const handlePageChange = (page: number, size?: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      if (size) next.set("pageSize", String(size));
      return next;
    });
  };

  // ================= TABLE COLUMNS =================
  const columns: ColumnsType<ContractInternalTransactionVO> = [
    {
      title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
      dataIndex: "blockNumber",
      width: 80,
      render: (blockNumber, txVO) => (
        <BlockNumber blockNumber={blockNumber} confirmed={txVO.confirmed} />
      ),
      fixed: true,
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Date</Text>,
      dataIndex: "timestamp",
      width: 120,
      render: (val) => <>{DateFormat(val * 1000)}</>,
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Parent Txn Hash</Text>,
      dataIndex: "transactionHash",
      width: 160,
      render: (val, txVO) => (
        <TransactionHash
          txhash={val}
          status={txVO.status}
          blockNumber={txVO.blockNumber}
        />
      ),
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Type</Text>,
      dataIndex: "type",
      width: 80,
      render: (val) => <>{val}</>,
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
      dataIndex: "from",
      width: 160,
      render: (from, txVO) => (
        <Address address={from} propVO={txVO.fromPropVO} />
      ),
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
      dataIndex: "to",
      width: 160,
      render: (to, txVO) => (
        <Address address={to} propVO={txVO.toPropVO} />
      ),
    },
    {
      title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
      dataIndex: "value",
      width: 200,
      render: (val) => (
        <Text strong>
          <EtherAmount raw={val} fix={18} />
        </Text>
      ),
    },
  ];

  // ================= UI =================
  return (
    <>
      <Row>
        <Title level={3}>Contract Internal Transactions</Title>

        {blockNumber > 0 && (
          <Text type="secondary" style={{ marginLeft: 8 }}>
            Block #{blockNumber}
          </Text>
        )}
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey={(txVO) => txVO.id}
          scroll={{ x: 800 }}
          loading={loading}
          pagination={{
            ...pagination,
            total: total,
            onChange: handlePageChange,
          }}
        />
      </Card>
    </>
  );
};
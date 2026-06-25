import { useEffect, useMemo, useState } from "react";
import { ContractInternalTransactionVO } from "../../services";
import { fetchAddressContractInternalTransactions } from "../../services/tx";
import { Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import EtherAmount from "../../components/EtherAmount";
import BlockNumber from "../../components/BlockNumber";
import Address from "../../components/Address";
import { format } from "../../utils/NumberFormat";

const { Text } = Typography;
const DEFAULT_PAGESIZE = 10;

export default ({ address }: { address: string }) => {
    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();

    const current = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);

    const [tableData, setTableData] = useState<ContractInternalTransactionVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    // ================= FETCH =================
    useEffect(() => {
        setLoading(true);

        fetchAddressContractInternalTransactions({
            current,
            pageSize,
            address,
        }).then((data) => {
            setTableData(data.records);
            setTotal(data.total);
            setLoading(false);
            console.log("Load Contract Internal Transactions: ", data.records.length);
        });
    }, [address, current, pageSize]);

    // ================= URL PAGINATION =================
    const handlePageChange = (page: number, size?: number) => {
        const next = new URLSearchParams(searchParams);

        next.set("page", String(page));
        if (size) next.set("pageSize", String(size));

        setSearchParams(next);
    };

    const pagination: TablePaginationConfig = {
        current,
        pageSize,
        total,
        position: ["topRight", "bottomRight"],
        showSizeChanger: true,
    };

    // ================= COLUMNS =================
    const columns: ColumnsType<ContractInternalTransactionVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
            dataIndex: "blockNumber",
            width: 120,
            fixed: "left",
            render: (blockNumber, txVO) => (
                <BlockNumber blockNumber={blockNumber} confirmed={txVO.confirmed} />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date</Text>,
            dataIndex: "timestamp",
            width: 200,
            render: (val) => <>{DateFormat(val * 1000)}</>,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Parent Txn Hash</Text>,
            dataIndex: "transactionHash",
            width: 200,
            render: (val, txVO) => (
                <TransactionHash txhash={val} status={txVO.status} />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Type</Text>,
            dataIndex: "type",
            width: 120,
            render: (val) => <>{val}</>,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
            dataIndex: "from",
            width: 240,
            render: (val, txVO) => (
                <Address
                    address={val}
                    propVO={txVO.fromPropVO}
                    style={{ hasLink: address !== val }}
                />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
            dataIndex: "to",
            width: 240,
            render: (val, txVO) => (
                <Address
                    address={val}
                    propVO={txVO.toPropVO}
                    style={{ hasLink: address !== val }}
                />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
            dataIndex: "value",
            width: 200,
            render: (val) => (
                <Text strong>
                    <EtherAmount raw={val} fix={6} />
                </Text>
            ),
        },
    ];

    // ================= UI =================
    return (
        <>
            <Text strong style={{ color: "#6c757e" }}>
                Total of {format(String(total))} Contract Internal Transactions
            </Text>

            <Table
                columns={columns}
                dataSource={tableData}
                rowKey={(txVO) => txVO.transactionHash + "_" + txVO.gasUsed}
                scroll={{ x: 800 }}
                loading={loading}
                pagination={{
                    ...pagination,
                    onChange: handlePageChange,
                }}
            />
        </>
    );
};
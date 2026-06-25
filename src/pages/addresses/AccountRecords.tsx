import { useEffect, useState } from "react";
import { AccountRecordVO } from "../../services";
import { Table, Typography, Tooltip, TablePaginationConfig } from "antd";
import { DateFormat } from "../../utils/DateUtil";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { fetchAccountRecord, fetchAddressAccountRecord } from "../../services/accountRecord";
import BlockNumberFormatTime from "../../components/BlockNumberFormatTime";
import { SorterResult } from "antd/es/table/interface";
import { useBlockNumber } from "../../state/application/hooks";
import Address from "../../components/Address";
import { RenderAccountRecordAmount, RenderAccountRecordId } from "../assets/AccountRecord";

const { Text, Link } = Typography;
const { Column } = Table;
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

const DEFAULT_PAGESIZE = 10;

export default function AddressAccountRecords({ address }: { address: string }) {
    const blockNumber = useBlockNumber();
    const [searchParams, setSearchParams] = useSearchParams();

    const current = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);
    const orderProp = searchParams.get("orderProp") || undefined;
    const orderMode = searchParams.get("orderMode") || undefined;

    const [tableData, setTableData] = useState<AccountRecordVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetchAccountRecord({
            current,
            pageSize,
            orderProp,
            orderMode,
            address,
        }).then((data) => {
            setLoading(false);
            setTableData(data.records);
            setTotal(data.total);
        });
    }, [address, current, pageSize, orderProp, orderMode]);

    const pagination: TablePaginationConfig = {
        current,
        pageSize,
        total,
        showSizeChanger: true,
        position: ["bottomRight", "topRight"],
    };

    const handleTableOnChange = (
        page: TablePaginationConfig,
        _filter: unknown,
        sorter: SorterResult<AccountRecordVO> | SorterResult<AccountRecordVO>[]
    ) => {
        const _sorter = Array.isArray(sorter) ? sorter[0] : sorter;
        const { field, order } = _sorter;

        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (page.current) next.set("page", String(page.current));
            if (page.pageSize) next.set("pageSize", String(page.pageSize));
            if (order && field) {
                next.set("orderProp", String(field));
                next.set("orderMode", order);
            } else {
                next.delete("orderProp");
                next.delete("orderMode");
            }
            return next;
        });
    };

    return (
        <Table
            dataSource={tableData}
            scroll={{ x: 800 }}
            loading={loading}
            onChange={handleTableOnChange}
            pagination={pagination}
            rowKey={(accountRecord: AccountRecordVO) => accountRecord.lockId}
        >
            <Column
                title={<Text strong style={{ color: "#6c757e" }}>ID</Text>}
                dataIndex="lockId"
                render={(_lockId, accountRecord: AccountRecordVO) =>
                    RenderAccountRecordId(accountRecord, blockNumber)
                }
                width={30}
                fixed
            />
            <Column
                title={<Text strong style={{ color: "#6c757e" }}>Amount</Text>}
                dataIndex="amount"
                render={(_amount, accountRecord: AccountRecordVO) =>
                    RenderAccountRecordAmount(accountRecord, blockNumber)
                }
                width={50}
            />
            <Column
                title={<Text strong style={{ color: "#6c757e" }}>Member Of Node</Text>}
                dataIndex="specialAddress"
                render={(specialAddress, accountRecord: AccountRecordVO) => {
                    const isEmpty =
                        specialAddress == EMPTY_ADDRESS || accountRecord.withdrawTxHash;
                    const hasLink = specialAddress != address;
                    return isEmpty ? (
                        <Text type="secondary">[EMPTY]</Text>
                    ) : (
                        <Address
                            address={specialAddress}
                            propVO={accountRecord.nodeAddressPropVO}
                            style={{ hasLink }}
                        />
                    );
                }}
                width={80}
            />
            <Column
                title={<Text strong style={{ color: "#6c757e" }}>Vote For Node</Text>}
                dataIndex="votedAddress"
                render={(votedAddress, accountRecord: AccountRecordVO) => {
                    const isEmpty =
                        votedAddress == EMPTY_ADDRESS || accountRecord.withdrawTxHash;
                    const hasLink = votedAddress != address;
                    return isEmpty ? (
                        <Text type="secondary">[EMPTY]</Text>
                    ) : (
                        <Address
                            address={votedAddress}
                            propVO={accountRecord.votedAddressPropVO}
                            style={{ hasLink }}
                        />
                    );
                }}
                width={80}
            />
            <Column
                title={<Text strong style={{ color: "#6c757e" }}>Create Time</Text>}
                dataIndex="startHeight"
                render={(startHeight, accountRecord: AccountRecordVO) => {
                    const isWithdrawed = accountRecord.withdrawTxHash != undefined;
                    return (
                        <Tooltip title={startHeight}>
                            <RouterLink to={`/tx/${accountRecord.startTxHash}`}>
                                <Link
                                    ellipsis
                                    style={isWithdrawed ? { color: "#dfdfdf" } : {}}
                                >
                                    {DateFormat(accountRecord.startTimestamp * 1000)}
                                </Link>
                            </RouterLink>
                        </Tooltip>
                    );
                }}
                width={50}
            />
            <Column
                title={<Text strong style={{ color: "#6c757e" }}>Unlock</Text>}
                dataIndex="unlockHeight"
                render={(unlockHeight, accountRecord: AccountRecordVO) => {
                    const unlockTimestamp = accountRecord.unlockTimestamp;
                    const isWithdrawed = accountRecord.withdrawTxHash != undefined;
                    return (
                        <Tooltip title={unlockHeight}>
                            {!unlockTimestamp && (
                                <Text
                                    style={isWithdrawed ? { color: "#dfdfdf" } : {}}
                                    strong
                                    type="secondary"
                                >
                                    <BlockNumberFormatTime blockNumber={unlockHeight} />
                                </Text>
                            )}
                            {unlockTimestamp && (
                                <Text
                                    style={isWithdrawed ? { color: "#dfdfdf" } : {}}
                                    type="success"
                                    strong
                                >
                                    {DateFormat(unlockTimestamp * 1000)}
                                </Text>
                            )}
                        </Tooltip>
                    );
                }}
                width={50}
            />
        </Table>
    );
}

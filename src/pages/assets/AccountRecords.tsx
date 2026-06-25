

import { useCallback, useEffect, useMemo, useState } from "react"
import { AccountRecordVO, AddressPropVO, NodeRewardVO, TransactionVO } from "../../services";
import { fetchAddressTransactions } from "../../services/tx";
import { PaginationProps, Table, Typography, Row, Col, Tooltip, TableColumnsType, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import AddressTag, { ShowStyle } from '../../components/AddressTag';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import EtherAmount from '../../components/EtherAmount';
import NavigateLink from "../../components/NavigateLink";
import TxMethodId from "../../components/TxMethodId";
import {
    ArrowRightOutlined,
    FileTextOutlined,
    LockOutlined,
    UnlockOutlined,
    HourglassTwoTone
} from '@ant-design/icons';
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { JSBI } from "@uniswap/sdk";
import { fetchAccountRecord, fetchAddressAccountRecord } from "../../services/accountRecord";
import BlockNumberFormatTime from "../../components/BlockNumberFormatTime";
import { Button } from "antd/lib/radio";
import { FilterValue, SorterResult, TableCurrentDataSource, TablePaginationConfig } from "antd/es/table/interface";
import { DataSourceItemType } from "antd/lib/auto-complete";
import { useBlockNumber } from "../../state/application/hooks";
import Address from "../../components/Address";
import { RenderAccountRecordAmount, RenderAccountRecordId } from "./AccountRecord";

const { Text, Link, Title } = Typography;
const { Column, ColumnGroup } = Table;
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

interface ExpandedAccountRecordDataType {
    key: React.Key,
    type: string,
    transactionHash: string
    action: string
    nodeAddress: string,
    nodeAddressPropVO: AddressPropVO
    freezeHeight: number,
    freezeTimestamp: number,
    unfreezeHeight: number
    unfreezeTimestamp: number
}
const DEFAULT_PAGESIZE = 20;

export default function AccountRecordsPage() {
    const { t } = useTranslation();
    const blockNumber = useBlockNumber();
    const [searchParams, setSearchParams] = useSearchParams();

    const current = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);
    const orderProp = searchParams.get("orderProp") || undefined;
    const orderMode = searchParams.get("orderMode") || undefined;

    const [tableData, setTableData] = useState<AccountRecordVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetchAccountRecord({
            current,
            pageSize,
            orderProp,
            orderMode,
        }).then((data) => {
            setLoading(false);
            setTableData(data.records);
            setTotal(data.total);
        });
    }, [current, pageSize, orderProp, orderMode]);

    const pagination: TablePaginationConfig = {
        current,
        pageSize,
        total,
        showSizeChanger: true,
        position: ["bottomRight"],
    };

    const getSortOrder = (field: string) => {
        if (orderProp !== field || !orderMode) return null;
        return orderMode === "ascend" || orderMode === "descend" ? orderMode : null;
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

    return <>
        <Title level={3}>Account Records</Title>
        <Table dataSource={tableData} scroll={{ x: 800 }}
            loading={loading}
            onChange={handleTableOnChange}
            pagination={pagination}
            rowKey={(accountRecord: AccountRecordVO) => accountRecord.lockId}>
            <Column title={<Text strong style={{ color: "#6c757e" }}>ID</Text>}
                dataIndex="lockId"
                render={(lockId, accountRecord: AccountRecordVO) => {
                    return <>
                        {
                            RenderAccountRecordId(accountRecord, blockNumber)
                        }
                    </>
                }}
                sorter
                sortOrder={getSortOrder("lockId")}
                width={50}
                fixed
            />
            <Column title={<Text strong style={{ color: "#6c757e" }}>Amount</Text>}
                dataIndex="amount"
                render={(amount, accountRecord: AccountRecordVO) => {
                    return <>
                        {
                            RenderAccountRecordAmount(accountRecord, blockNumber)
                        }
                    </>
                }}
                width={60}
                sorter
                sortOrder={getSortOrder("amount")}
            />

            <Column title={<Text strong style={{ color: "#6c757e" }}>Owner</Text>}
                dataIndex="address"
                render={(address, accountRecord: AccountRecordVO) => {
                    const { addressPropVO } = accountRecord;
                    const isWithdrawed = accountRecord.withdrawTxHash != undefined;
                    return <Address address={address} propVO={addressPropVO} style={{ color: isWithdrawed ? "#dfdfdf" : undefined, hasLink: true }} />
                }}
                width={80}
            />

            <Column title={<Text strong style={{ color: "#6c757e" }}>Member Of Node</Text>}
                dataIndex="specialAddress"
                render={(specialAddress, accountRecord: AccountRecordVO) => {
                    const isEmpty = specialAddress == EMPTY_ADDRESS || accountRecord.withdrawTxHash;
                    const hasLink = true;
                    return <>
                        {
                            isEmpty && <Text type="secondary">[EMPTY]</Text>
                        }
                        {
                            !isEmpty && <Address address={specialAddress} propVO={accountRecord.nodeAddressPropVO} style={{ hasLink }} />
                        }
                    </>
                }}
                width={80}
            />

            <Column title={<Text strong style={{ color: "#6c757e" }}>Vote For Node</Text>}
                dataIndex="votedAddress"
                render={(votedAddress, accountRecord: AccountRecordVO) => {
                    const isEmpty = votedAddress == EMPTY_ADDRESS || accountRecord.withdrawTxHash;
                    const hasLink = true;
                    return <>
                        {
                            isEmpty && <Text type="secondary">[EMPTY]</Text>
                        }
                        {
                            !isEmpty && <Address address={votedAddress} propVO={accountRecord.votedAddressPropVO} style={{ hasLink }} />
                        }
                    </>
                }}
                width={80}
            />

            <Column title={<Text strong style={{ color: "#6c757e" }}>Create Time</Text>}
                dataIndex="startHeight"
                render={(startHeight, accountRecord: AccountRecordVO) => {
                    const isWithdrawed = accountRecord.withdrawTxHash != undefined;
                    return <>
                        {
                            accountRecord.startTxHash && <Tooltip title={startHeight}>
                                <RouterLink to={`/tx/${accountRecord.startTxHash}`}>
                                    <Link ellipsis style={isWithdrawed ? { color: "#dfdfdf" } : {}} >{DateFormat(accountRecord.startTimestamp * 1000)}</Link>
                                </RouterLink>
                            </Tooltip>
                        }
                    </>
                }}
                width={60}
            />
            {/* <Column title={<Text strong style={{ color: "#6c757e" }}>Unlock</Text>}
                dataIndex="unlockHeight"
                render={(unlockHeight, accountRecord: AccountRecordVO) => {
                    const unlockTimestamp = accountRecord.unlockTimestamp;
                    const isWithdrawed = accountRecord.withdrawTxHash != undefined;
                    return <>
                        <Tooltip title={unlockHeight}>
                            {
                                !unlockTimestamp && <Text style={ isWithdrawed ? { color : "#dfdfdf" } : {} } strong type="secondary">
                                    <BlockNumberFormatTime blockNumber={unlockHeight} />
                                </Text>
                            }
                            {
                                unlockTimestamp &&
                                <Text style={ isWithdrawed ? { color : "#dfdfdf" } : {} } type="success" strong>{DateFormat(unlockTimestamp * 1000)}</Text>
                            }
                        </Tooltip>
                    </>
                }}
                width={80}
            /> */}
        </Table>

    </>
}
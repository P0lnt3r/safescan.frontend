
import { useCallback, useEffect, useMemo, useState } from "react"
import { AccountRecordVO, NodeRewardVO, TransactionVO } from "../../services";
import { fetchAddressTransactions } from "../../services/tx";
import { PaginationProps, Table, Typography, Row, Col, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import AddressTag, { ShowStyle } from '../../components/AddressTag';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import EtherAmount from '../../components/EtherAmount';
import NavigateLink from "../../components/NavigateLink";
import TxMethodId from "../../components/TxMethodId";
import { ArrowRightOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link as RouterLink } from "react-router-dom";
import { JSBI } from "@uniswap/sdk";
import { fetchAddressNodeRewards } from "../../services/node";
import { fetchAddressAccountRecord } from "../../services/accountRecord";

const { Text, Link } = Typography;
const { Column, ColumnGroup } = Table;

export default ({ address }: { address: string }) => {
    const { t } = useTranslation();
    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchAddressAccountRecords();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    const [tableData, setTableData] = useState<AccountRecordVO[]>([]);

    async function doFetchAddressAccountRecords() {
        fetchAddressAccountRecord({
            current: pagination.current,
            pageSize: pagination.pageSize,
            address: address
        }).then(data => {
            setPagination({
                ...pagination,
                current: data.current,
                pageSize: data.pageSize,
                total: data.total,
                onChange: paginationOnChange,
            })
            setTableData(data.records);
        })
    }

    useEffect(() => {
        pagination.current = 1;
        doFetchAddressAccountRecords();
    }, [address]);

    const RewardTypeLabel = (rewardType: number) => {
        switch (rewardType) {
            case 1:
                return "Creator";
            case 2:
                return "Founder";
            case 3:
                return "Voter";
        }
    }

    const columns: ColumnsType<AccountRecordVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Lock ID</Text>,
            dataIndex: 'lockId',
            width: 80,
            render: lockId => <>{lockId}</>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Amount</Text>,
            dataIndex: 'amount',
            width: 100,
            render: (value) => <Text strong><EtherAmount raw={value} /></Text>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Lock Day</Text>,
            dataIndex: 'lockDay',
            width: 130,
            render: (lockDay) => <>{lockDay}</>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Start-Height</Text>,
            dataIndex: 'startHeight',
            width: 180,
            render: (startHeight, accountRecord) => {
                return <>
                    {startHeight}
                </>
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Unlock-Height</Text>,
            dataIndex: 'unlockHeight',
            width: 180,
            render: (unlockHeight, accountRecord) => {
                return <>
                    {unlockHeight}
                </>
            }
        },
    ];

    return <>

        <Table dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(accountRecord: AccountRecordVO) => accountRecord.lockId}>

            <Column title={<Text strong style={{ color: "#6c757e" }}>Lock-ID</Text>}
                dataIndex="lockId"
                render={(lockId) => {
                    return <>{lockId}</>
                }}
            />

            <Column title={<Text strong style={{ color: "#6c757e" }}>Amount</Text>}
                dataIndex="amount"
                render={(amount) => {
                    return <Text strong><EtherAmount raw={amount} /></Text>
                }}
            />



        </Table>

    </>
}
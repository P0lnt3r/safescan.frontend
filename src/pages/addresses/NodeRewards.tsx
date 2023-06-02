
import { useCallback, useEffect, useMemo, useState } from "react"
import { NodeRewardVO, TransactionVO } from "../../services";
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

const { Text, Link } = Typography;

export default ({ address }: { address: string }) => {
    const { t } = useTranslation();
    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchAddressNodeWards();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    const [tableData, setTableData] = useState<NodeRewardVO[]>([]);

    async function doFetchAddressNodeWards() {
        fetchAddressNodeRewards({
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
        doFetchAddressNodeWards();
    }, [address]);

    const columns: ColumnsType<NodeRewardVO> = [
        {
            title: <>{t('Txn Hash')}</>,
            dataIndex: 'transactionHash',
            render: (txHash, txVO) => <TransactionHash txhash={txHash} sub={8}></TransactionHash>,
            width: 180,
            fixed: 'left',
        },
        {
            title: 'Block',
            dataIndex: 'blockNumber',
            width: 80,
            render: blockNumber => <NavigateLink path={`/block/${blockNumber}`}>{blockNumber}</NavigateLink>
        },
        {
            title: 'Date Time',
            dataIndex: 'timestamp',
            width: 130,
            render: (val) => <>{DateFormat(val * 1000)}</>
        },
        {
            title: "Node",
            dataIndex: 'nodeAddress',
            width: 180,
            render: (nodeAddress, nodeReward) => {
                return <>
                    {nodeAddress}    
                </>
            }
        },
        {
            title: 'To',
            dataIndex: 'address',
            width: 180,
            render: (address, nodeReward) => {
                return <>
                    {address}
                </>
            }
        },
        {
            title: 'Value',
            dataIndex: 'amount',
            width: 100,
            render: (value) => <Text strong><EtherAmount raw={value} /></Text>
        }
       
    ];

    return <>

        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(nodeReward: NodeRewardVO) => nodeReward.transactionHash + nodeReward.eventLogIndex}
        />

    </>
}
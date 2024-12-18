import { useEffect, useState } from "react"
import { NodeRegisterActionVO, SNVoteActionVO } from "../../services";
import { fetchSNVoteActions, fetchSupernodeRegisterActions } from "../../services/node";
import { TablePaginationConfig, Table, Typography, Row, Col, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import TransactionHash from "../../components/TransactionHash";
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { DateFormat } from "../../utils/DateUtil";
import Address, { ChecksumAddress } from "../../components/Address";
import EtherAmount from "../../components/EtherAmount";
import BlockNumber from "../../components/BlockNumber";
import { add } from "date-fns";

const { Text, Link } = Typography;
const DEFAULT_PAGESIZE = 10;

export default ( { address } : {
    address ?: string
} ) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [tableData, setTableData] = useState<SNVoteActionVO[]>([]);

    const [unconfirmed, setUnconfirmed] = useState<number>(0);
    const [confirmed, setConfirmed] = useState<number>(0);

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        position: ["bottomRight"],
        pageSizeOptions: [],
        responsive: true,
    });

    const doFetchSNVoteActions = () => {
        setLoading(true);
        fetchSNVoteActions({
            current: pagination.current,
            pageSize: pagination.pageSize,
            address
        }).then(data => {
            setLoading(false);
            setTableData(data.records);
            const unconfirmed = [];
            data.records.forEach(vo => {
                if (vo.confirmed != 1) {
                    unconfirmed.push(vo);
                }
            })
            setConfirmed(data.total);
            setUnconfirmed(unconfirmed.length);
            const onChange = (page: number, pageSize: number) => {
                pagination.pageSize = unconfirmed.length > 0 ? pageSize - unconfirmed.length : pageSize;
                pagination.current = page;
                doFetchSNVoteActions();
            }
            if (pagination.current == 1) {
                const total = data.total;
                const dbSize = data.pageSize;
                const dbPages = Math.floor(total / dbSize);
                const uiTotal = (dbPages * unconfirmed.length) + total;
                setPagination({
                    ...pagination,
                    current: data.current,
                    total: uiTotal,
                    pageSize: data.records.length,
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

    useEffect(() => {
        doFetchSNVoteActions();
    }, []);

    const columns: ColumnsType<SNVoteActionVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
            dataIndex: 'transactionHash',
            render: (val, vo) => <><TransactionHash blockNumber={vo.blockNumber} txhash={val}></TransactionHash></>,
            width: 150,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Action</Text>,
            dataIndex: 'action',
            render: (val, vo) => <>
                <Text ellipsis>{val}</Text>
            </>,
            width: 100,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
            dataIndex: 'blockNumber',
            width: 60,
            render: (blockNumber, vo) => {
                return <>
                    <BlockNumber blockNumber={blockNumber} confirmed={vo.confirmed}></BlockNumber>
                </>
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
            dataIndex: 'timestamp',
            width: 120,
            render: (val) => <>{DateFormat(val * 1000)}</>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Voter</Text>,
            dataIndex: 'voterAddress',
            width: 150,
            render: (voter, vo) => {
                return <>
                    <Address address={voter} propVO={vo.voterAddressPropVO}/>
                </>
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Supernode</Text>,
            dataIndex: 'targetAddress',
            width: 150,
            render: (address, vo) => {
                return <>
                    <Address address={address} propVO={vo.targetAddressPropVO} />
                </>
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Votes Cast</Text>,
            dataIndex: 'amountWeight',
            width: 80,
            render: (amount) => <Text strong><EtherAmount raw={amount.toString()} fix={6} ignoreLabel /></Text>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Record ID</Text>,
            dataIndex: 'lockId',
            width: 80,
            render: (lockId) => <RouterLink to={`/assets/accountRecords/${lockId}`}>
                <Link strong>{lockId}</Link>
            </RouterLink>
        },
    ]

    return <>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(vo) => vo.transactionHash + vo.eventLogIndex}
            loading={loading}
        />
    </>


}
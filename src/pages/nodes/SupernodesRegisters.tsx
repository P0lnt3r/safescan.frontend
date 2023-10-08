import { useEffect, useState } from "react"
import { NodeRegisterActionVO } from "../../services";
import { fetchSupernodeRegisterActions } from "../../services/node";
import { TablePaginationConfig, Table, Typography, Row, Col, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import TransactionHash from "../../components/TransactionHash";
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { DateFormat } from "../../utils/DateUtil";
import Address, { ChecksumAddress } from "../../components/Address";
import EtherAmount from "../../components/EtherAmount";
import BlockNumber from "../../components/BlockNumber";
import { add } from "date-fns";

const { Title, Text, Link, Paragraph } = Typography;
const DEFAULT_PAGESIZE = 20;

export default () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [tableData, setTableData] = useState<NodeRegisterActionVO[]>([]);
    const [unconfirmed, setUnconfirmed] = useState<number>(0);
    const [confirmed, setConfirmed] = useState<number>(0);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        position: ["bottomRight"],
        pageSizeOptions: [],
        responsive: true,
    });

    const doFetchSupernodeResgiterActions = () => {
        setLoading(true);
        fetchSupernodeRegisterActions({
            current: pagination.current,
            pageSize: pagination.pageSize
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
                doFetchSupernodeResgiterActions();
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
        doFetchSupernodeResgiterActions();
    }, []);

    function RenderAddress(address: string) {
        let _addr = ChecksumAddress(address);
        _addr = _addr.substring(0, 8) + "..." + _addr.substring(_addr.length - 8);
        return <Row>
            <Tooltip title={address}>
                <Text>
                    {_addr}
                </Text>
            </Tooltip>
            <Paragraph style={{ float: "right", height: "0px" }} copyable={{ text: address }}>
            </Paragraph>
        </Row>;
    }

    const columns: ColumnsType<NodeRegisterActionVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
            dataIndex: 'transactionHash',
            render: (val, vo) => <><TransactionHash blockNumber={vo.blockNumber} txhash={val}></TransactionHash></>,
            width: 180,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Register Type</Text>,
            dataIndex: 'registerType',
            render: (val, vo) => <>
                {val}
            </>,
            width: 100,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
            dataIndex: 'blockNumber',
            width: 80,
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
            title: <Text strong style={{ color: "#6c757e" }}>Operator</Text>,
            dataIndex: 'operator',
            width: 150,
            render: (operator, vo) => {
                return <>
                    <Address address={operator} />
                </>
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Supernode</Text>,
            dataIndex: 'address',
            width: 150,
            render: (address, vo) => {
                return <>
                    <Address address={address} />
                </>
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Amount</Text>,
            dataIndex: 'amount',
            width: 100,
            render: (amount) => <Text strong><EtherAmount raw={amount.toString()} fix={6} /></Text>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Account Record ID</Text>,
            dataIndex: 'lockId',
            width: 120,
            render: (lockId) => <Text strong>{lockId}</Text>
        },
    ]

    return <>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(vo) => vo.transactionHash + vo.eventLogIndex}
            loading={loading}
        />
    </>


}
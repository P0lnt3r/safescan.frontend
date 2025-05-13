import { useCallback, useEffect, useMemo, useState } from "react"
import { Safe3RedeemVO, TransactionVO } from "../../../services";
import { PaginationProps, Table, Typography, Row, Col, Tooltip, TablePaginationConfig, Card, Input, Divider, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import TransactionHash from '../../../components/TransactionHash';
import { DateFormat } from '../../../utils/DateUtil';
import EtherAmount from '../../../components/EtherAmount';
import { format } from "../../../utils/NumberFormat";
import { fetchAddressSafe3Redeems } from "../../../services/safe3Redeem";
import Safe3AddressRedeem from "./Safe3AddressRedeem";
import { IsSafe3Address, IsSafe4Address } from "../../../utils/AddressUtil";

const { Text, Link } = Typography;
const DEFAULT_PAGESIZE = 10;

export default () => {

    const { t } = useTranslation();
    const [tableData, setTableData] = useState<Safe3RedeemVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [unconfirmed, setUnconfirmed] = useState<number>(0);
    const [confirmed, setConfirmed] = useState<number>(0);
    const [address, setAddress] = useState<string>();

    const [inputErrors, setInputErrors] = useState<{
        address: string | undefined,
    }>();

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        position: ["topRight", "bottomRight"],
        pageSizeOptions: [],
        responsive: true,
    });

    async function doFetchAddressTransactions() {
        setLoading(true)
        fetchAddressSafe3Redeems({
            current: pagination.current,
            pageSize: pagination.pageSize,
            address: address
        }).then(data => {
            setLoading(false)
            setTableData(data.records);
            const unconfirmed = [];
            data.records.forEach(tx => {
                if (tx.confirmed != 1) {
                    unconfirmed.push(tx);
                }
            })
            setConfirmed(data.total);
            setUnconfirmed(unconfirmed.length);
            const onChange = (page: number, pageSize: number) => {
                pagination.pageSize = unconfirmed.length > 0 ? pageSize - unconfirmed.length : pageSize;
                pagination.current = page;
                doFetchAddressTransactions();
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
        pagination.current = 1;
        pagination.pageSize = DEFAULT_PAGESIZE;
        doFetchAddressTransactions();
    }, [address]);

    function OutputTotal() {
        return <>
            {
                confirmed != unconfirmed && <Text strong style={{ color: "#6c757e" }}>Total of {
                    confirmed && <>{format(confirmed + "")}</>
                } Transactions
                    {unconfirmed > 0 && <Text> and {unconfirmed} unconfirmed</Text>}
                </Text>
            }
        </>
    }

    const columns: ColumnsType<Safe3RedeemVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
            dataIndex: 'transactionHash',
            key: 'transactionHash',
            render: (transactionHash, vo) => <><TransactionHash blockNumber={vo.blockNumber} txhash={transactionHash}></TransactionHash></>,
            width: 100,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
            dataIndex: 'timestamp',
            width: 100,
            render: (val) => <>{DateFormat(val * 1000)}</>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Action</Text>,
            dataIndex: 'action',
            width: 100,
            render: (val) => <>{val}</>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Safe3 Address & Safe4 Address</Text>,
            dataIndex: 'safe3Address',
            width: 250,
            render: (value, vo) => {
                const { safe3Address, safe4Address } = vo;
                return <>
                    <Text>{safe3Address}</Text>
                    <br />
                    <Text strong>{safe4Address}</Text>
                </>
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Amount</Text>,
            dataIndex: 'amount',
            width: 120,
            render: (value) => <Text strong><EtherAmount raw={value} /></Text>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Lock ID</Text>,
            dataIndex: 'lockId',
            width: 60,
            render: (value) => <Text strong>{value}</Text>
        },
    ];

    return <>

        <Card title="Safe3 Redeem Records" style={{ marginTop: "40px" }}>
            <Row>
                <Col span={6}>
                    <Input.Search onChange={() => {
                        setInputErrors({
                            ...inputErrors,
                            address: undefined
                        })
                    }} onSearch={(_address) => {
                        const address = _address.trim();
                        if (address) {
                            if (IsSafe3Address(address) || IsSafe4Address(address)) {
                                setAddress(address);
                            } else {
                                setInputErrors({
                                    ...inputErrors,
                                    address: "Invalid Safe3 Address Or Safe4 Address"
                                })
                            }
                        } else {
                            setAddress(undefined);
                        }
                    }} placeholder="Safe3 Address | Safe4 Address" /><br />
                    {
                        inputErrors?.address && <>
                            <Alert style={{ marginTop: "5px" }} type="error" showIcon message={inputErrors.address} />
                        </>
                    }
                </Col>

                {
                    address && <Col span={24} style={{ marginTop: "10px" }}>
                        <Safe3AddressRedeem address={address} />
                    </Col>
                }
                <Col span={24} style={{ marginTop: "40px" }}>
                    <OutputTotal></OutputTotal>
                    <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
                        loading={loading}
                        pagination={pagination} rowKey={(vo: Safe3RedeemVO) => vo.transactionHash + vo.eventLogIndex}
                    />
                </Col>
            </Row>

        </Card>

    </>

}
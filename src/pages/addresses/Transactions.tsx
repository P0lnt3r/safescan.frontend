import { useEffect, useState } from "react"
import { TransactionVO } from "../../services";
import { fetchAddressTransactions } from "../../services/tx";
import { PaginationProps , Table, Typography, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import AddressTag, { ShowStyle } from '../../components/AddressTag';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import EtherAmount from '../../components/EtherAmount';
import NavigateLink from "../../components/NavigateLink";
import TxMethodId from "../../components/TxMethodId";

const { Text } = Typography;

export default ({ address }: { address: string }) => {
    const { t } = useTranslation();
    async function doFetchAddressTransactions() {
        fetchAddressTransactions({
            current: pagination.current,
            pageSize: pagination.pageSize,
            address: address
        }).then(data => {
            setPagination({
                current: data.current,
                pageSize: data.pageSize,
                total: data.total,
                ...pagination
            })
            setTableData(data.records);
        })
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: (page, pageSize) => {
            pagination.current = page;
            doFetchAddressTransactions();
        }
    });
    const [tableData, setTableData] = useState<TransactionVO[]>([]);

    useEffect(() => {
        doFetchAddressTransactions();
    }, [address]);

    const columns: ColumnsType<TransactionVO> = [
        {
            title: <>{t('Txn Hash')}</>,
            dataIndex: 'hash',
            key: 'hash',
            render: (val, txVO) => <TransactionHash txhash={val} sub={8} status={txVO.status}></TransactionHash>,
            width: 180,
            fixed: 'left',
        },
        {
            title: 'Method',
            dataIndex: 'methodId',
            width: 100,
            render: ( methodId , txVO ) => <TxMethodId methodId={methodId} address={txVO.to} />
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
            title: "From",
            dataIndex: 'from',
            width: 180,
            render: (val) => <>
                <Row>
                    <Col span={20}>
                        {
                            address === val 
                                ? <AddressTag address={val} sub={8} showStyle={ShowStyle.NO_LINK} />
                                : <AddressTag address={val} sub={8} />
                        }
                    </Col>
                    <Col span={4}>
                        {
                            address === val 
                                ? <Text code strong style={{color:"orange"}}>OUT</Text>
                                : <Text code strong style={{color:"green"}}>IN</Text>
                        }
                    </Col>
                </Row>
            </>
        },
        {
            title: 'To',
            dataIndex: 'to',
            width: 180,
            render: (val) => <>{
                address === val 
                    ? <AddressTag address={val} sub={8} showStyle={ShowStyle.NO_LINK} />
                    : <AddressTag address={val} sub={8} />
            }</>
        },
        {
            title: 'Value',
            dataIndex: 'value',
            width: 100,
            render: (value) => < div style={{ fontSize: '14px' }} ><EtherAmount raw={value}></EtherAmount></div>
        },
        {
            title: 'Txn Fee',
            dataIndex: 'txFee',
            width: 100,
        },
    ];

    return <>

        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={ (txVO : TransactionVO) => txVO.hash }
        />

    </>

}
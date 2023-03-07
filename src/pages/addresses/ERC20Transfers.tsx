import { PaginationProps , Tag  } from "antd";
import { useEffect, useState } from "react"
import { ERC20TransferVO, TransactionVO } from "../../services";
import { fetchAddressERC20Transfers } from "../../services/tx";
import { Card, Table, Typography, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { fetchTransactions } from '../../services/tx';
import { useTranslation } from 'react-i18next';
import AddressTag, { ShowStyle } from '../../components/AddressTag';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import { ArrowRightOutlined } from '@ant-design/icons';
import EtherAmount from '../../components/EtherAmount';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

const { Title, Text, Link } = Typography;

export default ({ address }: { address: string }) => {
    const { t } = useTranslation();
    async function doFetchAddressTransactions() {
        fetchAddressERC20Transfers({
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
    const [tableData, setTableData] = useState<ERC20TransferVO[]>([]);

    useEffect(() => {
        doFetchAddressTransactions();
    }, []);

    const columns: ColumnsType<ERC20TransferVO> = [
        {
            title: <>{t('Txn Hash')}</>,
            dataIndex: 'transactionHash',
            render: (val, txVO) => <><TransactionHash txhash={val} sub={8} status={1}></TransactionHash></>,
            width: 180,
            fixed: 'left',
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
    ];

    return <>

        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={ (vo) => vo.transactionHash }
        />

    </>

}
import { useEffect, useState } from "react"
import { ERC20TransferVO, NftTransferVO } from "../../services";
import { fetchAddressERC20Transfers, fetchERC20Transfers, fetchNftTransfers } from "../../services/tx";
import { Table, Typography, Row, Col, PaginationProps, Tooltip, TablePaginationConfig, Tag, Card  , Divider} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import { Link as RouterLink } from 'react-router-dom';
import ERC20TokenAmount from "../../components/ERC20TokenAmount";
import ERC20Logo from "../../components/ERC20Logo";
import { format } from "../../utils/NumberFormat";
import TxMethodId from "../../components/TxMethodId";
import Address from "../../components/Address";
import NFTLogo from "../../components/NFTLogo";

const { Text, Link } = Typography;
const DEFAULT_PAGESIZE = 20;

export default ({ token, tokenId, tokenType }: {
    token: string,
    tokenId: string,
    tokenType: string,
}) => {

    const { t } = useTranslation();
    const [tableData, setTableData] = useState<NftTransferVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [unconfirmed, setUnconfirmed] = useState<number>(0);
    const [confirmed, setConfirmed] = useState<number>(0);

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        position: ["topRight", "bottomRight"],
        pageSizeOptions: [],
        responsive: true,
    });

    async function doFetchNFTTokenTransactions() {
        setLoading(true)
        fetchNftTransfers({
            current: pagination.current,
            pageSize: pagination.pageSize,
            token: token,
            tokenId: tokenId
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
                doFetchNFTTokenTransactions();
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
        doFetchNFTTokenTransactions();
    }, [token, tokenId]);

    const columns: ColumnsType<NftTransferVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
            dataIndex: 'transactionHash',
            render: (val, txVO) => <><TransactionHash blockNumber={txVO.blockNumber} txhash={val} status={1}></TransactionHash></>,
            width: 180,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Method ID</Text>,
            dataIndex: 'methodId',
            width: 120,
            render: (methodId, vo) => <>
                <TxMethodId methodId={methodId} address={vo.toContract} subType={vo.toContractPropVO.subType} />
            </>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
            dataIndex: 'timestamp',
            width: 150,
            render: (val) => <>{DateFormat(val * 1000)}</>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
            dataIndex: 'from',
            width: 150,
            render: (from, txVO) => {
                return (
                    <>
                        <Address address={from} propVO={txVO.fromPropVO} />
                    </>
                )
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
            dataIndex: 'to',
            width: 150,
            render: (to, vo) =>
                <Address address={to} propVO={vo.toPropVO}></Address >

        }
    ];
    if ( tokenType == "erc1155" ){
        columns.push({
            title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
            dataIndex: 'tokenValue',
            width: 150,
            render: (tokenValue, vo) => <>{tokenValue}</>
        });
    }

    function OutputTotal() {
        return <>
            {
                confirmed != unconfirmed && <Text strong style={{ color: "#6c757e" }}>Total of {
                    confirmed && <>{format(confirmed + "")}</>
                } NFT Transfers
                    {unconfirmed > 0 && <Text> and {unconfirmed} unconfirmed</Text>}
                </Text>
            }
        </>
    }

    return <>
        <Divider style={{ marginTop:"20px"}} />
        <Card title="NFT Transfers">
            <OutputTotal />
            <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }} loading={loading}
                pagination={pagination} rowKey={(vo) => vo.transactionHash}
            />
        </Card>

    </>

}
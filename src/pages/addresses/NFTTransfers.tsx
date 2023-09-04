import { useEffect, useState } from "react"
import { ERC20TransferVO, NftTransferVO } from "../../services";
import { fetchAddressERC20Transfers, fetchNftTransfers } from "../../services/tx";
import { Table, Typography, Row, Col, PaginationProps, Tooltip, TablePaginationConfig, Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import { Link as RouterLink } from 'react-router-dom';
import ERC20TokenAmount from "../../components/ERC20TokenAmount";
import ERC20Logo from "../../components/ERC20Logo";
import { format } from "../../utils/NumberFormat";
import NFT_PLACEHOLDER from "../../images/nft-placeholder.svg";
import NFTLogo from "../../components/NFTLogo";
import Address from "../../components/Address";
import TxMethodId from "../../components/TxMethodId";
import NFT_URI_IMG, { NFT_URI_IMG_SIZE } from "../../components/NFT_URI_IMG";

const { Text, Link } = Typography;
const DEFAULT_PAGESIZE = 20;

export default ({ address }: { address: string }) => {

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

    async function doFetchAddressERC721Transactions() {
        setLoading(true)
        fetchNftTransfers({
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
                doFetchAddressERC721Transactions();
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
        doFetchAddressERC721Transactions();
    }, [address]);

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
            width: 120,
            render: (val) => <>{DateFormat(val * 1000)}</>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
            dataIndex: 'from',
            width: 160,
            render: (from, txVO) => {
                return (
                    <>
                        <Row>
                            <Col span={20}>
                                <Tooltip title={from}>
                                    {
                                        address === from
                                            ? <Text style={{ width: "80%" }} ellipsis>
                                                {from}
                                            </Text>
                                            :
                                            <RouterLink to={`/address/${from}`}>
                                                <Link style={{ width: "80%" }} ellipsis>{from}</Link>
                                            </RouterLink>
                                    }
                                </Tooltip>
                            </Col>
                            <Col span={4}>
                                {
                                    address === from
                                        ? <Text code strong style={{ color: "orange" }}>OUT</Text>
                                        : <Text code strong style={{ color: "green" }}>IN</Text>
                                }
                            </Col>
                        </Row>
                    </>
                )
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
            dataIndex: 'to',
            width: 160,
            render: (to, vo) =>
                <Address address={to} propVO={vo.toPropVO} style={{ hasLink: to != address }} ></Address >

        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Type</Text>,
            dataIndex: 'tokenType',
            width: 100,
            render: (tokenType, vo) => {
                let showText = tokenType;
                if (tokenType == "erc721") {
                    showText = "ERC-721"
                }
                if (tokenType == "erc1155") {
                    showText = "ERC-1155"
                }
                return <>
                    <Tag style={{
                        height: "30px", lineHeight: "28px", borderRadius: "10px"
                    }}>{showText}</Tag>
                    {
                        tokenType == "erc1155" && <>
                            <Tag style={{
                                height: "30px", lineHeight: "28px", borderRadius: "10px", float:"right"
                            }}>x{vo.tokenValue}</Tag>
                        </>
                    }
                </>
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Item</Text>,
            dataIndex: 'tokenURI',
            width: 180,
            render: (tokenURI, nftTransferVO) => {
                const { tokenId, tokenPropVO, token } = nftTransferVO;
                const nftProp = tokenPropVO && (tokenPropVO.subType == "erc721" || tokenPropVO.subType == "erc1155") ? tokenPropVO?.prop : undefined;
                const nft = nftProp ? JSON.parse(nftProp) : undefined;
                return (
                    <div style={{ fontSize: '14px' }}>
                        {
                            tokenPropVO && <>
                                <Row style={{ width: "100%" }}>
                                    <Col span={4}>
                                        <NFT_URI_IMG size={NFT_URI_IMG_SIZE.SMALL} uri={tokenURI} />
                                    </Col>
                                    <Col span={20}>
                                        <Col span={24}>
                                            <Tooltip title={`${nft.symbol}#${tokenId}`}>
                                                <RouterLink to={`/nft/${token}/${tokenId}`}>
                                                    <Link href='#' ellipsis style={{ width: '80%', marginLeft: "5px" }}>
                                                        {nft.symbol}#{tokenId}
                                                    </Link>
                                                </RouterLink>
                                            </Tooltip>
                                        </Col>
                                        <Col span={24}>
                                            <Tooltip title={`${token}|${nft.name}`}>
                                                <RouterLink to={`/token/${token}`}>
                                                    <Text type="secondary" ellipsis style={{ width: '80%', marginLeft: "5px" }}>
                                                        {nft.name}({nft.symbol})
                                                    </Text>
                                                </RouterLink>
                                            </Tooltip>
                                        </Col>
                                    </Col>
                                </Row>
                            </>
                        }
                    </div>
                )
            }
        },
    ];

    function OutputTotal() {
        return <>
            {
                <Text strong style={{ color: "#6c757e" }}>Total of {
                    confirmed && <>{format(confirmed + "")}</>
                } NFT Transfer Events
                    {unconfirmed > 0 && <Text type="secondary"> and {unconfirmed} unconfirmed</Text>}
                </Text>
            }
        </>
    }

    return <>
        <OutputTotal></OutputTotal>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }} loading={loading}
            pagination={pagination} rowKey={(vo) => vo.transactionHash}
        />
    </>

}
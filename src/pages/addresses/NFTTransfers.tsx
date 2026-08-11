import { useEffect, useState } from "react";
import { NftTransferVO } from "../../services";
import { fetchNftTransfers } from "../../services/tx";
import { Table, Typography, Row, Col, Tooltip, TablePaginationConfig, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSearchParams } from "react-router-dom";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import { Link as RouterLink } from "react-router-dom";
import { format } from "../../utils/NumberFormat";
import Address from "../../components/Address";
import TxMethodId from "../../components/TxMethodId";
import NFT_URI_IMG, { NFT_URI_IMG_SIZE } from "../../components/NFT_URI_IMG";

const { Text, Link } = Typography;
const DEFAULT_PAGESIZE = 10;

export default function NFTTransfers({ address }: { address: string }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const current = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);

    const [tableData, setTableData] = useState<NftTransferVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [unconfirmed, setUnconfirmed] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetchNftTransfers({ current, pageSize, address }).then((data) => {
            setLoading(false);
            setTableData(data.records);
            setTotal(data.total);
            setUnconfirmed(data.records.filter((tx) => tx.confirmed !== 1).length);
        });
    }, [address, current, pageSize]);

    const handlePageChange = (page: number, size?: number) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", String(page));
            if (size) next.set("pageSize", String(size));
            return next;
        });
    };

    const pagination: TablePaginationConfig = {
        current,
        pageSize,
        total,
        showSizeChanger: true,
        position: ["bottomRight"],
    };

    const columns: ColumnsType<NftTransferVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
            dataIndex: "transactionHash",
            render: (val, txVO) => (
                <TransactionHash blockNumber={txVO.blockNumber} txhash={val} status={1} />
            ),
            width: 100,
            fixed: "left",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Method ID</Text>,
            dataIndex: "methodId",
            width: 100,
            render: (methodId, vo) => (
                <TxMethodId
                    methodId={methodId}
                    address={vo.toContract}
                    subType={vo.toContractPropVO?.subType}
                />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
            dataIndex: "timestamp",
            width: 120,
            render: (val) => <>{DateFormat(val * 1000)}</>,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
            dataIndex: "from",
            width: 180,
            render: (from, txVO) => (
                <Row>
                    <Col span={20}>
                        <Address
                            address={from}
                            propVO={txVO.fromPropVO}
                            style={{ hasLink: from !== address }}
                        />
                    </Col>
                    <Col span={4}>
                        {address === from ? (
                            <Text code strong style={{ color: "orange" }}>OUT</Text>
                        ) : (
                            <Text code strong style={{ color: "green" }}>IN</Text>
                        )}
                    </Col>
                </Row>
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
            dataIndex: "to",
            width: 160,
            render: (to, vo) => (
                <Address address={to} propVO={vo.toPropVO} style={{ hasLink: to !== address }} />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Type</Text>,
            dataIndex: "tokenType",
            width: 60,
            render: (tokenType, vo) => {
                let showText = tokenType;
                if (tokenType === "erc721") showText = "ERC-721";
                if (tokenType === "erc1155") showText = "ERC-1155";
                return (
                    <>
                        <Tag style={{ height: "18px", lineHeight: "14px", borderRadius: "6px" ,   float: "right" }}>
                            {showText}
                        </Tag>
                        {tokenType === "erc1155" && (
                            <Tag
                                style={{
                                    height: "18px",
                                    lineHeight: "14px",
                                    borderRadius: "6px",
                                    float: "right",
                                }}
                            >
                                x{vo.tokenValue}
                            </Tag>
                        )}
                    </>
                );
            },
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Item</Text>,
            dataIndex: "tokenImage",
            width: 120,
            render: (tokenImage, nftTransferVO) => {
                const { tokenId, tokenPropVO, token } = nftTransferVO;
                const nftProp =
                    tokenPropVO &&
                    (tokenPropVO.subType === "erc721" || tokenPropVO.subType === "erc1155")
                        ? tokenPropVO?.prop
                        : undefined;
                const nft = nftProp ? JSON.parse(nftProp) : undefined;
                return (
                    <div style={{ fontSize: "14px" }}>
                        {tokenPropVO && (
                            <Row style={{ width: "100%" }}>
                                <Col span={4}>
                                    <NFT_URI_IMG size={NFT_URI_IMG_SIZE.SMALL} uri={tokenImage} />
                                </Col>
                                <Col span={20}>
                                    <Col span={24}>
                                        <Tooltip title={`${nft.symbol}#${tokenId}`}>
                                            <RouterLink to={`/nft/${token}/${tokenId}`}>
                                                <Link ellipsis style={{ width: "80%", marginLeft: "5px" }}>
                                                    {nft.symbol}#{tokenId}
                                                </Link>
                                            </RouterLink>
                                        </Tooltip>
                                    </Col>
                                    <Col span={24}>
                                        <Tooltip title={`${token}|${nft.name}`}>
                                            <RouterLink to={`/token/${token}`}>
                                                <Text
                                                    type="secondary"
                                                    ellipsis
                                                    style={{ width: "80%", marginLeft: "5px" }}
                                                >
                                                    {nft.name}({nft.symbol})
                                                </Text>
                                            </RouterLink>
                                        </Tooltip>
                                    </Col>
                                </Col>
                            </Row>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <>
            {total > 0 && (
                <Text strong style={{ color: "#6c757e" }}>
                    Total of {format(String(total))} NFT Transfer Events
                    {unconfirmed > 0 && (
                        <Text type="secondary"> and {unconfirmed} unconfirmed</Text>
                    )}
                </Text>
            )}
            <Table
                columns={columns}
                dataSource={tableData}
                scroll={{ x: 800 }}
                loading={loading}
                rowKey={(vo) => vo.transactionHash + vo.tokenId + vo.tokenValue}
                pagination={{
                    ...pagination,
                    onChange: handlePageChange,
                }}
            />
        </>
    );
}

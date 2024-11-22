import { NftTransferVO } from "../../services"
import { Typography, Tag, Input, Tooltip, Row, Col, Divider, Badge, Card } from 'antd';

import {
    QuestionCircleOutlined,
} from '@ant-design/icons';
import NFT_URI_IMG, { NFT_URI_IMG_SIZE } from "../../components/NFT_URI_IMG";
import { useMemo } from "react";
import { Link as RouterLink } from 'react-router-dom';
import ERC20Logo from "../../components/ERC20Logo";
import Address from "../../components/Address";

const { Text, Link } = Typography;

export default ({
    nftTransfers
}: { nftTransfers: NftTransferVO[] }) => {

    const { erc721Transfers, erc1155Transfers } = useMemo(() => {
        const erc721Transfers: NftTransferVO[] = [];
        const erc1155Transfers: NftTransferVO[] = [];
        nftTransfers.forEach(nftTransfer => {
            const nftType = nftTransfer.tokenPropVO?.subType;
            if ("erc1155" == nftType) {
                erc1155Transfers.push(nftTransfer)
            } else {
                erc721Transfers.push(nftTransfer);
            }
        });
        return {
            erc721Transfers, erc1155Transfers
        }
    }, [nftTransfers])

    return <>
        {
            erc721Transfers.length > 0 && <>
                <Divider style={{ margin: '18px 0px' }} />
                <Row>
                    <Col xl={8} xs={24}>
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>ERC1155 Tokens Transferred:  <Tag color="#77838f">{erc721Transfers.length}</Tag></Text>
                    </Col>
                    <Col xl={16} xs={24}>
                        {
                            erc721Transfers.map((nftTransfer) => {
                                const { token, tokenId, tokenValue, tokenImage, tokenPropVO,
                                    from, fromPropVO, to, toPropVO } = nftTransfer;
                                const nftProp = tokenPropVO?.prop;
                                const nft = nftProp ? JSON.parse(nftProp) : undefined;
                                return <>
                                    <Row style={{ marginBottom: "20px" }}>
                                        <Col span={1}>
                                            <NFT_URI_IMG uri={tokenImage} size={NFT_URI_IMG_SIZE.SMALL} />
                                        </Col>
                                        <Col span={18} style={{ marginLeft: "10px" }}>
                                            <Text type="secondary">ERC721 </Text>
                                            <Text style={{ marginRight: "5px" }}>Token ID [
                                                <RouterLink to={`/nft/${token}/${tokenId}`}>
                                                    <Link strong style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                                                        {tokenId}
                                                    </Link>
                                                </RouterLink>
                                                ]</Text>
                                            <ERC20Logo address={token} />
                                            <Tooltip title={token}>
                                                <RouterLink to={`/token/${token}`}>
                                                    <Link strong style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                                                        {nft.name}({nft.symbol})
                                                    </Link>
                                                </RouterLink>
                                            </Tooltip>
                                            <br />
                                            <Row style={{ width: "80%" }}>
                                                <Col span={2}>
                                                    <Text strong>From</Text>
                                                </Col>
                                                <Col span={9}>
                                                    <Address address={from} propVO={fromPropVO}></Address>
                                                </Col>
                                                <Col span={1}>
                                                    <Text strong>To</Text>
                                                </Col>
                                                <Col span={9}>
                                                    <Address address={to} propVO={toPropVO}></Address>
                                                </Col>
                                            </Row>

                                        </Col>
                                    </Row>
                                </>
                            })
                        }
                    </Col>
                </Row>
            </>
        }

        {
            erc1155Transfers.length > 0 && <>
                <Divider style={{ margin: '18px 0px' }} />
                <Row>
                    <Col xl={8} xs={24}>
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>ERC1155 Tokens Transferred:  <Tag color="#77838f">{erc1155Transfers.length}</Tag></Text>
                    </Col>
                    <Col xl={16} xs={24}>
                        {
                            erc1155Transfers.map((nftTransfer) => {
                                const { token, tokenId, tokenValue, tokenImage, tokenPropVO,
                                    from, fromPropVO, to, toPropVO } = nftTransfer;
                                const nftProp = tokenPropVO?.prop;
                                const nft = nftProp ? JSON.parse(nftProp) : undefined;
                                return <>
                                    <Row style={{ marginBottom: "20px" }}>
                                        <Col span={1}>
                                            <NFT_URI_IMG uri={tokenImage} size={NFT_URI_IMG_SIZE.SMALL} />
                                        </Col>
                                        <Col span={18} style={{ marginLeft: "10px" }}>
                                            <Text type="secondary">ERC1155 </Text>
                                            <Text style={{ marginRight: "5px" }}> For {tokenValue} of Token ID [
                                                <RouterLink to={`/nft/${token}/${tokenId}`}>
                                                    <Link strong style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                                                        {tokenId}
                                                    </Link>
                                                </RouterLink>
                                                ]</Text>
                                            <ERC20Logo address={token} />
                                            <Tooltip title={token}>
                                                <RouterLink to={`/token/${token}`}>
                                                    <Link strong style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                                                        {nft.name}({nft.symbol})
                                                    </Link>
                                                </RouterLink>
                                            </Tooltip>
                                            <br />
                                            <Row style={{ width: "80%" }}>
                                                <Col span={2}>
                                                    <Text strong>From</Text>
                                                </Col>    
                                                <Col span={9}>
                                                    <Address address={from} propVO={fromPropVO}></Address>
                                                </Col>
                                                <Col span={1}>
                                                    <Text strong>To</Text>
                                                </Col>
                                                <Col span={9}>
                                                    <Address address={to} propVO={toPropVO}></Address>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </>
                            })
                        }
                    </Col>
                </Row>
            </>
        }

    </>

}
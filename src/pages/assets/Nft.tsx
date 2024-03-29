import { useNavigate, useParams } from "react-router"
import { Row, Col, Card, Typography, Divider, Tabs, Collapse } from "antd"
import ERC20Logo from "../../components/ERC20Logo";
import Address from "../../components/Address";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import type { TabsProps } from 'antd';
import { useEffect, useMemo, useState } from "react";
import { fetchERC20Transfers } from "../../services/tx";
import { ContractVO, ERC20TokenVO, ERC20TransferVO, NftAssetVO, TokenInfoVO } from "../../services";
import ERC20Transfers from "./ERC20Transfers";
import ERC20TokenTransfers from "./ERC20TokenTransfers";
import ERC20TokenHolders from "./ERC20TokenHolders";
import { fetchNftAsset, fetchToken } from "../../services/assets";
import ERC20TokenAmount from "../../components/ERC20TokenAmount";
import NFTLogo from "../../components/NFTLogo";
import { Link as RouterLink } from 'react-router-dom';

import NFT_PLACEHOLDER from "../../images/nft-placeholder.svg";
import { NFT_Type_Label } from "../../utils/NFTUtils";
import NftTransfers from "./Nft-Transfers";
import { format } from "../../utils/NumberFormat";
import NFT_URI_IMG, { NFT_URI_IMG_SIZE } from "../../components/NFT_URI_IMG";

const { Title, Text, Paragraph, Link } = Typography;
const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

export default () => {

    const { token, tokenId } = useParams();
    const [nftAssetVo, setNftAssetVO] = useState<NftAssetVO>();
    const navigate = useNavigate();

    useEffect(() => {
        if (token && tokenId) {
            fetchNftAsset(token, tokenId).then(data => setNftAssetVO(data))
        }
    }, [token, tokenId])

    const {
        nftTokenAssetVO
    } = useMemo(() => {
        if (nftAssetVo) {
            return nftAssetVo;
        }
        return {
            nftTokenAssetVO: undefined
        }
    }, [nftAssetVo])
    const tokenMetadata = nftTokenAssetVO?.tokenMetadata ? JSON.parse(nftTokenAssetVO?.tokenMetadata) : undefined;
    const tokenDescription = tokenMetadata && tokenMetadata.description ;

    return <>
        <Row>

            <Col style={{ marginTop: "15px", padding: "5px" }} xl={10} xs={24} >
                <Card size="small" style={{ padding: "2%", width: "100%", textAlign: "center", height: "523px" , backgroundColor:"#f9f9f9" , border: "1px solid #d9d9d9" }}>
                    {
                        nftAssetVo?.nftTokenAssetVO &&
                        <NFT_URI_IMG uri={nftAssetVo?.nftTokenAssetVO.tokenImage}
                            size={NFT_URI_IMG_SIZE.LARGE}
                        />
                    }
                </Card>
            </Col>

            <Col style={{ marginTop: "15px", padding: "5px" }} xl={14} xs={24} >
                <Title ellipsis level={2}>
                    {tokenMetadata && tokenMetadata.name }
                </Title>
                <Title level={5}>
                    {
                        nftAssetVo?.nftTokenVO &&
                        <>
                            <ERC20Logo address={nftAssetVo?.nftTokenVO.address}></ERC20Logo>
                            <RouterLink style={{ marginLeft: "5px", marginRight: "15px" }} to={`/token/${nftAssetVo.nftTokenVO.address}`}>
                                <Link>{nftAssetVo.nftTokenVO.symbol}</Link>
                            </RouterLink>
                            <Text>#{tokenId}</Text>
                        </>
                    }
                </Title>
                <Collapse defaultActiveKey={['details']}>
                    <Panel header="Details" key="details">
                        {
                            nftAssetVo?.nftTokenAssetVO.tokenType == "erc721"
                            &&
                            <Row style={{ marginTop: "15px" }}>
                                <Col xl={6} xs={24}><Text strong type="secondary">Owner:</Text></Col>
                                <Col xl={18} xs={24}>
                                    {
                                        nftAssetVo?.nftTokenAssetVO.owner
                                    }
                                </Col>
                            </Row>
                        }

                        <Row style={{ marginTop: "15px" }}>
                            <Col xl={6} xs={24}><Text strong type="secondary">Contract Address:</Text></Col>
                            <Col xl={18} xs={24}>
                                <RouterLink to={`/address/${nftAssetVo?.nftTokenVO.address}`}>
                                    <Link>{nftAssetVo?.nftTokenVO.address}</Link>
                                </RouterLink>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "15px" }}>
                            <Col xl={6} xs={24}><Text strong type="secondary">Contract Creator:</Text></Col>
                            <Col xl={18} xs={24} style={{ lineHeight: "18px" }}>
                                {nftAssetVo?.contractVO.creator}
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "15px" }}>
                            <Col xl={6} xs={24}><Text strong type="secondary">Token ID:</Text></Col>
                            <Col xl={18} xs={24}>
                                <Text strong>{tokenId}</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "15px" }}>
                            <Col xl={6} xs={24}><Text strong type="secondary">Token Standard:</Text></Col>
                            <Col xl={18} xs={24}>
                                {
                                    nftAssetVo?.nftTokenVO.type &&
                                    <Text strong>
                                        {NFT_Type_Label(nftAssetVo.nftTokenVO.type)}
                                    </Text>
                                }
                            </Col>
                        </Row>
                        {
                            nftAssetVo?.nftTokenAssetVO.tokenType == "erc1155"
                            &&
                            <Row style={{ marginTop: "15px" }}>
                                <Col xl={6} xs={24}><Text strong type="secondary">Token Quanlity:</Text></Col>
                                <Col xl={18} xs={24}>
                                    {nftAssetVo.nftTokenAssetVO.tokenValue}
                                </Col>
                            </Row>
                        }
                        <Row style={{ marginTop: "15px" }}>
                            <Col xl={6} xs={24}><Text strong type="secondary">Token URI:</Text></Col>
                            <Col xl={18} xs={24}>
                                <Link ellipsis italic href={nftAssetVo?.nftTokenAssetVO.tokenURI} target="_blank">
                                    {nftAssetVo?.nftTokenAssetVO.tokenURI}
                                </Link>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "15px" }}>
                            <Col xl={6} xs={24}><Text strong type="secondary">Mint Txn:</Text></Col>
                            <Col xl={18} xs={24}>
                                <Row>
                                    <Col span={24}>
                                        {
                                            nftAssetVo?.mintTxn &&
                                            <Address address={nftAssetVo?.mintTxn.from} propVO={nftAssetVo.mintTxn.fromPropVO} />
                                        }
                                    </Col>
                                    <Col span={24}>
                                        {
                                            nftAssetVo?.mintTxn &&
                                            <>
                                                At Txn : <TransactionHash txhash={nftAssetVo?.mintTxn.hash} />
                                            </>
                                        }
                                    </Col>
                                    <Col span={24}>
                                        {
                                            nftAssetVo?.mintTxn &&
                                            <Text type="secondary">{DateFormat(nftAssetVo?.mintTxn.timestamp * 1000)}</Text>
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </Panel>
                    <Panel header="Description" key="descriptions">
                        <p>{tokenDescription}</p>
                    </Panel>
                </Collapse>


            </Col>
        </Row >

        {
            token && tokenId && nftAssetVo?.nftTokenVO &&
            <NftTransfers token={token} tokenId={tokenId} tokenType={nftAssetVo?.nftTokenVO.type}></NftTransfers>
        }

    </>

}
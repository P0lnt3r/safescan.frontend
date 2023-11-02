import { useLocation, useParams } from "react-router"
import { Row, Col, Card, Typography, Divider, Tabs } from "antd"
import ERC20Logo from "../../components/ERC20Logo";
import Address from "../../components/Address";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import type { TabsProps } from 'antd';
import { useEffect, useMemo, useState } from "react";
import { fetchERC20Transfers } from "../../services/tx";
import { ERC20TransferVO, TokenInfoVO } from "../../services";
import ERC20Transfers from "./ERC20Transfers";
import ERC20TokenTransfers from "./ERC20TokenTransfers";
import ERC20TokenHolders from "./ERC20TokenHolders";
import { fetchToken } from "../../services/assets";
import TokenERC20 from "./Token-ERC20";
import TokenNFT from "./Token-NFT";
import NftTokenTransfers from "./NftTokenTransfers";
import NftTokenHolders from "./NftTokenHolders";
import NftTokenInvetory from "./NftTokenInvetory";
import ERC20TokenAmount from "../../components/ERC20TokenAmount";
import { fetchAddressERC20Balance, fetchAddressERC20TokenBalance } from "../../services/address";
const { Title, Text, Paragraph, Link } = Typography;

export default () => {
    const { address } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const filterAddress = searchParams.get('a');
    const [tokenInfo, setTokenInfo] = useState<TokenInfoVO>();
    const [filterAddressERC20TokenBalance , setFilterAddressERC20TokenBalance] = useState<string>();

    useEffect(() => {
        if (address) {
            fetchToken(address).then((data) => {
                setTokenInfo(data);
            })
        }
        if ( filterAddress && address && tokenInfo?.erc20TokenVO.address ){
            fetchAddressERC20TokenBalance(filterAddress , address).then((data)=>{
                setFilterAddressERC20TokenBalance( data.balance )
            })
        }
    }, [address , filterAddress]);

    const items: TabsProps['items'] = useMemo(() => {
        if (address && tokenInfo?.erc20TokenVO && tokenInfo.erc20TokenVO.address) {
            const items = [
                {
                    key: 'transfers',
                    label: "Transfers",
                    children: filterAddress ? <ERC20TokenTransfers tokenAddress={address} filterAddress={filterAddress} />
                        : <ERC20TokenTransfers tokenAddress={address} />
                }
            ];
            if (!filterAddress) {
                items.push(
                    {
                        key: 'holders',
                        label: "Holders",
                        children: <ERC20TokenHolders token={address} />,
                    },
                )
            }
            return items;
        } else if (address && tokenInfo?.nftTokenVO && tokenInfo.nftTokenVO.address) {
            const items = [
                {
                    key: 'transfers',
                    label: "Transfers",
                    children: filterAddress ? <NftTokenTransfers token={address} filterAddress={filterAddress} /> : 
                                <NftTokenTransfers token={address} />,
                },
                {
                    key: 'inventory',
                    label: "Inventory",
                    children: address && <NftTokenInvetory token={address} />,
                }
            ];
            if ( !filterAddress ){
                items.push({
                    key: 'holders',
                    label: "Holders",
                    children: address ? <NftTokenHolders token={address} /> : <></>
                })
            };
            return items;
        }
    }, [address, tokenInfo]);

    return <>
        <Divider style={{ margin: '0px 0px' }} />
        {
            tokenInfo?.erc20TokenVO && tokenInfo.erc20TokenVO.address && <TokenERC20 {...tokenInfo} />
        }
        {
            tokenInfo?.erc20TokenVO && tokenInfo.nftTokenVO.address && <TokenNFT {...tokenInfo} />
        }
        <Divider style={{ margin: '20px 0px' }} />
        {
            filterAddress &&
            <Card style={{ marginBottom: "20px" }}>
                <Row>
                    <Col span={8}>
                        <Text strong>Filtered by Token Holder<br />
                            <Address address={filterAddress} style={{ ellipsis: false, hasLink: true , forceTag : false }} />
                        </Text>
                    </Col>
                    {
                        tokenInfo && tokenInfo.erc20TokenVO && tokenInfo.erc20TokenVO.address && filterAddressERC20TokenBalance &&
                        <>
                            <Divider type="vertical" style={{ marginRight: "20px", height: "50px" }} />
                            <Col span={8}>
                                <Text strong type="secondary">Balance</Text><br />
                                <ERC20TokenAmount {...tokenInfo.erc20TokenVO}
                                    raw={filterAddressERC20TokenBalance}
                                    fixed={tokenInfo.erc20TokenVO.decimals}
                                    /> {tokenInfo.erc20TokenVO.symbol}

                            </Col>
                        </>
                    }
                </Row>
            </Card>
        }
        <Card>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>

    </>

}
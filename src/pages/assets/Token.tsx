import { useParams } from "react-router"
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
const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const { address } = useParams();
    const [tokenInfo, setTokenInfo] = useState<TokenInfoVO>();
    useEffect(() => {
        if (address) {
            fetchToken(address).then((data) => {
                setTokenInfo(data);
            })
        }
    }, [address]);

    const items: TabsProps['items'] = useMemo(() => {
        if ( address && tokenInfo?.erc20TokenVO && tokenInfo.erc20TokenVO.address ){
            return [
                {
                    key: 'transfers',
                    label: "Transfers",
                    children: <ERC20TokenTransfers tokenAddress={address} />,
                },
                {
                    key: 'holders',
                    label: "Holders",
                    children: <ERC20TokenHolders token={address} />,
                },
            ]
        }else if ( address && tokenInfo?.nftTokenVO && tokenInfo.nftTokenVO.address ){
            return [
                {
                    key: 'transfers',
                    label: "Transfers",
                    children: <NftTokenTransfers token={address} />,
                },
                {
                    key: 'holders',
                    label: "Holders",
                    children: address && <NftTokenHolders token={address} />,
                },
                {
                    key: 'inventory',
                    label: "Inventory",
                    children: address && <NftTokenInvetory token={address} />,
                },
            ]
        }
    }, [address , tokenInfo]);

    return <>
        
        <Divider style={{ margin: '0px 0px' }} />
        {
            tokenInfo?.erc20TokenVO && tokenInfo.erc20TokenVO.address && <TokenERC20 {...tokenInfo} />
        }
        {
            tokenInfo?.erc20TokenVO && tokenInfo.nftTokenVO.address && <TokenNFT {...tokenInfo} />
        }

        <Divider style={{ margin: '20px 0px' }} />
        <Card>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>

    </>

}
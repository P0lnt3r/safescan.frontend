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
        return [
            {
                key: 'transfers',
                label: "Transfers",
                children: address && <ERC20TokenTransfers tokenAddress={address} />,
            },
            {
                key: 'holders',
                label: "Holders",
                children: address && <ERC20TokenHolders token={address} />,
            },
        ]
    }, [address]);

    return <>
        
        <Divider style={{ margin: '0px 0px' }} />
        {
            tokenInfo?.erc20TokenVO && <TokenERC20 {...tokenInfo} />
        }

        <Divider style={{ margin: '20px 0px' }} />
        <Card>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>

    </>

}
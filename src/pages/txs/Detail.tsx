import { useParams } from "react-router-dom"
import { Card, Table, Typography, notification } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Row, Col, Divider } from 'antd';
import type { TabsProps } from 'antd';
import TxOverview from "./TxOverview";
import EventLogs from "./EventLogs";
import { fetchEventLogs, fetchTransaction, fetchTxContractInternalTransactions, fetchTxERC20Transfers } from "../../services/tx";
import { ContractInternalTransactionVO, ERC20TransferVO, EventLogVO, TransactionVO } from "../../services";
import ContractInternalTransactions from "./ContractInternalTransactions";

const { Title } = Typography;

export default function () {

    const { txHash } = useParams();
    const { t } = useTranslation();
    const [txVO , setTxVO] = useState<TransactionVO>();
    const [eventLogs , setEventLogs] = useState<EventLogVO[]>();
    const [contractInternalTransactions , setContractInternalTransactions] = useState<ContractInternalTransactionVO[]>();
    const [txERC20Transfers , setTxERC20Transfers] = useState<ERC20TransferVO[]>();

    useEffect( () => {
        if ( txHash ){
            fetchTransaction(txHash).then( (txVO)=>{
                setTxVO(txVO);
            });
            fetchEventLogs(txHash).then( (eventLogs) => {
                setEventLogs(eventLogs);
            });
            fetchTxContractInternalTransactions(txHash).then( ( contractInternalTransactions ) => {
                setContractInternalTransactions( contractInternalTransactions );
            });
            fetchTxERC20Transfers(txHash).then( (txERC20Transfers) => {
                setTxERC20Transfers(txERC20Transfers);
            });
        }
    },[]);
    const hasEventLogs = useMemo( () => {
        return eventLogs && eventLogs.length > 0
    } , [eventLogs] );
    const hasInternalTxns = useMemo( () => {
        return contractInternalTransactions && contractInternalTransactions.length > 0
    } , [contractInternalTransactions])

    const items: TabsProps['items'] = [
        {
            key: 'overview',
            label: `Overview`,
            children: txVO && <TxOverview txVO={txVO} contractInternalTransactions={contractInternalTransactions} erc20Transfers={txERC20Transfers} />,
        },
        {
            key: 'contractInternalTransactions',
            label: `${hasInternalTxns ? `Internal Txns` : ""}`,
            children: <ContractInternalTransactions from={txVO?.from} to={txVO?.to} contractInternalTransactions={contractInternalTransactions} />,
        },
        {
            key: 'eventlogs',
            label: `${hasEventLogs ? `Logs (${eventLogs?.length})` : ""}`,
            children: <EventLogs eventLogs={eventLogs} />,
        },
    ];
    return (
        <>
            <Title level={3}>Transaction Details</Title>
            <Card>
                <Tabs defaultActiveKey="overview" items={items}/>
            </Card>
        </>
    )
}


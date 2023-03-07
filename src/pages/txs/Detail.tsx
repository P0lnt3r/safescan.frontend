import { useParams } from "react-router-dom"
import { Card, Table, Typography, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Row, Col, Divider } from 'antd';
import type { TabsProps } from 'antd';
import TxOverview from "./TxOverview";
import EventLogs from "./EventLogs";
import { fetchEventLogs, fetchTransaction } from "../../services/tx";
import { EventLogVO, TransactionVO } from "../../services";

const { Title } = Typography;

export default function () {

    const { txHash } = useParams();
    const { t } = useTranslation();
    const [txVO , setTxVO] = useState<TransactionVO>();
    const [eventLogs , setEventLogs] = useState<EventLogVO[]>();
    

    useEffect( () => {
        if ( txHash ){
            fetchTransaction(txHash).then( (txVO)=>{
                setTxVO(txVO);
            });
            fetchEventLogs(txHash).then( (eventLogs) => {
                setEventLogs(eventLogs);
            });
        }
    },[]);
    const items: TabsProps['items'] = [
        {
            key: 'overview',
            label: `Overview`,
            children: txVO && <TxOverview {...txVO}></TxOverview>,
        },
        {
            key: 'eventlogs',
            label: `Event Logs (${eventLogs?.length})`,
            children: <EventLogs eventLogs={eventLogs} ></EventLogs>,
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


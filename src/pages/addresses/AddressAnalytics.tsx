
import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal, TabsProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import AddressAnalyticsBalances from './AddressAnalytics-Balances';
import AddressAnalyticsTransactions from './AddressAnalytics-Transactions';
import AddressAnalyticsTxnFees from './AddressAnalytics-TxnFees';
import AddressAnalyticsTransfers from './AddressAnalytics-Transfers';
import AddressAnalyticsTokenTransfers from './AddressAnalytics-TokenTransfers';
import { fetchAddressAnalytic } from '../../services/address';
import { AddressAnaliyic } from '../../services';

export default ({ address }: { address: string }) => {

    const [addressAnalytic,setAddressAnalytic] = useState<AddressAnaliyic>();

    useEffect( () => {
        fetchAddressAnalytic( address ).then(data => {
            setAddressAnalytic(data);
            console.log( "AddressAnalytic :" , data );
        })
    } , [address] );

    const items: TabsProps['items'] = useMemo(() => {
        return [
            {
                key: 'safeBalance',
                label: "SAFE Balance",
                children: address && addressAnalytic && addressAnalytic.balances && <AddressAnalyticsBalances balances={addressAnalytic.balances} />,
            },
            {
                key: 'transactions',
                label: "Transactions",
                children: address && addressAnalytic && addressAnalytic.transactions && <AddressAnalyticsTransactions transactions={addressAnalytic.transactions} ></AddressAnalyticsTransactions>,
            },
            {
                key: 'txnFees',
                label: "Txn Fees",
                children: address && addressAnalytic && addressAnalytic.txnFees && <AddressAnalyticsTxnFees txnFees={addressAnalytic.txnFees}></AddressAnalyticsTxnFees>,
            },
            {
                key: 'safeTransfers',
                label: `SAFE Transfers`,
                children: address && addressAnalytic && addressAnalytic.balances && <AddressAnalyticsTransfers balances={addressAnalytic.balances}></AddressAnalyticsTransfers>,
            },
            {
                key: 'tokenTransfers',
                label: `Token Transfers`,
                children: address && addressAnalytic && addressAnalytic.tokenTransfers && <AddressAnalyticsTokenTransfers tokenTransfers={addressAnalytic.tokenTransfers}></AddressAnalyticsTokenTransfers>,
            },
        ]
    }, [address,addressAnalytic]);

    return <>
        <Card>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>
    </>

}
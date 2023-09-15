
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

        const _items = [];
        if ( address && addressAnalytic && addressAnalytic.balances && addressAnalytic.balances.length > 0 ){
            _items.push({
                key: 'safeBalance',
                label: "SAFE Balance",
                children: <AddressAnalyticsBalances balances={addressAnalytic.balances} />,
            })
        }
        if (address && addressAnalytic && addressAnalytic.transactions && addressAnalytic.transactions.length > 0){
            _items.push({
                key: 'transactions',
                label: "Transactions",
                children: <AddressAnalyticsTransactions transactions={addressAnalytic.transactions} />,
            })
        }
        if (address && addressAnalytic && addressAnalytic.txnFees && addressAnalytic.txnFees.length > 0 ){
            _items.push({
                key: 'txnFees',
                label: "Txn Fees",
                children: <AddressAnalyticsTxnFees txnFees={addressAnalytic.txnFees} />,
            });
        }
        if (address && addressAnalytic && addressAnalytic.balances && addressAnalytic.balances.length > 0){
            _items.push({
                key: 'safeTransfers',
                label: `SAFE Transfers`,
                children: <AddressAnalyticsTransfers balances={addressAnalytic.balances}/>,
            })
        }
        if ( address && addressAnalytic && addressAnalytic.tokenTransfers && addressAnalytic.tokenTransfers.length > 0 ){
            _items.push({
                key: 'tokenTransfers',
                label: `Token Transfers`,
                children: <AddressAnalyticsTokenTransfers tokenTransfers={addressAnalytic.tokenTransfers} />,
            })
        }
        return _items;
    }, [address,addressAnalytic]);

    return <>
        <Card>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>
    </>

}
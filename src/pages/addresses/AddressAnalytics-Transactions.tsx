
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Area } from '@ant-design/plots';
import { AnalyticTransaction } from '../../services';
import { DateFormat, GetIntervalDays } from '../../utils/DateUtil';
import { Typography, Row, Col } from 'antd'


const { Text } = Typography;
export default ({
    transactions
}: {
    transactions: AnalyticTransaction[]
}) => {
    const data: {
        date : string,
        field : string,
        value : number
    }[] = [];
    const _transactions: AnalyticTransaction[] = [];
    for (let i = 0; i < transactions.length; i++) {
        const { time } = transactions[i];
        if (i > 0) {
            const prevTime = transactions[i - 1].time;
            const intervalDays = GetIntervalDays(prevTime, time);
            if (intervalDays.length > 0) {
                for (let j in intervalDays) {
                    const _time = intervalDays[j];
                    _transactions.push({
                        time: _time,
                        transactions: 0,
                        uniqueIncomingAddresses: 0,
                        uniqueOutgoingAddresses: 0
                    })
                }
            }
        }
        _transactions.push(transactions[i]);
    }
    for (let i = 0; i < _transactions.length; i++) {
        const _time = _transactions[i].time.indexOf(" ") > 0 ? _transactions[i].time.substring(0, _transactions[i].time.indexOf(" "))
            : _transactions[i].time;
        data.push({
            date: _time,
            field: "Safe Network Transactions",
            value: _transactions[i].transactions
        });
        data.push({
            date: _time,
            field: "Unique Incoming Address",
            value: _transactions[i].uniqueIncomingAddresses
        });
        data.push({
            date: _time,
            field: "Unique Outgoing Address",
            value: _transactions[i].uniqueOutgoingAddresses
        });
    }
    console.log("transactions : " , _transactions)

    const config = {
        data,
        xField: 'date',
        yField: 'value',
        seriesField: 'field',
        xAxis: {
            tickCount: 5,
        },
        animation: false,
        slider: {
            start: 0,
            end: 1,
            trendCfg: {
                isArea: true,
            },
        },
    };

    return <>
        <Row style={{ marginTop: "10px", marginBottom: "10px", width: "100%" }}>
            <Col span={12}>
                <Text strong style={{ float: "left" }}>Time Series: Safe Transactions</Text>
            </Col>
            <Col span={12}>
                {
                    data.length > 1 &&
                    <Text strong type='secondary' style={{ float: "right" }}>
                        {data[0].date} ~ {data[data.length - 1].date}
                    </Text>
                }
            </Col>
        </Row>
        <Area {...config} />
    </>;

}
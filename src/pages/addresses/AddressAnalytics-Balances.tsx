
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Area } from '@ant-design/plots';
import { AnalyticBalance } from '../../services';
import { GetIntervalDays } from '../../utils/DateUtil';
import EtherAmount, { ETHER } from '../../components/EtherAmount';
import { JSBI } from '@uniswap/sdk';
import { Typography, Row, Col } from 'antd'


const { Text } = Typography;

export default ({ balances }: {
    balances: AnalyticBalance[]
}) => {
    const data: any[] = [];
    const _balances: AnalyticBalance[] = [];
    const filterResult: {
        highest?: AnalyticBalance,
        lowest?: AnalyticBalance
    } = {}
    for (let i = 0; i < balances.length; i++) {
        const { time } = balances[i];
        if (i == 0) {
            filterResult.highest = balances[i];
            filterResult.lowest = balances[i];
        }
        if (i > 0) {
            const prevTime = balances[i - 1].time;
            const intervalDays = GetIntervalDays(prevTime, time);
            if (intervalDays.length > 0) {
                for (let j in intervalDays) {
                    const _time = intervalDays[j];
                    _balances.push({
                        time: _time,
                        send: "0",
                        received: "0",
                        blockReward: "0",
                        balance: balances[i - 1].balance
                    })
                }
            }
            const current = JSBI.BigInt(balances[i].balance);
            const highest = JSBI.BigInt(filterResult.highest ? filterResult.highest.balance : "0");
            const lowest = JSBI.BigInt(filterResult.lowest ? filterResult.lowest.balance : "0");
            if (JSBI.greaterThan(current, highest)) {
                filterResult.highest = balances[i];
            }
            if (JSBI.lessThanOrEqual(current, lowest)) {
                filterResult.lowest = balances[i];
            }
        }
        _balances.push({
            ...balances[i],
            time: DateTime(balances[i].time)
        });
    }
    for (let i = 0; i < _balances.length; i++) {
        const _balance = _balances[i].balance.indexOf("-") == 0 ? "0"
            : _balances[i].balance;
        data.push({
            date: _balances[i].time,
            field: "SAFE Balance",
            value: Number.parseFloat(ETHER(_balance, 4))
        });
    }
    const config = {
        data,
        xField: 'date',
        yField: 'value',
        seriesField: 'field',
        xAxis: {
            range: [0, 1],
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

    function DateTime(datetime: string): string {
        if (datetime.indexOf(" 00:00:00")) {
            return datetime.replace(" 00:00:00", "");
        }
        return datetime;
    }

    return <>
        <Row style={{ marginTop: "10px", marginBottom: "10px", width: "100%" }}>
            <Col span={12}>
                <Text strong style={{ float: "left" }}>Time Series: SAFE Balance</Text>
            </Col>
            <Col span={12}>
                {
                    _balances.length > 1 &&
                    <Text strong type='secondary' style={{ float: "right" }}>
                        {_balances[0].time} ~ {_balances[_balances.length - 1].time}
                    </Text>
                }
            </Col>
        </Row>
        <Row style={{
            marginTop: "20px", marginBottom: "30px", width: "100%",
            borderTop: "1px solid #e9ecef", borderBottom: "1px solid #e9ecef"
        }}>
            <Col span={12} style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                <Text strong>SAFE Hightest Balance</Text><br />
                {
                    filterResult.highest && <>
                        <Text type='secondary'>On {DateTime(filterResult.highest.time)}</Text><br />
                        <Text type='secondary' strong><EtherAmount raw={filterResult.highest.balance} fix={18}></EtherAmount></Text><br />
                    </>
                }
            </Col>
            <Col span={12} style={{
                borderLeft: "1px solid #e9ecef",
                paddingTop: "10px", paddingBottom: "10px",
                paddingLeft: "10px"
            }}>
                <Text strong>SAFE Lowest Balance</Text><br />
                {
                    filterResult.lowest && <>
                        <Text type='secondary'>On {DateTime(filterResult.lowest.time)}</Text><br />
                        <Text type='secondary' strong><EtherAmount raw={filterResult.lowest.balance} fix={18}></EtherAmount></Text><br />
                    </>
                }
            </Col>
        </Row>

        <Area {...config} />
    </>;

}
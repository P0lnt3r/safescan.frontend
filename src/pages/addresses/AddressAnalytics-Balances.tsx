
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Area } from '@ant-design/plots';
import { AnalyticBalance } from '../../services';
import { GetIntervalDays } from '../../utils/DateUtil';
import { ETHER } from '../../components/EtherAmount';

export default ({ balances }: {
    balances: AnalyticBalance[]
}) => {
    const data: any[] = [];
    const _balances: AnalyticBalance[] = [];
    for (let i = 0; i < balances.length; i++) {
        const { time } = balances[i];
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
                        blockReward:"0",
                        balance: balances[i - 1].balance
                    })
                }
            }
        }
        _balances.push(balances[i]);
    }
    for (let i = 0; i < _balances.length; i++) {
        const _time = _balances[i].time.indexOf(" ") > 0 ? _balances[i].time.substring(0, _balances[i].time.indexOf(" "))
          : _balances[i].time;
        const _balance = _balances[i].balance.indexOf("-") == 0 ? "0"
        : _balances[i].balance;
        console.log("_balance :" , _balance);
        data.push({
          date: _time,
          field: "SAFE Balance",
          value: Number.parseFloat(ETHER(_balance,4))
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
    };

    return <Area {...config} />;

}
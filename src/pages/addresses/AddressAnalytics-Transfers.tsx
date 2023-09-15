import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';
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
            blockReward: "0",
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
    data.push({
      date: _time,
      field: "Send (SAFE)",
      value: Number.parseFloat(ETHER(_balances[i].send,18))
    });
    data.push({
      date: _time,
      field: "BlockReward (SAFE)",
      value: Number.parseFloat(ETHER(_balances[i].blockReward ? _balances[i].blockReward : "0",18))
    });
    data.push({
      date: _time,
      field: "Received (SAFE)",
      value:  Number.parseFloat(ETHER(_balances[i].received,18))
    });
  }

  const config = {
    data,
    isGroup: true,
    xField: 'date',
    yField: 'value',
    seriesField: 'field',
    animation: false,
    slider: {
      start: 0,
      end: 1,
      trendCfg: {
        isArea: true,
      },
    },
  };
  return <Column {...config} />;
}
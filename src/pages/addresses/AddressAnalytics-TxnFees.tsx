import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';
import { AnalyticTxnFee } from '../../services';
import { GetIntervalDays } from '../../utils/DateUtil';
import EtherAmount, { ETHER, GWEI } from '../../components/EtherAmount';
import { JSBI } from '@uniswap/sdk';


export default ({ txnFees }: {
  txnFees: AnalyticTxnFee[]
}) => {

  const data: any[] = [];
  const _txnFees: AnalyticTxnFee[] = [];

  let totalSpent = JSBI.BigInt("0");
  let totalUsed  = JSBI.BigInt("0");
  for (let i = 0; i < txnFees.length; i++) {
    const { time , spent , used } = txnFees[i];
    if (i > 0) {
      const prevTime = txnFees[i - 1].time;
      const intervalDays = GetIntervalDays(prevTime, time);
      if (intervalDays.length > 0) {
        for (let j in intervalDays) {
          const _time = intervalDays[j];
          _txnFees.push({
            time: _time,
            spent: "0",
            used: "0"
          })
        }
      }
    }
    totalSpent = JSBI.add( totalSpent , JSBI.BigInt(spent) ); 
    totalUsed = JSBI.add( totalUsed , JSBI.BigInt(used) ); 
    _txnFees.push(txnFees[i]);
  }

  console.log("Total Spend :" , ETHER(totalSpent.toString()));

  for (let i = 0; i < _txnFees.length; i++) {
    const _time = _txnFees[i].time.indexOf(" ") > 0 ? _txnFees[i].time.substring(0, _txnFees[i].time.indexOf(" "))
      : _txnFees[i].time;
    data.push({
      date: _time,
      field: "Spent (GWei)",
      value: Number.parseFloat(GWEI(_txnFees[i].spent))
    });
    data.push({
      date: _time,
      field: "Used (GWei)",
      value: Number.parseFloat(GWEI(_txnFees[i].used)) 
    });
  }
  
  const config = {
    data,
    isGroup: true,
    xField: 'date',
    yField: 'value',
    seriesField: 'field',

    /** 设置颜色 */
    color: ['#1ca9e6', '#f88c24'],
    animation: false,
    slider: {
      start: 0,
      end: 1,
      trendCfg: {
        isArea: true,
      },
    },

    /** 设置间距 */
    // marginRatio: 0.1,
    // label: {
    //   // 可手动配置 label 数据标签位置
    //   position: 'middle',
    //   // 'top', 'middle', 'bottom'
    //   // 可配置附加的布局方法
    //   layout: [
    //     // 柱形图数据标签位置自动调整
    //     {
    //       type: 'interval-adjust-position',
    //     }, // 数据标签防遮挡
    //     {
    //       type: 'interval-hide-overlap',
    //     }, // 数据标签文颜色自动调整
    //     {
    //       type: 'adjust-color',
    //     },
    //   ],
    // },
  };
  return <Column {...config} />;
}
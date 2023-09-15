import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DualAxes } from '@ant-design/plots';
import { AnalyticTokenTransfer } from '../../services';
import { GetIntervalDays } from '../../utils/DateUtil';


export default ({ tokenTransfers }: {
  tokenTransfers: AnalyticTokenTransfer[]
}) => {

  console.log("TokenTransfers >>" , tokenTransfers)

  const _tokenTransfers: AnalyticTokenTransfer[] = [];
  for (let i = 0; i < tokenTransfers.length; i++) {
    const { time } = tokenTransfers[i];
    if (i > 0) {
      const prevTime = tokenTransfers[i - 1].time;
      const intervalDays = GetIntervalDays(prevTime, time);
      if (intervalDays.length > 0) {
        for (let j in intervalDays) {
          const _time = intervalDays[j];
          _tokenTransfers.push({
            time: _time,
            tokenTransfers: 0,
            tokenContractCount: 0
          })
        }
      }
    }
    tokenTransfers[i].time = time.indexOf(" ") > 0 ? time.substring(0, time.indexOf(" ")) : time;
    _tokenTransfers.push(tokenTransfers[i]);
  }

  const config = {
    data: [_tokenTransfers, _tokenTransfers],
    xField: 'time',
    yField: ['tokenTransfers', 'tokenContractCount'],
    limitInPlot: false,
    padding: [10, 20, 80, 30],
    // 需要设置底部 padding 值，同 css
    slider: {},
    meta: {
      time: {
        sync: false, // 开启之后 slider 无法重绘
      },
    },
    geometryOptions: [
      {
        geometry: 'column',
      },
      {
        geometry: 'line',
      },
    ],
  };
  return <DualAxes {...config} />;


}
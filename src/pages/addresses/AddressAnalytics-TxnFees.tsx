import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';
import { AnalyticTxnFee } from '../../services';
import { GetIntervalDays } from '../../utils/DateUtil';
import EtherAmount, { ETHER, GWEI } from '../../components/EtherAmount';
import { JSBI } from '@uniswap/sdk';
import { Typography, Row, Col } from 'antd'

const { Text } = Typography;

export default ({ txnFees }: {
  txnFees: AnalyticTxnFee[]
}) => {

  const data: {
    date: string,
    field: string,
    value: number
  }[] = [];
  const _txnFees: AnalyticTxnFee[] = [];

  let totalSpent = JSBI.BigInt("0");
  let totalUsed = JSBI.BigInt("0");

  for (let i = 0; i < txnFees.length; i++) {
    const { time, spent, used } = txnFees[i];
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
    totalSpent = JSBI.add(totalSpent, JSBI.BigInt(spent));
    totalUsed = JSBI.add(totalUsed, JSBI.BigInt(used));
    _txnFees.push(txnFees[i]);
  }

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
    color: ['rgb(144,237,125)', '#f88c24'],
    animation: false,
    slider: {
      start: 0,
      end: 1,
      trendCfg: {
        isArea: true,
      },
    }

  };
  return <>
    <Row style={{ marginTop: "10px", marginBottom: "10px", width: "100%" }}>
      <Col span={12}>
        <Text strong style={{ float: "left" }}>Time Series: SAFE Transaction Fees Spent and Used</Text>
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
    <Row style={{
      marginTop: "20px", marginBottom: "30px", width: "100%",
      borderTop: "1px solid #e9ecef", borderBottom: "1px solid #e9ecef"
    }}>
      <Col span={12} style={{ paddingTop: "10px", paddingBottom: "10px" }}>
        <Text strong>Total Fees Spent (As a Sender)</Text><br />
        <Text type='secondary' strong><EtherAmount raw={totalSpent.toString()} fix={18}></EtherAmount></Text><br />
      </Col>
      <Col span={12} style={{
        borderLeft: "1px solid #e9ecef",
        paddingTop: "10px", paddingBottom: "10px",
        paddingLeft: "10px"
      }}>
        <Text strong>Total Fees Used (As a recipient)</Text><br />
        <Text type='secondary' strong><EtherAmount raw={totalUsed.toString()} fix={18}></EtherAmount></Text><br />
      </Col>
    </Row>
    <Column {...config} />
  </>;
}
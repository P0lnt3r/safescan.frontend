import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DualAxes } from '@ant-design/plots';
import { AnalyticNodeReward, AnalyticTokenTransfer } from '../../services';
import { GetIntervalDays } from '../../utils/DateUtil';
import EtherAmount, { ETHER } from '../../components/EtherAmount';
import { Typography, Row, Col } from 'antd'
import { JSBI } from '@uniswap/sdk';

const { Text } = Typography;

export default ({ nodeRewards }: {
  nodeRewards: AnalyticNodeReward[]
}) => {
  const _nodeRewards: {
    Time: string,
    Amount: number,
    Count: number
  }[] = [];
  let totalRewardAmount = JSBI.BigInt("0");
  for (let i = 0; i < nodeRewards.length; i++) {
    const { time, rewardAmount } = nodeRewards[i];
    if (i > 0) {
      const prevTime = nodeRewards[i - 1].time;
      const intervalDays = GetIntervalDays(prevTime, time);
      if (intervalDays.length > 0) {
        for (let j in intervalDays) {
          const _time = intervalDays[j];
          _nodeRewards.push({
            Time: _time,
            Amount: 0,
            Count: 0
          })
        }
      }
    }
    totalRewardAmount = JSBI.add(totalRewardAmount, JSBI.BigInt(rewardAmount));
    nodeRewards[i].time = time.indexOf(" ") > 0 ? time.substring(0, time.indexOf(" ")) : time;
    _nodeRewards.push({
      Time: nodeRewards[i].time,
      Count: nodeRewards[i].rewardCount,
      Amount: Number.parseFloat(ETHER(nodeRewards[i].rewardAmount, 18))
    });
  }

  const config = {
    data: [_nodeRewards, _nodeRewards],
    xField: 'Time',
    yField: ['Amount', 'Count'],
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
  return <>
    <Row style={{ marginTop: "10px", marginBottom: "10px", width: "100%" }}>
      <Col span={12}>
        <Text strong style={{ float: "left" }}>Time Series: Node Rewards</Text>
      </Col>
      <Col span={12}>
        {
          nodeRewards.length > 1 &&
          <Text strong type='secondary' style={{ float: "right" }}>
            {nodeRewards[0].time} ~ {nodeRewards[nodeRewards.length - 1].time}
          </Text>
        }
      </Col>
    </Row>
    <Row style={{
      marginTop: "20px", marginBottom: "30px", width: "100%",
      borderTop: "1px solid #e9ecef", borderBottom: "1px solid #e9ecef"
    }}>
      <Col span={12} style={{ paddingTop: "10px", paddingBottom: "10px" }}>
        <Text strong>Total Node Rewards(SAFE)</Text><br />
        <Text type='secondary' strong><EtherAmount raw={totalRewardAmount.toString()} fix={18}></EtherAmount></Text><br />
      </Col>
    </Row>
    <DualAxes {...config} />
  </>;


}
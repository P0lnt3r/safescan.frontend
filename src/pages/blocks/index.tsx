
import { Card, Table, Typography  } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

/*
{
      block: '10002',
      age: '2022-10-21 12:12:12',
      txn: 32,
      miner: '0x61dd481a114a2e761c554b641742c973867899d3',
      gasUsed:'250,000',
      gasLimit:'300,000',
      reward:"0.01006"
    },
*/
interface DataType {
    key         : React.Key;
    block       : string;
    age         : string;
    txn         : number;
    miner       : string,
    gasUsed     : string,
    gasLimit    : string,
    reward      : string
}
  
  const columns: ColumnsType<DataType> = [
    {
      title: 'Block',
      dataIndex: 'block',
      key: 'block',
      render: text => <a>{text}</a>,
      width: 80,
      fixed: 'left',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 200,
    },
    {
        title: 'Txn',
        dataIndex: 'txn',
        key: 'txn',
        width: 100,
    },
    {
        title: 'Miner',
        dataIndex: 'miner',
        key: 'miner',
        ellipsis: true,
    },
    {
      title: 'Gas Used',
      dataIndex: 'gasUsed',
      key: 'gasUsed',
      width: 200,
    },
    {
      title: 'Gas Limit',
      dataIndex: 'gasLimit',
      key: 'gasLimit',
      width: 200,
    },
    {
      title: 'Reward',
      dataIndex: 'reward',
      key: 'reward',
      width: 200,
    },
  ];
  
  const template:DataType = {
        key:1,
        block: '10002',
        age: '2022-10-21 12:12:12',
        txn: 32,
        miner: '0x61dd481a114a2e761c554b641742c973867899d3',
        gasUsed:'250,000',
        gasLimit:'300,000',
        reward:"0.01006 SAFE"
  }
  let data : DataType[] = [];
  for( let i = 1;i<30;i++ ){
    const element = {...template};
    element.key = i;
    data.push(element)
  }

export default function(){
    return (
        <>
          <Title level={3}>Blocks</Title>
          <Card>
            <Table columns={columns} dataSource={data} scroll={{ x: 800 }}/>
          </Card>
        </>
    )
}
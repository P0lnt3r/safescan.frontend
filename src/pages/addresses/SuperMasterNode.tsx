import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal, Descriptions, Badge } from 'antd';

const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const superMasterNode = {
        "id": 3,
        "amount": "5000000000000000000000",
        "state": 1,
        "totalVoteNum": 0,
        "totalVoterAmount": 0,
        "createHeight": 0,
        "updateHeight": 0,
        "name": "supermasternode3",
        "addr": "0x044f9C93b57eFAA547F8461d4FA864eb40558cD0",
        "enode": "enode://27dcaa3373400bdaf41bbc297f1e1db82ca4c4a5501731563c202be5c5b5b605a166ff820daecd29f7dde161677ff0fd9ac8e476602bfea00e0cbf81ad0e2a87@47.96.254.235:30303",
        "creator": "0x044f9C93b57eFAA547F8461d4FA864eb40558cD0",
        "ip": "47.96.254.235",
        "pubkey": "0x044d5f48b5c20d89aff61db4fb9570a8615a029430c3c585956f789f2c09389b56dfb33d582ba807f3622120848c9886a5ca268d931cf98fdc97bcf1773fbb4b7b",
        "description": "official supermasternode 3",
        "founders": [
            {
                "lockID": 4,
                "addr": "0x044f9C93b57eFAA547F8461d4FA864eb40558cD0",
                "amount": "5000000000000000000000",
                "height": 0
            }
        ],
        "voters": [],
        "incentivePlan": {
            "creator": 10,
            "partner": 40,
            "voter": 50
        }
    }



    return (<>
        <Row>
            <Col style={{ marginTop: "10px", padding: "5px" }} span={24} >
                <Card size="small">
                    <Descriptions title="Super Master Node" layout="vertical" bordered>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>ID</Text>}>
                            {superMasterNode.id}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Amount</Text>}>
                            {superMasterNode.amount}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>IP</Text>}>
                            {superMasterNode.ip}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Name</Text>}>
                            {superMasterNode.name}
                        </Descriptions.Item>
                        <Descriptions.Item span={2} label={<Text strong style={{ color: "#6c757e" }} >Description</Text>}>
                            {superMasterNode.description}
                        </Descriptions.Item>
                        
                        <Descriptions.Item span={2} label={<Text strong style={{ color: "#6c757e" }}>Creator</Text>}>
                            {superMasterNode.creator}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Create Height</Text>}>
                            {superMasterNode.createHeight}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Total Voter Amount</Text>}>
                            {superMasterNode.totalVoterAmount}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Total Vote Num</Text>}>
                            {superMasterNode.totalVoteNum}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ color: "#6c757e" }}>Update Height</Text>}>
                            {superMasterNode.updateHeight}
                        </Descriptions.Item>
                        
                        
                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >ENODE</Text>}>
                            {superMasterNode.enode}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >Public Key</Text>}>
                            {superMasterNode.pubkey}
                        </Descriptions.Item>

                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >IncentivePlan</Text>}>
                            
                        </Descriptions.Item>

                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >Founders</Text>}>
                            Data disk type: MongoDB
                            <br />
                            Database version: 3.4
                            <br />
                            Package: dds.mongo.mid
                            <br />
                            Storage space: 10 GB
                            <br />
                            Replication factor: 3
                            <br />
                            Region: East China 1
                            <br />
                        </Descriptions.Item>
                        
                        <Descriptions.Item span={3} label={<Text strong style={{ color: "#6c757e" }} >Voters</Text>}>
                            Data disk type: MongoDB
                            <br />
                            Database version: 3.4
                            <br />
                            Package: dds.mongo.mid
                            <br />
                            Storage space: 10 GB
                            <br />
                            Replication factor: 3
                            <br />
                            Region: East China 1
                            <br />
                        </Descriptions.Item>
                        
                    </Descriptions>
                </Card>
            </Col>
        </Row>
    </>)

}
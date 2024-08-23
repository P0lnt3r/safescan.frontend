import { useParams } from "react-router-dom"
import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal } from 'antd';
import {
    QrcodeOutlined, FileTextOutlined, UserOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { useEffect, useMemo, useState } from "react";
import { fetchAddress } from "../../services/address";
import { AddressVO, MasterNodeVO, SuperNodeVO } from "../../services";
import SuperNode from "./SuperNode";
import MasterNode from "./MasterNode";
import SupernodesVoteActions from "./SupernodesVoteActions";
import NodeRewards from "./NodeRewards";

const { Title, Text, Paragraph, Link } = Typography;

export default function () {

    const address = useParams().address?.toLocaleLowerCase();
    const [addressVO, setAddressVO] = useState<AddressVO>();

    useEffect(() => {
        if (address) {
            fetchAddress(address).then(data => {
                setAddressVO(data)
            })
        }
    }, [address])
    
    const { type, subType, tag, remark, prop } = useMemo(() => {
        return addressVO?.propVO ? addressVO.propVO : {
            type: undefined,
            subType: undefined,
            tag: undefined,
            remark: undefined,
            prop: undefined
        };
    }, [addressVO]);

    const items: TabsProps['items'] = useMemo(() => {
        let items: TabsProps['items'] = [];
        if (addressVO) {
            if (subType == "supernode") {
                items.push({
                    key: 'votes',
                    label: 'Votes',
                    children: <SupernodesVoteActions address={address}></SupernodesVoteActions>
                })
            }
            items.push({
                key: "nodeRewards",
                label: "Node Rewards",
                children: <NodeRewards nodeAddress={address}></NodeRewards>
            })
        }
        return items;
    }, [addressVO]);

    return (
        <>
            {
                subType == "supernode" && prop &&
                <SuperNode {...JSON.parse(prop) as SuperNodeVO} />
            }
            {
                subType == "masternode" && prop &&
                <MasterNode {...JSON.parse(prop) as MasterNodeVO} />
            }
            <Divider style={{ marginTop: "20px" }} />
            <Card>
                <Tabs items={items} />
            </Card>
        </>
    )

}
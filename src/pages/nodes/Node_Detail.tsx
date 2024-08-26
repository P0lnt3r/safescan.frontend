import { useParams } from "react-router-dom"
import { Card, Typography, Tabs, Divider } from 'antd';
import type { TabsProps } from 'antd';
import { useEffect, useMemo, useState } from "react";
import { fetchAddress } from "../../services/address";
import { AddressVO, MasterNodeVO, SuperNodeVO } from "../../services";
import SuperNode from "./SuperNode";
import MasterNode from "./MasterNode";
import SupernodesVoteActions from "./SupernodesVoteActions";
import NodeRewards from "./NodeRewards";
import NodeRegisters from "./NodeRegisters";

const { Title, Text, Paragraph, Link } = Typography;

export default function () {

    const address = useParams().address?.toLocaleLowerCase();
    const [addressVO, setAddressVO] = useState<AddressVO>();

    useEffect(() => {
        if (address) {
            fetchAddress(address).then(data => {
                console.log("Node Data ==", data)
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
        if (addressVO && subType) {
            items.push({
                key: "registers",
                label: "Registers",
                children: <NodeRegisters type={subType} address={addressVO.address}></NodeRegisters>
            });
            if (subType == "supernode") {
                items.push({
                    key: 'votes',
                    label: 'Votes',
                    children: <SupernodesVoteActions address={address}></SupernodesVoteActions>
                })
            }
            items.push({
                key: "rewards",
                label: "Rewards",
                children: <NodeRewards nodeAddress={addressVO.address}></NodeRewards>
            });
        }
        return items;
    }, [addressVO]);

    function convertNumbersToStrings(jsonString: string) {
        return jsonString.replace(/(?<!")\b\d{16,}\b(?!")/g, '"$&"');
    }

    return (
        <>
            {
                subType == "supernode" && prop &&
                <>
                    <SuperNode supernodeVO={JSON.parse(convertNumbersToStrings(prop))} />
                </>
            }
            
            {
                subType == "masternode" && prop &&
                <MasterNode masternodeVO={JSON.parse(convertNumbersToStrings(prop))} />
            }
            <Divider style={{ marginTop: "20px" }} />
            <Card>
                <Tabs items={items} />
            </Card>
        </>
    )

}
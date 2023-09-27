import { AddressPropVO } from "../services"
import { Button, Col, Row, Card, Space, Typography, Avatar, List, Tooltip } from 'antd';
import { Link as RouterLink } from 'react-router-dom';
import { useMemo } from "react";
import {
    FileTextOutlined,       // 合约
    FileProtectOutlined,    // 系统合约
    ApartmentOutlined,      // 主节点
    ClusterOutlined,        // 超级节点
} from '@ant-design/icons';
import { useAddressProp } from "../state/application/hooks";
import { useDispatch } from "react-redux";
import { Application_Update_AddressPropMap } from "../state/application/action";
import { utils } from 'ethers';

const { Text, Link } = Typography;

export function ChecksumAddress(address: string): string {
    address = address.toLowerCase().replace('0x', '');
    const hash = utils.keccak256('0x' + address).substring(2);
    let checksumAddress = '0x';

    for (let i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
            checksumAddress += address[i].toUpperCase();
        } else {
            checksumAddress += address[i];
        }
    }

    return checksumAddress;
}

export default ({ address, propVO, style }: {
    address: string,
    propVO?: AddressPropVO | undefined,
    style?: {
        hasLink?: boolean,
        forceTag?: boolean,
        noTip?: boolean
    }
}) => {
    const _propVO = useAddressProp(address);
    const dispatch = useDispatch();
    const { type, subType, tag, prop, remark } = useMemo(() => {
        if (propVO) {
            if (_propVO == undefined) {
                dispatch(Application_Update_AddressPropMap([propVO]));
            }
            return propVO;
        }
        if (_propVO != undefined) {
            return _propVO;
        }
        return {
            type: undefined,
            subType: undefined,
            tag: undefined,
            prop: undefined,
            remark: undefined,
        }
    }, [address, propVO]);

    const RenderIcon = () => {
        const isSuperNode = subType == "supernode";
        if (isSuperNode) {
            return <Tooltip title="SuperNode"><ClusterOutlined style={{ marginRight: "3px" }} /></Tooltip>;
        }
        const isMasterNode = subType == "masternode";
        if (isMasterNode) {
            return <Tooltip title="MasterNode"><ApartmentOutlined style={{ marginRight: "3px" }} /></Tooltip>;
        }
        const isContract = type == "contract";
        const isSystemContract = isContract && subType == "system";
        if (isSystemContract) {
            return <Tooltip title="System Contract"><FileProtectOutlined style={{ marginRight: "3px", color: "green" }} /></Tooltip>;
        }
        if (isContract) {
            return <Tooltip title="Contract"><FileTextOutlined style={{ marginRight: "3px" }} /></Tooltip>;
        }
        return <>
        </>
    }

    return <>
        <Text>
            {RenderIcon()}
            <Tooltip title={(style && style.noTip) ? "" : address}>
                {
                    (style && !style.hasLink) && <>
                        {
                            tag && <Text ellipsis style={{ maxWidth: "90%" }}>
                                {tag}
                            </Text>
                        }
                        {
                            !tag && !style.forceTag && <Text ellipsis style={{ maxWidth: "90%" }}>
                                {address}
                            </Text>
                        }
                        {
                            !tag && style.forceTag && <Text ellipsis strong style={{ maxWidth: "90%" }}>
                                {type?.toLocaleUpperCase()}
                            </Text>
                        }
                    </>
                }
                {
                    (!style || style.hasLink == true) && <>
                        <RouterLink to={`/address/${address}`}>
                            {
                                tag && <Link ellipsis style={{ maxWidth: "90%" }}>
                                    {tag}
                                </Link>
                            }
                            {
                                !tag && <Link ellipsis style={{ maxWidth: "90%" }}>
                                    {address}
                                </Link>
                            }
                        </RouterLink>
                    </>
                }
            </Tooltip>
        </Text>
    </>

}
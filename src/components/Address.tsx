import { AddressPropVO } from "../services"
import { Button, Col, Row, Card, Space, Typography, Avatar, List, Tooltip, Modal, Divider } from 'antd';
import { Link as RouterLink } from 'react-router-dom';
import { useMemo, useState } from "react";
import {
    QrcodeOutlined,
    FileTextOutlined,       // 合约
    FileProtectOutlined,    // 系统合约
    ApartmentOutlined,      // 主节点
    ClusterOutlined,        // 超级节点
} from '@ant-design/icons';
import { useAddressProp } from "../state/application/hooks";
import { useDispatch } from "react-redux";
import { Application_Update_AddressPropMap } from "../state/application/action";
import { utils } from 'ethers';
import QRCode from "qrcode.react";
const { Text, Link, Paragraph } = Typography;

export function ChecksumAddress(address: string): string {
    try {
        return address ? utils.getAddress(address) : ""
    } catch (error) {
        return address;
    }
}

export default ({ address, propVO, style, to }: {
    address: string,
    propVO?: AddressPropVO | undefined,
    to?: string,
    style?: {
        hasLink?: boolean,
        forceTag?: boolean,
        noTip?: boolean,
        color?: string,
        ellipsis?: boolean
    }
}) => {
    const [openQRCode, setOpenQRCode] = useState<boolean>(false);
    const [openAddress, setOpenAddress] = useState<string>();

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

    const checksumAddress = ChecksumAddress(address);
    const ellipsisAddress = (style && style.ellipsis == false) ?
        checksumAddress
        : checksumAddress.substring(0, 8) + "..." + checksumAddress.substring(checksumAddress.length - 8);
    const _tag = (style && style.forceTag == false) ?
        ellipsisAddress
        : tag ? tag : ellipsisAddress;

    const textStyle: any = {
        maxWidth: "90%",
        fontFamily: "SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace"
    }
    if (style && style.color) {
        textStyle.color = style.color;
    }
    const routerTo = to ? to : "/address/" + checksumAddress;

    const RenderIcon = () => {
        const isSuperNode = subType == "supernode";
        if (isSuperNode) {
            return <Tooltip title="Supernode"><ClusterOutlined style={{ marginRight: "3px" }} /></Tooltip>;
        }
        const isMasterNode = subType == "masternode";
        if (isMasterNode) {
            return <Tooltip title="Masternode"><ApartmentOutlined style={{ marginRight: "3px" }} /></Tooltip>;
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
            {(!style || style.forceTag) && RenderIcon()}
            <Tooltip style={{ float: "left" }} title={(style && style.noTip) ? "" : checksumAddress}>
                {
                    (style && !style.hasLink) && <>
                        {
                            _tag && <Text ellipsis style={textStyle}>
                                {_tag}
                            </Text>
                        }
                        {
                            !_tag && style.forceTag && <Text ellipsis strong style={textStyle}>
                                {type?.toLocaleUpperCase()}
                            </Text>
                        }
                    </>
                }
                {
                    (!style || style.hasLink) && <>
                        <RouterLink to={routerTo}>
                            {
                                _tag && <Link ellipsis style={textStyle}>
                                    {_tag}
                                </Link>
                            }
                            {
                                !_tag && <Link ellipsis style={textStyle}>
                                    {ellipsisAddress}
                                </Link>
                            }
                        </RouterLink>
                    </>
                }
            </Tooltip>
            <Paragraph style={{ height: "0px", display: "inline-block" }} copyable={{ text: checksumAddress }} />
            <Tooltip title="View QR Code">
                <Link style={{ marginLeft: "5px" }} onClick={() => {
                    setOpenAddress(address);
                    setOpenQRCode(true);
                }}>
                    <QrcodeOutlined />
                </Link>
            </Tooltip>
        </Text>

        {
            openAddress && <Modal title="QR Code" open={openQRCode} width={"600px"} footer={null} closable onCancel={() => { setOpenQRCode(false) }}>
                <Row>
                    <Text style={{ margin: "auto", marginTop: "20px", marginBottom: "20px" }} type='secondary'>
                        Assets can only be sent on the same network
                    </Text>
                </Row>
                <Row style={{ textAlign: "center" }}>
                    <QRCode size={200} style={{ margin: "auto", boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.2)" }} value={openAddress} />
                </Row>
                <Row style={{ width: "400px", textAlign: "center", margin: "auto", marginTop: "20px", marginBottom: "60px" }}>
                    <Text style={{ margin: "auto" }} strong>
                        {openAddress}
                    </Text>
                    <Paragraph style={{ float: "right", marginTop: "10px" }} copyable={{ text: openAddress }} />
                </Row>
            </Modal>
        }

    </>

}
import { AutoComplete, Input, Cascader, Select, Button, Row, Col, Tooltip } from 'antd';
import { Card, Table, Typography, notification } from 'antd';
import "./index.css"
import {
    UserOutlined,
    CaretDownOutlined,
    WalletOutlined
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { BaseOptionType } from 'antd/lib/select';
import { DefaultOptionType } from 'antd/lib/cascader';
import { AddressPropVO } from '../../services';
import ERC20TokenAmount from '../../components/ERC20TokenAmount';
import ERC20Logo from '../../components/ERC20Logo';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default ({ tokens , address }: {
    tokens: {
        token: string,
        tokenPropVO: AddressPropVO,
        balance: string
    }[] | undefined , 
    address : string | undefined
}) => {
    const navigate = useNavigate();
    const RenderTokenAmount = (value: string, balance: string, { address, name, decimals, symbol }: {
        address: string,
        name: string,
        decimals: number,
        symbol: string
    }) => ({
        value,
        label: (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Row>
                    <Col span={24}>
                        <ERC20Logo address={address} width='14px' />
                        <Text style={{ marginLeft: "5px" }}>{name} ({symbol})</Text>
                    </Col>
                    <Col span={24}>
                        <Text type='secondary'>
                            <ERC20TokenAmount raw={balance} address={address}
                                symbol={symbol} name={name} decimals={decimals} fixed={decimals} />
                            <Text type='secondary'> {symbol}</Text>
                        </Text>
                    </Col>
                </Row>
            </div>
        )
    });

    const renderTitle = (title: string) => (
        <span>
            {title}
        </span>
    );

    const _options = useMemo(() => {
        const initOptions: BaseOptionType[] = [];
        const filterOptions: BaseOptionType[] = [];
        const categorys = new Map<string, { value: string, label: JSX.Element }[]>();
        if (tokens) {
            for (let i in tokens) {
                const { token, balance, tokenPropVO } = tokens[i];
                const { prop, subType, tag } = tokenPropVO;
                if (prop) {
                    const { name, decimals, symbol } = JSON.parse(prop) as { name: string, decimals: number, symbol: string };
                    filterOptions.push({
                        value: tag,
                        label: RenderTokenAmount(token, balance, { address: token, name, decimals, symbol }).label,
                    });
                    if (!categorys.get(subType)) {
                        categorys.set(subType, []);
                    }
                    categorys.get(subType)?.push(RenderTokenAmount(token, balance, { address: token, name, decimals, symbol }))
                }
            }
            categorys.forEach((val, key) => {
                initOptions.push({
                    value: key,
                    label: renderTitle(key),
                    options: val
                });
            })
        }
        return {
            initOptions,
            filterOptions
        };
    }, [tokens])
    const [options, setOptions] = useState<BaseOptionType[]>();

    useEffect(() => {
        setOptions(_options.initOptions)
    }, [_options]);

    const renderItem = (title: string, count: number) => ({
        value: title,
        label: (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <span style={{ float: "left" }}>{title}</span>
                <span style={{ float: "right" }}>{count}</span>
            </div>
        ),
    });

    const handleInput = (event: any) => {
        if (event.target.value) {
            setOptions(_options.filterOptions);
        } else {
            setOptions(_options.initOptions);
        }
    }

    return <>
        <AutoComplete
            popupClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth
            style={{ width: "280px", marginTop: "10px" }}
            options={options}
            filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
        >
            <Input style={{
                borderRadius: "0.5rem"
            }} placeholder={tokens?.length + " Tokens"} onInput={handleInput} suffix={<CaretDownOutlined />} />

        </AutoComplete>
        <Tooltip title="View token holdings in more detail">
            <Button shape="circle"
                style={{ marginLeft: "20px", background: "#e9ecef", borderColor: "#e9ecef", borderRadius: "30%" }}
                icon={<WalletOutlined />}
                onClick={ () => {
                    navigate(`/tokenholdings?a=${address}`);
                } }
                />
        </Tooltip>

    </>
}
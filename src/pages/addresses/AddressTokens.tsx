import { AutoComplete, Input, Cascader, Select, Button } from 'antd';
import "./index.css"
import {
    UserOutlined,
    CaretDownOutlined,
    WalletOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { BaseOptionType } from 'antd/lib/select';
import { DefaultOptionType } from 'antd/lib/cascader';

export default () => {


    const renderTitle = (title: string) => (
        <span>
            {title}
        </span>
    );

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

    const [options, setOptions] = useState<BaseOptionType[]>();

    const completeoptions = [
        {
            label: renderTitle('ERC20'),
            options: [renderItem('USDT', 10000), renderItem('wBTC', 432), renderItem('wETH', 12311), renderItem('Dash', 10600)],
            value: "erc20"
        },
        {
            label: renderTitle('NFT'),
            options: [renderItem('AntDesign UI FAQ', 60100), renderItem('AntDesign FAQ', 30010)],
            value: "NFT"
        }
    ];

    const filterOptions = [
        {
            value: "USDT",
            label: renderItem('USDT', 10000).label
        },
        {
            value: "wBTC",
            label: renderItem('wBTC', 432).label
        },
        {
            value: "wETH",
            label: renderItem('wETH', 12311).label
        },
        {
            value: "Dash",
            label: renderItem('Dash', 10600).label
        }
    ]

    useEffect(() => {
        setOptions(completeoptions);
    }, []);

    const handleInput = (event: any) => {
        if (event.target.value) {
            setOptions(filterOptions);
        } else {
            setOptions(completeoptions);
        }
    }

    const filter = (inputValue: string, path: DefaultOptionType[]) =>
        path.some(
            (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
        );

    return <>
        <AutoComplete
            popupClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={500}
            style={{ width: 280 }}
            options={options}
            filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
        >
            <Input style={{
                borderRadius:"0.5rem"
            }} placeholder="37 Tokens" onInput={handleInput} suffix={<CaretDownOutlined />} />
        </AutoComplete>
        <Button shape="circle" style={{marginLeft:"20px" , background:"#e9ecef" , borderColor:"#e9ecef" , borderRadius:"30%"}} 
                icon={<WalletOutlined />} href="https://www.google.com" />    
    </>
}
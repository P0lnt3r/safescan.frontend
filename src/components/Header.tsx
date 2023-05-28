import React, { useEffect, useMemo, useState } from 'react';
import { 
    AppstoreOutlined, 
    AreaChartOutlined, 
    SettingOutlined, 
    UnorderedListOutlined, 
    CloseOutlined ,
    HomeOutlined,
    FundViewOutlined,
    ApartmentOutlined,
    SecurityScanOutlined,
    
    WalletOutlined,
} from '@ant-design/icons';

import type { MenuProps } from 'antd';
import { Menu, Row, Col, Button, Layout, Input } from 'antd';
import SAFE_LOGO from '../images/safe_logo.png'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}


const MODILE_WIDTH = 1000;

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const items: MenuItem[] = [
        getItem(t('home').toString(), '', <HomeOutlined />),
        getItem(t('blockchain').toString(), 'blockchain', <SecurityScanOutlined />, [
            getItem('View Pending Transactions', '/txsPending'),
            getItem('View Transactions', '/txs'),
            getItem('View Internal Transactions', '/txsInternal'),
            getItem('View Blocks', '/blocks'),
        ]),
        getItem(t('masternode').toString(), 'masternode', <ApartmentOutlined />, [
            getItem('Super MasterNodes', '/nodes/supermasternodes'),
        ]),
        getItem(t('assets').toString(), 'assets', <WalletOutlined />, [
            getItem('ERC20 Tokens', '/assets/erc20tokens'),
            getItem('ERC20 Transfers', '/assets/erc20txns'),
        ]),
        getItem("Statistic", 'statistic', <AreaChartOutlined />, [
            getItem('Top Account', '/accounts'),
            getItem('Chart', '/charts'),
        ]),
        // getItem('Language', 'language', <SettingOutlined />, [
        //     getItem('English', 'en'),
        //     getItem('中文', 'zh'),
        // ]),
    ];
    // submenu keys of first level
    const rootSubmenuKeys = ['blockchain', 'masternode', 'assets'];
    
    const [isMobile, setIsMobile] = useState(window.innerWidth < MODILE_WIDTH);
    const [openMenu, setOpenMenu] = useState(window.innerWidth >= MODILE_WIDTH);
    const [openKeys, setOpenKeys] = useState(['']);

    window.addEventListener('resize', () => {
        setIsMobile(window.innerWidth < MODILE_WIDTH);
        setOpenMenu(window.innerWidth >= MODILE_WIDTH);
    });

    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    return (
        <div style={{ backgroundColor: "white", padding: '1%', marginBottom: '5px' }}>
            <Row>
                <Col span={2} style={{ height: '48px', paddingLeft: '2%' }} >
                    <img src={SAFE_LOGO} style={{ display: "block", maxHeight: "100%" }}></img>
                </Col>
                <Col span={isMobile ? 20 : 10}>
                    <Search style={{ marginLeft: '40px', width: '80%', marginTop: '6px' }} size='large' placeholder="Input Address/TxHash" enterButton />
                </Col>
                <Col span={isMobile ? 2 : 0} >
                    <span style={{ float: 'right' }}>
                        <Button style={{ marginTop: '6px' }} onClick={() => { setOpenMenu(!openMenu) }} size='large'
                            icon={openMenu ? <CloseOutlined /> : <UnorderedListOutlined />}>
                        </Button>
                    </span>
                </Col>
                <Col span={isMobile ? 24 : 12}>
                    {openMenu &&
                        <div style={isMobile ? {} : { width:'100%' }}>
                            <span style={{float:'right',width:'100%'}}>
                                <Menu
                                    mode={isMobile ? "inline" : "horizontal"}
                                    openKeys={openKeys}
                                    onOpenChange={onOpenChange}
                                    onClick={(target) => {
                                        const { key } = target;
                                        if (key == 'en' || key == 'zh') {
                                            i18n.changeLanguage(key);
                                        }else{
                                            navigate(key);
                                        }
                                        if (isMobile){
                                            setOpenMenu(!openMenu);   
                                        }
                                    }}
                                    style={{ float:'right',width:isMobile ? "100%" : "615px" }}
                                    items={items}
                                />
                            </span>
                        </div>
                    }
                </Col>
            </Row>
        </div>

    );
};

export default Header;
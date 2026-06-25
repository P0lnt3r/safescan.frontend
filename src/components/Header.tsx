import React, { useMemo, useState } from 'react';
import {
    AreaChartOutlined,
    UnorderedListOutlined,
    CloseOutlined,
    HomeOutlined,
    ApartmentOutlined,
    SecurityScanOutlined,
    WalletOutlined,
    FireOutlined,
} from '@ant-design/icons';

import type { MenuProps } from 'antd';
import { Menu, Button } from 'antd';
import { JSBI } from '@uniswap/sdk';
import SAFE_LOGO from '../images/safe_logo.png';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchComponent from './SearchComponent';
import { GWEI } from './EtherAmount';
import { useLatestTransactions } from '../state/application/hooks';
import config from '../config';

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

const MOBILE_WIDTH = 1000;
const NATIVE_LABEL = config.native_label;

function useMedianGasGwei(): string | null {
    const transactions = useLatestTransactions();

    return useMemo(() => {
        if (!transactions?.length) {
            return null;
        }
        const gasPrices = transactions
            .map((tx) => tx.gasPrice)
            .filter((price) => price && price !== '0');

        if (!gasPrices.length) {
            return null;
        }

        const sorted = [...gasPrices].sort((a, b) => {
            if (JSBI.greaterThan(JSBI.BigInt(a), JSBI.BigInt(b))) {
                return 1;
            }
            if (JSBI.lessThan(JSBI.BigInt(a), JSBI.BigInt(b))) {
                return -1;
            }
            return 0;
        });
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 === 0
            ? JSBI.divide(
                JSBI.add(JSBI.BigInt(sorted[mid - 1]), JSBI.BigInt(sorted[mid])),
                JSBI.BigInt(2),
            )
            : JSBI.BigInt(sorted[mid]);

        return GWEI(median.toString(), 2);
    }, [transactions]);
}

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { i18n } = useTranslation();
    const isHomePage = location.pathname === '/';
    const gasGwei = useMedianGasGwei();

    const items: MenuItem[] = useMemo(() => {
        return [
            getItem('Home', '', <HomeOutlined />),
            getItem('Blockchain', 'blockchain', <SecurityScanOutlined />, [
                getItem('View Pending Transactions', '/txsPending'),
                getItem('View Transactions', '/txs'),
                getItem('View Internal Transactions', '/txsInternal'),
                getItem('View Blocks', '/blocks'),
                getItem('View Contracts', '/contracts'),
                getItem('View Cross-Chain', '/crosschains'),
            ]),
            getItem('Nodes', 'nodes', <ApartmentOutlined />, [
                getItem('Masternodes', '/nodes/masternodes'),
                getItem('Supernodes', '/nodes/supernodes'),
            ]),
            getItem('Assets', 'assets', <WalletOutlined />, [
                getItem('Account Records', '/assets/accountrecords'),
                getItem('SRC20 Tokens', '/assets/erc20tokens'),
                getItem('SRC20 Transfers', '/assets/erc20txns'),
                getItem('NFT Tokens', '/assets/nft-tokens'),
                getItem('NFT Transfers', '/assets/nft-transfers'),
            ]),
            getItem('Statistic', 'statistic', <AreaChartOutlined />, [
                getItem('Top Account', '/accounts'),
                getItem('Charts', '/charts'),
                getItem('Safe3 Redeem', '/safe3/redeem'),
            ]),
        ];
    }, []);

    const rootSubmenuKeys = ['blockchain', 'masternode', 'assets'];
    const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_WIDTH);
    const [openMenu, setOpenMenu] = useState(window.innerWidth >= MOBILE_WIDTH);
    const [openKeys, setOpenKeys] = useState<string[]>(['']);

    window.addEventListener('resize', () => {
        setIsMobile(window.innerWidth < MOBILE_WIDTH);
        setOpenMenu(window.innerWidth >= MOBILE_WIDTH);
    });

    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    const handleMenuClick: MenuProps['onClick'] = (target) => {
        const { key } = target;
        if (key === 'en' || key === 'zh') {
            i18n.changeLanguage(key);
        } else {
            navigate(key);
        }
        if (isMobile) {
            setOpenMenu(false);
        }
    };

    const showTopBar = !isHomePage || !isMobile;

    return (
        <header className="app-header">
            {showTopBar && (
                <div className="app-header-top">
                    <div className="site-container app-header-top-inner">
                        {!isMobile && (
                            <div className="app-header-top-left">
                                <span className="app-header-top-item">
                                    <span className="app-header-top-label">{NATIVE_LABEL} Price:</span>
                                    <span className="app-header-top-value">—</span>
                                </span>
                                <span className="app-header-top-item">
                                    <FireOutlined className="app-header-top-gas-icon" />
                                    <span className="app-header-top-label">Gas:</span>
                                    <span className="app-header-top-value">
                                        {gasGwei !== null ? `${gasGwei} Gwei` : '—'}
                                    </span>
                                </span>
                            </div>
                        )}
                        {!isHomePage && (
                            <div className="app-header-top-search">
                                <SearchComponent compact />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="site-container app-header-bar">
                <div className="app-header-logo">
                    <img src={SAFE_LOGO} alt="Safe Chain Explorer" />
                </div>

                <div className="app-header-actions">
                    {isMobile && (
                        <Button
                            onClick={() => setOpenMenu(!openMenu)}
                            size="large"
                            icon={openMenu ? <CloseOutlined /> : <UnorderedListOutlined />}
                        />
                    )}
                    {!isMobile && openMenu && (
                        <nav className="app-header-nav">
                            <Menu
                                mode="horizontal"
                                disabledOverflow
                                openKeys={openKeys}
                                onOpenChange={onOpenChange}
                                onClick={handleMenuClick}
                                items={items}
                            />
                        </nav>
                    )}
                </div>
            </div>

            {isMobile && openMenu && (
                <div className="site-container app-header-nav-mobile">
                    <Menu
                        mode="inline"
                        openKeys={openKeys}
                        onOpenChange={onOpenChange}
                        onClick={handleMenuClick}
                        items={items}
                    />
                </div>
            )}
        </header>
    );
};

export default Header;

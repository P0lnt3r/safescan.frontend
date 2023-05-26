import { Button, Col, Row, Card, Space, Typography, Statistic, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import LatestBlockTransactions from './LatestBlockTransactions';
import { useBlockNumber } from '../../state/application/hooks';
import TransactionsChart from './TransactionsChart';
import { isMobile } from 'react-device-detect';
import {
    UserOutlined,
    FileTextOutlined,
    SafetyOutlined,
    ApartmentOutlined
} from '@ant-design/icons';
import Statistics from './Statistics';
import TestAbi from './TestAbi';
const { Title, Text, Link } = Typography;

export default function () {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const blockNumber = useBlockNumber();
    return (
        <>
            <TestAbi></TestAbi>
            <div style={{ padding: '1%' }}>
                <Statistics />                
            </div>
            <LatestBlockTransactions />
        </>
    )
}
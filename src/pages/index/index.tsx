
import { Button, Col, Row, Card, Space, Typography, Avatar, List, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import LatestBlockTransactions from './LatestBlockTransactions';
import { useBlockNumber } from '../../state/application/hooks';

const { Title, Text, Link } = Typography;

export default function () {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const blockNumber = useBlockNumber();

    return (
        <>
            <div style={{padding:'1%'}}>
                <Card>
                    放些图标 / Price / 以及其他链上统计信息.. {blockNumber}
                    <>{t('welcome')}</>
                </Card>
                <p>
                 </p>
            </div>
            <LatestBlockTransactions />
        </>
    )
}
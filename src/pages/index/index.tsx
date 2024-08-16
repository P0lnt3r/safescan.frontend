import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import LatestBlockTransactions from './LatestBlockTransactions';
import { useBlockNumber } from '../../state/application/hooks';
import Statistics from './Statistics';
const { Title, Text, Link } = Typography;

export default function () {
    return (
        <>
            <div>
                <Statistics />                
            </div>
            <LatestBlockTransactions />
        </>
    )
}
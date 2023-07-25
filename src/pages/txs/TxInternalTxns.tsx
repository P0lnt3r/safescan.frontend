import { ContractInternalTransactionVO } from "../../services"
import { Typography, Row, } from 'antd';
import shape from '../../images/shape-1.svg'
import Address from '../../components/Address';
import EtherAmount from '../../components/EtherAmount';
const { Text } = Typography;

export default ({ contractInternalTransactions }: {
    contractInternalTransactions: ContractInternalTransactionVO[]
}) => {

    const RenderContractInternalTransaction = (contractInternalTransaction: ContractInternalTransactionVO) => {
        const { id, type, from, to, value } = contractInternalTransaction;
        return (type != 'CREATE2' &&
            <Row key={id}>
                <img src={shape} style={{ width: "8px", marginTop: "-2px", marginRight: "4px" }} />
                <Text type='secondary' strong>
                    {
                        value && type === 'CALL' && "TRANSFER"
                    }
                    {
                        'CALL' !== type && type
                    }
                </Text>
                {
                    value && type === 'CALL' && <Text style={{ marginLeft: '4px', marginRight: '4px' }}>
                        <EtherAmount raw={value} fix={18}></EtherAmount>
                    </Text>
                }
                <Text type='secondary' style={{ marginLeft: '4px', marginRight: '4px' }}> From </Text>
                <Address address={from} />

                <Text type='secondary' style={{ marginLeft: '4px', marginRight: '4px' }}> To </Text>
                <Address address={to} />
            </Row>
        )
    }

    return <>
        {
            contractInternalTransactions.map(RenderContractInternalTransaction)
        }
    </>

}
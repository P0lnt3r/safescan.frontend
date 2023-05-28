
import { Pie } from '@ant-design/plots';
import { IncentivePlanVO } from '../services';

export default ( { creator , partner , voter } : IncentivePlanVO ) => {

    const data = [
        {
            type: 'Creator',
            value: creator,
        },
        {
            type: 'Partner',
            value: partner,
        },
        {
            type: 'Voter',
            value: voter,
        },
    ];
    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.75,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name}\n{percentage}',
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
    };

    return (<>
        <Pie {...config} />
    </>)

}
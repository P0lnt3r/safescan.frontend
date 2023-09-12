
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Area } from '@ant-design/plots';
import { AnalyticTransaction } from '../../services';

export default ( {
    transactions
} : {
    transactions : AnalyticTransaction[]
} ) => {
    console.log( "transactions" , transactions )
    const chart : [{
        date : string , 
        value : number , 
        field : string
    }]= [{date:"",value:0,field:""}];
    transactions.forEach( transaction => {
        const { time , transactions , uniqueIncomingAddresses , uniqueOutgoingAddresses } = transaction;
        chart.push({
            date : time , 
            field : "transactions",
            value : transactions
        });
        chart.push({
            date : time , 
            field : "uniqueIncomingAddresses",
            value : uniqueIncomingAddresses
        });
        chart.push({
            date : time , 
            field : "uniqueOutgoingAddresses",
            value : uniqueOutgoingAddresses
        });
    });
    console.log("wocaocaocao" , chart);
    const [data, setData] = useState([]);
   
    const config = {
      data : chart ,
      xField: 'date',
      yField: 'value',
      seriesField: 'field',
    };
  
    return <Area {...config} />;

}
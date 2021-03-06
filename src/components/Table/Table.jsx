import React from 'react';
import "./Table.css";
import numeral from "numeral";

const Table = (props) => {
    const{countries} = props;
    return (
        <div className='table'>
            {
                countries.map(({country,cases})  => (
                    <tr>
                        <td className='name'>{country}</td>
                        <td>
            <strong>{numeral(cases).format("0,0")}</strong>
          </td>
                    </tr>
                )
                )
            }
            
        </div>
    );
};

export default Table;
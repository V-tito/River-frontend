//import DataTable from "./views/dataTable"
import DataCards from "./views/cards/dataCards";
import PropTypes from 'prop-types';
import React from "react";
const DataView=({ data, kind})=>{
return (
<DataCards data={data} kind={kind}></DataCards>)
}

DataView.propTypes={
    data:PropTypes.arrayOf(PropTypes.shape({
    })),
    kind: PropTypes.string
}
export default DataView
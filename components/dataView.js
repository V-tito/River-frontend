import DataTable from "./views/dataTable"
import PropTypes from 'prop-types';
import React from "react";
const DataView=({ data, kind})=>{
return (
<DataTable data={data} kind={kind}></DataTable>)
}

DataView.propTypes={
    data:PropTypes.arrayOf(PropTypes.shape({
    })),
    kind: PropTypes.string
}
export default DataView
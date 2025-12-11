import DataTable from "./views/dataTable"
const DataView=({ data, kind})=>{
return (
<DataTable data={data} kind={kind}></DataTable>)
}
export default DataView
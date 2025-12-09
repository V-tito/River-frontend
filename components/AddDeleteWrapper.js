import AddForm from "./forms/add_form"
import DeleteForm from "./forms/delete_form"

const AddDeleteWrapper = ({ table,listOfAll,children }) => {
    return (
        <div className='flex flex-row w-full'>
        <div  className="flex flex-col  self-left items-left w-full h-min">
            {children}
            </div>
        <aside className='self-right items-right flex-col w-20%'>
            <div>
            <AddForm table={table}></AddForm>
            <DeleteForm table={table} listOfAll={listOfAll}></DeleteForm></div>
      </aside>
        </div>
    )
}

export default AddDeleteWrapper
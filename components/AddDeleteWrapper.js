import AddForm from "./forms/add_form"
import DeleteForm from "./forms/delete_form"

const AddDeleteWrapper = ({ table,listOfAll,children }) => {
    return (
        <div className='flex flex-row'>
        <div  className="flex flex-col p-5 self-left items-left gap-6 text-center sm:items-start sm:text-left w-full"><div className="w-full">{children}</div></div>
        <aside className='self-right items-right flex-row w-'>
            <AddForm table={table}></AddForm>
            <DeleteForm table={table} listOfAll={listOfAll}></DeleteForm>
      </aside>
        </div>
    )
}

export default AddDeleteWrapper
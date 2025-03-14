import React, {useState, useEffect} from 'react'

const TableActions = ({data, editFn, deleteFn, disableFn, isActive}) => {
    const [openActions, setOpenActions] = useState(false)
    const onEdit = () => {
        editFn(data)
        setOpenActions(!openActions)
    }

    const onDelete = () => {
        deleteFn(data)
        setOpenActions(!openActions)
    }
    const onDisable = () => {
        disableFn(data)
        setOpenActions(!openActions)
    }
    useEffect(()=> {}, [openActions])

    return (
        <div className='relative'>
            <i className="fa-solid fa-ellipsis mx-2 text-lg" onClick={() => setOpenActions(!openActions)}></i>
            {openActions ?
            <div className='bg-green-100 z-10 absolute left-pos shadow'>
                <i className="fa-solid fa-caret-up absolute left-pos -top-2 text-green-200"></i>
                <div className='text-left text-sm w-28'>
                    <p className={`px-3 py-2 hover:bg-green-200 text-sm ${data.paid ? 'opacity-60 pointer-events-none' : null}`} onClick={() => onEdit()}><i className="fa-solid fa-edit mr-1"></i> Edit</p>
                    {disableFn && <p className={`px-3 py-2 hover:bg-green-200 text-sm ${data.paid ? 'opacity-60 pointer-events-none' : null}`} onClick={() => onDisable()}><i className={`fa-solid mr-2 ${isActive ? "fa-ban" : "fa-check"}`}></i>{isActive ? "Disable" : "Activate"}</p>}
                    <p className={`px-3 py-2 hover:bg-green-200 text-sm ${data.status === 'paid' ? 'opacity-60 pointer-events-none' : null}`} onClick={() => onDelete()}><i className="fa-solid fa-trash mr-1"></i> Delete</p>
                </div>
            </div>
            : null }
        </div>
    )
}

export default TableActions
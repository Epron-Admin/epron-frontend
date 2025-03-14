import React, { useState } from 'react'
// import './hooks.css'

const usePasswordToggle = () => {
    const [visible, setVisible] = useState(false)
    const InputType = visible ? 'text' : 'password'
    const Icon = <i onClick={() => setVisible(!visible)} className={`absolute text-sm top-pos cursor-pointer right-5 fas ${visible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
    return [InputType, Icon]
}

export default usePasswordToggle
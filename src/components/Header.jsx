import React from 'react'
import rtuLogo from '../assets/rtu-logo.svg'

const Header = () => {
  return (
    <div className='main-header h-32 flex px-4 items-center mt-0 bg-gray-200'>
      <img src={rtuLogo} className="w-125 h-auto" />
    </div>
  )
}

export default Header
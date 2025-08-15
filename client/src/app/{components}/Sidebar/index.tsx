'use client'
import { Menu } from 'lucide-react'
import React from 'react'


const Sidebar = () => {
  return (
    <div>
        {/* Top Logo */}
        <div className='flex gap-3 justify-content md: justify-normal item-cent pt-8'>
            <div>Logo</div>
            <h1 className='text-2xl font-bold'>Dashboard</h1>
            <button className='md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-200 transition-all duration-300' onClick={()=> {}}>
                <Menu className="w-4 h-4" />
            </button>
        </div>

        {/* Links */}
        <div className='flex-grow mt-8'>

        </div>

        {/* Footer */}
        <div>
            <p className='text-center text-gray-500'>&copy 2025</p>
        </div>

    </div>
  )
}

export default Sidebar
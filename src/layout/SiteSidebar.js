import React from 'react'

export const SiteSidebar = ({ title="My Sidebar", children }) => (
    <sidebar is="section" className="items-start">
        {/* <h2 className="text-xl p-2 bg-gray-300 border-none">{title}</h2> */}
            {children}
    </sidebar>
)

export default SiteSidebar;
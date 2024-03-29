import React from 'react'

export const SiteSidebar = ({ title="My Sidebar", children }) => (
    <sidebar is="section" className="items-start overflow-y-auto pr-2 md:pr-0">
      {children}
    </sidebar>
)

export default SiteSidebar;
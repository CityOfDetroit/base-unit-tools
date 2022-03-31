import React from 'react'

export const SiteSidebar = ({ title="My Sidebar", children }) => (
    <sidebar is="section" className="items-start">
      {children}
    </sidebar>
)

export default SiteSidebar;
import React, { useState } from 'react';
import SiteSidebar from '../layout/SiteSidebar'
import useQuery from '../hooks/useQuery'

const Linker = () => {

  // get some URL params
  let query = useQuery()
  let queryType = query.get("type")
  let queryId = query.get("id")

  return (
    <>
      <SiteSidebar title="Linker">
        <section className="sidebar-section">
          <h2>Feature to create links to</h2>
          {queryType} {queryId}
          <div className="flex items-center justify-between">
          </div>
        </section>
      </SiteSidebar>
      <main>
      </main>
    </>
  )
}

export default Linker;
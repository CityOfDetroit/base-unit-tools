import React, { useState } from 'react';
import AppHeader from '../components/AppHeader';
import apps from '../data/apps';
import SiteSidebar from '../layout/SiteSidebar';
import parse from '../parser.js'

const Validator = () => {

  let [value, setValue] = useState('')

  let {results, applied} = parse(value)

  let displayFields = [
    ['housenum', 'House number'],
    ['direction', 'Street direction'],
    ['streetname', 'Street name'],
    ['streettype', 'Street type'],
    ['unittype', 'Unit type'],
    ['unitnum', 'Unit number'],
  ]


  let introduction = (
    <>
      <p className="py-2">Use this tool to see how our address parser breaks down a full address into its component parts,
      like street number and street name.</p>
      <p className="py-2">Enter one address in the box below and you'll see the output of the parser.</p>
      <p className="py-2">The Rules Applied section will show you how the tool is working. 
      For example, if you enter <i>123 St Aubin</i> you'll see that the <i>St</i> has been expanded to <i>Saint.</i></p>
    </>
  )
  return (
    <>
      <SiteSidebar title="Validator">
      <AppHeader app={apps.validator} introduction={introduction}>
      </AppHeader>
        <section className="sidebar-section">
          <h2>Address to parse</h2>
          <div className="flex items-center justify-between">
            <input
              className="p-2 w-full my-2"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </section>
        <section className="sidebar-section">
          <h4>Output</h4>
          {displayFields.map(f => (
            <div key={f[1]} className="bg-grey-200 flex items-center justify-start my-2">
              <h4 className="w-1/3 text-sm font-normal">{f[1]}</h4>
              <pre className="text-sm">{results[f[0]]}</pre>
            </div>
          ))}
        </section>
        <section className="p-2 mb-2 text-sm bg-gray-300">
          <h4 className="text-sm">Rules applied:</h4>
          {applied.map(a => (
            <div key={a.rule} className="bg-grey-200 flex items-center justify-start my-2 text-sm">
              <span className="w-2/3 text-sm text-gray-700">{a.rule}</span>
              <pre>{a.results[0].trim()}</pre>
            </div>
          ))}
        </section>
        <pre className="sidebar-section">
          {JSON.stringify(parse(value).results, null, "\t")}
        </pre>
      </SiteSidebar>
      <main>
      </main>
    </>
  )
}

export default Validator;
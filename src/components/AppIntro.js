import { faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"


const AppIntro = ({ app, children }) => {

  let [show, setShow] = useState(true)
  if(show) {
    return (
    <section className='pl-4 pr-2 pb-4 pt-2 bg-gray-300 mb-2'>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <FontAwesomeIcon icon={app.icon} className="text-2xl mr-2 mt-1"/>
          <h2 className="text-lg"><b>{app.name}</b></h2>
        </div>
        <div className="hover:bg-gray-500 hover:bg-opacity-20 px-3 py-2 rounded" onClick={() => setShow(false)}>
          <FontAwesomeIcon icon={faWindowClose}  className="text-gray-500 text-lg" />
        </div>
      </div>
      <div className="mx-2">
        {children}
      </div>
    </section>
    )
  }
  else { return null; }
}

export default AppIntro;
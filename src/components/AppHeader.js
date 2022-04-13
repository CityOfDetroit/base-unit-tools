import { faChevronCircleDown, faChevronCircleRight, faCog, faInfoCircle, faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import AnimateHeight from 'react-animate-height'


const AppHeader = ({ app, introduction = false, introOpen=true, children }) => {

  let [open, setOpen] = useState(children ? true : false)
  let [showIntro, setShowIntro] = useState(introduction && introOpen ? true : false)

  return (
    <div style={{gridArea:"ah"}} className="mb-0 md:mb-2">
      <div className="flex items-center bg-gray-300 justify-between">
        <div className="flex items-center px-2 py-2 md:px-3">
          <FontAwesomeIcon icon={app.icon} className="text-base md:text-2xl" />
          <h2 className="text-sm md:text-lg ml-2 md:ml-3"><b>{app.name}</b></h2>
        </div>
        <div className="flex items-center gap-4 mr-2">
          {introduction && <div className="hover:text-gray-500 hover:bg-opacity-20 rounded" onClick={() => setShowIntro(!showIntro)}>
            <FontAwesomeIcon icon={faInfoCircle} className={showIntro ? "text-gray-800 text-base md:text-xl cursor-pointer" : "text-gray-500 text-base md:text-xl cursor-pointer"} />
          </div>}
          {children && <div className="hover:text-gray-500 hover:bg-opacity-20 rounded" onClick={() => setOpen(!open)}>
            <FontAwesomeIcon icon={faCog} className={open ? "text-gray-800 text-base md:text-xl cursor-pointer" : "text-gray-500 text-base md:text-xl cursor-pointer"} />
          </div>}
        </div>
      </div>
      <AnimateHeight
        duration={250}
        height={showIntro ? 'auto' : 0}
      >
        <section className={'px-3 md:px-4 py-2 md:py-3 bg-gray-100 app-intro text-sm md:text-base'}>
          {introduction}
        </section>
      </AnimateHeight>
      <AnimateHeight
        duration={250}
        height={open ? 'auto' : 0}
      >
        <section className={'p-2 md:p-3 bg-gray-100'}>
          {children}
        </section>
      </AnimateHeight>
    </div>
  )
}

export default AppHeader;
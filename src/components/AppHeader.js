import { faChevronCircleDown, faChevronCircleRight, faCog, faInfoCircle, faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import AnimateHeight from 'react-animate-height'


const AppHeader = ({ app, introduction = false, children }) => {

  let [open, setOpen] = useState(children ? true : false)
  let [showIntro, setShowIntro] = useState(introduction ? true : false)

  return (
    <div className="mb-2">
      <div className="flex items-center bg-gray-300 justify-between p-2">
        <div className="flex items-center ml-2">
          <FontAwesomeIcon icon={app.icon} className="text-base md:text-2xl mr-2 mt-1" />
          <h2 className="text-sm md:text-lg ml-1"><b>{app.name}</b></h2>
        </div>
        <div className="flex items-center gap-4 mr-2">
          {introduction && <div className="hover:bg-gray-500 hover:bg-opacity-20 rounded" onClick={() => setShowIntro(!showIntro)}>
            <FontAwesomeIcon icon={faInfoCircle} className={showIntro ? "text-gray-800 text-base md:text-xl" : "text-gray-500 text-base md:text-xl"} />
          </div>}
          {children && <div className="hover:bg-gray-500 hover:bg-opacity-20 rounded" onClick={() => setOpen(!open)}>
            <FontAwesomeIcon icon={faCog} className={open ? "text-gray-800 text-base md:text-xl" : "text-gray-500 text-base md:text-xl"} />
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
        <section className={'px-4 pt-3 pb-4 bg-gray-100'}>

          {children}
        </section>
      </AnimateHeight>
    </div>
  )
}

export default AppHeader;
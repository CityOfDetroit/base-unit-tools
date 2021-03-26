import logo from '../images/logo.png';

const SiteHeader = ({ session }) => {
  return (
    <header>
    <div className="flex items-center justify-between">
      <img src={logo} className="h-10 mt-2 ml-2 mr-2" alt={"City logo"} />
      <h1 className="w-full font-black">
        Base Unit Tools
      </h1>
    </div>

    {session ?
    // If user is logged in, display this div
    <div className="w-100 text-right -mt-2">
      <span className="leading-tight  text-sm text-gray-500 font-semibold">
        logged in as: <b>{session.username}</b>
      </span>
    </div>
    :
    // Else, this div.
    <div className="w-100 text-right -mt-2">
      <span className="leading-tight  text-sm text-gray-500 font-semibold">
        {/* TODO */}
      </span>
    </div>
    }  
  </header>
  )
}

export default SiteHeader;
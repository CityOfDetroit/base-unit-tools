const SiteFooter = () => (
    <footer className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-2 py-4 justify-between px-3 text-xs">
        <p>
          City of Detroit, {new Date().getFullYear()}. 
        </p>
        <p>
          Feedback?{" "}
            <a href="https://app.smartsheet.com/b/form/6919c51a844448e2a6811f04a6267292">Write to us here</a>, 
            or  {" "}
            <a href="https://github.com/CityOfDetroit/base-unit-tools">open an issue.</a>
        </p>
    </footer>
)

export default SiteFooter;
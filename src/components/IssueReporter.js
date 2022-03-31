import AnimateHeight from "react-animate-height";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleDown,
  faChevronCircleRight,
  faWrench
} from "@fortawesome/free-solid-svg-icons";

const IssueReporter = () => {
  let [show, setShow] = useState(false);

  return (
    <section className="sidebar-section">
      <div className="flex items-center justify-between">
        <FontAwesomeIcon icon={faWrench} className="text-gray-400" />
        <h2 className="text-sm md:text-base">Report an issue here</h2>
        <FontAwesomeIcon
          icon={show ? faChevronCircleDown : faChevronCircleRight}
          className="ml-2 text-xl"
          onClick={() => setShow(!show)}
        />
      </div>
      <AnimateHeight duration={250} height={show ? "auto" : 0}>
        <input type="text"></input>
      </AnimateHeight>
    </section>
  );
};

export default IssueReporter;

import Button from "../components/Button";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const AerialControl = ({ aerial, setAerial }) => {
  return (
    <Button
      onClick={() => setAerial(!aerial)}
      icon={faCamera}
      text="Aerial"
      active={aerial}
      className="py-1 text-xs"
      small
    />
  );
};

export default AerialControl;

import { useRef } from "react";

const ResizeHandle = ({ onResize, containerRef }) => {
  const isDragging = useRef(false);

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;

    const handleMouseMove = (e) => {
      if (!isDragging.current || !containerRef?.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidthPercent = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Clamp between 20% and 60%
      const clampedWidth = Math.min(60, Math.max(20, newWidthPercent));
      onResize(clampedWidth);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className="hidden md:flex w-2 cursor-col-resize hover:bg-blue-300 bg-transparent items-center justify-center group"
      style={{ gridColumn: "1 / 2", gridRow: "1 / -1", justifySelf: "end", zIndex: 10 }}
    >
      <div className="w-0.5 h-16 bg-gray-300 group-hover:bg-blue-400 rounded-full" />
    </div>
  );
};

export default ResizeHandle;

const Skeleton = ({ className = "", width = "100%", height = "16px" }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ width, height }}
    ></div>
  );
};

export default Skeleton;

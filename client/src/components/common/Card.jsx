const Card = ({ children, className = "", padding = "p-6", hover = false, elevated = false }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 transition-all duration-300 ${elevated ? "shadow-lg shadow-gray/10" : "shadow-sm"} ${hover ? "hover:shadow-xl hover:shadow-gray/20 hover:-translate-y-1" : ""} ${padding} ${className}`}
    >
      {children}
    </div>
  );
};

export { Card };
export default Card;

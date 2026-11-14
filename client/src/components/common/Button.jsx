import { forwardRef } from "react";

const Button = forwardRef(
  (
    { className = "", variant = "primary", size = "md", disabled, children, ...props },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-navy text-white shadow-lg shadow-navy/25 focus:ring-blue hover:bg-blue hover:shadow-lg hover:shadow-blue/30",
      secondary:
        "bg-white text-charcoal border border-gray-200 shadow-sm focus:ring-blue hover:bg-gray-50 hover:shadow-sm",
      gold:
        "bg-gold text-white shadow-lg shadow-gold/25 focus:ring-gold hover:bg-[#C49A46] hover:shadow-lg hover:shadow-gold/30",
      ghost:
        "bg-transparent text-charcoal border border-gray-200 focus:ring-blue hover:bg-gray-50 hover:shadow-sm",
      outline:
        "bg-transparent text-charcoal border border-gray-300 focus:ring-blue hover:bg-gray-50 hover:shadow-sm",
    };
    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export default Button;

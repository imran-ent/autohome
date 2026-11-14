import { forwardRef } from "react";

const Textarea = forwardRef(
  ({ className = "", label, helperText, error, rows = 4, leftIcon, ...props }, ref) => {
    const hasIcon = !!leftIcon;
    return (
      <div className={`mb-5 ${className}`}>
        {label && (
          <label className="block text-sm font-semibold text-charcoal mb-2 tracking-tight uppercase">
            {label}
          </label>
        )}
        <div className="relative">
          {hasIcon && (
            <div className="absolute left-3 top-3 text-gray-400 z-10">
              {leftIcon}
            </div>
          )}
          <textarea
            ref={ref}
            rows={rows}
            className={`block w-full pl-10 pr-4 py-3.5 rounded-xl text-charcoal placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue focus:ring-offset-1 disabled:bg-gray-50 disabled:text-gray-500 cursor-not-allowed ${hasIcon ? "pl-11" : "pl-4"} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 bg-white"}`}
            {...props}
          />
        </div>
        {error && <p className="mt-2 text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
export default Textarea;

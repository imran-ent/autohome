import { forwardRef } from "react";

const Select = forwardRef(
  ({ className = "", label, options, helperText, error, leftIcon, placeholder = "Select an option", ...props }, ref) => {
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
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            className={`block w-full pl-10 pr-10 py-3.5 rounded-xl text-charcoal bg-white transition-all duration-300 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue focus:ring-offset-1 cursor-pointer appearance-none ${hasIcon ? "pl-11" : "pl-4"} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 bg-white"}`}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="mt-2 text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
export default Select;

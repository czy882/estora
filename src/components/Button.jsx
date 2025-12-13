import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c2b3d]/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Brand Primary Color: Deep berry/Burgundy
    primary: "bg-[#7c2b3d] text-white hover:bg-[#6a2534] shadow-sm",
    // Secondary Dark
    dark: "bg-[#1d1d1f] text-white hover:bg-[#2d2d2f]",
    // Secondary Light
    secondary: "bg-[#e8e8ed] text-[#1d1d1f] hover:bg-[#d2d2d7]",
    // Ghost / Text button
    ghost: "text-[#7c2b3d] hover:text-[#6a2534] hover:underline bg-transparent p-0",
    // Outline button
    outline: "border border-[#7c2b3d] text-[#7c2b3d] hover:bg-[#7c2b3d] hover:text-white",
  };

  const sizes = {
    sm: "text-xs px-4 py-1.5",
    md: "text-sm px-6 py-2.5",
    lg: "text-base px-10 py-3.5",
  };

  const sizeClass = variant === 'ghost' ? '' : sizes[size];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
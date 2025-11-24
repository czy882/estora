import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Brand Primary Color: Deep berry/Burgundy, representing premium quality and comfort.
    primary: "bg-[#7c2b3d] text-white hover:bg-[#6a2534]", 
    // Secondary Dark
    dark: "bg-[#1d1d1f] text-white hover:bg-[#2d2d2f]",
    // Secondary Light
    secondary: "bg-[#e8e8ed] text-[#1d1d1f] hover:bg-[#d2d2d7]",
    // Ghost/Link Color: Soft berry tone
    ghost: "text-[#7c2b3d] hover:underline bg-transparent p-0",
    outline: "border border-[#7c2b3d] text-[#7c2b3d] hover:bg-[#7c2b3d] hover:text-white"
  };

  const sizes = {
    sm: "text-xs px-3 py-1",
    md: "text-sm px-5 py-2",
    lg: "text-base px-8 py-3",
  };

  const sizeClass = variant === 'ghost' ? '' : sizes[size];

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
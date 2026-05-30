import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon
}) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-red-500/30 hover:scale-105',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
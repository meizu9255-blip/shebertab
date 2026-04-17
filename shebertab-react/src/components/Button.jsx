import React from 'react';

const Button = ({ children, type = 'button', variant = 'primary', onClick, className = '', style = {} }) => {
  const baseClass = variant === 'outline' ? 'btn btn-outline' : 'btn btn-primary';
  return (
    <button
      type={type}
      className={`${baseClass} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;

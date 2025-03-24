import React from 'react';

export const Card = ({ children, className }) => {
  return (
    <div className={`border rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

export const CardHeader = ({ children, className }) => {
  return <div className={`border-b pb-2 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children }) => {
  return <h2 className="text-lg font-bold">{children}</h2>;
};

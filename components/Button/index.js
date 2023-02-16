import React from "react";

const Button = ({ children, disabled }) => {
  return (
    <button disabled={disabled} className="h-full w-full text-center ">
      {children}
    </button>
  );
};

export default Button;

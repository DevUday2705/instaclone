import React from "react";
import { BiLoaderCircle } from "react-icons/bi";

const LoadingOverlay = () => {
  return (
    <div className="w-full inset-0 animate-spin h-full flex items-center justify-center absolute z-10">
      <BiLoaderCircle size={50} />
    </div>
  );
};

export default LoadingOverlay;

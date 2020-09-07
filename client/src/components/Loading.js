import React from "react";

function Loading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="double-bounce1 bg-teal-600"></div>
        <div className="double-bounce2 bg-teal-600"></div>
      </div>
    </div>
  );
}

export default Loading;

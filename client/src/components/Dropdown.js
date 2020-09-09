import React, { useState, useEffect, useRef } from "react";

function Dropdown({ tokens, activeToken, setActiveToken }) {
  const [showMenu, setShowMenu] = useState(false);
  const myRef = useRef();

  const handleClickOutside = (e) => {
    const curr = myRef.current;
    if (curr && !curr.contains(e.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div ref={myRef} className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="inline-flex justify-center w-full py-2 text-xl leading-5 font-medium text-white hover:text-gray-100 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
        >
          {activeToken}/DAI
          <svg className="-mr-1 ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {showMenu && (
        <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg">
          <div className="rounded-md bg-white shadow-xs">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {tokens.map((token, idx) => (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setActiveToken(token);
                  }}
                  key={idx}
                  className="w-full text-left px-4 py-2 text-lg leading-7 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                  role="menuitem"
                >
                  {token}/DAI
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;

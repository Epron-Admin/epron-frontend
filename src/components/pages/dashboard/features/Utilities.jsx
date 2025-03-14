import React from "react";
import { useNavigate } from "react-router-dom";

function Utilities({ btn, btnLink }) {
  const navigate = useNavigate();
  return (
    <div>
      <div className="filter-wrap flex justify-between items-center mt-14">
        <div className="grid grid-cols-2 gap-2 items-center w-1/2 max-w-2xl">
          <div className="search relative">
            <input
              type="text"
              placeholder="Search by type"
              className="w-full h-10 block"
            />
            <i className="fas fa-search absolute top-pos right-5 text-xs"></i>
          </div>
          <div className="filter relative">
            <select
              name="filter"
              defaultValue={""}
              id=""
              className="cursor-pointer appearance-none w-full block h-10"
            >
              <option value="" disabled>
                Filter by Category
              </option>
              <option value="">Filter by 1</option>
              <option value="">Filter by 2</option>
            </select>
            <i className="fas fa-caret-down absolute top-pos right-5 text-sm pointer-events-none"></i>
          </div>
        </div>
        {btn && (
          <div className="button-wrap flex items-center">
            <i className="fas fa-file text-xl mr-3"></i>
            <i className="fas fa-file text-xl"></i>
            <button
              onClick={btnLink ? () => navigate(btnLink) : null}
              className="bg-main text-white px-5 py-3 rounded-md ml-5 shadow-md block"
            >
              {btn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Utilities;

import React, { useEffect, useState } from "react";
import { formatNumber, getTime } from "../../../../utils/helper";
import { pageLimit } from "../../../../utils/utils";
import TableActions from "./TableActions";
import table from "../../../../assets/table.png";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";

function Table({
  data,
  columns,
  hasRedirect,
  pagination,
  change,
  total,
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(50);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrev, setHasPrev] = useState(false);

  const getTime = (time) => {
    time = new Date(time).toLocaleTimeString();
    let timeArr = time.split(" ");
    timeArr[0] =
      timeArr[0].charAt(1) === ":"
        ? timeArr[0].substr(0, 4)
        : timeArr[0].substr(0, 5);
    return timeArr.join("");
  };

  const onNext = () => {
    let val = currentPage + 1;
    setHasPrev(true);
    setCurrentPage(val);
    change(val);
    window.scrollTo(0, 0);
  };

  const onPrev = () => {
    let val = currentPage - 1;
    setHasNext(true);
    setCurrentPage(val);
    change(val);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setStart((+currentPage - 1) * pageLimit + 1);
    let endVal = total < +currentPage * pageLimit ? total : +currentPage * pageLimit;
    setEnd(endVal);
    if (currentPage <= 1) return setHasPrev(false);
    if (endVal >= total) return setHasNext(false);
  }, [currentPage]);

  return (
    <div className="sticky-wrap relative">
      <div className="data-table mt-10 text-sm shadow-md border flow-wrap overflow-scroll">
        <table className="w-full bg-white whitespace-nowrap">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-center">S/N</th>
              {columns.map((column, index) => (
                <th key={index}>{column.title}</th>
              ))}
              {/* {!hasRedirect && (
                <th>
                  <p className="mx-2 text-center">Actions</p>
                </th>
              )} */}
            </tr>
          </thead>
          {data && data.length > 0 ? (
            <tbody>
              {data.map((record, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    hasRedirect &&
                      navigate("details", { state: { record: record } });
                  }}
                >
                  <td className="text-center">{index + (pageLimit * (currentPage - 1)) + 1}</td>
                  {columns.map((column, index) => (
                    <td key={index}>
                      {record[column.index] ===
                      "Small IT & Telecommunication Equipment" ? (
                        "Small IT Equipment"
                      ) : record[column.index] ===
                        "Cooling & Freezing equipment" ? (
                        "Freezing Equipment"
                      ) : column.subIndex &&
                        record[column.index][column.subIndex] ? (
                        record[column.index][column.subIndex]
                      ) : column.index === "total" ||
                        column.index === "price" ? (
                        formatNumber(Math.ceil(record[column.index]))
                      ) : column.index === "created_at" ||
                        column.index === "pickup_date" ? (
                        new Date(record[column.index]).toDateString()
                      ) : column.index === "pickup_time" ? (
                        getTime(record["pickup_date"])
                      ) : column.index === "weight" ? (
                        (record["weight"]).toFixed(2)
                      ) : column.index === "blocked" ? (
                        !record[column.index] ? (
                          "Active"
                        ) : (
                          "Blocked"
                        )
                      ) : column.index === "verified" ? (
                        record[column.index] ? (
                          "Verified"
                        ) : (
                          "Unverified"
                        )
                      ) : column.index === "role" ||
                        column.index === "epron_admin" ? (
                        <span className="capitalize">
                          {record[column.index]}
                        </span>
                      ) : column.index === "paid" ||
                        column.index === "status" ? (
                        <p
                          className={`capitalize rounded-md text-white text-center w-20 mx-auto py-1 ${
                            !record[column.index]
                              ? "bg-yellow-500"
                              : record[column.index] === "active"
                              ? "bg-green-500"
                              : record[column.index] === "inactive"
                              ? "bg-red-500"
                              : record[column.index] === true
                              ? "bg-green-500"
                              : ""
                          }`}
                        >
                          {record[column.index] === "active"
                            ? "active"
                            : record[column.index] === "inactive"
                            ? "inactive"
                            : !record[column.index] === true
                            ? "pending"
                            : "paid"}
                        </p>
                      ) : record[column.index] === true ? (
                        "True"
                      ) : record[column.index] === false ? (
                        "False"
                      ) : (
                        record[column.index] && record[column.index].length > 25 ? `${record[column.index].substring(0, 24)}...` : record[column.index]
                      )}
                    </td>
                  ))}
                    {/* record[column.index].length > 25 ? `${record[column.index].substring(0, 24)}...` :  */}
                  {/* {!hasRedirect && (
                    <td className="text-center">
                      <TableActions
                        data={record}
                        editFn={editRecord}
                        deleteFn={deleteRecord}
                        disableFn={disableUser}
                        isActive={
                          record.status === "active" || !record.blocked
                            ? true
                            : record.status === "inactive" || record.blocked
                            ? false
                            : null
                        }
                      />
                    </td>
                  )} */}
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
        {!data || data.length <= 0 ? (
          <div className="flex flex-col items-center justify-center h-60">
            <img src={table} alt="" className="w-44" />
            <p className="w-full mt-3 bg-gray-50 flex items-center justify-center">
              No data found
            </p>
          </div>
        ) : null}
      </div>

      {pagination && total > pageLimit ? (
        <div className="absolute bottom-0 right-0 w-full h-12 px-5 bg-gray-50 flex justify-between">
          <p>
            Showing records {start} -{" "}
            {total < +currentPage * pageLimit ? total : +currentPage * pageLimit}
          </p>
          <div className="flex items-center">
            <button
              onClick={() => onPrev()}
              className={`w-9 h-9 border rounded-md text-xl flex items-center justify-center bg-white ${
                !hasPrev && "opacity-50 pointer-events-none"
              }`}
            >
              {"<"}
            </button>
            <button className="w-9 h-9 border rounded-md bg-white">
              {/* <input
                value={currentPage}
                className="h-full text-center text-xl w-full border-0 rounded-md"
              /> */}
              {currentPage}
            </button>
            <button
              onClick={() => onNext()}
              className={`w-9 h-9 border rounded-md text-xl flex items-center justify-center bg-white ${
                !hasNext && "opacity-50 pointer-events-none"
              }`}
            >
              {">"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Table;

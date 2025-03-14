import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { utils, writeFile } from "xlsx";
import { showToast } from "../../../../reducers/toastSlice";
import Spinner from "../../../common/Spinner";

function Export({ exportData, getData, loading, id }) {
  const [fileName, setFileName] = useState("");
  const [showModal, setShowModal] = useState();
  const dispatch = useDispatch();

  const handleExport = (data) => {
    if (data.length === 0) {
      return dispatch(
        showToast({
          status: "error",
          title: "Error",
          message: "There is no data to export",
        })
      );
    }
    let wb = utils.book_new();
    let ws = utils.json_to_sheet(data);

    utils.book_append_sheet(wb, ws, "Sheet 1");
    writeFile(wb, `${fileName}.xlsx`);
    setShowModal(false);
    dispatch(
      showToast({
        status: "success",
        title: "Success",
        message: "The file will download shortly",
      })
    );
    onClose()
  };
  const onClose = () => {
    setShowModal(false);
    setFileName("");
  };
  const onExport = () => {
    getData({pagination: false, id})
    setShowModal(true);
  };

  return (
    <div>
      <button
        onClick={() => onExport()}
        className="bg-main text-white px-5 h-10 rounded-md ml-5 shadow-md block"
      >
        Export
      </button>
      {showModal ? (
        <div className="bg-black bg-opacity-80 w-full h-screen flex items-center justify-center fixed top-0 left-0 px-5 z-10">
          <div className="bg-white relative w-full max-w-xl py-10 px-10">
            <i
              onClick={() => onClose()}
              className="fa-regular fa-times-circle text-lg cursor-pointer absolute top-5 right-5"
            ></i>
            <p className="text-lg font-semibold mb-8">Export Data</p>
            <label>File Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => {
                setFileName(e.target.value);
              }}
              placeholder="Enter file name"
              className="w-full mb-10 h-12 px-3"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  handleExport(exportData);
                }}
                className="px-5 h-10 bg-green-600 text-white mx-2 rounded-md cursor-pointer"
              >
                {loading ? <Spinner /> : "Export"}
              </button>
              <button
                onClick={() => onClose()}
                className="px-5 h-10 bg-red-600 text-white mx-2 rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Export;

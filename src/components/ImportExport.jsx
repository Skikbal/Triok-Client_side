import React, { useEffect, useRef, useState } from "react";
import { HiOutlineDotsHorizontal as Menu } from "react-icons/hi";
import importIcon from "../assets/icons/download.svg";
import exportIcon from "../assets/icons/upload.svg";
import { handleDropdownClose } from "../utils/utils";
import ImportModal from "./ImpExpModal/ImportModal";
import ExportModal from "./ImpExpModal/ExportModal";

const ImportExport = ({ from, onCallApi, exportCsvData, selectedData }) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const handleExport = () => {
    setShowModal(true);
    setIsOpen(false);
  };

  const handleImport = () => {
    setShowModal2(true);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="custom-dropdown">
      <p className="head-5 green-H flex items-center gap-1" role="button" onClick={() => setIsOpen(!isOpen)}>
        More <Menu />
      </p>

      {isOpen && (
        <div className="dropdown-list-container dropdown-end light-bg-L dark-M body-N  shadow rounded-box " style={{ width: "150px", padding: "2px" }}>
          <ul className="dropdown-list">
            <li role="button" onClick={handleExport}>
              <img src={exportIcon} alt="" className="mr-2" /> Export
            </li>
            <li role="button" onClick={handleImport}>
              <img src={importIcon} alt="" className="mr-2" /> Import
            </li>
          </ul>
        </div>
      )}

      {showModal && <ExportModal showModal={showModal} selectedData={selectedData} exportCsvData={exportCsvData} from={from} onCallApi={onCallApi} onClose={() => setShowModal(false)} />}
      {showModal2 && <ImportModal showModal={showModal2} from={from} onCallApi={onCallApi} onClose={() => setShowModal2(false)} />}
    </div>
  );
};

export default ImportExport;

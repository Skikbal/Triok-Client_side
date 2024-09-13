import React, { forwardRef, useEffect, useState } from "react";
import Plus from "../../assets/svgs/Plus.svg";
import Cross from "../../assets/svgs/Close.svg";
import SaveSearchModal from "../SavedFilters/SaveSearchModal";
import { handleDropdownClose } from "../../utils/utils";

const RightModal = forwardRef(({ isOpen, onClose, children, title, desc, onFilter, from, saveSearchFilterData, onSetSelectedSaveFilterId }, ref) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    onClose();
    setShowModal(false);
  };

  useEffect(() => {
    const handleClose = () => {
      setShowModal(false);
    };
    handleDropdownClose(ref, handleClose);
  }, []);

  return (
    <div className={`fixed top-0 left-0 inset-0 bg-gray-700 bg-opacity-50 overflow-y-auto h-full w-full z-10 ${isOpen ? "block" : "hidden"}`}>
      <div className={`user-profile ${isOpen ? "open" : ""}`} ref={ref}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <p className="head-2 dark-H">{title}</p>
            <img role="button" src={Cross} alt="close" onClick={handleClose} />
          </div>

          <div className="flex items-center justify-between my-auto mt-2">
            <p className="dark-M body-S">{desc}</p>
            {/* {from !== "view" && (
              <button
                onClick={() => {
                  setShowModal(true);
                }}
                className="add-contact-button green-bg-H light-L body-S"
                style={{ padding: "6px 12px" }}
              >
                <img className="mr-2" src={Plus} alt="plus" /> Save Filter
              </button>
            )} */}
          </div>
          <hr className="mt-6" style={{ borderColor: "#6F6F6F" }} />
        </div>

        <div className="profile-body px-6 py-0 overflow-y-auto">{children}</div>

        <div className="light-bg-L filter-button p-6">
          <hr className="mb-6" style={{ borderColor: "#6F6F6F" }} />

          <div className="flex">
            {from !== "view" && (
              <button type="submit" className="save-button light-L head-5 green-bg-H mr-5" onClick={onFilter}>
                Filter
              </button>
            )}
            <button type="button" onClick={handleClose} className="green-H ">
              Cancel
            </button>
          </div>
        </div>

        <SaveSearchModal
          from={from}
          showModal={showModal}
          saveSearchFilterData={saveSearchFilterData}
          onSetSelectedSaveFilterId={onSetSelectedSaveFilterId}
          onClose={() => {
            setShowModal(false);
          }}
        />
      </div>
    </div>
  );
});

export default RightModal;

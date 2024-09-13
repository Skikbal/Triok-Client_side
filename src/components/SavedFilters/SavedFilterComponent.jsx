import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import Loader from "../Loader";
import useAuth from "../../hooks/useAuth";
import Plus from "../../assets/svgs/Plus.svg";
import { BASE_URL } from "../../utils/Element";
import SaveSearchModal from "./SaveSearchModal";
import { BoxCloseIcon } from "../../utils/icons";
import { handleDropdownClose } from "../../utils/utils";
import { RiEqualizerFill as Filter } from "react-icons/ri";
import { MdOutlineEdit as EditIcon } from "react-icons/md";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";
import ManageSavedFiltersModal from "./ManageSavedFiltersModal";

const SavedFilterComponent = ({ from, count, initialFilterData, isSidebarOpen, selectedSavefilterId, handleSelectFilter, saveSearchFilterData, onSetIsSidebarOpen, onCallApiAgain, onSetFilterData, onSetSelectedSaveFilterId }) => {
  const [config] = useAuth();
  const filterDropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [showManageModal, setShowManageModal] = useState(false);

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(filterDropdownRef, handleClose);
  }, []);

  const fetchSavedSearch = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/list-search?type=${from}`, config)
      .then((res) => {
        const data = res?.data?.search;
        setFilterOptions(data);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSavedSearch();
  }, [showModal]);

  const name = from === "smartplan" ? "TouchPlan" : from === "property" ? "Propertie" : from === "company" ? "Companie" : from;

  return (
    <>
      <div className="flex items-center gap-4">
        {count === 0 ? (
          <p
            role="button"
            className="head-5 green-H flex items-center gap-1"
            onClick={() => {
              onSetIsSidebarOpen(!isSidebarOpen);
            }}
          >
            Filter <Filter />
          </p>
        ) : (
          <div className="flex items-center gap-4">
            <p
              role="button"
              className="head-5 green-bg-H light-L flex items-center gap-1 px-4 py-2 rounded-[4px]"
              onClick={() => {
                onSetIsSidebarOpen(!isSidebarOpen);
              }}
            >
              {count} {count === 1 ? "Filter" : "Filters"} <Filter />
            </p>
            <p
              role="button"
              className="head-5 green-H flex items-center gap-1"
              onClick={() => {
                onSetFilterData(initialFilterData);
                onCallApiAgain(initialFilterData);
                onSetSelectedSaveFilterId("");
              }}
            >
              Clear Filter <BoxCloseIcon />
            </p>
            {selectedSavefilterId === "" && (
              <button
                onClick={() => {
                  setShowModal(true);
                }}
                className="add-contact-button green-bg-H light-L body-S"
                style={{ padding: "6px 12px" }}
              >
                <img className="mr-2" src={Plus} alt="plus" /> Save Filter
              </button>
            )}
          </div>
        )}

        <div ref={filterDropdownRef} className="custom-dropdown">
          <div
            role="button"
            style={{ border: "1px solid rgb(216, 216, 216)", height: "36px" }}
            className="select-header-input capitalize light-bg-L body-S dark-M flex justify-between items-center w-44"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <p>{selectedSavefilterId === "" ? `All ${name}s` : filterOptions?.find((el) => el?.id === selectedSavefilterId)?.name ?? ""}</p>
            <ArrowDown />
          </div>

          {isOpen && (
            <div className="dropdown-list-container p-2 shadow light-bg-L dark-M body-N rounded-box" style={{ width: "300px" }}>
              <div
                role="button"
                onClick={() => {
                  setShowManageModal(true);
                  setIsOpen(false);
                }}
                className="flex items-center gap-1 green-H head-6 w-fit"
              >
                <EditIcon size={18} />
                Manage Saved Searches
              </div>

              <hr className="mt-3 mb-2" />

              {loading ? (
                <Loader />
              ) : (
                <ul className="max-h-[240px] overflow-y-auto dropdown-list">
                  <li
                    role="button"
                    className={`${selectedSavefilterId === "" ? "active" : ""} capitalize`}
                    onClick={() => {
                      onSetFilterData(initialFilterData);
                      onCallApiAgain(initialFilterData);
                      onSetSelectedSaveFilterId("");
                      setIsOpen(false);
                    }}
                  >
                    All {name}s
                  </li>
                  {filterOptions?.map((el, idx) => (
                    <li
                      role="button"
                      className={`${selectedSavefilterId === el?.id ? "active" : ""} capitalize`}
                      key={idx}
                      onClick={() => {
                        handleSelectFilter(el?.searches);
                        onSetSelectedSaveFilterId(el?.id);
                        setIsOpen(false);
                      }}
                    >
                      {el?.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
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

      <ManageSavedFiltersModal
        from={from}
        showModal={showManageModal}
        onClose={() => {
          setShowManageModal(false);
        }}
      />
    </>
  );
};

export default SavedFilterComponent;

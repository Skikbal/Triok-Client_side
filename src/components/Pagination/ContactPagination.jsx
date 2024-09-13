import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import AddTagModal from "./Modal/AddTagModal";
import { BASE_URL } from "../../utils/Element";
import plusicon from "../../assets/images/plus.png";
import { handleDropdownClose } from "../../utils/utils";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";
import { AiOutlineDelete as DeleteIcon } from "react-icons/ai";
import AddActivityModal from "../../pages/Companies/Modals/AddActivityModal";
import DeleteConfirmationModal from "../ConfirmationModals/DeleteConfirmationModal";
import ArchiveConfirmationModal from "../ConfirmationModals/ArchiveConfirmationModal";
import RemoveTagConfirmationModal from "../ConfirmationModals/RemoveTagConfirmationModal";
import UnarchiveConfirmationModal from "../ConfirmationModals/UnarchieveConfirmationModal";
import ActivationConfirmationModal from "../ConfirmationModals/ActivationConfirmationModal";
import { FaArrowLeft as LeftArrowIcon, FaArrowRight as RightArrowIcon } from "react-icons/fa";
import { NotificationManager } from "react-notifications";

const ContactPagination = ({ selectedItem, setSelectedItem, paginationData, handlePrev, handleNext, tags, setTags, handleAddActivity, onSuccess, from }) => {
  const location = useLocation();
  const [config] = useAuth();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("");
  const [userError, setUserError] = useState();
  const [account_type, setAccountType] = useState("");
  const [showAddTagModal, setAddTagModal] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [accountTypeOptions, setAccountTypeOptions] = useState([]);
  const [showRemoveTagModal, setShowRemoveTagModal] = useState(false);
  const [showAddactivityModal, setAddactivityModal] = useState(false);

  const archiveType = location.pathname == "/settings/contact-archive" ? "contact" : location.pathname == "/settings/company-archive" ? "company" : location.pathname == "/settings/property-archive" ? "property" : location.pathname == "/settings/buyer-archive" ? "buyer" : location.pathname == "/settings/lead-sources" ? "lead_source" : location.pathname == "/settings/property-types" ? "property_type" : location.pathname == "/settings/property-tags" ? "property_tag" : location.pathname == "/settings/tenant" ? "tenant" : "contact_tag";

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const fetchAccountTypes = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=roles`, config)
      .then((res) => {
        const roles = res?.data?.data?.roles;
        setAccountTypeOptions(roles || []);
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    if (from === "user" && selectedItem?.length > 0) {
      fetchAccountTypes();
    }
  }, [from, selectedItem]);

  const handleDelete = () => {
    if (from === "archive") {
      const dataToSend = {
        action: "delete",
        type: archiveType,
        ids: selectedItem,
      };
      axios
        .post(`${BASE_URL}/handle-bulkaction`, dataToSend, config)
        .then((res) => {
          setShowDeleteModal(false);
          onSuccess();
          if (res?.data?.message) {
            NotificationManager.success(res?.data?.message);
          }
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    } else {
      const dataToSend = {
        action: "delete",
        ids: selectedItem,
        type: from,
      };
      axios
        .post(`${BASE_URL}/handleBulk-Actions`, dataToSend, config)
        .then((res) => {
          setShowDeleteModal(false);
          onSuccess();
          if (res?.data?.message) {
            NotificationManager.success(res?.data?.message);
          }
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    }
  };

  const handleRestore = () => {
    const dataToSend = {
      action: "restore",
      type: archiveType,
      ids: selectedItem,
    };

    axios
      .post(`${BASE_URL}/handle-bulkaction`, dataToSend, config)
      .then((res) => {
        setShowRestoreModal(false);
        onSuccess();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleUserUpdate = (from, accountType) => {
    const activeData = {
      user_id: selectedItem,
      action: type,
    };
    const accountTypeData = {
      account_type: accountType,
      user_id: selectedItem,
    };

    const dataToSend = from === "account" ? accountTypeData : activeData;
    axios
      .post(`${BASE_URL}/bulk-update`, dataToSend, config)
      .then((res) => {
        setShowActiveModal(false);
        onSuccess();
        setUserError();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setUserError(err.response.data.message);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <div className="flex justify-between mt-3 px-4">
      <div>
        {selectedItem?.length >= 1 && (
          <div className="green-H head-5 flex items-center gap-4">
            {/* <p className="border-r-[1px] border-[#6F6F6F] pr-4 body-L">
              {selectedItem?.length} <span className="dark-H">{selectedItem?.length === 1 ? "item" : "items"} selected</span>
            </p> */}

            {(from === "contact" || from === "company") && (
              <div>
                <div role="button" className="light-bg-L body-N dark-M tags" onClick={() => setAddTagModal(true)}>
                  <p className="flex items-center gap-2  green-H head-5 ">
                    <img src={plusicon} alt="plushimg" style={{ height: "12px" }} />
                    Add Tag
                  </p>
                </div>
              </div>
            )}

            {location.pathname.includes("archive") && (
              <p role="button" className=" flex items-center gap-1 tags" onClick={() => setShowRestoreModal(true)}>
                Restore
              </p>
            )}

            {(from === "contact" || from === "company") && (
              <p role="button" onClick={() => setShowRemoveTagModal(true)} className="flex items-center gap-1 tags">
                <DeleteIcon size={18} /> Remove Tag
              </p>
            )}

            {from === "contact" && (
              <div role="button" className="light-bg-L body-N dark-M " onClick={() => setAddactivityModal(true)}>
                <p className="flex items-center gap-2 border-l-[1px] border-[#6F6F6F] green-H head-5 pl-4 tags">
                  <img src={plusicon} alt="plushimg" style={{ height: "12px" }} /> Add Activity
                </p>
              </div>
            )}

            {from !== "user" && (
              <p role="button" onClick={() => setShowDeleteModal(true)} className="red-D flex items-center gap-1 tags" style={{ borderColor: "#FF0000" }}>
                <DeleteIcon size={18} />
                Delete
              </p>
            )}

            {from === "user" && (
              <>
                <div
                  role="button"
                  className="light-bg-L body-N dark-M tags"
                  onClick={() => {
                    setType("active");
                    setShowActiveModal(true);
                  }}
                >
                  <p className="green-H head-5">Active</p>
                </div>

                <div
                  role="button"
                  className="light-bg-L body-N dark-M tags"
                  onClick={() => {
                    setType("inactive");
                    setShowActiveModal(true);
                  }}
                >
                  <p className="green-H head-5">Inactive</p>
                </div>

                <div ref={dropdownRef} className="custom-dropdown light-bg-L body-N dark-M tags">
                  <div role="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1">
                    <p className="green-H head-5">Change Account Type</p>
                    <ArrowDown />
                  </div>
                  {isOpen && (
                    <div className="dropdown-list-container  dropdown-top light-bg-L dark-M body-N shadow rounded-box" style={{ width: "170px" }}>
                      <ul className="dropdown-list body-N dark-M">
                        {accountTypeOptions.flatMap((el, idx) => (
                          <li
                            key={idx}
                            role="button"
                            className="capitalize"
                            onClick={() => {
                              setAccountType(el.id);
                              handleUserUpdate("account", el.id);
                              setIsOpen(false);
                            }}
                          >
                            {el.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* <p role="button" onClick={() => setShowArchiveModal(true)} className="red-D flex items-center gap-1">
                  Archived
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5001 11.6667C17.2791 11.6667 17.0671 11.7545 16.9108 11.9108C16.7545 12.0671 16.6667 12.2791 16.6667 12.5001V15.8334C16.6667 16.0544 16.579 16.2664 16.4227 16.4227C16.2664 16.579 16.0544 16.6667 15.8334 16.6667H4.16675C3.94573 16.6667 3.73377 16.579 3.57749 16.4227C3.42121 16.2664 3.33341 16.0544 3.33341 15.8334V12.5001C3.33341 12.2791 3.24562 12.0671 3.08934 11.9108C2.93306 11.7545 2.7211 11.6667 2.50008 11.6667C2.27907 11.6667 2.06711 11.7545 1.91083 11.9108C1.75455 12.0671 1.66675 12.2791 1.66675 12.5001V15.8334C1.66675 16.4965 1.93014 17.1323 2.39898 17.6012C2.86782 18.07 3.50371 18.3334 4.16675 18.3334H15.8334C16.4965 18.3334 17.1323 18.07 17.6012 17.6012C18.07 17.1323 18.3334 16.4965 18.3334 15.8334V12.5001C18.3334 12.2791 18.2456 12.0671 18.0893 11.9108C17.9331 11.7545 17.7211 11.6667 17.5001 11.6667ZM9.40841 13.0917C9.48767 13.1676 9.58112 13.2271 9.68342 13.2667C9.78316 13.3108 9.89102 13.3336 10.0001 13.3336C10.1091 13.3336 10.217 13.3108 10.3167 13.2667C10.419 13.2271 10.5125 13.1676 10.5917 13.0917L13.9251 9.75842C14.082 9.6015 14.1702 9.38867 14.1702 9.16675C14.1702 8.94483 14.082 8.732 13.9251 8.57508C13.7682 8.41816 13.5553 8.33001 13.3334 8.33001C13.1115 8.33001 12.8987 8.41816 12.7417 8.57508L10.8334 10.4917V2.50008C10.8334 2.27907 10.7456 2.06711 10.5893 1.91083C10.4331 1.75455 10.2211 1.66675 10.0001 1.66675C9.77907 1.66675 9.56711 1.75455 9.41083 1.91083C9.25455 2.06711 9.16675 2.27907 9.16675 2.50008V10.4917L7.25842 8.57508C7.18072 8.49738 7.08847 8.43575 6.98696 8.3937C6.88544 8.35165 6.77663 8.33001 6.66675 8.33001C6.55687 8.33001 6.44806 8.35165 6.34654 8.3937C6.24502 8.43575 6.15278 8.49738 6.07508 8.57508C5.99738 8.65278 5.93575 8.74502 5.8937 8.84654C5.85165 8.94806 5.83001 9.05687 5.83001 9.16675C5.83001 9.27663 5.85165 9.38544 5.8937 9.48696C5.93575 9.58847 5.99738 9.68072 6.07508 9.75842L9.40841 13.0917Z" fill="#FF0000" />
                  </svg>
                </p> */}
              </>
            )}
          </div>
        )}
      </div>

      <div className="body-L dark-H flex items-center gap-2">
        <LeftArrowIcon role="button" className="dark-M" onClick={handlePrev} />
        <p>
          <span className="green-H">
            {paginationData?.from}-{paginationData?.to}
          </span>{" "}
          of {paginationData?.totalItems}
        </p>
        <RightArrowIcon role="button" className="dark-M" onClick={handleNext} />
      </div>

      <AddTagModal
        showModal={showAddTagModal}
        onClose={() => {
          setAddTagModal(false);
        }}
        from={from}
        selectedTags={tags}
        onSuccess={onSuccess}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        onSetTags={(value) => setTags(value)}
      />

      <RemoveTagConfirmationModal
        from={from}
        onSuccess={onSuccess}
        selectedItem={selectedItem}
        showModal={showRemoveTagModal}
        onClose={() => {
          setShowRemoveTagModal(false);
        }}
      />

      <AddActivityModal
        showModal={showAddactivityModal}
        onClose={() => {
          setAddactivityModal(false);
        }}
        from={"pagination"}
        showContact={false}
        selectedItem={selectedItem}
        onSubmit={handleAddActivity}
        onSuccess={onSuccess}
      />

      <DeleteConfirmationModal
        showModal={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
        handleDelete={handleDelete}
      />

      <UnarchiveConfirmationModal
        showModal={showRestoreModal}
        onClose={() => {
          setShowRestoreModal(false);
        }}
        handleAction={handleRestore}
      />

      <ArchiveConfirmationModal
        showModal={showArchiveModal}
        onClose={() => {
          setShowArchiveModal(false);
        }}
      />

      <ActivationConfirmationModal
        type={type}
        showModal={showActiveModal}
        onClose={() => {
          setShowActiveModal(false);
        }}
        handleConfirm={handleUserUpdate}
        error={userError}
      />
    </div>
  );
};

export default ContactPagination;

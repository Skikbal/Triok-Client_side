import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import Loader from "../../Loader";
import Modal from "../../Modal/Modal";
import AddNoteData from "./AddNoteData";
import EditNoteModal from "./EditNoteModal";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import Edit from "../../../assets/svgs/Pencil 2.svg";
import Delete from "../../../assets/svgs/delete 2.svg";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";
import DeleteConfirmationModal from "../../ConfirmationModals/DeleteConfirmationModal";
import { NotificationManager } from "react-notifications";
import { handleDropdownClose } from "../../../utils/utils";
import CustomDateFilterModal from "../../CustomDateFilterModal";

const allTimeFilterOptions = [
  { value: "", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "Last 7 days" },
  { value: "last_30_days", label: "Last 30 days" },
  { value: "last_90_days", label: "Last 90 days" },
  { value: "custom", label: "Custom" },
];

const ContactIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.3 12.22C12.8336 11.7581 13.2616 11.1869 13.5549 10.545C13.8482 9.90316 14 9.20571 14 8.5C14 7.17392 13.4732 5.90215 12.5355 4.96447C11.5979 4.02678 10.3261 3.5 9 3.5C7.67392 3.5 6.40215 4.02678 5.46447 4.96447C4.52678 5.90215 4 7.17392 4 8.5C3.99999 9.20571 4.1518 9.90316 4.44513 10.545C4.73845 11.1869 5.16642 11.7581 5.7 12.22C4.30014 12.8539 3.11247 13.8775 2.27898 15.1685C1.4455 16.4596 1.00147 17.9633 1 19.5C1 19.7652 1.10536 20.0196 1.29289 20.2071C1.48043 20.3946 1.73478 20.5 2 20.5C2.26522 20.5 2.51957 20.3946 2.70711 20.2071C2.89464 20.0196 3 19.7652 3 19.5C3 17.9087 3.63214 16.3826 4.75736 15.2574C5.88258 14.1321 7.4087 13.5 9 13.5C10.5913 13.5 12.1174 14.1321 13.2426 15.2574C14.3679 16.3826 15 17.9087 15 19.5C15 19.7652 15.1054 20.0196 15.2929 20.2071C15.4804 20.3946 15.7348 20.5 16 20.5C16.2652 20.5 16.5196 20.3946 16.7071 20.2071C16.8946 20.0196 17 19.7652 17 19.5C16.9985 17.9633 16.5545 16.4596 15.721 15.1685C14.8875 13.8775 13.6999 12.8539 12.3 12.22ZM9 11.5C8.40666 11.5 7.82664 11.3241 7.33329 10.9944C6.83994 10.6648 6.45542 10.1962 6.22836 9.64805C6.0013 9.09987 5.94189 8.49667 6.05764 7.91473C6.1734 7.33279 6.45912 6.79824 6.87868 6.37868C7.29824 5.95912 7.83279 5.6734 8.41473 5.55764C8.99667 5.44189 9.59987 5.5013 10.1481 5.72836C10.6962 5.95542 11.1648 6.33994 11.4944 6.83329C11.8241 7.32664 12 7.90666 12 8.5C12 9.29565 11.6839 10.0587 11.1213 10.6213C10.5587 11.1839 9.79565 11.5 9 11.5ZM18.74 11.82C19.38 11.0993 19.798 10.2091 19.9438 9.25634C20.0896 8.30362 19.9569 7.32907 19.5618 6.45C19.1666 5.57093 18.5258 4.8248 17.7165 4.30142C16.9071 3.77805 15.9638 3.49974 15 3.5C14.7348 3.5 14.4804 3.60536 14.2929 3.79289C14.1054 3.98043 14 4.23478 14 4.5C14 4.76522 14.1054 5.01957 14.2929 5.20711C14.4804 5.39464 14.7348 5.5 15 5.5C15.7956 5.5 16.5587 5.81607 17.1213 6.37868C17.6839 6.94129 18 7.70435 18 8.5C17.9986 9.02524 17.8593 9.5409 17.5961 9.99542C17.3328 10.4499 16.9549 10.8274 16.5 11.09C16.3517 11.1755 16.2279 11.2977 16.1404 11.4447C16.0528 11.5918 16.0045 11.7589 16 11.93C15.9958 12.0998 16.0349 12.2678 16.1137 12.4183C16.1924 12.5687 16.3081 12.6967 16.45 12.79L16.84 13.05L16.97 13.12C18.1754 13.6917 19.1923 14.596 19.901 15.7263C20.6096 16.8566 20.9805 18.1659 20.97 19.5C20.97 19.7652 21.0754 20.0196 21.2629 20.2071C21.4504 20.3946 21.7048 20.5 21.97 20.5C22.2352 20.5 22.4896 20.3946 22.6771 20.2071C22.8646 20.0196 22.97 19.7652 22.97 19.5C22.9782 17.9654 22.5938 16.4543 21.8535 15.1101C21.1131 13.7659 20.0413 12.6333 18.74 11.82Z" fill="#2D5B30" />
    </svg>
  );
};

const CompanyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.5H16V5.5C16 4.70435 15.6839 3.94129 15.1213 3.37868C14.5587 2.81607 13.7956 2.5 13 2.5H11C10.2044 2.5 9.44129 2.81607 8.87868 3.37868C8.31607 3.94129 8 4.70435 8 5.5V6.5H5C4.20435 6.5 3.44129 6.81607 2.87868 7.37868C2.31607 7.94129 2 8.70435 2 9.5V18.5C2 19.2956 2.31607 20.0587 2.87868 20.6213C3.44129 21.1839 4.20435 21.5 5 21.5H19C19.7956 21.5 20.5587 21.1839 21.1213 20.6213C21.6839 20.0587 22 19.2956 22 18.5V9.5C22 8.70435 21.6839 7.94129 21.1213 7.37868C20.5587 6.81607 19.7956 6.5 19 6.5ZM10 5.5C10 5.23478 10.1054 4.98043 10.2929 4.79289C10.4804 4.60536 10.7348 4.5 11 4.5H13C13.2652 4.5 13.5196 4.60536 13.7071 4.79289C13.8946 4.98043 14 5.23478 14 5.5V6.5H10V5.5ZM20 18.5C20 18.7652 19.8946 19.0196 19.7071 19.2071C19.5196 19.3946 19.2652 19.5 19 19.5H5C4.73478 19.5 4.48043 19.3946 4.29289 19.2071C4.10536 19.0196 4 18.7652 4 18.5V13.45H7V14.5C7 14.7652 7.10536 15.0196 7.29289 15.2071C7.48043 15.3946 7.73478 15.5 8 15.5C8.26522 15.5 8.51957 15.3946 8.70711 15.2071C8.89464 15.0196 9 14.7652 9 14.5V13.45H15V14.5C15 14.7652 15.1054 15.0196 15.2929 15.2071C15.4804 15.3946 15.7348 15.5 16 15.5C16.2652 15.5 16.5196 15.3946 16.7071 15.2071C16.8946 15.0196 17 14.7652 17 14.5V13.45H20V18.5ZM20 11.5H4V9.5C4 9.23478 4.10536 8.98043 4.29289 8.79289C4.48043 8.60536 4.73478 8.5 5 8.5H19C19.2652 8.5 19.5196 8.60536 19.7071 8.79289C19.8946 8.98043 20 9.23478 20 9.5V11.5Z" fill="#2D5B30" />
  </svg>
);

const PropertyIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 8H15C15.2652 8 15.5196 7.89464 15.7071 7.70711C15.8946 7.51957 16 7.26522 16 7C16 6.73478 15.8946 6.48043 15.7071 6.29289C15.5196 6.10536 15.2652 6 15 6H14C13.7348 6 13.4804 6.10536 13.2929 6.29289C13.1054 6.48043 13 6.73478 13 7C13 7.26522 13.1054 7.51957 13.2929 7.70711C13.4804 7.89464 13.7348 8 14 8ZM14 12H15C15.2652 12 15.5196 11.8946 15.7071 11.7071C15.8946 11.5196 16 11.2652 16 11C16 10.7348 15.8946 10.4804 15.7071 10.2929C15.5196 10.1054 15.2652 10 15 10H14C13.7348 10 13.4804 10.1054 13.2929 10.2929C13.1054 10.4804 13 10.7348 13 11C13 11.2652 13.1054 11.5196 13.2929 11.7071C13.4804 11.8946 13.7348 12 14 12ZM9 8H10C10.2652 8 10.5196 7.89464 10.7071 7.70711C10.8946 7.51957 11 7.26522 11 7C11 6.73478 10.8946 6.48043 10.7071 6.29289C10.5196 6.10536 10.2652 6 10 6H9C8.73478 6 8.48043 6.10536 8.29289 6.29289C8.10536 6.48043 8 6.73478 8 7C8 7.26522 8.10536 7.51957 8.29289 7.70711C8.48043 7.89464 8.73478 8 9 8ZM9 12H10C10.2652 12 10.5196 11.8946 10.7071 11.7071C10.8946 11.5196 11 11.2652 11 11C11 10.7348 10.8946 10.4804 10.7071 10.2929C10.5196 10.1054 10.2652 10 10 10H9C8.73478 10 8.48043 10.1054 8.29289 10.2929C8.10536 10.4804 8 10.7348 8 11C8 11.2652 8.10536 11.5196 8.29289 11.7071C8.48043 11.8946 8.73478 12 9 12ZM21 20H20V3C20 2.73478 19.8946 2.48043 19.7071 2.29289C19.5196 2.10536 19.2652 2 19 2H5C4.73478 2 4.48043 2.10536 4.29289 2.29289C4.10536 2.48043 4 2.73478 4 3V20H3C2.73478 20 2.48043 20.1054 2.29289 20.2929C2.10536 20.4804 2 20.7348 2 21C2 21.2652 2.10536 21.5196 2.29289 21.7071C2.48043 21.8946 2.73478 22 3 22H21C21.2652 22 21.5196 21.8946 21.7071 21.7071C21.8946 21.5196 22 21.2652 22 21C22 20.7348 21.8946 20.4804 21.7071 20.2929C21.5196 20.1054 21.2652 20 21 20ZM13 20H11V16H13V20ZM18 20H15V15C15 14.7348 14.8946 14.4804 14.7071 14.2929C14.5196 14.1054 14.2652 14 14 14H10C9.73478 14 9.48043 14.1054 9.29289 14.2929C9.10536 14.4804 9 14.7348 9 15V20H6V4H18V20Z" fill="#2D5B30" />
    </svg>
  );
};

const TaskIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_3406_3410)">
      <path d="M19 4H5C4.44772 4 4 4.44772 4 5V7C4 7.55228 4.44772 8 5 8H19C19.5523 8 20 7.55228 20 7V5C20 4.44772 19.5523 4 19 4Z" stroke="#2D5B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 4H5C4.44772 4 4 4.44772 4 5V7C4 7.55228 4.44772 8 5 8H19C19.5523 8 20 7.55228 20 7V5C20 4.44772 19.5523 4 19 4Z" stroke="#2D5B30" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12H5C4.44772 12 4 12.4477 4 13V19C4 19.5523 4.44772 20 5 20H9C9.55228 20 10 19.5523 10 19V13C10 12.4477 9.55228 12 9 12Z" stroke="#2D5B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12H5C4.44772 12 4 12.4477 4 13V19C4 19.5523 4.44772 20 5 20H9C9.55228 20 10 19.5523 10 19V13C10 12.4477 9.55228 12 9 12Z" stroke="#2D5B30" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 12H20" stroke="#2D5B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 12H20" stroke="#2D5B30" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 16H20" stroke="#2D5B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 16H20" stroke="#2D5B30" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 20H20" stroke="#2D5B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 20H20" stroke="#2D5B30" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_3406_3410">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const initialData = {
  type: "contact",
  linked_to: "",
  linked_name: "",
  description: "",
};

const NotesModal = ({ showModal, onClose }) => {
  const [config] = useAuth();
  const [error, setError] = useState();
  const allTimeDropdownRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [notesData, setNotesData] = useState([]);
  const [selectedNote, setSelectedNote] = useState();
  const [formData, setFormData] = useState(initialData);
  const [isAllTimeOpen, setIsAllTimeOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFilterValue, setSelectedFilterValue] = useState("");
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [filterCustomDate, setFilterCustomDate] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    const handleClose = () => {
      setIsAllTimeOpen(false);
    };
    handleDropdownClose(allTimeDropdownRef, handleClose);
  }, []);

  const buildQueryParams = () => {
    let params = "";
    if (selectedFilterValue !== "custom") {
      params += `filter=${selectedFilterValue}`;
    } else {
      params += `filter=${selectedFilterValue}&from_date=${moment(filterCustomDate.startDate).format("DD/MM/YYYY")}&to_date=${moment(filterCustomDate.endDate).format("DD/MM/YYYY")}`;
    }
    return params;
  };

  const fetchNotesData = () => {
    setLoading(true);
    const queryParams = buildQueryParams();
    axios
      .get(`${BASE_URL}/list-notes?${queryParams}`, config)
      .then((res) => {
        setNotesData(res?.data?.notes);
        setFilterCustomDate({
          startDate: "",
          endDate: "",
        });
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (showModal && selectedFilterValue !== "custom") {
      fetchNotesData();
    }
  }, [showModal, selectedFilterValue]);

  const handleAddNote = () => {
    const dataToSend = {
      type: formData?.type,
      linked_to: formData?.linked_to?.toString(),
      description: formData?.description,
    };

    axios
      .post(`${BASE_URL}/create-notes`, dataToSend, config)
      .then((res) => {
        setFormData(initialData);
        fetchNotesData();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleDeleteNote = () => {
    axios
      .delete(`${BASE_URL}/delete-notes/${selectedNote?.id}`, config)
      .then((res) => {
        setShowDeleteModal(false);
        fetchNotesData();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <Modal width="700px" title="Notes" show={showModal} onClose={onClose}>
      <div className="flex justify-between items-center mt-[-6px] dark-H">
        <p className="dark-M body-L">Add notes to easily track important details.</p>

        <div ref={allTimeDropdownRef} className="custom-dropdown">
          <div
            role="button"
            className="flex items-center gap-1 green-H head-5"
            onClick={() => {
              setIsAllTimeOpen(!isAllTimeOpen);
            }}
          >
            <p className="capitalize">{allTimeFilterOptions?.find((el) => el.value === selectedFilterValue)?.label}</p>
            <ArrowDown />
          </div>
          {isAllTimeOpen && (
            <div className="dropdown-list-container dropdown-end light-bg-L dark-M body-N p-2 shadow rounded-box w-48 ">
              <ul className="dropdown-list">
                {allTimeFilterOptions.map((el, idx) => (
                  <li
                    key={idx}
                    role="button"
                    className={`${selectedFilterValue === el.value ? "active" : ""}`}
                    onClick={() => {
                      if (el.value === "custom") {
                        setShowCustomDateModal(true);
                      }
                      setSelectedFilterValue(el.value);
                      setIsAllTimeOpen(false);
                    }}
                  >
                    {el.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="max-h-[300px] min-h-[100px] overflow-auto mt-5">
        {loading ? (
          <Loader />
        ) : notesData?.length === 0 ? (
          <p className="text-center dark-H body-N mt-4">No note available</p>
        ) : (
          notesData?.flatMap((el, idx) => (
            <div className="light-bg-H note-container mb-4" key={idx}>
              <p className="body-N dark-M">{el?.description}</p>
              <div className="flex justify-between items-center mt-1">
                <div className="flex gap-1">
                  {el?.type === "Contact" ? <ContactIcon /> : el?.type === "Company" ? <CompanyIcon /> : el?.type === "Property" ? <PropertyIcon /> : <TaskIcon />}
                  <p className="green-H head-6">{el?.linked_to_name?.name}</p>
                  <p className="body-XS dark-M ml-3">{moment(el?.created_at).format("hh:mm A, MMM DD, YYYY")}</p>
                </div>
                <div className="flex gap-2">
                  <img
                    src={Edit}
                    alt=""
                    role="button"
                    onClick={() => {
                      setSelectedNote(el);
                      setShowEditModal(true);
                    }}
                  />
                  <img
                    src={Delete}
                    alt=""
                    role="button"
                    onClick={() => {
                      setSelectedNote(el);
                      setShowDeleteModal(true);
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-3">
        <p className="dark-H head-2 mb-6">Add Note</p>

        <AddNoteData
          type="add"
          handleSubmit={handleAddNote}
          formData={formData}
          error={error}
          onSetFormData={(value) => {
            setFormData(value);
          }}
          onSetError={(err) => setError(err)}
        />
      </div>

      <CustomDateFilterModal
        showModal={showCustomDateModal}
        onClose={() => {
          setShowCustomDateModal(false);
        }}
        onSuccess={fetchNotesData}
        filterCustomDate={filterCustomDate}
        onSetFilterCustomDate={(value) => setFilterCustomDate(value)}
      />

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDeleteNote} />

      <EditNoteModal selectedNote={selectedNote} showModal={showEditModal} onClose={() => setShowEditModal(false)} onCallApi={fetchNotesData} />
    </Modal>
  );
};

export default NotesModal;

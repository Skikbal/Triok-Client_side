import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import Select from "react-select";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import Modal from "../../../components/Modal/Modal";
import { activityOptions } from "../../../utils/options";
import { handleDropdownClose } from "../../../utils/utils";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";
import { useSelectedOptions } from "../../../context/selectedOptionsContext";
import { NotificationManager } from "react-notifications";
import Loader from "../../../components/Loader";

const today = moment(new Date()).format("YYYY-MM-DD");

const initialFormData = {
  date: today,
  description: "",
  interaction_type: "",
};

const AddActivityModal = ({ showModal, onClose, showContact = true, from, selectedItem, onSuccess }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const dropdownRef = useRef(null);
  const [error, setError] = useState();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [contactId, setContactId] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const { setIsEditedactivity } = useSelectedOptions();
  const [contactOptions, setContactData] = useState([]);
  const [addactivityerror, setAddactivityerror] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (value, name) => {
    setError({ ...error, [name]: "" });
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const fetchContactData = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/get-datalisting?list=contacts&search=${search}&company_id=${id}`, config)
      .then((res) => {
        const contact = res?.data?.data?.contact_list;
        const contactOptions = contact?.map((el) => ({ label: `${el?.first_name} ${el?.last_name}`, value: el?.id }));
        setContactData(contactOptions);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id && showModal) {
      fetchContactData();
    }
  }, [id, showModal]);

  const handleClose = () => {
    setFormData(initialFormData);
    setContactId("");
    onClose();
    setError();
    setAddactivityerror();
  };

  const handleSubmitData = (e) => {
    const dataToSend =
      from === "contact"
        ? {
            interaction_type: formData?.interaction_type,
            date: formData.date,
            description: formData?.description,
            contact_id: id,
          }
        : {
            interaction_type: formData?.interaction_type,
            date: formData.date,
            description: formData?.description,
            contact_id: contactId,
            company_id: id,
          };
    axios
      .post(`${BASE_URL}/add-activity`, dataToSend, config)
      .then((res) => {
        setIsEditedactivity(true);
        handleClose();
        onSuccess();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
        setError(err.response.data.errors ? err.response.data.errors : err.response.data.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (from === "pagination") {
      const dataToSend = {
        action: "add_activity",
        ids: selectedItem,
        type: from,
        activity: {
          interaction_type: formData.interaction_type,
          date: formData.date,
          description: formData.description,
        },
      };
      axios
        .post(`${BASE_URL}/handleBulk-Actions`, dataToSend, config)
        .then((res) => {
          handleClose();
          onSuccess();
          if (res?.data?.message) {
            NotificationManager.success(res?.data?.message);
          }
        })
        .catch((error) => {
          if (error.response?.data?.message) {
            NotificationManager.error(error.response?.data?.message);
          }
          setAddactivityerror(error.response.data.errors ? error.response.data.errors : error.response.data.message);
        });
    } else {
      handleSubmitData();
    }
  };

  return (
    <Modal title={"Add New Activity"} desc={`Add a new activity to ${from === "pagination" ? "contact" : from}.`} show={showModal} onClose={handleClose}>
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit} className="py-3">
          {showContact && (
            <div className="mb-6">
              <p className="head-4 dark-H mb-2">
                Contact<span className="red-D">*</span>
              </p>
              <Select
                isSearchable
                className="company-select"
                options={contactOptions}
                placeholder="Select Contact"
                value={contactOptions?.find((el) => el.value === contactId)}
                onChange={(option) => {
                  setError((prevErrors) => ({ ...prevErrors, contact_id: "" }));
                  setContactId(option.value);
                }}
              />
              {error?.contact_id && <p className="red-D body-S">{error?.contact_id}</p>}
            </div>
          )}
          <div className="flex gap-3 items-center">
            <div className="mt-5 md:mt-0 w-[50%]">
              <p className="head-4 dark-H">
                Interaction Type<span className="red-D">*</span>
              </p>
              <div ref={dropdownRef} className="custom-dropdown mt-2">
                <div role="button" className="select-header-input capitalize light-bg-L body-N dark-M flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
                  {formData.interaction_type === "" ? "Select" : formData.interaction_type} <ArrowDown />
                </div>
                {isOpen && (
                  <div className="dropdown-list-container light-bg-L dark-M body-N shadow rounded-box w-52 ">
                    <ul className="dropdown-list">
                      {activityOptions.map((el, i) => (
                        <li
                          key={i}
                          role="button"
                          onClick={() => {
                            handleChange(el.value, "interaction_type");
                            setIsOpen(false);
                          }}
                          className={`${formData.interaction_type === el.value ? "active" : ""}`}
                        >
                          {el.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {addactivityerror?.interaction_type && <p className="body-S red-D">{addactivityerror?.interaction_type}</p>}
              {error?.interaction_type && <p className="body-S red-D">{error?.interaction_type}</p>}
            </div>

            <div className="mt-5 md:mt-0 w-[50%]">
              <p className="head-4 dark-H">
                Date<span className="red-D">*</span>
              </p>
              <div className=" mt-1">
                <input
                  type="date"
                  className="body-N"
                  value={formData.date}
                  onChange={(e) => {
                    handleChange(e.target.value, "date");
                  }}
                />
              </div>

              {addactivityerror?.date && <p className="body-S red-D">{addactivityerror?.date}</p>}
              {error?.date && <p className="body-S red-D">{error?.date}</p>}
            </div>
          </div>

          <div className="flex-1 mt-4">
            <p className="head-4 dark-H">
              Description <span className="body-S dar-M">(optional)</span>
            </p>
            <textarea
              rows={4}
              placeholder="Enter description here..."
              className="mt-2 w-full body-N"
              value={formData?.description}
              onChange={(e) => {
                handleChange(e.target.value, "description");
              }}
            />

            {addactivityerror?.description && <p className="body-S red-D">{addactivityerror?.description}</p>}
            {error?.description && <p className="body-S red-D">{error?.description}</p>}
          </div>

          <div className="mt-6">
            {addactivityerror && <p className="body-S red-D">{addactivityerror}</p>}
            <button type="submit" className="save-button light-L head-5 w-20 green-bg-H">
              Add
            </button>
            <button type="button" onClick={handleClose} className="green-H ml-5">
              Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddActivityModal;

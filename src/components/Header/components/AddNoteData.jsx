import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import Plus from "../../../assets/svgs/Plus.svg";
import { BASE_URL } from "../../../utils/Element";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";
import { handleDropdownClose } from "../../../utils/utils";
import SearchDropdown from "../../Dropdowns/SearchDropdown";

const options = [
  { value: "contact", label: "Contact" },
  { value: "company", label: "Company" },
  { value: "property", label: "Property" },
  { value: "task", label: "Task" },
];

const AddNoteData = ({ type, handleSubmit, formData, error, onSetError, onSetFormData }) => {
  const [config] = useAuth();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const fetchSuggestions = (inputValue) => {
    if (inputValue !== "") {
      const type = formData.type === "company" ? "companies" : formData.type === "contact" ? "contacts" : formData?.type === "property" ? "properties" : "tasks";
      axios
        .get(`${BASE_URL}/get-datalisting?list=${type}&search=${inputValue}`, config)
        .then((res) => {
          const data = res?.data?.data;
          const contactOptions = data?.contact_list?.map((el) => ({ value: el?.id, label: `${el?.first_name} ${el?.last_name}` }));
          const companyOptions = data?.company_list?.map((el) => ({ value: el?.id, label: el?.company_name }));
          const propertyOptions = data?.properties?.map((el) => ({ value: el?.id, label: el?.property_name }));
          const taskOptions = data?.tasks?.map((el) => ({ value: el?.id, label: el?.task_name }));
          const options = formData.type === "company" ? companyOptions : formData.type === "contact" ? contactOptions : formData?.type === "property" ? propertyOptions : taskOptions;
          setTypeOptions(options);
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    } else {
      setTypeOptions([]);
    }
  };

  return (
    <div>
      <div ref={dropdownRef} className="flex">
        <div className="custom-dropdown">
          <div
            role="button"
            style={{ width: "130px", borderRadius: "8px 0px 0px 8px" }}
            className="select-header-input capitalize light-bg-H body-N dark-M flex justify-between items-center"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {formData.type === "" ? "Select" : formData.type} <ArrowDown />
          </div>

          {isOpen && (
            <div className={`dropdown-list-container light-bg-L dark-M body-N shadow rounded-box ${type === "edit" ? "" : "dropdown-top-2"} `} style={{ width: "100%" }}>
              <ul className="dropdown-list">
                {options.flatMap((el, i) => (
                  <li
                    key={i}
                    role="button"
                    onClick={() => {
                      onSetError({ ...error, type: "" });
                      onSetFormData({ ...formData, type: el.value });
                      setIsOpen(false);
                    }}
                    className={`${formData.type === el.value ? "active" : ""}`}
                  >
                    {el.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-1">
          <SearchDropdown
            isTop={true}
            placeholder={`choose ${formData.type} for particular notes`}
            text={formData?.linked_name}
            options={typeOptions}
            fetchSuggestions={fetchSuggestions}
            onSetOptions={(value) => setTypeOptions(value)}
            handleSelect={(option) => {
              onSetError({ ...error, linked_name: "" });
              onSetFormData({ ...formData, linked_name: option?.label, linked_to: option?.value });
              setTypeOptions([]);
            }}
          />
        </div>
      </div>
      {error?.linked_to && <span className="body-S red-D">{error?.linked_to}</span>}
      {error?.type && <span className="body-S red-D">{error?.type}</span>}

      <div className="flex mt-4">
        <input
          type="text"
          placeholder="write note here..."
          className="mt-0 body-S rounded-[6px] dark-H"
          value={formData.description}
          onChange={(e) => {
            onSetError({ ...error, description: "" });
            onSetFormData({ ...formData, description: e.target.value });
          }}
        />

        <button className="add-note-button green-bg-H light-L body-S capitalize" onClick={handleSubmit}>
          <img className="mr-2 sidebar-icons" src={Plus} alt="plus" />
          {type} Note
        </button>
      </div>
      {error?.description && <span className="body-S red-D">{error?.description}</span>}
    </div>
  );
};

export default AddNoteData;

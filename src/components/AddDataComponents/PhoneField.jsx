import React, { useEffect, useRef, useState } from "react";
import Dropdown from "react-dropdown";
import Plus from "../../assets/svgs/Plus 2.svg";
import Close from "../../assets/svgs/Close 2.svg";
import { phoneOptions } from "../../utils/options";
import { handleDropdownClose } from "../../utils/utils";

const PhoneField = ({ phones, onSetPhones }) => {
  const [showAddMsg, setShowAddMsg] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const handleAdd = (el) => {
    if (el.phone_number === "" || el.ext === "" || el.phone_category === "") {
      setShowAddMsg(true);
    } else {
      setShowAddMsg(false);
      onSetPhones([...phones, { phone_category: "", country_code: "+1", phone_number: "", ext: "" }]);
    }
  };

  const handleRemove = (idx) => {
    const filterData = phones?.filter((_, i) => idx !== i);
    onSetPhones(filterData);
  };

  const handleChange = (value, name, idx) => {
    setShowAddMsg(false);

    let updatedValue = value;

    if (name === "phone_number") {
      if (/^-/.test(updatedValue)) {
        return;
      }

      updatedValue = updatedValue?.replace(/[^\d]/g, "").slice(0, 10);
    }

    if (name === "ext" && updatedValue?.length > 4) {
      return;
    }

    onSetPhones(phones.map((l, i) => (i === idx ? { ...l, [name]: updatedValue } : l)));
  };

  return (
    <div className="mt-6">
      <label className="dark-H head-4 mb-2">
        Phone <span className="body-S dark-M">(First is always primary)</span>
      </label>

      {phones?.flatMap((el, idx) => (
        <div key={idx}>
          <div className="flex gap-2 items-center">
            <div className="flex items-start">
              <div style={{ width: "30%" }} ref={dropdownRef}>
                <Dropdown
                  className="phone-select body-N"
                  options={phoneOptions}
                  placeholder="Select"
                  value={phoneOptions?.find((data) => data.value === el.phone_category)}
                  onChange={(option) => {
                    handleChange(option.value, "phone_category", idx);
                  }}
                />
              </div>

              <input
                className="body-N"
                name="phone_number"
                type="text"
                placeholder="add phone number"
                style={{ borderRadius: "0px" }}
                value={el.phone_number}
                onChange={(e) => {
                  handleChange(e.target.value, "phone_number", idx);
                }}
              />

              <input
                className="body-N"
                name="title"
                type="number"
                min="0"
                placeholder="ext."
                style={{ borderRadius: "0px", width: "30%" }}
                value={el.ext}
                onChange={(e) => {
                  handleChange(e.target.value, "ext", idx);
                }}
                onWheel={(e) => e.target.blur()}
              />
            </div>

            {idx === phones.length - 1 ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAdd(el);
                }}
              >
                <img src={Plus} alt="plus" />
              </button>
            ) : (
              <img
                src={Close}
                alt="close"
                role="button"
                className="sidebar-icons"
                onClick={() => {
                  handleRemove(idx);
                }}
              />
            )}
          </div>
          {showAddMsg && <p className="red-D body-S">Please fill all fields first</p>}
        </div>
      ))}
    </div>
  );
};

export default PhoneField;

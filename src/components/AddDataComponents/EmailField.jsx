import React, { useState } from "react";
import Dropdown from "react-dropdown";
import Plus from "../../assets/svgs/Plus 2.svg";
import Close from "../../assets/svgs/Close 2.svg";
import { emailOptions } from "../../utils/options";

const EmailField = ({ emails, onSetEmails }) => {
  const [showAddMsg, setShowAddMsg] = useState(false);

  const handleAdd = (el) => {
    if (el.email_id === "" || el.email_category === "") {
      setShowAddMsg(true);
    } else {
      setShowAddMsg(false);
      onSetEmails([...emails, { email_category: "", email_id: "" }]);
    }
  };

  const handleRemove = (idx) => {
    const filterData = emails?.filter((_, i) => idx !== i);
    onSetEmails(filterData);
  };

  const handleChange = (value, name, idx) => {
    setShowAddMsg(false);
    onSetEmails(emails?.map((l, i) => (i === idx ? { ...l, [name]: value } : l)));
  };

  return (
    <div className="mt-6">
      <label className="dark-H head-4 mb-2">
        Email <span className="body-S dark-M">(First is always primary)</span>
      </label>

      {emails?.flatMap((el, idx) => (
        <div key={idx}>
          <div className="flex gap-2 items-center">
            <div className="flex items-start" style={{ width: "100%" }}>
              <div style={{ width: "30%" }}>
                <Dropdown
                  className="phone-select body-N"
                  options={emailOptions}
                  placeholder="Select"
                  value={emailOptions.find((data) => data.value === el.email_category)}
                  onChange={(option) => {
                    handleChange(option.value, "email_category", idx);
                  }}
                />
              </div>

              <input
                className="body-N"
                name="email_id"
                type="email"
                placeholder="add email"
                style={{ borderRadius: "0px 8px 8px 0px" }}
                value={el.email_id}
                onChange={(e) => {
                  handleChange(e.target.value, "email_id", idx);
                }}
              />
            </div>

            {idx === emails.length - 1 ? (
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

export default EmailField;

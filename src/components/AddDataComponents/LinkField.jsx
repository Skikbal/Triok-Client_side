import React, { useState } from "react";
import Dropdown from "react-dropdown";
import Plus from "../../assets/svgs/Plus 2.svg";
import Close from "../../assets/svgs/Close 2.svg";
import { linkOptions } from "../../utils/options";

const LinkField = ({ links, onSetLinks }) => {
  const [showAddMsg, setShowAddMsg] = useState(false);

  const handleAdd = (el) => {
    if (el.link === "" || el.link_category === "") {
      setShowAddMsg(true);
    } else {
      setShowAddMsg(false);
      onSetLinks([...links, { link_category: "", link: "" }]);
    }
  };

  const handleRemove = (idx) => {
    const filterData = links?.filter((_, i) => idx !== i);
    onSetLinks(filterData);
  };

  const handleChange = (value, name, idx) => {
    setShowAddMsg(false);
    onSetLinks(links?.map((l, i) => (i === idx ? { ...l, [name]: value } : l)));
  };

  return (
    <div className="mt-6">
      <label className="dark-H head-4 mb-2">Links</label>

      {links?.flatMap((el, idx) => (
        <div key={idx}>
          <div className="flex gap-2 items-center">
            <div className="flex items-start" style={{ width: "100%" }}>
              <div style={{ width: "30%" }}>
                <Dropdown
                  className="phone-select body-N"
                  options={linkOptions}
                  placeholder="Select"
                  value={linkOptions.find((data) => data.value === el.link_category)}
                  onChange={(option) => {
                    handleChange(option.value, "link_category", idx);
                  }}
                />
              </div>

              <input
                className="body-N"
                name="link"
                type="text"
                placeholder="add links"
                style={{ borderRadius: "0px 8px 8px 0px" }}
                value={el.link}
                onChange={(e) => {
                  handleChange(e.target.value, "link", idx);
                }}
              />
            </div>

            {idx === links.length - 1 ? (
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

export default LinkField;

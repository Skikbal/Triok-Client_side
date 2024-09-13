import React, { useState } from "react";
import Plus from "../../assets/svgs/Plus 2.svg";
import Close from "../../assets/svgs/Close 2.svg";

const MultipleInputField = ({ values, onSetValues }) => {
  const [showAddMsg, setShowAddMsg] = useState(false);

  const handleAdd = (el) => {
    if (el === "") {
      setShowAddMsg(true);
    } else {
      setShowAddMsg(false);
      onSetValues([...values, ""]);
    }
  };

  const handleRemove = (idx) => {
    const filterData = values?.filter((_, i) => idx !== i);
    onSetValues(filterData);
  };

  const handleChange = (value, idx) => {
    setShowAddMsg(false);

    const index = values?.findIndex((_, i) => i === idx);
    if (index !== -1) {
      const val = [...values];
      val[index] = value;
      onSetValues(val);
    }
  };

  return (
    <div className="mt-6">
      <label className="dark-H head-4 mb-2">Tenant Name</label>

      {values?.flatMap((el, idx) => (
        <div key={idx}>
          <div className="flex gap-2 items-center">
            <div className="flex items-start" style={{ width: "100%" }}>
              <input
                className="body-N"
                name="name"
                type="text"
                placeholder="write here"
                style={{ borderRadius: "0px 8px 8px 0px" }}
                value={el}
                onChange={(e) => {
                  handleChange(e.target.value, idx);
                }}
              />
            </div>

            {idx === values.length - 1 ? (
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

export default MultipleInputField;

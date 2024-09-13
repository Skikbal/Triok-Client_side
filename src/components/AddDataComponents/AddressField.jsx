import React, { useState } from "react";
import Dropdown from "react-dropdown";
import Plus from "../../assets/svgs/Plus 2.svg";
import Close from "../../assets/svgs/Close 2.svg";
import { addressOptions } from "../../utils/options";

const AddressField = ({ addresses, onSetAddresses, isApt = true }) => {
  const [showAddMsg, setShowAddMsg] = useState(false);

  const handleAdd = (el) => {
    if (isApt) {
      onSetAddresses([...addresses, { address_category: "", address: "", apt_unit_suite: "" }]);
    } else {
      if (el.street === "" || el.street === "" || el.city === "" || el.zip_code === "" || el.address_category === "") {
        setShowAddMsg(true);
      } else {
        setShowAddMsg(false);
        onSetAddresses([...addresses, { address_category: "", street: "", city: "", state: "", zip_code: "" }]);
      }
    }
  };

  const handleRemove = (idx) => {
    const filterData = addresses?.filter((_, i) => idx !== i);
    onSetAddresses(filterData);
  };

  const handleChange = (value, name, idx) => {
    setShowAddMsg(false);

    if (name === "website") {
      if (!value.includes("www.")) {
        value = "www." + value;
      }
    } else if (name === "city") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        return;
      }
    } else if (name === "zip_code") {
      if (!/^\d*$/.test(value)) {
        return;
      }
    } else if (name === "state") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        return;
      }
    }

    // Update the state with the new input value
    onSetAddresses(addresses?.map((l, i) => (i === idx ? { ...l, [name]: value } : l)));
  };

  return (
    <>
      {addresses?.flatMap((el, idx) => (
        <div key={idx} className="mt-6">
          <label className="dark-H head-4 mb-2">Address {idx + 1}</label>
          <div>
            <div className="flex gap-2 items-center">
              <div className="flex items-start" style={{ width: "100%" }}>
                <div style={{ width: "30%" }}>
                  <Dropdown
                    className="phone-select body-N"
                    options={addressOptions}
                    placeholder="Select"
                    value={addressOptions.find((data) => data.value === el.address_category)}
                    onChange={(option) => {
                      handleChange(option.value, "address_category", idx);
                    }}
                  />
                </div>

                {isApt ? (
                  <input
                    className="body-N"
                    name="address"
                    type="text"
                    placeholder="write address here"
                    style={{ borderRadius: "0px 8px 8px 0px" }}
                    value={el.address}
                    onChange={(e) => {
                      setShowAddMsg(false);
                      handleChange(e.target.value, "address", idx);
                    }}
                  />
                ) : (
                  <input
                    className="body-N"
                    name="street"
                    type="text"
                    placeholder="write address here"
                    style={{ borderRadius: "0px 8px 8px 0px" }}
                    value={el.street}
                    onChange={(e) => {
                      handleChange(e.target.value, "street", idx);
                    }}
                  />
                )}
              </div>

              {idx === addresses.length - 1 ? (
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

            {isApt ? (
              <div className="mt-3">
                <label className="dark-H head-4 mb-2">Apt/Unit/Suite</label>
                <input
                  className="body-N"
                  name="apt_unit_suite"
                  type="text"
                  placeholder="optional"
                  value={el.apt_unit_suite}
                  onChange={(e) => {
                    handleChange(e.target.value, "apt_unit_suite", idx);
                  }}
                />
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <input
                  className="body-N"
                  name="city"
                  type="text"
                  placeholder="city"
                  value={el.city}
                  onChange={(e) => {
                    handleChange(e.target.value, "city", idx);
                  }}
                />

                <input
                  className="body-N"
                  name="state"
                  type="text"
                  placeholder="state"
                  value={el.state}
                  onChange={(e) => {
                    handleChange(e.target.value, "state", idx);
                  }}
                />

                <input
                  className="body-N"
                  name="zip_code"
                  type="text"
                  placeholder="zip code"
                  maxLength={6}
                  value={el.zip_code}
                  onChange={(e) => {
                    setShowAddMsg(false);
                    handleChange(e.target.value, "zip_code", idx);
                  }}
                />
              </div>
            )}

            {showAddMsg && <p className="red-D body-S">Please fill all fields first</p>}
          </div>
        </div>
      ))}
    </>
  );
};

export default AddressField;

import React, { useState } from "react";
import Dropdown from "react-dropdown";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import Plus from "../../assets/svgs/Plus 2.svg";
import Close from "../../assets/svgs/Close 2.svg";
import { relationshipOptions } from "../../utils/options";
import { NotificationManager } from "react-notifications";
import SearchDropdown from "../Dropdowns/SearchDropdown";

const RelationshipField = ({ relations, onSetRelations }) => {
  const [config] = useAuth();
  const [showAddMsg, setShowAddMsg] = useState(false);
  const [contactOptions, setContactOptions] = useState([]);

  const fetchContactSuggestions = (inputValue) => {
    if (inputValue !== "") {
      axios
        .get(`${BASE_URL}/get-datalisting?list=contacts&search=${inputValue}`, config)
        .then((res) => {
          const value = res?.data?.data?.contact_list;
          setContactOptions(
            value?.map((data) => ({
              value: data?.id,
              label: `${data?.first_name} ${data?.last_name}`,
            }))
          );
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    } else {
      setContactOptions([]);
    }
  };

  const handleAdd = (el) => {
    if (el.id === "" || el.relation_category === "") {
      setShowAddMsg(true);
    } else {
      setShowAddMsg(false);
      // onSetRelations([...relations, { relation_category: "", email: "" }]);
      onSetRelations([...relations, { relation_category: "", name: "", id: "" }]);
    }
  };

  const handleRemove = (idx) => {
    const filterData = relations?.filter((_, i) => idx !== i);
    onSetRelations(filterData);
  };

  const handleChange = (value, name, idx) => {
    setShowAddMsg(false);
    onSetRelations(relations?.map((l, i) => (i === idx ? { ...l, [name]: value } : l)));
  };

  return (
    <div className="mt-6">
      <label className="dark-H head-4 mb-2">Relationship</label>

      {relations?.flatMap((el, idx) => (
        <div key={idx}>
          <div className="flex gap-2 items-center">
            <div className="flex items-start" style={{ width: "100%" }}>
              <div style={{ width: "30%" }}>
                <Dropdown
                  className="phone-select body-N"
                  options={relationshipOptions}
                  placeholder="Select"
                  value={relationshipOptions.find((data) => data.value === el.relation_category)}
                  onChange={(option) => {
                    handleChange(option.value, "relation_category", idx);
                  }}
                />
              </div>

              {/* <input
                className="body-N"
                name="title"
                type="text"
                placeholder="write name here"
                style={{ borderRadius: "0px 8px 8px 0px" }}
                value={el.email}
                onChange={(e) => {
                  handleChange(e.target.value, "email", idx);
                }}
              /> */}

              <div className="mt-[5px]" style={{ width: "70%" }}>
                <SearchDropdown
                  isTop={false}
                  placeholder="search here"
                  text={el.name}
                  options={contactOptions}
                  fetchSuggestions={fetchContactSuggestions}
                  onSetOptions={(value) => setContactOptions(value)}
                  handleSelect={(option) => {
                    setShowAddMsg(false);
                    onSetRelations(relations?.map((l, i) => (i === idx ? { ...l, name: option?.label, id: option?.value } : l)));
                    setContactOptions([]);
                  }}
                />
              </div>
            </div>

            {idx === relations.length - 1 ? (
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

export default RelationshipField;

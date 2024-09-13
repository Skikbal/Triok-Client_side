import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import low from "../../../assets/svgs/low.svg";
import high from "../../../assets/svgs/high.svg";
import none from "../../../assets/svgs/None.svg";
import { BASE_URL } from "../../../utils/Element";
import medium from "../../../assets/svgs/medium.svg";
import { RiArrowUpSLine as UpArrow } from "react-icons/ri";
import FilterSearchSection from "../../../components/FilterComponents/FilterSearchSection";
import CheckboxSearchOptions from "../../../components/FilterComponents/CheckboxSearchOptions";
import MultiSelectSearchDropdown from "../../../components/Dropdowns/MultiSelectSearchDropdown";

const taskTypeOptions = [
  { label: "T & D", value: "t_d" },
  { label: "New Agent", value: "new_agent" },
  { label: "Real Estate", value: "real_estate" },
  { label: "CA Property", value: "ca_property" },
];

const priorityData = [
  { label: "None", value: "none" },
  { label: "Low", value: "low" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
];

const SmartPlanFilterData = ({ filterData, onSetFilterData, isSidebarOpen }) => {
  const [config] = useAuth();
  const [search, setSearch] = useState("");
  const [contactOptions, setContactOptions] = useState([]);
  const [smartPlanOptions, setSmartPlanOptions] = useState([]);

  useEffect(() => {
    setSearch("");
    setContactOptions([]);
  }, [isSidebarOpen]);

  const fetchSmartPlans = () => {
    axios
      .get(`${BASE_URL}/list`, config)
      .then((res) => {
        const value = res?.data?.smartplan;
        const options = value?.map((el) => ({ value: el?.id, label: el?.name }));
        setSmartPlanOptions(options);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const fetchSuggestions = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=contacts&search=${search}`, config)
      .then((res) => {
        const data = res.data.data.contact_list;
        // const options = data.map((contact) => ({ value: contact.id, label: `${contact.first_name} ${contact.last_name}` }));
        setContactOptions(data);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    if (search !== "") {
      fetchSuggestions();
    } else {
      setContactOptions([]);
    }
  }, [search]);

  useEffect(() => {
    if (isSidebarOpen) {
      fetchSmartPlans();
    }
  }, [isSidebarOpen]);

  const handleChange = (value, name) => {
    onSetFilterData({ ...filterData, [name]: value });
  };

  return (
    <div>
      <div>
        <p className="head-4 dark-H">Contact</p>

        <MultiSelectSearchDropdown
          options={contactOptions}
          search={search}
          onSetSearch={(value) => setSearch(value)}
          selectedData={filterData?.contacts}
          onSetSelectedData={(value) =>
            onSetFilterData({
              ...filterData,
              contacts: value,
            })
          }
        />
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <FilterSearchSection
        type="number"
        title={"Duration Days"}
        placeholder={"write number here.."}
        value={filterData?.duration}
        onChange={(e) => {
          handleChange(e.target.value, "duration");
        }}
      />

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <FilterSearchSection
        type="number"
        title={"Total Touches"}
        placeholder={"write number here.."}
        value={filterData?.touches}
        onChange={(e) => {
          handleChange(e.target.value, "touches");
        }}
      />

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <div className="flex justify-between items-center">
          <p className="head-4 dark-H">Task Type</p>
          {/* <UpArrow /> */}
        </div>

        <div className="mt-4">
          {taskTypeOptions.flatMap((el, i) => (
            <label key={i} className="container flex items-center mb-2">
              <input
                type="checkbox"
                checked={filterData?.task_type?.includes(el.value)}
                onChange={() => {
                  handleChange(el.value, "task_type");
                }}
              />
              <span className="checkmark mr-2"></span>
              <p className="dark-M body-N">{el.label}</p>
            </label>
          ))}
        </div>

        <p role="button" className="dark-M body-N">
          Show More
        </p>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <div className="flex justify-between items-center">
          <p className="head-4 dark-H">Repeating Tasks</p>
          {/* <UpArrow /> */}
        </div>

        <div className="mt-4">
          <label className="container flex items-center">
            <input
              type="checkbox"
              checked={filterData?.repeat_number === "no" ? false : true}
              onChange={(e) => {
                handleChange(e.target.checked ? "yes" : "no", "repeat_number");
              }}
            />
            <span className="checkmark mr-2"></span>
            <p className="dark-M body-N">Repeating Tasks Only</p>
          </label>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <div className="flex justify-between items-center">
          <p className="head-4 dark-H">Priority Level</p>
          {/* <UpArrow /> */}
        </div>

        <div className="mt-4">
          {priorityData.flatMap((el, idx) => (
            <label key={idx} className="container">
              <input
                type="checkbox"
                checked={filterData?.priority?.includes(el.value)}
                onChange={() => {
                  if (filterData?.priority.includes(el.value)) {
                    handleChange(
                      filterData?.priority.filter((item) => item !== el.value),
                      "priority"
                    );
                  } else {
                    handleChange([...filterData?.priority, el.value], "priority");
                  }
                }}
              />
              <span className="checkmark"></span>
              <p className="tags flex items-center gap-2 capitalize dark-M body-XS" style={{ border: "1px solid #6F6F6F" }}>
                {el.label === "Medium" ? <img src={medium} alt="" /> : el.label === "Low" ? <img src={low} alt="" /> : el.label === "High" ? <img src={high} alt="" /> : <img src={none} alt="" />}
                {el.label}
              </p>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <div className="flex justify-between items-center">
          <p className="head-4 dark-H">Link Other Smartplan</p>
          {/* <UpArrow /> */}
        </div>

        <CheckboxSearchOptions
          handleChange={(value) => {
            handleChange(value, "link_other_smartplan");
          }}
          selectedOptions={filterData?.link_other_smartplan}
          options={smartPlanOptions}
        />
      </div>
    </div>
  );
};

export default SmartPlanFilterData;
